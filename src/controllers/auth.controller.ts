import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import * as bcrypt from "bcrypt"
import database from "../config/database.config"
import jwt from 'jsonwebtoken';
import { HttpStatus } from '../utils/httpstatus';
import { SignInProps } from '../models/auth.model';
import { UserAccountProps } from '../models/useraccount.model';

// ================================================================ //
// Sign In                                                          //
// ================================================================ //

export const SignIn = async (req: Request, res: Response): Promise<Response | void> => {
    const { username, password }: SignInProps = req.body as SignInProps;

    try {
        const [dataUser]: RowDataPacket[0] = await database.promise().query<RowDataPacket[]>(
            "SELECT * FROM user_account WHERE username = ?", [username]
        );
        if (!dataUser[0])
            return res.status(HttpStatus.NOT_FOUND.code).send(HttpStatus.NOT_FOUND)

        const match: boolean = await bcrypt.compare(password, dataUser[0].password)
        if (!match)
            return res.status(HttpStatus.NOT_FOUND.code).send(HttpStatus.NOT_FOUND)

        let user_id: string = dataUser[0].user_id
        let email: string = dataUser[0].email
        let name: string = " "

        const accessToken: string = jwt.sign({ user_id, email, name },
            process.env.ACCESS_TOKEN_SECRET || "",
            {
                expiresIn: "1d"
            }
        )

        const refreshToken = jwt.sign({ user_id, email },
            process.env.REFRESH_TOKEN_SECRET || "",
            {
                expiresIn: "1d",
            })

        await database.promise().query<RowDataPacket[]>(
            "UPDATE user_account SET token = ? WHERE user_id = ?", [refreshToken, user_id]
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        })

        const responseData = {
            user_id: user_id,
            email: email,
            access_token: accessToken
        }

        return res.status(HttpStatus.OK.code).json(responseData)
    } catch (error) {
        console.error(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(HttpStatus.INTERNAL_SERVER_ERROR);
    }
};

// ================================================================ //
// Register                                                         //
// ================================================================ //

// export const Testing = async (req: Request, res: Response): Promise<Response | void> => {
//     const data: auth[] = req.body as auth[];

//     const keys = Object.keys(data[0])
//     const columns = keys.join(', ')

//     const values: any[] = data.flatMap(Object.values);
//     const placeholders = data.map(() => `(${keys.map(() => '?').join(', ')})`).join(', ');

//     await database.promise().query<RowDataPacket[]>(`INSERT INTO user_account (${columns}) VALUES ${placeholders}`, values)
//     try {
//         res.status(HttpStatus.CREATED.code).json({ status: "Success created data" })
//     } catch (error) {
//         res.send(HttpStatus.INTERNAL_SERVER_ERROR)
//     }
// }


export const SignUp = async (req: Request, res: Response): Promise<Response | void> => {
    const data: UserAccountProps[] = req.body as UserAccountProps[];
    try {
        const keys = Object.keys(data[0])
        const columns = keys.join(', ')

        const placeholders = data.map(() => `(${keys.map(() => '?').join(', ')})`).join(', ');
        const values: any[] = data.flatMap(Object.values);

        await database.promise().query<RowDataPacket[]>(`INSERT INTO user_account (${columns}) VALUES ${placeholders}`, values)
        res.status(HttpStatus.CREATED.code).json({ status: "Success created data" })
    } catch (error) {
        res.send(HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

// ================================================================ //
// Forget Password                                                  //
// ================================================================ //

// ================================================================ //
// Reset Password                                                   //
// ================================================================ //

// ================================================================ //
// Sign Out                                                         //
// ================================================================ //

const SignOut = async (req: Request, res: Response): Promise<Response | void> => {
    const refreshToken: string = req.cookies.refreshToken
    if (!refreshToken)
        return res.status(HttpStatus.BAD_REQUEST.code)

    const data = await database.promise().query<RowDataPacket[]>("SELECT * FROM user_account WHERE token = ?", [refreshToken]);
    const getData: RowDataPacket[] = data[0];

    await database.promise().query<RowDataPacket[]>("UPDATE user_account SET token = ? WHERE user_id = ?", [getData[0].token, getData[0].user_id])

    res.clearCookie("refreshToken")
    return res.sendStatus(HttpStatus.OK.code)
}
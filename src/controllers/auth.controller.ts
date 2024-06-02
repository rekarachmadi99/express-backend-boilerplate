import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import * as bcrypt from "bcrypt"
import database from "../config/database.config"
import { auth } from '../models/auth.model';
import jwt from 'jsonwebtoken';


const HttpStatus = {
    OK: { code: 200, status: 'OK' },
    CREATED: { code: 201, status: 'CREATED' },
    NO_CONTENT: { code: 204, status: 'NO_CONTENT' },
    BAD_REQUEST: { code: 400, status: 'BAD_REQUEST' },
    NOT_FOUND: { code: 404, status: 'NOT_FOUND' },
    INTERNAL_SERVER_ERROR: { code: 500, status: 'INTERNAL_SERVER_ERROR' }
};

// ================================================================ //
// Sign In                                                          //
// ================================================================ //

export const SignIn = async (req: Request, res: Response): Promise<Response | void> => {
    const { username, password }: auth = req.body as auth;

    try {
        const user = await database.promise().query<RowDataPacket[]>(
            "SELECT * FROM user_account WHERE username = ?", [username]
        );
        const data: RowDataPacket[] = user[0];
        if (!data[0])
            return res.status(HttpStatus.NOT_FOUND.code).send(HttpStatus.NOT_FOUND)

        const match: boolean = await bcrypt.compare(password, data[0].password)
        if (!match)
            return res.status(HttpStatus.NOT_FOUND.code).send(HttpStatus.NOT_FOUND)

        const user_id: string = data[0].user_id
        const email: string = data[0].email
        const name: string = " "

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
            name: name
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

export const SignUp = async (req: Request, res: Response): Promise<Response | void> => {
    const data: auth = req.body as auth;

    res.json(data.email)
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
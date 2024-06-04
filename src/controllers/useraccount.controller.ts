import { Request, Response } from "express";
import database from "../config/database.config";
import { RowDataPacket } from "mysql2";
import { HttpStatus } from "../utils/httpstatus";
import { UserAccountProps } from "../models/useraccount.model";


// Get all user accounts
export const GetAllUserAccount = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const [rows]: RowDataPacket[0] = await database.promise().query<RowDataPacket[]>("SELECT * FROM user_account");
        const userAccounts: UserAccountProps[] = rows as UserAccountProps[];
        return res.status(HttpStatus.OK.code).json(userAccounts);
    } catch (error) {
        console.error(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({ error: "Internal server error" });
    }
}

// Get user account by ID
export const GetUserAccountById = async (req: Request, res: Response): Promise<Response | void> => {
    const id = req.params.id;
    try {
        const [rows]: RowDataPacket[0] = await database.promise().query<RowDataPacket[]>("SELECT * FROM user_account WHERE id = ?", [id]);
        if (rows.length > 0) {
            const userAccount: UserAccountProps = rows[0] as UserAccountProps;
            return res.status(HttpStatus.OK.code).json(userAccount);
        } else {
            return res.status(HttpStatus.NOT_FOUND.code).json({ error: "User account not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({ error: "Internal server error" });
    }
}

// Create a new user account
export const CreateUserAccount = async (req: Request, res: Response): Promise<Response | void> => {
    const {
        userId, email, username, password, accountType, refreshToken,
        createdBy, createdAt, updatedBy, updatedAt
    }: UserAccountProps = req.body;

    try {
        const [result]: any = await database.promise().query(
            `INSERT INTO user_account 
            (userId, email, username, password, accountType, refreshToken, createdBy, createdAt, updatedBy, updatedAt) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, email, username, password, accountType, refreshToken, createdBy, createdAt, updatedBy, updatedAt]
        );
        return res.status(HttpStatus.CREATED.code).json({ id: result.insertId, ...req.body });
    } catch (error) {
        console.error(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({ error: "Internal server error" });
    }
}

// Update an existing user account
export const UpdateUserAccount = async (req: Request, res: Response): Promise<Response | void> => {
    const id = req.params.id;
    const {
        userId, email, username, password, accountType, refreshToken,
        createdBy, createdAt, updatedBy, updatedAt
    }: UserAccountProps = req.body;

    try {
        const [result]: RowDataPacket[0] = await database.promise().query(
            `UPDATE user_account SET 
            userId = ?, email = ?, username = ?, password = ?, accountType = ?, refreshToken = ?, 
            createdBy = ?, createdAt = ?, updatedBy = ?, updatedAt = ? WHERE id = ?`,
            [userId, email, username, password, accountType, refreshToken, createdBy, createdAt, updatedBy, updatedAt, id]
        );
        if (result.affectedRows > 0) {
            return res.status(HttpStatus.OK.code).json({ id, ...req.body });
        } else {
            return res.status(HttpStatus.NOT_FOUND.code).json({ error: "User account not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({ error: "Internal server error" });
    }
}

export const DeleteUserAccount = async (req: Request, res: Response): Promise<Response | void> => {
    const id = req.params.id;
    try {
        const [result]: RowDataPacket[0] = await database.promise().query("DELETE FROM user_account WHERE id = ?", [id]);
        if (result.affectedRows > 0) {
            return res.status(HttpStatus.NO_CONTENT.code).send();
        } else {
            return res.status(HttpStatus.NOT_FOUND.code).json({ error: "User account not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({ error: "Internal server error" });
    }
}

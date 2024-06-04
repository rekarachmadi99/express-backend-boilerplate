import { Request, Response } from "express";
import database from "../config/database.config";
import { RowDataPacket } from "mysql2";
import { HttpStatus } from "../utils/httpstatus";
import { UserProps } from "../models/user.model";

export const GetUser = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const [rows]: RowDataPacket[0] = await database.promise().query<RowDataPacket[]>("SELECT * FROM user");
        const users: UserProps[] = rows as UserProps[];
        return res.status(HttpStatus.OK.code).json(users);
    } catch (error) {
        console.error(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({ error: "Internal server error" });
    }
}

export const GetUserById = async (req: Request, res: Response): Promise<Response | void> => {
    const userId = req.params.id;
    try {
        const [rows]: RowDataPacket[0] = await database.promise().query<RowDataPacket[]>("SELECT * FROM user WHERE id = ?", [userId]);
        if (rows.length > 0) {
            const user: UserProps = rows[0] as UserProps;
            return res.status(HttpStatus.OK.code).json(user);
        } else {
            return res.status(HttpStatus.NOT_FOUND.code).json(HttpStatus.NOT_FOUND);
        }
    } catch (error) {
        console.error(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}


export const CreateUser = async (req: Request, res: Response): Promise<Response | void> => {
    const {
        userId, firstName, middleName, lastName, fullName, initialName, nationality, salutation,
        educationTitle1, educationTitle2, idNumber, birthPlace, birthDate, gender, religion,
        race, dialect, maritalStatus, taxRegisteredName, taxFileNumber, userPhoto,
        createdBy, createdAt, updatedBy, updatedAt
    }: UserProps = req.body;

    try {
        const result: any = await database.promise().query(
            "INSERT INTO user (userId, firstName, middleName, lastName, fullName, initialName, nationality, salutation, educationTitle1, educationTitle2, idNumber, birthPlace, birthDate, gender, religion, race, dialect, maritalStatus, taxRegisteredName, taxFileNumber, userPhoto, createdBy, createdAt, updatedBy, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [userId, firstName, middleName, lastName, fullName, initialName, nationality, salutation, educationTitle1, educationTitle2, idNumber, birthPlace, birthDate, gender, religion, race, dialect, maritalStatus, taxRegisteredName, taxFileNumber, userPhoto, createdBy, createdAt, updatedBy, updatedAt]
        );
        return res.status(HttpStatus.CREATED.code).json({ id: result.insertId, ...req.body });
    } catch (error) {
        console.error(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({ error: "Internal server error" });
    }
}


export const UpdateUser = async (req: Request, res: Response): Promise<Response | void> => {
    const userId = req.params.id;
    const {
        firstName, middleName, lastName, fullName, initialName, nationality, salutation,
        educationTitle1, educationTitle2, idNumber, birthPlace, birthDate, gender, religion,
        race, dialect, maritalStatus, taxRegisteredName, taxFileNumber, userPhoto,
        createdBy, createdAt, updatedBy, updatedAt
    }: UserProps = req.body;

    try {
        const [result]: any = await database.promise().query(
            "UPDATE user SET firstName = ?, middleName = ?, lastName = ?, fullName = ?, initialName = ?, nationality = ?, salutation = ?, educationTitle1 = ?, educationTitle2 = ?, idNumber = ?, birthPlace = ?, birthDate = ?, gender = ?, religion = ?, race = ?, dialect = ?, maritalStatus = ?, taxRegisteredName = ?, taxFileNumber = ?, userPhoto = ?, createdBy = ?, createdAt = ?, updatedBy = ?, updatedAt = ? WHERE userId = ?",
            [firstName, middleName, lastName, fullName, initialName, nationality, salutation, educationTitle1, educationTitle2, idNumber, birthPlace, birthDate, gender, religion, race, dialect, maritalStatus, taxRegisteredName, taxFileNumber, userPhoto, createdBy, createdAt, updatedBy, updatedAt, userId]
        );
        if (result.affectedRows > 0) {
            return res.status(HttpStatus.OK.code).json({ userId, ...req.body });
        } else {
            return res.status(HttpStatus.NOT_FOUND.code).json({ error: "User not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({ error: "Internal server error" });
    }
}


export const DeleteUser = async (req: Request, res: Response): Promise<Response | void> => {
    const userId = req.params.id;
    try {
        const [result]: any = await database.promise().query("DELETE FROM user WHERE userId = ?", [userId]);
        if (result.affectedRows > 0) {
            return res.status(HttpStatus.NO_CONTENT.code).send();
        } else {
            return res.status(HttpStatus.NOT_FOUND.code).json({ error: "User not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({ error: "Internal server error" });
    }
}


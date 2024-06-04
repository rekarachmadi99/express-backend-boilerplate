import express, { Application } from "express";
import { CreateUserAccount, DeleteUserAccount, GetAllUserAccount, GetUserAccountById, UpdateUserAccount } from "../controllers/useraccount.controller";

const UserAccount: Application = express();

UserAccount.get("/useraccount", GetAllUserAccount);
UserAccount.get("/useraccount/:id", GetUserAccountById);
UserAccount.post("/usersaccount", CreateUserAccount);
UserAccount.put("/useraccount/:id", UpdateUserAccount);
UserAccount.delete("/useraccount/:id", DeleteUserAccount);

export default UserAccount
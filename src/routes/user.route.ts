import express, { Application } from "express";
import { CreateUser, DeleteUser, GetUser, GetUserById, UpdateUser } from "../controllers/user.controller";
import JsonWebToken from "../middlewares/jsonwebtoken.middleware";

const User: Application = express();

User.get("/user", JsonWebToken, GetUser);
User.get("/user/:id", GetUserById);
User.post("/user", CreateUser);
User.put("/user/:id", UpdateUser);
User.delete("/user/:id", DeleteUser);

export default User
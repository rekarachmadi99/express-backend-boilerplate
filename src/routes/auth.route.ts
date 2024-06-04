import express, { Application } from "express";
import { SignIn, SignUp } from "../controllers/auth.controller";
const Auth: Application = express();

Auth.get("/SignIn", SignIn);
Auth.get("/", SignUp)
export default Auth
import express, { Application } from "express";
import { SignIn, SignUp } from "../controllers/auth.controller";
const auth: Application = express();

auth.get("/SignIn", SignIn);
auth.get("/", SignUp)
export default auth
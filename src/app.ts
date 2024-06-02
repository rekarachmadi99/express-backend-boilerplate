import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser";
import db from "./config/database.config";
import auth from "./routes/auth.route";

dotenv.config();

const app: Application = express();
const port: number = parseInt(process.env.PORT as string, 10) || 5000;

app.use(cors(
    {
        origin: "*",
        credentials: true
    }
))

app.use(cookieParser())
app.use(express.json())

app.use(auth)

app.listen(port, () => {
    console.log("Success")
})
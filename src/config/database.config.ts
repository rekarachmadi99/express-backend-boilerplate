import { Pool, createPool } from "mysql2";
import dotenv from 'dotenv';

dotenv.config();

const db: Pool = createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string, 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: parseInt(process.env.DB_LIMIT_CONNECTION as string, 10),
});

export default db

import mysql from "mysql2/promise";
import { config } from "./config";

export const database = mysql.createPool({
  ...config.database,
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true,
});

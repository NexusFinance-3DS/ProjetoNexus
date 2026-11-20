import mysql from 'mysql2/promise';
import { configuracao } from "../config/configuracao";
export const bancoDados = mysql.createPool({
  ...configuracao.banco,
  ssl: configuracao.banco.usarTls ? { rejectUnauthorized: true } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true
});

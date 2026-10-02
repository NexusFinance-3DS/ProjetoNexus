import mysql from 'mysql2/promise';
import { configuracao } from "../config/configuracao";
export const bancoDados = mysql.createPool({
  ...configuracao.banco,
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true
});

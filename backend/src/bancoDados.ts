import mysql from 'mysql2/promise';
import { configuracao } from "./configuracao";
export const bancoDados = mysql.createPool({
  ...configuracao.banco,
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true
});

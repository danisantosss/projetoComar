import mysql from "mysql2";
import "dotenv/config";

const urlDB = `mysql://root:lIYdKnlfsYZKCePKPsqRRZLqgFWUWPCn@viaduct.proxy.rlwy.net:26947/railway`
// const dbConfig = {
//   host: process.env.HOST,
//   user: process.env.USER_DB,
//   password: process.env.PASSWORD,
//   database: process.env.DATABASE,
// };

const db = mysql.createConnection(urlDB);

export default db;

import oracledb from "oracledb";
import dotenv from "dotenv";

dotenv.config({ path: './.env' }); // ensure correct path

let connection;

export const connectOracle = async () => {
  try {
    connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER || 'system',
      password: process.env.ORACLE_PASSWORD || '123',
      connectString: process.env.ORACLE_CONNECTION_STRING || 'localhost:1521/XE'
    });
    console.log("Connected to Oracle DB");
    return connection;
  } catch (err) {
    console.error("Oracle connection error:", err);
    throw err; // throw so calling code knows it failed
  }
};

// Always await connectOracle() before using getConnection()
export const getConnection = () => {
  if (!connection) {
    throw new Error("Oracle connection not established yet");
  }
  return connection;
};

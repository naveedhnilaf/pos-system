import { connectOracle, getConnection } from './oracle.js';
import oracledb from 'oracledb';

const testConnection = async () => {
  try {
    await connectOracle(); // must await before calling getConnection
    const conn = getConnection();

    const result = await conn.execute(
      `SELECT SUPPLIER_NAME FROM SUPPLIERS`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    console.log("Suppliers:", result.rows);
    await conn.close();
  } catch (err) {
    console.error("Oracle test failed:", err);
  }
};

testConnection();

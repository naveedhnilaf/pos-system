import { getConnection } from "../db/oracle.js";
import oracledb from "oracledb";

// -------------------- CREATE SUPPLIER storedprocedure--------------------
const createSupplier = async (req, res) => {
    try {
        const { supplierName, supplierEmail, supplierPhone, supplierAddress } = req.body;

        if (!supplierName || !supplierEmail || !supplierPhone || !supplierAddress) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const conn = getConnection();

        await conn.execute(
            `BEGIN add_supplier(:name, :email, :phone, :address); END;`,
            { name: supplierName, email: supplierEmail, phone: supplierPhone, address: supplierAddress },
            { autoCommit: true }
        );

        res.status(201).json({ success: true, message: "Supplier created successfully" });

    } catch (err) {
        console.error("Error creating supplier:", err);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

// -------------------- GET ALL SUPPLIERS storedprocedure--------------------
const getAllSuppliers = async (req, res) => {
    try {
        const conn = getConnection();

        // Execute stored procedure that returns a cursor
        const result = await conn.execute(
            `BEGIN get_all_suppliers(:cursor); END;`,
            { cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
        );

        const cursor = result.outBinds.cursor;
        let rows = [];
        let fetchMore = true;

        // Fetch all rows in batches
        while (fetchMore) {
            const batch = await cursor.getRows(100); // fetch 100 rows at a time
            if (batch.length === 0) {
                fetchMore = false;
            } else {
                rows = rows.concat(batch);
            }
        }

        await cursor.close();

        // Map Oracle columns to frontend-friendly keys
        const suppliers = rows.map(r => ({
            _id: r[0],               // ORACLE SUPPLIER_ID
            supplierName: r[1] ?? "", // SUPPLIER_NAME
            supplierEmail: r[2] ?? "", // SUPPLIER_EMAIL
            supplierPhone: r[3] ?? "", // SUPPLIER_PHONE
            supplierAddress: r[4] ?? "", // SUPPLIER_ADDRESS
            createdAt: r[5] ?? null    // CREATED_AT
        }));

        res.status(200).json({ success: true, suppliers });

    } catch (err) {
        console.error("Error fetching suppliers:", err);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

// -------------------- GET SUPPLIER BY ID storedprocedure--------------------
const getSupplierById = async (req, res) => {
    try {
        const { id } = req.params;
        const conn = getConnection();

        const result = await conn.execute(
            `BEGIN get_supplier_by_id(:id, :cursor); END;`,
            {
                id: Number(id),
                cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
            }
        );

        const rows = await result.outBinds.cursor.getRows();
        await result.outBinds.cursor.close();

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Supplier not found" });
        }

        const row = rows[0];
        const supplier = {
            supplierId: row[0],
            supplierName: row[1],
            supplierEmail: row[2],
            supplierPhone: row[3],
            supplierAddress: row[4],
            createdAt: row[5]
        };

        res.status(200).json({ success: true, supplier });

    } catch (err) {
        console.error("Error fetching supplier by ID:", err);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

// -------------------- UPDATE SUPPLIER storedprocedure--------------------
const updateSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const { supplierName, supplierEmail, supplierPhone, supplierAddress } = req.body;

        const conn = getConnection();

        const result = await conn.execute(
            `BEGIN update_supplier(:id, :name, :email, :phone, :address, :rows); END;`,
            {
                id: Number(id),
                name: supplierName,
                email: supplierEmail,
                phone: supplierPhone,
                address: supplierAddress,
                rows: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
            },
            { autoCommit: true }
        );

        if (result.outBinds.rows === 0) {
            return res.status(404).json({ success: false, message: "Supplier not found" });
        }

        res.status(200).json({ success: true, message: "Supplier updated successfully" });

    } catch (err) {
        console.error("Error updating supplier:", err);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

// -------------------- DELETE SUPPLIER storedprocedure--------------------
const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const conn = getConnection();

        const result = await conn.execute(
            `BEGIN delete_supplier(:id, :rows); END;`,
            {
                id: Number(id),
                rows: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
            },
            { autoCommit: true }
        );

        if (result.outBinds.rows === 0) {
            return res.status(404).json({ success: false, message: "Supplier not found" });
        }

        res.status(200).json({ success: true, message: "Supplier deleted successfully" });

    } catch (err) {
        console.error("Error deleting supplier:", err);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

export { createSupplier, getAllSuppliers, getSupplierById, updateSupplier, deleteSupplier };

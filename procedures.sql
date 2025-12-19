--------------------------------------------------------
--  File created - Friday-December-19-2025   
--------------------------------------------------------
--------------------------------------------------------
--  DDL for Procedure DELETE_SUPPLIER
--------------------------------------------------------
set define off;

  CREATE OR REPLACE NONEDITIONABLE PROCEDURE "SYSTEM"."DELETE_SUPPLIER" (
    p_id IN NUMBER,
    p_rows OUT NUMBER
) AS
BEGIN
    DELETE FROM suppliers WHERE supplier_id = p_id;
    p_rows := SQL%ROWCOUNT;
    COMMIT;
END;

/
--------------------------------------------------------
--  DDL for Procedure GET_ALL_SUPPLIERS
--------------------------------------------------------
set define off;

  CREATE OR REPLACE NONEDITIONABLE PROCEDURE "SYSTEM"."GET_ALL_SUPPLIERS" (p_cursor OUT SYS_REFCURSOR) AS
BEGIN
    OPEN p_cursor FOR
        SELECT supplier_id, supplier_name, supplier_email, supplier_phone, supplier_address, created_at
        FROM suppliers;
END;

/
--------------------------------------------------------
--  DDL for Procedure UPDATE_SUPPLIER
--------------------------------------------------------
set define off;

  CREATE OR REPLACE NONEDITIONABLE PROCEDURE "SYSTEM"."UPDATE_SUPPLIER" (
    p_id IN NUMBER,
    p_name IN VARCHAR2,
    p_email IN VARCHAR2,
    p_phone IN VARCHAR2,
    p_address IN VARCHAR2,
    p_rows OUT NUMBER
) AS
BEGIN
    UPDATE suppliers
    SET supplier_name = p_name,
        supplier_email = p_email,
        supplier_phone = p_phone,
        supplier_address = p_address
    WHERE supplier_id = p_id;

    p_rows := SQL%ROWCOUNT;
    COMMIT;
END;

/
--------------------------------------------------------
--  DDL for Procedure GET_SUPPLIER_BY_ID
--------------------------------------------------------
set define off;

  CREATE OR REPLACE NONEDITIONABLE PROCEDURE "SYSTEM"."GET_SUPPLIER_BY_ID" (
    p_id IN NUMBER,
    p_cursor OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_cursor FOR
        SELECT supplier_id, supplier_name, supplier_email, supplier_phone, supplier_address, created_at
        FROM suppliers
        WHERE supplier_id = p_id;
END;

/
--------------------------------------------------------
--  DDL for Procedure ADD_SUPPLIER
--------------------------------------------------------
set define off;

  CREATE OR REPLACE NONEDITIONABLE PROCEDURE "SYSTEM"."ADD_SUPPLIER" (
    p_name IN VARCHAR2,
    p_email IN VARCHAR2,
    p_phone IN VARCHAR2,
    p_address IN VARCHAR2
) AS
BEGIN
    INSERT INTO suppliers (supplier_name, supplier_email, supplier_phone, supplier_address, created_at)
    VALUES (p_name, p_email, p_phone, p_address, SYSTIMESTAMP);
    COMMIT;
END;

/

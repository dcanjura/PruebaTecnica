IF DB_ID(N'product_manager') IS NULL
BEGIN
    CREATE DATABASE product_manager;
END;
GO

USE product_manager;
GO

IF OBJECT_ID(N'dbo.users', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.users (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL,
        CONSTRAINT CK_users_role CHECK (role IN ('USER', 'ADMIN'))
    );
END;
GO

IF OBJECT_ID(N'dbo.products', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.products (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        description VARCHAR(500) NOT NULL,
        price DECIMAL(12,2) NOT NULL,
        stock INT NOT NULL,
        type VARCHAR(80) NOT NULL,
        CONSTRAINT CK_products_price CHECK (price > 0),
        CONSTRAINT CK_products_stock CHECK (stock >= 0)
    );
END;
GO

CREATE DATABASE IF NOT EXISTS employee_management;
USE employee_management;

CREATE TABLE IF NOT EXISTS employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(25),
    department VARCHAR(80) NOT NULL,
    job_title VARCHAR(100) NOT NULL,
    salary DECIMAL(12,2) NOT NULL DEFAULT 0,
    hire_date DATE NOT NULL,
    status ENUM('Active','On Leave','Inactive') NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO employees (full_name,email,phone,department,job_title,salary,hire_date,status) VALUES
('Aarav Sharma','aarav.sharma@example.com','9876501001','Engineering','Software Engineer',65000,'2024-04-15','Active'),
('Priya Verma','priya.verma@example.com','9876501002','Human Resources','HR Executive',48000,'2023-11-06','Active'),
('Rohan Singh','rohan.singh@example.com','9876501003','Finance','Accountant',52000,'2024-01-22','On Leave'),
('Ananya Gupta','ananya.gupta@example.com','9876501004','Marketing','Marketing Associate',45000,'2025-02-10','Active');

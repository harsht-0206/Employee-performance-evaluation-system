# PeopleDesk — Employee Management System

A responsive Java web application for managing employee records. Built with **HTML, CSS, JavaScript, JSP, Java Servlets, JDBC, MySQL, Maven and Apache Tomcat**.

## Features

- Dashboard with total employees, active employees and department counts
- Add, view, search, edit and delete employee records (CRUD)
- Employee details include name, email, phone, department, job title, salary, joining date and status
- Responsive interface for desktop and mobile
- Prepared SQL statements for database operations
- Form validation and duplicate-email handling

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript, JSP |
| Backend | Java 17, Jakarta Servlets 6 |
| Database | MySQL 8+ |
| Database connectivity | JDBC / MySQL Connector/J |
| Build | Maven |
| Server | Apache Tomcat 10.1+ |

## Requirements

Install:
1. JDK 17 or later
2. MySQL Server and MySQL Workbench (optional, but useful)
3. Apache Maven
4. Apache Tomcat 10.1 or later
5. VS Code with Java Extension Pack (or another Java IDE)

> This project uses Jakarta Servlet APIs, so use Tomcat 10.1+. It is not compatible with Tomcat 9 without changing the servlet imports/dependencies.

## Setup

### 1. Create the database

Open MySQL Workbench or a MySQL terminal and run the SQL in `database/employee_management.sql`. It creates the `employee_management` database, the `employees` table and four sample rows.

### 2. Configure MySQL credentials

Open:

`src/main/java/com/ems/util/DBConnection.java`

Update `USER` and `PASSWORD` for your local MySQL installation. Example:

```java
private static final String USER = "root";
private static final String PASSWORD = "your_local_mysql_password";
```

Never commit a real database password to a public repository. For a real deployment, read credentials from environment variables or a secret manager.

### 3. Build the project

From the root project folder, run:

```bash
mvn clean package
```

Maven downloads the required libraries and creates:

`target/employee-management-system.war`

### 4. Run with Tomcat

1. Start Apache Tomcat 10.1.
2. Copy `target/employee-management-system.war` into Tomcat's `webapps` folder.
3. Start/restart Tomcat.
4. Open `http://localhost:8080/employee-management-system/employees`

The default Tomcat port is usually 8080. If yours differs, change the URL accordingly.

### 5. Use the app

- Click **Add employee** to create a record.
- Use the search box to find employees by name, email or department.
- Use the pencil icon to edit a record.
- Use the delete icon to remove a record after confirmation.

## Project structure

```text
Employee-Management-System/
├── database/
│   └── employee_management.sql
├── src/main/java/com/ems/
│   ├── dao/EmployeeDAO.java
│   ├── model/Employee.java
│   ├── servlet/EmployeeServlet.java
│   └── util/DBConnection.java
├── src/main/webapp/
│   ├── assets/
│   │   ├── css/style.css
│   │   └── js/app.js
│   ├── WEB-INF/web.xml
│   └── index.jsp
├── .gitignore
├── pom.xml
└── README.md
```

## CRUD operations

| Operation | How it works |
|---|---|
| Create | Employee form submits to the servlet and DAO inserts the record |
| Read | Servlet loads records and dashboard counts from MySQL |
| Update | Edit form submits employee ID and updated details |
| Delete | Delete action removes the selected employee after confirmation |

## Troubleshooting

- **Access denied for user:** check MySQL username and password in `DBConnection.java`.
- **Unknown database:** run `database/employee_management.sql`.
- **Communications link failure:** make sure the MySQL service is running and port 3306 is correct.
- **404 page:** check that the WAR deployed successfully and the URL includes `/employee-management-system/employees`.
- **Java or Maven not found:** install JDK/Maven and configure `JAVA_HOME` and `PATH`.
- **Port already in use:** stop the other service or configure a different port.

## GitHub upload

1. Create a new repository on GitHub named `employee-management-system`.
2. Do not initialize it with a second README if you already have this project's README.
3. Open a terminal in the project root and run:

```bash
git init
git add .
git commit -m "Initial commit: Employee Management System"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/employee-management-system.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. Never upload passwords, database dumps containing private information, or generated `target/` build files.

## Scope and production notes

This is an educational starter project. Before using it for real employee data, add authentication and role-based authorization, CSRF protection, stronger server-side validation, secure externalized secrets, audit logs, pagination and production error handling. Do not expose salary or personal information publicly.

## License

For educational use. Add a license if you want to define reuse terms.

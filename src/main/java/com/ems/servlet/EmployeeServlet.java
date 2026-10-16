package com.ems.servlet;

import com.ems.dao.EmployeeDAO;
import com.ems.model.Employee;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Date;
import java.sql.SQLException;

@WebServlet("/employees")
public class EmployeeServlet extends HttpServlet {
    private final EmployeeDAO dao = new EmployeeDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        try {
            String search = request.getParameter("search");
            request.setAttribute("employees", dao.findAll(search));
            request.setAttribute("totalEmployees", dao.countAll());
            request.setAttribute("activeEmployees", dao.countActive());
            request.setAttribute("departmentCount", dao.countDepartments());
            request.setAttribute("search", search == null ? "" : search);
            request.getRequestDispatcher("/index.jsp").forward(request, response);
        } catch (SQLException e) {
            throw new ServletException("Could not load employees. Check your MySQL connection and database setup.", e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        String action = request.getParameter("action");
        try {
            if ("delete".equals(action)) {
                dao.delete(Integer.parseInt(request.getParameter("id")));
                request.getSession().setAttribute("flash", "Employee deleted successfully.");
            } else if ("save".equals(action)) {
                Employee e = new Employee();
                String id = request.getParameter("id");
                e.setFullName(required(request, "fullName"));
                e.setEmail(required(request, "email"));
                e.setPhone(request.getParameter("phone"));
                e.setDepartment(required(request, "department"));
                e.setJobTitle(required(request, "jobTitle"));
                e.setSalary(new BigDecimal(required(request, "salary")));
                e.setHireDate(Date.valueOf(required(request, "hireDate")));
                String status = request.getParameter("status");
                e.setStatus(status == null || status.isBlank() ? "Active" : status);
                if (id == null || id.isBlank()) {
                    dao.insert(e);
                    request.getSession().setAttribute("flash", "Employee added successfully.");
                } else {
                    e.setId(Integer.parseInt(id));
                    dao.update(e);
                    request.getSession().setAttribute("flash", "Employee updated successfully.");
                }
            }
            response.sendRedirect(request.getContextPath() + "/employees");
        } catch (IllegalArgumentException ex) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Please check the employee form values.");
        } catch (SQLException e) {
            if ("23000".equals(e.getSQLState())) {
                response.sendError(HttpServletResponse.SC_CONFLICT, "That email address is already registered.");
            } else {
                throw new ServletException("Could not save employee.", e);
            }
        }
    }

    private String required(HttpServletRequest request, String name) {
        String value = request.getParameter(name);
        if (value == null || value.isBlank()) throw new IllegalArgumentException("Missing " + name);
        return value.trim();
    }
}

package com.ems.dao;

import com.ems.model.Employee;
import com.ems.util.DBConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class EmployeeDAO {
    public List<Employee> findAll(String search) throws SQLException {
        List<Employee> list = new ArrayList<>();
        String sql = "SELECT * FROM employees WHERE full_name LIKE ? OR email LIKE ? OR department LIKE ? ORDER BY id DESC";
        try (Connection c = DBConnection.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            String q = "%" + (search == null ? "" : search.trim()) + "%";
            ps.setString(1, q); ps.setString(2, q); ps.setString(3, q);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) list.add(map(rs));
            }
        }
        return list;
    }

    public Employee findById(int id) throws SQLException {
        String sql = "SELECT * FROM employees WHERE id=?";
        try (Connection c = DBConnection.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) { return rs.next() ? map(rs) : null; }
        }
    }

    public void insert(Employee e) throws SQLException {
        String sql = "INSERT INTO employees(full_name,email,phone,department,job_title,salary,hire_date,status) VALUES(?,?,?,?,?,?,?,?)";
        try (Connection c = DBConnection.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            bind(ps, e); ps.executeUpdate();
        }
    }

    public void update(Employee e) throws SQLException {
        String sql = "UPDATE employees SET full_name=?,email=?,phone=?,department=?,job_title=?,salary=?,hire_date=?,status=? WHERE id=?";
        try (Connection c = DBConnection.getConnection(); PreparedStatement ps = c.prepareStatement(sql)) {
            bind(ps, e); ps.setInt(9, e.getId()); ps.executeUpdate();
        }
    }

    public void delete(int id) throws SQLException {
        try (Connection c = DBConnection.getConnection(); PreparedStatement ps = c.prepareStatement("DELETE FROM employees WHERE id=?")) {
            ps.setInt(1, id); ps.executeUpdate();
        }
    }

    public int countAll() throws SQLException { return count("SELECT COUNT(*) FROM employees"); }
    public int countActive() throws SQLException { return count("SELECT COUNT(*) FROM employees WHERE status='Active'"); }
    public int countDepartments() throws SQLException { return count("SELECT COUNT(DISTINCT department) FROM employees"); }

    private int count(String sql) throws SQLException {
        try (Connection c = DBConnection.getConnection(); Statement st = c.createStatement(); ResultSet rs = st.executeQuery(sql)) {
            rs.next(); return rs.getInt(1);
        }
    }

    private void bind(PreparedStatement ps, Employee e) throws SQLException {
        ps.setString(1, e.getFullName()); ps.setString(2, e.getEmail()); ps.setString(3, e.getPhone());
        ps.setString(4, e.getDepartment()); ps.setString(5, e.getJobTitle()); ps.setBigDecimal(6, e.getSalary());
        ps.setDate(7, e.getHireDate()); ps.setString(8, e.getStatus());
    }

    private Employee map(ResultSet rs) throws SQLException {
        Employee e = new Employee();
        e.setId(rs.getInt("id")); e.setFullName(rs.getString("full_name")); e.setEmail(rs.getString("email"));
        e.setPhone(rs.getString("phone")); e.setDepartment(rs.getString("department")); e.setJobTitle(rs.getString("job_title"));
        e.setSalary(rs.getBigDecimal("salary")); e.setHireDate(rs.getDate("hire_date")); e.setStatus(rs.getString("status"));
        return e;
    }
}

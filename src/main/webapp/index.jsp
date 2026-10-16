<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.util.List,com.ems.model.Employee,java.text.NumberFormat,java.util.Locale" %>
<%!
  private String esc(Object value) {
    if (value == null) return "";
    return value.toString().replace("&","&amp;").replace("<","&lt;").replace(">","&gt;").replace("\"","&quot;").replace("'","&#39;");
  }
%>
<%
  List<Employee> employees = (List<Employee>) request.getAttribute("employees");
  NumberFormat currency = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));
  String flash = (String) session.getAttribute("flash");
  session.removeAttribute("flash");
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>PeopleDesk | Employee Management</title>
  <link rel="stylesheet" href="<%=request.getContextPath()%>/assets/css/style.css">
</head>
<body>
<div class="app-shell">
  <aside class="sidebar">
    <a class="brand" href="<%=request.getContextPath()%>/employees"><span class="brand-mark">P</span><span>PeopleDesk<small>PEOPLE OPERATIONS</small></span></a>
    <p class="nav-label">WORKSPACE</p>
    <a class="nav-link active" href="<%=request.getContextPath()%>/employees"><span>▦</span> Dashboard</a>
    <a class="nav-link" href="#employeeTable"><span>♙</span> Employees</a>
    <div class="sidebar-bottom"><div class="avatar">AD</div><div><strong>Admin User</strong><small>Administrator</small></div></div>
  </aside>

  <main class="main-content">
    <header class="topbar"><div><p class="eyebrow">OVERVIEW</p><h1>Employee dashboard</h1></div><button class="primary-btn" id="addEmployeeBtn">＋ Add employee</button></header>
    <% if (flash != null) { %><div class="flash"><%=esc(flash)%></div><% } %>
    <section class="welcome"><div><p class="eyebrow light">PEOPLE AT A GLANCE</p><h2>Good work starts with great people.</h2><p>Manage your team details in one simple workspace.</p></div><div class="welcome-icon">♙</div></section>

    <section class="stats-grid">
      <article class="stat-card"><div class="stat-icon purple">♙</div><p>Total employees</p><strong><%=request.getAttribute("totalEmployees")%></strong><small>All employee records</small></article>
      <article class="stat-card"><div class="stat-icon green">✓</div><p>Active employees</p><strong><%=request.getAttribute("activeEmployees")%></strong><small>Currently active</small></article>
      <article class="stat-card"><div class="stat-icon orange">▦</div><p>Departments</p><strong><%=request.getAttribute("departmentCount")%></strong><small>Across the organization</small></article>
    </section>

    <section class="panel" id="employeeTable">
      <div class="panel-heading"><div><h2>Employee directory</h2><p>View and manage your employee records.</p></div>
        <form class="search-form" method="get" action="<%=request.getContextPath()%>/employees"><input name="search" value="<%=esc(request.getAttribute("search"))%>" placeholder="Search name, email, department..." aria-label="Search employees"><button class="secondary-btn" type="submit">Search</button></form>
      </div>
      <div class="table-wrap"><table><thead><tr><th>EMPLOYEE</th><th>DEPARTMENT</th><th>JOB TITLE</th><th>JOINED</th><th>SALARY</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>
      <% if (employees == null || employees.isEmpty()) { %><tr><td colspan="7" class="empty">No employees found. Add an employee or change your search.</td></tr><% } else { for (Employee e : employees) { %>
        <tr>
          <td><div class="person"><div class="person-avatar"><%=esc(e.getFullName().substring(0,1).toUpperCase())%></div><div><strong><%=esc(e.getFullName())%></strong><small><%=esc(e.getEmail())%></small></div></div></td>
          <td><%=esc(e.getDepartment())%></td><td><%=esc(e.getJobTitle())%></td><td><%=esc(e.getHireDate())%></td>
          <td><%=currency.format(e.getSalary())%></td><td><span class="status <%=e.getStatus().toLowerCase().replace(" ","-")%>"><%=esc(e.getStatus())%></span></td>
          <td><div class="actions"><button class="icon-btn edit-btn" title="Edit employee" data-id="<%=e.getId()%>" data-name="<%=esc(e.getFullName())%>" data-email="<%=esc(e.getEmail())%>" data-phone="<%=esc(e.getPhone())%>" data-department="<%=esc(e.getDepartment())%>" data-job-title="<%=esc(e.getJobTitle())%>" data-salary="<%=e.getSalary()%>" data-hire-date="<%=e.getHireDate()%>" data-status="<%=esc(e.getStatus())%>">✎</button>
          <form method="post" action="<%=request.getContextPath()%>/employees" onsubmit="return confirm('Delete this employee record?');"><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<%=e.getId()%>"><button class="icon-btn delete" title="Delete employee" type="submit">⌫</button></form></div></td>
        </tr>
      <% }} %>
      </tbody></table></div>
      <div class="table-footer">Showing <strong><%=employees == null ? 0 : employees.size()%></strong> employee record(s)</div>
    </section>
    <footer>PeopleDesk · Employee Management System <span>Built with Java, JDBC &amp; MySQL</span></footer>
  </main>
</div>

<div class="modal-backdrop" id="employeeModal" aria-hidden="true">
  <section class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
    <div class="modal-heading"><div><p class="eyebrow">EMPLOYEE RECORD</p><h2 id="modalTitle">Add employee</h2></div><button class="close-btn" id="closeModal" aria-label="Close dialog">×</button></div>
    <form id="employeeForm" method="post" action="<%=request.getContextPath()%>/employees">
      <input type="hidden" name="action" value="save"><input type="hidden" name="id" id="employeeId">
      <div class="form-grid">
        <label>Full name *<input name="fullName" id="fullName" required maxlength="120" placeholder="e.g. Aditi Sharma"></label>
        <label>Email address *<input type="email" name="email" id="email" required maxlength="150" placeholder="name@company.com"></label>
        <label>Phone<input name="phone" id="phone" maxlength="25" placeholder="+91 98765 43210"></label>
        <label>Department *<select name="department" id="department" required><option value="">Select department</option><option>Engineering</option><option>Human Resources</option><option>Finance</option><option>Marketing</option><option>Sales</option><option>Operations</option><option>Design</option></select></label>
        <label>Job title *<input name="jobTitle" id="jobTitle" required maxlength="100" placeholder="e.g. Software Engineer"></label>
        <label>Monthly salary (₹) *<input type="number" name="salary" id="salary" required min="0" step="0.01" placeholder="50000"></label>
        <label>Date joined *<input type="date" name="hireDate" id="hireDate" required></label>
        <label>Status<select name="status" id="status"><option>Active</option><option>On Leave</option><option>Inactive</option></select></label>
      </div>
      <p class="form-note">Fields marked * are required. Employee email addresses must be unique.</p>
      <div class="modal-actions"><button type="button" class="secondary-btn" id="cancelModal">Cancel</button><button type="submit" class="primary-btn">Save employee</button></div>
    </form>
  </section>
</div>
<script src="<%=request.getContextPath()%>/assets/js/app.js"></script>
</body></html>

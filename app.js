(() => {
  const STORAGE_KEY = "peopledesk-demo-employees-v1";
  const initialEmployees = [
    {id:1,name:"Aarav Sharma",email:"aarav.sharma@example.com",phone:"9876501001",department:"Engineering",jobTitle:"Software Engineer",salary:65000,hireDate:"2024-04-15",status:"Active"},
    {id:2,name:"Priya Verma",email:"priya.verma@example.com",phone:"9876501002",department:"Human Resources",jobTitle:"HR Executive",salary:48000,hireDate:"2023-11-06",status:"Active"},
    {id:3,name:"Rohan Singh",email:"rohan.singh@example.com",phone:"9876501003",department:"Finance",jobTitle:"Accountant",salary:52000,hireDate:"2024-01-22",status:"On Leave"},
    {id:4,name:"Ananya Gupta",email:"ananya.gupta@example.com",phone:"9876501004",department:"Marketing",jobTitle:"Marketing Associate",salary:45000,hireDate:"2025-02-10",status:"Active"},
    {id:5,name:"Kabir Mehta",email:"kabir.mehta@example.com",phone:"9876501005",department:"Engineering",jobTitle:"QA Engineer",salary:56000,hireDate:"2024-08-19",status:"Inactive"},
    {id:6,name:"Meera Nair",email:"meera.nair@example.com",phone:"9876501006",department:"Design",jobTitle:"UI/UX Designer",salary:59000,hireDate:"2025-01-06",status:"Active"}
  ];
  const $ = id => document.getElementById(id);
  let employees = loadEmployees();
  let activeView = "dashboard";
  let toastTimer;

  function loadEmployees() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : structuredClone(initialEmployees);
    } catch { return initialEmployees.map(e => ({...e})); }
  }
  function saveEmployees() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(employees)); }
    catch { showToast("Could not save in this browser. Check browser storage settings."); }
  }
  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  }
  function money(value) {
    return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(Number(value)||0);
  }
  function niceDate(value) {
    if (!value) return "—";
    const date = new Date(value + "T00:00:00");
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
  }
  function showToast(message) {
    const toast = $("toast"); toast.textContent = message; toast.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }
  function render() {
    $("totalCount").textContent = employees.length;
    $("activeCount").textContent = employees.filter(e => e.status === "Active").length;
    $("departmentCount").textContent = new Set(employees.map(e => e.department)).size;
    $("leaveCount").textContent = employees.filter(e => e.status === "On Leave").length;
    const query = $("searchInput").value.trim().toLowerCase();
    const status = $("statusFilter").value;
    const filtered = employees.filter(e => {
      const matchesText = [e.name,e.email,e.department,e.jobTitle].some(v => String(v||"").toLowerCase().includes(query));
      return matchesText && (!status || e.status === status);
    });
    $("recordCount").textContent = `Showing ${filtered.length} of ${employees.length} employee record${employees.length===1?"":"s"}`;
    $("employeeRows").innerHTML = filtered.length ? filtered.map(e => `
      <tr>
        <td><div class="person"><div class="person-avatar">${escapeHTML((e.name||"?").trim().charAt(0).toUpperCase())}</div><div><strong>${escapeHTML(e.name)}</strong><small>${escapeHTML(e.email)}</small></div></div></td>
        <td>${escapeHTML(e.department)}</td><td>${escapeHTML(e.jobTitle)}</td><td>${niceDate(e.hireDate)}</td><td>${money(e.salary)}</td>
        <td><span class="status ${e.status.toLowerCase().replaceAll(" ","-")}">${escapeHTML(e.status)}</span></td>
        <td><div class="actions"><button class="icon-btn edit-btn" data-id="${e.id}" aria-label="Edit ${escapeHTML(e.name)}" title="Edit">✎</button><button class="icon-btn delete delete-btn" data-id="${e.id}" aria-label="Delete ${escapeHTML(e.name)}" title="Delete">⌫</button></div></td>
      </tr>`).join("") : `<tr><td colspan="7" class="empty">No employees found. Try another search or add an employee.</td></tr>`;
    renderDepartments();
  }
  function renderDepartments() {
    const counts = {};
    employees.forEach(e => counts[e.department] = (counts[e.department] || 0) + 1);
    const entries = Object.entries(counts).sort((a,b) => a[0].localeCompare(b[0]));
    const max = Math.max(1,...entries.map(x=>x[1]));
    $("departmentGrid").innerHTML = entries.length ? entries.map(([name,count]) => `<article class="dept-card"><h3>${escapeHTML(name)}</h3><p>${count} employee${count===1?"":"s"}</p><div class="dept-number">${count}</div><div class="dept-bar"><span style="width:${Math.round(count/max*100)}%"></span></div></article>`).join("") : `<p class="empty">No departments yet. Add an employee to get started.</p>`;
  }
  function setView(view) {
    activeView = view;
    document.querySelectorAll(".nav-item").forEach(b => b.classList.toggle("active",b.dataset.view===view));
    $("hero").classList.toggle("hidden",view!=="dashboard");
    $("stats").classList.toggle("hidden",false);
    $("employeePanel").classList.toggle("hidden",view==="departments");
    $("departmentPanel").classList.toggle("hidden",view!=="departments");
    $("pageTitle").textContent = view==="dashboard" ? "Employee dashboard" : view==="employees" ? "Employees" : "Departments";
    $("pageEyebrow").textContent = view==="dashboard" ? "OVERVIEW" : "WORKSPACE";
    $("tableTitle").textContent = view==="employees" ? "All employees" : "Employee directory";
    $("tableSubtitle").textContent = view==="employees" ? "Search, filter and manage every employee." : "View and manage your employee records.";
  }
  function openModal(employee) {
    $("employeeForm").reset();
    $("employeeId").value = employee ? employee.id : "";
    $("modalTitle").textContent = employee ? "Edit employee" : "Add employee";
    if (employee) {
      $("fullName").value=employee.name; $("email").value=employee.email; $("phone").value=employee.phone||"";
      $("department").value=employee.department; $("jobTitle").value=employee.jobTitle; $("salary").value=employee.salary;
      $("hireDate").value=employee.hireDate; $("status").value=employee.status;
    } else {
      $("status").value="Active"; $("hireDate").value=new Date().toISOString().slice(0,10);
    }
    $("modalBackdrop").classList.add("open"); $("modalBackdrop").setAttribute("aria-hidden","false");
    document.body.style.overflow="hidden"; $("fullName").focus();
  }
  function closeModal() {
    $("modalBackdrop").classList.remove("open"); $("modalBackdrop").setAttribute("aria-hidden","true");
    document.body.style.overflow="";
  }
  $("addBtn").addEventListener("click",()=>openModal(null));
  $("closeModal").addEventListener("click",closeModal);
  $("cancelBtn").addEventListener("click",closeModal);
  $("modalBackdrop").addEventListener("click",e=>{if(e.target===$("modalBackdrop"))closeModal();});
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();});
  document.querySelectorAll(".nav-item").forEach(button=>button.addEventListener("click",()=>setView(button.dataset.view)));
  $("searchInput").addEventListener("input",render);
  $("statusFilter").addEventListener("change",render);
  $("employeeRows").addEventListener("click",e=>{
    const edit=e.target.closest(".edit-btn"), del=e.target.closest(".delete-btn");
    if(edit) {
      const employee=employees.find(x=>x.id===Number(edit.dataset.id));
      if(employee)openModal(employee);
    }
    if(del) {
      const employee=employees.find(x=>x.id===Number(del.dataset.id));
      if(employee && confirm(`Delete ${employee.name} from this demo?`)) {
        employees=employees.filter(x=>x.id!==employee.id); saveEmployees(); render(); showToast("Employee deleted.");
      }
    }
  });
  $("employeeForm").addEventListener("submit",e=>{
    e.preventDefault();
    const id=$("employeeId").value;
    const email=$("email").value.trim().toLowerCase();
    if(employees.some(x=>x.email.toLowerCase()===email && String(x.id)!==id)) {
      showToast("That email address is already in the demo."); $("email").focus(); return;
    }
    const employee={id:id?Number(id):Math.max(0,...employees.map(x=>x.id))+1,name:$("fullName").value.trim(),email,phone:$("phone").value.trim(),department:$("department").value,jobTitle:$("jobTitle").value.trim(),salary:Number($("salary").value),hireDate:$("hireDate").value,status:$("status").value};
    if(!employee.name||!employee.email||!employee.department||!employee.jobTitle||!employee.hireDate||employee.salary<0) {showToast("Please complete all required fields.");return;}
    if(id) {employees=employees.map(x=>x.id===Number(id)?employee:x);showToast("Employee updated.");}
    else {employees.push(employee);showToast("Employee added.");}
    saveEmployees(); render(); closeModal();
  });
  $("resetBtn").addEventListener("click",()=>{
    if(confirm("Reset the demo to its original sample employees? Your changes in this browser will be lost.")) {
      employees=initialEmployees.map(e=>({...e}));saveEmployees();$("searchInput").value="";$("statusFilter").value="";render();showToast("Demo data reset.");
    }
  });
  render();
})();
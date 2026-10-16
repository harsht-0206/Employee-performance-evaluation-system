(() => {
  const modal = document.getElementById('employeeModal');
  const form = document.getElementById('employeeForm');
  const title = document.getElementById('modalTitle');
  const fields = ['employeeId','fullName','email','phone','department','jobTitle','salary','hireDate','status'];

  function openModal(employee = null) {
    form.reset();
    document.getElementById('employeeId').value = '';
    title.textContent = employee ? 'Edit employee' : 'Add employee';
    if (employee) {
      const map = {
        employeeId: employee.id, fullName: employee.name, email: employee.email,
        phone: employee.phone, department: employee.department, jobTitle: employee.jobTitle,
        salary: employee.salary, hireDate: employee.hireDate, status: employee.status
      };
      Object.entries(map).forEach(([id, value]) => {
        const input = document.getElementById(id);
        if (input) input.value = value || '';
      });
    } else {
      document.getElementById('status').value = 'Active';
      document.getElementById('hireDate').value = new Date().toISOString().slice(0, 10);
    }
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.getElementById('fullName').focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.getElementById('addEmployeeBtn').addEventListener('click', () => openModal());
  document.getElementById('closeModal').addEventListener('click', closeModal);
  document.getElementById('cancelModal').addEventListener('click', closeModal);
  modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

  document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', () => openModal({
      id: button.dataset.id, name: button.dataset.name, email: button.dataset.email,
      phone: button.dataset.phone, department: button.dataset.department,
      jobTitle: button.dataset.jobTitle, salary: button.dataset.salary,
      hireDate: button.dataset.hireDate, status: button.dataset.status
    }));
  });

  form.addEventListener('submit', event => {
    const salary = Number(document.getElementById('salary').value);
    if (!Number.isFinite(salary) || salary < 0) {
      event.preventDefault();
      alert('Please enter a valid non-negative salary.');
    }
  });
})();
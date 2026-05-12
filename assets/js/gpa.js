document.addEventListener('DOMContentLoaded', () => {

      if (!localStorage.getItem("currentUser")) {
    window.location.href = "login.html";
    return;
}
  

  // ============ GET USER BY EMAIL ============
function getUserByEmail(email) {

  let users =
    JSON.parse(
      localStorage.getItem("users")
    ) || [];

  const foundUser =
    users.find(
      user => user.email === email
    );

  if (foundUser) {

    return {
      status: "success",
      user: foundUser
    };

  }

  return {
    status: "error",
    message: "User not found"
  };

}



    /* ================= GET LOGGED IN USER ================= */
    const currentUserEmail = localStorage.getItem("currentUser");

const response = getUserByEmail(currentUserEmail);

console.log("Logged In User Data:", response);

if (response.status !== "success") {

    window.location.href = "login.html";
    return;

}

const loggedInUser = response.user;

    /* ================= SIDEBAR USER INFO ================= */

    const sidebarName =
        document.querySelector(".sidebar-header strong");

    const sidebarCourse =
        document.querySelector(".sidebar-header small");

    const avatar =
        document.querySelector(".avatar");

    if (sidebarName) {

        sidebarName.textContent =
            loggedInUser.name;

    }

    if (sidebarCourse) {

        sidebarCourse.textContent =` B.Sc
            ${loggedInUser.department} `||
            "Student";

    }

    // First letter avatar
    if (avatar) {

        avatar.textContent =
            loggedInUser.name.charAt(0).toUpperCase();

    }
  // ============ REUSABLE SIDEBAR/TOPOBAR LOGIC ============
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  document.body.appendChild(overlay);

  function toggleSidebar() {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
  }
  menuToggle?.addEventListener('click', toggleSidebar);
  overlay.addEventListener('click', toggleSidebar);
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768 && sidebar?.classList.contains('active')) toggleSidebar();
    });
  });

  // ============ GPA CALCULATOR STATE ============
  let courses = JSON.parse(localStorage.getItem('gpaCourses')) || [];
  const GRADE_POINTS = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };

  // DOM Elements
  const form = document.getElementById('gpaForm');
  const courseCodeInput = document.getElementById('courseCode');
  const courseUnitInput = document.getElementById('courseUnit');
  const gradeSelect = document.getElementById('grade');
  const coursesTableBody = document.getElementById('coursesTableBody');
  const gpaValueEl = document.querySelector('.gpa-value');
  const gpaProgressEl = document.querySelector('.gpa-progress-bar');
  const gpaClassEl = document.querySelector('.gpa-class');
  const emptyState = document.getElementById('emptyTable');

  // ============ RENDER TABLE ============
  function renderTable() {
    coursesTableBody.innerHTML = '';
    
    if (courses.length === 0) {
      emptyState.style.display = 'block';
      return;
    }
    emptyState.style.display = 'none';

    courses.forEach((course, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong>${course.code.toUpperCase()}</strong></td>
        <td>${course.unit}</td>
        <td><span class="grade-badge grade-${course.grade}">${course.grade}</span></td>
        <td>${(course.unit * GRADE_POINTS[course.grade]).toFixed(1)}</td>
        <td><button class="delete-btn" data-index="${index}" aria-label="Remove course"><i class="fa-solid fa-trash"></i></button></td>
      `;
      coursesTableBody.appendChild(row);
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.index);
        courses.splice(idx, 1);
        saveAndRecalculate();
        showToast('Course removed', 'info');
      });
    });
  }

  // ============ CALCULATE & ANIMATE GPA ============
  function calculateGPA() {
    if (courses.length === 0) {
      gpaValueEl.textContent = '0.00';
      gpaProgressEl.style.width = '0%';
      gpaClassEl.textContent = 'No Courses';
      gpaClassEl.className = 'gpa-class';
      return;
    }

    let totalUnits = 0;
    let totalPoints = 0;

    courses.forEach(c => {
      totalUnits += c.unit;
      totalPoints += c.unit * GRADE_POINTS[c.grade];
    });

    const gpa = totalPoints / totalUnits;
    const percentage = (gpa / 5) * 100;

    // Animate number
    animateValue(gpaValueEl, parseFloat(gpaValueEl.textContent) || 0, gpa, 600);
    gpaProgressEl.style.width = `${percentage}%`;

    // Classification
    let classification = 'Pass';
    let className = 'mid';
    if (gpa >= 4.50) { classification = 'First Class Honours'; className = ''; }
    else if (gpa >= 3.50) { classification = 'Second Class (Upper)'; className = 'mid'; }
    else if (gpa >= 2.50) { classification = 'Second Class (Lower)'; className = 'mid'; }
    else if (gpa >= 1.50) { classification = 'Third Class'; className = 'mid'; }
    else if (gpa < 1.00) { classification = 'Fail'; className = 'low'; }

    gpaClassEl.textContent = classification;
    gpaClassEl.className = `gpa-class ${className}`;

    // Pulse animation
    gpaValueEl.classList.add('pulse');
    setTimeout(() => gpaValueEl.classList.remove('pulse'), 300);
  }

  function animateValue(el, start, end, duration) {
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * easeOut;
      el.textContent = current.toFixed(2);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  function saveAndRecalculate() {
    localStorage.setItem('gpaCourses', JSON.stringify(courses));
    renderTable();
    calculateGPA();
  }

  // ============ FORM SUBMISSION ============
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const code = courseCodeInput.value.trim().toUpperCase();
    const unit = parseInt(courseUnitInput.value);
    const grade = gradeSelect.value;

    if (!code || isNaN(unit) || unit <= 0 || unit > 12) {
      showToast('Please enter valid course code & units (1-12)', 'error');
      return;
    }

    if (courses.some(c => c.code === code)) {
      showToast('Course already added!', 'warning');
      return;
    }

    courses.push({ code, unit, grade });
    saveAndRecalculate();
    showToast(`${code} added successfully`, 'success');
    form.reset();
    courseCodeInput.focus();
  });

  // ============ CLEAR & EXPORT ============
  document.getElementById('clearAll')?.addEventListener('click', () => {
    if (courses.length === 0) return;
    if (confirm('Clear all courses? This cannot be undone.')) {
      courses = [];
      saveAndRecalculate();
      showToast('All courses cleared', 'info');
    }
  });

  document.getElementById('exportData')?.addEventListener('click', () => {
    const text = courses.map(c => `${c.code} | ${c.unit} Units | Grade: ${c.grade}`).join('\n');
    const summary = `GPA REPORT\n${new Date().toLocaleDateString()}\n\n${text}\n\nFinal GPA: ${gpaValueEl.textContent}/5.00`;
    
    navigator.clipboard.writeText(summary).then(() => {
      showToast('GPA summary copied to clipboard!', 'success');
    }).catch(() => showToast('Failed to copy', 'error'));
  });

  // ============ TOAST NOTIFICATIONS ============
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `position:fixed;bottom:2rem;right:2rem;padding:1rem 1.5rem;
      background:${type==='success'?'var(--success)':type==='error'?'var(--danger)':type==='warning'?'var(--warning)':'var(--primary)'};
      color:white;border-radius:12px;font-weight:500;box-shadow:0 10px 30px rgba(0,0,0,0.3);
      z-index:1000;animation:slideIn 0.3s ease,fadeOut 0.3s ease 2.7s;display:flex;align-items:center;gap:0.75rem;`;
    toast.innerHTML = `<span>${type==='success'?'✓':type==='error'?'✕':'ℹ'}</span> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `@keyframes slideIn{from{transform:translateX(100px);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes fadeOut{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(20px)}}`;
    document.head.appendChild(style);
  }

  // ============ INIT ============
  renderTable();
  calculateGPA();

  // Active link highlight
  const currentPath = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href')?.includes('gpa')) link.classList.add('active');
  });

  // Keyboard shortcut
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { form.dispatchEvent(new Event('submit')); }
  });
});
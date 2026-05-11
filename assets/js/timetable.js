document.addEventListener('DOMContentLoaded', () => {

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

    console.log(sidebarName)

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

  // ============ TIMETABLE STATE & DOM ============
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const todayName = days[new Date().getDay()];
  
  const searchInput = document.querySelector('.search-box input');
  const dayTabs = document.querySelectorAll('.day-tab');
  const tableRows = document.querySelectorAll('.timetable-table tbody tr');
  const timetableCards = document.querySelectorAll('.timetable-card');
  const printBtn = document.getElementById('printTimetable');

  // ============ HIGHLIGHT TODAY ============
  function highlightToday() {
    // Update tabs
    dayTabs.forEach(tab => {
      if (tab.dataset.day.toLowerCase() === todayName.toLowerCase()) {
        tab.classList.add('active', 'today');
      }
    });

    // Highlight table rows
    tableRows.forEach(row => {
      if (row.dataset.day.toLowerCase() === todayName.toLowerCase()) {
        row.classList.add('highlight-row');
      }
    });

    // Highlight cards
    timetableCards.forEach(card => {
      if (card.dataset.day.toLowerCase() === todayName.toLowerCase()) {
        card.classList.add('today-card');
      }
    });
  }

  // ============ DAY FILTER ============
  dayTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      dayTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const selectedDay = tab.dataset.day.toLowerCase();
      filterTimetable(selectedDay, searchInput?.value.toLowerCase().trim() || '');
    });
  });

  // ============ SEARCH FILTER ============
  searchInput?.addEventListener('input', (e) => {
    const activeTab = document.querySelector('.day-tab.active');
    const day = activeTab ? activeTab.dataset.day.toLowerCase() : '';
    filterTimetable(day, e.target.value.toLowerCase().trim());
  });

  function filterTimetable(dayFilter, searchQuery) {
    let visibleCount = 0;

    // Filter table
    tableRows.forEach(row => {
      const rowDay = row.dataset.day.toLowerCase();
      const rowText = row.textContent.toLowerCase();
      const matchesDay = !dayFilter || rowDay === dayFilter || dayFilter === 'all';
      const matchesSearch = !searchQuery || rowText.includes(searchQuery);
      
      if (matchesDay && matchesSearch) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });

    // Filter cards
    timetableCards.forEach(card => {
      const cardDay = card.dataset.day.toLowerCase();
      const cardText = card.textContent.toLowerCase();
      const matchesDay = !dayFilter || cardDay === dayFilter || dayFilter === 'all';
      const matchesSearch = !searchQuery || cardText.includes(searchQuery);
      
      if (matchesDay && matchesSearch) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });

    // Show empty state if needed
    document.getElementById('emptyTimetable')?.style.display = visibleCount > 0 ? 'none' : 'block';
  }

  // ============ PRINT/EXPORT ============
  printBtn?.addEventListener('click', () => {
    window.print();
    showToast('Preparing print layout...', 'info');
  });

  // ============ TOAST NOTIFICATIONS ============
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `position:fixed;bottom:2rem;right:2rem;padding:1rem 1.5rem;
      background:${type==='success'?'var(--success)':type==='error'?'var(--danger)':'var(--primary)'};
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
  highlightToday();

  // Active link highlight
  const currentPath = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href')?.includes('timetable')) link.classList.add('active');
  });

  // Keyboard shortcut: Ctrl+P for print
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
      e.preventDefault();
      printBtn?.click();
    }
  });
});
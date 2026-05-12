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
    if (!localStorage.getItem("currentUser")) {
    window.location.href = "login.html";
    return;
}

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
  
  // ============ MOBILE SIDEBAR TOGGLE ============
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.querySelector('.sidebar');

const overlay = document.createElement('div');
overlay.className = 'sidebar-overlay';
document.body.appendChild(overlay);

function toggleSidebar() {

  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
  menuToggle.classList.toggle('active');

  document.body.style.overflow =
    sidebar.classList.contains('active')
      ? 'hidden'
      : '';
}

menuToggle.addEventListener('click', toggleSidebar);

overlay.addEventListener('click', toggleSidebar);

document.querySelectorAll('.sidebar-link').forEach(link => {
  link.addEventListener('click', () => {

    if(window.innerWidth <= 768 &&
       sidebar.classList.contains('active')) {

      toggleSidebar();

    }

  });
});
  
  // ============ SEARCH & FILTER FUNCTIONALITY ============
  const searchInput = document.querySelector('.search-box input');
  const departmentFilter = document.getElementById('departmentFilter');
  const levelFilter = document.getElementById('levelFilter');
  const resetBtn = document.getElementById('resetFilters');
  const courseCards = document.querySelectorAll('.course-card, .department-list li');
  
  // Debounced search
  let searchTimeout;
  searchInput?.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      filterCourses();
    }, 300);
  });
  
  departmentFilter?.addEventListener('change', filterCourses);
  levelFilter?.addEventListener('change', filterCourses);
  
  resetBtn?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    if (departmentFilter) departmentFilter.value = '';
    if (levelFilter) levelFilter.value = '';
    filterCourses();
  });
  
  function filterCourses() {
    const query = searchInput?.value.toLowerCase().trim() || '';
    const dept = departmentFilter?.value.toLowerCase() || '';
    const level = levelFilter?.value || '';
    
    let visibleCount = 0;
    
    courseCards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const cardDept = card.dataset.department?.toLowerCase() || '';
      const cardLevel = card.dataset.level || '';
      
      const matchesSearch = !query || text.includes(query);
      const matchesDept = !dept || cardDept.includes(dept);
      const matchesLevel = !level || cardLevel === level;
      
      const shouldShow = matchesSearch && matchesDept && matchesLevel;
      
      if (shouldShow) {
        card.classList.remove('hidden', 'fade-out');
        card.style.display = '';
        visibleCount++;
      } else {
        card.classList.add('fade-out');
        setTimeout(() => {
          if (!card.classList.contains('fade-out')) return;
          card.classList.add('hidden');
          card.style.display = 'none';
        }, 300);
      }
    });
    
    // Show/hide empty state
    const emptyState = document.querySelector('.empty-state');
    if (emptyState) {
      emptyState.classList.toggle('hidden', visibleCount > 0);
    }
  }
  
  // ============ DEPARTMENT ACCORDION TOGGLE ============
  const departmentHeaders = document.querySelectorAll('.department-header');
  
  departmentHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const list = header.nextElementSibling;
      const icon = header.querySelector('.toggle-icon');
      
      header.classList.toggle('active');
      list.classList.toggle('collapsed');
      
      // Animate icon
      if (icon) {
        icon.style.transition = 'transform 0.3s ease';
      }
    });
  });
  
  // ============ COURSE CARD INTERACTIONS ============
  courseCards.forEach(card => {
    // Add click to view details (optional)
    card.addEventListener('click', (e) => {
      // Ignore clicks on buttons
      if (e.target.closest('.btn')) return;
      
      // Could open modal or navigate to course detail page
      const courseCode = card.querySelector('.course-code')?.textContent;
      if (courseCode) {
        console.log(`Viewing details for ${courseCode}`);
        // window.location.href = `/course/${courseCode.toLowerCase().replace(' ', '-')}`;
      }
    });
    
    // Button actions
    card.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        
        if (action === 'enroll') {
          btn.textContent = '✓ Enrolled';
          btn.classList.remove('btn-outline');
          btn.classList.add('btn-primary');
          btn.disabled = true;
          
          // Show toast notification
          showToast('Successfully enrolled in course!', 'success');
        } else if (action === 'materials') {
          showToast('Opening course materials...', 'info');
          // window.open('/materials', '_blank');
        }
      });
    });
  });
  
  // ============ TOAST NOTIFICATIONS ============
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      padding: 1rem 1.5rem;
      background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--primary)'};
      color: white;
      border-radius: 12px;
      font-weight: 500;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      z-index: 1000;
      animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    `;
    
    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    toast.innerHTML = `<span style="font-size:1.25rem">${icons[type]}</span> ${message}`;
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
  }
  
  // Add toast keyframes if not in CSS
  if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes fadeOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(20px); }
      }
    `;
    document.head.appendChild(style);
  }
  
  // ============ SCROLL REVEAL ANIMATIONS ============
  const revealElements = document.querySelectorAll(
    '.page-header, .filters-bar, .course-card, .department-section'
  );
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  revealElements.forEach(el => {
    el.classList.add('scroll-reveal');
    revealObserver.observe(el);
  });
  
  // ============ ACTIVE LINK HIGHLIGHTING ============
  const currentPath = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.remove('active');
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPath || linkHref?.includes('courses')) {
      link.classList.add('active');
    }
  });
  
  // ============ KEYBOARD SHORTCUTS ============
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchInput?.focus();
      searchInput?.select();
    }
    // Escape to close mobile sidebar
    if (e.key === 'Escape' && sidebar?.classList.contains('active')) {
      toggleSidebar();
    }
  });
  
  // ============ DYNAMIC COURSE DATA (Optional - Replace with API) ============
  // Sample data structure for dynamic rendering
  const coursesData = [
    {
      code: 'CSC 101',
      title: 'Introduction to Computing',
      desc: 'Fundamentals of computer systems, hardware, software, and basic programming concepts.',
      units: 3,
      department: 'Computer Science',
      level: '100',
      semester: 'First',
      type: 'Required'
    },
    {
      code: 'CSC 102',
      title: 'Programming Fundamentals',
      desc: 'Learn programming basics using Python: variables, loops, functions, and problem-solving.',
      units: 3,
      department: 'Computer Science',
      level: '100',
      semester: 'First',
      type: 'Required'
    },
    {
      code: 'CYB 101',
      title: 'Introduction to Cyber Security',
      desc: 'Overview of security principles, threats, vulnerabilities, and basic defense mechanisms.',
      units: 3,
      department: 'Cyber Security',
      level: '100',
      semester: 'First',
      type: 'Required'
    },
    // Add more courses...
  ];
  
  // Function to render courses dynamically
  function renderCourses(courses) {
    const grid = document.querySelector('.courses-grid');
    if (!grid) return;
    
    grid.innerHTML = courses.map(course => `
      <div class="course-card" 
           data-department="${course.department}" 
           data-level="${course.level}">
        <div class="course-header">
          <span class="course-code">${course.code}</span>
          <span class="course-units">${course.units} Units</span>
        </div>
        <h3 class="course-title">${course.title}</h3>
        <p class="course-desc">${course.desc}</p>
        <div class="course-meta">
          <span class="course-tag level">${course.level}L</span>
          <span class="course-tag semester">${course.semester}</span>
          <span class="course-tag required">${course.type}</span>
        </div>
        <div class="course-actions">
          <button class="btn btn-outline" data-action="materials">
            <i class="fa-solid fa-folder-open"></i> Materials
          </button>
          <button class="btn btn-primary" data-action="enroll">
            <i class="fa-solid fa-plus"></i> Enroll
          </button>
        </div>
      </div>
    `).join('');
    
    // Re-attach event listeners to new cards
    document.querySelectorAll('.course-card').forEach(card => {
      card.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const action = btn.dataset.action;
          if (action === 'enroll') {
            btn.textContent = '✓ Enrolled';
            btn.classList.remove('btn-outline');
            btn.classList.add('btn-primary');
            btn.disabled = true;
            showToast('Successfully enrolled!', 'success');
          }
        });
      });
    });
  }
  
  // Initialize with static HTML or dynamic data
  // renderCourses(coursesData); // Uncomment to use dynamic rendering
  
  // ============ AUTO-EXPAND BASED ON URL PARAM ============
  const urlParams = new URLSearchParams(window.location.search);
  const deptParam = urlParams.get('department');
  
  if (deptParam) {
    // Find and expand matching department
    const targetHeader = Array.from(departmentHeaders).find(h => 
      h.textContent.toLowerCase().includes(deptParam.toLowerCase())
    );
    if (targetHeader) {
      targetHeader.click();
      targetHeader.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
});


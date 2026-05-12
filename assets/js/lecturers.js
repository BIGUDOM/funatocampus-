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
  
  // ============ MOBILE SIDEBAR ============
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
  
  // ============ SEARCH & FILTER ============
  const searchInput = document.querySelector('.search-box input');
  const deptFilter = document.getElementById('departmentFilter');
  const resetBtn = document.getElementById('resetFilters');
  const lecturerCards = document.querySelectorAll('.lecturer-card');
  
  let searchTimeout;
  searchInput?.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => filterLecturers(), 300);
  });
  deptFilter?.addEventListener('change', filterLecturers);
  resetBtn?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    if (deptFilter) deptFilter.value = '';
    filterLecturers();
  });
  
  function filterLecturers() {
    const query = searchInput?.value.toLowerCase().trim() || '';
    const dept = deptFilter?.value.toLowerCase() || '';
    let visibleCount = 0;
    
    lecturerCards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const cardDept = card.dataset.department?.toLowerCase() || '';
      const matchesSearch = !query || text.includes(query);
      const matchesDept = !dept || cardDept.includes(dept);
      
      if (matchesSearch && matchesDept) {
        card.classList.remove('hidden', 'fade-out');
        card.style.display = '';
        visibleCount++;
      } else {
        card.classList.add('fade-out');
        setTimeout(() => { if (card.classList.contains('fade-out')) { card.classList.add('hidden'); card.style.display = 'none'; }}, 300);
      }
    });
    
    document.querySelector('.empty-state')?.classList.toggle('hidden', visibleCount > 0);
  }
  
  // ============ MODAL FUNCTIONALITY ============
  const modalOverlay = document.getElementById('lecturerModal');
  const modalClose = document.querySelector('.modal-close');
  
  function openModal(lecturer) {
    const modal = document.querySelector('.modal');
    if (!modal) return;
    
    // Populate modal content
    modal.querySelector('.modal-avatar').innerHTML = lecturer.image 
      ? `<img src="${lecturer.image}" alt="${lecturer.name}">`
      : `<span class="placeholder">${lecturer.name.charAt(0)}</span>`;
    
    modal.querySelector('.modal-title h3').textContent = lecturer.name;
    modal.querySelector('.modal-title p').textContent = lecturer.title;
    
    const meta = modal.querySelector('.modal-meta');
    meta.innerHTML = `
      <p><i class="fa-solid fa-building"></i> ${lecturer.department}</p>
      <p><i class="fa-solid fa-book"></i> ${lecturer.courses.join(', ')}</p>
      <p><i class="fa-solid fa-envelope"></i> ${lecturer.email}</p>
      <p><i class="fa-solid fa-clock"></i> ${lecturer.officeHours}</p>
    `;
    
    const bio = modal.querySelector('.modal-bio p');
    bio.textContent = lecturer.bio || 'No biography available.';
    
    const coursesList = modal.querySelector('.modal-courses ul');
    coursesList.innerHTML = lecturer.courses.map(code => 
      `<li><i class="fa-solid fa-check"></i> ${code} - View Syllabus</li>`
    ).join('');
    
    // Show modal
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeModal() {
    modalOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  modalClose?.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
  
  // ============ CARD CLICK TO OPEN MODAL ============
  lecturerCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn')) return; // Ignore button clicks
      
      const lecturer = {
        name: card.querySelector('.lecturer-name')?.textContent || '',
        title: card.querySelector('.lecturer-title')?.textContent || '',
        department: card.dataset.department || '',
        courses: Array.from(card.querySelectorAll('.lecturer-tag.dept')).map(t => t.textContent) || [],
        email: card.dataset.email || 'contact@funato.edu.ng',
        officeHours: card.dataset.officeHours || 'Mon-Fri, 10AM-2PM',
        bio: card.dataset.bio || '',
        image: card.querySelector('img')?.src || null
      };
      
      openModal(lecturer);
    });
    
    // Button actions
    card.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        
        if (action === 'email') {
          const email = btn.closest('.lecturer-card')?.dataset.email || 'contact@funato.edu.ng';
          window.location.href = `mailto:${email}`;
          showToast(`Opening email to ${email.split('@')[0]}...`, 'info');
        } else if (action === 'profile') {
          const name = btn.closest('.lecturer-card')?.querySelector('.lecturer-name')?.textContent;
          showToast(`Viewing profile for ${name}`, 'success');
          // Could navigate to profile page
        } else if (action === 'schedule') {
          showToast('Opening appointment scheduler...', 'info');
          // Could open scheduling modal
        }
      });
    });
  });
  
  // ============ TOAST NOTIFICATIONS ============
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
      position: fixed; bottom: 2rem; right: 2rem; padding: 1rem 1.5rem;
      background: ${type==='success'?'var(--success)':type==='error'?'var(--danger)':'var(--primary)'};
      color: white; border-radius: 12px; font-weight: 500;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3); z-index: 1000;
      animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
      display: flex; align-items: center; gap: 0.75rem;
    `;
    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    toast.innerHTML = `<span style="font-size:1.25rem">${icons[type]}</span> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
  
  if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `@keyframes slideIn{from{transform:translateX(100px);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes fadeOut{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(20px)}}`;
    document.head.appendChild(style);
  }
  
  // ============ SCROLL REVEAL ============
  const revealElements = document.querySelectorAll('.page-header, .filters-bar, .lecturer-card');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => { el.classList.add('scroll-reveal'); revealObserver.observe(el); });
  
  // ============ ACTIVE LINK ============
  const currentPath = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href')?.includes('lecturers')) link.classList.add('active');
  });
  
  // ============ KEYBOARD SHORTCUTS ============
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); searchInput?.focus(); searchInput?.select(); }
    if (e.key === 'Escape' && sidebar?.classList.contains('active')) toggleSidebar();
  });
  
  // ============ DYNAMIC LECTURER DATA (Optional) ============
  const lecturersData = [
    {
      id: 1, name: 'Dr. John Ade', title: 'Senior Lecturer',
      department: 'Computer Science', courses: ['CSC 202', 'CSC 301'],
      email: 'j.ade@funato.edu.ng', officeHours: 'Mon-Wed, 10AM-1PM',
      bio: 'Dr. Ade specializes in database systems and distributed computing with over 15 years of teaching experience.',
      image: 'lecturer1.jpg', rating: 4.8
    },
    {
      id: 2, name: 'Mrs. Grace Daniel', title: 'Lecturer II',
      department: 'Cyber Security', courses: ['CYB 103', 'CYB 201'],
      email: 'g.daniel@funato.edu.ng', officeHours: 'Tue-Thu, 2PM-4PM',
      bio: 'Mrs. Daniel focuses on ethical hacking, network security, and digital forensics.',
      image: 'lecturer2.jpg', rating: 4.9
    },
    {
      id: 3, name: 'Prof. Samuel James', title: 'Professor',
      department: 'Software Engineering', courses: ['SWE 301', 'SWE 401'],
      email: 's.james@funato.edu.ng', officeHours: 'Fri, 9AM-12PM',
      bio: 'Prof. James leads research in agile methodologies, software architecture, and DevOps practices.',
      image: 'lecturer3.jpg', rating: 5.0
    }
  ];
  
  function renderLecturers(lecturers) {
    const grid = document.querySelector('.lecturers-grid');
    if (!grid) return;
    grid.innerHTML = lecturers.map((lec, i) => `
      <div class="lecturer-card" data-department="${lec.department}" data-email="${lec.email}" data-office-hours="${lec.officeHours}" data-bio="${lec.bio}" style="animation-delay:${0.1+i*0.05}s">
        <div class="lecturer-avatar">
          ${lec.image ? `<img src="${lec.image}" alt="${lec.name}" onerror="this.parentElement.innerHTML='<span class=\\'placeholder\\'>${lec.name.charAt(0)}</span>'">` : `<span class="placeholder">${lec.name.charAt(0)}</span>`}
        </div>
        <h3 class="lecturer-name">${lec.name}</h3>
        <p class="lecturer-title">${lec.title}</p>
        <div class="rating">
          ${'★'.repeat(Math.floor(lec.rating))}${'☆'.repeat(5-Math.floor(lec.rating))}
        </div>
        <div class="lecturer-meta">
          <p><i class="fa-solid fa-building"></i> ${lec.department}</p>
          <p><i class="fa-solid fa-book"></i> ${lec.courses.join(', ')}</p>
        </div>
        <div class="lecturer-tags">
          <span class="lecturer-tag dept">${lec.department}</span>
          <span class="lecturer-tag status">Available</span>
          <span class="lecturer-tag rating">★ ${lec.rating}</span>
        </div>
        <p class="office-hours"><i class="fa-regular fa-clock"></i> ${lec.officeHours}</p>
        <div class="lecturer-actions">
          <button class="btn btn-outline" data-action="profile"><i class="fa-regular fa-user"></i> Profile</button>
          <button class="btn btn-primary" data-action="email"><i class="fa-regular fa-envelope"></i> Email</button>
        </div>
      </div>
    `).join('');
    
    // Re-attach event listeners
    document.querySelectorAll('.lecturer-card').forEach(card => {
      card.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const action = btn.dataset.action;
          const email = card.dataset.email;
          if (action === 'email') { window.location.href = `mailto:${email}`; showToast(`Opening email...`, 'info'); }
          else if (action === 'profile') { showToast('Opening profile...', 'success'); }
        });
      });
      card.addEventListener('click', (e) => { if (!e.target.closest('.btn')) { /* open modal logic */ } });
    });
  }
  
  // Initialize: use static HTML or dynamic
  // renderLecturers(lecturersData); // Uncomment for dynamic rendering
  
});
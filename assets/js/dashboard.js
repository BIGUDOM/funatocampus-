
// dashboard

document.addEventListener('DOMContentLoaded', () => {
  
  // ============ MOBILE SIDEBAR TOGGLE ============
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.querySelector('.sidebar');
  
  // Create overlay for mobile
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  document.body.appendChild(overlay);
  
  function toggleSidebar() {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
  }
  
  if (menuToggle) {
    menuToggle.addEventListener('click', toggleSidebar);
  }
  
  // Close sidebar when clicking overlay
  overlay.addEventListener('click', toggleSidebar);
  
  // Close sidebar when clicking a nav link (mobile)
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
        toggleSidebar();
      }
    });
  });
  
  // Close sidebar on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
      toggleSidebar();
    }
  });
  
  // ============ SEARCH FUNCTIONALITY ============
  const searchInput = document.querySelector('.search-box input');
  
  if (searchInput) {
    // Debounced search
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const query = e.target.value.toLowerCase().trim();
        performSearch(query);
      }, 300);
    });
    
    function performSearch(query) {
      if (!query) {
        // Reset all items
        document.querySelectorAll('tr, .announcement').forEach(item => {
          item.style.display = '';
          item.classList.remove('fade-out');
        });
        return;
      }
      
      // Search in table rows
      document.querySelectorAll('tbody tr').forEach(row => {
        const text = row.textContent.toLowerCase();
        const match = text.includes(query);
        row.style.display = match ? '' : 'none';
        if (!match) row.classList.add('fade-out');
      });
      
      // Search in announcements
      document.querySelectorAll('.announcement').forEach(ann => {
        const text = ann.textContent.toLowerCase();
        const match = text.includes(query);
        ann.style.display = match ? '' : 'none';
      });
      
      // Show "no results" message if needed
      const visibleRows = document.querySelectorAll('tbody tr[style!="display: none;"]');
      // Could add custom no-results UI here
    }
  }
  
  // ============ NOTIFICATION CLICK ============
  const notification = document.querySelector('.notification');
  
  if (notification) {
    notification.addEventListener('click', () => {
      // Create dropdown or modal
      showNotificationPanel();
      
      // Remove badge after viewing
      notification.style.setProperty('--badge-hidden', 'none');
      notification.querySelector('::after')?.style.setProperty('display', 'none');
    });
  }
  
  function showNotificationPanel() {
    // Check if panel exists
    let panel = document.getElementById('notificationPanel');
    
    if (panel) {
      panel.classList.toggle('active');
      return;
    }
    
    // Create panel
    panel = document.createElement('div');
    panel.id = 'notificationPanel';
    panel.className = 'notification-panel';
    panel.style.cssText = `
      position: absolute;
      top: 60px;
      right: 1rem;
      width: 320px;
      max-height: 400px;
      overflow-y: auto;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 1rem;
      box-shadow: 0 20px 40px rgba(0,0,0,0.4);
      z-index: 200;
      animation: slideDown 0.3s ease;
    `;
    
    panel.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;padding-bottom:0.75rem;border-bottom:1px solid var(--border)">
        <strong style="color:var(--text)">Notifications</strong>
        <span style="color:var(--muted);font-size:0.85rem;cursor:pointer" id="markAllRead">Mark all read</span>
      </div>
      <div class="notification-item" style="padding:0.75rem;border-radius:8px;background:rgba(99,102,241,0.1);margin-bottom:0.5rem">
        <strong style="color:var(--text);font-size:0.95rem">CYB 103 Assignment</strong>
        <p style="color:var(--muted);font-size:0.85rem;margin:0.25rem 0 0">Submission closes next week Friday.</p>
        <small style="color:var(--accent);font-size:0.8rem">2 hours ago</small>
      </div>
      <div class="notification-item" style="padding:0.75rem;border-radius:8px;background:rgba(14,165,233,0.1);margin-bottom:0.5rem">
        <strong style="color:var(--text);font-size:0.95rem">School Fees Reminder</strong>
        <p style="color:var(--muted);font-size:0.85rem;margin:0.25rem 0 0">Complete payments before exams.</p>
        <small style="color:var(--accent);font-size:0.8rem">1 day ago</small>
      </div>
    `;
    
    // Position relative to notification button
    const rect = notification.getBoundingClientRect();
    panel.style.top = `${rect.bottom + 8}px`;
    panel.style.right = `${window.innerWidth - rect.right + 16}px`;
    
    document.body.appendChild(panel);
    
    // Close on outside click
    setTimeout(() => {
      document.addEventListener('click', (e) => {
        if (!panel.contains(e.target) && !notification.contains(e.target)) {
          panel.remove();
        }
      }, { once: true });
    }, 100);
    
    // Mark all read
    document.getElementById('markAllRead')?.addEventListener('click', () => {
      document.querySelectorAll('.notification-item').forEach(item => {
        item.style.opacity = '0.6';
        item.style.background = 'rgba(255,255,255,0.03)';
      });
      notification.querySelector('::after')?.style.setProperty('display', 'none');
    });
  }
  
  // ============ SCROLL REVEAL ANIMATIONS ============
  const revealElements = document.querySelectorAll('.stat-box, .card, .page-header');
  
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
  
  // ============ STATS COUNTER ANIMATION ============
  const statValues = document.querySelectorAll('.stat-val');
  let statsAnimated = false;
  
  function animateStats() {
    if (statsAnimated) return;
    
    statValues.forEach(stat => {
      const finalValue = stat.textContent;
      const isNumber = /^[\d.]+$/.test(finalValue);
      
      if (!isNumber) return;
      
      const target = parseFloat(finalValue);
      const duration = 1500;
      const start = 0;
      const startTime = performance.now();
      
      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        const current = (start + (target - start) * easeOut).toFixed(2);
        stat.textContent = current;
        
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          stat.textContent = finalValue; // Ensure exact final value
        }
      }
      
      requestAnimationFrame(update);
    });
    
    statsAnimated = true;
  }
  
  // Trigger on first scroll to dashboard area
  const mainContent = document.querySelector('main');
  if (mainContent) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateStats();
        statsObserver.unobserve(mainContent);
      }
    }, { threshold: 0.3 });
    
    statsObserver.observe(mainContent);
  }
  
  // ============ ACTIVE LINK HIGHLIGHTING ============
  const currentPath = window.location.pathname.split('/').pop();
  
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.remove('active');
    const linkHref = link.getAttribute('href');
    
    if (linkHref === currentPath || 
        (currentPath === '' && linkHref === 'dashboard.html') ||
        linkHref.includes(currentPath.split('.')[0])) {
      link.classList.add('active');
    }
  });
  
  // ============ TOOLTIP FOR SIDEBAR ICONS (Collapsed mode hint) ============
  document.querySelectorAll('.sidebar-link').forEach(link => {
    const icon = link.querySelector('i');
    const text = link.textContent.trim().replace(/\s+/g, ' ');
    
    if (icon && text) {
      link.setAttribute('title', text);
      
      // Custom tooltip on hover for desktop
      link.addEventListener('mouseenter', (e) => {
        if (window.innerWidth > 768) {
          showTooltip(e.target, text);
        }
      });
      
      link.addEventListener('mouseleave', () => {
        hideTooltip();
      });
    }
  });
  
  function showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'sidebar-tooltip';
    tooltip.style.cssText = `
      position: fixed;
      left: ${element.getBoundingClientRect().right + 12}px;
      top: ${element.getBoundingClientRect().top + element.offsetHeight/2}px;
      transform: translateY(-50%);
      background: var(--surface);
      color: var(--text);
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 500;
      white-space: nowrap;
      box-shadow: 0 8px 25px rgba(0,0,0,0.3);
      border: 1px solid var(--border);
      z-index: 1000;
      animation: fadeIn 0.2s ease;
      pointer-events: none;
    `;
    tooltip.textContent = text;
    document.body.appendChild(tooltip);
    
    // Store for removal
    element._tooltip = tooltip;
  }
  
  function hideTooltip() {
    event.target._tooltip?.remove();
    delete event.target._tooltip;
  }
  
  // ============ KEYBOARD NAVIGATION ============
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchInput?.focus();
    }
    
    // Escape to close mobile sidebar
    if (e.key === 'Escape' && sidebar?.classList.contains('active')) {
      toggleSidebar();
    }
  });
  
  // ============ AUTO HIDE TOP BAR ON SCROLL (Optional) ============
  let lastScroll = 0;
  const topBar = document.querySelector('.top-bar');
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 100) {
      if (currentScroll > lastScroll && !topBar.classList.contains('hidden')) {
        // Scrolling down
        topBar.style.transform = 'translateY(-100%)';
        topBar.style.transition = 'transform 0.3s ease';
      } else if (currentScroll < lastScroll) {
        // Scrolling up
        topBar.style.transform = 'translateY(0)';
      }
    }
    
    lastScroll = currentScroll;
  }, { passive: true });
});

document.addEventListener("DOMContentLoaded", () => {

  

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

    /* ================= GREETING ================= */

    const greetings = document.getElementById("greetings");
    const nameSpan = document.getElementById("name");

    // Dynamic greeting based on time
    const hour = new Date().getHours();

    let greetingText = "Good Evening";

    if (hour < 12) {

        greetingText = "Good Morning";

    } else if (hour < 17) {

        greetingText = "Good Afternoon";

    }

    if (greetings) {

        greetings.innerHTML = `
            ${greetingText},
            <span id="name">${loggedInUser.name}</span> 👋
        `;

    }

    if (nameSpan) {

        nameSpan.textContent = loggedInUser.name;

    }

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

    /* ================= LEVEL ================= */

    // const statVals =
    //     document.querySelectorAll(".stat-val");

    // // GPA
    // if (statVals[0]) {

    //     statVals[0].textContent =
    //         loggedInUser.gpa || "0.00";

    // }

    // // CGPA
    // if (statVals[1]) {

    //     statVals[1].textContent =
    //         loggedInUser.cgpa || "0.00";

    // }

    // LEVEL
    if (statVals[2]) {

        statVals[2].textContent =
            loggedInUser.level || "100L";

    }

    // SEMESTER
    if (statVals[3]) {

        statVals[3].textContent =
            loggedInUser.semester || "First";

    }

    /* ================= AUTO GENERATE COURSES ================= */

    const courseTable =
        document.querySelector("tbody");

    if (courseTable) {

        // Example dynamic courses
        // If user has no courses, default list
        const courses =
            loggedInUser.courses || [

                {
                    code: "CYB 103",
                    unit: 3,
                    status: "Active"
                },

                {
                    code: "MTH 101",
                    unit: 3,
                    status: "Active"
                },

                {
                    code: "GST 111",
                    unit: 2,
                    status: "Active"
                }

            ];

        courseTable.innerHTML = "";

        courses.forEach(course => {

            courseTable.innerHTML += `
                <tr>
                    <td>${course.code}</td>

                    <td>${course.unit}</td>

                    <td>
                        <span class="badge">
                            ${course.status}
                        </span>
                    </td>
                </tr>
            `;

        });

    }

    /* ================= ANNOUNCEMENTS ================= */

    const announcementContainer =
        document.querySelectorAll(".announcement");

    const announcements = [

        {
            title: "Welcome Back",
            text: `${loggedInUser.name}, your dashboard is active.`
        },

        {
            title: "Course Registration",
            text: "Course registration closes next week."
        },

        {
            title: "Examination Update",
            text: "Exam timetable has been released."
        }

    ];

    announcementContainer.forEach((box, index) => {

        if (announcements[index]) {

            box.innerHTML = `
                <strong>
                    ${announcements[index].title}
                </strong>

                <p>
                    ${announcements[index].text}
                </p>
            `;

        }

    });

    /* ================= SEARCH BOX ================= */

    const searchInput =
        document.querySelector(".search-box input");

    if (searchInput) {

        searchInput.addEventListener("input", () => {

            const value =
                searchInput.value.toLowerCase();

            const rows =
                document.querySelectorAll("tbody tr");

            rows.forEach(row => {

                const course =
                    row.innerText.toLowerCase();

                if (course.includes(value)) {

                    row.style.display = "";

                } else {

                    row.style.display = "none";

                }

            });

        });

    }

    /* ================= MOBILE SIDEBAR ================= */

    const menuToggle =
        document.getElementById("menuToggle");

    const sidebar =
        document.querySelector(".sidebar");

    const overlay =
        document.getElementById("sidebarOverlay");

    if (menuToggle && sidebar && overlay) {

        menuToggle.addEventListener("click", () => {

            sidebar.classList.toggle("show");
            overlay.classList.toggle("show");

        });

        overlay.addEventListener("click", () => {

            sidebar.classList.remove("show");
            overlay.classList.remove("show");

        });

    }

});





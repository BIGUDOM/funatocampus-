document.addEventListener('DOMContentLoaded', () => {
      if (!localStorage.getItem("currentUser")) {
    window.location.href = "login.html";
    return;
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

  // ============ PROFILE STATE ============
  const STORAGE_KEY = 'funato_profile';
  let profile = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
    name: 'Udom Blessing',
    matric: '23/CSC/001',
    department: 'Computer Science',
    faculty: 'Computing',
    level: '100L',
    session: '2025/2026',
    email: 'student@email.com',
    bio: '',
    avatar: null
  };

  // DOM Elements
  const avatarImg = document.getElementById('profileAvatar');
  const avatarPlaceholder = document.getElementById('avatarPlaceholder');
  const avatarInput = document.getElementById('avatarInput');
  const avatarOverlay = document.querySelector('.avatar-overlay');
  
  const nameDisplay = document.getElementById('nameDisplay');
  const nameEdit = document.getElementById('nameEdit');
  
  const bioDisplay = document.getElementById('bioDisplay');
  const bioTextarea = document.getElementById('bioTextarea');
  const bioCounter = document.getElementById('bioCounter');
  
  const editBtns = document.querySelectorAll('.btn-edit');
  const saveBtns = document.querySelectorAll('.btn-save');
  const cancelBtns = document.querySelectorAll('.btn-cancel');

  // ============ AVATAR UPLOAD ============
  avatarOverlay?.addEventListener('click', () => avatarInput?.click());
  
  avatarInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be under 5MB', 'error');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      profile.avatar = event.target.result;
      updateAvatar();
      saveProfile();
      showToast('Profile photo updated!', 'success');
    };
    reader.readAsDataURL(file);
  });

  function updateAvatar() {
    if (profile.avatar) {
      avatarPlaceholder.style.display = 'none';
      avatarImg.src = profile.avatar;
      avatarImg.style.display = 'block';
    } else {
      avatarImg.style.display = 'none';
      avatarPlaceholder.style.display = 'flex';
      avatarPlaceholder.textContent = profile.name?.charAt(0) || 'U';
    }
  }

  // ============ RENDER PROFILE ============
  function renderProfile() {
    // Update display values
    document.getElementById('displayName').textContent = profile.name;
    document.getElementById('displayMatric').textContent = profile.matric;
    document.getElementById('displayDept').textContent = profile.department;
    document.getElementById('displayFaculty').textContent = profile.faculty;
    document.getElementById('displayLevel').textContent = profile.level;
    document.getElementById('displaySession').textContent = profile.session;
    document.getElementById('displayEmail').textContent = profile.email;
    
    // Update bio
    if (profile.bio?.trim()) {
      bioDisplay.textContent = profile.bio;
      bioDisplay.classList.remove('empty');
    } else {
      bioDisplay.textContent = 'No bio added yet. Click edit to add one.';
      bioDisplay.classList.add('empty');
    }
    
    // Update avatar
    updateAvatar();
    
    // Update stats
    document.querySelector('.stat-value:nth-child(2)').textContent = profile.level;
    document.querySelector('.stat-value:last-child').textContent = profile.department.split(' ')[0];
  }

  // ============ EDIT/SAVE LOGIC ============
  function toggleEdit(field, isEditing) {
    const display = document.getElementById(`${field}Display`);
    const edit = document.getElementById(`${field}Edit`);
    
    if (isEditing) {
      display.style.display = 'none';
      edit.classList.add('active');
      edit.querySelector('input, select')?.focus();
    } else {
      display.style.display = '';
      edit.classList.remove('active');
    }
  }

  // Attach edit buttons
  editBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const field = e.target.closest('[data-field]')?.dataset.field;
      if (!field) return;
      
      // Pre-fill edit field with current value
      const editEl = document.getElementById(`${field}Edit`);
      const input = editEl?.querySelector('input, select');
      if (input && profile[field]) {
        input.value = profile[field];
      }
      
      toggleEdit(field, true);
    });
  });

  // Attach save buttons
  saveBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const field = e.target.closest('[data-field]')?.dataset.field;
      if (!field) return;
      
      const editEl = document.getElementById(`${field}Edit`);
      const input = editEl?.querySelector('input, select');
      const newValue = input?.value?.trim();
      
      if (newValue && newValue !== profile[field]) {
        profile[field] = newValue;
        saveProfile();
        renderProfile();
        showToast(`${field.charAt(0).toUpperCase() + field.slice(1)} updated!`, 'success');
      }
      
      toggleEdit(field, false);
    });
  });

  // Attach cancel buttons
  cancelBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const field = e.target.closest('[data-field]')?.dataset.field;
      if (field) toggleEdit(field, false);
    });
  });

  // ============ BIO EDITOR ============
  const bioEditBtn = document.getElementById('bioEditBtn');
  const bioSaveBtn = document.getElementById('bioSaveBtn');
  const bioCancelBtn = document.getElementById('bioCancelBtn');

  bioEditBtn?.addEventListener('click', () => {
    bioDisplay.style.display = 'none';
    bioTextarea.classList.add('active');
    bioTextarea.value = profile.bio || '';
    updateBioCounter();
    bioTextarea.focus();
    bioEditBtn.style.display = 'none';
    bioSaveBtn.style.display = 'inline-flex';
    bioCancelBtn.style.display = 'inline-flex';
  });

  bioSaveBtn?.addEventListener('click', () => {
    const bio = bioTextarea.value.trim();
    if (bio.length > 500) {
      showToast('Bio must be under 500 characters', 'error');
      return;
    }
    
    profile.bio = bio;
    saveProfile();
    renderProfile();
    
    bioTextarea.classList.remove('active');
    bioDisplay.style.display = '';
    bioEditBtn.style.display = 'inline-flex';
    bioSaveBtn.style.display = 'none';
    bioCancelBtn.style.display = 'none';
    
    showToast('Bio updated successfully!', 'success');
  });

  bioCancelBtn?.addEventListener('click', () => {
    bioTextarea.classList.remove('active');
    bioDisplay.style.display = '';
    bioEditBtn.style.display = 'inline-flex';
    bioSaveBtn.style.display = 'none';
    bioCancelBtn.style.display = 'none';
  });

  bioTextarea?.addEventListener('input', updateBioCounter);

  function updateBioCounter() {
    const len = bioTextarea.value.length;
    const max = 500;
    bioCounter.textContent = `${len}/${max}`;
    bioCounter.className = `bio-counter ${len > max * 0.8 ? 'warning' : ''} ${len >= max ? 'limit' : ''}`;
    if (len >= max) {
      bioTextarea.value = bioTextarea.value.substring(0, max);
    }
  }

  // ============ HELPERS ============
  function saveProfile() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }

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
  renderProfile();

  // Active link highlight
  const currentPath = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href')?.includes('profile')) link.classList.add('active');
  });

  // Keyboard shortcut: Ctrl+S to save (if editing)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      const activeSave = document.querySelector('.btn-save[style*="display: inline"]');
      activeSave?.click();
    }
  });
});


document.addEventListener("DOMContentLoaded", () => {

  /* ================= GET USER BY EMAIL ================= */

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

  /* ================= GET CURRENT USER ================= */

  let currentUserEmail =
    localStorage.getItem("currentUser");

  if (currentUserEmail) {

    currentUserEmail =
      currentUserEmail.replace(/"/g, "").trim();

  }

  const response =
    getUserByEmail(currentUserEmail);

  if (response.status !== "success") {

    window.location.href = "login.html";
    return;

  }

  const loggedInUser =
    response.user;

  console.log("PROFILE USER:", loggedInUser);

  /* ================= SIDEBAR ================= */

  const sidebarName =
    document.querySelector(".sidebar-header strong");

  const sidebarCourse =
    document.querySelector(".sidebar-header small");

  const avatar =
    document.querySelector(".avatar");

  if (sidebarName) {

    sidebarName.textContent =
      loggedInUser.name || "Student";

  }

  if (sidebarCourse) {

    sidebarCourse.textContent =
      `B.Sc ${loggedInUser.department || "Student"}`;

  }

  if (avatar) {

    avatar.textContent =
      loggedInUser.name
        ? loggedInUser.name.charAt(0).toUpperCase()
        : "S";

  }

  /* ================= PROFILE MAIN DATA ================= */

  const displayName =
    document.getElementById("displayName");

  const nameDisplay =
    document.getElementById("nameDisplay");

  const displayMatric =
    document.getElementById("displayMatric");

  const displayEmail =
    document.getElementById("displayEmail");

  const displayLevel =
    document.getElementById("displayLevel");

  const displayDept =
    document.getElementById("displayDept");

  const displayFaculty =
    document.getElementById("displayFaculty");

  const displaySession =
    document.getElementById("displaySession");

  /* ================= SET DATA ================= */

  if (displayName) {

    displayName.textContent =
      loggedInUser.name || "Student";

  }

  if (nameDisplay) {

    nameDisplay.textContent =
      loggedInUser.name || "Not Set";

  }

  if (displayMatric) {

    displayMatric.textContent =
      loggedInUser.matricNo || "N/A";

  }

  if (displayEmail) {

    displayEmail.textContent =
      loggedInUser.email || "N/A";

  }

  if (displayLevel) {

    displayLevel.textContent =
      loggedInUser.level || "100L";

  }

  if (displayDept) {

    displayDept.textContent =
      loggedInUser.department || "N/A";

  }

  if (displayFaculty) {

    displayFaculty.textContent =
      loggedInUser.faculty || "N/A";

  }

  if (displaySession) {

    displaySession.textContent =
      loggedInUser.session || "2025/2026";

  }

  /* ================= PROFILE STATS ================= */

  const statValues =
    document.querySelectorAll(".stat-value");

  if (statValues[0]) {

    statValues[0].textContent =
      loggedInUser.level || "100L";

  }

  if (statValues[1]) {

    statValues[1].textContent =
      loggedInUser.faculty || "Computing";

  }

  /* ================= BIO ================= */

  const bioDisplay =
    document.getElementById("bioDisplay");

  const bioTextarea =
    document.getElementById("bioTextarea");

  const bioCounter =
    document.getElementById("bioCounter");

  if (bioDisplay) {

    bioDisplay.textContent =
      loggedInUser.bio ||
      "No bio added yet.";

  }

  if (bioTextarea) {

    bioTextarea.value =
      loggedInUser.bio || "";

  }

  if (bioCounter) {

    bioCounter.textContent =
      `${bioTextarea.value.length}/500`;

  }

  bioTextarea?.addEventListener("input", () => {

    bioCounter.textContent =
      `${bioTextarea.value.length}/500`;

  });

  /* ================= PROFILE IMAGE ================= */

  const avatarInput =
    document.getElementById("avatarInput");

  const profileAvatar =
    document.getElementById("profileAvatar");

  const avatarPlaceholder =
    document.getElementById("avatarPlaceholder");

  // LOAD SAVED IMAGE
  if (loggedInUser.avatar) {

    profileAvatar.src =
      loggedInUser.avatar;

    profileAvatar.style.display =
      "block";

    avatarPlaceholder.style.display =
      "none";

  }

  // CHANGE IMAGE
  avatarInput?.addEventListener(
    "change",
    (e) => {

      const file =
        e.target.files[0];

      if (!file) return;

      const reader =
        new FileReader();

      reader.onload = function(event) {

        const image =
          event.target.result;

        profileAvatar.src = image;

        profileAvatar.style.display =
          "block";

        avatarPlaceholder.style.display =
          "none";

        // SAVE IMAGE
        saveUserData("avatar", image);

      };

      reader.readAsDataURL(file);

    }
  );

  /* ================= EDIT PERSONAL INFO ================= */

  const editButtons =
    document.querySelectorAll(".btn-edit");

  const saveButtons =
    document.querySelectorAll(".btn-save");

  const cancelButtons =
    document.querySelectorAll(".btn-cancel");

  editButtons.forEach(btn => {

    btn.addEventListener("click", () => {

      const card =
        btn.closest(".info-card");

      card.querySelectorAll(".edit-field")
        .forEach(field => {

          field.style.display =
            "block";

        });

      btn.style.display = "none";

      card.querySelector(".btn-save")
        .style.display = "inline-flex";

      card.querySelector(".btn-cancel")
        .style.display = "inline-flex";

    });

  });

  cancelButtons.forEach(btn => {

    btn.addEventListener("click", () => {

      location.reload();

    });

  });

  saveButtons.forEach(btn => {

    btn.addEventListener("click", () => {

      const card =
        btn.closest(".info-card");

      const inputs =
        card.querySelectorAll(
          "input, select"
        );

      inputs.forEach(input => {

        let field =
          input.closest(".info-item")
          .dataset.field;

        let value =
          input.value;

        switch(field) {

          case "name":

            saveUserData("name", value);

            break;

          case "matric":

            saveUserData("matricNo", value);

            break;

          case "email":

            saveUserData("email", value);

            break;

          case "level":

            saveUserData("level", value);

            break;

          case "department":

            saveUserData("department", value);

            break;

          case "faculty":

            saveUserData("faculty", value);

            break;

          case "session":

            saveUserData("session", value);

            break;

        }

      });

      showToast(
        "Profile updated successfully",
        "success"
      );

      setTimeout(() => {

        location.reload();

      }, 1000);

    });

  });

  /* ================= BIO EDIT ================= */

  const bioEditBtn =
    document.getElementById("bioEditBtn");

  const bioSaveBtn =
    document.getElementById("bioSaveBtn");

  const bioCancelBtn =
    document.getElementById("bioCancelBtn");

  bioEditBtn?.addEventListener(
    "click",
    () => {

      bioTextarea.style.display =
        "block";

      bioDisplay.style.display =
        "none";

      bioEditBtn.style.display =
        "none";

      bioSaveBtn.style.display =
        "inline-flex";

      bioCancelBtn.style.display =
        "inline-flex";

    }
  );

  bioSaveBtn?.addEventListener(
    "click",
    () => {

      saveUserData(
        "bio",
        bioTextarea.value
      );

      showToast(
        "Bio updated",
        "success"
      );

      setTimeout(() => {

        location.reload();

      }, 1000);

    }
  );

  bioCancelBtn?.addEventListener(
    "click",
    () => {

      location.reload();

    }
  );

  /* ================= SAVE USER DATA ================= */

  function saveUserData(field, value) {

    let users =
      JSON.parse(
        localStorage.getItem("users")
      ) || [];

    users = users.map(user => {

      if (user.email === currentUserEmail) {

        user[field] = value;

      }

      return user;

    });

    localStorage.setItem(
      "users",
      JSON.stringify(users)
    );

  }

  /* ================= MOBILE SIDEBAR ================= */

  const menuToggle =
    document.getElementById("menuToggle");

  const sidebar =
    document.querySelector(".sidebar");

  menuToggle?.addEventListener(
    "click",
    () => {

      sidebar.classList.toggle("active");

    }
  );

  /* ================= TOAST ================= */

  function showToast(message, type = "info") {

    const toast =
      document.createElement("div");

    toast.className =
      `toast ${type}`;

    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #111827;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 10px;
      z-index: 9999;
      font-weight: 500;
    `;

    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {

      toast.remove();

    }, 3000);

  }

});
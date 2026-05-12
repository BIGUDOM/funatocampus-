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

  // ============ NOTES STATE & DOM ============
  const STORAGE_KEY = 'funato_notes';
  let notes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  
  const form = document.getElementById('noteForm');
  const titleInput = document.getElementById('noteTitle');
  const contentInput = document.getElementById('noteContent');
  const categorySelect = document.getElementById('noteCategory');
  const notesGrid = document.getElementById('notesGrid');
  const emptyState = document.getElementById('emptyState');
  const charCounter = document.getElementById('charCounter');

  // ============ RENDER NOTES ============
  function renderNotes() {
    notesGrid.innerHTML = '';
    
    if (notes.length === 0) {
      emptyState.style.display = 'block';
      return;
    }
    emptyState.style.display = 'none';

    // Sort newest first
    const sorted = [...notes].reverse();
    
    sorted.forEach(note => {
      const card = document.createElement('div');
      card.className = 'note-card';
      card.dataset.id = note.id;
      card.dataset.category = note.category;
      
      const dateStr = new Date(note.created).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      
      card.innerHTML = `
        <div class="note-header">
          <div>
            <h3 class="note-title">${escapeHtml(note.title)}</h3>
            <span class="note-category cat-${note.category}">${note.category}</span>
          </div>
        </div>
        <div class="note-content">${escapeHtml(note.content)}</div>
        <div class="note-footer">
          <span class="note-date">${dateStr}</span>
          <div class="note-actions">
            <button class="note-btn edit" title="Edit"><i class="fa-solid fa-pen"></i></button>
            <button class="note-btn delete" title="Delete"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      `;
      notesGrid.appendChild(card);
    });

    attachNoteActions();
  }

  // ============ ADD NOTE ============
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const category = categorySelect.value;

    if (!title || !content) {
      showToast('Title and content are required', 'error');
      return;
    }

    const newNote = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      title,
      content,
      category,
      created: new Date().toISOString()
    };

    notes.push(newNote);
    saveNotes();
    renderNotes();
    showToast('Note saved successfully!', 'success');
    form.reset();
    updateCharCounter();
  });

  // ============ EDIT & DELETE ACTIONS ============
  function attachNoteActions() {
    document.querySelectorAll('.note-btn.edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.closest('.note-card').dataset.id;
        const note = notes.find(n => n.id === id);
        if (!note) return;

        titleInput.value = note.title;
        contentInput.value = note.content;
        categorySelect.value = note.category;
        updateCharCounter();
        
        // Remove old note
        notes = notes.filter(n => n.id !== id);
        saveNotes();
        renderNotes();
        showToast('Editing note... Update and save again', 'info');
        titleInput.focus();
      });
    });

    document.querySelectorAll('.note-btn.delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.closest('.note-card').dataset.id;
        if (confirm('Delete this note permanently?')) {
          notes = notes.filter(n => n.id !== id);
          saveNotes();
          renderNotes();
          showToast('Note deleted', 'info');
        }
      });
    });
  }

  // ============ HELPERS ============
  function saveNotes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function updateCharCounter() {
    const len = contentInput.value.length;
    const max = 1500;
    charCounter.textContent = `${len}/${max}`;
    charCounter.className = `char-counter ${len > max * 0.8 ? 'warning' : ''} ${len >= max ? 'limit' : ''}`;
    if (len >= max) {
      contentInput.value = contentInput.value.substring(0, max);
    }
  }

  contentInput.addEventListener('input', updateCharCounter);

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
  renderNotes();
  updateCharCounter();

  // Active link highlight
  const currentPath = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href')?.includes('notes')) link.classList.add('active');
  });

  // Keyboard shortcut: Ctrl/Cmd + Enter to save
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      form.dispatchEvent(new Event('submit'));
    }
  });
});
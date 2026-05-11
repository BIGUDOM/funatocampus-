document.addEventListener('DOMContentLoaded', () => {

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

  /* ================= GET LOGGED IN USER ================= */

  let currentUserEmail =
    localStorage.getItem("currentUser");

  // REMOVE EXTRA QUOTES
  if (currentUserEmail) {

    currentUserEmail =
      currentUserEmail.replace(/"/g, "").trim();

  }

  const response =
    getUserByEmail(currentUserEmail);

  console.log("Logged In User Data:", response);

  if (response.status !== "success") {

    window.location.href = "login.html";
    return;

  }

  const loggedInUser = response.user;

  console.log("Actual User:", loggedInUser);

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

    sidebarCourse.textContent =
      `B.Sc ${loggedInUser.department || "Student"}`;

  }

  if (avatar) {

    avatar.textContent =
      loggedInUser.name.charAt(0).toUpperCase();

  }

  /* ================= DYNAMIC TIMETABLE ================= */

  const timetableData =
    loggedInUser.timetable || [

      {
        day: "Monday",
        course: "CYB 103 - Web Development",
        time: "9:00 AM - 11:00 AM",
        venue: "ETF Hall"
      },

      {
        day: "Tuesday",
        course: "MTH 101 - Calculus I",
        time: "10:00 AM - 12:00 PM",
        venue: "Lecture Theatre 2"
      },

      {
        day: "Wednesday",
        course: "GST 111 - Use of English",
        time: "8:00 AM - 10:00 AM",
        venue: "CBN Hall"
      },

      {
        day: "Thursday",
        course: "CSC 102 - Programming Fundamentals",
        time: "12:00 PM - 2:00 PM",
        venue: "Computer Lab A"
      },

      {
        day: "Friday",
        course: "PHY 101 - Mechanics",
        time: "2:00 PM - 4:00 PM",
        venue: "Science Lecture Hall"
      }

    ];

  /* ================= RENDER TABLE ================= */

  const tableBody =
    document.querySelector(".timetable-table tbody");

  if (tableBody) {

    tableBody.innerHTML = "";

    timetableData.forEach(item => {

      tableBody.innerHTML += `

        <tr data-day="${item.day}">

          <td>
            <strong>${item.day}</strong>
          </td>

          <td>${item.course}</td>

          <td>
            <span class="time-badge">
              <i class="fa-regular fa-clock"></i>
              ${item.time}
            </span>
          </td>

          <td>
            <span class="venue-badge">
              <i class="fa-solid fa-location-dot"></i>
              ${item.venue}
            </span>
          </td>

        </tr>

      `;

    });

  }

  /* ================= RENDER MOBILE CARDS ================= */

  const cardContainer =
    document.querySelector(".timetable-cards");

  if (cardContainer) {

    cardContainer.innerHTML = "";

    timetableData.forEach(item => {

      cardContainer.innerHTML += `

        <div class="timetable-card" data-day="${item.day}">

          <div class="card-header">

            <span class="card-day">
              ${item.day}
            </span>

            <span class="card-time">
              ${item.time}
            </span>

          </div>

          <div class="card-course">
            ${item.course}
          </div>

          <div class="card-venue">

            <i class="fa-solid fa-location-dot"></i>

            ${item.venue}

          </div>

        </div>

      `;

    });

  }

  /* ================= SIDEBAR ================= */

  const menuToggle =
    document.getElementById('menuToggle');

  const sidebar =
    document.querySelector('.sidebar');

  const overlay =
    document.createElement('div');

  overlay.className = 'sidebar-overlay';

  document.body.appendChild(overlay);

  function toggleSidebar() {

    sidebar.classList.toggle('active');

    overlay.classList.toggle('active');

  }

  menuToggle?.addEventListener(
    'click',
    toggleSidebar
  );

  overlay.addEventListener(
    'click',
    toggleSidebar
  );

  /* ================= FILTERS ================= */

  const searchInput =
    document.querySelector('.search-box input');

  const dayTabs =
    document.querySelectorAll('.day-tab');

  function filterTimetable(dayFilter, searchQuery) {

    const rows =
      document.querySelectorAll(
        '.timetable-table tbody tr'
      );

    const cards =
      document.querySelectorAll(
        '.timetable-card'
      );

    let visible = 0;

    rows.forEach(row => {

      const rowDay =
        row.dataset.day.toLowerCase();

      const rowText =
        row.innerText.toLowerCase();

      const matchDay =
        dayFilter === "all" ||
        rowDay === dayFilter;

      const matchSearch =
        rowText.includes(searchQuery);

      if (matchDay && matchSearch) {

        row.style.display = "";
        visible++;

      } else {

        row.style.display = "none";

      }

    });

    cards.forEach(card => {

      const cardDay =
        card.dataset.day.toLowerCase();

      const cardText =
        card.innerText.toLowerCase();

      const matchDay =
        dayFilter === "all" ||
        cardDay === dayFilter;

      const matchSearch =
        cardText.includes(searchQuery);

      if (matchDay && matchSearch) {

        card.style.display = "";

      } else {

        card.style.display = "none";

      }

    });

    const emptyState =
      document.getElementById("emptyTimetable");

    if (emptyState) {

      emptyState.style.display =
        visible > 0 ? "none" : "block";

    }

  }

  /* ================= DAY TABS ================= */

  dayTabs.forEach(tab => {

    tab.addEventListener("click", () => {

      dayTabs.forEach(t =>
        t.classList.remove("active")
      );

      tab.classList.add("active");

      filterTimetable(
        tab.dataset.day.toLowerCase(),
        searchInput.value.toLowerCase()
      );

    });

  });

  /* ================= SEARCH ================= */

  searchInput?.addEventListener(
    "input",
    e => {

      const activeTab =
        document.querySelector(".day-tab.active");

      const day =
        activeTab.dataset.day.toLowerCase();

      filterTimetable(
        day,
        e.target.value.toLowerCase()
      );

    }
  );

  /* ================= PRINT ================= */

  const printBtn =
    document.getElementById("printTimetable");

  printBtn?.addEventListener(
    "click",
    () => window.print()
  );

});
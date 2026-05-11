# Student Portal Dashboard 🎓

A modern student portal and campus dashboard built with **HTML, CSS, and JavaScript**.  
This project includes authentication, student profiles, timetable management, GPA display, announcements, and responsive dashboard features using **localStorage** for data persistence.

---

## ✨ Features

- 🔐 Student Registration & Login
- 👤 Dynamic Student Profile
- 📚 Course Management UI
- 🗓️ Timetable Page
- 📊 GPA & CGPA Dashboard
- 📢 Announcements Section
- 📱 Fully Responsive Design
- 🌙 Modern UI/UX
- 💾 localStorage Data Persistence
- 🔎 Search & Filter Features
- 📷 Avatar Upload Support
- 🚪 Logout System

---

## 🛠️ Built With

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Font Awesome Icons
- Google Fonts (Poppins)

---

## 📂 Project Structure

```bash
project-folder/
│
├── dashboard.html
├── login.html
├── signup.html
├── profile.html
├── timetable.html
├── logout.html
│
├── assets/
│   ├── css/
│   │   └── dashboard.css
│   │
│   └── js/
│       ├── script.js
│       ├── dashboard.js
│       ├── profile.js
│       └── time.js
│
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/BIGUDOM/student-portal-dashboard.git
```

### 2. Open the project

Open the folder in:

- VS Code
- Sublime Text
- Any code editor

---

### 3. Run the project

Use **Live Server** in VS Code or open `index.html` directly in your browser.

---

## 🔑 Authentication System

This project uses:

```javascript
localStorage
```

to store:

- Registered users
- Logged in user session
- Profile data
- Timetable/course information

Example:

```javascript
localStorage.setItem("users", JSON.stringify(users));
localStorage.setItem("currentUser", email);
```

---

## 👤 Demo User Flow

1. Create account
2. Login
3. Redirect to dashboard
4. View/Edit profile
5. Access timetable & courses
6. Logout safely

---

## 📱 Responsive Design

The dashboard works on:

- Desktop 💻
- Tablet 📱
- Mobile 📲

Includes:

- Collapsible sidebar
- Mobile menu toggle
- Responsive tables/cards

---

## 🎯 Future Improvements

- Backend Integration
- Database Support
- Email Verification
- Real Authentication
- Admin Dashboard
- Notifications API
- Dark Mode
- Cloud Storage

---

## ⚠️ Important Note

This project currently uses **localStorage** only and is intended for:

- Learning purposes
- Frontend practice
- UI/UX demonstrations

It is **not production-ready authentication**.

---

## 📸 Screenshots

Add screenshots here:

```md
![Dashboard Screenshot](./screenshots/dashboard.png)
```

---

## 🤝 Contributing

Contributions are welcome.

Fork the project and create a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Developed by **Udom Blessing**

GitHub: https://github.com/BIGUDOM
---

## ⭐ Support

If you like this project:

- Star the repository ⭐
- Fork it 🍴
- Share it 🚀

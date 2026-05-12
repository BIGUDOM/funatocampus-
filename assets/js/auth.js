document.addEventListener('DOMContentLoaded', () => {

  // ============ PASSWORD VISIBILITY TOGGLE (Signup) ============
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');

  if (togglePassword && passwordInput) {

    togglePassword.addEventListener('click', () => {

      const type =
        passwordInput.type === 'password'
          ? 'text'
          : 'password';

      passwordInput.type = type;

      togglePassword.classList.toggle('active');

      togglePassword.textContent =
        type === 'password'
          ? '👁️'
          : '👁️‍🗨️';

    });

  }

  // ============ PASSWORD VISIBILITY TOGGLE (Login) ============
  const loginToggle = document.querySelector('.password-toggle');
  const loginPassword = document.getElementById('loginPassword');

  if (loginToggle && loginPassword) {

    loginToggle.addEventListener('click', () => {

      const type =
        loginPassword.type === 'password'
          ? 'text'
          : 'password';

      loginPassword.type = type;

      loginToggle.classList.toggle('active');

    });

  }

  // ============ FLOATING LABELS FIX FOR AUTOFILL ============
  const inputs = document.querySelectorAll(
    '.form-input, .form-select'
  );

  inputs.forEach(input => {

    input.addEventListener('animationstart', (e) => {

      if (e.animationName === 'onAutoFillStart') {
        input.classList.add('filled');
      }

    });

    input.addEventListener('paste', () => {

      setTimeout(() => {

        if (input.value) {
          input.classList.add('filled');
        }

      }, 100);

    });

  });

  // ============ PASSWORD STRENGTH ============
  const strengthBar = document.querySelector(
    '.password-strength-bar'
  );

  if (passwordInput && strengthBar) {

    passwordInput.addEventListener('input', () => {

      const value = passwordInput.value;

      let strength = 0;

      if (value.length >= 6) strength++;
      if (value.length >= 10) strength++;

      if (
        /[A-Z]/.test(value) &&
        /[a-z]/.test(value)
      ) strength++;

      if (/\d/.test(value)) strength++;

      if (/[^A-Za-z0-9]/.test(value)) strength++;

      strengthBar.parentElement.classList.add('visible');

      if (strength <= 2) {

        strengthBar.className =
          'password-strength-bar weak';

      } else if (strength <= 4) {

        strengthBar.className =
          'password-strength-bar medium';

      } else {

        strengthBar.className =
          'password-strength-bar strong';

      }

    });

  }

  // ============ DYNAMIC FACULTY/DEPARTMENT ============
  const facultySelect =
    document.getElementById('faculty');

  const departmentSelect =
    document.getElementById('dpt');

  if (facultySelect && departmentSelect) {

    const faculties = {

      'Computing': [
        'Computer Science',
        'Cyber Security',
        'Software Engineering',
        'Information Technology'
      ],

      'Science': [
        'Mathematics',
        'Physics',
        'Chemistry',
        'Microbiology',
        'Biochemistry'
      ],

      'Engineering': [
        'Mechanical Engineering',
        'Electrical Engineering',
        'Civil Engineering'
      ],

      'Agriculture': [
        'Agricultural Economics',
        'Crop Production',
        'Animal Science',
        'Fisheries'
      ]

    };

    Object.keys(faculties).forEach(fac => {

      const opt = document.createElement('option');

      opt.value = fac;
      opt.textContent = fac;

      facultySelect.appendChild(opt);

    });

    facultySelect.addEventListener('change', () => {

      departmentSelect.innerHTML =
        '<option value="" disabled selected>Select Department</option>';

      const selected = facultySelect.value;

      if (selected && faculties[selected]) {

        faculties[selected].forEach(dept => {

          const opt =
            document.createElement('option');

          opt.value = dept;
          opt.textContent = dept;

          departmentSelect.appendChild(opt);

        });

      }

    });

  }

  // ============ SIGNUP FORM ============
  const signUpForm =
    document.getElementById('signupForm');

  if (signUpForm) {

    signUpForm.addEventListener('submit', (e) => {

      e.preventDefault();

      const name =
        document.getElementById("fullName").value.trim();

      const email =
        document.getElementById("email").value.trim();

      const level =
        document.getElementById("level").value.trim();

      const matricNo =
        document.getElementById("matricNo").value.trim();

      const faculty =
        document.getElementById("faculty").value.trim();

      const dpt =
        document.getElementById("dpt").value.trim();

      const bio =
        document.getElementById("bio").value.trim();

      const pass =
        document.getElementById("password").value.trim();

      // ============ VALIDATION ============
      if (!name || !email || !pass) {

        showError(
          signUpForm,
          "Name, Email and Password are required fields"
        );

        return;

      }

      // Email validation
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {

        showError(
          signUpForm,
          "Please enter a valid email address"
        );

        return;

      }

      // Password validation
      if (pass.length < 6) {

        showError(
          signUpForm,
          "Password must be at least 6 characters"
        );

        return;

      }

      // ============ USER OBJECT ============
      const u = {

        name: name,
        email: email,
        level: level,
        matricNo: matricNo,
        faculty: faculty,
        department: dpt,
        bio: bio,
        password: pass

      };

      const signupBtn =
        document.getElementById("registerBtn");

      setLoading(signupBtn, "Registering...");

      try {

        const response =
          saveRegisteredUser(u);

        clearLoading(signupBtn);

        if (response.status === "success") {

          showToast(
            response.message ||
            "Registration successful",
            "success"
          );

          signUpForm.reset();

          setTimeout(() => {

            window.location.href =
              'login.html';

          }, 1000);

        } else {

          showToast(
            response.message,
            "error"
          );

        }

      } catch (error) {

        clearLoading(signupBtn);

        console.error(error);

        showToast(
          "An error occurred during registration",
          "error"
        );

      }

    });

  }

  // ============ LOGIN FORM ============
  const loginForm =
    document.getElementById('loginForm');

  if (loginForm) {

    loginForm.addEventListener('submit', (e) => {

      e.preventDefault();

      const email =
        document.getElementById("loginEmail").value.trim();

      const password =
        document.getElementById("loginPassword").value.trim();

      if (!email || !password) {

        showError(
          loginForm,
          "Email and Password are required"
        );

        return;

      }

      const loginBtn =
        loginForm.querySelector(
          'button[type="submit"]'
        );

      setLoading(loginBtn, "Logging in...");

      try {

        const response =
          loginUser(email, password);

        clearLoading(loginBtn);

        if (response.status === "success") {

          showToast(
            response.message,
            "success"
          );

         localStorage.setItem(
   "currentUser",
   response.user.email
);

          setTimeout(() => {

            window.location.href =
              "dashboard.html";

          }, 1000);

        } else {

          showToast(
            response.message,
            "error"
          );

        }

      } catch (error) {

        clearLoading(loginBtn);

        console.error(error);

        showToast(
          "Login failed",
          "error"
        );

      }

    });

  }

  // ============ RESET PASSWORD ============
  const resetLink =
    document.getElementById('reset-link');

  if (resetLink) {

    resetLink.addEventListener('click', (e) => {

      e.preventDefault();

      const email = prompt(
        'Enter your registered email:'
      );

      if (
        email &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ) {

        showToast(
          'Password reset link sent to ' + email,
          'success'
        );

      } else if (email) {

        showToast(
          'Please enter a valid email',
          'error'
        );

      }

    });

  }

});


// ============ LOADING FUNCTIONS ============
function setLoading(button, text = "Processing...") {

  if (!button) return;

  button.disabled = true;

  button.dataset.originalText =
    button.innerHTML;

  button.innerHTML = `
    <span class="spinner"></span> ${text}
  `;

}

function clearLoading(button) {

  if (!button) return;

  button.disabled = false;

  button.innerHTML =
    button.dataset.originalText;

}


// ============ SHOW ERROR ============
function showError(form, message) {

  let errorDiv =
    form.querySelector('.form-error-global');

  if (!errorDiv) {

    errorDiv = document.createElement('div');

    errorDiv.className =
      'form-error-global';

    errorDiv.style.cssText = `
      background: rgba(239,68,68,.15);
      border: 1px solid red;
      border-radius: 10px;
      padding: 12px;
      margin-bottom: 15px;
      color: white;
      text-align: center;
    `;

    form.prepend(errorDiv);

  }

  errorDiv.textContent = message;

}


// ============ TOAST ============
function showToast(message, type = "info") {

  const toast =
    document.createElement('div');

  toast.className =
    `toast ${type}`;

  toast.innerHTML = `
    <span>
      ${type === "success"
        ? "✓"
        : type === "error"
        ? "✕"
        : "ℹ"}
    </span>
    ${message}
  `;

  document.body.appendChild(toast);

  setTimeout(() => {

    toast.remove();

  }, 3000);

}


// ============ SAVE REGISTERED USER ============
function saveRegisteredUser(userData) {

  let users = JSON.parse(
    localStorage.getItem("users")
  );

  // Ensure users is always an array
  if (!Array.isArray(users)) {
    users = [];
  }

  const existingUser = users.find(
    user => user.email === userData.email
  );

  if (existingUser) {

    return {
      status: "error",
      message: "Email already registered"
    };

  }

  users.push(userData);

  localStorage.setItem(
    "users",
    JSON.stringify(users)
  );

  return {
    status: "success",
    message: "Account created successfully"
  };

}


// ============ LOGIN USER ============
function loginUser(email, password) {

  let users = JSON.parse(localStorage.getItem("users"));

  // Ensure users is always an array
  if (!Array.isArray(users)) {
    users = [];
  }

  const foundUser = users.find(user =>
    user.email === email &&
    user.password === password
  );

  if (foundUser) {

    localStorage.setItem(
      "loggedInUser",
      JSON.stringify(foundUser)
    );

    localStorage.setItem(
      "currentUser",
      foundUser.email
    );

    return {
      status: "success",
      message: "Login successful",
      user: foundUser
    };

  }

  return {
    status: "error",
    message: "Incorrect email or password"
  };

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


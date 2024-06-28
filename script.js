document.addEventListener('DOMContentLoaded', () => {
    // Signup Form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // User Details Form
    const userDetailsForm = document.getElementById('userDetailsForm');
    if (userDetailsForm) {
        userDetailsForm.addEventListener('submit', handleUserDetailsSubmission);
    }

    // Admin Dashboard
    const userTable = document.getElementById('userTable');
    if (userTable) {
        displayUserTable();
        userTable.addEventListener('click', handleUserTableClick);
    }

    // Function to handle signup form submission
    function handleSignup(event) {
        event.preventDefault();
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const role = document.getElementById('signupRole').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if the email already exists
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            alert('Email already exists. Please use a different email.');
            return;
        }

        users.push({ email, password, role });
        localStorage.setItem('users', JSON.stringify(users));

        alert('Signup successful!');
        window.location.href = 'login.html';
    }

    // Function to handle login form submission
    function handleLogin(event) {
        event.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const role = document.getElementById('loginRole').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.email === email && user.password === password && user.role === role);

        if (user) {
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            if (role === 'user') {
                window.location.href = 'user.html';
            } else if (role === 'admin') {
                window.location.href = 'admin.html';
            }
        } else {
            alert('Invalid login credentials!');
        }
    }

    // Function to handle user details form submission
    function handleUserDetailsSubmission(event) {
        event.preventDefault();
        const name = document.getElementById('userName').value;
        const employeeId = document.getElementById('employeeId').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const email = document.getElementById('userEmail').value;
        const jobRole = document.getElementById('jobRole').value;

        const userDetails = { name, employeeId, phoneNumber, email, jobRole };

        localStorage.setItem(`userDetails_${email}`, JSON.stringify(userDetails));

        alert('Details submitted successfully!');
    }

    // Function to load user details
    function loadUserDetails(email) {
        const storedUserDetails = JSON.parse(localStorage.getItem(`userDetails_${email}`));
        if (storedUserDetails) {
            document.getElementById('userName').value = storedUserDetails.name || '';
            document.getElementById('employeeId').value = storedUserDetails.employeeId || '';
            document.getElementById('phoneNumber').value = storedUserDetails.phoneNumber || '';
            document.getElementById('userEmail').value = storedUserDetails.email || '';
            document.getElementById('jobRole').value = storedUserDetails.jobRole || '';
        }
    }

    // Function to handle session form submission
    function handleSessionSubmission(event) {
        event.preventDefault();
        const notes = document.getElementById('sessionNotes').value;
        const date = new Date().toLocaleDateString();
        const sessionData = { notes, date };

        let sessions = JSON.parse(localStorage.getItem(`sessions_${loggedInUser.email}`)) || [];
        sessions.push(sessionData);
        localStorage.setItem(`sessions_${loggedInUser.email}`, JSON.stringify(sessions));

        document.getElementById('sessionNotes').value = '';
        alert('Session saved successfully!');
        displaySessions(loggedInUser.email);
    }

    // Function to display sessions
    function displaySessions(email) {
        const sessions = JSON.parse(localStorage.getItem(`sessions_${email}`)) || [];
        const savedSessionsDiv = document.getElementById('savedSessions');
        savedSessionsDiv.innerHTML = '';

        sessions.forEach(session => {
            const sessionDiv = document.createElement('div');
            sessionDiv.classList.add('session');
            sessionDiv.innerHTML = `
                <h5>Date: ${session.date}</h5>
                <p>${session.notes}</p>
                <hr>
            `;
            savedSessionsDiv.appendChild(sessionDiv);
        });
    }

    // Function to display user table in admin dashboard
    function displayUserTable() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const tbody = userTable.querySelector('tbody');
        tbody.innerHTML = ''; // Clear existing rows

        users.forEach(user => {
            const userDetails = JSON.parse(localStorage.getItem(`userDetails_${user.email}`)) || {};
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.email}</td>
                <td>${userDetails.name || ''}</td>
                <td>${userDetails.employeeId || ''}</td>
                <td>${userDetails.phoneNumber || ''}</td>
                <td>${userDetails.jobRole || ''}</td>
                <td>
                    <button class="btn btn-warning edit-user" data-email="${user.email}">Edit</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Function to handle clicks on edit buttons in user table
    function handleUserTableClick(event) {
        if (event.target.classList.contains('edit-user')) {
            const email = event.target.getAttribute('data-email');
            showEditModal(email);
        }
    }

    // Function to show edit modal with user details for editing
    function showEditModal(email) {
        const userDetails = JSON.parse(localStorage.getItem(`userDetails_${email}`)) || {};
        document.getElementById('editUserName').value = userDetails.name || '';
        document.getElementById('editEmployeeId').value = userDetails.employeeId || '';
        document.getElementById('editPhoneNumber').value = userDetails.phoneNumber || '';
        document.getElementById('editUserEmail').value = email;
        document.getElementById('editJobRole').value = userDetails.jobRole || '';
        $('#userModal').modal('show');

        // Set the email in the delete button data attribute
        document.getElementById('deleteUserButton').setAttribute('data-email', email);
    }

    // Function to handle edit user form submission
    const editUserForm = document.getElementById('editUserForm');
    if (editUserForm) {
        editUserForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const email = document.getElementById('editUserEmail').value;
            const name = document.getElementById('editUserName').value;
            const employeeId = document.getElementById('editEmployeeId').value;
            const phoneNumber = document.getElementById('editPhoneNumber').value;
            const jobRole = document.getElementById('editJobRole').value;

            const userDetails = { name, employeeId, phoneNumber, email, jobRole };

            localStorage.setItem(`userDetails_${email}`, JSON.stringify(userDetails));
            $('#userModal').modal('hide');
            location.reload(); // Reload the page to reflect the changes
        });
    }

    // Function to handle delete user
    const deleteUserButton = document.getElementById('deleteUserButton');
    if (deleteUserButton) {
        deleteUserButton.addEventListener('click', function (event) {
            const email = event.target.getAttribute('data-email');

            // Remove user from users array
            let users = JSON.parse(localStorage.getItem('users')) || [];
            users = users.filter(user => user.email !== email);
            localStorage.setItem('users', JSON.stringify(users));

            // Remove user details
            localStorage.removeItem(`userDetails_${email}`);

            $('#userModal').modal('hide');
            location.reload(); // Reload the page to reflect the changes
        });
    }
});

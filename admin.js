
// School records
let students = JSON.parse(localStorage.getItem("gs_students")) || [];
let teachers = JSON.parse(localStorage.getItem("gs_teachers")) || [];

let currentType = "";
let editingId = null;

// Navigation
function showPage(pageId, button) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    document.getElementById(pageId).classList.add("active");

    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.remove("active");
    });

    button.classList.add("active");

    if (pageId === "dashboard") updateDashboard();
}

function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("open");
}

// Modal
function openModal(type, id = null) {
    currentType = type;
    editingId = id;

    const studentFields = document.getElementById("studentFields");
    const teacherFields = document.getElementById("teacherFields");

    studentFields.hidden = type !== "student";
    teacherFields.hidden = type !== "teacher";

    document.getElementById("recordForm").reset();

    const records = type === "student" ? students : teachers;
    const record = id === null ? null :
        records.find(item => item.id === id);

    document.getElementById("modalTitle").textContent =
        (record ? "Edit " : "Add ") +
        (type === "student" ? "Student" : "Teacher");

    if (record) {
        document.getElementById("recordName").value = record.name;

        if (type === "student") {
            document.getElementById("recordGender").value = record.gender;
            document.getElementById("recordClass").value = record.className;
        } else {
            document.getElementById("recordSubject").value = record.subject;
            document.getElementById("recordPhone").value = record.phone;
        }
    }

    document.getElementById("recordModal").classList.add("show");
}

function closeModal() {
    document.getElementById("recordModal").classList.remove("show");
}

// Save records
document.getElementById("recordForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("recordName").value.trim();

    if (!name) return;

    const records = currentType === "student" ? students : teachers;

    const data = {
        id: editingId || Date.now(),
        name: name
    };

    if (currentType === "student") {
        data.gender = document.getElementById("recordGender").value;
        data.className = document.getElementById("recordClass").value.trim();
    } else {
        data.subject = document.getElementById("recordSubject").value.trim();
        data.phone = document.getElementById("recordPhone").value.trim();
    }

    if (editingId !== null) {
        const index = records.findIndex(item => item.id === editingId);
        records[index] = data;
    } else {
        records.push(data);
    }

    saveRecords();
    closeModal();
    updateDashboard();
    renderStudents();
    renderTeachers();
});

// Save to browser storage
function saveRecords() {
    localStorage.setItem("gs_students", JSON.stringify(students));
    localStorage.setItem("gs_teachers", JSON.stringify(teachers));
}

// Display students
function renderStudents() {
    const search = document.getElementById("studentSearch").value.toLowerCase();

    const filtered = students.filter(student =>
        [student.id, student.name, student.gender, student.className]
        .some(value => String(value || "").toLowerCase().includes(search))
    );

    document.getElementById("studentTable").innerHTML =
        filtered.map(student => `
            <tr>
                <td>${student.id}</td>
                <td>${escapeHTML(student.name)}</td>
                <td>${escapeHTML(student.gender)}</td>
                <td>${escapeHTML(student.className)}</td>
                <td>
                    <button class="action-btn edit-btn"
                        onclick="openModal('student',${student.id})">Edit</button>
                    <button class="action-btn delete-btn"
                        onclick="deleteRecord('student',${student.id})">Delete</button>
                </td>
            </tr>
        `).join("") || `<tr><td colspan="5">No students found.</td></tr>`;
}

// Display teachers
function renderTeachers() {
    const search = document.getElementById("teacherSearch").value.toLowerCase();

    const filtered = teachers.filter(teacher =>
        [teacher.id, teacher.name, teacher.subject, teacher.phone]
        .some(value => String(value || "").toLowerCase().includes(search))
    );

    document.getElementById("teacherTable").innerHTML =
        filtered.map(teacher => `
            <tr>
                <td>${teacher.id}</td>
                <td>${escapeHTML(teacher.name)}</td>
                <td>${escapeHTML(teacher.subject)}</td>
                <td>${escapeHTML(teacher.phone)}</td>
                <td>
                    <button class="action-btn edit-btn"
                        onclick="openModal('teacher',${teacher.id})">Edit</button>
                    <button class="action-btn delete-btn"
                        onclick="deleteRecord('teacher',${teacher.id})">Delete</button>
                </td>
            </tr>
        `).join("") || `<tr><td colspan="5">No teachers found.</td></tr>`;
}

// Protect text displayed in HTML
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// Delete records
function deleteRecord(type, id) {
    if (!confirm("Are you sure you want to delete this record?")) return;

    if (type === "student") {
        students = students.filter(item => item.id !== id);
    } else {
        teachers = teachers.filter(item => item.id !== id);
    }

    saveRecords();
    renderStudents();
    renderTeachers();
    updateDashboard();
}

// Dashboard statistics
function updateDashboard() {
    document.getElementById("studentCount").textContent = students.length;
    document.getElementById("teacherCount").textContent = teachers.length;

    document.getElementById("recentStudents").innerHTML =
        students.slice(-5).reverse().map(student => `
            <tr>
                <td>${student.id}</td>
                <td>${escapeHTML(student.name)}</td>
                <td>${escapeHTML(student.className)}</td>
                <td>${escapeHTML(student.gender)}</td>
            </tr>
        `).join("") || `<tr><td colspan="4">No student records yet.</td></tr>`;
}

// Logout demonstration

function logout() {
    if (confirm("Are you sure you want to logout?")) {
        sessionStorage.removeItem("gs_admin_logged_in");
        window.location.replace("admin-login.html");
    }
}


// Initial loading
updateDashboard();
renderStudents();
renderTeachers();

function logout() {
    if (confirm("Are you sure you want to logout?")) {
        sessionStorage.removeItem("gs_admin_logged_in");
        window.location.href = "index.html";
    }
}

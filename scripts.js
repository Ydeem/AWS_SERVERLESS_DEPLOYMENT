// EDIT with your API endpoints
const POST_API = "https://yjp7n8smga.execute-api.us-east-1.amazonaws.com/Production/insertStudentData";
const GET_API = "https://yjp7n8smga.execute-api.us-east-1.amazonaws.com/Production/getStudents";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("studentForm");
  const messageDiv = document.getElementById("formMessage");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    messageDiv.textContent = "";

    if (!document.getElementById("termsCheckbox").checked) {
      messageDiv.textContent = "Please accept the terms and conditions.";
      messageDiv.style.color = "red";
      return;
    }

    const studentName = document.getElementById("studentName").value.trim();
    const studentAge = document.getElementById("studentAge").value.trim();
    const studentClass = document.getElementById("studentClass").value.trim();
    const studentEmail = document.getElementById("studentEmail").value.trim();

    if (!studentName || !studentAge) {
      messageDiv.textContent = "Name and Age are required.";
      messageDiv.style.color = "red";
      return;
    }

    const payload = {
      studentName,
      studentAge,
      studentClass,
      studentEmail,
    };

    try {
      const response = await fetch(POST_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save student");

      await response.json();

      messageDiv.textContent = "Student saved successfully!";
      messageDiv.style.color = "green";
      form.reset();
      await loadStudents();
    } catch (err) {
      console.error(err);
      messageDiv.textContent = "Error saving student.";
      messageDiv.style.color = "red";
    }
  });

  loadStudents();
});

async function loadStudents() {
  const tbody = document.getElementById("studentsTableBody");
  tbody.innerHTML = "<tr><td colspan='4'>Loading...</td></tr>";

  try {
    const response = await fetch(GET_API);
    if (!response.ok) throw new Error("Failed to load");

    const students = await response.json();

    if (!Array.isArray(students) || students.length === 0) {
      tbody.innerHTML = "<tr><td colspan='4'>No students found</td></tr>";
      return;
    }

    tbody.innerHTML = "";

    students.forEach((s) => {
      const tr = document.createElement("tr");

      const nameTd = document.createElement("td");
      nameTd.textContent = s.studentName || "";
      tr.appendChild(nameTd);

      const ageTd = document.createElement("td");
      ageTd.textContent = s.studentAge || "";
      tr.appendChild(ageTd);

      const classTd = document.createElement("td");
      classTd.textContent = s.studentClass || "";
      tr.appendChild(classTd);

      const emailTd = document.createElement("td");
      emailTd.textContent = s.studentEmail || "";
      tr.appendChild(emailTd);

      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    tbody.innerHTML = "<tr><td colspan='4'>Error loading students</td></tr>";
  }
}

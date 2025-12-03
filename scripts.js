
// EDIT with your API endpoints
const POST_API = "https://yjp7n8smga.execute-api.us-east-1.amazonaws.com/Production/insertStudentData";
const GET_API = "https://yjp7n8smga.execute-api.us-east-1.amazonaws.com/Production/getStudents";


document.addEventListener("DOMContentLoaded", () => {
  const saveBtn = document.getElementById("saveBtn");
  const viewBtn = document.getElementById("viewBtn");

  saveBtn.addEventListener("click", saveStudent);
  viewBtn.addEventListener("click", loadStudents);

  // Optional: load students when page first opens
  // loadStudents();
});

async function saveStudent() {
  const messageDiv = document.getElementById("message");

  const studentId    = document.getElementById("studentId").value.trim();
  const studentName  = document.getElementById("studentName").value.trim();
  const studentClass = document.getElementById("studentClass").value.trim();
  const studentAge   = document.getElementById("studentAge").value.trim();

  if (!studentId || !studentName) {
    messageDiv.textContent = "Student ID and Name are required.";
    messageDiv.style.color = "red";
    return;
  }

  const payload = {
    // make sure your Lambda expects these names:
    studentid: studentId,          // partition key in DynamoDB
    studentName,
    studentClass,
    studentAge
  };

  try {
    const res = await fetch(POST_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("POST result:", data);

    if (!res.ok) throw new Error(data.message || "Error saving");

    messageDiv.textContent = "Student saved successfully!";
    messageDiv.style.color = "green";

    // clear inputs
    document.getElementById("studentId").value = "";
    document.getElementById("studentName").value = "";
    document.getElementById("studentClass").value = "";
    document.getElementById("studentAge").value = "";

    // refresh table
    await loadStudents();
  } catch (err) {
    console.error(err);
    messageDiv.textContent = "Error saving student.";
    messageDiv.style.color = "red";
  }
}

async function loadStudents() {
  const tbody = document.getElementById("studentsTableBody");
  const messageDiv = document.getElementById("message");

  tbody.innerHTML = "<tr><td colspan='4'>Loading...</td></tr>";

  try {
    const res = await fetch(GET_API);
    if (!res.ok) throw new Error("Error loading students");

    const students = await res.json();
    console.log("GET result:", students);

    if (!Array.isArray(students) || students.length === 0) {
      tbody.innerHTML = "<tr><td colspan='4'>No students found</td></tr>";
      return;
    }

    tbody.innerHTML = "";

    students.forEach(s => {
      const tr = document.createElement("tr");

      const idTd = document.createElement("td");
      idTd.textContent = s.studentid || "";
      tr.appendChild(idTd);

      const nameTd = document.createElement("td");
      nameTd.textContent = s.studentName || "";
      tr.appendChild(nameTd);

      const classTd = document.createElement("td");
      classTd.textContent = s.studentClass || "";
      tr.appendChild(classTd);

      const ageTd = document.createElement("td");
      ageTd.textContent = s.studentAge || "";
      tr.appendChild(ageTd);

      tbody.appendChild(tr);
    });

    messageDiv.textContent = "";
  } catch (err) {
    console.error(err);
    tbody.innerHTML = "<tr><td colspan='4'>Error loading students</td></tr>";
    messageDiv.textContent = "Could not load students.";
    messageDiv.style.color = "red";
  }
}

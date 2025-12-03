// scripts.js

// Base invoke URL from API Gateway
const BASE_URL =
  "https://yjp7n8smga.execute-api.us-east-1.amazonaws.com/Production";



// Full endpoints (change paths if your API routes use different names)
const INSERT_URL = "https://yjp7n8smga.execute-api.us-east-1.amazonaws.com/Production/insertStudentData";
const GET_URL = https:"//yjp7n8smga.execute-api.us-east-1.amazonaws.com/Production/getStudents";

$(document).ready(function () {
  // Save student button
  $("#savestudent").click(function () {
    const studentid = $("#studentid").val().trim();
    const name = $("#name").val().trim();
    const studentClass = $("#class").val().trim();
    const age = $("#age").val().trim();

    if (!studentid || !name || !studentClass || !age) {
      $("#studentSaved").text("Please fill in all fields.").css("color", "red");
      return;
    }

    const payload = {
      studentid: studentid,
      name: name,
      class: studentClass,
      age: age,
    };

    $.ajax({
      url: INSERT_URL,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(payload),
      success: function (response) {
        // Response may be a string or object depending on API Gateway settings
        let msg = "Student data saved successfully!";
        try {
          const resObj = typeof response === "string" ? JSON.parse(response) : response;
          if (resObj.message) {
            msg = resObj.message;
          }
        } catch (e) {}

        $("#studentSaved").text(msg).css("color", "green");

        // clear inputs
        $("#studentid").val("");
        $("#name").val("");
        $("#class").val("");
        $("#age").val("");

        // Refresh table after saving
        loadStudents();
      },
      error: function (xhr, status, error) {
        console.log("Error saving student:", error);
        $("#studentSaved")
          .text("Error saving student data.")
          .css("color", "red");
      },
    });
  });

  // View all students button
  $("#getstudents").click(function () {
    loadStudents();
  });
});

// Function to load students and fill the table
function loadStudents() {
  $.ajax({
    url: GET_URL,
    type: "GET",
    success: function (response) {
      // Parse if needed
      let students;
      try {
        students =
          typeof response === "string" ? JSON.parse(response) : response;
      } catch (e) {
        console.log("Error parsing response:", e);
        $("#studentSaved")
          .text("Error loading student data.")
          .css("color", "red");
        return;
      }

      if (!Array.isArray(students)) {
        students = [students];
      }

      const tbody = $("#studentTable tbody");
      tbody.empty();

      if (students.length === 0) {
        $("#studentSaved").text("No students found.").css("color", "red");
        return;
      } else {
        $("#studentSaved").text("").css("color", "");
      }

      students.forEach(function (student) {
        const row = $("<tr></tr>");

        $("<td></td>").text(student.studentid || "").appendTo(row);
        $("<td></td>").text(student.name || "").appendTo(row);
        $("<td></td>").text(student.class || "").appendTo(row);
        $("<td></td>").text(student.age || "").appendTo(row);

        tbody.append(row);
      });
    },
    error: function (xhr, status, error) {
      console.log("Error loading students:", error);
      $("#studentSaved")
        .text("Error loading student data.")
        .css("color", "red");
    },
  });
}

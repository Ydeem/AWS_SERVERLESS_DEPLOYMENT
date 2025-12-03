// Correct API endpoint
var API_ENDPOINT = "https://yemoe9i10j.execute-api.us-east-1.amazonaws.com/prod";


// POST: save student data
document.getElementById("savestudent").onclick = function () {
    var inputData = {
        studentid: $("#studentid").val(),   // partition key
        studentName: $("#name").val(),
        studentClass: $("#class").val(),
        studentAge: $("#age").val()
    };

    console.log("POST payload:", inputData);

    $.ajax({
        url: API_ENDPOINT,
        type: "POST",
        data: JSON.stringify(inputData),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            console.log("POST success:", response);
            document.getElementById("studentSaved").style.color = "green";
            document.getElementById("studentSaved").innerHTML = "Student Data Saved!";

            // Clear fields
            $("#studentid").val("");
            $("#name").val("");
            $("#class").val("");
            $("#age").val("");
        },
        error: function (xhr, status, err) {
            console.error("POST error status:", status);
            console.error("POST error xhr:", xhr.status, xhr.responseText);
            console.error("POST error err:", err);

            document.getElementById("studentSaved").style.color = "red";
            document.getElementById("studentSaved").innerHTML =
                "Error saving student data. HTTP " + xhr.status + " – " + (xhr.responseText || "");
            alert("Error saving student data.");
        }
    });
};

// GET: retrieve all students
document.getElementById("getstudents").onclick = function () {
    $.ajax({
        url: API_ENDPOINT,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            console.log("GET success raw:", response);

            var students = response;

            // If API returns a JSON string, parse it
            if (typeof response === "string") {
                try {
                    students = JSON.parse(response);
                } catch (e) {
                    console.error("JSON parse error:", e);
                    alert("Error reading student data.");
                    return;
                }
            }

            // Clear old rows (keep header)
            $("#studentTable tr").slice(1).remove();

            if (!Array.isArray(students) || students.length === 0) {
                $("#studentTable").append(
                    "<tr><td colspan='4'>No students found</td></tr>"
                );
                return;
            }

            $.each(students, function (i, data) {
                $("#studentTable").append(
                    "<tr>" +
                        "<td>" + (data.studentid || "") + "</td>" +
                        "<td>" + (data.studentName || "") + "</td>" +
                        "<td>" + (data.studentClass || "") + "</td>" +
                        "<td>" + (data.studentAge || "") + "</td>" +
                    "</tr>"
                );
            });
        },
        error: function (xhr, status, err) {
            console.error("GET error status:", status);
            console.error("GET error xhr:", xhr.status, xhr.responseText);
            console.error("GET error err:", err);
            alert("Error retrieving student data.");
        }
    });
};


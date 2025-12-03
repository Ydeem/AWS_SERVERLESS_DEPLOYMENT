// Put your real API endpoint here (same for GET and POST)
var API_ENDPOINT = "https://yjp7n8smga.execute-api.us-east-1.amazonaws.com/Production";
// If your methods are on a path like /students, use:
// var API_ENDPOINT = "https://yjp7n8smga.execute-api.us-east-1.amazonaws.com/Production/students";

// -------------- POST: save student data --------------
document.getElementById("savestudent").onclick = function () {
    // Build the object exactly how your Lambda expects it
    var inputData = {
        "studentid": $("#studentid").val(),       // partition key
        "studentName": $("#name").val(),
        "studentClass": $("#class").val(),
        "studentAge": $("#age").val()
    };

    $.ajax({
        url: API_ENDPOINT,
        type: "POST",
        data: JSON.stringify(inputData),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            console.log("POST success:", response);
            document.getElementById("studentSaved").innerHTML = "Student Data Saved!";

            // Optional: clear inputs
            $("#studentid").val("");
            $("#name").val("");
            $("#class").val("");
            $("#age").val("");
        },
        error: function (xhr, status, err) {
            console.error("POST error:", status, err, xhr.responseText);
            alert("Error saving student data.");
        }
    });
};

// -------------- GET: retrieve all students --------------
document.getElementById("getstudents").onclick = function () {
    $.ajax({
        url: API_ENDPOINT,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            console.log("GET success raw:", response);

            // If API Gateway gives us a string, parse it
            var students = response;
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

            // If no students
            if (!Array.isArray(students) || students.length === 0) {
                $("#studentTable").append(
                    "<tr><td colspan='4'>No students found</td></tr>"
                );
                return;
            }

            // Add a row for each student
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
            console.error("GET error:", status, err, xhr.responseText);
            alert("Error retrieving student data.");
        }
    });
};

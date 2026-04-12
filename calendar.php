<?php

// 2. Include the connection.php file to establish a connection to the database
include "connection.php";

$successMsg = "";
$errorMsg = "";
$eventsFromDB = []; //init a new array to hold the events from the database

// 3. Handle form submission for adding/updating events
if ($_SERVER["REQUEST_METHOD"] === "POST" && ($_POST["action"] ?? "") === "add") {
    $course = trim($_POST["course_name"] ?? "");
    $instructor = trim($_POST["instructor_name"] ?? "");
    $start = $_POST["start_date"] ?? "";
    $end = $_POST["end_date"] ?? "";

    if($course && $instructor && $start && $end) {
        $stmt = $conn->prepare("INSERT INTO appointments (course_name, instructor_name, start_date, end_date) VALUES (?, ?, ?, ?)");

        $stmt->bind_param("ssss", $course, $instructor, $start, $end);

        $stmt->execute();

        $stmt->close();

        header("Location: " . $_SERVER["PHP_SELF"] . "?success=1");
        exit;
    
    } else {
        header("Location: " . $_SERVER["PHP_SELF"] . "?error=1");
        exit;
    }
}

// 4. Handle edit appointment
if ($_SERVER["REQUEST_METHOD"] === "POST" && ($_POST["action"] ?? "") === "edit") {
    $id = $_POST["event_id"] ?? null;
    $course = trim($_POST["course_name"] ?? "");
    $instructor = trim($_POST["instructor_name"] ?? "");
    $start = $_POST["start_date"] ?? "";
    $end = $_POST["end_date"] ?? "";

if($id && $course && $instructor && $start && $end) {
        $stmt = $conn->prepare("UPDATE appointments SET course_name = ?, instructor_name = ?, start_date = ?, end_date = ? WHERE id = ?");
        $stmt->bind_param("ssssi", $course, $instructor, $start, $end, $id);
        $stmt->execute();
        $stmt->close();

        header("Location: " . $_SERVER["PHP_SELF"] . "?success=2");
        exit;
    } else {
        header("Location: " . $_SERVER["PHP_SELF"] . "?error=2");
        exit;
    }
}

// 5. Handle delete appointment
if ($_SERVER["REQUEST_METHOD"] === "POST" && ($_POST["action"] ?? "") === "delete") {
    $id = $_POST["event_id"] ?? null;
    if($id) {
        $stmt = $conn->prepare("DELETE FROM appointments WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $stmt->close();

        header("Location: " . $_SERVER["PHP_SELF"] . "?success=3");
        exit;
    } else {
        header("Location: " . $_SERVER["PHP_SELF"] . "?error=3");
        exit;
    }
}

// 6. Success and error messages
if (isset($_GET["success"])) {
    $successMsg = match($_GET["success"]) {
        "1" => "Event added successfully!",
        "2" => "Event updated successfully!",
        "3" => "Event deleted successfully!",
        default => ""
    };
}

if (isset($_GET["error"])) {
    $errorMsg = match($_GET["error"]) {
        "1" => "Please fill in all fields to add an event.",
        "2" => "Please fill in all fields to edit the event.",
        "3" => "Invalid event ID for deletion.",
        default => "An unknown error occurred."
    };
}

// 7. Fetch all events from the database to display on the calendar
$result = $conn->query("SELECT * FROM appointments");
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $start = new DateTime($row["start_date"]);
        $end = new DateTime($row["end_date"]);

        while ($start <= $end) {
            $eventsFromDB[] = [
                "id" => $row["id"],
                "title" => $row["course_name"] . " - " . $row["instructor_name"],
                "date" => $start->format("Y-m-d"),
                "start_date" => $row["start_date"],
                "end_date" => $row["end_date"],
            ];
            $start->modify("+1 day");
        }
    }
}
$conn->close();

?>
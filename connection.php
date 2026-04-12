<?php
//1. Connect to local MySQL Server (using xampp)
$username="root"; //default username for xampp
$password=""; //default password for xampp
$database="course_calendar"; //name of the database you created

$conn = new mysqli("localhost", $username, $password, $database);
$conn -> set_charset("utf8mb4"); // Set character encoding to UTF-8
?>
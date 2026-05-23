<?php

include "calendar.php";

?>

<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Course Calendar App</title>
    <meta name="description" content="A course calendar app to help students keep track of their classes and assignments.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <header>
        <h1>Course Calendar</h1>
    </header>

    <!-- Clock -->
    <div class="clock-container">
        <div id="clock"></div>
    </div>

    <!-- Calendar -->
    <div class="calendar">
        <div class="nav-btn-container">
            <button class="nav-btn" onclick="changeMonth(-1)">Previous</button>
            <h2 id="monthYear" style="margin: 0"></h2>
            <button class="nav-btn" onclick="changeMonth(1)">Next</button>
        </div>
        <div class="legend-panel">
            <span class="legend-label">Courses:</span>
            <div id="courseLegend" class="course-legend"></div>
            <button type="button" id="clearCourseFilters" class="legend-clear-btn" onclick="clearCourseFilters()">Show all</button>
        </div>
        <div class="calendar-grid" id="calendar">
            <!-- Days will be populated by JavaScript -->
        </div>
    </div>

    <!-- Modal for adding/deleting events -->
    <div class="modal" id="eventModal">
        <div class="modal-content">
            <div>
                <button type="button" id="close-btn" onclick="closeModal()">&#x2715;</button>
            </div>
            <div id="eventSelectorWrapper">
                <label for="eventSelector">
                    <strong>Select Event:</strong>
                </label>
                <select name="" id="eventSelector" onchange="handleEventSelection(this)">
                    <option disabled selected>Choose Event...</option>
                </select>
            </div>

            <!-- Main Form -->
            <form method="post" id="eventForm" action="">
                <!-- Form fields will be added here -->
                <input type="hidden" name="action" id="formAction" value="add">
                <input type="hidden" name="event_id" id="eventId">

                <label for="courseName">Course Name:</label>
                <input type="text" name="course_name" id="courseName" required>

                <label for="instructorName">Instructor Name:</label>
                <input type="text" name="instructor_name" id="instructorName" required>

                <label for="startDate">Start Date:</label>
                <input type="date" name="start_date" id="startDate" required>

                <label for="endDate">End Date:</label>
                <input type="date" name="end_date" id="endDate" required>

                <label>Course Days:</label>
                <div class="weekday-checkboxes">
                    <label><input type="checkbox" name="days[]" value="Sun"> Sun</label>
                    <label><input type="checkbox" name="days[]" value="Mon"> Mon</label>
                    <label><input type="checkbox" name="days[]" value="Tue"> Tue</label>
                    <label><input type="checkbox" name="days[]" value="Wed"> Wed</label>
                    <label><input type="checkbox" name="days[]" value="Thu"> Thu</label>
                    <label><input type="checkbox" name="days[]" value="Fri"> Fri</label>
                    <label><input type="checkbox" name="days[]" value="Sat"> Sat</label>
                </div>

                <div class="course-color-row">
                    <label for="courseColor" class="course-color-label">Course Color:</label>
                    <input type="color" name="course_color" id="courseColor" value="#6B82F6">
                </div>

                <label for="startTimePicker">Start Time:</label>
                <div class="time-picker-wrapper" id="startTimePicker">
                    <button type="button" class="time-picker-button" onclick="toggleTimePicker('start')">
                        <span id="startTimeLabel">09:00 AM</span>
                    </button>
                    <div class="time-picker-panel" id="startTimePanel">
                        <select id="startHour" onchange="updateTimeValue('start')"></select>
                        <select id="startMinute" onchange="updateTimeValue('start')"></select>
                        <select id="startAmPm" onchange="selectAmPm('start')">
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                        </select>
                    </div>
                </div>
                <input type="hidden" name="start_time" id="startTime" required>

                <label for="endTimePicker">End Time:</label>
                <div class="time-picker-wrapper" id="endTimePicker">
                    <button type="button" class="time-picker-button" onclick="toggleTimePicker('end')">
                        <span id="endTimeLabel">10:00 AM</span>
                    </button>
                    <div class="time-picker-panel" id="endTimePanel">
                        <select id="endHour" onchange="updateTimeValue('end')"></select>
                        <select id="endMinute" onchange="updateTimeValue('end')"></select>
                        <select id="endAmPm" onchange="selectAmPm('end')">
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                        </select>
                    </div>
                </div>
                <input type="hidden" name="end_time" id="endTime" required>

                <button type="submit" class="submit-btn">Save Event</button>
            </form>

            <!-- Delete Form-->
            <form method="post" onsubmit="return confirm('Are you sure you want to delete this event?');" id="deleteForm" action="">
                <input type="hidden" name="action" value="delete">
                <input type="hidden" name="event_id" id="deleteEventId">
                <button type="submit" class="delete-btn">Delete Event</button>
            </form>

            <!-- Cancel -->
            <button type="button" class="submit-btn" onclick="closeModal()">Cancel</button>
        </div>
    </div>
    <script>
        const events = <?php echo json_encode($eventsFromDB, JSON_UNESCAPED_UNICODE); ?>;
    </script>
    <script src="calendar.js"></script>
</body>

</html>
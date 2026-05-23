const calendarEl = document.getElementById("calendar");
const monthYearEl = document.getElementById("monthYear");
const modalEl = document.getElementById("eventModal");
let currentDate = new Date();
let activeCourseFilters = new Set();

function renderCalendar(date = new Date()) {
  calendarEl.innerHTML = "";
  const month = date.getMonth();
  const year = date.getFullYear();
  const today = new Date();

  const totalDays = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Display month and year
  monthYearEl.textContent = date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  weekDays.forEach((day) => {
    const dayEl = document.createElement("div");
    dayEl.className = "day-name";
    dayEl.textContent = day;
    calendarEl.appendChild(dayEl);
  });

  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarEl.appendChild(document.createElement("div"));
  }

  // loop through days of the month
  for (let day = 1; day <= totalDays; day++) {
    const dayStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const cell = document.createElement("div");
    cell.className = "day";

    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      cell.classList.add("today");
    }

    const dateEl = document.createElement("div");
    dateEl.className = "date-number";
    dateEl.textContent = day;
    cell.appendChild(dateEl);

    const eventToday = events
      .filter((event) => event.date === dayStr)
      .filter((event) => {
          if (activeCourseFilters.size === 0) return true;
          return activeCourseFilters.has(event.title.split(" - ")[0]);
      })
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
    const eventBox = document.createElement("div");
    eventBox.className = "events";

    //Render events for the day
    eventToday.forEach((event) => {
      const ev = document.createElement("div");
      ev.className = "event";
      const bgColor = event.course_color || "#6B82F6";
      ev.style.backgroundColor = bgColor;
      ev.style.color = getContrastColor(bgColor);

      const courseEl = document.createElement("div");
      courseEl.className = "course";
      courseEl.textContent = event.title.split(" - ")[0]; // Show only course name

      const instructorEl = document.createElement("div");
      instructorEl.className = "instructor";
      instructorEl.textContent = event.title.split(" - ")[1]; // Show only instructor name

      const timeEl = document.createElement("div");
      timeEl.className = "time";
      timeEl.textContent = event.start_time + " - " + event.end_time; // Show time range

      ev.appendChild(courseEl);
      ev.appendChild(instructorEl);
      ev.appendChild(timeEl);
      eventBox.appendChild(ev);
    });

    //overlay buttons
    const overlay = document.createElement("div");
    overlay.className = "day-overlay";

    const addBtn = document.createElement("button");
    addBtn.textContent = "Add";
    addBtn.className = "overlay-btn";
    addBtn.textContent = "+ Add";

    addBtn.onclick = (e) => {
      e.stopPropagation();
      openModalForAdd(dayStr);
    };

    overlay.appendChild(addBtn);

    if (eventToday.length > 0) {
      const editBtn = document.createElement("button");
      editBtn.className = "overlay-btn";
      editBtn.textContent = "Edit Events";
      editBtn.onclick = (e) => {
        e.stopPropagation();
        openModalForEdit(eventToday);
      };
      overlay.appendChild(editBtn);
    }

    cell.appendChild(eventBox);
    cell.appendChild(overlay);
    calendarEl.appendChild(cell);
  }

  renderLegend();
}

// Add event modal
function openModalForAdd(dateStr) {
  document.body.classList.add("modal-open");
  document.getElementById("formAction").value = "add";
    document.getElementById("eventId").value = "";
    document.getElementById("deleteEventId").value = "";
    document.getElementById("courseName").value = "";
    document.getElementById("instructorName").value = "";
    document.getElementById("courseColor").value = "#6B82F6";
    document.getElementById("startDate").value = dateStr;
    document.getElementById("endDate").value = dateStr;
    initTimePicker('start', '09:00');
    initTimePicker('end', '10:00');
    clearSelectedDays();

    const selector = document.getElementById("eventSelector");
    const wrapper = document.getElementById("eventSelectorWrapper");

    if (selector && wrapper) {
        selector.innerHTML = "";
        wrapper.style.display = "none";
    }

    modalEl.style.display = "flex";
}

// Edit event modal
function openModalForEdit(eventsOnDate) {
  document.body.classList.add("modal-open");
  document.getElementById("formAction").value = "edit";
  modalEl.style.display = "flex";

  const selector = document.getElementById("eventSelector");
  const wrapper = document.getElementById("eventSelectorWrapper");
  selector.innerHTML = "<option disabled selected>Select an event</option>";

  eventsOnDate.forEach((e, index) => {
    const option = document.createElement("option");
    option.value = JSON.stringify(e);
    // use the correct date keys from the server
    option.textContent = `${e.title} (${e.start_date} - ${e.end_date})`;
    if (index === 0) {
      option.selected = true;
    }
    selector.appendChild(option);
  });

  if (eventsOnDate.length > 1) {
    wrapper.style.display = "block";
  } else {
    wrapper.style.display = "none";
  }

  // Pre-select and pre-fill the first event's details
  if (eventsOnDate[0]) {
      selector.value = JSON.stringify(eventsOnDate[0]);
      handleEventSelection(selector.value);
  }
}

function initTimePicker(prefix, timeValue) {
  const { hour, minute, ampm } = parseTimeValue(timeValue);
  document.getElementById(`${prefix}Hour`).innerHTML = buildHourOptions(hour);
  document.getElementById(`${prefix}Minute`).innerHTML = buildMinuteOptions(minute);
  document.getElementById(`${prefix}AmPm`).value = ampm;
  document.getElementById(`${prefix}TimeLabel`).textContent = `${hour}:${minute} ${ampm}`;
  document.getElementById(`${prefix}Time`).value = format24Hour(hour, minute, ampm);
}

function clearSelectedDays() {
  document.querySelectorAll('input[name="days[]"]').forEach((checkbox) => {
    checkbox.checked = false;
  });
}

function setSelectedDays(dayString) {
  const selected = dayString ? dayString.split(",").map((d) => d.trim()) : [];
  document.querySelectorAll('input[name="days[]"]').forEach((checkbox) => {
    checkbox.checked = selected.includes(checkbox.value);
  });
}

function buildHourOptions(selectedHour) {
  let options = "";
  for (let i = 1; i <= 12; i++) {
    const hourText = String(i).padStart(2, "0");
    const selected = hourText === selectedHour ? " selected" : "";
    options += `<option value="${hourText}"${selected}>${hourText}</option>`;
  }
  return options;
}

function buildMinuteOptions(selectedMinute) {
  let options = "";
  for (let i = 0; i < 60; i += 5) {
    const minuteText = String(i).padStart(2, "0");
    const selected = minuteText === selectedMinute ? " selected" : "";
    options += `<option value="${minuteText}"${selected}>${minuteText}</option>`;
  }
  return options;
}

function parseTimeValue(timeValue) {
  if (!timeValue) {
    return { hour: "09", minute: "00", ampm: "AM" };
  }

  const time = timeValue.trim();
  let hour = "09";
  let minute = "00";
  let ampm = "AM";

  if (time.match(/\d{1,2}:\d{2}\s*(AM|PM)/i)) {
    const parts = time.split(/[:\s]+/);
    hour = parts[0].padStart(2, "0");
    minute = parts[1];
    ampm = parts[2].toUpperCase();
  } else if (time.match(/\d{1,2}:\d{2}/)) {
    const parts = time.split(":");
    const parsedHour = parseInt(parts[0], 10);
    hour = String(parsedHour % 12 || 12).padStart(2, "0");
    minute = parts[1].padStart(2, "0");
    ampm = parsedHour >= 12 ? "PM" : "AM";
  }

  return { hour, minute, ampm };
}

function format24Hour(hour12, minute, ampm) {
  let hour = parseInt(hour12, 10);
  if (ampm === "PM" && hour < 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;
  return `${String(hour).padStart(2, "0")}:${minute}`;
}

function getContrastColor(hexColor) {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 150 ? "#1f2937" : "#ffffff";
}

function toggleTimePicker(prefix) {
  const panel = document.getElementById(`${prefix}TimePanel`);
  panel.classList.toggle("open");
}

function closeTimePicker(prefix) {
  const panel = document.getElementById(`${prefix}TimePanel`);
  panel.classList.remove("open");
}

function closeAllTimePickers() {
  closeTimePicker("start");
  closeTimePicker("end");
}

document.addEventListener("click", (event) => {
  const target = event.target;
  const path = event.composedPath ? event.composedPath() : [];
  const clickedInsidePicker = path.some((node) => {
    return node instanceof HTMLElement && node.classList && node.classList.contains("time-picker-wrapper");
  });

  if (!clickedInsidePicker) {
    closeAllTimePickers();
  }
});

function updateTimeValue(prefix) {
  const hour = document.getElementById(`${prefix}Hour`).value;
  const minute = document.getElementById(`${prefix}Minute`).value;
  const ampm = document.getElementById(`${prefix}AmPm`).value;
  document.getElementById(`${prefix}TimeLabel`).textContent = `${hour}:${minute} ${ampm}`;
  document.getElementById(`${prefix}Time`).value = format24Hour(hour, minute, ampm);
}

function selectAmPm(prefix) {
  updateTimeValue(prefix);
  closeTimePicker(prefix);
}

// Populate form fields when an event is selected from the dropdown
function handleEventSelection(selection) {
  if (!selection) return;
  const value = selection.value || selection;
  const event = typeof value === "string" ? JSON.parse(value) : value;

  document.getElementById("eventId").value = event.id;
  document.getElementById("deleteEventId").value = event.id;

  const [course, instructor] = (event.title || "").split(" - ").map(e => e.trim());
  document.getElementById("courseName").value = course || "";
  document.getElementById("instructorName").value = instructor || "";
  document.getElementById("courseColor").value = event.course_color || "#6B82F6";
  // use server keys
  document.getElementById("startDate").value = event.start_date || "";
  document.getElementById("endDate").value = event.end_date || "";
  setSelectedDays(event.selected_days || "");
  initTimePicker('start', event.start_time || '09:00');
  initTimePicker('end', event.end_time || '10:00');
}

function closeModal() {
  modalEl.style.display = "none";
  document.body.classList.remove("modal-open");
}

function renderLegend() {
  const legendEl = document.getElementById("courseLegend");
  const clearBtn = document.getElementById("clearCourseFilters");
  if (!legendEl || !clearBtn) return;

  legendEl.innerHTML = "";

  const uniqueCourses = [];
  events.forEach((event) => {
    const courseName = event.title.split(" - ")[0];
    if (!uniqueCourses.some((course) => course.name === courseName)) {
      uniqueCourses.push({
        name: courseName,
        color: event.course_color || "#6B82F6",
      });
    }
  });

  if (uniqueCourses.length === 0) {
    legendEl.innerHTML = "<span class='legend-empty'>No courses available.</span>";
    clearBtn.style.display = "none";
    return;
  }

  uniqueCourses.forEach((course) => {
    const pill = document.createElement("button");
    pill.type = "button";
    pill.className = "course-filter-pill";
    pill.textContent = course.name;
    pill.style.borderColor = course.color;
    pill.style.backgroundColor = activeCourseFilters.size === 0 || activeCourseFilters.has(course.name) ? course.color : "#f8fafc";
    pill.style.color = activeCourseFilters.size === 0 || activeCourseFilters.has(course.name) ? getContrastColor(course.color) : "#475569";

    if (activeCourseFilters.has(course.name)) {
      pill.classList.add("active");
    }

    pill.onclick = () => toggleCourseFilter(course.name);
    legendEl.appendChild(pill);
  });

  clearBtn.style.display = activeCourseFilters.size > 0 ? "inline-flex" : "none";
}

function toggleCourseFilter(courseName) {
  if (activeCourseFilters.has(courseName)) {
    activeCourseFilters.delete(courseName);
  } else {
    activeCourseFilters.add(courseName);
  }
  renderCalendar(currentDate);
}

function clearCourseFilters() {
  activeCourseFilters.clear();
  renderCalendar(currentDate);
}

// Month navigation
function changeMonth(offset) {
  currentDate.setMonth(currentDate.getMonth() + offset);
  renderCalendar(currentDate);
}

// live digital clock
function updateClock() {
  const clock = document.getElementById("clock");
  const now = new Date();
  clock.textContent = [ 
    now.getHours().toString().padStart(2, "0"),
    now.getMinutes().toString().padStart(2, "0"),
    now.getSeconds().toString().padStart(2, "0"),
  ].join(":");
}

//initialize
renderCalendar(currentDate);
updateClock();
setInterval(updateClock, 1000);
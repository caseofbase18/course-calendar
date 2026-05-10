const calendarEl = document.getElementById("calendar");
const monthYearEl = document.getElementById("monthYear");
const modalEl = document.getElementById("eventModal");
let currentDate = new Date();

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

    const eventToday = events.filter((event) => event.date === dayStr);
    const eventBox = document.createElement("div");
    eventBox.className = "events";

    //Render events for the day
    eventToday.forEach((event) => {
      const ev = document.createElement("div");
      ev.className = "event";

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
      editBtn.textContent = "Edit";
      editBtn.className = "overlay-btn";
      editBtn.textContent = "Edit Events";
      editBtn.onclick = (e) => {
        e.stopPropagation();
        openModalForEdit(dayStr);
      };
      overlay.appendChild(editBtn);
    }

    cell.appendChild(eventBox);
    cell.appendChild(overlay);
    calendarEl.appendChild(cell);
  }
}

// Add event modal
function openModalForAdd(dateStr) {
  document.getElementById("formAction").value = "add";
    document.getElementById("eventId").value = "";
    document.getElementById("deleteEventId").value = "";
    document.getElementById("courseName").value = "";
    document.getElementById("instructorName").value = "";
    document.getElementById("startDate").value = dateStr;
    document.getElementById("endDate").value = dateStr;
    document.getElementById("startTime").value = "09:00";
    document.getElementById("endTime").value = "10:00";
 
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
  document.getElementById("formAction").value = "edit";
    modalEl.style.display = "flex";

    const selector = document.getElementById("eventSelector");
    const wrapper = document.getElementById("eventSelectorWrapper");
    selector.innerHTML = "<option disabled selected>Select an event</option>";

    eventsOnDate.forEach((e) => {
        const option = document.createElement("option");
        option.value = JSON.stringify(e);
        option.textContent = `${e.title} (${e.start} - ${e.end})`;
        selector.appendChild(option);
    });

    if (eventsOnDate.length > 1) {
        wrapper.style.display = "block";
    } else {
        wrapper.style.display = "none";
    }

    handleEventSelection(JSON.stringify(eventsOnDate[0])); // Pre-fill form with the first event's details
}

// Populate form fields when an event is selected from the dropdown
function handleEventSelection(eventJSON) {
    const event = JSON.parse(eventJSON);
    
    document.getElementById("eventId").value = event.id
    document.getElementById("deleteEventId").value = event.id;
    
   const [course, instructor] = event.title.split(" - ").map(e => e.trim());
   document.getElementById("courseName").value = course || "";
   document.getElementById("instructorName").value = instructor || "";
    document.getElementById("startDate").value = event.start || "";
    document.getElementById("endDate").value = event.end || "";
    document.getElementById("startTime").value = event.start_time || "";
    document.getElementById("endTime").value = event.end_time || "";
}

function closeModal() {
  modalEl.style.display = "none";
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
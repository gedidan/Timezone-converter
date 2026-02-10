// List of IANA time zones grouped by region
const timeZones = [
    "Africa/Abidjan","Africa/Accra","Africa/Addis_Ababa","Africa/Cairo","Africa/Johannesburg",
    "America/New_York","America/Los_Angeles","America/Chicago","America/Denver","America/Sao_Paulo",
    "Asia/Tokyo","Asia/Shanghai","Asia/Kolkata","Asia/Dubai","Asia/Singapore",
    "Europe/London","Europe/Berlin","Europe/Paris","Europe/Moscow","Europe/Rome",
    "Pacific/Auckland","Pacific/Honolulu","Pacific/Fiji"
];

const sourceZone = document.getElementById("sourceZone");
const targetZone = document.getElementById("targetZone");
const sourceTime = document.getElementById("sourceTime");
const convertedTime = document.getElementById("convertedTime");
const timeDiff = document.getElementById("timeDiff");
const dayDiff = document.getElementById("dayDiff");
const formatToggle = document.getElementById("formatToggle");
const swapZones = document.getElementById("swapZones");
const copyBtn = document.getElementById("copyBtn");
const darkModeToggle = document.getElementById("darkModeToggle");

// Populate timezone selects
timeZones.forEach(zone => {
    const option1 = document.createElement("option");
    option1.value = zone;
    option1.textContent = zone;
    sourceZone.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = zone;
    option2.textContent = zone;
    targetZone.appendChild(option2);
});

// Detect user's timezone
const userTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
sourceZone.value = userTZ;
targetZone.value = "UTC";

// Format conversion function
function convertTime() {
    const fromZone = sourceZone.value;
    const toZone = targetZone.value;
    const dateVal = sourceTime.value ? new Date(sourceTime.value) : new Date();

    // Convert source time to UTC
    const utcDate = new Date(dateVal.toLocaleString("en-US", { timeZone: fromZone }));

    // Convert UTC to target zone
    const targetDate = new Date(utcDate.toLocaleString("en-US", { timeZone: toZone }));

    // Format options
    const options = {
        hour12: !formatToggle.checked,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: toZone
    };

    convertedTime.textContent = targetDate.toLocaleString("en-US", options);

    // Calculate time difference
    const diffHours = (targetDate - utcDate) / 36e5;
    timeDiff.textContent = `${diffHours >= 0 ? "+" : ""}${diffHours.toFixed(1)} hours`;

    // Day difference
    const dayDifference = targetDate.getDate() - utcDate.getDate();
    dayDiff.textContent = dayDifference === 0 ? "Today" : dayDifference > 0 ? "Tomorrow" : "Yesterday";
}

// Event listeners
[sourceZone, targetZone, sourceTime, formatToggle].forEach(el => {
    el.addEventListener("change", convertTime);
});

swapZones.addEventListener("click", () => {
    const temp = sourceZone.value;
    sourceZone.value = targetZone.value;
    targetZone.value = temp;
    convertTime();
});

copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(convertedTime.textContent);
    alert("Copied to clipboard!");
});

// Dark mode toggle
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

// Initialize
sourceTime.value = new Date().toISOString().slice(0,16);
convertTime();

// Theme Toggle Logic
const themeBtn = document.getElementById("darkModeToggle");
const bodyEl = document.body;

themeBtn.addEventListener("click", () => {
    bodyEl.classList.toggle("dark");
    
    // Update the icon and save to local storage
    if (bodyEl.classList.contains("dark")) {
        themeBtn.textContent = "☀️"; 
        localStorage.setItem("theme", "dark");
    } else {
        themeBtn.textContent = "🌙";
        localStorage.setItem("theme", "light");
    }
});

// Check for saved preference on refresh
if (localStorage.getItem("theme") === "dark") {
    bodyEl.classList.add("dark");
    themeBtn.textContent = "☀️";
}
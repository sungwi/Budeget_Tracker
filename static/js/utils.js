function toggleSettingsMenu() {
    var menu = document.getElementById('setting_menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

function toggleDarkMode() {
    var darkModeButton = document.getElementById('darkmode_toggle');
    var isDarkMode = document.body.classList.toggle('dark-mode');

    if (isDarkMode) {
        darkModeButton.textContent = 'Light Mode';
    } else {
        darkModeButton.textContent = 'Dark Mode';
    }
}

document.getElementById('setting_button').addEventListener('click', function() {
    toggleSettingsMenu();
});

document.getElementById('darkmode_toggle').addEventListener('click', function() {
    toggleDarkMode();
    //changeColourButtonName();
});


const durationToggles = document.querySelectorAll('input[name="durationToggle"]');
// Add a change event listener to each toggle
durationToggles.forEach(toggle => {
  toggle.addEventListener('change', (e) => {
    drawChart(e.target.value);
  });
});

document.addEventListener('DOMContentLoaded', (event) => {
    drawChart('totalDuration'); // This will draw the chart with the total duration view by default
});

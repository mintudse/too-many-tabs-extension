document.addEventListener('DOMContentLoaded', () => {
    // Select all the HTML elements we'll be working with
    const tabCountEl = document.getElementById('tabCount');
    const limitDisplay = document.getElementById('limitDisplay');
    const limitInput = document.getElementById('limitInput');
    const saveLimitBtn = document.getElementById('saveLimitBtn');
    const statusEl = document.getElementById('status');

    const noteArea = document.getElementById('noteArea');
    const saveNoteBtn = document.getElementById('saveNoteBtn');
    const clearNoteBtn = document.getElementById('clearNoteBtn');
    const noteStatus = document.getElementById('noteStatus');

    // Fetch data and update the entire popup's display
    function updatePopupUI() {
        // Get the total number of tabs and display it
        chrome.tabs.query({}, (tabs) => {
            tabCountEl.textContent = tabs.length;
        });

        // Get the saved limit and notes from chrome.storage.sync and update the UI
        chrome.storage.sync.get(['tabLimit', 'userNote'], (result) => {
            if (result.tabLimit) {
                // Update the input field to show the current limit
                limitInput.value = result.tabLimit;
                limitDisplay.textContent = result.tabLimit;
                // // Update the full sentence display
                // currentLimitEl.textContent = `Current reminder set to ${savedLimit} tabs.`;
                // // Update the simple number display (e.g., a span)
                // if (limitDisplay) { // Check if the element exists to prevent errors
                //     limitDisplay.textContent = savedLimit;
                // }
            } else {
                limitInput.value = '';
                limitDisplay.textContent = 'not set';
                // If no limit is set, show a default message
                // currentLimitEl.textContent = 'No reminder limit is set.';
                // if (limitDisplay) {
                //     limitDisplay.textContent = 'not set';
                // }
            }

            // Load saved note
            if (result.userNote) {
                noteArea.value = result.userNote;
            } else {
                noteArea.value = '';
            }
        });

        // Load history and render chart
        loadAndRenderChart();
    }

    // Chart history
    function loadAndRenderChart() {
        chrome.storage.local.get(['tabHistory'], (result) => {
            const history = result.tabHistory || [];

            // Process data: group tab creations by day for the last 30 days
            const thirtyDaysAgo = new Date().setDate(new Date().getDate() - 30);
            const dailyCounts = {};

            for (let i = 0; i < 30; i++) {
                const d = new Date(thirtyDaysAgo);
                d.setDate(d.getDate() + i);
                const key = d.toISOString().split('T')[0]; // YYYY-MM-DD
                dailyCounts[key] = 0;
            }

            history.forEach(event => {
                if (event.timestamp >= thirtyDaysAgo) {
                    const key = new Date(event.timestamp).toISOString().split('T')[0];
                    if (dailyCounts[key] !== undefined) {
                        dailyCounts[key]++;
                    }
                }
            });
            
            const chartLabels = Object.keys(dailyCounts).map(date => date.slice(5)); // Format to MM-DD
            const chartData = Object.values(dailyCounts);

            // Render chart using Chart.js
            new Chart(chartCanvas, {
                type: 'line',
                data: {
                    labels: chartLabels,
                    datasets: [{
                        label: 'Tabs Opened Per Day',
                        data: chartData,
                        borderColor: '#1877f2',
                        backgroundColor: 'rgba(24, 119, 242, 0.1)',
                        fill: true,
                        tension: 0.3
                    }]
                },
                options: {
                    scales: { y: { beginAtZero: true } },
                    plugins: { legend: { display: false } }
                }
            });
        });
    }


    // Run the update function as soon as the popup loads to show current data
    // initial ui load
    updatePopupUI();

    // Save the new limit when the button is clicked
    saveLimitBtn.addEventListener('click', () => {
        const newLimit = parseInt(limitInput.value, 10);
        // Check for a valid, positive number
        if (!isNaN(newLimit) && newLimit > 0) {
            // Save the value using the storage API.
            chrome.storage.sync.set({ tabLimit: newLimit }, () => {
                // Update the entire UI to show the new limit and a confirmation message
                updatePopupUI(); 
                statusEl.textContent = 'Limit saved!';
                // Clear the status message after 2 seconds
                setTimeout(() => { statusEl.textContent = ''; }, 2000);
            });
        } else {
            // Handle invalid input
            statusEl.textContent = 'Please enter a valid number.';
            setTimeout(() => { statusEl.textContent = ''; }, 2000);
        }
        
    });
    // ---- Save note ----
    saveNoteBtn.addEventListener('click', () => {
        const noteText = noteArea.value.trim();
        chrome.storage.sync.set({ userNote: noteText }, () => {
            noteStatus.textContent = 'Note saved!';
            setTimeout(() => { noteStatus.textContent = ''; }, 2000);
        });
    });

    // ---- Clear note ----
    clearNoteBtn.addEventListener('click', () => {
        chrome.storage.sync.remove('userNote', () => {
            noteArea.value = '';
            noteStatus.textContent = 'Note cleared!';
            setTimeout(() => { noteStatus.textContent = ''; }, 2000);
        });
    });

});
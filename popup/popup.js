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

    // This function fetches data and updates the entire popup's display
    function updatePopupUI() {
        // Get the total number of tabs and display it.
        chrome.tabs.query({}, (tabs) => {
            tabCountEl.textContent = tabs.length;
        });

        // Get the saved limit from chrome.storage.sync and update the UI.
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
    }

    // Run the update function as soon as the popup loads to show current data.
    // initial ui load
    updatePopupUI();

    // Save the new limit when the button is clicked.
    saveLimitBtn.addEventListener('click', () => {
        const newLimit = parseInt(limitInput.value, 10);
        // Check for a valid, positive number
        if (!isNaN(newLimit) && newLimit > 0) {
            // Save the value using the storage API.
            chrome.storage.sync.set({ tabLimit: newLimit }, () => {
                // Update the entire UI to show the new limit and a confirmation message.
                updatePopupUI(); 
                statusEl.textContent = 'Limit saved!';
                // Clear the status message after 2 seconds
                setTimeout(() => { statusEl.textContent = ''; }, 2000);
            });
        } else {
            // Handle invalid input.
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


// // When the popup is loaded, execute this code
// document.addEventListener('DOMContentLoaded', () => {
//     const tabCountEl = document.getElementById('tabCount');
//     const limitDisplay = document.getElementById('limitDisplay');
//     const limitInput = document.getElementById('limitInput');
//     const saveLimitBtn = document.getElementById('saveLimitBtn');
//     const statusEl = document.getElementById('status');
//     const currentLimitEl = document.getElementById('currentLimit');

//     // This function fetches data and updates the popup's display
//     function updatePopupUI() {
//         // Get the total number of tabs and display it.
//         chrome.tabs.query({}, (tabs) => {
//             tabCountEl.textContent = tabs.length;
//         });

//         // Get the saved limit from chrome.storage and update the UI.
//         chrome.storage.sync.get(['tabLimit'], (result) => {
//             if (result.tabLimit) {
//                 limitInput.value = result.tabLimit;
//                 currentLimitEl.textContent = `Current reminder set to ${result.tabLimit} tabs.`;
//             } else {
//                 currentLimitEl.textContent = 'No reminder limit is set.';
//             }
//         });
//     }

//     // Run the update function as soon as the popup loads.
//     updatePopupUI();

//     // Save the new limit when the button is clicked.
//     saveLimitBtn.addEventListener('click', () => {
//         const newLimit = parseInt(limitInput.value, 10);
//         if (newLimit > 0) {
//             // Save the value using the storage API.
//             chrome.storage.sync.set({ tabLimit: newLimit }, () => {
//                 // Update the UI to show the new limit and a confirmation message.
//                 updatePopupUI(); 
//                 statusEl.textContent = 'Limit saved!';
//                 setTimeout(() => {
//                     statusEl.textContent = '';
//                 }, 2000);
//             });
//         } else {
//             // Handle invalid input.
//             statusEl.textContent = 'Please enter a valid number.';
//              setTimeout(() => {
//                     statusEl.textContent = '';
//                 }, 2000);
//         }
//     });
// });

// // When the popup is loaded, execute this code
// document.addEventListener('DOMContentLoaded', () => {
//     const tabCountEl = document.getElementById('tabCount');
//     const limitInput = document.getElementById('limitInput');
//     const saveLimitBtn = document.getElementById('saveLimitBtn');
//     const statusEl = document.getElementById('status');
//     const currentLimitEl = document.getElementById('currentLimit');

//     // This function fetches data and updates the popup's display
//     function updatePopupUI() {
//         // Get the total number of tabs and display it.
//         chrome.tabs.query({}, (tabs) => {
//             tabCountEl.textContent = tabs.length;
//         });

//         // Get the saved limit from chrome.storage and update the UI.
//         chrome.storage.sync.get(['tabLimit'], (result) => {
//             if (result.tabLimit) {
//                 limitInput.value = result.tabLimit;
//                 currentLimitEl.textContent = `Current reminder set to ${result.tabLimit} tabs.`;
//             } else {
//                 currentLimitEl.textContent = 'No reminder limit is set.';
//             }
//         });
//     }

//     // Run the update function as soon as the popup loads.
//     updatePopupUI();

//     // Save the new limit when the button is clicked.
//     saveLimitBtn.addEventListener('click', () => {
//         const newLimit = parseInt(limitInput.value, 10);
//         if (newLimit > 0) {
//             // Save the value using the storage API.
//             chrome.storage.sync.set({ tabLimit: newLimit }, () => {
//                 // Update the UI to show the new limit and a confirmation message.
//                 updatePopupUI(); 
//                 statusEl.textContent = 'Limit saved!';
//                 setTimeout(() => {
//                     statusEl.textContent = '';
//                 }, 2000);
//             });
//         } else {
//             // Handle invalid input.
//             statusEl.textContent = 'Please enter a valid number.';
//              setTimeout(() => {
//                     statusEl.textContent = '';
//                 }, 2000);
//         }
//     });
// });
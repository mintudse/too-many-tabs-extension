// --- Event Listeners ---

// Listen for when a new tab is created, log for historical tracking
chrome.tabs.onCreated.addListener(() => {
    console.log("Tab created, checking limit and logging event.")
    checkTabLimit();
    logTabEvent();
});

// Listen for when a tab is closed. (might not need later)
chrome.tabs.onRemoved.addListener(() => {
    console.log('A tab was closed. No action taken.');
});

// Check when the stored limit changes
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes.tabLimit) {
        console.log('Tab limit changed. Checking now.');
        checkTabLimit();
    }
});

// Listen for when extension is first installed to set up initial state
chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed. Initializing storage.");
    // Initialize storage for historical data and notes
    chrome.storage.local.set({ tabHistory: [], userNotes: ""});
});

// --- Functionality ---

// This function checks the tab count against the limit
function checkTabLimit() {
    // First, get the saved limit from storage
    chrome.storage.sync.get(['tabLimit'], (result) => {
        const limit = result.tabLimit;
        // If no limit is set, exit
        if (!limit) {
            return;
        }

        // Next, get the current number of tabs
        chrome.tabs.query({}, (tabs) => {
            const tabCount = tabs.length;

            // If the number of tabs exceeds the limit, create a notification
            if (tabCount > limit) {
                const notificationId = 'tab-limit-notification';
                chrome.notifications.create(notificationId, {
                    type: 'basic',
                    iconUrl: 'images/icon128.png',
                    title: 'Tab Limit Reached!',
                    message: `You have ${tabCount} tabs open. The limit is ${limit}.`,
                    priority: 2
                });
            }
        });
    });
}

// Log a tab creation event with a timestamp
function logTabEvent() {
    chrome.storage.local.get(['tabHistory'], (result) => {
        const history = result.tabHistory || [];
        history.push({ timestamp: Date.now(), event: 'created' });
        
        // TODO: Remove entries older than 30-60 to prevent storage from getting too large
        
        chrome.storage.local.set({ tabHistory: history });
    });
}

// Check if a bunch of tabs were created in a short period
function checkTabVelocity() {
    // TODO: Implement smarter alerts
    // Analyze tabHistory to see if many tabs were created 
    // a short period (ie: >10 tabs in 5 minutes).
    // If so, trigger a different, "smarter" notification.
    console.log("TODO: Check tab velocity.");
}

// TODO: Maybe implement a Context Menu for note-taking
// Allow users to right-click selected text on a webpage and add it to their notes
chrome.contextMenus.create({
    id: "add-to-notes",
    title: "Add to TooManyTabs Extension Notes",
    contexts: ["selection"]
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "add-to-notes" && info.selectionText) {
        // When the context menu item is clicked, append the selected text to the notes
        chrome.storage.local.get(['userNotes'], (result) => {
            const existingNotes = result.userNotes || "";
            const newNote = info.selectionText;
            const updatedNotes = existingNotes + "\n- " + newNote;
            chrome.storage.local.set({ userNotes: updatedNotes });
        });
    }
});

// TODO: Implement messaging system for efficient data handling
// ie: Popup could request pre-processed data from this script
// instead of fetching the entire raw log itself
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.greeting === "getTabUsageData") {
        // Process the data and send back a summary
        console.log("TODO: Process and send back tab usage data.");
    }
});
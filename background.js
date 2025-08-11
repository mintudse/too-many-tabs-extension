// This function checks the tab count against the limit
function checkTabLimit() {
    // First, get the saved limit from storage
    chrome.storage.sync.get(['tabLimit'], (result) => {
        const limit = result.tabLimit;
        // If no limit is set, do nothing
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

// --- Event Listeners ---

// Listen for when a new tab is created
chrome.tabs.onCreated.addListener(() => {
    checkTabLimit();
});

// Listen for when a tab is closed.
// While not strictly necessary for this feature, it's good practice
// if you want to clear notifications or perform other actions.
// For this tutorial, we'll just log it.
chrome.tabs.onRemoved.addListener(() => {
    console.log('A tab was closed. No action taken.');
});

// Also check when the stored limit changes
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes.tabLimit) {
        console.log('Tab limit changed. Checking now.');
        checkTabLimit();
    }
});
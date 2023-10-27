chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "runHighlighter",
        title: "Highlight Text Now",
        contexts: ["all"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "runHighlighter") {
        chrome.storage.local.get(['terms'], function(result) {
            if (result.terms) {
                chrome.tabs.sendMessage(tab.id, {
                    action: "highlightNow",
                    terms: result.terms
                });
            }
        });
    }
});

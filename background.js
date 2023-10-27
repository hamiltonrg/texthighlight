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
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: runHighlight,
                    args: [result.terms]
                });
            }
        });
    }
});

function runHighlight(terms) {
    // Assuming highlightTerms function is available in content.js
    if (window.highlightTerms) {
        window.highlightTerms(terms);
    } else {
        console.error("highlightTerms function not found in the page context.");
    }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("Message received:", request);

    if (request.action === "highlightNow") {
        highlightTerms(request.terms);
    }
});

function highlightTerms(terms) {
    console.log("Highlighting terms:", terms);

    if (!terms.length) return;

    let pattern = '(' + terms.map(term => term.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")).join('|') + ')';
    let regex = new RegExp(pattern, 'gi');

    function wrapMatches(textNode) {
        if (textNode.parentNode && textNode.parentNode.classList.contains('highlight')) {
            return; // Skip if parent is already a highlight
        }

        let tempDivElement = document.createElement('div');
        tempDivElement.innerHTML = textNode.data.replace(regex, '<span class="highlight">$1</span>');

        while (tempDivElement.firstChild) {
            textNode.parentNode.insertBefore(tempDivElement.firstChild, textNode);
        }
        textNode.parentNode.removeChild(textNode);
    }

    let treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: function(node) {
            if (!node.parentElement || node.parentElement.tagName === 'SCRIPT' || node.parentElement.tagName === 'STYLE' || node.parentElement.tagName === 'IFRAME' || node.parentElement.tagName === 'NOSCRIPT') {
                return NodeFilter.FILTER_REJECT;
            }
            if (node.nodeValue.trim().length === 0) {
                return NodeFilter.FILTER_SKIP;
            }
            return NodeFilter.FILTER_ACCEPT;
        }
    });

    let textNodes = [];
    while(treeWalker.nextNode()) {
        textNodes.push(treeWalker.currentNode);
    }

    textNodes.forEach(wrapMatches);
}

// Load the initial set of terms and highlight them
chrome.storage.local.get(['terms'], function(result) {
    if (result.terms) {
        highlightTerms(result.terms);
    }
});

let styleEl = document.createElement('style');
document.head.appendChild(styleEl);
styleEl.sheet.insertRule('.highlight { background-color: yellow; }', 0);

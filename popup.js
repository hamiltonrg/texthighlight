let addTermButton = document.getElementById('addTerm');
let newTermInput = document.getElementById('newTerm');
let removeTermsButton = document.getElementById('removeTerms');
let termsListDiv = document.getElementById('termsList');

// Load and display terms when popup is opened
chrome.storage.local.get(['terms'], function(result) {
    displayTerms(result.terms || []);
});

// Add new term
addTermButton.onclick = function() {
    let term = newTermInput.value.trim();
    console.log("Adding term:", term);  // Debug statement

    if (term) {
        chrome.storage.local.get(['terms'], function(result) {
            let terms = result.terms || [];
            console.log("Current terms before adding:", terms);  // Debug statement
            if (!terms.includes(term)) {
                terms.push(term);
                chrome.storage.local.set({terms: terms}, function() {
                    console.log("New terms after adding:", terms);  // Debug statement
                    displayTerms(terms);
                    newTermInput.value = ''; // Clear input field
                    updateContentScript(terms);
                });
            }
        });
    }
};

// Remove selected terms
removeTermsButton.onclick = function() {
    let checkedBoxes = document.querySelectorAll('.term-checkbox:checked');
    let termsToRemove = Array.from(checkedBoxes).map(cb => cb.value);

	console.log("Terms to remove:", termsToRemove);  // Debug statement
    chrome.storage.local.get(['terms'], function(result) {
        let updatedTerms = result.terms.filter(term => !termsToRemove.includes(term));
        chrome.storage.local.set({terms: updatedTerms}, function() {
            displayTerms(updatedTerms);
            updateContentScript(updatedTerms);
        });
    });
};

function displayTerms(terms) {
    termsListDiv.innerHTML = ''; // Clear current list
    terms.forEach(function(term) {
        let termDiv = document.createElement('div');
        termDiv.className = 'term-div';

        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'term-checkbox';
        checkbox.value = term;

        let termLabel = document.createElement('span');
        termLabel.textContent = ' ' + term;

        termDiv.appendChild(checkbox);
        termDiv.appendChild(termLabel);
        termsListDiv.appendChild(termDiv);
    });
}

function updateContentScript(terms) {
    // Notify content script to update highlights
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        console.log("Updating content script with terms:", terms);  // Debug statement
		chrome.tabs.sendMessage(tabs[0].id, {action: "updateHighlights", terms: terms});
    });
}

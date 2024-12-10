// XPath to locate the button
const buttonXPath = "/html/body/div[1]/div[2]/div/div/div/div/div/div[1]/div[2]/div/div/button";

// Locate the button using XPath
function getButtonByXPath(xpath) {
    return document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    ).singleNodeValue;
}

// Function to play a sound
function playSound(url) {
    const audio = new Audio(url);
    audio.play();
}

// Add an observer to monitor the button for state changes
function monitorButtonToggle(button) {
    let lastState = getButtonState(button);

    // Observer for attribute/class changes
    const observer = new MutationObserver(() => {
        const currentState = getButtonState(button);
        if (currentState !== lastState) {
            console.log(`Button state changed: ${lastState} → ${currentState}`);
            lastState = currentState;
            playSound(currentState ? chrome.runtime.getURL("sounds/on.mp3") : chrome.runtime.getURL("sounds/off.mp3"));
        }
    });

    observer.observe(button, { attributes: true, attributeFilter: ["class", "aria-pressed", "data-state"] });

    console.log("Toggle observer added to the button.");
}

// Add a click listener for additional feedback
function addButtonClickListener(button) {
    button.addEventListener("click", () => {
        console.log("Button clicked.");
        const isToggledOn = getButtonState(button);
        console.log(`Button state after click: ${isToggledOn}`);
        playSound(isToggledOn ? chrome.runtime.getURL("sounds/on.mp3") : chrome.runtime.getURL("sounds/off.mp3"));
    });

    console.log("Click listener added to the button.");
}

// Helper function to determine the button's state
function getButtonState(button) {
    // Replace this logic based on the button's actual toggle behavior
    return button.classList.contains("on"); // Adjust if the toggle state depends on a different class, attribute, or property
}

// Wait for the button to appear and then attach listeners
function waitForButton(xpath, callback) {
    const interval = setInterval(() => {
        const button = getButtonByXPath(xpath);
        if (button) {
            clearInterval(interval);
            callback(button);
        }
    }, 100); // Check every 100ms
}

// Combine both functionalities
function initializeButtonListeners(button) {
    monitorButtonToggle(button);
    addButtonClickListener(button);
}

// Start monitoring and listening for button actions
waitForButton(buttonXPath, initializeButtonListeners);

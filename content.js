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

// Add an observer to monitor the button for class changes (toggle functionality)
function monitorButtonToggle(button) {
    let lastState = button.classList.contains("on"); // Adjust based on toggle logic

    // Observer for button attribute/class changes
    const observer = new MutationObserver(() => {
        const currentState = button.classList.contains("on");
        if (currentState !== lastState) {
            lastState = currentState;
            playSound(currentState ? chrome.runtime.getURL("sounds/on.mp3") : chrome.runtime.getURL("sounds/off.mp3"));
        }
    });

    observer.observe(button, { attributes: true, attributeFilter: ["class"] });

    console.log("Toggle observer added to the button.");
}

// Add a click listener to the button
function addButtonClickListener(button) {
    button.addEventListener("click", () => {
        // Optional: play a generic click sound or reinforce the toggle logic
        console.log("Button clicked.");
        playSound(chrome.runtime.getURL("sounds/on.mp3")); // Adjust if needed
    });

    console.log("Click listener added to the button.");
}

// Wait for the button to appear and then attach the listeners
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

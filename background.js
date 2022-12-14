
chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: "OFF",
    });
});

const extensions = 'https://developer.chrome.com/docs/extensions'
const webstore = 'https://developer.chrome.com/docs/webstore'

// When the user clicks on the extension action
chrome.action.onClicked.addListener(async (tab) => {
    console.log("Hello, World!");   
    // We retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    // Next state will always be the opposite
    const nextState = prevState === 'ON' ? 'OFF' : 'ON'
    // Set the action badge to the next state
    await chrome.action.setBadgeText({
        tabId: tab.id,
        text: nextState,
    });

    if (nextState === "ON") {
        console.log("now on!");
    } else if (nextState === "OFF") {
        console.log("now off");
    }
    targets = await chrome.debugger.getTargets()

    for (x in targets) {
        if (targets[x].attached && targets[x].type == "page") {
            console.log("found attached page!")
            console.log(targets[x])
            d = {tabId: targets[x].tabId};
            chrome.debugger.attach(d, "1.3");
            chrome.debugger.sendCommand(d, "Page.getLayoutMetrics", function (response) {
                console.log(response)
                chrome.debugger.sendCommand(d,"Page.captureScreenshot",
                {
                    format: "png",
                    clip: {
                        scale: 1,
                        x: 0,
                        y: 0,
                        width: response.contentSize.width,
                        height: response.contentSize.height
                    },
                    captureBeyondViewport: true,
                    fromSurface: true
                },
                function(screenshotResponse) {
                    console.log(screenshotResponse)
                    chrome.debugger.detach(d)
                });
            });
        }
    }
});
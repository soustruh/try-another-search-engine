const FEEDBACK_SERVER = "https://feedback.seznam.cz/form/webextension"

async function receiver(message, sender) {
    if (!"action" in message) {
        console.log("Incorrect message")
        return
    }
    console.log("Message received:", message.action)
    let collectData = await restoreOptions("collectData", true);
    switch (message.action) {
        case "click":
        case "switch":
            if (!collectData) {
                console.log("Usage data ARE NOT collected")
                break
            }

            const payload = {
                version: 2,
                type: "webextension",
                query: message.data.query,
                pageData: message.data
            }
            console.log(payload)
            const statusCode = await postData(FEEDBACK_SERVER, payload)
            console.log("Usage data sent: HTTP " + statusCode)
            break
        default:
            console.log("Unknown action")
    }
}


chrome.runtime.onMessage.addListener(receiver)
function saveOptions(e) {
    collectData = document.getElementById("collectData").checked
    browser.storage.sync.set({
        collectData: collectData
    })
    console.log("Setting saved: " + collectData)
}

function restoreOptions() {
    var gettingItem = browser.storage.sync.get("collectData")
    gettingItem.then((res) => {
        const collectData = (res.collectData === undefined ? true : res.collectData)
        document.querySelector("#collectData").checked = collectData
        console.log("Setting restored: " + collectData)
    })
}

document.addEventListener("DOMContentLoaded", restoreOptions)
document.getElementById("collectData").addEventListener("click", saveOptions)
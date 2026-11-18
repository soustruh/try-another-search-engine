const restoreOptions = async (key, defaultValue) => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(key, function (res) {
            const val = (res.collectData === undefined ? defaultValue : res.collectData)
            console.log("Setting restored: " + key + " = " + val)
            resolve(val)
        });
    });
};
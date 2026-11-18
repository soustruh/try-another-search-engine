async function restoreOptions(key, defaultValue) {
    const settings = await browser.storage.sync.get(key);
    return settings[key] ?? defaultValue;
}

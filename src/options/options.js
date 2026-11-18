let engineSettings = normalizeEngineSettings();

async function saveEngineSettings() {
    await browser.storage.sync.set(engineSettings);
}

function renderEngines() {
    const list = document.getElementById("engineList");
    list.replaceChildren();

    engineSettings.engineOrder.forEach((id, index) => {
        const engine = searchEngines.find((item) => item.id === id);
        const row = document.createElement("li");
        row.className = "engineRow";

        const label = document.createElement("label");
        label.className = "engineLabel";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = !engineSettings.disabledEngines.includes(id);
        checkbox.setAttribute("aria-label", `Enable ${engine.name}`);
        checkbox.addEventListener("change", async () => {
            engineSettings.disabledEngines = checkbox.checked
                ? engineSettings.disabledEngines.filter((disabledId) => disabledId !== id)
                : [...engineSettings.disabledEngines, id];
            await saveEngineSettings();
        });

        const icon = document.createElement("img");
        icon.src = browser.runtime.getURL(engine.icon);
        icon.alt = "";

        const name = document.createElement("span");
        name.textContent = engine.name;

        label.append(checkbox, icon, name);
        row.appendChild(label);

        const controls = document.createElement("div");
        controls.className = "moveButtons";
        for (const [direction, title, pathData] of [
            [-1, "Move up", "M12 19V5 M5 12l7-7 7 7"],
            [1, "Move down", "M12 5v14 M5 12l7 7 7-7"],
        ]) {
            const button = document.createElement("button");
            button.type = "button";
            button.title = `${title}: ${engine.name}`;
            button.setAttribute("aria-label", button.title);

            const arrow = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            arrow.setAttribute("viewBox", "0 0 24 24");
            arrow.setAttribute("fill", "none");
            arrow.setAttribute("stroke", "currentColor");
            arrow.setAttribute("stroke-width", "2");
            arrow.setAttribute("stroke-linecap", "round");
            arrow.setAttribute("stroke-linejoin", "round");
            arrow.setAttribute("aria-hidden", "true");
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", pathData);
            arrow.appendChild(path);
            button.appendChild(arrow);
            button.disabled =
                index + direction < 0 || index + direction >= engineSettings.engineOrder.length;
            button.addEventListener("click", async () => {
                const next = index + direction;
                [engineSettings.engineOrder[index], engineSettings.engineOrder[next]] = [
                    engineSettings.engineOrder[next],
                    engineSettings.engineOrder[index],
                ];
                renderEngines();
                await saveEngineSettings();
                list.children[next].querySelector(`button[title^="${title}"]`)?.focus();
            });
            controls.appendChild(button);
        }
        row.appendChild(controls);
        list.appendChild(row);
    });
}

async function restoreSettings() {
    const settings = await browser.storage.sync.get(["engineOrder", "disabledEngines"]);
    engineSettings = normalizeEngineSettings(settings);
    renderEngines();
}

restoreSettings();

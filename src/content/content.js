async function main() {
    try {
        const source = searchEngines.find((engine) => engine.hosts.includes(location.hostname));
        if (!source) return;

        const settings = normalizeEngineSettings(
            await browser.storage.sync.get(["engineOrder", "disabledEngines"]),
        );
        const collectData = await restoreOptions("collectData", true);
        const engines = settings.engineOrder
            .filter((id) => !settings.disabledEngines.includes(id))
            .map((id) => searchEngines.find((engine) => engine.id === id));
        const destinations = engines.filter((engine) => engine.id !== source.id);
        if (!destinations.length) return;

        const toolbar = document.createElement("div");
        toolbar.id = "pmsAddon";
        toolbar.setAttribute("aria-label", "Try another search engine");

        const links = document.createElement("span");
        links.id = "links";
        toolbar.appendChild(links);

        let page;
        const searchLinks = destinations.map((engine) => {
            const link = document.createElement("a");
            link.title = engine.name;
            link.setAttribute("aria-label", `Search with ${engine.name}`);

            const icon = document.createElement("img");
            icon.src = browser.runtime.getURL(engine.icon);
            icon.alt = "";
            icon.width = 32;
            icon.height = 32;
            link.appendChild(icon);
            links.appendChild(link);

            if (collectData) {
                link.addEventListener("click", () => {
                    if (!page) return;
                    browser.runtime.sendMessage({
                        action: "switch",
                        data: {
                            query: page.query,
                            mode: page.mode,
                            source: page.engine.name,
                            sourceUrl: location.href,
                            target: engine.id,
                            targetUrl: link.href,
                        },
                    });
                });
            }
            return { engine, link };
        });

        const close = document.createElement("button");
        close.className = "closeButton";
        close.type = "button";
        close.textContent = "×";
        close.setAttribute("aria-label", "Close search engine toolbar");
        close.addEventListener("click", () => {
            toolbar.classList.add("hide");
            toolbar.inert = true;
        });
        toolbar.appendChild(close);

        watchSearchPage((currentPage) => {
            page = currentPage;
            updateToolbar(toolbar, searchLinks, page);
            if (page && collectData && source.id === "google") tagGoogleResults();
        });

        if (collectData && source.id === "google") {
            addResultsClickListeners(() => page?.query);
        }
    } catch (error) {
        console.error("Try another search engine:", error);
    }
}

function updateToolbar(toolbar, searchLinks, page) {
    toolbar.hidden = !page;
    if (!page) return;

    const mode = page.mode === "images" ? "images" : "web";
    const query = encodeURIComponent(page.query);
    for (const { engine, link } of searchLinks) {
        link.href = engine[mode] + query;
    }
    if (!toolbar.isConnected) document.body.appendChild(toolbar);
}

function watchSearchPage(onChange) {
    let previousUrl;
    function checkUrl() {
        const url = location.href;
        if (url === previousUrl) return;
        previousUrl = url;
        onChange(getSearchPage(new URL(url)));
    }

    checkUrl();
    window.navigation.addEventListener("currententrychange", checkUrl);
}

function tagGoogleResults() {
    const defaultLeftUrl = "unknown-left";
    const defaultRightUrl = "unknown-right";

    document.querySelectorAll("#rso > div").forEach((result, position) => {
        result.dataset.tryanother = "true";
        result.dataset.tryanotherPosition = position;
        result.dataset.tryanotherUrl = defaultLeftUrl;

        const links = result.querySelectorAll("a");
        if (links.length === 1 && links[0].href) {
            result.dataset.tryanotherUrl = links[0].href;
        } else if (links.length > 1) {
            links.forEach((link, linkPosition) => {
                link.dataset.tryanother = "true";
                link.dataset.tryanotherPosition = `${position}-${linkPosition}`;
                link.dataset.tryanotherUrl = link.href || defaultLeftUrl;
            });
        }
    });

    const rightResults = document.querySelector("#rhs");
    if (rightResults) {
        rightResults.dataset.tryanother = "true";
        rightResults.dataset.tryanotherPosition = 0;
        rightResults.dataset.tryanotherUrl = defaultRightUrl;
    }
}

function addResultsClickListeners(getQuery) {
    document.body.addEventListener("mousedown", (event) => {
        const result = event.target.closest("[data-tryanother=true]");
        const query = getQuery();
        if (!result || !query) return;

        browser.runtime.sendMessage({
            action: "click",
            data: {
                query,
                url: result.dataset.tryanotherUrl,
                position: result.dataset.tryanotherPosition,
            },
        });
    });
}

main();

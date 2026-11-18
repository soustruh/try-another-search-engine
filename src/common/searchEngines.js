const searchEngines = [
    {
        id: "google",
        name: "Google",
        icon: "icons/google.png",
        hosts: ["www.google.com", "www.google.cz"],
        web: "https://www.google.com/search?q=",
        images: "https://www.google.com/search?tbm=isch&q=",
        webPaths: ["/search"],
        imagePaths: ["/search"],
        imageParameter: ["tbm", "isch"],
    },
    {
        id: "seznam",
        name: "Seznam",
        icon: "icons/seznam.png",
        hosts: ["search.seznam.cz"],
        web: "https://search.seznam.cz/?q=",
        images: "https://search.seznam.cz/obrazky/?q=",
        webPaths: ["/"],
        imagePaths: ["/obrazky", "/obrazky/"],
    },
    {
        id: "duckduckgo",
        name: "DuckDuckGo",
        icon: "icons/duckgo.png",
        hosts: ["duckduckgo.com"],
        web: "https://duckduckgo.com/?q=",
        images: "https://duckduckgo.com/?ia=images&iax=images&q=",
        webPaths: ["/"],
        imagePaths: ["/"],
        imageParameter: ["ia", "images"],
    },
    {
        id: "ecosia",
        name: "Ecosia",
        icon: "icons/ecosia.ico",
        hosts: ["www.ecosia.org"],
        web: "https://www.ecosia.org/search?q=",
        images: "https://www.ecosia.org/images?q=",
        webPaths: ["/search"],
        imagePaths: ["/images"],
    },
    {
        id: "bing",
        name: "Bing",
        icon: "icons/bing.png",
        hosts: ["www.bing.com"],
        web: "https://www.bing.com/search?q=",
        images: "https://www.bing.com/images/search?q=",
        webPaths: ["/search"],
        imagePaths: ["/images/search"],
    },
    {
        id: "brave",
        name: "Brave",
        icon: "icons/brave.png",
        hosts: ["search.brave.com"],
        web: "https://search.brave.com/search?q=",
        images: "https://search.brave.com/images?q=",
        webPaths: ["/search"],
        imagePaths: ["/images"],
    },
];

function normalizeEngineSettings(settings = {}) {
    const ids = searchEngines.map((engine) => engine.id);
    const savedOrder = Array.isArray(settings.engineOrder) ? settings.engineOrder : [];
    const savedDisabled = Array.isArray(settings.disabledEngines) ? settings.disabledEngines : [];

    return {
        engineOrder: [...new Set(savedOrder.filter((id) => ids.includes(id)))].concat(
            ids.filter((id) => !savedOrder.includes(id)),
        ),
        disabledEngines: [...new Set(savedDisabled.filter((id) => ids.includes(id)))],
    };
}

function getSearchPage(url) {
    const query = url.searchParams.get("q");
    if (!query) return null;

    for (const engine of searchEngines) {
        if (!engine.hosts.includes(url.hostname)) continue;

        const isImagePath = engine.imagePaths.includes(url.pathname);
        const hasImageParameter =
            !engine.imageParameter ||
            url.searchParams.get(engine.imageParameter[0]) === engine.imageParameter[1] ||
            (engine.id === "duckduckgo" && url.searchParams.get("iax") === "images") ||
            (engine.id === "google" && url.searchParams.get("udm") === "2");

        if (isImagePath && hasImageParameter) {
            return { engine, mode: "images", query };
        }
        if (engine.webPaths.includes(url.pathname)) {
            return { engine, mode: "fulltext", query };
        }
    }

    return null;
}

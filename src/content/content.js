const buttons = ["seznam", "google", "bing", "brave", "duckgo", "sznhint"];

let query;

async function main() {
    try {
        let collectData = await restoreOptions("collectData", true);
        console.log("Usage data " + (collectData ? "ARE" : "ARE NOT") + " collected");

        container = document.createElement("div");
        container.id = "pmsAddon";
        document.body.appendChild(container);
        document.getElementById("pmsAddon").innerHTML = containerTemplate;

        args = location.search.substr(1).split("&");
        for (let i = 0; i < args.length; i++) {
            arg = args[i].split("=");
            if (arg[0] == "q") {
                query = arg[1];
            }
        }

        document
            .querySelector("#pmsAddon #seznam img")
            .setAttribute("src", chrome.extension.getURL("icons/seznam.png"));
        document
            .querySelector("#pmsAddon #google img")
            .setAttribute("src", chrome.extension.getURL("icons/google.png"));
        document
            .querySelector("#pmsAddon #bing img")
            .setAttribute("src", chrome.extension.getURL("icons/bing.png"));
        document
            .querySelector("#pmsAddon #brave img")
            .setAttribute("src", chrome.extension.getURL("icons/brave.png"));
        document
            .querySelector("#pmsAddon #duckgo img")
            .setAttribute("src", chrome.extension.getURL("icons/duckgo.png"));

        for (let i = 0; i < locations.length; i++) {
            loc = locations[i];
            if (loc.host != location.host) continue;
            if ("pathname" in loc && location.pathname != loc.pathname) continue;
            if ("search" in loc && !location.search.includes(loc.search)) continue;
            console.log("Match: " + loc.title + "!");
            for (let j = 0; j < buttons.length; j++) {
                let button = buttons[j];
                if (loc[button]) {
                    let el = document.querySelector("#pmsAddon #" + button);
                    el.href = loc[button] + query;
                    if (!collectData) continue;
                    el.addEventListener("click", function () {
                        data = {
                            action: "switch",
                            data: {
                                query: query,
                                mode: loc.mode,
                                source: loc.title,
                                sourceUrl: document.location.href,
                                target: button,
                                targetUrl: el.href,
                            },
                        };
                        chrome.runtime.sendMessage(data);
                    });
                } else {
                    let el = document.querySelector("#pmsAddon #" + button);
                    el.classList.add("disabled");
                    el.href = "#";
                }
            }
            break;
        }

        document.querySelector("#pmsAddon #switch").addEventListener(
            "click",
            function () {
                document.querySelector("#pmsAddon").classList.add("hide");
            },
            false,
        );

        if (collectData) {
            tagGoogleResults();
            addResultsClickListeners(query);
            // findOrganicResults()
            // addSERPClickListeners()
        }

        /*
        if (location.host == "search.seznam.cz" && query) {
            var rssUrl = "//search.seznam.cz/?format=rss&q=" + query
            $.get(rssUrl, function (data) {
                console.log("Using default tag name (opensearch:totalResults)")
                tr = data.getElementsByTagName("opensearch:totalResults")
                if (!tr.length) {
                    console.log("Chrome tag name workaround (totalResults)")
                    tr = data.getElementsByTagName("totalResults")
                }
                if (!tr.length) {
                    console.log("Result count not found")
                } else {
                    totalResults = Number(tr[0].textContent).toLocaleString()
                    console.log(totalResults)

                    resultsEl = document.querySelector("#pmsAddon #results")
                    resultsEl.html = "Výsledků: " + totalResults
                    resultsEl.show()
                }
            });
        }
        */
    } catch (err) {
        console.log(err);
    }
}

function tagGoogleResults() {
    const DEFAULT_URL_LEFT = "unknown-left";
    const DEFAULT_URL_RIGHT = "unknown-right";

    googleResults = document.querySelectorAll("#rso > div");
    console.log("Found " + googleResults.length + " results");
    let i = 0;
    googleResults.forEach((el) => {
        el.setAttribute("data-tryanother", "true");
        el.setAttribute("data-tryanother-position", i);
        el.setAttribute("data-tryanother-url", DEFAULT_URL_LEFT);

        let links = el.querySelectorAll("a");
        if (links.length == 1) {
            if (links[0].href) el.setAttribute("data-tryanother-url", links[0].href);
        } else if (links.length > 1) {
            let j = 0;
            links.forEach((lnk) => {
                lnk.setAttribute("data-tryanother", "true");
                lnk.setAttribute("data-tryanother-position", i + "-" + j);
                if (lnk.href) href = lnk.href;
                else href = DEFAULT_URL_LEFT;
                lnk.setAttribute("data-tryanother-url", href);
                j++;
            });
        }
        i++;
    });

    googleRight = document.querySelector("#rhs");
    if (googleRight) {
        googleRight.setAttribute("data-tryanother", "true");
        googleRight.setAttribute("data-tryanother-position", 0);
        googleRight.setAttribute("data-tryanother-url", DEFAULT_URL_RIGHT);
    }
}

function addResultsClickListeners(query) {
    document.querySelector("body").addEventListener("mousedown", (event) => {
        let el = event.target.closest("[data-tryanother=true]");
        if (!el) return;

        let url = el.getAttribute("data-tryanother-url");
        let position = el.getAttribute("data-tryanother-position");
        let data = {
            query: query,
            url: url,
            position: position,
        };
        console.log(data);

        message = {
            action: "click",
            data: data,
        };
        chrome.runtime.sendMessage(message);
    });
}

main();

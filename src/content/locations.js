const bing = "https://www.bing.com/search?q="
const brave = "https://search.brave.com/search?q="
const duckgo = "https://duckduckgo.com/?q="
const google = "https://www.google.com/search?q="
const seznam = "https://search.seznam.cz/?q="
const sznhint = "https://search.seznam.cz/hint?q="
const obrazky = "https://www.obrazky.cz/?q="
const bingimg = "https://www.bing.com/images/search?q="
const bravimg = "https://search.brave.com/images?q="
const googimg = "https://www.google.com/search?tbm=isch&q="
const duckimg = "https://duckduckgo.com/?ia=images&iax=images&q="

const locations = [{
        title: "Seznam",
        mode: "hints",
        host: "search.seznam.cz",
        pathname: "/hint/",
        seznam: seznam,
        google: google,
        bing: bing,
        brave: brave,
        duckgo: duckgo,
        sznhint: null
    },
    {
        title: "Seznam",
        mode: "fulltext",
        host: "search.seznam.cz",
        pathname: "/",
        seznam: null,
        google: google,
        bing: bing,
        brave: brave,
        duckgo: duckgo,
        sznhint: sznhint
    },
    {
        title: "Seznam",
        mode: "images",
        host: "search.seznam.cz",
        pathname: /obrazky/,
        seznam: null,
        google: googimg,
        bing: bingimg,
        brave: bravimg,
        duckgo: duckimg,
    },
    /* items with search need to go first */
    {
        title: "Google",
        mode: "images",
        host: "www.google.com",
        search: "tbm=isch",
        seznam: obrazky,
        google: null,
        bing: bingimg,
        brave: bravimg,
        duckgo: duckimg,
    },
    {
        title: "Google",
        mode: "images",
        host: "www.google.cz",
        search: "tbm=isch",
        seznam: obrazky,
        google: null,
        bing: bingimg,
        brave: bravimg,
        duckgo: duckimg,
    },
    {
        title: "Google",
        mode: "fulltext",
        host: "www.google.com",
        seznam: seznam,
        google: null,
        bing: bing,
        brave: brave,
        duckgo: duckgo,
        sznhint: sznhint
    },
    {
        title: "Google",
        mode: "fulltext",
        host: "www.google.cz",
        seznam: seznam,
        google: null,
        bing: bing,
        brave: brave,
        duckgo: duckgo,
        sznhint: sznhint
    },
    /* item with search needs to go first */
    {
        title: "DuckDuckGo",
        mode: "images",
        host: "duckduckgo.com",
        search: "ia=images",
        seznam: obrazky,
        google: googimg,
        bing: bingimg,
        brave: bravimg,
        duckgo: null,
    },
    {
        title: "DuckDuckGo",
        mode: "fulltext",
        host: "duckduckgo.com",
        seznam: seznam,
        google: google,
        bing: bing,
        brave: brave,
        duckgo: null,
        sznhint: sznhint
    },
    {
        title: "Bing",
        mode: "fulltext",
        host: "www.bing.com",
        pathname: "/search",
        seznam: seznam,
        google: google,
        bing: null,
        brave: brave,
        duckgo: duckgo,
        sznhint: sznhint
    },
    {
        title: "Bing",
        mode: "images",
        host: "www.bing.com",
        pathname: "/images/search",
        seznam: obrazky,
        google: googimg,
        bing: null,
        brave: bravimg,
        duckgo: duckimg,
    },
    {
        title: "Brave",
        mode: "fulltext",
        host: "search.brave.com",
        pathname: "/search",
        seznam: seznam,
        google: google,
        bing: bing,
        brave: null,
        duckgo: duckgo,
        sznhint: sznhint
    },
    {
        title: "Brave",
        mode: "images",
        host: "search.brave.com",
        pathname: "/images",
        seznam: obrazky,
        google: googimg,
        bing: bingimg,
        brave: null,
        duckgo: duckimg,
    }
]
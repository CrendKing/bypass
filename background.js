function getLinkedUrl(url) {
    const urlObj = new URL(url)
    const params = urlObj.searchParams

    for (const paramValue of params.values()) {
        if (paramValue.startsWith('http://') || paramValue.startsWith('https://')) {
            return paramValue
        }
    }

    return null
}

function bypass(tab) {
    browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
        const tab = tabs[0]
        const currentUrl = tab.url
        const linkedUrl = getLinkedUrl(currentUrl)

        if (linkedUrl != null) {
            browser.tabs.update(tab.id, { url: linkedUrl })
        }
    })
}

browser.browserAction.onClicked.addListener(bypass)

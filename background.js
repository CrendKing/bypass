let g_hosts

function refreshListener() {
    browser.tabs.onUpdated.removeListener(handleTabUpdate)
    browser.tabs.onUpdated.addListener(handleTabUpdate, {
        urls: g_hosts,
        properties: ['status'],
    })
}

/*
parameter may be an URL to the destination site
it could be an nested redirection URL with arbitrary levels
use recursion to find the final destination (which contains no redirection)
*/
function findFinalDestination(urlObj) {
    for (const paramValue of urlObj.searchParams.values()) {
        if (paramValue.startsWith('http://') || paramValue.startsWith('https://')) {
            const ret = findFinalDestination(new URL(paramValue))
            if (ret) {
                return ret
            } else {
                return paramValue
            }
        }
    }

    return null
}

function bypass(tabId, url) {
    const urlObj = new URL(url)
    const dest = findFinalDestination(urlObj)
    if (dest) {
        const hostPattern = `*://${urlObj.hostname}/*`
        if (!g_hosts.includes(hostPattern)) {
            g_hosts.push(hostPattern)
            browser.storage.local.set({ hosts: g_hosts })
            refreshListener()
        }

        browser.tabs.update(tabId, { url: dest })
    }
}

function handleClick(tab) {
    browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
        bypass(tab.id, tab.url)
    })
}

function handleTabUpdate(tabId, changeInfo, tabInfo) {
    if (changeInfo.status === 'complete' && changeInfo.url && tabInfo.active) {
        bypass(tabId, changeInfo.url)
    }
}

browser.browserAction.onClicked.addListener(handleClick)

browser.storage.local.get({ hosts: [] }).then((items) => {
    g_hosts = items.hosts
    if (g_hosts.length > 0) {
        refreshListener()
    }
})

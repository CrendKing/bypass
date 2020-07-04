let g_hosts

function refreshListener() {
    browser.tabs.onUpdated.removeListener(handleTabUpdate)
    browser.tabs.onUpdated.addListener(handleTabUpdate, {
        urls: g_hosts,
        properties: ['status'],
    })
}

function bypass(tabId, tabUrl) {
    const urlObj = new URL(tabUrl)
    for (const paramValue of urlObj.searchParams.values()) {
        if (paramValue.startsWith('http://') || paramValue.startsWith('https://')) {
            const hostPattern = `*://${urlObj.hostname}/*`
            if (!g_hosts.includes(hostPattern)) {
                g_hosts.push(hostPattern)
                browser.storage.local.set({ hosts: g_hosts })
                refreshListener()
            }

            browser.tabs.update(tabId, { url: paramValue })
        }
    }
}

function handleClick(tab) {
    browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
        bypass(tab.id, tab.url)
    })
}

function handleTabUpdate(tabId, changeInfo, tabInfo) {
    if (tabInfo.status === 'complete' && tabInfo.active) {
        bypass(tabId, tabInfo.url)
    }
}

browser.browserAction.onClicked.addListener(handleClick)

browser.storage.local.get({ hosts: [] }).then((items) => {
    g_hosts = items.hosts
    if (g_hosts.length > 0) {
        refreshListener()
    }
})

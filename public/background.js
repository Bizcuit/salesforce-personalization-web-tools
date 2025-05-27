import {
    enableThirdPartyCookies,
    execScriptInTab,
    getCurrentTab,
    getHostnameByTab,
    getWebsiteConfig,
    injectClientSDK,
    addEventsToStorage,
    getEventsFromRequest,
    getSitemapConfig,
    getCspDisableRule,
    resetNetworksRules,
    getEvgDisableRule,
    displayExtensionState
} from "./utils.js"

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    processTab(tab)
})

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        processTab(tab)
    });
})

chrome.webRequest.onBeforeRequest.addListener(async (requestDetails) => {
    const tab = await getCurrentTab()
    const hostname = await getHostnameByTab(tab)
    const config = await getWebsiteConfig(hostname)

    if (config) {
        const events = getEventsFromRequest(requestDetails)
        addEventsToStorage(hostname, events)
    }
},
    { urls: ["https://*.c360a.salesforce.com/web/events/*"] },
    ["requestBody"]
)

async function processTab(tab) {
    console.log('Processing tab', tab?.id, tab?.url)

    if (!tab.url) return

    try {
        const hostname = await getHostnameByTab(tab)
        const config = await getWebsiteConfig(hostname)

        resetNetworksRules()
        displayExtensionState(config)

        if (!config) return

        if (config?.isIgnoreCsp) {
            const ruleCsp = getCspDisableRule(hostname)
            await chrome.declarativeNetRequest.updateSessionRules({
                addRules: [ruleCsp],
                removeRuleIds: [ruleCsp.id]
            })
        }

        if (config?.isBlockEvergage) {
            const ruleEvg = getEvgDisableRule()

            await chrome.declarativeNetRequest.updateSessionRules({
                addRules: [ruleEvg],
                removeRuleIds: [ruleEvg.id]
            })
        }

        if (config?.isEnableThirdPartyCookies) {
            await enableThirdPartyCookies(hostname)
        }

        if (config?.sdkUrl) {
            await execScriptInTab(tab, injectClientSDK, [config?.sdkUrl])
        }

        if (config?.isAutoInitSitemap) {
            const sitemapConfig = await getSitemapConfig(hostname)

            if (sitemapConfig?.sitemap) {
                await execScriptInTab(tab, (sitemap) => {
                    if (window.SalesforceInteractions) {
                        try {
                            eval(sitemap)
                        }
                        catch (err) {
                            alert('ERROR:\n'
                                + 'CSP rules block dynamic sitemap injection on this website.\n'
                                + 'Add the code of the sitemap directly to Data Cloud\n'
                                + 'and disable dynamic sitemap execution option')
                        }
                    }
                }, [sitemapConfig?.sitemap])
            }
        }

        chrome.browsingData.removeServiceWorkers({})
    }
    catch (err) {
        console.log('Error processing tab', err)
    }
}
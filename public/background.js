import { 

    enableThirdPartyCookies, 
    execScriptInTab, 
    getCurrentTab, 
    getHostnameByTab, 
    getWebsiteConfig, 
    injectClientSDK, 
    updateCspRules,
    addEventsToStorage, 
    getEventsFromRequest,
    getSitemapConfig
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

        if(config){
            const events = getEventsFromRequest(requestDetails)
            addEventsToStorage(hostname, events)
        }
    },
    { urls: ["https://*.c360a.salesforce.com/web/events/*"] },
    ["requestBody"]
)

async function processTab(tab) {
    console.log('Processing tab', tab?.id, tab?.url)

    if (!tab.url) {
        return
    }

    try {
        const hostname = await getHostnameByTab(tab)
        const config = await getWebsiteConfig(hostname)

        if (!config) {
            console.log('Config not found for the hostname', hostname)
            return
        }

        if (config?.isIgnoreCsp) {
            await updateCspRules(hostname)
        }

        if (config?.isEnableThirdPartyCookies) {
            await enableThirdPartyCookies(hostname)
        }

        if (config?.sdkUrl) {
            await execScriptInTab(tab, injectClientSDK, [config?.sdkUrl])
        }

        if(config?.isAutoInitSitemap){
            const sitemapConfig = await getSitemapConfig(hostname)
            
            if(sitemapConfig?.sitemap){
                await execScriptInTab(tab, (sitemap) => {
                    if(window.SalesforceInteractions){
                        eval(sitemap)
                    }
                }, [sitemapConfig?.sitemap])
            }
        }
    }
    catch (err) {
        console.log('Error processing tab', err)
    }
}
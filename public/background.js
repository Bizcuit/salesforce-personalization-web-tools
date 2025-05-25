import { enableThirdPartyCookies, execScriptInTab, getHostnameByTab, getWebsiteConfig, injectClientSDK, updateCspRules } from "./utils.js"

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    processTab(tab)
})

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        processTab(tab)
    });
})

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        try {
            if (details.method === "GET") {
                console.log("POST URL:", details.url)
            }
            else if (details.method === "POST" && details?.requestBody?.formData && details?.requestBody?.formData?.event) {
                console.log("POST URL:", details.url)
                console.log("Form Data:", JSON.parse(atob(details?.requestBody?.formData?.event)));
            }
        }
        catch (err) {
            console.log("Error capturing DC events", err)
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

        if(!config){
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
    }
    catch (err) {
        console.log('Error processing tab', err)
    }
}
import {
    enableThirdPartyCookies,
    execScriptInTab,
    getCurrentTab,
    getHostnameByTab,
    getHostConfig,
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

chrome.webRequest.onBeforeRequest.addListener(
    async (requestDetails) => {
        const tab = await getCurrentTab()
        const hostname = await getHostnameByTab(tab)
        const config = await getHostConfig(hostname)

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
        const config = await getHostConfig(hostname)

        resetNetworksRules()
        displayExtensionState(config)

        console.log("config", config)

        if (!config) return

        if (config?.sdkConfig?.isIgnoreCsp) {
            const ruleCsp = getCspDisableRule(hostname)
            await chrome.declarativeNetRequest.updateSessionRules({
                addRules: [ruleCsp],
                removeRuleIds: [ruleCsp.id]
            })
        }

        if (config?.sdkConfig?.isBlockEvergage) {
            const ruleEvg = getEvgDisableRule()

            await chrome.declarativeNetRequest.updateSessionRules({
                addRules: [ruleEvg],
                removeRuleIds: [ruleEvg.id]
            })
        }

        if (config?.sdkConfig?.isEnableThirdPartyCookies) {
            await enableThirdPartyCookies(hostname)
        }

        if (config?.sdkConfig?.sdkUrl) {
            await execScriptInTab(tab, injectClientSDK, [config.sdkConfig.sdkUrl])
        }

        if (config?.sdkConfig?.isAutoInitSitemap && config?.sitemap) {
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
            }, [config.sitemap])

        }

        if (config?.sdkConfig?.isInjectEmailCapture) {
            await execScriptInTab(tab, () => {
                console.log("SP Chrome Extension: Injecting email capture")
                if (window.SalesforceInteractions && !document.getElementById('sfsp_bizcuit_injected_emailcapture')) {
                    window.SalesforceInteractions?.cashDom('body')?.append(`
                        <div style="position: fixed; bottom: 20px; right: 20px; padding: 10px 20px; background: white; border: solid 1px #DEDEDE; border-radius: 3px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); z-index: 999999;">
                            <p>
                                <input type="email" id="sfsp_bizcuit_injected_emailcapture" style="border: solid 1px #DEDEDE; padding: 7px 5px; border-radius: 3px; width: 200px; font-size: 12px; font-family: arial;" placeholder="eg: test@salesforce.com"/>
                            </p>
                            <p>
                                <button style="border: solid 1px #DEDEDE; padding: 7px 5px; border-radius: 3px; width: 200px; background: #18ACEF; color: white; font-weight: bold; font-size: 12px; font-family: arial;" onclick="window.sfspCaptureEmail(document.getElementById('sfsp_bizcuit_injected_emailcapture').value); alert('Thank you!'); document.getElementById('sfsp_bizcuit_injected_emailcapture').value = ''">
                                    Introduce Yourself
                                </button>
                            </p>
                        </div>
                    `);
                }
            }, [])
        }

        chrome.browsingData.removeServiceWorkers({})
    }
    catch (err) {
        console.log('Error processing tab', err)
    }
}
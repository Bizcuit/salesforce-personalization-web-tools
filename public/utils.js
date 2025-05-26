export function getCspDisableRule(hostname){
    return {
        "id": 1,
        "priority": 1,
        "action": {
            "type": "modifyHeaders",
            "responseHeaders": [
                {
                    "header": "Content-Security-Policy",
                    "operation": "remove"
                },
                {
                    "operation": "remove",
                    "header": "Content-Security-Policy-Report-Only"
                }
            ]
        },
        "condition": {
            "urlFilter": `*://${hostname}/*`,
            "resourceTypes": [
                "main_frame",
                "sub_frame"
            ]
        }
    }
}

export function getEvgDisableRule(){
    return {
        id: 2,
        priority: 1,
        action: { type: "block" },
        condition: {
            urlFilter: "https://cdn.evgnet.com/*",
        }
    }
}

export async function resetNetworksRules(){
    await chrome.declarativeNetRequest.updateSessionRules({ 
        removeRuleIds: [
            getCspDisableRule().id,
            getEvgDisableRule().id
        ]
    })   
}

export async function displayExtensionState(isActive){
    if (isActive) {
        chrome.action.setTitle({ title: `Configured for this domain` });

        chrome.action.setIcon({
            path: { 128: 'icon-on.png' }
        });
    }
    else {
        chrome.action.setTitle({ title: `Not configured` });

        chrome.action.setIcon({
            path: { 128: 'icon-off.png' }
        });
    }
}

export function enableThirdPartyCookies(hostname) {
    chrome.contentSettings.cookies.set({
        primaryPattern: `*://${hostname}/*`, // The URL of the website for which to set the rule
        secondaryPattern: "<all_urls>", // Important: This makes it a third-party cookie rule
        setting: "allow" // 'allow', 'block', or 'session_only'
    }, function () {
        if (chrome.runtime.lastError) {
            console.error("Error setting cookie content setting:", chrome.runtime.lastError.message);
        } else {
            console.log(`Third-party cookies set to 'allow' for: ${hostname}`);
        }
    });
}

export async function getWebsiteConfig(hostname) {
    if (!hostname) return null

    const storageKey = hostname + '_sdk'

    const configs = await chrome.storage.local.get([storageKey])

    if (!configs?.[storageKey]) return null

    const config = typeof configs?.[storageKey] === 'string' ? JSON.parse(configs?.[storageKey]) : configs?.[storageKey]

    return config
}

export async function getSitemapConfig(hostname) {
    if (!hostname) throw new Error('Hostname not defined, cant receive config')

    const storageKey = hostname + '_pageConfigs'

    const configs = await chrome.storage.local.get([storageKey])

    if (!configs?.[storageKey]) return null

    const config = typeof configs?.[storageKey] === 'string' ? JSON.parse(configs?.[storageKey]) : configs?.[storageKey]

    return config
}


export async function getHostnameByTab(tab) {
    if (!tab?.url) return null

    return URL.parse(tab.url).hostname
}

export async function execScriptInTab(tab, clientFunction, args) {
    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        world: 'MAIN',
        function: clientFunction,
        args: args,
    })

    console.log('Client script executed')
}

export function getEventsFromRequest(requestDetails){
    try {
        if (requestDetails?.method === "GET") {
            console.log("GET URL:", requestDetails.url)
        }
        else if (requestDetails?.method === "POST" && requestDetails?.requestBody?.formData?.event) {
            return JSON.parse(atob(requestDetails?.requestBody?.formData?.event))?.events || []
        }
    }
    catch (err) {
        console.log("Error capturing DC events", err)
    }

    return []
}

export async function getEventsFromStorage(hostname){
    if (!hostname) throw new Error('Hostname not defined, cant receive events')

    const storageKey = hostname + '_events'

    const events = await chrome.storage.local.get([storageKey])

    return events?.[storageKey] ? JSON.parse(events[storageKey]) : []
}

export async function addEventsToStorage(hostname, events){
    if (!hostname) throw new Error('Hostname not defined, cant receive events')

    const storageKey = hostname + '_events'
    let storedEvents = await getEventsFromStorage(hostname)

    storedEvents.unshift(...events)

    if(storedEvents.length > 50){
        storedEvents.splice(50)
    }

    const stringValue = JSON.stringify(storedEvents)

    return chrome.storage.local
        .set({ [storageKey]: stringValue })
}

export function injectClientSDK(url) {
    const nodeId = '_sf_datacloud_injected_websdk'

    const existingSdkNode = document.getElementById(nodeId)

    if (existingSdkNode) {
        console.log('WPM Helper: SDK is already injected');
        return
    }

    console.log('WPM Helper: Injecting SDK ' + url);


    const script = document.createElement('script');
    script.src = url;
    script.id = nodeId;
    document.body.appendChild(script);
}

export async function getCurrentTab() {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true })

    return tab
}
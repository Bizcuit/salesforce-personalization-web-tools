
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
    if (!hostname) throw new Error('Hostname not defined, cant receive config')

    const storageKey = hostname + '_sdk'

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

export async function updateCspRules(hostname) {
    const RULE_SET_ID = 1;

    const rules = [
        {
            "id": RULE_SET_ID,
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
    ];

    await chrome.declarativeNetRequest.updateSessionRules({ addRules: rules, removeRuleIds: [RULE_SET_ID] })

    console.log('CSP rules removed for', hostname)
}
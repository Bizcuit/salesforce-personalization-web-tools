chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    tryInjectSdk(tab)
})

chrome.tabs.onActivated.addListener((tabId, changeInfo, tab) => {
    tryInjectSdk(tab)
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

async function tryInjectSdk(tab) {
    if (!tab) {
        [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
    }

    if (!tab?.url) return;

    const hostname = URL.parse(tab.url).hostname
    const storageKey = hostname + '_sdk'

    const configs = await chrome.storage.local.get([storageKey])

    if (!configs?.[storageKey]) return

    const config = typeof configs?.[storageKey] === 'string' ? JSON.parse(configs?.[storageKey]) : configs?.[storageKey]

    if (!config.sdkUrl) return

    const sdkUrl = config.sdkUrl

    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        args: [sdkUrl],
        world: 'MAIN',
        function: (url) => {
            console.log('Injecting Salesforce Data Cloud SDK: ' + url);

            const id = '_sf_datacloud_injected_websdk';

            if (document.getElementById(id)) return;

            const script = document.createElement('script');
            script.src = url;
            script.id = id;
            document.body.appendChild(script);
        }
    })
}

async function init() {
    tryInjectSdk()
}


function enableThirdPartyCookiesForWebsite(url) {
    chrome.contentSettings.cookies.set({
        primaryPattern: url, // The URL of the website for which to set the rule
        secondaryPattern: "<all_urls>", // Important: This makes it a third-party cookie rule
        setting: "allow" // 'allow', 'block', or 'session_only'
    }, function () {
        if (chrome.runtime.lastError) {
            console.error("Error setting cookie content setting:", chrome.runtime.lastError.message);
        } else {
            console.log(`Third-party cookies set to 'allow' for: ${url}`);
        }
    });
}


init()


/*
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
                }
            ]
        },
        "condition": {
            "resourceTypes": [
                "main_frame",
                "sub_frame"
            ]
        }
    }
];

async function updateDynamicRules() {

    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const existingRuleIds = existingRules.map(rule => rule.id);

    if (existingRuleIds.includes(RULE_SET_ID)) {
        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [RULE_SET_ID]
        });
        console.log(`Removed existing rule with ID: ${RULE_SET_ID}`);
    }


    await chrome.declarativeNetRequest.updateDynamicRules({
        addRules: rules
    });
    console.log(`Added new rule to remove 'X-Powered-By' header.`);
}


updateDynamicRules();



*/
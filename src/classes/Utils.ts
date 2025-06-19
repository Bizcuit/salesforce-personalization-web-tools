// @ts-nocheck

export function downloadTextFile(filename: string, content: string) {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    if (chrome?.downloads?.download) {
        chrome.downloads.download({
            url: url,
            filename: filename,
            saveAs: true // Optional: prompts the user to choose a save location
        }, function (downloadId) {
            if (chrome.runtime.lastError) {
                console.error("Download failed: " + chrome.runtime.lastError.message)
            } else {
                console.log("Download initiated with ID: " + downloadId)
            }
            URL.revokeObjectURL(url) // Clean up the object URL
        })
    }
    else {
        console.log(`===================== ${filename} ====================`)
        console.log(content)
    }
}

async function getCurrentTab() {
    const queryOptions = { active: true, lastFocusedWindow: true }

    if (chrome?.tabs?.query) {
        const [tab] = await chrome.tabs.query(queryOptions)
        return tab
    }

    return null
}

export async function getCurrentUrl() {
    const tab = await getCurrentTab()

    if (tab)
        return URL.parse(tab.url)
    else
        return URL.parse(window.location.href)
}

export function getStorageValue(key: string) {
    if(chrome?.storage?.local)
        return chrome.storage.local
            .get([key])
            .then(output => {
                if(output && output[key]) return JSON.parse(output[key])
                return null 
            })
    else {
        const value = localStorage.getItem(key)
        if(value) return JSON.parse(value)
    }

    return null
}

export function setStorageValue(key: string, value: object) {
    const stringValue = JSON.stringify(value)

    if(chrome?.storage?.local)
        return chrome.storage.local
            .set({ [key]: stringValue })
            .then(_ => {
                console.log(`setStorageValue: ${key}`);
            });
    else 
        return localStorage.setItem(key, stringValue)
}

export function launchWPM(){
    executeScript(() => { 
        if(window.SalesforceInteractions) 
            SalesforceInteractions.Personalization.launchWpm() 
        else 
            alert('No WebSDK found on the Website!')
    }, [])
}

export async function injectSdk(sdkUrl: string, sitemap: string) {
    return await executeScript((url, sitemap) => {
        const script = document.createElement('script');
        script.src = url;

        script.onload = () => {
            console.log(`Script ${url} loaded successfully!`);

            if(sitemap){
                console.log(`Initializing sitemap`);
                eval(sitemap)
            }
        };
        script.onerror = () => {
            console.error(`Error loading script ${url}`);
        };

        document.body.appendChild(script);        
    }, [sdkUrl, sitemap])
}

async function executeScript(clientFunction: Function, args: Array<any>) {
    const tab = await getCurrentTab()
    let result = null

    if (tab && tab.id) {
        try {
            result = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                args: args,
                function: clientFunction,
                world: 'MAIN'
            });
        } catch (error) {
            console.error('Failed to execute script:', error);
        }
    }
    else {
        clientFunction(...args)
    }

    return result
}

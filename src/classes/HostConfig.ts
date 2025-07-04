import DataCloudEvent from "./DataCloudEvent";
import SdkConfig from "./SdkConfig"
import { SitemapConfig, type PageType, generateSitemap } from "./SitemapConfig";
import { getStorageValue, setStorageValue } from "./Utils"

export default class HostConfig {
    hostname: string;
    sdkConfig: SdkConfig;
    sitemapConfig: SitemapConfig;
    
    sitemap: string;
    events: Array<DataCloudEvent>;

    public async getEvents(): Promise<Array<DataCloudEvent>> {
        const events = await getStorageValue(this.hostname + '_events')

        this.events = DataCloudEvent.initFromArray(events && Array.isArray(events) ? events : [])

        return this.events
    }

    public static async getConfig(hostname: string) {
        const hostConfig = await getStorageValue(hostname)

        const result = hostConfig ? new HostConfig(hostConfig) : new HostConfig({hostname: hostname})

        await result.getEvents()

        return result
    }

    public async saveConfig(){
        const value: any = {
            hostname: this.hostname,
            sdkConfig: this.sdkConfig,
            sitemapConfig: this.sitemapConfig,
            sitemap: this.sitemapConfig.sitemap,
            events: this.events ? JSON.stringify(this.events) : []
        }

        await setStorageValue(value.hostname, value)
    }

    constructor(storedValue: any){
        // console.log("storedValue", storedValue)
        this.hostname = storedValue?.hostname || 'demo.com' 
        this.sdkConfig = storedValue?.sdkConfig ? storedValue.sdkConfig as SdkConfig : new SdkConfig(null)
        this.sitemapConfig = storedValue.sitemapConfig ? new SitemapConfig(storedValue.sitemapConfig) : new SitemapConfig(null)
        this.events = []
        this.sitemap = storedValue?.sitemap ? storedValue.sitemap : ''
    }
}
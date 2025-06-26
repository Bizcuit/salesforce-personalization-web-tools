export default class SdkConfig {
    sdkUrl: string;
    isIgnoreCsp: boolean;
    isEnableThirdPartyCookies: boolean;
    isAutoInitSitemap: boolean;
    isBlockEvergage: boolean;
    isInjectEmailCapture: boolean;

    constructor(storedValue: any){
        this.sdkUrl = storedValue?.sdkUrl || ''
        this.isIgnoreCsp = storedValue?.isIgnoreCsp === false || true
        this.isEnableThirdPartyCookies = storedValue?.isEnableThirdPartyCookies === false || true
        this.isAutoInitSitemap = storedValue?.isAutoInitSitemap === false || true
        this.isBlockEvergage = storedValue?.isBlockEvergage === false || true
        this.isInjectEmailCapture = storedValue?.isInjectEmailCapture === false || true
    }
}
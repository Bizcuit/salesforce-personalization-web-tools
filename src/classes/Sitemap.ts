export interface SdkConfig {
    sdkUrl: string;
    isIgnoreCsp: Boolean
}

export interface PageMatch {
    pagePath: string;
    catalogId: string;
}

export interface PageType {
    pageType: string;
    interactionName: string;
    eventType: string;
    catalogType: string;
    isCustomEventType: Boolean;
    hasCatalog: Boolean;
    pages: Array<PageMatch>
}


export function generateSitemap(pageConfigs: Array<PageType>){
    let pagetypes = ''

    pageConfigs.forEach(c => pagetypes += generatePageType(c))
    
    let sitemap = `
        SalesforceInteractions.setLoggingLevel(100);

        window.sfspCaptureEmail = function(value){
            SalesforceInteractions.sendEvent({ 
                interaction: { name: 'emailCapture' }, 
                user: { 
                    attributes: { 
                        eventType: 'contactPointEmail', 
                        email: value
                    }
                } 
            })
        }

        /* ========= START: PERSONALIZATION INITIALIZATION ========= */
        SalesforceInteractions.Personalization.Config.initialize({
            customFlickerDefenseConfig: {
                redisplayTimeoutMilliseconds: 2000,
                renderPersonalizationAfterTimeoutElapsed: true
            },
            additionalTransformers: [{
                name: "SimpleRecs",
                transformerType: "Handlebars",
                lastModifiedDate: new Date().getTime() - (1000 * 60 * 60 * 36),
                substitutionDefinitions: {
                    recs: { defaultValue: '[data]' },
                    image: { defaultValue: '[ImageURL__c]' },
                    name: { defaultValue: '[ssot__Name__c]' },
                    price: { defaultValue: '[UnitPrice__c]' }
                },
                // 36 hours ago
                transformerTypeDetails: {
                    html: \`
                        <style>
                            .sfdcep-recs-carousel { 
                                width: 100%;
                                max-width: 1440px !important;
                                margin: 0px auto;
                                display: flex; 
                                justify-content: space-evenly;
                                flex-flow: row wrap;
                                padding: 20px 0px !important;
                            }
                        
                            .sfdcep-recs-item {
                                margin: 0 !important;
                                width: 25%;
                                min-width: 250px;
                        
                                color: #393939;
                                font-family: Arial, Helvetica, sans-serif;
                                font-size: 15px;
                            }
                        
                            .sfdcep-recs-item-img {
                                text-align: center;
                            }
                        
                            .sfdcep-recs-item-img img {
                                width: 90%;
                                max-height: 320px;
                                max-width: 320px;
                            }
                        
                            .sfdcep-recs-item-name {
                                padding-top: 10px;
                            }
                        
                            .sfdcep-recs-item-name a{
                                color: #393939;
                                text-decoration: none;
                                font-weight: 600;
                            }
                        
                            .sfdcep-recs-item-price {
                                padding-top: 10px;
                            }
                        
                            .sfdcep-recs-item-rating {
                                color: #097fb3;
                                letter-spacing: 3px;
                                padding-top: 10px;
                            }
                        </style>
                        
                        
                        <div class="sfdcep-recs-carousel">
                            {{#each (subVar 'recs')}}
                            <div class="sfdcep-recs-item" >
                                <div class="sfdcep-recs-item-img">
                                    {{#if (subVar 'image')}}
                                        <img src="{{subVar 'image'}}" />
                                    {{else}}
                                        <img src="https://placehold.co/320x320/white/blue?text=*" />
                                    {{/if}}
                                </div>
                        
                                <div class="sfdcep-recs-item-name">
                                    <a href="#">{{subVar 'name'}}</a>
                                </div>
                        
                                <div class="sfdcep-recs-item-price">
                                    {{#if (subVar 'price')}}
                                        $ {{subVar 'price'}}
                                    {{else}}
                                        Out-of-stock
                                    {{/if}}
                                </div>
                        
                                <div class="sfdcep-recs-item-rating"> ★★★★★ </div>
                            </div>
                            {{/each}}
                        </div>
                    \`
                }
            },
            {
                name: "SimpleHero",
                transformerType: "Handlebars",
                lastModifiedDate: new Date().getTime() - (1000 * 60 * 60 * 36),

                substitutionDefinitions: {
                    BackgroundImageUrl: { defaultValue: '[attributes].[BackgroundImageUrl]' },
                    Header: { defaultValue: '[attributes].[Header]' },
                    Subheader: { defaultValue: '[attributes].[Subheader]' },
                    CallToActionUrl: { defaultValue: '[attributes].[CallToActionUrl]' },
                    CallToActionText: { defaultValue: '[attributes].[CallToActionText]' }
                },
                // 36 hours ago
                transformerTypeDetails: {
                    html: \`
                        <style>
                            .sfdcep-banner {
                                margin: 0px auto;
                                width: 100%;
                                /* max-width: 1440px !important; */
                                min-height: 600px;
                                display: flex;
                                flex-flow: column wrap;
                                justify-content: center;
                                font-family: Arial, Helvetica, sans-serif;
                            } 
            
                            .sfdcep-banner-header {
                                font-size: 32px;
                                padding-bottom: 40px;
                                font-weight: 600;
                                color: #DDDDDD;
                                text-align: center;
                            }    
            
                            .sfdcep-banner-subheader {
                                font-size: 20px;
                                font-weight: 400;
                                color: #DDDDDD;
                                text-align: center;
                                padding-bottom: 40px;
                            } 
            
                            .sfdcep-banner-cta {
                                text-align: center;
                            }
            
                            .sfdcep-banner-cta a {
                                padding: 10px 20px;
                                display: inline-block;
                                background-color: #097fb3;
                                border-radius: 20px;
                                color: #DDDDDD;
                                text-decoration: none;
                                font-weight: 400;
                                font-size: 18px;
                            }
                        </style>
            
                        <div class="sfdcep-banner" style="background: url('{{subVar 'BackgroundImageUrl'}}') no-repeat center center;">
                            <div class="sfdcep-banner-header">{{subVar 'Header'}}</div>
                            <div class="sfdcep-banner-subheader">{{subVar 'Subheader'}}</div>
                            <div class="sfdcep-banner-cta">
                                <a href="{{subVar 'CallToActionUrl'}}">{{subVar 'CallToActionText'}}</a>
                            </div>
                        </div>
                    \`
                }
            },
            {
                name: "SimpleOverlay",
                transformerType: "Handlebars",
                lastModifiedDate: new Date().getTime() - (1000 * 60 * 60 * 36),
                // 36 hours ago

                substitutionDefinitions: {
                    BackgroundImageUrl: { defaultValue: '[attributes].[BackgroundImageUrl]' },
                    Header: { defaultValue: '[attributes].[Header]' },
                    Subheader: { defaultValue: '[attributes].[Subheader]' },
                    CallToActionUrl: { defaultValue: '[attributes].[CallToActionUrl]' },
                    CallToActionText: { defaultValue: '[attributes].[CallToActionText]' }
                },
                transformerTypeDetails: {
                    html: \`
                        <style>
                            .sfdcep-overlay {
                                background-color: rgba(0,0,0,0.7);
                                position: fixed;
                                top: 0;
                                bottom: 0;
                                left: 0;
                                right: 0;
                                z-index: 256;
                            }
            
                            .sfdcep-overlay-banner {
                                margin: 0px auto;
                                margin-top: 256px;
                                width: 500px;
                                height: 500px;
                                background-color: white;
                                display: flex;
                                flex-flow: column wrap;
                                justify-content: center;
                                font-family: Arial, Helvetica, sans-serif;
                            }
            
                            .sfdcep-overlay-header {
                                font-size: 32px;
                                padding-bottom: 40px;
                                font-weight: 600;
                                color: #DDDDDD;
                                text-align: center;
                            }
            
                            .sfdcep-overlay-subheader {
                                font-size: 20px;
                                font-weight: 400;
                                color: #DDDDDD;
                                text-align: center;
                                padding-bottom: 40px;
                            }
            
                            .sfdcep-overlay-cta {
                                text-align: center;
                            }
            
                            .sfdcep-overlay-cta a {
                                padding: 10px 20px;
                                display: inline-block;
                                background-color: #097fb3;
                                border-radius: 20px;
                                color: #DDDDDD;
                                text-decoration: none;
                                font-weight: 400;
                                font-size: 18px;
                            }
                        </style>
                        <div class="sfdcep-overlay" onclick="document.body.removeChild(document.querySelector('.sfdcep-overlay'))">
                            <div class="sfdcep-overlay-banner" style="background: url('{{subVar 'BackgroundImageUrl'}}') no-repeat top left;">
                                <div class="sfdcep-overlay-header">{{subVar 'Header'}}</div>
                                <div class="sfdcep-overlay-subheader">{{subVar 'Subheader'}}</div>
                                <div class="sfdcep-overlay-cta">
                                    <a href="{{subVar 'CallToActionUrl'}}">{{subVar 'CallToActionText'}}</a>
                                </div>
                            </div>
                        </div>
                    \`
                }
            }
            ]
        });
        /* ========= END: PERSONALIZATION INITIALIZATION ========= */

        SalesforceInteractions.init({
            personalization: {
                dataspace: "default"
            },
            consents: [{
                purpose: SalesforceInteractions.ConsentPurpose.Tracking,
                provider: "Example Consent Manager",
                status: SalesforceInteractions.ConsentStatus.OptIn,
            }]
        }).then(() => {
            const sitemapConfig = {
                global: {
                    onActionEvent: (event) => { return event; }
                },
                pageTypeDefault: { name: "default" },
                pageTypes: [
                  ${pagetypes}
                ],
            };

            SalesforceInteractions.initSitemap(sitemapConfig);
        });



        /* ============================================ */
        /* ======= EMAIL CAPTURE: DELETE IN PROD ====== */
        /* ============================================ */

        SalesforceInteractions.cashDom('body').append(\`
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
        \`);
    `;

    return sitemap
}

function generatePageType(config: PageType){
    let result = `
                {
                    name: "${config.pageType}",
                    ${generateIsMatch(config)},
                    
                    interaction: { 
                        name: "${config.interactionName}",
                        eventType: "${config.eventType}",
                        ${generateCatalogObject(config)}
                    }
                },
    `

    return result
}

function generateCatalogObject(config: PageType){
    if(!config.hasCatalog) return ''

    let catalogIdSwitch = ''

    config.pages.forEach(p => {
        catalogIdSwitch += `
                                    case "${p.pagePath}": return "${p.catalogId}"`
    })

    let result = `
                        catalogObject: {
                            type: "${config.catalogType}",
                            id: () => {
                                switch(window.location.pathname.toLowerCase()){
                                    ${catalogIdSwitch}
                                    default: return "unknown"
                                }
                            }
                        },
    `

    return result
}

function generateIsMatch(config: PageType){
    let result = ''

    config.pages.forEach(p => {
        result += `
                        "${p.pagePath}",`
    })

    return `
                    isMatch: () => [${result}
                    ].includes(window.location.pathname.toLowerCase())`
}
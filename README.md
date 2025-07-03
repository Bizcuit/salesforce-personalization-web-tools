# wpm-chrome

Developer tools for Salesforce Data Cloud Web SDK and Salesforce Personalization. This extension allows you to quickly inject Data Cloud WebSDK to any website and build a simple Data Cloud Sitemap.

## To inject WebSDK:
- Open the website you would like to inject WebSDK to
- Click on the extension icon to open the configuration UI
- Click on the "SDK" tab
- Paste the SDK URL to the "Data Cloud Web SDK" text field
- Optionally enable or disable additional features
- All changes are saved automatically
- Refresh the webpage. SDK should be automatically injected

## To build a simple Sitemap:
- Open the website you would like to inject WebSDK to
- Click on the extension icon to open the configuration UI
- Click on the "Sitemap" tab
- Add one or multiple Page Types to your sitemap (eg: homepage, pdp, plp, etc...)
- For each created page type manually assign pages that you would like to add to this page type

## To configure a Page Type and add pages to it:
- Navigate to the page you would like to add to a Page Type
- Activate this Chrome extension and click on the Page Type name from the list
- Select an Event Type that you would like to use for this Page Type. Select one of the predefined Event Type or provide a custom value
- Select an Interaction Name that you would like to use for this Page Type. Default value will always be "{name of the Page Type} view"
- Add current page to the Page Type by providing the URL path to the current page. URL path is a part of the URL that follows the domain name, but does not include URL parameters. A few examples:
  - URL: "https://abc.com/" => Path: "/"
  - URL: "https://abc.com/abc/" => Path: "/abc/"
  - URL: "https://abc.com/xyz/qwerty" => Path: "/xyz/qwerty"
  - URL: "https://abc.com/xyz/ddddd?param=value" => Path: "/xyz/ddddd"
- If current Page Type is associated with some item (eg: a product landing page), then you can set the "Has Catalog" flag to YES and assign an item ID (eg: product id) to the page path below. You can also optionally set the item type next to the "Has Catalog" flag

## Using the Sitemap:
- Once all Page Types are configured in the Extension you can download a sitemap, by pressing "Download Sitemap" button in the top right corner. You can then add this sitemap to your Data Cloud Web Connector
- If "Auto Initialize Configured Sitemap" flag is set to YES on the "SDK" tab, then sitemap will be automatically initialized by the chrome extension, so you don't need to upload it to Data Cloud

## Event Capture:
- All events sent to Data Cloud are available on the "Events" tab of the extension. Click on the timestamp of the event to see the entire payload that was sent to Data Cloud

## Starting "Web Personalization Manager"
- Once Web SDK is injected, click "WPM" tab to activate Web Personalization Manager to add personalized experiences to the page

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

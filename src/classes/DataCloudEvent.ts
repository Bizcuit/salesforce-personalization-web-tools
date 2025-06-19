export default class DataCloudEvent {
    content: string;

    get dateTime() {
        let result = null

        if(this.json?.dateTime){
            const date = new Date(this.json?.dateTime)
            result = date.toLocaleString('uk')
        }
        return result
    }
    get interactionName() {
        return this.json?.interactionName
    }
    get eventType() {
        return this.json?.eventType
    }
    get deviceId() {
        return this.json?.deviceId
    }

    get json(): any {
        let json = {}

        try {
            json = JSON.parse(this.content)
        }
        catch (err) { }

        return json
    }

    get formattedJson() {
        return JSON.stringify(this.json, null, 2)
    }

    static initFromArray(data: Array<any>): Array<DataCloudEvent> {
        const result: Array<DataCloudEvent> = []

        console.log("DataCloudEvent.initFromArray", data, typeof data);

        if (data && Array.isArray(data)) {
            data.forEach(i => {
                result.push(new DataCloudEvent(JSON.stringify(i)))
            })
        }

        return result
    }

    constructor(content: string) {
        this.content = content
    }
}
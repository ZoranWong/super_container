export default class CustomEvent extends Event {
    data: any = null;
    constructor (type: string, data: any) {
        super(type);
        this.data = data;
    }
}

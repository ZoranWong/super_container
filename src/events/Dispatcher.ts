import EventListenerInterface from "../contracts/EventListenerInterface";
import Listener from "./Listener";
export default class Dispatcher implements EventListenerInterface {
    private readonly dispatcher: EventListenerInterface = null;
    constructor(dispatcher: any){
        this.dispatcher = new dispatcher();
    }

    public dispatch (event: CustomEvent): void {
        this.dispatcher.dispatch(event);
    }

    public addListener (event: string, listener: Listener): void {
        this.dispatcher.addListener(event, listener);
    }

    public removeListener (event: string): void {
        this.dispatcher.removeListener(event);
    }
}

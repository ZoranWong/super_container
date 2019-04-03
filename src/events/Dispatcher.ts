import EventListenerInterface from "../contracts/EventListenerInterface";
import Listener from "./Listener";
export default class Dispatcher implements EventListenerInterface {
    dispatcher: any = null;
    constructor(){
        this.dispatcher ;
    }

    dispatch (event: CustomEvent): void {
    }

    addListener (event: string, listener: Listener): void {
    }

    removeListener (event: string): void {
    }
}

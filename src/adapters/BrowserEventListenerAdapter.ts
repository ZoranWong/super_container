import EventListenerInterface from "../contracts/EventListenerInterface";
import Listener from "../events/Listener";
export default class BrowserEventListenerAdapter implements EventListenerInterface {
    public addListener (event: string, listener: Listener): void {
        document.addEventListener(event, listener);
    }

    public dispatch (event: any): void {
        document.dispatchEvent(event);
    }

    public removeListener (event: string): void {
        document.removeEventListener(event, null);
    }
}

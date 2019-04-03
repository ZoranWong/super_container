import EventListenerInterface from "../contracts/EventListenerInterface";
import Listener from "../events/Listener";
export default class BrowserEventListenerAdapter implements EventListenerInterface {
    addListener (event: string, listener: Listener): void {
        document.addEventListener(event, listener);
    }

    dispatch (event: any): void {
        document.dispatchEvent(event);
    }

    removeListener (event: string): void {
        document.removeEventListener(event, null);
    }
}

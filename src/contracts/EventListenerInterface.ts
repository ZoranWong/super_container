import Listener from "../events/Listener";

export  default interface EventListenerInterface {
    addListener(event: string, listener: Listener):void;
    dispatch(event: any): void;
    removeListener(event: string): void;
}

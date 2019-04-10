export default interface RouterAdapterInterface {
    addRoute(route: string, options: object): void;
    push(route: string, options: object): void;
}

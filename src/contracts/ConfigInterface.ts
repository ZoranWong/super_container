export default interface ConfigInterface {
    get(key: string): any;
    add(key: string, value: any): any;
    delete(key: string): boolean;
}

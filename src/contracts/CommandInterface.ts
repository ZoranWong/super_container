export default interface CommandInterface {
    handle(param0:any, ... params: any): any;
    commandName(): string;
}

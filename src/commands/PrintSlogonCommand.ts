import CommandInterface from "../contracts/CommandInterface";

export default class PrintSloganCommand implements CommandInterface {
    commandName (): string {
        return "PRINT_SLOGAN";
    }

    handle (): any {
        console.log('%c' +
            ' ======================================================== \n' +
            ' ||                                                    || \n' +
            ' ||         SUPER CONTAINER ELEGANT WAY TO CODE        || \n' +
            ' || Make web front development more elegant and easier || \n' +
            ' ||                                                    || \n' +
            ' ======================================================== ',
            'background:#aaa;color:#bada55');
    }
}

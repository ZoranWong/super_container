export default class PrintSloganCommand {
    commandName() {
        return "PRINT_SLOGAN";
    }
    handle() {
        console.log('%c' +
            ' ======================================================== \n' +
            ' ||                                                    || \n' +
            ' ||         SUPER CONTAINER ELEGANT WAY TO CODE        || \n' +
            ' || Make web front development more elegant and easier || \n' +
            ' ||                                                    || \n' +
            ' ======================================================== ', 'background:#aaa;color:#bada55');
    }
}
//# sourceMappingURL=PrintSlogonCommand.js.map
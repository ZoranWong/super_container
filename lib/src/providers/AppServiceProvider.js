import ServiceProvider from "../support/ServiceProvider";
import PrintSloganCommand from "../commands/PrintSlogonCommand";
export default class AppServiceProvider extends ServiceProvider {
    register() {
        this.app.registerCommand(PrintSloganCommand);
    }
    boot() {
        this.app.command('PRINT_SLOGAN');
    }
}
//# sourceMappingURL=AppServiceProvider.js.map
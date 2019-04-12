import ServiceProvider from "../support/ServiceProvider";
import PrintSloganCommand from "../commands/PrintSlogonCommand";

export default class AppServiceProvider extends ServiceProvider {
    public register (): void {
        this.app.registerCommand(PrintSloganCommand);
    }

    public boot(){
        this.app.command('PRINT_SLOGAN');
    }
}

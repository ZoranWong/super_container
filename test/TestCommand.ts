import CommandInterface from "../src/contracts/CommandInterface";

export default class TestCommand implements CommandInterface {
    commandName (): string {
        return "TEST_COMMAND";
    }

    handle (test: string): any {
        console.log(test);
    }
}

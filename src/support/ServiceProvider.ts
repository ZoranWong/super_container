import Container from '../container/Container';
import ServiceProviderInterface from '../contracts/ServiceProviderInterface';
import Application from '../Application';
export default class ServiceProvider implements ServiceProviderInterface {
    protected app: Application;

    public constructor (app: Application) {
        this.app = app;
    }

    public boot (): void {
    }

    public register (): void {
    }
}

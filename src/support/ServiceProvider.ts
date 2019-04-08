import Container from '../container/Container';
import ServiceProviderInterface from '../contracts/ServiceProviderInterface';

export default class ServiceProvider implements ServiceProviderInterface {
    protected app: Container;

    public constructor (app: Container) {
        this.app = app;
    }

    public boot (): void {
    }

    public register (): void {
    }
}

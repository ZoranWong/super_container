export default interface ServiceProviderInterface {
    boot(): void;
    register(): void;
}

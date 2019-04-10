export default interface FrameworkInstanceAdapterInterface {
    beforeMounted(): void;
    mounted(): void;
    beforeCreate(): void;
    created(): void;
    beforeUpdate(): void;
    updated(): void;
    beforeDestroy(): void;
    destroyed(): void;
    mount(): void;
}

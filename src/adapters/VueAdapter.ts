import AdapterInterface from '../contracts/FrameworkInstanceAdapterInterface';
import {Vue} from "vue/types/vue";

export default class VueAdapter implements AdapterInterface {
    protected vue: Vue = null;
    protected options: object = null;
    public constructor (options: object = {}) {
        this.options = options;
    }

    public mount (): void {
        this.vue = new Vue(this.options);
        this.vue.$mount();
    }

    public beforeCreate (): void {
    }

    public beforeDestroy (): void {
    }

    public beforeMounted (): void {
    }

    public beforeUpdate (): void {
    }

    public created (): void {
    }

    public destroyed (): void {
    }

    public mounted (): void {
    }

    public updated (): void {
    }
}

import AdapterInterface from '../contracts/FrameworkInstanceAdapterInterface';
import Vue from "vue";
import Container from '../contracts/Container';
import * as _ from 'underscore';
export default class VueAdapter implements AdapterInterface {
    protected vue: Vue = null;
    protected options: object = null;
    private app: Container = null;
    private id: string = '#id';
    public constructor (app: Container, id: string  = 'id', options: object = {}) {
        this.app = app;
        this.options = options;
        this.id = `#${id}`;
    }

    public mount (): void {
        let options = {
            el: this.id,
            router: this.app.get('router')
        };
        options = _.extend(options, this.options);
        this.vue = new Vue(options);
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

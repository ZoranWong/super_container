import AdapterInterface from '../contracts/FrameworkInstanceAdapterInterface';
import Vue from "vue";
import Container from '../contracts/Container';
import * as _ from 'underscore';
import Application from "../Application";

export default class VueAdapter implements AdapterInterface {
    protected vue: Vue = null;
    protected options: any = null;
    private readonly app: Application = null;
    private readonly id: string = '#id';

    public constructor (app: Application, id: string = 'id', options: any = null) {
        this.app = app;
        this.options = options;
        this.id = `#${id}`;
    }

    private buildOptions () {
        let created = ((vue: any) => {
            this.options['created'] || this.options['created']();
            vue.$main = this.app;
            this.created();
        });
        this.options['created'] = function () {
            created(this);
        }
    }

    public mount (): void {
        let options = {
            el: this.id,
            router: this.app.get('router')
        };
        this.buildOptions();
        options = _.extend(options, this.options);
        Vue.mixin({
            methods: {
                $command: (name, ...parameters: any): any => {
                    console.log(name, parameters);
                    return this.app.command(name, parameters);
                }
            }
        });
        this.vue = new Vue(options);
        this.vue.$mount(this.id);
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

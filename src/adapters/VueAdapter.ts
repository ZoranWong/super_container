import AdapterInterface from '../contracts/FrameworkInstanceAdapterInterface';
import Vue from "vue";
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
        let optionCreated = this.options['created'];
        let created = ((vue: any) => {
            optionCreated && optionCreated();
            vue.$main = this.app;
            this.created();
        });
        this.options['created'] = function () {
            created(this);
        }
    }

    private mixins () {
        Vue.mixin({
            methods: {
                $command: (name, ...parameters: any): any => {
                    let params = [name].concat(parameters);
                    return this.app.command.apply(this.app, params);
                }
            }
        });
        this.app.getInstances().forEach(function (value: any, prop: string) {
            Object.defineProperty(Vue.prototype, prop, {
                get (): any {
                    return value;
                },
                set (v: any): void {
                    return value = v;
                }
            })
        });
    }

    public mount (): void {
        let options = {
            router: this.app.get('router')
        };
        this.buildOptions();
        options = _.extend(options, this.options);
        this.mixins();
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

import Vue from "vue";
import * as _ from 'underscore';
export default class VueAdapter {
    constructor(app, id = 'id', options = null) {
        this.vue = null;
        this.options = null;
        this.app = null;
        this.id = '#id';
        this.app = app;
        this.options = options;
        this.id = `#${id}`;
    }
    buildOptions() {
        let created = ((vue) => {
            this.options['created'] || this.options['created']();
            vue.$main = this.app;
            this.created();
        });
        this.options['created'] = function () {
            created(this);
        };
    }
    mount() {
        let options = {
            el: this.id,
            router: this.app.get('router')
        };
        this.buildOptions();
        options = _.extend(options, this.options);
        Vue.mixin({
            methods: {
                $command: (name, ...parameters) => {
                    let params = [name].concat(parameters);
                    return this.app.command.apply(this.app, params);
                }
            }
        });
        this.app.getInstances().forEach(function (value, prop) {
            Object.defineProperty(Vue.prototype, prop, {
                get() {
                    return value;
                },
                set(v) {
                    return value = v;
                }
            });
        });
        this.vue = new Vue(options);
        this.vue.$mount(this.id);
    }
    beforeCreate() {
    }
    beforeDestroy() {
    }
    beforeMounted() {
    }
    beforeUpdate() {
    }
    created() {
    }
    destroyed() {
    }
    mounted() {
    }
    updated() {
    }
}
//# sourceMappingURL=VueAdapter.js.map
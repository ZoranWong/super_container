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
                    console.log(name, parameters);
                    return this.app.command(name, parameters);
                }
            }
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
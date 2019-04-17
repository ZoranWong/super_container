import {Closure} from "../utils/helper";

type FrameworkAdapterOptions = {
    application: any,
    root?: string,
    component: any,
    boot: Closure
};
export default FrameworkAdapterOptions;

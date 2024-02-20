import { createStore } from "vuex";
import {auth} from "@/store/auth.module";

export default createStore({
    modules: {
        auth,
    }
});
import Vue from "vue";
import Vuex from "vuex";
import { downloadJSON } from "../helper/download";
import { colors } from "quasar";
import { Client } from "../models/client";
import { createDirectStore } from "direct-vuex";
import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

const { setBrand } = colors;

Vue.use(Vuex);

export interface StoreState {
    clients: Client[];
    isLoadingClientList: boolean;
}

const { store, rootActionContext, moduleActionContext } = createDirectStore({
    state: {
        clients: [],
        isLoadingClientList: false
    } as StoreState,
    getters,
    mutations,
    actions,

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: (process.env.DEV as unknown) === true || process.env.DEV === "true"
});

store.dispatch.fetchClientsFromDB().catch(() => 0);

let lastFetch = 0;
window.addEventListener("focus", () => {
    if (Date.now() > lastFetch + 3600 * 1000) {
        store.dispatch.fetchClientsFromDB().catch(() => 0);
        lastFetch = Date.now();
    }
});
window.addEventListener("online", () => {
    store.dispatch.fetchClientsFromDB().catch(() => 0);
    lastFetch = Date.now();
});

setBrand("classification", "#f44336");
setBrand("outcome", "#009688");
setBrand("intervention", "#ff6f00");

// @ts-ignore
window.download = () => downloadJSON(store.state.clients || [], "sample1.json");

// Export the original Vuex store because of quasar
export default store.original;

// the typesafe, direct store
export { store };

// The following exports will be used to enable types in the
// implementation of actions.
export { rootActionContext, moduleActionContext };

// The following lines enable types in the injected store '$store'.
export type AppStore = typeof store;
declare module "vuex" {
    interface Store<S> {
        direct: AppStore;
    }
}

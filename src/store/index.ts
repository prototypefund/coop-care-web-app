import Vue from "vue";
import Vuex from "vuex";
import { downloadJSON } from "../helper/download";
import { setupColors } from "../helper/color";
import { Client, User } from "../models";
import { createDirectStore } from "direct-vuex";
import { ccApi } from "../api/apiProvider";
import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

Vue.use(Vuex);

export interface StateInterface {
    currentUser?: User;
    clients: Client[];
    isLoadingClientList: boolean;
}

const { store, rootActionContext, moduleActionContext } = createDirectStore({
    state: {
        currentUser: ccApi.user,
        clients: [],
        isLoadingClientList: false
    } as StateInterface,
    getters,
    mutations,
    actions,

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: (process.env.DEV as unknown) === true || process.env.DEV === "true"
});

void store.dispatch.fetchClientsFromDB();

let lastFetch = 0;
window.addEventListener("focus", () => {
    if (Date.now() > lastFetch + 3600 * 1000) {
        void store.dispatch.fetchClientsFromDB();
        lastFetch = Date.now();
    }
});
window.addEventListener("online", () => {
    void store.dispatch.fetchClientsFromDB();
    lastFetch = Date.now();
});

// @ts-ignore
window.download = () => downloadJSON(store.state.clients || [], "sample1.json");

setupColors();

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Store<S> {
        direct: AppStore;
    }
}

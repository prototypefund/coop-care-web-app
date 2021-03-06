<template>
  <q-page class="limit-page-width">
    <client-drawer ref="clientDrawer" />

    <loading v-if="$store.direct.state.isLoadingClientList && !clients.length" />

    <div
      v-else-if="
        !$store.direct.state.isLoadingClientList &&
          !clients.length &&
          !$route.params.clientId
      "
      class="fit"
    >
      <div class="q-pa-md absolute-center vertical-middle column items-center full-width">
        <div class="text-center text-body2">{{ $t("noExistingClient") }}</div>
        <q-btn
          @click="$router.push({ name: 'client', params: { clientId: 'new' } })"
          no-caps
          color="primary"
          rounded
          :label="$t('createFirstClient')"
          class="q-mt-md"
        />
      </div>
    </div>

    <div
      v-else-if="clients.length && !$route.params.clientId"
      class="fit"
    >
      <div class="q-pa-md absolute-center full-width vertical-middle text-center text-body2 ">
        {{ $t("noSelectedClient") }}
      </div>
    </div>

    <div
      v-else-if="$route.params.clientId == 'new'"
      class="fit"
    >
      <new-client
        class="q-py-xl q-px-lg"
        @save="addClient"
        @cancel="$router.push({ name: 'client' })"
      />
    </div>

    <central-message
      v-else-if="$route.params.clientId && !selectedClient"
      :message="$t('clientNotFound')"
    />

    <div
      class="client-overview q-pt-lg q-px-xl q-pb-xl"
      v-else-if="selectedClient"
    >
      <div class="row">
        <div class="col row q-mt-sm q-mb-xl">
          <content-editable
            class="q-py-sm q-mr-md text-h2"
            v-text="firstName"
            :contenteditable="!isDisabled"
            @change="firstName = $event.value"
          />
          <content-editable
            class="q-py-sm text-h2"
            v-text="lastName"
            :contenteditable="!isDisabled"
            @change="lastName = $event.value"
          />
        </div>
        <div>
          <action-menu
            :items="clientActionItems"
            class="on-right q-mt-sm q-mr-sm"
          />
        </div>
      </div>
      <q-tabs
        v-model="selectedTab"
        no-caps
        class="bg-grey-1 q-mb-md text-primary"
        :inline-label="$q.screen.gt.xs"
        :dense="!$q.screen.gt.xs"
        align="left"
      >
        <q-route-tab
          name="reminders"
          :label="$tc('task', 2)"
          icon="fas fa-tasks"
          :to="{ name: 'clientReminders', params: $route.params }"
          class="text-intervention"
        >
          <q-badge
            color="intervention"
            floating
            :label="dueTaskCount"
            v-if="dueTaskCount"
            class="radius-lg text-weight-medium"
          />
        </q-route-tab>
        <q-route-tab
          name="report"
          :label="$t('reportTitle')"
          icon="fas fa-notes-medical"
          :to="{ name: 'clientReport', params: $route.params }"
          class="text-classification"
        />
        <q-route-tab
          name="history"
          :label="$t('documentationHistory')"
          icon="fas fa-history"
          :to="{ name: 'clientHistory', params: $route.params }"
          class="text-outcome"
        />
        <q-route-tab
          v-if="false"
          name="masterData"
          :label="$t('masterDataTitle')"
          icon="fas fa-address-book"
          :to="{ name: 'clientMasterData', params: $route.params }"
          class="text-primary"
        />
      </q-tabs>
      <q-tab-panels
        animated
        v-model="selectedTab"
      >
        <q-tab-panel
          name="reminders"
          class="q-px-none"
        >
          <client-reminders />
        </q-tab-panel>
        <q-tab-panel
          name="report"
          class="q-px-none"
        >
          <client-problems />
        </q-tab-panel>
        <q-tab-panel
          name="history"
          class="q-px-none"
        >
          <client-history />
        </q-tab-panel>
        <q-tab-panel
          name="masterData"
          class="q-px-none"
        >
          <client-master-data />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<style lang="sass">
.client-overview
  @media (max-width: $breakpoint-xs-max)
    padding: 8px
</style>

<script lang="ts">
import { Vue, Component, Ref } from "vue-property-decorator";
import ClientDrawer from "../components/ClientDrawer.vue";
import ContentEditable from "../components/ContentEditable.vue";
import NewClient from "../components/NewClient.vue";
import ActionMenu from "../components/ActionMenu.vue";
import ClientProblems from "../components/ClientProblems.vue";
import ClientReminders from "../components/ClientReminders.vue";
import ClientHistory from "../components/ClientHistory.vue";
import ClientMasterData from "../components/ClientMasterData.vue";
import { Client, MasterData } from "../models";
import Loading from "components/Loading.vue";
import CentralMessage from "components/CentralMessage.vue";

@Component({
  components: {
    ContentEditable,
    NewClient,
    ActionMenu,
    ClientDrawer,
    ClientProblems,
    ClientReminders,
    ClientHistory,
    ClientMasterData,
    Loading,
    CentralMessage,
  },
})
export default class PageIndex extends Vue {
  @Ref() readonly  clientDrawer!: ClientDrawer;

  selectedTab = null;

  get firstName() {
    return this.selectedClient?.masterData.firstName || "";
  }
  set firstName(value) {
    this.updateMasterData("firstName", value);
  }
  get lastName() {
    return this.selectedClient?.masterData.lastName || "";
  }
  set lastName(value) {
    this.updateMasterData("lastName", value);
  }
  get clients() {
    return this.$store.direct.state.clients;
  }
  get clientActionItems() {
    const client = this.selectedClient;
    if (!client) {
      return [];
    }

    return [
      {
        name: this.$t("showProofOfPerformance") + " …",
        icon: "fas fa-clipboard",
        action: () => this.pushRoute("proofOfPerformance"),
      },
      {
        name: this.$t("clientDischarge"),
        icon: "fas fa-archive",
        action: this.archiveClient,
        condition: !client.leftAt,
      },
      {
        name: this.$t("clientReadmission"),
        icon: "fas fa-folder-open",
        action: this.unarchiveClient,
        condition: !!client.leftAt,
      },
      {
        name: this.$t("deleteClient"),
        icon: "delete_forever",
        action: this.deleteClient,
        condition: !!client.leftAt || !client.problems.length,
        isDestructive: true,
      },
    ];
  }
  get dueTaskCount() {
    return this.selectedClient?.dueTasksCount || 0;
  }
  get selectedClient() {
    return this.$store.direct.getters.getClient(this.$root.$route.params);
  }
  get isDisabled() {
    return !!this.selectedClient?.leftAt;
  }

  created() {
    void this.$store.direct.dispatch
      .saveClient({ client: this.selectedClient, resolveOnError: true })
      .then(() => this.$store.direct.dispatch.fetchClientsFromDB())
  }

  addClient(masterData: MasterData) {
    const userId = this.$store.direct.state.currentUser?.id;
    if (!userId) {
      return;
    }

    const client = new Client(userId);
    client.masterData = masterData;
    this.$ccApi
      .createClient(client)
      .then((client) => {
        void this.$store.direct.dispatch.fetchClientsFromDB().then(() => {
          void this.$router.push({
            name: "clientReport",
            params: { clientId: client._id?.toString() || "" },
          });
        });
      })
      .catch(console.error);
  }

  updateMasterData(key: keyof MasterData, value: any) {
    this.updateClient((client) => {
      const changes: any = {};
      changes[key] = value;
      this.$store.direct.commit.updateObject({
        target: client.masterData,
        changes: changes,
      });
    });
  }

  archiveClient() {
    this.updateClient((client) =>
      this.$store.direct.commit.archiveClient(client)
    );
    this.clientDrawer.archivedClientsExpansionState = true;
  }

  unarchiveClient() {
    this.updateClient((client) =>
      this.$store.direct.commit.unarchiveClient(client)
    );
    this.clientDrawer.activeClientsExpansionState = true;
  }

  updateClient(mutate: (client: Client) => void) {
    setTimeout(() => {
      const client = this.selectedClient;
      if (!client) {
        return;
      }

      mutate(client);
      void this.$store.direct.dispatch.saveClient({
        client: this.selectedClient,
      });
    }, 0);
  }

  deleteClient() {
    if (this.selectedClient) {
      void this.$store.direct.dispatch.deleteClient(this.selectedClient);
      void this.$router.push({ name: "client" });
    }
  }

  pushRoute(name: string) {
    void this.$router.push({
      name: name,
      params: this.$route.params,
    });
  }
}
</script>

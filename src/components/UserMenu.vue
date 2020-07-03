<template>
  <q-btn
    v-if="$ccApi.isLoggedIn"
    icon="account_circle"
    flat
    stretch
    style="max-width:44px"
  >
    <q-menu
      max-width="260px"
      max-height="calc(96vh - 50px)"
    >
      <q-list
        class="text-body2"
        style="width: 260px"
      >
        <q-item-label
          header
          class="text-black"
        >
          <simplified-markdown :text="$t('accountWelcomeMessage', {name: $store.direct.state.signature || ''})" />
          <div class="q-mt-xs text-caption text-weight-medium">
            {{ $ccApi.username }}
          </div>
        </q-item-label>

        <q-separator />

        <q-item clickable>
          <q-item-section side>
            <q-icon name="fas fa-globe" />
          </q-item-section>
          <q-item-section>{{ $t("selectLanguage", {language: $t($root.$i18n.locale)}) }}</q-item-section>
          <q-item-section side>
            <q-icon name="fas fa-angle-right" />
          </q-item-section>
          <language-menu
            :anchor="$q.screen.gt.xs ? 'top left' : ''"
            :self="$q.screen.gt.xs ? 'top right' : ''"
            :fit="true"
          />
        </q-item>
        <q-item
          clickable
          v-close-popup
          @click="$router.push({name: 'userSettings'})"
        >
          <q-item-section side>
            <q-icon name="fas fa-user-cog" />
          </q-item-section>
          <q-item-section>{{ $t("userSettings") }}</q-item-section>
        </q-item>
        <q-item
          clickable
          v-close-popup
          @click="$router.push({name: 'teamSettings'})"
        >
          <q-item-section side>
            <q-icon name="fas fa-users-cog" />
          </q-item-section>
          <q-item-section>{{ $t("teamSettings") }}</q-item-section>
        </q-item>

        <q-separator />

        <q-item
          clickable
          v-close-popup
          @click="openMail()"
        >
          <q-item-section side>
            <q-icon name="feedback" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('feedback') }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item
          clickable
          v-close-popup
          @click="logout"
        >
          <q-item-section side>
            <q-icon name="fas fa-sign-out-alt" />
          </q-item-section>
          <q-item-section>{{ $t("logout") }}</q-item-section>
        </q-item>

        <q-separator />

        <q-item class="column q-px-none text-grey-7">
          <q-btn
            :label="$t('contributeAndOpenSource')"
            flat
            no-caps
            class="text-caption"
            type="a"
            href="https://github.com/coop-care/web-app"
            target="_blank"
            icon-right="fab fa-github"
            v-close-popup
          />
          <q-btn
            :label="$t('aboutUs')"
            flat
            no-caps
            class="text-caption"
          />
          <q-btn
            :label="$t('privacyPolicy')"
            flat
            no-caps
            class="text-caption"
          />
        </q-item>

      </q-list>
    </q-menu>
  </q-btn>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import LanguageMenu from "./LanguageMenu.vue";
import SimplifiedMarkdown from "./SimplifiedMarkdown.vue";

@Component({
  components: {
    LanguageMenu,
    SimplifiedMarkdown
  }
})
export default class UserMenu extends Vue {
  openMail() {
    location.href =
      "mailto:feedback@coopcare.de?subject=CoopCare Feedback&body=" +
      encodeURIComponent("\n\n\n––––––––––––––––––––\n") +
      "Einige freiwillige technische Angaben, die uns beim Nachvollziehen des Feedbacks helfen:" +
      encodeURIComponent("\n\nBrowser: ") +
      this.$q.platform.userAgent +
      encodeURIComponent("\nRoute: ") +
      this.$router.currentRoute.path;
  }
  logout() {
    this.$ccApi.logout().then(() => this.$router.push({ name: "login" }));
  }
}
</script>
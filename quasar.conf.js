// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js

module.exports = function(ctx) {
  return {
    // Quasar looks for *.js files by default
    sourceFiles: {
      router: "src/router/index.ts",
      store: "src/store/index.ts"
    },
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://quasar.dev/quasar-cli/cli-documentation/boot-files
    boot: ["i18n", "quasar-lang-pack"],

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
    css: ["app.sass"],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v4',
      // 'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      "roboto-font", // optional, you are not bound to it
      "material-icons", // optional, you are not bound to it
      "fontawesome-v5"
    ],

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
    framework: {
      // iconSet: 'ionicons-v4', // Quasar icon set
      // lang: 'de', // Quasar language pack

      // Possible values for "all":
      // * 'auto' - Auto-import needed Quasar components & directives
      //            (slightly higher compile time; next to minimum bundle size; most convenient)
      // * false  - Manually specify what to import
      //            (fastest compile time; minimum bundle size; most tedious)
      // * true   - Import everything from Quasar
      //            (not treeshaking Quasar; biggest bundle size; convenient)
      all: false,

      components: [
        "QLayout",
        "QHeader",
        "QDrawer",
        "QPageContainer",
        "QPage",
        "QToolbar",
        "QToolbarTitle",
        "QBtn",
        "QIcon",
        "QList",
        "QItem",
        "QItemSection",
        "QItemLabel",
        "QStepper",
        "QStep",
        "QStepperNavigation",
        "QSlider",
        "QBtnToggle",
        "QInput",
        "QIcon",
        "QTree",
        "QSeparator",
        "QRadio",
        "QOptionGroup",
        "QTabs",
        "QTab",
        "QTabPanels",
        "QTabPanel",
        "QCard",
        "QCardSection",
        "QPopupEdit",
        "QBtnDropdown",
        "QForm",
        "QCardActions",
        "QChip",
        "QExpansionItem",
        "QCheckbox",
        "QTooltip",
        "QBadge",
        "QTimeline",
        "QTimelineEntry",
        "QSelect",
        "QTime",
        "QPopupProxy",
        "QDate",
        "QToggle",
        "QSpinner",
        "QRouteTab",
        "QMenu",
        "QResizeObserver",
        "QColor",
        "QSpace",
        "QPageSticky",
        "QBanner"
      ],

      directives: ["Ripple", "TouchSwipe", "ClosePopup"],

      // Quasar plugins
      plugins: ["Meta", "Dialog"]
    },

    // https://quasar.dev/quasar-cli/cli-documentation/supporting-ie
    supportIE: false,

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
    build: {
      scopeHoisting: true,
      devtool: "source-map"
      // vueRouterMode: 'history',
      // showProgress: false,
      // gzip: true,
      // analyze: true,
      // preloadChunks: false,
      // extractCSS: false,

      // https://quasar.dev/quasar-cli/cli-documentation/handling-webpack
      // extendWebpack(cfg) {
      //   cfg.module.rules.push({
      //     enforce: "pre",
      //     test: /\.(js|vue)$/,
      //     loader: "eslint-loader",
      //     exclude: /node_modules/,
      //     options: {
      //       formatter: require("eslint").CLIEngine.getFormatter("stylish")
      //     }
      //   });
      // }
    },

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
    devServer: {
      // https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },

    // animations: 'all', // --- includes all animations
    // https://quasar.dev/options/animations
    animations: ["fadeInDown", "fadeOutUp"],

    // https://quasar.dev/quasar-cli/developing-ssr/configuring-ssr
    ssr: {
      pwa: false
    },

    // https://quasar.dev/quasar-cli/developing-pwa/configuring-pwa
    pwa: {
      // workboxPluginMode: 'InjectManifest',
      workboxOptions: {
        include: [/.*/],
        navigateFallback: "index.html"
      }, // only for NON InjectManifest
      metaVariables: {
        appleMobileWebAppStatusBarStyle: "black" //"black-translucent"
      },
      manifest: {
        name: "CoopCare",
        short_name: "CoopCare",
        description:
          "Omaha System based open source software for cooperative care teams",
        display: "standalone",
        orientation: "portrait",
        background_color: "#009688",
        theme_color: "#009688",
        start_url: "/",
        icons: [
          {
            src: "statics/icons/icon-128x128.png",
            sizes: "128x128",
            type: "image/png"
          },
          {
            src: "statics/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "statics/icons/icon-256x256.png",
            sizes: "256x256",
            type: "image/png"
          },
          {
            src: "statics/icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png"
          },
          {
            src: "statics/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    },

    // https://quasar.dev/quasar-cli/developing-cordova-apps/configuring-cordova
    cordova: {
      // id: '',
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // https://quasar.dev/quasar-cli/developing-electron-apps/configuring-electron
    electron: {
      // bundler: 'builder', // or 'packager'

      extendWebpack(cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration
        // appId: 'coopcare'
      }
    }
  };
};

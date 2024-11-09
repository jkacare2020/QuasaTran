/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js

// let API_LOCAL = "http://localhost:3000";
//let API_PRODUCTION ="https://quasargram-jason-backend-2024-98f0d3ac8c4a.herokuapp.com";

module.exports = function (/* ctx */) {
  const dotenv = require("dotenv");
  dotenv.config(); // Load environment variables from .env
  return {
    // https://quasar.dev/quasar-cli/cli-documentation/supporting-ts
    supportTS: false,

    // https://quasar.dev/quasar-cli/cli-documentation/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://quasar.dev/quasar-cli/cli-documentation/boot-files
    boot: ["axios"],

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
    css: ["app.sass"],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v5',
      // 'fontawesome-v5',
      "eva-icons",
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      "roboto-font", // optional, you are not bound to it
      "material-icons", // optional, you are not bound to it
    ],

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
    build: {
      env: {
        // Choose the correct API based on the environment
        API:
          process.env.NODE_ENV === "production"
            ? process.env.VUE_APP_API_PRODUCTION // Production API for production build
            : process.env.VUE_APP_API_LOCAL, // Local API for development

        // Firebase keys
        VUE_APP_FIREBASE_API_KEY: process.env.VUE_APP_FIREBASE_API_KEY,
        VUE_APP_FIREBASE_AUTH_DOMAIN: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
        VUE_APP_FIREBASE_PROJECT_ID: process.env.VUE_APP_FIREBASE_PROJECT_ID,
        VUE_APP_FIREBASE_STORAGE_BUCKET:
          process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
        VUE_APP_FIREBASE_MESSAGING_SENDER_ID:
          process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
        VUE_APP_FIREBASE_APP_ID: process.env.VUE_APP_FIREBASE_APP_ID,
      },

      // vueRouterMode: "hash", // available values: 'hash', 'history'

      vueRouterMode: "history", // cleaner URLs, make sure server config is in place

      transpileDependencies: ["idb"],

      // https://quasar.dev/quasar-cli/cli-documentation/handling-webpack
      extendWebpack(cfg) {
        console.log("API_LOCAL:", process.env.VUE_APP_API_LOCAL);
        console.log("API_PRODUCTION:", process.env.VUE_APP_API_PRODUCTION);
      },
    },

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
    devServer: {
      https: false,
      port: 8080,
      open: true, // opens browser window automatically
    },

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
    framework: {
      iconSet: "material-icons", // Quasar icon set
      lang: "en-us", // Quasar language pack

      // Possible values for "all":
      // * 'auto' - Auto-import needed Quasar components & directives
      //            (slightly higher compile time; next to minimum bundle size; most convenient)
      // * false  - Manually specify what to import
      //            (fastest compile time; minimum bundle size; most tedious)
      // * true   - Import everything from Quasar
      //            (not treeshaking Quasar; biggest bundle size; convenient)
      importStrategy: "auto",

      components: [],
      directives: [],

      // Quasar plugins
      plugins: ["Dialog", "Notify", "Loading", "LocalStorage"],
    },

    // animations: 'all', // --- includes all animations
    // https://quasar.dev/options/animations
    animations: ["fadeIn", "fadeOut"],

    // https://quasar.dev/quasar-cli/developing-ssr/configuring-ssr
    ssr: {
      pwa: false,
    },

    // https://quasar.dev/quasar-cli/developing-pwa/configuring-pwa
    pwa: {
      workboxPluginMode: "InjectManifest", // 'GenerateSW' or 'InjectManifest'
      workboxOptions: {}, // only for GenerateSW
      manifest: {
        name: "Quasagram - Share Your Experiences",
        short_name: "Quasagram",
        description: "A Simple Instagram Clone - Made with Quasar",
        display: "standalone",
        orientation: "portrait",
        background_color: "#ffffff",
        theme_color: "#212121",
        icons: [
          {
            src: "icons/icon-128x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/icon-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
      id: "org.cordova.quasar.app",
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true,
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-electron-apps/configuring-electron
    electron: {
      bundler: "packager", // 'packager' or 'builder'

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

        appId: "quasagram",
      },

      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: true,

      extendWebpack(/* cfg */) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },
    },
  };
};

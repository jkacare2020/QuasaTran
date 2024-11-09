<!-- <template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-grey-10" bordered>
      <q-toolbar class="constrain">
        <q-btn
          to="/camera"
          class="large-screen-only q-mr-sm"
          icon="eva-camera-outline"
          size="18px"
          flat
          round
          dense
        />
        <q-separator class="large-screen-only" vertical spaced />
        <q-toolbar-title class="text-grand-hotel text-bold">
          Quasagram
        </q-toolbar-title>
        <q-btn
          to="/"
          class="large-screen-only"
          icon="eva-home-outline"
          size="18px"
          flat
          round
          dense
        />
      </q-toolbar>
    </q-header>

    <q-footer class="bg-white" bordered>
      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <div v-if="showAppInstallBanner" class="banner-container bg-primary">
          <div class="constrain">
            <q-banner class="bg-primary text-white" inline-actions dense>
              <template v-slot:avatar>
                <q-avatar
                  color="white"
                  icon="eva-camera-outline"
                  text-color="grey-10"
                  font-size="22px"
                />
              </template>

              <b>Install Quasagram?</b>

              <template v-slot:action>
                <q-btn
                  @click="installApp"
                  label="Yes"
                  class="q-px-sm"
                  dense
                  flat
                />
                <q-btn
                  @click="showAppInstallBanner = false"
                  label="Later"
                  class="q-px-sm"
                  dense
                  flat
                />
                <q-btn
                  @click="neverShowAppInstallBanner"
                  label="Never"
                  class="q-px-sm"
                  dense
                  flat
                />
              </template>
            </q-banner>
          </div>
        </div>
      </transition>

      <q-tabs
        class="text-grey-10 small-screen-only"
        active-color="primary"
        indicator-color="transparent"
      >
        <q-route-tab to="/" icon="eva-home-outline" />
        <q-route-tab to="/camera" icon="eva-camera-outline" />
      </q-tabs>
    </q-footer>

    <q-page-container class="bg-grey-1">
      <keep-alive :include="['PageHome']">
        <router-view />
      </keep-alive>
    </q-page-container>
  </q-layout>
</template>

<script>
let deferredPrompt;

export default {
  name: "MainLayout",

  data() {
    return {
      showAppInstallBanner: false,
    };
  },
  methods: {
    installApp() {
      // Hide the app provided install promotion
      this.showAppInstallBanner = false;
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
          this.neverShowAppInstallBanner();
        } else {
          console.log("User dismissed the install prompt");
        }
      });
    },
    neverShowAppInstallBanner() {
      this.showAppInstallBanner = false;
      this.$q.localStorage.set("neverShowAppInstallBanner", true);
    },
  },
  mounted() {
    let neverShowAppInstallBanner = this.$q.localStorage.getItem(
      "neverShowAppInstallBanner"
    );

    if (!neverShowAppInstallBanner) {
      window.addEventListener("beforeinstallprompt", (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI notify the user they can install the PWA
        setTimeout(() => {
          this.showAppInstallBanner = true;
        }, 3000);
      });
    }
  },
};
</script>

<style lang="sass">
.q-toolbar
  @media (min-width: $breakpoint-sm-min)
    height: 77px
.q-toolbar__title
  font-size: 30px
  @media (max-width: $breakpoint-xs-max)
    text-align: center
.q-footer
  .q-tab__icon
    font-size: 30px
.platform-ios
  .q-footer
    padding-bottom: constant(safe-area-inset-bottom)
    padding-bottom: env(safe-area-inset-bottom)
</style> -->

<!-- src/layouts/MainLayout.vue -->

<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header class="bg-white text-grey-10" bordered>
      <q-toolbar class="constrain">
        <!-- Camera Button -->
        <q-btn
          to="/camera"
          class="large-screen-only q-mr-sm"
          icon="eva-camera-outline"
          size="18px"
          flat
          round
          dense
        />
        <!-- Separator -->
        <q-separator class="large-screen-only" vertical spaced />
        <!-- App Title -->
        <q-toolbar-title class="text-grand-hotel text-bold">
          Quasagram
        </q-toolbar-title>
        <!-- Home Button -->
        <q-btn
          to="/"
          class="large-screen-only"
          icon="eva-home-outline"
          size="18px"
          flat
          round
          dense
        />

        <!-- Spacer to Push User Menu to the Right -->
        <q-space />

        <!-- User Menu for Authenticated Users -->
        <div v-if="isAuthenticated" class="q-gutter-sm">
          <q-avatar clickable @click="toggleMenu" class="cursor-pointer">
            <img
              :src="require('src/assets/avatar.jpg') || defaultAvatar"
              alt="User Avatar"
            />
          </q-avatar>

          <!-- q-menu should be bound to menuOpen -->
          <q-menu
            v-model="menuOpen"
            persistent
            transition-show="jump-down"
            transition-hide="jump-up"
          >
            <q-list>
              <q-item clickable @click="goToProfile">
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>
                <q-item-section>Profile</q-item-section>
              </q-item>
              <q-item clickable @click="logout">
                <q-item-section avatar>
                  <q-icon name="logout" />
                </q-item-section>
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>

        <!-- Login and Sign Up Buttons for Unauthenticated Users -->
        <div v-else class="q-gutter-sm">
          <q-btn flat label="Login" @click="goToLogin" />
          <q-btn flat label="Sign Up" @click="goToSignup" />
        </div>
      </q-toolbar>
    </q-header>

    <!-- Footer -->
    <q-footer class="bg-white" bordered>
      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <div v-if="showAppInstallBanner" class="banner-container bg-primary">
          <div class="constrain">
            <q-banner class="bg-primary text-white" inline-actions dense>
              <template v-slot:avatar>
                <q-avatar
                  color="white"
                  icon="eva-camera-outline"
                  text-color="grey-10"
                  font-size="22px"
                />
              </template>

              <b>Install Quasagram?</b>

              <template v-slot:action>
                <q-btn
                  @click="installApp"
                  label="Yes"
                  class="q-px-sm"
                  dense
                  flat
                />
                <q-btn
                  @click="showAppInstallBanner = false"
                  label="Later"
                  class="q-px-sm"
                  dense
                  flat
                />
                <q-btn
                  @click="neverShowAppInstallBanner"
                  label="Never"
                  class="q-px-sm"
                  dense
                  flat
                />
              </template>
            </q-banner>
          </div>
        </div>
      </transition>

      <q-tabs
        class="text-grey-10 small-screen-only"
        active-color="primary"
        indicator-color="transparent"
      >
        <q-route-tab to="/" icon="eva-home-outline" />
        <q-route-tab to="/camera" icon="eva-camera-outline" />
      </q-tabs>
    </q-footer>

    <!-- Page Container -->
    <q-page-container class="bg-grey-1">
      <keep-alive :include="['PageHome']">
        <router-view />
      </keep-alive>
    </q-page-container>
  </q-layout>
</template>

<script>
import { signOut } from "firebase/auth";
import { auth } from "src/firebase/firebase";

export default {
  name: "MainLayout",

  data() {
    return {
      showAppInstallBanner: false,
      isAuthenticated: false,
      user: null,
      menuOpen: false,
      defaultAvatar: "src/assets/avatar.jpg", // Replace with your default avatar path
      deferredPrompt: null,
    };
  },

  computed: {
    userPhotoURL() {
      return this.user?.photoURL;
    },
  },

  methods: {
    installApp() {
      this.showAppInstallBanner = false;
      if (this.deferredPrompt) {
        this.deferredPrompt.prompt();
        this.deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
            console.log("User accepted the install prompt");
            this.neverShowAppInstallBanner();
          } else {
            console.log("User dismissed the install prompt");
          }
          this.deferredPrompt = null;
        });
      }
    },
    neverShowAppInstallBanner() {
      this.showAppInstallBanner = false;
      this.$q.localStorage.set("neverShowAppInstallBanner", true);
    },
    logout() {
      signOut(auth)
        .then(() => {
          this.$q.notify({
            color: "positive",
            position: "top",
            message: "Successfully logged out.",
            icon: "logout",
          });
          // Redirect to login page
          this.$router.push("/auth/login");
        })
        .catch((error) => {
          console.error("Error during logout:", error);
          this.$q.notify({
            color: "negative",
            position: "top",
            message: "An error occurred during logout.",
            icon: "error",
          });
        });
    },
    goToProfile() {
      this.$router.push("/profile"); // Replace with your profile route
    },
    goToLogin() {
      this.$router.push("/auth/login");
    },
    goToSignup() {
      this.$router.push("/auth/signup");
    },
    toggleMenu() {
      setTimeout(() => {
        this.menuOpen = !this.menuOpen;
        console.log("Menu toggled:", this.menuOpen);
      }, 6000); // Delay to prevent accidental double-toggling
    },
    // Logout method (for later)
    logout() {
      signOut(auth)
        .then(() => {
          this.$q.notify({
            color: "positive",
            position: "top",
            message: "Successfully logged out.",
            icon: "logout",
          });
          this.$router.push("/auth/login");
        })
        .catch((error) => {
          console.error("Error during logout:", error);
          this.$q.notify({
            color: "negative",
            position: "top",
            message: "An error occurred during logout.",
            icon: "error",
          });
        });
    },
  },

  mounted() {
    const neverShowAppInstallBanner = this.$q.localStorage.getItem(
      "neverShowAppInstallBanner"
    );

    if (!neverShowAppInstallBanner) {
      window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        this.deferredPrompt = e;
        setTimeout(() => {
          this.showAppInstallBanner = true;
        }, 3000);
      });
    }

    auth.onAuthStateChanged((currentUser) => {
      this.user = currentUser;
      this.isAuthenticated = !!currentUser;
      console.log("User authenticated:", this.isAuthenticated); // Debug line
    });
  },
};
</script>

<style lang="sass">
.q-toolbar
  @media (min-width: $breakpoint-sm-min)
    height: 77px
.q-toolbar__title
  font-size: 30px
  @media (max-width: $breakpoint-xs-max)
    text-align: center
.q-footer
  .q-tab__icon
    font-size: 30px
.platform-ios
  .q-footer
    padding-bottom: constant(safe-area-inset-bottom)
    padding-bottom: env(safe-area-inset-bottom)
</style>

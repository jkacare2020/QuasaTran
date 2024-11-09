// src/stores/auth.js
import { defineStore } from "pinia";
import { auth } from "src/firebase/firebase";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    authInitialized: false,
  }),
  actions: {
    initializeAuth() {
      return new Promise((resolve) => {
        auth.onAuthStateChanged((user) => {
          this.user = user;
          this.authInitialized = true;
          resolve(user);
        });
      });
    },
    async logout() {
      await auth.signOut();
      this.user = null;
    },
    // Add more auth-related actions as needed
  },
});

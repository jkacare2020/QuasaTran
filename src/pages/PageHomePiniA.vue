<template>
  <q-page class="constrain q-pa-md">
    <!-- Loading Indicator for Auth Initialization -->
    <div v-if="!authStore.authInitialized" class="q-pa-md flex flex-center">
      <q-spinner size="50px" color="primary" />
    </div>

    <!-- Rest of your template -->
    <div v-else>
      <!-- Notifications Banner -->
      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <div
          v-if="showNotificationsBanner && pushNotificationsSupported"
          class="banner-container bg-primary"
        >
          <!-- Banner Content -->
        </div>
      </transition>

      <!-- Posts Section -->
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-sm-8">
          <template v-if="!loadingPosts && posts.length">
            <!-- Posts List -->
          </template>
          <template v-else-if="!loadingPosts && !posts.length">
            <h5 class="text-center text-grey">No posts yet.</h5>
          </template>
          <template v-else>
            <!-- Loading Skeleton for Posts -->
          </template>
        </div>

        <!-- Sidebar Section -->
        <div class="col-4 large-screen-only">
          <!-- Sidebar Content -->
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { date } from "quasar";
import { openDB } from "idb";
import qs from "qs";
import apiClient from "src/axios"; // Import the centralized Axios instance
import { useAuthStore } from "src/stores/auth";

export default {
  name: "PageHome",
  data() {
    return {
      posts: [],
      loadingPosts: false,
      showNotificationsBanner: false,
      loadingDeletePostId: null, // For tracking deletion state
    };
  },
  computed: {
    serviceWorkerSupported() {
      return "serviceWorker" in navigator;
    },
    pushNotificationsSupported() {
      return "PushManager" in window;
    },
    authStore() {
      return useAuthStore();
    },
  },
  methods: {
    async getPosts() {
      this.loadingPosts = true;
      try {
        const idToken = await this.authStore.user.getIdToken();
        const response = await apiClient.get(`/posts`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        this.posts = response.data;
      } catch (err) {
        console.error("Error fetching posts:", err);
        this.$q.dialog({
          title: "Error",
          message: "Could not download posts.",
        });
      } finally {
        this.loadingPosts = false;
      }
    },

    async deletePost(postId) {
      if (!this.authStore.user) {
        this.$q.dialog({
          title: "Authentication Required",
          message: "You must be logged in to delete posts.",
        });
        return;
      }

      this.loadingDeletePostId = postId;

      try {
        await apiClient.delete(`/posts/${postId}`);
        this.posts = this.posts.filter((post) => post.id !== postId);
        this.$q.notify({
          type: "positive",
          message: "Post deleted successfully.",
        });
      } catch (err) {
        console.error("Error deleting post:", err);
        this.$q.dialog({
          title: "Error",
          message: "Could not delete post.",
        });
      } finally {
        this.loadingDeletePostId = null;
      }
    },

    async confirmDeletePost(postId) {
      const result = await this.$q.dialog({
        title: "Confirm Deletion",
        message: "Are you sure you want to delete this post?",
        cancel: true,
        persistent: true,
      });

      if (result) {
        this.deletePost(postId);
      }
    },

    testDeleteClick(postId) {
      console.log(`Test Delete Post Clicked for Post ID: ${postId}`);
      // Additional test logic if needed
    },

    async getOfflinePosts() {
      try {
        const db = await openDB("workbox-background-sync");
        const failedRequests = await db.getAll("requests");

        for (const failedRequest of failedRequests) {
          if (failedRequest.queueName === "createPostQueue") {
            const request = new Request(
              failedRequest.requestData.url,
              failedRequest.requestData
            );
            const formData = await request.formData();

            const offlinePost = {
              id: formData.get("id"),
              caption: formData.get("caption"),
              location: formData.get("location"),
              date: parseInt(formData.get("date")),
              offline: true,
            };

            const file = formData.get("file");
            if (file) {
              offlinePost.imageUrl = await this.fileToDataURL(file);
            } else {
              offlinePost.imageUrl = "";
            }

            this.posts.unshift(offlinePost);
          }
        }
      } catch (err) {
        console.log("Error accessing IndexedDB: ", err);
        this.$q.dialog({
          title: "Error",
          message: "Could not retrieve offline posts.",
        });
      }
    },

    fileToDataURL(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
      });
    },

    listenForOfflinePostUploaded() {
      if (this.serviceWorkerSupported) {
        const channel = new BroadcastChannel("sw-messages");
        channel.addEventListener("message", (event) => {
          console.log("Received", event.data);
          if (event.data.msg === "offline-post-uploaded") {
            const offlinePostCount = this.posts.filter(
              (post) => post.offline
            ).length;
            if (offlinePostCount > 0) {
              this.posts[offlinePostCount - 1].offline = false;
            }
          }
        });
      }
    },

    initNotificationsBanner() {
      const neverShow = this.$q.localStorage.getItem(
        "neverShowNotificationsBanner"
      );

      if (!neverShow) {
        this.showNotificationsBanner = true;
      }
    },

    enableNotifications() {
      if (this.pushNotificationsSupported) {
        Notification.requestPermission().then((result) => {
          console.log("Notification permission:", result);
          this.neverShowNotificationsBanner();
          if (result === "granted") {
            this.checkForExistingPushSubscription();
          }
        });
      }
    },

    checkForExistingPushSubscription() {
      if (this.serviceWorkerSupported && this.pushNotificationsSupported) {
        navigator.serviceWorker.ready
          .then((swreg) => swreg.pushManager.getSubscription())
          .then((sub) => {
            if (!sub) {
              this.createPushSubscription();
            }
          });
      }
    },

    createPushSubscription() {
      const vapidPublicKey =
        "BL7KqJ0PBikP5VBeXL9yP5_nktP_8WA2yUjBiXYaJVJd-vFeP2VWy-fntOc3Z3rAKDGjC0EYnY5bN1ipIZvdqvo";
      const convertedKey = this.urlBase64ToUint8Array(vapidPublicKey);

      navigator.serviceWorker.ready
        .then((reg) => {
          return reg.pushManager.subscribe({
            applicationServerKey: convertedKey,
            userVisibleOnly: true,
          });
        })
        .then((newSub) => {
          const newSubDataQS = qs.stringify(newSub.toJSON());
          return this.$axios.post(
            `${process.env.API}/createSubscription?${newSubDataQS}`
          );
        })
        .then((response) => {
          this.displayGrantedNotification();
        })
        .catch((err) => {
          console.log("Error creating push subscription:", err);
        });
    },

    displayGrantedNotification() {
      if (this.serviceWorkerSupported && this.pushNotificationsSupported) {
        navigator.serviceWorker.ready.then((swreg) => {
          swreg.showNotification("You're subscribed to notifications!", {
            body: "Thanks for subscribing!",
            icon: "icons/icon-128x128.png",
            image: "icons/icon-128x128.png",
            badge: "icons/icon-128x128.png",
            dir: "ltr",
            lang: "en-US",
            vibrate: [100, 50, 200],
            tag: "confirm-notification",
            renotify: true,
            actions: [
              {
                action: "hello",
                title: "Hello",
                icon: "icons/icon-128x128.png",
              },
              {
                action: "goodbye",
                title: "Goodbye",
                icon: "icons/icon-128x128.png",
              },
            ],
          });
        });
      }
    },

    neverShowNotificationsBanner() {
      this.showNotificationsBanner = false;
      this.$q.localStorage.set("neverShowNotificationsBanner", true);
    },

    urlBase64ToUint8Array(base64String) {
      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    },
  },
  filters: {
    niceDate(value) {
      return date.formatDate(value, "MMMM D h:mmA");
    },
  },
  async mounted() {
    // Removed getPosts and getOfflinePosts from here
    // Because getPosts is now called in onAuthStateChanged
    await this.getOfflinePosts();
  },
  created() {
    this.listenForOfflinePostUploaded();
    this.initNotificationsBanner();

    // Listen for auth state changes
    auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        this.getPosts();
      } else {
        // No user is signed in
        this.$q.dialog({
          title: "Authentication Required",
          message: "You must be logged in to view your posts.",
        });
      }
      this.authInitialized = true; // Auth has been initialized
    });
  },
};
</script>

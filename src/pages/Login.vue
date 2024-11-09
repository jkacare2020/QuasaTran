<!-- <template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-md q-mx-auto" style="max-width: 400px">
      <q-card-section>
        <div class="text-h6">Login</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="loginUser">
       //  Added .prevent -
          <q-input
            v-model="email"
            filled
            label="Email"
            type="email"
            :rules="[(value) => !!value || 'Email is required']"
          />

          <q-input
            v-model="password"
            filled
            label="Password"
            type="password"
            :rules="[(value) => !!value || 'Password is required']"
          />

          <q-btn
            label="Login"
            type="submit"
            color="primary"
            class="q-mt-md full-width"
            :loading="loading"
          />
        </q-form>

        <q-card-actions align="center">
          <q-btn
            flat
            label="Don't have an account? Sign Up"
            @click="goToSignup"
          />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-page>
</template> 

 <script>
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "src/firebase/firebase"; // Correct import path

export default {
  data() {
    return {
      email: "",
      password: "",
      loading: false,
    };
  },
  methods: {
    async loginUser() {
      this.loading = true;
      try {
        // Perform the Firebase login
        const userCredential = await signInWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        console.log("User logged in:", userCredential.user);

        // Redirect to the dashboard after login
        this.$router.push("/dashboard");
      } catch (error) {
        console.error("Error during login:", error);
        this.$q.notify({
          color: "negative",
          position: "top",
          message: error.message,
          icon: "warning",
        });
      } finally {
        this.loading = false;
      }
    },
    goToSignup() {
      this.$router.push("/auth/signup"); // Updated path
    },
  },
};
</script>

<style scoped>
.full-width {
  width: 100%;
}
</style> -->

<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-md q-mx-auto" style="max-width: 400px">
      <q-card-section>
        <div class="text-h6">Login</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="loginUser">
          <!-- Added .prevent -->
          <q-input
            v-model="email"
            filled
            label="Email"
            type="email"
            :rules="[(value) => !!value || 'Email is required']"
          />

          <q-input
            v-model="password"
            filled
            label="Password"
            type="password"
            :rules="[(value) => !!value || 'Password is required']"
          />

          <q-btn
            label="Login"
            type="submit"
            color="primary"
            class="q-mt-md full-width"
            :loading="loading"
          />
        </q-form>

        <q-card-actions align="center">
          <q-btn
            flat
            label="Don't have an account? Sign Up"
            @click="goToSignup"
          />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref, getCurrentInstance } from "vue"; // Composition API for Vue 2.7
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "src/firebase/firebase"; // Correct import path

export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const loading = ref(false);

    const { proxy } = getCurrentInstance(); // Get access to the Vue instance

    const loginUser = async () => {
      loading.value = true;
      try {
        // Perform the Firebase login
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email.value,
          password.value
        );
        console.log("User logged in:", userCredential.user);

        // Redirect to the dashboard after login
        proxy.$router.push("/dashboard");
      } catch (error) {
        console.error("Error during login:", error);
        // Use proxy.$q.notify to access Quasar's notify plugin
        proxy.$q.notify({
          color: "negative",
          position: "top",
          message: error.message,
          icon: "warning",
        });
      } finally {
        loading.value = false;
      }
    };

    const goToSignup = () => {
      proxy.$router.push("/auth/signup");
    };

    return {
      email,
      password,
      loading,
      loginUser,
      goToSignup,
    };
  },
};
</script>

<style scoped>
.full-width {
  width: 100%;
}
</style>

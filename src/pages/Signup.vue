<!-- src/pages/Signup.vue -->

<!-- <template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-md q-mx-auto" style="max-width: 400px">
      <q-card-section>
        <div class="text-h6">Sign Up</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="signupUser">
          <q-input
            v-model="email"
            filled
            label="Email"
            type="email"
            :rules="[
              (value) => !!value || 'Email is required',
              (value) => /.+@.+\..+/.test(value) || 'Email must be valid',
            ]"
          />

          <q-input
            v-model="password"
            filled
            label="Password"
            type="password"
            :rules="[
              (value) => !!value || 'Password is required',
              (value) =>
                value.length >= 6 || 'Password must be at least 6 characters',
            ]"
          />

          <q-input
            v-model="confirmPassword"
            filled
            label="Confirm Password"
            type="password"
            :rules="[
              (value) => !!value || 'Please confirm your password',
              (value) => value === password || 'Passwords do not match',
            ]"
          />

          <q-btn
            label="Sign Up"
            type="submit"
            color="primary"
            class="q-mt-md full-width"
            :loading="loading"
          />
        </q-form>

        <q-card-actions align="center">
          <q-btn
            flat
            label="Already have an account? Login"
            @click="goToLogin"
          />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-page>
</template> -->
<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-md q-mx-auto" style="max-width: 400px">
      <q-card-section>
        <div class="text-h6">Sign Up</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="signupUser">
          <!-- Display Name Input -->
          <q-input
            v-model="displayName"
            filled
            label="Display Name"
            :rules="[(value) => !!value || 'Display name is required']"
          />

          <q-input
            v-model="email"
            filled
            label="Email"
            type="email"
            :rules="[
              (value) => !!value || 'Email is required',
              (value) => /.+@.+\..+/.test(value) || 'Email must be valid',
            ]"
          />

          <q-input
            v-model="password"
            filled
            label="Password"
            type="password"
            :rules="[
              (value) => !!value || 'Password is required',
              (value) =>
                value.length >= 6 || 'Password must be at least 6 characters',
            ]"
          />

          <q-input
            v-model="confirmPassword"
            filled
            label="Confirm Password"
            type="password"
            :rules="[
              (value) => !!value || 'Please confirm your password',
              (value) => value === password || 'Passwords do not match',
            ]"
          />

          <q-btn
            label="Sign Up"
            type="submit"
            color="primary"
            class="q-mt-md full-width"
            :loading="loading"
          />
        </q-form>

        <q-card-actions align="center">
          <q-btn
            flat
            label="Already have an account? Login"
            @click="goToLogin"
          />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
// import { auth } from "src/firebase/firebase";
// import { createUserWithEmailAndPassword } from "firebase/auth";

// export default {
//   data() {
//     return {
//       email: "",
//       password: "",
//       confirmPassword: "",
//       loading: false,
//     };
//   },
//   methods: {
//     async signupUser() {
//       this.loading = true;
//       try {
//         if (this.password !== this.confirmPassword) {
//           throw new Error("Passwords do not match.");
//         }

//         const userCredential = await createUserWithEmailAndPassword(
//           auth,
//           this.email,
//           this.password
//         );
//         console.log("User signed up:", userCredential.user);

//         // Redirect to Dashboard after successful signup
//         this.$router.push("/dashboard");

//         // Optional: Display success notification
//         this.$q.notify({
//           color: "positive",
//           position: "top",
//           message: "Signup successful! Welcome aboard.",
//           icon: "check",
//         });
//       } catch (error) {
//         console.error("Error during signup:", error);
//         let message = "An error occurred during signup.";

//         // Customize error messages based on Firebase error codes
//         if (error.code === "auth/email-already-in-use") {
//           message =
//             "This email is already in use. Please use a different email.";
//         } else if (error.code === "auth/invalid-email") {
//           message = "The email address is not valid.";
//         } else if (error.code === "auth/operation-not-allowed") {
//           message = "Email/password accounts are not enabled.";
//         } else if (error.code === "auth/weak-password") {
//           message =
//             "The password is too weak. Please choose a stronger password.";
//         } else if (error.message === "Passwords do not match.") {
//           message = error.message;
//         }

//         // Display error notification
//         this.$q.notify({
//           color: "negative",
//           position: "top",
//           message: message,
//           icon: "warning",
//         });
//       } finally {
//         this.loading = false;
//       }
//     },
//     goToLogin() {
//       this.$router.push("/auth/login");
//     },
//   },
// };
</script>

<script>
import { auth, db } from "src/firebase/firebase"; // Import Firestore and auth
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Import Firestore methods

export default {
  data() {
    return {
      displayName: "", // Added displayName here
      email: "",
      password: "",
      confirmPassword: "",
      loading: false,
    };
  },
  methods: {
    async signupUser() {
      this.loading = true;
      try {
        if (this.password !== this.confirmPassword) {
          throw new Error("Passwords do not match.");
        }

        // Create the user with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        const user = userCredential.user;
        console.log("User signed up:", user);

        // Create a document in the "users" collection with the user's uid
        await setDoc(doc(db, "users", user.uid), {
          email: user.email, // Save user's email
          createdAt: new Date(), // Timestamp when the user signed up
          displayName: this.displayName, // Added displayName field
        });

        console.log("User document created in Firestore");

        // Redirect to Dashboard after successful signup
        this.$router.push("/dashboard");

        // Optional: Display success notification
        this.$q.notify({
          color: "positive",
          position: "top",
          message: "Signup successful! Welcome aboard.",
          icon: "check",
        });
      } catch (error) {
        console.error("Error during signup:", error);
        let message = "An error occurred during signup.";

        // Customize error messages based on Firebase error codes
        if (error.code === "auth/email-already-in-use") {
          message =
            "This email is already in use. Please use a different email.";
        } else if (error.code === "auth/invalid-email") {
          message = "The email address is not valid.";
        } else if (error.code === "auth/operation-not-allowed") {
          message = "Email/password accounts are not enabled.";
        } else if (error.code === "auth/weak-password") {
          message =
            "The password is too weak. Please choose a stronger password.";
        } else if (error.message === "Passwords do not match.") {
          message = error.message;
        }

        // Display error notification
        this.$q.notify({
          color: "negative",
          position: "top",
          message: message,
          icon: "warning",
        });
      } finally {
        this.loading = false;
      }
    },

    goToLogin() {
      this.$router.push("/auth/login");
    },
  },
};
</script>

<style scoped>
.full-width {
  width: 100%;
}
</style>

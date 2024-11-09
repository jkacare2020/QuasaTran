<template>
  <q-page class="q-pa-md">
    <h3>Dashboard</h3>

    <!-- User Info Section -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Logged-in User Information</div>
      </q-card-section>
      <q-card-section>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Display Name:</strong> {{ user.displayName }}</p>
      </q-card-section>
    </q-card>

    <!-- Transaction Info Section -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Transaction Information</div>
      </q-card-section>
      <q-card-section>
        <p>Click the link below to view your transactions:</p>
        <q-btn
          label="View Transactions"
          color="primary"
          @click="goToTransacts"
        />
      </q-card-section>
    </q-card>

    <!-- Navigation Links Section -->
    <q-card>
      <q-card-section>
        <div class="text-h6">Quick Links</div>
      </q-card-section>
      <q-card-section>
        <q-btn label="Merchants" flat @click="goToUsers" />
        <q-btn label="Profile" flat @click="goToProfile" class="q-ml-md" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { auth, db } from "src/firebase/firebase"; // Import auth and Firestore
import { doc, getDoc } from "firebase/firestore"; // Import Firestore methods

export default {
  data() {
    return {
      user: {
        email: "",
        displayName: "",
      },
    };
  },
  async mounted() {
    const currentUser = auth.currentUser; // Get the currently authenticated user
    if (currentUser) {
      this.user.email = currentUser.email;

      // Fetch user document from Firestore
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        this.user.displayName = userData.displayName || "No Display Name";
      } else {
        console.log("No such document!");
      }
    } else {
      console.log("No authenticated user found.");
    }
  },
  methods: {
    goToTransacts() {
      this.$router.push("/transacts");
    },
    goToUsers() {
      this.$router.push("/users");
    },
    goToProfile() {
      this.$router.push("/profile");
    },
  },
};
</script>
0vr3eFNf8YSZMXjUNMyZCV9bXAL2
<style scoped>
.q-mb-md {
  margin-bottom: 16px;
}
.q-ml-md {
  margin-left: 16px;
}
</style>

<template>
  <div class="q-pa-md">
    <q-markup-table dark class="bg-indigo-8">
      <thead>
        <tr>
          <th class="text-left">First Name</th>
          <th class="text-left">Last Name</th>
          <th class="text-left">Company</th>
          <th class="text-left">Phone No.</th>
          <th class="text-left">Email</th>
          <th class="text-left">User Number</th>
          <th class="text-left">Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="index">
          <td class="text-left">{{ user.First_Name }}</td>
          <td class="text-left">{{ user.Last_Name }}</td>
          <td class="text-left truncate" :title="user.company_name">
            {{ user.company_name }}
          </td>
          <td class="text-left">{{ user.Phone_Number }}</td>
          <td class="text-left">{{ user.email }}</td>
          <td class="text-left">{{ user.user_number }}</td>
          <td class="text-left">{{ formatDate(user.app_date) }}</td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";

export default {
  setup() {
    const users = ref([]);

    // Fetch users from MongoDB backend
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://quasargram-jason-backend-2024-98f0d3ac8c4a.herokuapp.com/mongo-users"
        ); // Updated to match your backend route
        users.value = response.data; // Assign the fetched data to the users ref
        console.log("Users fetched from MongoDB:", users.value);
      } catch (error) {
        console.error("Error fetching users from backend:", error);
      }
    };

    // Format the date for display
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
    };

    // Fetch the data when the component is mounted
    onMounted(fetchUsers);

    return {
      users,
      formatDate,
    };
  },
};
</script>

<!-- <style scoped>
.truncate {
  max-width: 150px; /* Adjust as needed */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style> -->

<template>
  <v-container>
  <div class="users-container">
    <div class="user-list">
      <h2>Users</h2>
      <ul>
        <li v-for="user in users" :key="user.user_id" class="user-item">
          <div class="user-info">
            <div>
              <span class="user-id">ID: {{ user.user_id }}</span><br>
              <span class="user-name">{{ user.name }}</span> - 
              <span class="user-email">{{ user.email }}</span>
              <span class="user-subscription">Subscription: {{ user.subscription }}</span>
            </div>
            <div class="user-actions">
              <button @click="editUser(user)" class="edit-button">Edit</button>
              <button @click="deleteUser(user.user_id)" class="delete-button">Delete</button>
            </div>
          </div>
          <div v-if="user.isEditing" class="edit-form">
            <form @submit.prevent="saveUser(user)" class="user-form-inner">
              <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" v-model="user.name" required class="form-control">
              </div>
              <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" v-model="user.email" required class="form-control">
              </div>
              <div class="form-group">
                <label for="subscription"> Subscription:</label>
                <select v-model="user.subscription" required class="form-control">
                  <option value="free">Free</option>
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
              <div class="form-actions">
                <button type="submit" class="save-button">Save</button>
                <button @click="cancelEdit(user)" class="cancel-button">Cancel</button>
              </div>
            </form>
          </div>
        </li>
      </ul>
    </div>

  
    <div class="user-form">
      <h2>Add User</h2>
      <form @submit.prevent="addUser" class="user-form-inner">
        <div class="form-group">
          <label for="new-name">Name:</label>
          <input type="text" id="new-name" v-model="newUser.name" required class="form-control">
        </div>
        <div class="form-group">
          <label for="new-email">Email:</label>
          <input type="email" id="new-email" v-model="newUser.email" required class="form-control">
        </div>
        <div class="form-group">
          <label for="new-subscription"> Subscription:</label>
          <select id="new-subscription" v-model="newUser.subscription" required class="form-control">
            <option value="free">Free</option>
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
          </select>
        </div>
        <button type="submit" class="submit-button">Add User</button>
      </form>
    </div>
  </div>
</v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      users: [],
      newUser: {
        name: '',
        email: '',
        subscription: 'free' 
      }
    };
  },
  async created() {
    await this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/users`);
        this.users = response.data.map(user => ({
          ...user,
          isEditing: false
        }));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    async addUser() {
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_URL}/users`, this.newUser);
        this.users.push({
          user_id: response.data.user_id,
          name: this.newUser.name,
          email: this.newUser.email,
          subscription: this.newUser.subscription,
          isEditing: false
        });
        this.newUser.name = '';
        this.newUser.email = '';
        this.newUser.subscription = 'free'; 
      } catch (error) {
        console.error('Error adding user:', error);
      }
    },
    editUser(user) {
      user.isEditing = true;
    },
    async saveUser(user) {
      try {
        await axios.put(`${process.env.VUE_APP_API_URL}/users/${user.user_id}`, {
          name: user.name,
          email: user.email,
          subscription: user.subscription
        });
        user.isEditing = false;
      } catch (error) {
        console.error('Error saving user:', error);
      }
    },
    cancelEdit(user) {
      user.isEditing = false;
    },
    async deleteUser(userId) {
      try {
        await axios.delete(`${process.env.VUE_APP_API_URL}/users/${userId}`);
        this.users = this.users.filter(user => user.user_id !== userId);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  }
};
</script>

<style scoped>
.users-container {
  min-height: 100vh;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 5px;
}

.user-list {
  width: 100%;
  max-width: 800px;
  margin-bottom: 20px;
}

.user-item {
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
}

.user-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.user-id {
  font-size: 12px;
  color: #999;
}

.user-name {
  font-weight: bold;
}

.user-email {
  color: #555;
}

.user-subscription {
  font-style: italic;
  color: #777;
}

.user-actions {
  margin-left: auto;
}

.edit-form {
  margin-top: 10px;
}

.form-group {
  margin-bottom: 10px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.save-button,
.cancel-button,
.delete-button {
  margin-left: 10px;
  padding: 8px 16px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.edit-button {
  background-color: #2196f3;
  color: white;
}

.delete-button {
  background-color: #f44336;
  color: white;
}

.save-button {
  background-color: #4caf50;
  color: white;
}

.cancel-button {
  background-color: #ff9800;
  color: white;
}

.submit-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.submit-button:hover,
.save-button:hover,
.cancel-button:hover,
.edit-button:hover,
.delete-button:hover {
  background-color: #45a049;
}
</style>

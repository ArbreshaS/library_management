<template>
  <v-container>
  <div class="publishers-container">
    <h2>Publishers</h2>
    
    
    <form v-if="!editingPublisher" @submit.prevent="addPublisher">
      <h3>Add Publisher</h3>
      <label for="name">Name:</label>
      <input type="text" id="name" v-model="newPublisher.name" required>
      
      <label for="location">Location:</label>
      <input type="text" id="location" v-model="newPublisher.location" required>
      
      <button type="submit">Add Publisher</button>
    </form>
    <form v-else @submit.prevent="updatePublisher">
      <h3>Edit Publisher</h3>
      <label for="editName">Name:</label>
      <input type="text" id="editName" v-model="editedPublisher.name" required>
      
      <label for="editLocation">Location:</label>
      <input type="text" id="editLocation" v-model="editedPublisher.location" required>
      
      <button type="submit">Update Publisher</button>
      <button type="button" @click="cancelEdit">Cancel</button>
    </form>

    <ul>
      <li v-for="publisher in publishers" :key="publisher.publisher_id" class="publisher-item">
        <h3>{{ publisher.name }}</h3>
        <p>{{ publisher.location }}</p>
        <button @click="editPublisher(publisher)">Edit</button>
        <button @click="deletePublisher(publisher.publisher_id)">Delete</button>
      </li>
    </ul>
  </div>
</v-container>
</template>

<script>
export default {
  data() {
    return {
      publishers: [],
      newPublisher: {
        name: '',
        location: ''
      },
      editingPublisher: null,
      editedPublisher: {
        publisher_id: null,
        name: '',
        location: ''
      }
    };
  },
  created() {
    this.fetchPublishers();
  },
  methods: {
    async fetchPublishers() {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/publishers`);
        this.publishers = await response.json();
      } catch (error) {
        console.error('Error fetching publishers:', error);
      }
    },
    async addPublisher() {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/publishers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: this.newPublisher.name,
            location: this.newPublisher.location
          })
        });

        if (response.ok) {
          const result = await response.json();
          this.publishers.push({
            publisher_id: result.publisher_id,
            name: result.name,
            location: result.location
          });
          this.newPublisher.name = '';
          this.newPublisher.location = '';
          console.log('Publisher added successfully');
        } else {
          console.error('Failed to add publisher');
        }
      } catch (error) {
        console.error('Error adding publisher:', error);
      }
    },
    editPublisher(publisher) {
      this.editingPublisher = publisher.publisher_id;
      this.editedPublisher.publisher_id = publisher.publisher_id;
      this.editedPublisher.name = publisher.name;
      this.editedPublisher.location = publisher.location;
    },
    async updatePublisher() {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/publishers/${this.editedPublisher.publisher_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: this.editedPublisher.name,
            location: this.editedPublisher.location
          })
        });

        if (response.ok) {
          const updatedPublisher = {
            publisher_id: this.editedPublisher.publisher_id,
            name: this.editedPublisher.name,
            location: this.editedPublisher.location
          };
          const index = this.publishers.findIndex(publisher => publisher.publisher_id === updatedPublisher.publisher_id);
          if (index !== -1) {
            this.publishers.splice(index, 1, updatedPublisher);
          }
          this.cancelEdit();
          console.log('Publisher updated successfully');
        } else {
          console.error('Failed to update publisher');
        }
      } catch (error) {
        console.error('Error updating publisher:', error);
      }
    },
    async deletePublisher(publisherId) {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/publishers/${publisherId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          this.publishers = this.publishers.filter(publisher => publisher.publisher_id !== publisherId);
          console.log('Publisher deleted successfully');
        } else {
          console.error('Failed to delete publisher');
        }
      } catch (error) {
        console.error('Error deleting publisher:', error);
      }
    },
    cancelEdit() {
      this.editingPublisher = null;
      this.editedPublisher.publisher_id = null;
      this.editedPublisher.name = '';
      this.editedPublisher.location = '';
    }
  }
};
</script>

<style>
.publishers-container {
  min-height: 100vh;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 5px;
}

.publisher-item {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
}

.publisher-item h3 {
  margin: 0;
  font-size: 1.2rem;
}

.publisher-item p {
  margin-top: 5px;
  color: #666;
}

.publisher-item button {
  margin-top: 10px;
  padding: 5px 10px;
  margin-right: 5px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.publisher-item button:hover {
  background-color: #0056b3;
}

.publisher-item button:focus {
  outline: none;
}

form {
  margin-bottom: 20px;
}

form h3 {
  margin-top: 0;
}

form label {
  display: block;
  margin-bottom: 5px;
}

form input[type="text"] {
  width: 100%;
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 3px;
  margin-bottom: 10px;
}

form button[type="submit"],
form button[type="button"] {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

form button[type="submit"]:hover,
form button[type="button"]:hover {
  background-color: #0056b3;
}

form button[type="submit"]:focus,
form button[type="button"]:focus {
  outline: none;
}
</style>

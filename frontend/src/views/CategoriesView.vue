<template>
  <v-container>
    <div class="categories-container">
      <h2>Categories</h2>
      
      
      <form v-if="!editingCategory" @submit.prevent="addCategory">
        <h3>Add Category</h3>
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="newCategory.name" required>
        
        <label for="description">Description:</label>
        <textarea id="description" v-model="newCategory.description" required></textarea>
        
        <button type="submit">Add Category</button>
      </form>
      <form v-else @submit.prevent="updateCategory">
        <h3>Edit Category</h3>
        <label for="editName">Name:</label>
        <input type="text" id="editName" v-model="editedCategory.name" required>
        
        <label for="editDescription">Description:</label>
        <textarea id="editDescription" v-model="editedCategory.description" required></textarea>
        
        <button type="submit">Update Category</button>
        <button type="button" @click="cancelEdit">Cancel</button>
      </form>

      <ul>
        <li v-for="category in categories" :key="category.category_id" class="category-item">
          <router-link :to="'/categories/' + category.category_id">
            <h3>{{ category.name }}</h3>
          </router-link>
          <p>{{ category.description }}</p>
          <p><strong>ID:</strong> {{ category.category_id }}</p> <!-- Displaying category_id -->
          <button @click="editCategory(category)">Edit</button>
          <button @click="deleteCategory(category.category_id)">Delete</button>
        </li>
      </ul>
    </div>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      categories: [],
      newCategory: {
        name: '',
        description: ''
      },
      editingCategory: null,
      editedCategory: {
        category_id: null,
        name: '',
        description: ''
      }
    };
  },
  created() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/categories`);
        this.categories = await response.json();
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    async addCategory() {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: this.newCategory.name,
            description: this.newCategory.description
          })
        });

        if (response.ok) {
          const result = await response.json();
          this.categories.push({
            category_id: result.category_id,
            name: result.name,
            description: result.description
          });
          this.newCategory.name = '';
          this.newCategory.description = '';
          console.log('Category added successfully');
        } else {
          console.error('Failed to add category');
        }
      } catch (error) {
        console.error('Error adding category:', error);
      }
    },
    async editCategory(category) {
      this.editingCategory = category.category_id;
      this.editedCategory.category_id = category.category_id;
      this.editedCategory.name = category.name;
      this.editedCategory.description = category.description;
    },
    async updateCategory() {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/categories/${this.editedCategory.category_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: this.editedCategory.name,
            description: this.editedCategory.description
          })
        });

        if (response.ok) {
          const updatedCategory = {
            category_id: this.editedCategory.category_id,
            name: this.editedCategory.name,
            description: this.editedCategory.description
          };
          const index = this.categories.findIndex(category => category.category_id === updatedCategory.category_id);
          if (index !== -1) {
            this.categories.splice(index, 1, updatedCategory);
          }
          this.cancelEdit();
          console.log('Category updated successfully');
        } else {
          console.error('Failed to update category');
        }
      } catch (error) {
        console.error('Error updating category:', error);
      }
    },
    async deleteCategory(categoryId) {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/categories/${categoryId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          
          this.categories = this.categories.filter(category => category.category_id !== categoryId);
          console.log('Category deleted successfully');
        } else {
          console.error('Failed to delete category');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    },
    cancelEdit() {
      this.editingCategory = null;
      this.editedCategory.category_id = null;
      this.editedCategory.name = '';
      this.editedCategory.description = '';
    }
  }
};
</script>

<style>
.categories-container {
  height: 100vh;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 5px;
}

.category-item {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
}

.category-item h3 {
  margin: 0;
  font-size: 1.2rem;
}

.category-item p {
  margin-top: 5px;
  color: #666;
}

.category-item button {
  margin-top: 10px;
  padding: 5px 10px;
  margin-right: 5px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.category-item button:hover {
  background-color: #0056b3;
}

.category-item button:focus {
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

form input[type="text"],
form textarea {
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

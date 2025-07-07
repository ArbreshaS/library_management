<template>
  <v-container>
  <div class="books-container">
    <h1>Books</h1>

    <ul class="books-list" v-if="books.length > 0">
      <li v-for="book in books" :key="book.book_id">
        <h2>{{ book.title }}</h2>
        <p><strong>Author ID:</strong> {{ book.author_id }}</p>
        <p><strong>Category ID:</strong> {{ book.category_id }}</p>
        <p><strong>Published Date:</strong> {{ book.published_date }}</p>
        <p><strong>Description:</strong> {{ book.description }}</p>
        <p><strong>Available:</strong> {{ book.available }}</p>
        <button @click="editBook(book)" class="edit-btn">Edit</button>
        <button @click="deleteBook(book.book_id)" class="delete-btn">Delete</button>
      </li>
    </ul>
    <p class="empty-message" v-else>No books available.</p>

    
    <form @submit.prevent="submitBook">
      <h2>{{ editing ? 'Edit Book' : 'Add New Book' }}</h2>
      <label>Title</label>
      <input type="text" v-model="form.title" required>

    
      <label>Author ID</label>
      <v-text-field v-model="form.author_id" label="Author ID" @click="openAuthorsDialog" readonly required></v-text-field>

      
      <label>Category ID</label>
      <v-text-field v-model="form.category_id" label="Category ID" @click="openCategoriesDialog" readonly required></v-text-field>

      <label>Published Date</label>
      <input type="date" v-model="form.published_date" required>
      <label>Description</label>
      <textarea v-model="form.description" required></textarea>
      <label>Available</label>
      <input type="checkbox" v-model="form.available">
      <button type="submit">{{ editing ? 'Update' : 'Add' }} Book</button>
    </form>

  
    <v-dialog v-model="categoryDialog" max-width="600px">
      <v-card>
        <v-card-title>Select Category</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item v-for="category in categories" :key="category.category_id" @click="selectCategory(category)">
              <v-list-item-title>{{ category.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="closeCategoriesDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      books: [],
      form: {
        title: '',
        author_id: '',
        category_id: '',
        published_date: '',
        description: '',
        available: false
      },
      editing: false,
      editId: null,
      dialog: false,
      authors: [],
      categoryDialog: false,
      categories: []
    };
  },
  created() {
    this.fetchBooks();
  },
  methods: {
    async fetchBooks() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/books`);
        this.books = response.data;
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    },
    async editBook(book) {
      this.editing = true;
      this.editId = book.book_id;
      this.form.title = book.title;
      this.form.author_id = book.author_id;
      this.form.category_id = book.category_id;
      this.form.published_date = book.published_date;
      this.form.description = book.description;
      this.form.available = book.available;
    },
    async deleteBook(bookId) {
      try {
        await axios.delete(`${process.env.VUE_APP_API_URL}/books/${bookId}`);
        this.books = this.books.filter(book => book.book_id !== bookId);
        console.log('Book deleted');
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    },
    async submitBook() {
      try {
        if (this.editing) {
          await axios.put(`${process.env.VUE_APP_API_URL}/books/${this.editId}`, this.form);
          
          const index = this.books.findIndex(book => book.book_id === this.editId);
          if (index !== -1) {
            this.books[index] = { ...this.form, book_id: this.editId };
          }
          console.log('Book updated');
        } else {
          const response = await axios.post(`${process.env.VUE_APP_API_URL}/books`, this.form);
          this.books.push(response.data);
          console.log('Book added');
        }
        
        this.resetForm();
      } catch (error) {
        console.error('Error submitting book:', error);
      }
    },
    resetForm() {
      this.editing = false;
      this.editId = null;
      this.form = {
        title: '',
        author_id: '',
        category_id: '',
        published_date: '',
        description: '',
        available: false
      };
    },
    async openAuthorsDialog() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/authors`);
        this.authors = response.data;
        this.dialog = true; 
      } catch (error) {
        console.error('Error fetching authors:', error);
      }
    },
    closeAuthorsDialog() {
      this.dialog = false;
    },
    selectAuthor(author) {
      this.form.author_id = author.author_id; 
      this.dialog = false;
    },
    async openCategoriesDialog() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/categories`);
        this.categories = response.data;
        this.categoryDialog = true; 
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    closeCategoriesDialog() {
      this.categoryDialog = false;
    },
    selectCategory(category) {
      this.form.category_id = category.category_id; 
      this.categoryDialog = false; 
    }
  }
};
</script>



<style>
.books-container {
 
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 5px;
}

.books-container h1 {
  font-size: 24px;
  margin-bottom: 15px;
}

.books-list {
  list-style-type: none;
  padding: 0;
}

.books-list li {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.books-list li h2 {
  font-size: 18px;
  margin-bottom: 5px;
}

.books-list li p {
  margin: 5px 0;
}

.books-list li button {
  margin-right: 10px;
  padding: 8px 12px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.books-list li button:hover {
  background-color: #0056b3;
}

.books-list li button.delete-btn {
  background-color: #dc3545;
}

.books-list li button.delete-btn:hover {
  background-color: #c82333;
}

.books-list li button.edit-btn {
  background-color: #ffc107;
  color: #212529;
}

.books-list li button.edit-btn:hover {
  background-color: #e0a800;
}

.empty-message {
  font-style: italic;
  color: #777;
}

form {
  margin-top: 20px;
  padding: 15px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
}

form h2 {
  font-size: 20px;
  margin-bottom: 15px;
}

form label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

form input[type="text"],
form input[type="date"],
form textarea,
form input[type="checkbox"] {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

form button[type="submit"] {
  padding: 10px 20px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

form button[type="submit"]:hover {
  background-color: #218838;
}
</style>

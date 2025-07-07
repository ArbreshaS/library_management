<template>
  <v-container>
    <div class="authors-container">
      <h2>Authors</h2>

      
      <div class="buttonn-container">
        <button type="button" class="button-23" @click="showModal = true">
          Add Author
        </button>
      </div>

      
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <h3>Add New Author</h3>
          <form @submit.prevent="addAuthor" class="author-form">
            <div class="form-group">
              <label for="name">Name:</label>
              <input type="text" id="name" v-model="newAuthor.name" class="form-control" required>
            </div>

            <div class="form-group">
              <label for="biography">Biography:</label>
              <textarea id="biography" v-model="newAuthor.biography" class="form-control" rows="4" required></textarea>
            </div>

            <div class="form-actions">
              <button type="submit" class="button-23 button-submit">Add Author</button>
              <span class="button-spacing"></span>
              <button type="button" class="button-23 button-cancel" @click="closeModal">Cancel</button>
            </div>
          </form>
        </div>
      </div>

      
      <ul class="author-list">
        <li v-for="author in authors" :key="author.author_id" class="author-item">
          <div class="author-info">
            <template v-if="author.editMode">
              <div class="form-group">
                <label for="edit-name">Name:</label>
                <input type="text" id="edit-name" v-model="author.name" class="form-control">
              </div>
              <div class="form-group">
                <label for="edit-biography">Biography:</label>
                <textarea id="edit-biography" v-model="author.biography" class="form-control" rows="4"></textarea>
              </div>
              <button @click="saveAuthor(author)" class="button-23 button-submit">
                <i class="fas fa-check"></i>
              </button>
              <span class="button-spacing"></span>
              <button @click="cancelEdit(author)" class="button-23 button-cancel">
                <i class="fas fa-times"></i>
              </button>
            </template>
            <template v-else>
              <strong>{{ author.name }}</strong>
              <p class="author-biography">{{ author.biography }}</p>
              <button @click="deleteAuthor(author.author_id)" class="button-234">
                <i class="fas fa-trash"></i>
              </button>
              <button @click="editAuthor(author)" class="button-234">
                <i class="fas fa-edit"></i>
              </button>
            </template>
          </div>
        </li>
      </ul>
    </div>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      authors: [],
      newAuthor: {
        name: '',
        biography: ''
      },
      showModal: false 
    };
  },
  async created() {
    await this.fetchAuthors();
  },
  methods: {
    async fetchAuthors() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/authors`);
        this.authors = response.data.map(author => ({
          ...author,
          editMode: false 
        }));
      } catch (error) {
        console.error('Error fetching authors:', error);
      }
    },
    async addAuthor() {
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_URL}/authors`, this.newAuthor);
        console.log('New author added:', response.data);

        
        this.newAuthor.name = '';
        this.newAuthor.biography = '';
        
        
        this.showModal = false;

        
        await this.fetchAuthors();
      } catch (error) {
        console.error('Error adding author:', error);
      }
    },
    editAuthor(author) {
      
      author.editMode = true;
    },
    async saveAuthor(author) {
      try {
        const { name, biography } = author;
        const response = await axios.put(`${process.env.VUE_APP_API_URL}/authors/${author.author_id}`, { name, biography });
        console.log('Author updated:', response.data);

        
        author.editMode = false;

        
        await this.fetchAuthors();
      } catch (error) {
        console.error('Error updating author:', error);
      }
    },
    cancelEdit(author) {
      
      author.editMode = false;
    },
    async deleteAuthor(authorId) {
      try {
        const response = await axios.delete(`${process.env.VUE_APP_API_URL}/authors/${authorId}`);
        console.log('Author deleted:', response.data.message);

       
        await this.fetchAuthors();
      } catch (error) {
        console.error('Error deleting author:', error);
      }
    },
    closeModal() {
    
      this.newAuthor.name = '';
      this.newAuthor.biography = '';
      this.showModal = false;
    }
  }
};
</script>




<style scoped>
.authors-container {
  min-height: 100vh;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 5px;
}

.buttonn-container{
  margin-left: 623px;
  margin-bottom: 10px;
}

.button-234{
  margin-left: 720px;
  margin-top: -100px;
}

.author-form {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-control {
  width: 100%;
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
}

.button-23 {
  background-color: #FFFFFF;
  border: 1px solid #00008B;
  border-radius: 8px;
  box-sizing: border-box;
  color: #222222;
  cursor: pointer;
  display: inline-block;
  font-family: 'Circular', -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  margin: 0;
  outline: none;
  padding: 13px 23px;
  text-align: center;
  text-decoration: none;
  touch-action: manipulation;
  transition: box-shadow .2s, -ms-transform .1s, -webkit-transform .1s, transform .1s;
  user-select: none;
  -webkit-user-select: none;
  width: auto;
}

.button-23:focus-visible {
  box-shadow: #222222 0 0 0 2px, rgba(255, 255, 255, 0.8) 0 0 0 4px;
  transition: box-shadow .2s;
}

.button-23:active {
  background-color: #F7F7F7;
  border-color: #00008B;
  transform: scale(.96);
}

.button-disabled {
  border-color: #00008B;
  color: #DDDDDD;
  cursor: not-allowed;
  opacity: 1;
}

.author-list {
  list-style-type: none;
  padding: 0;
}

.author-item {
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 4px;
  margin-bottom: 10px;
  padding: 15px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
}

.author-info {
  grid-column: 1 / span 1;
}

.author-actions {
  grid-column: 2 / span 1;
  align-self: center;
  justify-self: end;
}

.author-biography {
  margin-top: 5px;
  color: #6c757d;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 10px;
}

.modal-content form {
  margin-top: 10px;
}

.button-spacing {
  margin-left: 10px;
}

.button-cancel {
  float: right;
}
</style>


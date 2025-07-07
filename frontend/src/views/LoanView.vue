<template>
  <v-container>
  <div class="loans-container">
    <h2>Loans</h2>

    
    <form v-if="!editingLoan" @submit.prevent="addLoan">
      <h3>Add Loan</h3>
      <label for="bookId">Book:</label>
      <v-text-field v-model="newLoan.book_id" label="Book ID" @click="openBooksDialog" readonly required></v-text-field>
      
      <label for="userId">User ID:</label>
      <v-text-field v-model="newLoan.user_id" label="User ID" @click="openUserDialog" readonly required></v-text-field>
      
      <label for="loanDate">Loan Date:</label>
      <input type="date" id="loanDate" v-model="newLoan.loan_date" required>
      
      <label for="returnDate">Return Date:</label>
      <input type="date" id="returnDate" v-model="newLoan.return_date">
      
      <button type="submit">Add Loan</button>
    </form>
    <form v-else @submit.prevent="updateLoan">
      <h3>Edit Loan</h3>
      <label for="editBookId">Book:</label>
      <v-text-field v-model="editedLoan.book_id" label="Book ID" @click="openBooksDialog" readonly required></v-text-field>
      
      <label for="editUserId">User ID:</label>
      <v-text-field v-model="editedLoan.user_id" label="User ID" @click="openUserDialog" readonly required></v-text-field>
      
      <label for="editLoanDate">Loan Date:</label>
      <input type="date" id="editLoanDate" v-model="editedLoan.loan_date" required>
      
      <label for="editReturnDate">Return Date:</label>
      <input type="date" id="editReturnDate" v-model="editedLoan.return_date">
      
      <button type="submit">Update Loan</button>
      <button type="button" @click="cancelEdit">Cancel</button>
    </form>

   
    <v-dialog v-model="bookDialog" max-width="600px">
      <v-card>
        <v-card-title>Select Book</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item v-for="book in books" :key="book.book_id" @click="selectBook(book)">
              <v-list-item-title>{{ book.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="closeBooksDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
   
    <v-dialog v-model="userDialog" max-width="600px">
      <v-card>
        <v-card-title>Select User</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item v-for="user in users" :key="user.user_id" @click="selectUser(user)">
              <v-list-item-title>{{ user.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="closeUserDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <ul>
      <li v-for="loan in loans" :key="loan.loan_id" class="loan-item">
        <h3>Loan ID: {{ loan.loan_id }}</h3>
        <p><strong>Book ID:</strong> {{ loan.book_id }}</p>
        <p><strong>User ID:</strong> {{ loan.user_id }}</p>
        <p><strong>Loan Date:</strong> {{ loan.loan_date }}</p>
        <p v-if="loan.return_date"><strong>Return Date:</strong> {{ loan.return_date }}</p>
        <button @click="editLoan(loan)">Edit</button>
        <button @click="deleteLoan(loan.loan_id)">Delete</button>
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
      loans: [],
      newLoan: {
        book_id: '',
        user_id: '',
        loan_date: '',
        return_date: ''
      },
      editingLoan: null,
      editedLoan: {
        loan_id: null,
        book_id: '',
        user_id: '',
        loan_date: '',
        return_date: ''
      },
      bookDialog: false,
      userDialog: false,
      books: [],
      users: []
    };
  },
  created() {
    this.fetchLoans();
    this.fetchBooks();
    this.fetchUsers();
  },
  methods: {
    async fetchLoans() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/loans`);
        this.loans = response.data;
      } catch (error) {
        console.error('Error fetching loans:', error);
      }
    },
    async addLoan() {
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_URL}/loans`, this.newLoan);
        this.loans.push(response.data);
        this.resetNewLoan();
        console.log('Loan added successfully');
      } catch (error) {
        console.error('Error adding loan:', error);
      }
    },
    async editLoan(loan) {
      this.editingLoan = loan.loan_id;
      this.editedLoan = { ...loan };
    },
    async updateLoan() {
      try {
        const response = await axios.put(`${process.env.VUE_APP_API_URL}/loans/${this.editedLoan.loan_id}`, this.editedLoan);
        const updatedLoan = response.data;
        const index = this.loans.findIndex(loan => loan.loan_id === updatedLoan.loan_id);
        if (index !== -1) {
          this.loans.splice(index, 1, updatedLoan);
        }
        this.cancelEdit();
        console.log('Loan updated successfully');
      } catch (error) {
        console.error('Error updating loan:', error);
      }
    },
    async deleteLoan(loanId) {
      try {
        const response = await axios.delete(`${process.env.VUE_APP_API_URL}/loans/${loanId}`);
        if (response.status === 200) {
          this.loans = this.loans.filter(loan => loan.loan_id !== loanId);
          console.log('Loan deleted successfully');
        } else {
          console.error('Failed to delete loan');
        }
      } catch (error) {
        console.error('Error deleting loan:', error);
      }
    },
    cancelEdit() {
      this.editingLoan = null;
      this.editedLoan = {
        loan_id: null,
        book_id: '',
        user_id: '',
        loan_date: '',
        return_date: ''
      };
    },
    async fetchBooks() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/books`);
        this.books = response.data;
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    },
    async fetchUsers() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/users`);
        this.users = response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    openBooksDialog() {
      this.bookDialog = true;
    },
    closeBooksDialog() {
      this.bookDialog = false;
    },
    openUserDialog() {
      this.userDialog = true;
    },
    closeUserDialog() {
      this.userDialog = false;
    },
    selectBook(book) {
      this.newLoan.book_id = book.book_id;
      this.editedLoan.book_id = book.book_id;
      this.bookDialog = false;
    },
    selectUser(user) {
      this.newLoan.user_id = user.user_id;
      this.editedLoan.user_id = user.user_id;
      this.userDialog = false;
    },
    resetNewLoan() {
      this.newLoan = {
        book_id: '',
        user_id: '',
        loan_date: '',
        return_date: ''
      };
    }
  }
};
</script>

<style scoped>
.loans-container {

  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 5px;
}

.loan-item {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
}

.loan-item h3 {
  margin: 0;
  font-size: 1.2em;
}
</style>

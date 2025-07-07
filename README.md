# Library Management System

A modern Library Management System built with a Vue.js frontend and a Node.js backend, using a MySQL database.  
This project lets you manage books, authors, categories, publishers, users, and book loans, with support for user subscriptions and advanced indexing for performance.

---

## 🚀 Features

- **Manage Books**: Add, update, view, and delete books, with author, category, publisher, and availability info.
- **Author Management**: Track authors and biographies; authors are unique by name.
- **Category Management**: Organize books into categories with descriptions.
- **Publisher Management**: Store publisher info and locations.
- **User Management**: Users with unique emails and subscriptions (free, basic, premium).
- **Book Loans**: Record and track when users borrow and return books.
- **Modern UI**: Responsive frontend with Vue.js for a smooth library admin experience.
- **Efficient Database**: MySQL schema with advanced indexing for fast searching and integrity.

---

## 🗄️ Database Schema Overview

The database contains the following tables:

- **authors** — Authors with unique names and biographies.
- **categories** — Book categories, with unique names and descriptions.
- **publishers** — Publishers by name and location.
- **books** — Books linked to authors, categories, publishers, and availability status.
- **users** — Library users with unique email addresses and subscription level (free/basic/premium).
- **loans** — Tracks when users borrow and return books.

---


---

## 🖥️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ArbreshaS/library_management.git
   cd library_management

Note:
You must run the provided SQL schema before starting the backend.
This will create all required tables in your library_db database.


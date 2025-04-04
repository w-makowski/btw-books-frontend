# ztw-books-frontend

ZTW Books is a web application for managing a Library made for **Advanced Web Technologies** Course at **Wrocław University of Science and Technology**.

It includes functionalities for managing books, authors, readers, and rentals. 

**Frontend**: Vue 3 + Vite

**Backend (REST API)**: [ztw-books-backend](https://github.com/banacchini/ztw-books-backend)



## Project Setup

1. Clone the repositry:

```sh
git clone https://github.com/w-makowski/btw-books-frontend.git
```

2. Navigate to repository:

```sh
cd ztw-books-frontend
```

3. Install dependecies:

```sh
npm install
```

4. Compile and Hot-Reload for Development

```sh
npm run dev
```
Application will be available at http://localhost:5173 


### API Configuration

The application communicates with a REST API backend. By default, we assume that the backend is running on http://localhost:8080. If it is not, change the address in the .env file:

```sh
VITE_API_BASE_URL=http://your-backend.com
```

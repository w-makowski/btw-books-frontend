<template>
    <div class="author-details">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Book Details</h1>
        <div>
          <router-link to="/books" class="btn btn-secondary me-2">
            <i class="bi bi-arrow-left"></i> Back
          </router-link>
          <router-link :to="`/books/edit/${id}`" class="btn btn-warning">
            <i class="bi bi-pencil"></i> Edit
          </router-link>
        </div>
      </div>
      
      <LoadingSpinner v-if="loading" />
      <ErrorMessage v-else-if="error" :message="error" @retry="loadBook" />
      
      <div v-else-if="book" class="row">
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <div class="mb-3">
                <i class="bi bi-person-circle" style="font-size: 5rem;"></i>
              </div>
              <h2 class="card-title">{{ book.title }}</h2>
            </div>
          </div>
        </div>
        
        <div class="col-md-8 mb-4">
          <div class="card h-100">
            <div class="card-header">
              <h5 class="mb-0">Author</h5>
            </div>
            <div class="card-body">
              <p v-if="book.authorId">ID: {{ book.authorId }}</p>
              <p v-if="book.authorName">Name: {{ book.authorName }}</p>
              <p v-else class="text-muted">No author</p>
            </div>
          </div>
        </div>
        
        <!-- WORK IN PROGRESS: -->
        <div class="col-12">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Book's rentals</h5>
              <span class="badge bg-info">{{ book.rentals ? book.rentals.length : 0 }} rentals</span>
            </div>
            <div class="card-body">
              <div v-if="!book.rentals || book.rentals.length === 0" class="text-center py-4">
                <p class="mb-0">This book doesn't have any rentals in our library</p>
              </div>
              <div v-else class="table-responsive">
                <table class="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Reader ID</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="rental in book.rentals" :key="rental.id">
                      <td>{{ rental.id }}</td>
                      <td>{{ rental.readerId }}</td>
                      <td>
                        <span :class="getStatusBadgeClass(rental)">
                          {{ rental.returnDate ? 'Available' : 'Rented' }}
                        </span>
                      </td>
                      <td>
                        <router-link :to="`/rentals/${rental.id}`" class="btn btn-sm btn-info">
                          <i class="bi bi-eye"></i> Details
                        </router-link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="alert alert-warning">
        Nie znaleziono ksiązki o podanym ID
      </div>
    </div>
</template>
  
<script>
import booksService from '@/services/booksService'
import authorsService from '@/services/authorsService'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import ErrorMessage from '@/components/shared/ErrorMessage.vue'
  
  export default {
    name: 'BookDetails',
    components: {
      LoadingSpinner,
      ErrorMessage
    },
    props: {
      id: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        book: null,
        loading: true,
        error: null
      }
    },
    mounted() {
      this.loadBook()
    },
    methods: {
        loadBook() {
    this.loading = true;
    this.error = null;

    booksService.get(this.id)
        .then(response => {
            const tBook = response.data;

            return authorsService.get(tBook.authorId)
                .then(authorResponse => {
                    if (authorResponse.status === 200) {
                        tBook.authorName = authorResponse.data.name;
                    } else {
                        console.error(`Author with ID ${tBook.authorId} not found`);
                        tBook.authorName = 'Unknown author';
                    }
                    return tBook;
                })
                .catch(error => {
                    console.error('Error loading author data:', error);
                    tBook.authorName = 'Unknown author';
                    return tBook;
                });

        })
        .then(bookWithAuthor => {
            this.book = bookWithAuthor;
            this.loading = false;
            console.log('book:', this.book);
        })
        .catch(error => {
            console.error('Error loading book details:', error);
            this.error = 'Nie udało się załadować szczegółów ksiązki. Spróbuj ponownie później.';
            this.loading = false;
        });


      },
      formatDate(dateString) {
        if (!dateString) return 'Brak danych'
        return new Date(dateString).toLocaleDateString('pl-PL')
      },
      getStatusBadgeClass(rental) {
        return rental.returnDate ? 'badge bg-success' : 'badge bg-warning'
      }
    }
  }
</script>

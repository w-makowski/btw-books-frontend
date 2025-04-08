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
        <div class="mt-4">
          <h2>Book's Rentals</h2>
          <LoadingSpinner v-if="loading" />
          <ErrorMessage v-else-if="error" :message="error" @retry="loadBookRentals" />
          <div v-else>
            <table class="table" v-if="bookRentals.length">
              <thead>
              <tr>
                <th>Reader</th>
                <th>Rental Date</th>
                <th>Return Date</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="rental in bookRentals" :key="rental.id">
                <td>{{ getReaderName(rental.readerId) }}</td>
                <td>{{ formatDate(rental.rentalDate) }}</td>
                <td>{{ rental.returnDate ? formatDate(rental.returnDate) : 'Not returned' }}</td>
                <td>
                  <div class="btn-group">
                    <router-link :to="`/rentals/${rental.id}`" class="btn btn-sm btn-info">
                      View
                      <i class="bi bi-eye"></i>
                    </router-link>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
            <p v-else>No rentals found for this book.</p>
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
import readersService from "@/services/readersService.js";
  
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
        error: null,
        bookRentals: [],
        readers: {}
      }
    },
    mounted() {
      this.loadBook()
      this.loadBookRentals()
    },
    methods: {
      loadBookRentals() {
        console.log('1. Starting loadBookRentals')
        this.loading = true

        booksService.getRentals(this.id)
            .then(response => {
              console.log('2. Received rentals:', response.data)
              this.bookRentals = response.data
              console.log('3. Set bookRentals:', this.bookRentals)

              if (this.bookRentals.length > 0) {
                console.log('4. Loading reader names')
                this.loadReaderNames()
              } else {
                console.log('4. No rentals to process')
              }
            })
            .catch(error => {
              console.error('Error details:', {
                code: error.code,
                message: error.message,
                response: error.response?.data
              })
              this.error = 'Nie udało się załadować wypożyczeń książki. Spróbuj ponownie później.'
            })
            .finally(() => {
              console.log('5. Request completed, loading:', this.loading)
              this.loading = false
            })
      },
      loadReaderNames() {
        console.log('Starting loadReaderNames')
        const readerIds = [...new Set(this.bookRentals.map(rental => rental.readerId))]
        console.log('Unique reader IDs:', readerIds)

        readerIds.forEach(readerId => {
          console.log('Processing reader ID:', readerId)
          if (!this.readers[readerId]) {
            console.log('Reader not cached, loading:', readerId)
            this.readers[readerId] = 'Loading...'

            readersService.get(readerId)
                .then(response => {
                  console.log(`Reader ${readerId} API response:`, response)
                  this.readers[readerId] = response.data.name
                  console.log(`Updated reader ${readerId} name to:`, this.readers[readerId])
                })
                .catch(error => {
                  console.error(`Error loading reader ${readerId}:`, error)
                  this.readers[readerId] = 'Unknown reader'
                })
          } else {
            console.log('Using cached reader name for ID:', readerId)
          }
        })
      },
      getReaderName(readerId) {
        return this.readers[readerId] || 'Loading...'
      },
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

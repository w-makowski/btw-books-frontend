<template>
    <div class="rental-details">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Rental Details</h1>
        <div>
          <router-link to="/rentals" class="btn btn-secondary me-2">
            <i class="bi bi-arrow-left"></i> Back
          </router-link>
          <router-link :to="`/rentals/edit/${id}`" class="btn btn-warning">
            <i class="bi bi-pencil"></i> Edit
          </router-link>
        </div>
      </div>
      
      <LoadingSpinner v-if="loading" />
      <ErrorMessage v-else-if="error" :message="error" @retry="loadRental" />
      
      <div v-else-if="rental" class="row">
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <div class="mb-3">
                <i class="bi bi-person-circle" style="font-size: 5rem;"></i>
              </div>
              <h2 class="card-title">Rental ID: {{ rental.id }}</h2>
            </div>
          </div>
        </div>
        
        <div class="col-md-8 mb-4">
          <div class="card h-100">
            <div class="card-header">
              <h5 class="mb-0">Book Info</h5>
            </div>
            <div class="card-body">
              <p v-if="rental.bookId">ID: {{ rental.bookId }}</p>
              <p v-if="rental.bookTitle">Title: {{ rental.bookTitle }}</p>
              <p v-if="rental.bookAuthorName">Author: {{ rental.bookAuthorName }}</p>
              <p v-else class="text-muted">No book</p>
            </div>
          </div>
        </div>
        
        <div class="col-12">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Reader info</h5>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Reader ID</th>
                      <th>Reader Name</th>
                      <th>Rental Date</th>
                      <th>Return Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="rental">
                        <td>{{ rental.readerId }}</td>
                        <td>{{ rental.readerName }}</td>
                        <td>{{ formatDate(rental.rentalDate) }}</td>
                        <td>{{ formatDate(rental.returnDate) }}</td>
                        <td>
                        <span :class="getStatusBadgeClass(rental)">
                            {{ rental.returnDate ? 'Available' : 'Rented' }}
                        </span>
                        </td>
                        <td>
                            <button
                            class="btn btn-sm btn-danger"
                            @click="confirmReturn(rental.id)"
                            :disabled="rental.returnDate"
                            :class="{ 'btn-outline-secondary': rental.returnDate, 'btn-danger': !rental.returnDate }"
                            >
                                <i class="bi bi-box-arrow-in-left"></i> Return Book
                            </button>
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
        Nie znaleziono wypozyczenia o podanym ID
      </div>

      <div v-if="showModal" class="modal fade show d-block" tabindex="-1" role="dialog" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Confirm Return</h5>
                <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to return this book?</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
                <button type="button" class="btn btn-danger" @click="returnBook">Yes, Return</button>
            </div>
            </div>
        </div>
        </div>
    </div>
</template>
  
<script>
import rentalsService from '@/services/rentalsService'
import readersService from '@/services/readersService'
import booksService from '@/services/booksService'
import authorsService from '@/services/authorsService'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import ErrorMessage from '@/components/shared/ErrorMessage.vue'
  
  export default {
    name: 'RentalDetails',
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
        rental: null,
        loading: true,
        error: null,
        showModal: false,
        rentalToReturnId: null
      }
    },
    mounted() {
      this.loadRental()
    },
    methods: {
        confirmReturn(id) {
            this.rentalToReturnId = id
            this.showModal = true
        },
        closeModal() {
            this.showModal = false
            this.rentalToReturnId = null
        },
        async returnBook() {
            try {
                await rentalsService.returnBook(this.rentalToReturnId)
                this.closeModal()
                this.loadRental()
            } catch (error) {
                console.error('Error returning book:', error)
                this.error = "Couldn't return this book."
                this.closeModal()
            }
        },

        async loadRental() {
            this.loading = true
            this.error = null

            try {
                const rentalResponse = await rentalsService.get(this.id)
                const rental = rentalResponse.data

                try {
                    const bookResponse = await booksService.get(rental.bookId)
                    const book = bookResponse.data
                    rental.bookTitle = book.title

                try {
                    const authorResponse = await authorsService.get(book.authorId)
                    rental.bookAuthorName = authorResponse.data.name
                } catch (err) {
                    console.error('Error while loading author data:', err)
                    rental.bookAuthorName = 'Unknown author'
                }
                } catch (err) {
                    console.error('Error while loading book data:', err)
                    rental.bookTitle = 'Unknown book'
                    rental.bookAuthorName = 'Unknown author'
                }

                try {
                    const readerResponse = await readersService.get(rental.readerId)
                    rental.readerName = readerResponse.data.name
                } catch (err) {
                    console.error('Error while loading reader data:', err)
                    rental.readerName = 'Unknown reader'
                }

                this.rental = rental
                console.log('Rental:', this.rental)
            } catch (error) {
                console.error('Error while loading rental data:', error)
                this.error = "Couldn't load rental details."
            } finally {
                this.loading = false
            }
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

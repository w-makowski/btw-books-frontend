<template>
    <div class="rentals-form">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>{{ isEditing ? 'Edit rental' : 'Add rental' }}</h1>
        <router-link to="/rentals" class="btn btn-secondary">
          <i class="bi bi-arrow-left"></i> Back
        </router-link>
      </div>
      
      <LoadingSpinner v-if="loading" />
      <ErrorMessage v-else-if="error" :message="error" @retry="loadRental" />

        <ErrorModal
        v-if="modalError"
        :status="modalErrorStatus"
        :message="modalError"
        @close="handleErrorModalClose"
        />
      
      <div v-else class="card">
        <div class="card-body">
          <form @submit.prevent="saveRental" novalidate>
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="bookId" class="form-label">Book</label>
                <Multiselect
                    v-model="form.bookId"
                    :options="books.map(b => ({
        value: b.id,
        label: `${b.id} - ${b.title} (${b.authorName})`
      }))"
                    :searchable="true"
                    placeholder="Select or type to search a book"
                    valueProp="value"
                    :class="{ 'is-invalid': submitted && !form.bookId }"
                    :disabled="loading"
                />
                <div class="invalid-feedback">Book is required</div>
              </div>

              <div class="col-md-6">
                <label for="readerId" class="form-label">Reader</label>
                <Multiselect
                    v-model="form.readerId"
                    :options="readers.map(r => ({
                    value: r.id,
                    label: `${r.id} - ${r.name}`
                    }))"
                    :searchable="true"
                    placeholder="Select or type to search a reader"
                    valueProp="value"
                    :class="{ 'is-invalid': submitted && !form.readerId }"
                    :disabled="loading"
                />
                <div class="invalid-feedback">Reader is required</div>
              </div>

              <div class="col-md-6">
                <label for="reantalDate" class="form-label">Rental Date *</label>
                <input 
                  type="date"
                  class="form-control" 
                  id="pages" 
                  v-model="form.rentalDate"
                  :max="today"
                  :class="{ 'is-invalid': submitted && !form.rentalDate }"
                  required
                >
                <div class="invalid-feedback">Rental Date is obligatory</div>
              </div>

              <div class="col-md-6">
                <label for="returnDate" class="form-label">Return Date</label>
                <input 
                  type="date"
                  class="form-control" 
                  id="pages" 
                  v-model="form.returnDate"
                  :min="form.rentalDate"
                  :max="today"
                  :class="{ 'is-invalid': submitted && returnDateInvalid }"
                >
              </div>
            </div>
            
            <div class="d-flex justify-content-end gap-2">
              <button type="button" class="btn btn-secondary" @click="$router.push('/rentals')">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" :disabled="isSaving">
                <span v-if="isSaving" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                {{ isEditing ? 'Save changes' : 'Add rental' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
</template>
  
<script>
import rentalsService from '@/services/rentalsService'
import booksService from '@/services/booksService'
import readersService from "@/services/readersService.js"
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import ErrorMessage from '@/components/shared/ErrorMessage.vue'
import ErrorModal from '@/components/shared/ErrorModal.vue'
import authorsService from "@/services/authorsService.js"
import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css'

  
  export default {
    name: 'RentalForm',
    components: {
      LoadingSpinner,
      ErrorMessage,
      ErrorModal,
      Multiselect
    },
    props: {
      id: {
        type: Number,
        required: false,
        default: null
      }
    },
    data() {
      return {
        form: {
          bookId: '',
          readerId: '',
          rentalDate: '',
          returnDate: ''
        },
        loading: false,
        error: null,
        submitted: false,
        isSaving: false,
        dateError: '',
        modalError: '',
        modalErrorStatus: '',
        books: [],
        readers: []
      }
    },
    computed: {
      isEditing() {
        return this.id !== null
      },
      today() {
        return new Date().toISOString().split('T')[0]
      },
      returnDateInvalid() {
        return this.form.returnDate && this.form.returnDate < this.form.rentalDate
      }
    },
    mounted() {
      if (this.isEditing) {
        this.loadRental()
      }
    },
    created() {
      this.loadBooks()
      this.loadReaders()
    },
    methods: {
      handleErrorModalClose() {
        this.modalError = ''
        this.modalErrorStatus = ''
      },
      // loadBooks(){
      //   this.loading = true
      //   this.error = null
      //
      //   booksService.getAll()
      //     .then(response => {
      //       this.books = response.data
      //       this.loading = false
      //     })
      //     .catch(error => {
      //       console.error('Error loading books:', error)
      //       this.error = "Couldn't load books. Try again later."
      //       this.loading = false
      //     })
      // },
      loadBooks() {
        this.loading = true
        this.error = null

        booksService.getAll()
            .then(response => {
              const tBooks = response.data
              const booksPromises = tBooks.map((book) => {
                return Promise.all([
                  authorsService.get(book.authorId)
                ])
                    .then(([authorResponse]) => {
                      if (authorResponse.status === 200) {
                        book.authorName = authorResponse.data.name;
                      } else {
                        console.error(authorResponse)
                        console.error(`Author with ID ${book.authorId} not found`);
                        book.authorName = 'Unknown author';
                      }
                    })
                    .catch(error => {
                      console.error('Error loading author data:', error);
                    })
              })
              Promise.all(booksPromises)
                  .then(() => {
                    this.books = tBooks;
                    console.log('books:', this.books);
                  });
              this.loading = false
            })
            .catch(error => {
              console.error('Error while loading books:', error);
              this.error = "Couldn't load books"
              this.loading = false
            });
      },
      loadReaders(){
        this.loading = true
        this.error = null

        readersService.getAll()
          .then(response => {
            this.readers = response.data
            this.loading = false
          })
          .catch(error => {
            console.error('Error loading readers:', error)
            this.error = "Couldn't load readers. Try again later."
            this.loading = false
          })
      },
      loadRental() {
        this.loading = true
        this.error = null
        
        rentalsService.get(this.id)
          .then(response => {
            const rental = response.data
            
            this.form = {
              ...rental,
            }
            
            this.loading = false
          })
          .catch(error => {
            console.error('Error loading rental:', error)
            this.error = "Couldn't load rental's data. Try again later."
            this.loading = false
          })
      },
      validateForm() {
        this.submitted = true
        this.dateError = ''
        
        if (!this.form.bookId || !this.form.readerId || !this.form.rentalDate) {
          return false
        }

        if (this.form.returnDate && this.form.returnDate < this.form.rentalDate) {
            this.dateError = 'Return date cannot be earlier than rental date.'
            return false
        }
        
        return true
      },
      saveRental() {
        if (!this.validateForm()) {
          return
        }
        
        this.isSaving = true
        
        const rentalData = { ...this.form }
        
        const savePromise = this.isEditing
          ? rentalsService.update(this.id, rentalData)
          : rentalsService.create(rentalData)
        
        savePromise
          .then(() => {
            this.$router.push('/rentals')
          })
          .catch(error => {
            console.error('Error saving rental:', error)
            const status = error?.response?.status
            const message = error?.response?.data?.message || "Unexpected error"
            const status2 = error?.response?.data?.status || 500

            if (status === 404) {
                this.$router.push({
                    name: 'ErrorPage',
                    query: {
                        message,
                        status2
                    }
                })
            } else {
                this.modalError = message
                this.modalErrorStatus = error?.response?.data?.status
            }
          })
          .finally(() => {
            this.isSaving = false
          })
      },
    }
  }
</script>

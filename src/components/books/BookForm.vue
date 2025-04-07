<template>
    <div class="book-form">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>{{ isEditing ? 'Edit book' : 'Add book' }}</h1>
        <router-link to="/books" class="btn btn-secondary">
          <i class="bi bi-arrow-left"></i> Back
        </router-link>
      </div>
      
      <LoadingSpinner v-if="loading" />
      <ErrorMessage v-else-if="error" :message="error" @retry="loadBook" />
      
      <div v-else class="card">
        <div class="card-body">
          <form @submit.prevent="saveBook" novalidate>
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="title" class="form-label">Title *</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="title" 
                  v-model="form.title"
                  :class="{ 'is-invalid': submitted && !form.title }"
                  required
                >
                <div class="invalid-feedback">Title is obligatory</div>
              </div>

              <div class="col-md-6">
                <label for="authorId" class="form-label">Author*</label>
                <select
                    class="form-select"
                    id="authorId"
                    v-model="form.authorId"
                    :class="{ 'is-invalid': submitted && !form.authorId }"
                    :disabled="loading"
                    required
                >
                  <option value="">{{ loading ? 'Loading...' : 'Select an author' }}</option>
                  <option v-for="author in authors" :key="author.id" :value="author.id">
                    {{ author.id }} - {{ author.name }}
                  </option>
                </select>
              </div>

              <div class="col-md-6">
                <label for="pages" class="form-label">Pages *</label>
                <input 
                  type="number"
                  min="0"
                  step="1"
                  class="form-control" 
                  id="pages" 
                  v-model="form.pages"
                  :class="{ 'is-invalid': submitted && !form.pages }"
                  required
                >
                <div class="invalid-feedback">Pages number is obligatory</div>
              </div>
            </div>
            
            <div class="d-flex justify-content-end gap-2">
              <button type="button" class="btn btn-secondary" @click="$router.push('/books')">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" :disabled="isSaving">
                <span v-if="isSaving" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                {{ isEditing ? 'Save changes' : 'Add book' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
</template>
  
<script>
import booksService from '@/services/booksService'
import authorsService from '@/services/authorsService'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import ErrorMessage from '@/components/shared/ErrorMessage.vue'
import ErrorModal from '@/components/shared/ErrorModal.vue'
  
  export default {
    name: 'BookForm',
    components: {
      LoadingSpinner,
      ErrorMessage,
      ErrorModal
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
          name: '',
          authorId: '',
          pages: ''
        },
        loading: false,
        error: null,
        submitted: false,
        isSaving: false,
        dateError: '',
        modalError: '',
        modalErrorStatus: '',
        authors: []
      }
    },
    computed: {
      isEditing() {
        return this.id !== null
      }
    },
    mounted() {
      if (this.isEditing) {
        this.loadBook()
      }
    },
    created() {
      this.loadAuthors()
    },
    methods: {
      handleErrorModalClose() {
        this.modalError = ''
        this.modalErrorStatus = ''
      },
      loadAuthors() {
        this.loading = true
        authorsService.getAll()
          .then(response => {
            this.authors = response.data
          })
          .catch(error => {
            console.error('Error loading authors:', error)
            this.error = "Couldn't load authors. Try again later."
          })
          .finally(() => {
            this.loading = false
          })
      },
      loadBook() {
        this.loading = true
        this.error = null
        
        booksService.get(this.id)
          .then(response => {
            const book = response.data
            
            this.form = {
              ...book,
            }
            
            this.loading = false
          })
          .catch(error => {
            console.error('Error loading book:', error)
            this.error = "Couldn't load book's data. Try again later."
            this.loading = false
          })
      },
      validateForm() {
        this.submitted = true
        this.dateError = ''
        
        if (!this.form.title || !this.form.authorId || !this.form.pages) {
          return false
        }
        
        return true
      },
      saveBook() {
        if (!this.validateForm()) {
          return
        }
        
        this.isSaving = true
        
        const bookData = { ...this.form }
        
        const savePromise = this.isEditing
          ? booksService.update(this.id, bookData)
          : booksService.create(bookData)
        
        savePromise
          .then(() => {
            this.$router.push('/books')
          })
          .catch(error => {
            console.error('Error saving book:', error)
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

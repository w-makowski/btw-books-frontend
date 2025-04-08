<template>
    <div class="author-details">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Author Details</h1>
        <div>
          <router-link to="/authors" class="btn btn-secondary me-2">
            <i class="bi bi-arrow-left"></i> Back
          </router-link>
          <router-link :to="`/authors/edit/${id}`" class="btn btn-warning">
            <i class="bi bi-pencil"></i> Edit
          </router-link>
        </div>
      </div>
      
      <LoadingSpinner v-if="loading" />
      <ErrorMessage v-else-if="error" :message="error" @retry="loadAuthor" />
      
      <div v-else-if="author" class="row">
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <div class="mb-3">
                <i class="bi bi-person-circle" style="font-size: 5rem;"></i>
              </div>
              <h2 class="card-title">{{ author.name }}</h2>
            </div>
          </div>
        </div>
        
        <div class="col-md-8 mb-4">
          <div class="card h-100">
            <div class="card-header">
              <h5 class="mb-0">Biography</h5>
            </div>
            <div class="card-body">
              <p v-if="author.biography">{{ author.biography }}</p>
              <p v-else class="text-muted">No biography</p>
            </div>
          </div>
        </div>
        
        <!-- WORK IN PROGRESS: -->
        <div class="mt-4">
          <h2>Books by this author</h2>
          <LoadingSpinner v-if="loading" />
          <ErrorMessage v-else-if="error" :message="error" @retry="loadAuthorBooks" />
          <div v-else>
            <table class="table" v-if="authorBooks.length">
              <thead>
              <tr>
                <th>Title</th>
                <th>Pages</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="book in authorBooks" :key="book.id">
                <td>{{ book.title }}</td>
                <td>{{ book.pages }}</td>
                <td>
                  <router-link :to="`/books/${book.id}`" class="btn btn-sm btn-info">
                    View
                  </router-link>
                </td>
              </tr>
              </tbody>
            </table>
            <p v-else>No books found for this author.</p>
          </div>
        </div>
      </div>
      
      <div v-else class="alert alert-warning">
        Nie znaleziono autora o podanym ID
      </div>
    </div>
</template>
  
<script>
import authorsService from '@/services/authorsService'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import ErrorMessage from '@/components/shared/ErrorMessage.vue'
  
  export default {
    name: 'AuthorDetails',
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
        author: null,
        loading: true,
        error: null,
        authorBooks: []
      }
    },
    mounted() {
      this.loadAuthor()
    },
    created(){
      this.loadAuthorBooks()
    },
    methods: {
      loadAuthorBooks(){
        this.loading = true
        this.error  = null
        authorsService.getBooks(this.id)
          .then(response => {
            this.authorBooks = response.data
          })
          .catch(error => {
            console.error('Error loading author books:', error)
            this.error = 'Nie udało się załadować książek autora. Spróbuj ponownie później.'
          })
            .finally(() => {
              this.loading = false
            })
      },
      loadAuthor() {
        this.loading = true
        this.error = null
        
        authorsService.get(this.id)
          .then(response => {
            this.author = response.data
            this.loading = false
          })
          .catch(error => {
            console.error('Error loading author details:', error)
            this.error = 'Nie udało się załadować szczegółów autora. Spróbuj ponownie później.'
            this.loading = false
          })
      },
      formatDate(dateString) {
        if (!dateString) return 'Brak danych'
        return new Date(dateString).toLocaleDateString('pl-PL')
      },
      getStatusBadgeClass(book) {
        return book.available ? 'badge bg-success' : 'badge bg-warning'
      }
    }
  }
</script>

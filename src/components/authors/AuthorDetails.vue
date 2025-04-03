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
        <div class="col-12">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Author's books</h5>
              <span class="badge bg-info">{{ author.books ? author.books.length : 0 }} books</span>
            </div>
            <div class="card-body">
              <div v-if="!author.books || author.books.length === 0" class="text-center py-4">
                <p class="mb-0">This author doesn't have any books in our library</p>
              </div>
              <div v-else class="table-responsive">
                <table class="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="book in author.books" :key="book.id">
                      <td>{{ book.id }}</td>
                      <td>{{ book.title }}</td>
                      <td>
                        <span :class="getStatusBadgeClass(book)">
                          {{ book.available ? 'Available' : 'Rented' }}
                        </span>
                      </td>
                      <td>
                        <router-link :to="`/books/${book.id}`" class="btn btn-sm btn-info">
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
        error: null
      }
    },
    mounted() {
      this.loadAuthor()
    },
    methods: {
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

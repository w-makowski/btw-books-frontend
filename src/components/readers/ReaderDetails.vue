<template>
    <div class="author-details">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Reader Details</h1>
        <div>
          <router-link to="/readers" class="btn btn-secondary me-2">
            <i class="bi bi-arrow-left"></i> Back
          </router-link>
          <router-link :to="`/readers/edit/${id}`" class="btn btn-warning">
            <i class="bi bi-pencil"></i> Edit
          </router-link>
        </div>
      </div>
      
      <LoadingSpinner v-if="loading" />
      <ErrorMessage v-else-if="error" :message="error" @retry="loadReader" />
      
      <div v-else-if="reader" class="row">
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <div class="mb-3">
                <i class="bi bi-person-circle" style="font-size: 5rem;"></i>
              </div>
              <h2 class="card-title">{{ reader.name }}</h2>
            </div>
          </div>
        </div>
        
        <!-- WORK IN PROGRESS: -->
        <div class="col-12">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Reader's rentals</h5>
              <span class="badge bg-info">{{ reader.rentals ? reader.rental.length : 0 }} rentals</span>
            </div>
            <div class="card-body">
              <div v-if="!reader.rentals || reader.rentals.length === 0" class="text-center py-4">
                <p class="mb-0">This reader doesn't have any rentals in our library</p>
              </div>
              <div v-else class="table-responsive">
                <table class="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Book ID</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="rental in author.rentals" :key="rental.id">
                      <td>{{ rental.id }}</td>
                      <td>{{ rental.bookId }}</td>
                      <td>
                        <span :class="getStatusBadgeClass(book)">
                          {{ rental.returned ? 'Returned' : 'Rented' }}
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
        Nie znaleziono czytelnika o podanym ID
      </div>
    </div>
</template>
  
<script>
import readersService from '@/services/readersService'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import ErrorMessage from '@/components/shared/ErrorMessage.vue'
  
  export default {
    name: 'ReaderDetails',
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
        reader: null,
        loading: true,
        error: null
      }
    },
    mounted() {
      this.loadReader()
    },
    methods: {
      loadReader() {
        this.loading = true
        this.error = null
        
        readersService.get(this.id)
          .then(response => {
            this.reader = response.data
            this.loading = false
          })
          .catch(error => {
            console.error('Error loading readers details:', error)
            this.error = 'Nie udało się załadować szczegółów czytelnika. Spróbuj ponownie później.'
            this.loading = false
          })
      },
      formatDate(dateString) {
        if (!dateString) return 'Brak danych'
        return new Date(dateString).toLocaleDateString('pl-PL')
      },
      getStatusBadgeClass(rental) {
        return rental.returned ? 'badge bg-success' : 'badge bg-warning'
      }
    }
  }
</script>

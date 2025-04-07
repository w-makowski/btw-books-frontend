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
      
      <div v-else class="card">
        <div class="card-body">
          <form @submit.prevent="saveRental" novalidate>
            <div class="row mb-3">

              <div class="col-md-6">
                <label for="bookId" class="form-label">Book ID*</label>
                <input 
                  type="number"
                  min="0"
                  step="1"
                  class="form-control" 
                  id="book" 
                  v-model="form.bookId"
                  :class="{ 'is-invalid': submitted && !form.bookId }"
                  required
                >
                <div class="invalid-feedback">Book is obligatory</div>
              </div>

              <div class="col-md-6">
                <label for="readerId" class="form-label">Reader ID*</label>
                <input 
                  type="number"
                  min="0"
                  step="1"
                  class="form-control" 
                  id="reader" 
                  v-model="form.readerId"
                  :class="{ 'is-invalid': submitted && !form.readerId }"
                  required
                >
                <div class="invalid-feedback">Reader is obligatory</div>
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
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import ErrorMessage from '@/components/shared/ErrorMessage.vue'
  
  export default {
    name: 'RentalForm',
    components: {
      LoadingSpinner,
      ErrorMessage
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
        dateError: ''
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
    methods: {
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
            alert("Couldn't save rental's data. Try again later.")
          })
          .finally(() => {
            this.isSaving = false
          })
      },
    }
  }
</script>

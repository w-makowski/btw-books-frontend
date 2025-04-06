<template>
    <div class="reader-form">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>{{ isEditing ? 'Edit reader' : 'Add reader' }}</h1>
        <router-link to="/readers" class="btn btn-secondary">
          <i class="bi bi-arrow-left"></i> Back
        </router-link>
      </div>
      
      <LoadingSpinner v-if="loading" />
      <ErrorMessage v-else-if="error" :message="error" @retry="loadReader" />
      
      <div v-else class="card">
        <div class="card-body">
          <form @submit.prevent="saveReader" novalidate>
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="name" class="form-label">Name *</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="name" 
                  v-model="form.name"
                  :class="{ 'is-invalid': submitted && !form.name }"
                  required
                >
                <div class="invalid-feedback">Name is obligatory</div>
              </div>
            </div>
            
            <div class="d-flex justify-content-end gap-2">
              <button type="button" class="btn btn-secondary" @click="$router.push('/readers')">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" :disabled="isSaving">
                <span v-if="isSaving" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                {{ isEditing ? 'Save changes' : 'Add reader' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
</template>
  
<script>
import readersService from '@/services/readersService'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import ErrorMessage from '@/components/shared/ErrorMessage.vue'
  
  export default {
    name: 'ReaderForm',
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
          name: ''
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
      }
    },
    mounted() {
      if (this.isEditing) {
        this.loadReader()
      }
    },
    methods: {
      loadReader() {
        this.loading = true
        this.error = null
        
        readersService.get(this.id)
          .then(response => {
            const reader = response.data
            
            this.form = {
              ...reader,
            }
            
            this.loading = false
          })
          .catch(error => {
            console.error('Error loading reader:', error)
            this.error = "Couldn't load reader's data. Try again later."
            this.loading = false
          })
      },
      validateForm() {
        this.submitted = true
        this.dateError = ''
        
        if (!this.form.name) {
          return false
        }
        
        return true
      },
      saveReader() {
        if (!this.validateForm()) {
          return
        }
        
        this.isSaving = true
        
        const readerData = { ...this.form }
        
        const savePromise = this.isEditing
          ? readersService.update(this.id, readerData)
          : readersService.create(readerData)
        
        savePromise
          .then(() => {
            this.$router.push('/readers')
          })
          .catch(error => {
            console.error('Error saving reader:', error)
            alert("Couldn't save reader's data. Try again later.")
          })
          .finally(() => {
            this.isSaving = false
          })
      },
    }
  }
</script>

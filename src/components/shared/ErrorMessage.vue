<template>
    <div class="alert alert-danger my-4" role="alert">
      <div class="d-flex align-items-center">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        <div>
          <h4 class="alert-heading">Error!</h4>
          <p class="mb-0">{{ message || 'Unexpected error occured.' }}</p>
        </div>
      </div>
      <hr>
      <div class="d-flex justify-content-end">
        <button class="btn btn-outline-danger" @click="$emit('retry')">
          <i class="bi bi-arrow-clockwise me-1"></i> Try again
        </button>
      </div>
    </div>
</template>
  
<script>
  export default {
    name: 'ErrorMessage',
    props: {
      message: {
        type: String,
        required: false,
        default: ''
      }
    }
  }
</script>

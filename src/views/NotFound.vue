<template>
    <div class="container text-center py-5">
      <h1 class="display-4">Oops!</h1>
      <h2 v-if="status" class="text-danger">Error {{ status }}</h2>
      <p class="lead mt-3">
        {{ message || "The page you're looking for doesn't exist or an error occurred." }}
      </p>
      <router-link to="/" class="btn btn-primary mt-3">
        <i class="bi bi-house-door"></i> Go to Home
      </router-link>
    </div>
  </template>
  
<script>
export default {
    name: 'NotFound',
    props: {
      message: {
        type: String,
        default: ''
      },
      status: {
        type: [String, Number],
        default: ''
      }
    }
}
</script>
  
<style scoped>
  .container {
    max-width: 600px;
  }
</style>
  
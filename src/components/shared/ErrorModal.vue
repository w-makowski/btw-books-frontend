<template>
    <div class="modal-backdrop">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">Error</h5>
            <button type="button" class="btn-close" @click="$emit('close')"></button>
          </div>
          <div class="modal-body">
            <p>Status: {{ status }}</p>
            <p>{{ message }}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="$emit('close')">Close</button>
          </div>
        </div>
      </div>
    </div>
</template>
  
<script>
  export default {
    name: 'ErrorModal',
    props: {
      status: {
        type: [String, Number],
        required: true
      },
      message: {
        type: String,
        required: true
      }
    }
  }
</script>
  
<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    z-index: 1050;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
  
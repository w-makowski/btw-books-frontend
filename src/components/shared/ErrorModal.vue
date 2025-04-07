<template>
    <div class="modal-backdrop">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Error</h5>
            <button type="button" class="close-button" @click="$emit('close')">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="status-badge">
              <span>Status: {{ status }}</span>
            </div>
            <p class="error-message">{{ message }}</p>
          </div>
          <div class="modal-footer">
            <button class="close-btn" @click="$emit('close')">Close</button>
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
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 1050;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-dialog {
    width: 90%;
    max-width: 500px;
    margin: 0 auto;
    animation: fadeIn 0.3s ease-out;
  }
  
  .modal-content {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: linear-gradient(135deg, #e53935, #c62828);
    color: white;
    border-bottom: none;
  }
  
  .modal-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }
  
  .close-button {
    background: transparent;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    margin: 0;
    opacity: 0.7;
    transition: opacity 0.2s;
  }
  
  .close-button:hover {
    opacity: 1;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .status-badge {
    display: inline-block;
    padding: 4px 10px;
    margin-bottom: 12px;
    background-color: #f8d7da;
    border-left: 4px solid #c62828;
    border-radius: 2px;
    color: #721c24;
    font-weight: 500;
  }
  
  .error-message {
    font-size: 15px;
    color: #333;
    line-height: 1.5;
    margin-bottom: 0;
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    padding: 15px 20px;
    border-top: 1px solid #e9ecef;
  }
  
  .close-btn {
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .close-btn:hover {
    background-color: #5a6268;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
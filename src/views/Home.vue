<template>
  <div class="home">
    <div class="hero-section py-5 bg-light mb-5 rounded">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6">
            <h1 class="display-4 fw-bold mb-4">Library System</h1>
            <p class="lead mb-4">
              Welcome to our library management system. Manage your books, authors, readers and rents in one place.
            </p>
            <div class="d-flex gap-3">
              <router-link to="/books" class="btn btn-primary btn-lg">
                Browse books
              </router-link>
              <router-link to="/rentals/add" class="btn btn-outline-primary btn-lg">
                Rent a book
              </router-link>
            </div>
          </div>
          <div class="col-md-6 text-center">
            <i class="bi bi-book-half text-primary" style="font-size: 12rem;"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <h2 class="mb-4">Library Statistics</h2>
      <div class="row mb-5">
        <div class="col-md-3 mb-3">
          <div class="card h-100 text-center">
            <div class="card-body">
              <i class="bi bi-book text-primary mb-3" style="font-size: 2rem;"></i>
              <h5 class="card-title">Books</h5>
              <h3 class="card-text fw-bold">{{ stats.booksCount }}</h3>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card h-100 text-center">
            <div class="card-body">
              <i class="bi bi-person-badge text-success mb-3" style="font-size: 2rem;"></i>
              <h5 class="card-title">Authors</h5>
              <h3 class="card-text fw-bold">{{ stats.authorsCount }}</h3>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card h-100 text-center">
            <div class="card-body">
              <i class="bi bi-people text-info mb-3" style="font-size: 2rem;"></i>
              <h5 class="card-title">Readers</h5>
              <h3 class="card-text fw-bold">{{ stats.readersCount }}</h3>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card h-100 text-center">
            <div class="card-body">
              <i class="bi bi-box-arrow-right text-warning mb-3" style="font-size: 2rem;"></i>
              <h5 class="card-title">Active Rentals</h5>
              <h3 class="card-text fw-bold">{{ stats.ongoingRentalsCount }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getStats } from '@/services/statsService';

export default {
  name: 'Home',
  setup() {
    const stats = ref({
      booksCount: 0,
      authorsCount: 0,
      readersCount: 0,
      ongoingRentalsCount: 0,
    });

    onMounted(async () => {
      stats.value = await getStats();
    });

    return { stats };
  },
};
</script>
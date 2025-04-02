<template>
    <div class="home">
        <div class="hero-section py-5 bg-light mb-5 rounded">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-md-6">
                        <h1 class="display-4 fw-bold mb-4">System Biblioteczny</h1>
                        <p class="lead mb-4">
                            Witaj w naszym systemie zarządzania biblioteką. Zarządzaj książkami, autorami, 
                            czytelnikami i wypożyczeniami w jednym miejscu.
                        </p>
                        <div class="d-flex gap-3">
                            <router-link to="/books" class="btn btn-primary btn-lg">
                                Przeglądaj książki
                            </router-link>
                            <router-link to="/rentals/add" class="btn btn-outline-primary btn-lg">
                                Wypożycz książkę
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
            <h2 class="mb-4">Statystyki biblioteki</h2>
            <div class="row mb-5">
                <div class="col-md-3 mb-3">
                    <div class="card h-100 text-center">
                        <div class="card-body">
                            <i class="bi bi-book text-primary mb-3" style="font-size: 2rem;"></i>
                            <h5 class="card-title">Książki</h5>
                            <h3 class="card-text fw-bold">{{ stats.books }}</h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 mb-3">
                    <div class="card h-100 text-center">
                        <div class="card-body">
                            <i class="bi bi-person-badge text-success mb-3" style="font-size: 2rem;"></i>
                            <h5 class="card-title">Autorzy</h5>
                            <h3 class="card-text fw-bold">{{ stats.authors }}</h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 mb-3">
                    <div class="card h-100 text-center">
                        <div class="card-body">
                            <i class="bi bi-people text-info mb-3" style="font-size: 2rem;"></i>
                            <h5 class="card-title">Czytelnicy</h5>
                            <h3 class="card-text fw-bold">{{ stats.readers }}</h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 mb-3">
                    <div class="card h-100 text-center">
                        <div class="card-body">
                            <i class="bi bi-box-arrow-right text-warning mb-3" style="font-size: 2rem;"></i>
                            <h5 class="card-title">Aktualne wypożyczenia</h5>
                            <h3 class="card-text fw-bold">{{ stats.activeRentals }}</h3>
                        </div>
                    </div>
                </div>
            </div>
  
            <h2 class="mb-4">Ostatnie wypożyczenia</h2>
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Książka</th>
                            <th>Czytelnik</th>
                            <th>Data wypożyczenia</th>
                            <th>Status</th>
                            <th>Akcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="rental in recentRentals" :key="rental.id">
                            <td>{{ rental.id }}</td>
                            <td>{{ rental.bookTitle }}</td>
                            <td>{{ rental.readerName }}</td>
                            <td>{{ formatDate(rental.rentalDate) }}</td>
                            <td>
                                <span :class="getStatusClass(rental)">
                                    {{ rental.returnDate ? 'Zwrócona' : 'Wypożyczona' }}
                                </span>
                            </td>
                            <td>
                                <router-link :to="`/rentals/${rental.id}`" class="btn btn-sm btn-info me-2">
                                    <i class="bi bi-eye"></i>
                                </router-link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import booksService from '@/services/booksService'
import authorsService from '@/services/authorsService'
import readersService from '@/services/readersService'
import rentalsService from '@/services/rentalsService'

export default {
    name: 'Home',
    data() {
        return {
            stats: {
                books: 0,
                authors: 0,
                readers: 0,
                activeRentals: 0
            },
            recentRentals: []
        }
    },
    mounted() {
        this.loadStats()
        this.loadRecentRentals()
    },
    methods: {
        loadStats() {
            booksService.getAll()
                .then(response => {
                    this.stats.books = response.data.length
                })
                .catch(error => {
                    console.error('Error loading books stats:', error)
                })
            
            authorsService.getAll()
                .then(response => {
                    this.status.authors = response.data.length
                })
                .catch(error => {
                    console.error('Error loading authors stats:', error)
                })

            readersService.getAll()
                .then(response => {
                    this.stats.readers = response.data.length
                })
                .catch(error => {
                    console.error('Error loading readers stats:', error)
                })
            
            rentalsService.getAll()
                .then(response => {
                    this.status.activeRentals = response.data.filter(rental => !rental.returnDate).length
                })
                .catch(error => {
                    console.error('Error loading rentals stats:', error)
                })
        },
        loadRecentRentals() {
            rentalsService.getAll()
                .then(response => {
                    this.recentRentals = response.data
                        .sort((a, b) => new Date(b.rentalDate) - new Date(a.rentalDate))
                        .slice(0, 5)
                })
                .catch(error => {
                    console.error('Error loading recent rentals:', error)
                })
        },
        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString('pl-PL')
        },
        getStatusClass(rental) {
            return rental.returnDate ? 'badge bg-success' : 'badge bg-warning'
        }
    }
}
</script>

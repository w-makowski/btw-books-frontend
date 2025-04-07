<template>
    <div class="rentals-page">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h1>Rentals</h1>
            <router-link to="/rentals/add" class="btn btn-primary">
                <i class="bi bi-plus"></i> Add rental
            </router-link>
        </div>

        <LoadingSpinner v-if="loading" />
        <ErrorMessage v-else-if="error" :message="error" @retry="fetchRentals" />
        
        <ErrorModal
        v-if="modalError"
        :status="modalErrorStatus"
        :message="modalError"
        @close="handleErrorModalClose"
        />

        <div v-else>
            <RentalsList 
                :rentals="rentals" 
                @delete="confirmDelete"
            />

            <div class="d-flex justify-content-between align-items-center mt-3">
                <button @click="prevPage" :disabled="currentPage === 0">Previous</button>
                <span>Page {{ currentPage + 1 }}</span>
                <button @click="nextPage" :disabled="currentPage === totalPages - 1">Next</button>
            </div>
        </div>

        <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true" ref="deleteModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirm Delete</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" v-if="rentalToDelete">
                        <p>Are you sure you want to delete this rental: "{{ rentalToDelete.id }}"?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-danger" @click="deleteRental">Delete</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { Modal } from 'bootstrap'
import rentalsService from '@/services/rentalsService';
import booksService from '@/services/booksService';
import authorsService from '@/services/authorsService'
import readersService from '@/services/readersService';
import RentalsList from '@/components/rentals/RentalsList.vue'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import ErrorMessage from '@/components/shared/ErrorMessage.vue'
import ErrorModal from '@/components/shared/ErrorModal.vue'

export default {
    name: 'Books',
    components: {
        RentalsList,
        LoadingSpinner,
        ErrorMessage,
        ErrorModal
    },
    data() {
        return {
            rentals: [],
            loading: true,
            error: null,
            currentPage: 0,
            pageSize: 15,
            totalPages: 1,
            rentalToDelete: null,
            deleteModal: null,
            modalError: '',
            modalErrorStatus: ''
        };
    },
    methods: {
        handleErrorModalClose() {
            this.modalError = ''
            this.modalErrorStatus = ''
        },
        fetchRentals() {
            this.loading = true;
            this.error = null;

            rentalsService.getPage(this.currentPage, this.pageSize)
                .then(response => {
                    const rentals = response.data.rentals;

                    const enrichedRentalsPromises = rentals.map(rental => {
                        return booksService.get(rental.bookId)
                            .then(bookResponse => {
                                const book = bookResponse.data;
                                rental.bookTitle = book.title;

                                return authorsService.get(book.authorId)
                                    .then(authorResponse => {
                                        rental.bookAuthorName = authorResponse.data.name;
                                    })
                                    .catch(err => {
                                        console.error('Error loading author data:', err);
                                        rental.bookAuthorName = 'Unknown author';
                                    })
                                    .then(() => {
                                        return readersService.get(rental.readerId)
                                            .then(readerResponse => {
                                                rental.readerName = readerResponse.data.name;
                                            })
                                            .catch(err => {
                                                console.error('Error loading reader data:', err);
                                                rental.readerName = 'Unknown reader';
                                            });
                                    })
                                    .then(() => rental);
                            })
                            .catch(err => {
                                console.error('Error loading book data:', err);
                                rental.bookTitle = 'Unknown book';
                                rental.bookAuthorName = 'Unknown author';
                                rental.readerName = 'Unknown reader';
                                return rental;
                            });
                    });

                    return Promise.all(enrichedRentalsPromises)
                        .then(enrichedRentals => {
                            this.rentals = enrichedRentals;
                            this.totalPages = response.data.totalPages;
                            this.loading = false;
                            console.log('rentals:', this.rentals);
                        });
                })
                .catch(error => {
                    console.error('Error while loading rentals:', error);
                    this.error = "Couldn't laod rentals";
                    this.loading = false;
                });
        },
        nextPage() {
            if (this.currentPage < this.totalPages - 1) {
                this.currentPage++;
                this.fetchRentals();
            }
        },
        prevPage() {
            if (this.currentPage > 0) {
                this.currentPage--;
                this.fetchRentals();
            }
        },
        confirmDelete(rental) {
            this.rentalToDelete = rental

            if (!this.deleteModal) {
                this.deleteModal = new Modal(this.$refs.deleteModal)
            }

            this.deleteModal.show()
        },
        deleteRental() {
            if (!this.rentalToDelete) return

            rentalsService.delete(this.rentalToDelete.id)
                .then(() => {
                    this.deleteModal.hide()
                    this.rentalToDelete = null
                    this.fetchRentals()
                })
                .catch(error => {
                    console.error('Error deleting rental:', error)
                    this.deleteModal.hide()
                    const status = error?.response?.status
                    const message = error?.response?.data?.message || "Unexpected error"
                    const status2 = error?.response?.data?.status || 500

                    if (status === 404) {
                        this.$router.push({
                            name: 'ErrorPage',
                            query: {
                                message,
                                status2
                            }
                        })
                    } else {
                        this.modalError = message
                        this.modalErrorStatus = error?.response?.data?.status
                    }
                })
        }
    },
    mounted() {
        this.fetchRentals();
    }
}
</script>

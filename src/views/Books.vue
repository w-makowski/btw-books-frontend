<template>
    <div class="authors-page">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h1>Books</h1>
            <router-link to="/books/add" class="btn btn-primary">
                <i class="bi bi-plus"></i> Add book
            </router-link>
        </div>

        <LoadingSpinner v-if="loading" />
        <ErrorMessage v-else-if="error" :message="error" @retry="fetchBooks" />
        
        <div v-else>
            <BooksList 
                :books="books" 
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
                    <div class="modal-body" v-if="bookToDelete">
                        <p>Are you sure you want to delete this book: "{{ bookToDelete.title }}" by {{ bookToDelete.authorName }}?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-danger" @click="deleteBook">Delete</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { Modal } from 'bootstrap'
import booksService from '@/services/booksService';
import authorsService from '@/services/authorsService'
import BooksList from '@/components/books/BooksList.vue'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import ErrorMessage from '@/components/shared/ErrorMessage.vue'

export default {
    name: 'Books',
    components: {
        BooksList,
        LoadingSpinner,
        ErrorMessage
    },
    data() {
        return {
            books: [],
            loading: true,
            error: null,
            currentPage: 0,
            pageSize: 15,
            totalPages: 1,
            bookToDelete: null,
            deleteModal: null
        };
    },
    methods: {
        fetchBooks() {
            this.loading = true
            this.error = null

            booksService.getPage(this.currentPage, this.pageSize)
                .then(response => {
                    const tBooks = response.data.books
                    const booksPromises = tBooks.map((book) => {
                        return Promise.all([
                            authorsService.get(book.authorId)
                        ])
                        .then(([authorResponse]) => {
                            if (authorResponse.status === 200) {
                                book.authorName = authorResponse.data.name;
                            } else {
                                console.error(authorResponse)
                                console.error(`Author with ID ${book.authorId} not found`);
                                book.authorName = 'Unknown author';
                            }
                        })
                        .catch(error => {
                            console.error('Error loading author data:', error);
                        })
                    })
                    Promise.all(booksPromises)
                        .then(() => {
                            this.books = tBooks;
                            console.log('books:', this.books);
                        });

                    this.totalPages = response.data.totalPages;
                    this.loading = false
                })
                .catch(error => {
                    console.error('Error while loading books:', error);
                    this.error = "Couldn't load books"
                    this.loading = false
                });
        },
        nextPage() {
            if (this.currentPage < this.totalPages - 1) {
                this.currentPage++;
                this.fetchBooks();
            }
        },
        prevPage() {
            if (this.currentPage > 0) {
                this.currentPage--;
                this.fetchBooks();
            }
        },
        confirmDelete(book) {
            this.bookToDelete = book

            if (!this.deleteModal) {
                this.deleteModal = new Modal(this.$refs.deleteModal)
            }

            this.deleteModal.show()
        },
        deleteBook() {
            if (!this.bookToDelete) return

            booksService.delete(this.bookToDelete.id)
                .then(() => {
                    this.deleteModal.hide()
                    this.bookToDelete = null
                    this.fetchBooks()
                })
                .catch(error => {
                    console.error('Error deleting book:', error)
                    alert('Error occured while deleting book')
                })
        }
    },
    mounted() {
        this.fetchBooks();
    }
}
</script>

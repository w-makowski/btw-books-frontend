<template>
    <div class="authors-page">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h1>Authors</h1>
            <router-link to="/authors/add" class="btn btn-primary">
                <i class="bi bi-plus"></i> Add author
            </router-link>
        </div>

        <LoadingSpinner v-if="loading" />
        <ErrorMessage v-else-if="error" :message="error" @retry="fetchAuthors" />
        
        <div v-else>
            <AuthorsList 
                :authors="authors" 
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
                    <div class="modal-body" v-if="authorToDelete">
                        <p>Are you sure you want to delete this author: "{{ authorToDelete.name }}"?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-danger" @click="deleteAuthor">Delete</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { Modal } from 'bootstrap'
import authorsService from '@/services/authorsService';
import AuthorsList from '@/components/authors/AuthorsList.vue'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import ErrorMessage from '@/components/shared/ErrorMessage.vue'

export default {
    name: 'Authors',
    components: {
        AuthorsList,
        LoadingSpinner,
        ErrorMessage
    },
    data() {
        return {
            authors: [],
            loading: true,
            error: null,
            currentPage: 0,
            pageSize: 15,
            totalPages: 1,
            authorToDelete: null,
            deleteModal: null
        };
    },
    methods: {
        fetchAuthors() {
            this.loading = true
            this.error = null

            authorsService.getPage(this.currentPage, this.pageSize)
                .then(response => {
                    this.authors = response.data.authors;
                    this.totalPages = response.data.totalPages;
                    this.loading = false
                })
                .catch(error => {
                    console.error('Error while loading authors:', error);
                    this.error = "Couldn't load authors"
                    this.loading = false
                });
        },
        nextPage() {
            if (this.currentPage < this.totalPages - 1) {
                this.currentPage++;
                this.fetchAuthors();
            }
        },
        prevPage() {
            if (this.currentPage > 0) {
                this.currentPage--;
                this.fetchAuthors();
            }
        }, 
        confirmDelete(author) {
            this.authorToDelete = author

            if (!this.deleteModal) {
                this.deleteModal = new Modal(this.$refs.deleteModal)
            }

            this.deleteModal.show()
        },
        deleteAuthor() {
            if (!this.authorToDelete) return

            authorsService.delete(this.authorToDelete.id)
                .then(() => {
                    this.deleteModal.hide()
                    this.authorToDelete = null
                    this.fetchAuthors()
                })
                .catch(error => {
                    console.error('Error deleting author:', error)
                    alert('Error occured while deleting author')
                })
        }
    },
    mounted() {
        this.fetchAuthors();
    }
}
</script>

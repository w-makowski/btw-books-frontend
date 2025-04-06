<template>
    <div class="readers-page">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h1>Readers</h1>
            <router-link to="/readers/add" class="btn btn-primary">
                <i class="bi bi-plus"></i> Add reader
            </router-link>
        </div>

        <LoadingSpinner v-if="loading" />
        <ErrorMessage v-else-if="error" :message="error" @retry="fetchReaders" />
        
        <div v-else>
            <ReadersList 
                :readers="readers" 
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
                    <div class="modal-body" v-if="readerToDelete">
                        <p>Are you sure you want to delete this reader: "{{ readerToDelete.name }}"?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-danger" @click="deleteReader">Delete</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { Modal } from 'bootstrap'
import readersService from '@/services/readersService';
import ReadersList from '@/components/readers/ReadersList.vue'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import ErrorMessage from '@/components/shared/ErrorMessage.vue'

export default {
    name: 'Readers',
    components: {
        ReadersList,
        LoadingSpinner,
        ErrorMessage
    },
    data() {
        return {
            readers: [],
            loading: true,
            error: null,
            currentPage: 0,
            pageSize: 15,
            totalPages: 1,
            readerToDelete: null,
            deleteModal: null
        };
    },
    methods: {
        fetchReaders() {
            this.loading = true
            this.error = null

            readersService.getPage(this.currentPage, this.pageSize)
                .then(response => {
                    this.readers = response.data.readers;
                    this.totalPages = response.data.totalPages;
                    this.loading = false
                })
                .catch(error => {
                    console.error('Error while loading readers:', error);
                    this.error = "Couldn't load readers"
                    this.loading = false
                });
        },
        nextPage() {
            if (this.currentPage < this.totalPages - 1) {
                this.currentPage++;
                this.fetchReaders();
            }
        },
        prevPage() {
            if (this.currentPage > 0) {
                this.currentPage--;
                this.fetchReaders();
            }
        }, 
        confirmDelete(reader) {
            this.readerToDelete = reader

            if (!this.deleteModal) {
                this.deleteModal = new Modal(this.$refs.deleteModal)
            }

            this.deleteModal.show()
        },
        deleteReader() {
            if (!this.readerToDelete) return

            readersService.delete(this.readerToDelete.id)
                .then(() => {
                    this.deleteModal.hide()
                    this.readerToDelete = null
                    this.fetchReaders()
                })
                .catch(error => {
                    console.error('Error deleting reader:', error)
                    alert('Error occured while deleting reader')
                })
        }
    },
    mounted() {
        this.fetchReaders();
    }
}
</script>

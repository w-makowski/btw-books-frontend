<template>
    <div class="authors-list">
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Book</th>
                        <th>Reader</th>
                        <th>Rental Date</th>
                        <th>Return Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="rental in rentals" :key="rental.id">
                        <td> {{ rental.id }}</td>
                        <td>{{ rental.bookTitle }} ({{ rental.bookAuthorName }})</td>
                        <td>{{ rental.readerName }}</td>
                        <td>{{ rental.rentalDate }}</td>
                        <td>{{ rental.returnDate }}</td>
                        <td>
                            <div class="btn-group btn-group-sm">
                                <router-link :to="`/rentals/${rental.id}`" class="btn btn-info">
                                    <i class="bi bi-eye"></i>
                                </router-link>
                                <router-link :to="`/rentals/edit/${rental.id}`" class="btn btn-warning">
                                    <i class="bi bi-pencil"></i>
                                </router-link>
                                <button @click="$emit('delete', rental)" class="btn btn-danger">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="rentals.length === 0">
                        <td colspan="7" class="text-center py-3">
                            No rentals to display
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
    </div>
</template>

<script>
export default {
    name: 'RentalsList',
    props: {
        rentals: {
            type: Array,
            required: true
        }
    }
}
</script>

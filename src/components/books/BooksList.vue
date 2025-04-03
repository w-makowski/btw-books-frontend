<template>
    <div class="authors-list">
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Pages</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="book in books" :key="book.id">
                        <td> {{ book.id }}</td>
                        <td>{{ book.title }}</td>
                        <td>{{ book.authorName }}</td>
                        <td>{{ book.pages }}</td>
                        <td>
                            <div class="btn-group btn-group-sm">
                                <router-link :to="`/books/${book.id}`" class="btn btn-info">
                                    <i class="bi bi-eye"></i>
                                </router-link>
                                <router-link :to="`/books/edit/${book.id}`" class="btn btn-warning">
                                    <i class="bi bi-pencil"></i>
                                </router-link>
                                <button @click="$emit('delete', book)" class="btn btn-danger">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="books.length === 0">
                        <td colspan="7" class="text-center py-3">
                            No books to display
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
    </div>
</template>

<script>
export default {
    name: 'BooksList',
    props: {
        books: {
            type: Array,
            required: true
        }
    }
}
</script>

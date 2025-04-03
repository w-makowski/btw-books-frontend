<template>
    <div class="authors-list">
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="author in authors" :key="author.id">
                        <td> {{ author.id }}</td>
                        <td>{{ author.name }}</td>
                        <td>
                            <div class="btn-group btn-group-sm">
                                <router-link :to="`/authors/${author.id}`" class="btn btn-info">
                                    <i class="bi bi-eye"></i>
                                </router-link>
                                <router-link :to="`/authors/edit/${author.id}`" class="btn btn-warning">
                                    <i class="bi bi-pencil"></i>
                                </router-link>
                                <button @click="$emit('delete', author)" class="btn btn-danger">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="authors.length === 0">
                        <td colspan="7" class="text-center py-3">
                            No authors to display
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
    </div>
</template>

<script>
export default {
    name: 'AuthorsList',
    props: {
        authors: {
            type: Array,
            required: true
        }
    }
}
</script>

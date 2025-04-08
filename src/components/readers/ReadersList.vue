<template>
    <div class="readers-list">
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="reader in readers" :key="readers.id">
                        <td> {{ reader.id }}</td>
                        <td>{{ reader.name }}</td>
                        <td>
                            <div class="btn-group btn-group-sm">
                                <router-link :to="`/readers/${reader.id}`" class="btn btn-info">
                                    <i class="bi bi-eye">details</i>
                                </router-link>
                                <router-link :to="`/readers/edit/${reader.id}`" class="btn btn-warning">
                                    <i class="bi bi-pencil">edit</i>
                                </router-link>
                                <button @click="$emit('delete', reader)" class="btn btn-danger">
                                    <i class="bi bi-trash">delete</i>
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="readers.length === 0">
                        <td colspan="7" class="text-center py-3">
                            No readers to display
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
    </div>
</template>

<script>
export default {
    name: 'ReadersList',
    props: {
        readers: {
            type: Array,
            required: true
        }
    }
}
</script>

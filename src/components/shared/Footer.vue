<template>
    <footer class="bg-light py-3 mt-5">
        <div class="container text-center text-muted">
        <p class="mb-0">© {{ currentYear }} Library System. All rigths reserved.</p>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'Footer',
    computed: {
        currentYear() {
        return new Date().getFullYear()
        }
    }
}
</script>

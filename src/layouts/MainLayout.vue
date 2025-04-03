<template>
    <div class="main-layout d-flex flex-column min-vh-100">
        <Navbar />
        <div class="container py-4">
            <router-view />
        </div>
        <Footer />
    </div>
</template>

<script>
import Navbar from '@/components/shared/Navbar.vue'
import Footer from '@/components/shared/Footer.vue'

export default {
    name: 'MainLayout',
    components: {
        Navbar,
        Footer
    }
}
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
}

.container {
  flex: 1;
}
</style>

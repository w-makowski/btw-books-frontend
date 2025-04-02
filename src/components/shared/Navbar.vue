<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
            <router-link class="navbar-brand" to="/">
                <i class="bi bi-book me-2"></i>
                Library System
            </router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" 
              data-bs-target="#navbarNav" aria-controls="navbarNav" 
              aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                <li class="nav-item">
                    <router-link class="nav-link" to="/" active-class="active">
                    Home Page
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/books" active-class="active">
                    Books
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/authors" active-class="active">
                    Authors
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/readers" active-class="active">
                    Readers
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/rentals" active-class="active">
                    Rentals
                    </router-link>
                </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'Navbar'
}
</script>

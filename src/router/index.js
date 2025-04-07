import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const routes = [
    {
        path: '/',
        component: MainLayout,
        children: [
            {
                path: '',
                name: 'Home',
                component: () => import('@/views/Home.vue')
            },
            {
                path: '/books',
                name: 'Books',
                component: () => import('@/views/Books.vue')
            },
            {
                path: '/books/add',
                name: 'AddBook',
                component: () => import('@/components/books/BookForm.vue')
            },
            {
                path: '/books/edit/:id',
                name: 'EditBook',
                component: () => import('@/components/books/BookForm.vue'),
                props: route => ({ id: parseInt(route.params.id) })
            },
            {
                path: '/books/:id',
                name: 'BookDetails',
                component: () => import('@/components/books/BookDetails.vue'),
                props: route => ({ id: parseInt(route.params.id) })
            },
            {
                path: '/authors',
                name: 'Authors',
                component: () => import('@/views/Authors.vue')
            },
            {
                path: '/authors/add',
                name: 'AddAuthor',
                component: () => import('@/components/authors/AuthorForm.vue')
            },
            {
                path: '/authors/edit/:id',
                name: 'EditAuthor',
                component: () => import('@/components/authors/AuthorForm.vue'),
                props: route => ({ id: parseInt(route.params.id) })
            },
            {
                path: '/authors/:id',
                name: 'AuthorDetails',
                component: () => import('@/components/authors/AuthorDetails.vue'),
                props: route => ({ id: parseInt(route.params.id) })
            },
            {
                path: '/readers',
                name: 'Readers',
                component: () => import('@/views/Readers.vue')
            },
            {
                path: '/readers/add',
                name: 'AddReader',
                component: () => import('@/components/readers/ReaderForm.vue')
            },
            {
                path: '/readers/edit/:id',
                name: 'EditReader',
                component: () => import('@/components/readers/ReaderForm.vue'),
                props: route => ({ id: parseInt(route.params.id) })
            },
            {
                path: '/readers/:id',
                name: 'ReaderDetails',
                component: () => import('@/components/readers/ReaderDetails.vue'),
                props: route => ({ id: parseInt(route.params.id) })
            },
            {
                path: '/rentals',
                name: 'Rentals',
                component: () => import('@/views/Rentals.vue')
            },
            {
                path: '/rentals/add',
                name: 'AddRental',
                component: () => import('@/components/rentals/RentalForm.vue')
            },
            {
                path: '/rentals/edit/:id',
                name: 'EditRental',
                component: () => import('@/components/rentals/RentalForm.vue'),
                props: route => ({ id: parseInt(route.params.id) })
            },
            {
                path: '/rentals/:id',
                name: 'RentalDetails',
                component: () => import('@/components/rentals/RentalDetails.vue'),
                props: route => ({ id: parseInt(route.params.id) })
            },
            {
                path: '/error',
                name: 'ErrorPage',
                component: () => import('@/views/NotFound.vue'),
                props: route => ({
                  message: route.query.message,
                  status: route.query.status
                })
              }
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    linkActiveClass: 'active'
})

export default router

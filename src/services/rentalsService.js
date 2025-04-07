import api from './api'

export default {
    getAll() {
        return api.get('/rentals/get/rentals')
    },
    getPage(page = 0, size = 15) {
        return api.get(`/rentals/get/rentals?page=${page}&size=${size}`);
    },
    get(id) {
        return api.get(`/rentals/get/rental/${id}`)
    },
    create(rental) {
        return api.post('/rentals/rent/book', rental)
    },
    update(id, rental) {
        return api.put(`/rentals/update/rental/${id}`, rental)
    },
    delete(id) {
        return api.delete(`/rentals/delete/rental/${id}`)
    },
    returnBook(id) {
        return api.put(`/rentals/return/book/${id}`)
    }
}

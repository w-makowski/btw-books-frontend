import api from './api'

export default {
    getAll() {
        return api.get('/reantals/get/rentals')
    },
    get(id) {
        return api.get(`/rentals/get/rental/${id}`)
    },
    create(rental) {
        return api.post('/rentals/add/rental', rental)
    },
    update(id, rental) {
        return api.put(`/rentals/update/rental/${id}`, rental)
    },
    delete(id) {
        return api.delete(`/rentals/delete/rental/${id}`)
    }
}

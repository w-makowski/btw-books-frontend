import api from './api'

export default {
    getAll() {
        return api.get('/readers')
    },
    getPage(page = 0, size = 15) {
        return api.get(`/readers/get/readers?page=${page}&size=${size}`);
    },
    get(id) {
        return api.get(`/readers/get/reader/${id}`)
    },
    create(reader) {
        return api.post('/readers/add/reader', reader)
    },
    update(id, reader) {
        return api.put(`/readers/update/reader/${id}`, reader)
    },
    delete(id) {
        return api.delete(`/readers/delete/reader/${id}`)
    },
    getRentals(id){
        return api.get(`/readers/get/reader/${id}/rentals`)
    }
}

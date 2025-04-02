import api from './api'

export default {
    getAll() {
        return api.get('/authors')
    },
    get(id) {
        return api.get(`/authors/${id}`)
    },
    create(author) {
        return api.post('/authors/add/author', author)
    },
    update(id, author) {
        return api.put(`/authors/update/author/${id}`, author)
    },
    delete(id) {
        return api.delete(`/authors/delete/author/${id}`)
    }
}

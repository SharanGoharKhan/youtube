class ApiResponse {
    constructor() {
        this.status = false
        this.message = ''
        this.data = {}
    }
    success(data = {}, message = '') {
        this.status = true
        this.data = data
        this.message = message
        return this
    }
    failure(data = {}, message = '') {
        this.status = false
        this.data = data
        this.message = message
        return this
    }
}



module.exports = ApiResponse


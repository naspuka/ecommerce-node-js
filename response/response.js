class Response{
    constructor(res){
        this.res = res;
    }
    error_res(error, code){
        return this.res.status(code).json({
            error: true,
            message: error.message
        })
    }
}

module.exports = Response;
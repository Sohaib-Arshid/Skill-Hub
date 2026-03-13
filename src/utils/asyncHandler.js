const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise
            .resolve(requestHandler(req, res, next))
            .catch((err) => {
                res.status(err.statusCode || 500).json({
                    message: err.message || "Something went wrong"
                })
            })
    }
}

export default asyncHandler
module.exports = function(res,status=404,message){
    // res.setHeader("Content-Type","application/json")
    res.status(status).json(message)
}


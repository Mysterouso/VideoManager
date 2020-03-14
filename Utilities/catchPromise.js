module.exports = function(fn,...params){
    return fn(...params).catch(e=>console.log(e))
}
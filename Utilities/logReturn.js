module.exports = function(fn,...params){
    const result = fn(...params)
    console.log(result)
    return result
}
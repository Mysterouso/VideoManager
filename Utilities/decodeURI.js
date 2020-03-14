module.exports = function(videoName){
    let decodedName;
    try{
        decodedName = decodeURIComponent(videoName)
    }
    catch(e){
        console.log("ERROR occured while decoding", e)
        decodedName = videoName
    }
    return decodedName
}
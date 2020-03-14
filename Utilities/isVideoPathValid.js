const fs = require('fs');
const path = require('path')

module.exports = function(videoNameWithExt){
    const videoPath = process.env.VIDEO_PATH || path.resolve(__dirname,`../Videos/${encodeURIComponent(videoNameWithExt)}`)
    if(!fs.existsSync(videoPath)){ 
        return {isValid:false}
    }
    return {isValid:true,videoPath}
}

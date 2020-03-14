const fs = require('fs');
const path = require('path')


class Library{
    constructor(libPath = path.resolve(__dirname,'../Videos')){
        this.path = libPath
        this.videos = []
    }

    loadVideoList(){
        this.videos = fs.readdirSync(path)
        return this.videos
    }

    seeAvailableVideos(){
        return this.videos
    }

    getFullVideoDetails(){
        
    }

    //file name must include extension
    streamToClient(writeStream,decodedFileName){

        const videoPath = path.resolve(this.path,encodeURIComponent(decodedFileName))
        const readStream = fs.createReadStream(videoPath)
        // This will wait until we know the readable stream is actually valid before piping
        readStream.on('open', function () {
            // This just pipes the read stream to the response object (which goes to the client)
            res.setHeader("Content-Type", "application/octet-stream")
            readStream.pipe(writeStream);
        });
    
        // This catches any errors that happen while creating the readable stream (usually invalid names)
        readStream.on('error', function(err) {
            throw Error(err)
        })
    }
}

module.exports = Library
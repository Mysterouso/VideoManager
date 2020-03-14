const fs = require('fs')

module.exports = function(res,videoPath){
    const readStream = fs.createReadStream(videoPath)
    // This will wait until we know the readable stream is actually valid before piping
    readStream.on('open', function () {
        // This just pipes the read stream to the response object (which goes to the client)
        const contentLength = fs.statSync(videoPath)
        res.setHeader("Content-Length",contentLength.size)
        res.setHeader("Content-Type", "application/octet-stream")
        readStream.pipe(res);
    });

    // This catches any errors that happen while creating the readable stream (usually invalid names)
    readStream.on('error', function(err) {
    throw Error(err)
    })
}
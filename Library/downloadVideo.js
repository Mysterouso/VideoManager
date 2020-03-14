const ytdl = require('ytdl-core');
const fs = require('fs')
const path = require('path')
const testURL = require('../testURL')

module.exports = async function(url){
    let stream = ytdl(url)

    return new Promise((resolve,reject)=>{
        let videoTitle;
        stream.on('info', (info) => {
            videoTitle = info.player_response.videoDetails.title
            let writeableStream = fs.createWriteStream(path.resolve(__dirname,`../Videos/${encodeURIComponent(videoTitle)}.mp4`))
            stream.pipe(writeableStream).on('finish',()=>resolve(videoTitle))
        });
    })
}

// module.exports(testURL)
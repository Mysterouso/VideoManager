const router = require('express').Router()
const { catchPromise, sendError,isVideoPathValid,logReturnValue } = require('../Utilities')
const { streamFromLibrary, downloadVideo } = require('../Library')
const { retrieveVideoByUrl } = require('../SQL/libraryHandler')
const makeQuery = require('../db')
const { getURLVideoID } = require('ytdl-core')

router.post('/', async (req, res) =>{
    const {url,name} = req.body
    if(url){
        console.log("URL ROUTE")
        let videoID;
        videoID = getURLVideoID(url)
        if(typeof videoID != "string"){
            return sendError(res,404,{success:false,message:"Invalid video URL"})
        }
        // try{
        // }
        // catch(e){
        //     if(e.message){
        //         console.log(e.message)
        //         return sendError(res,400,{success:false,message:e.message})
        //     }
        //     else{
        //         return sendError(res,400,{success:false,message:"Please provide a valid youtube URL"})
        //     }
        // }
        //save to db
        // save video to videos dir
        const rows = await retrieveVideoByUrl(videoID)
        if(rows != null && rows.length > 0){
            console.log("Existing")
            const validVideo = logReturnValue(isVideoPathValid,`${rows[0].video_name}.mp4`)
            if(!validVideo.isValid){ 
                return sendError(res,404,{success:false,message:"File does not exist"})
            }
            streamFromLibrary(res,validVideo.videoPath)
        }
        else{
            // Refactor to move SQL insert logic to libraryHandler
            console.log("Inserting")
            const videoTitle = await catchPromise(downloadVideo,url)
            const query = `INSERT INTO video_information (video_name,video_url) VALUES ($1,$2)`
            const params = [videoTitle,videoID]
            const validVideo = logReturnValue(isVideoPathValid,`${videoTitle}.mp4`)
            if(!validVideo.isValid){ 
                return sendError(res,404,{success:false,message:"File does not exist"})
            }
            await catchPromise(makeQuery,params,query)
            streamFromLibrary(res,validVideo.videoPath)
        }

    }
    else if(name){
        console.log("NAME ROUTE",name)
        const validVideo = isVideoPathValid(`${name}.mp4`)
        console.log("VALID", validVideo)
        if(!validVideo.isValid){ 
            return sendError(res,404,{success:false,message:"File does not exist"})
        }
        streamFromLibrary(res,validVideo.videoPath)
    }
})

module.exports = router
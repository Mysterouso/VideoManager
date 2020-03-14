const router = require('express').Router()
const { viewLibrary : showVideoArr } = require('../Library')
const { retrieveVideoList } = require('../SQL/libraryHandler')
const { decodeURI } = require('../Utilities')

router.get('/', async (req,res)=>{
    const videoArr = showVideoArr()
    const decodedVideoArr = videoArr.map(i=>{
        const videoName = decodeURI(i)
        // Should check for if indexOF mp4 is at end to confirm that the .mp4 is not a part of filename
        if(videoName.indexOf(".mp4") != -1){
            return videoName.slice(0, videoName.length - 4)
        }
        else{
            return videoName
        }
    })
    const videosInfo = await retrieveVideoList(decodedVideoArr)
    res.json({
        list:videosInfo
    })
})

module.exports = router
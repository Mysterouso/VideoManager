const makeQuery = require('../db')

async function retrieveVideoByUrl(videoURLID){
    const retrieveQuery = `SELECT * FROM video_information where video_url = $1`
    const rows = await makeQuery([videoURLID],retrieveQuery)
    if(rows.length>0){
        return rows
    }
    return null
}

async function retrieveVideoList(videoNameNoExtArr){
    const partialretrieveQuery = `SELECT * FROM video_information where video_name in (`
    const parameters = videoNameNoExtArr.map((_,i)=>`$${i + 1}`).join(',') + ")"
    const retrieveQuery = partialretrieveQuery + parameters
    return makeQuery(videoNameNoExtArr,retrieveQuery)
}

async function insertQuery(){

}

// retrieveVideoList(process.env.TEST_RETRIEVE_LIST)

module.exports = {
    retrieveVideoByUrl,
    retrieveVideoList,
    insertQuery
}


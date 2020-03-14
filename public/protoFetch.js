function fetchVideo(url,name){
    return fetch("/download",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({url,name})
    })
    .then(determineResponse)
    .then(response =>response.blob())
    .then(blob =>{
        blob = new Blob([blob],{type:"video/mp4"})
        const url = URL.createObjectURL(blob);
        // window.location.href = url
        console.log(url)
        return url
    })
    .catch(err => {
        if(err.client){
            console.log(err.client)
        }
        else{
            console.error(err)
        }
    })



    async function determineResponse(response){
        const applicationJSON = "application/json"
        const applicationOctetStream = "application/octet-stream"
        const contentType = response.headers.get("Content-Type").split(";")[0]
        console.log("CONTENT TYPE BEING SENT", contentType)
        if(contentType === applicationOctetStream){
            return response
        }
        else if(contentType === applicationJSON){
            const responseError = await response.json()
            const errObj = {client:"File not found in the library",server:responseError}
            console.log(errObj)
            return Promise.reject(errObj)
        }
        else{
            return Promise.reject({client:"No Content Type provided"})
        }
    }
}


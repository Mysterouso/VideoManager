document.querySelector(".video-list").addEventListener("click",(e)=>console.log(e))//e.target.firstElementChild.textContent))
pubsub.subscribe("videolist-loaded",renderVideoList)
pubsub.subscribe("videolist-loaded",addRedirectListener)

;(async function pullVideoList(){
    let tempVideos;
    const data = await fetch("/api")
                .then(item=>item.json())
                .then(data=>{
                    // console.log(JSON.stringify(data));
                    return data.list;
                })
                .catch(error=>console.log(error))
    tempVideos = data;
    if(!tempVideos){
        tempVideos =  [
                        {
                            video_name:"Video 1",
                            video_url:"Details 1"
                        },
                        {
                            video_name:"Video 2",
                            video_url:"Details 2"
                        },
                        {
                            video_name:"Video 3",
                            video_url:"Details 3"
                        }
                    ]
    }
    pubsub.emit("videolist-loaded",tempVideos)
})()

function produceTemplateHtml(obj){
    return `<li class="video-info">
                <p class="video-name">${obj.video_name}</p>
                <p class="video-details">${obj.video_url}</p>
            </li>`
}

function renderVideoList(objArray){
    let htmlToAppend = ""
    objArray.forEach(item=>htmlToAppend+=produceTemplateHtml(item))
    document.querySelector(".video-list").innerHTML = htmlToAppend;
}

function addRedirectListener(){
    videoList = document.querySelector(".video-list").addEventListener("click",(e)=>{
        if(e.target.classList.contains("video-info")){
            setCookie("name",e.target.children[0].textContent,5)
        }
        else if(e.target.classList.contains("video-details")){
            setCookie("name",e.target.previousElementSibling.textContent,5)
        }
        else{
            setCookie("name",e.target.textContent,5)
        }
        window.location.href = "/noncompatible.html"
    })
}

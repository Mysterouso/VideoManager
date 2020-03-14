function Pubsub(){
    this.list = {}

    this.subscribe = function (event,fn){
                        if(!this.list[event]){
                            this.list[event] = []
                        }
                        this.list[event].push(fn)
                    }
    this.emit = function (event,data){
        if(!this.list[event]){
            return
        }
        this.list[event].forEach(fn=>fn(data))
    }
}

function setCookie(name, value, minutes) {
    var expires = "";
    if (minutes) {
      var date = new Date();
      date.setTime(date.getTime() + (minutes * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }
  
  function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

const pubsub = new Pubsub()

if(document.getElementById("urlBtn")){
    const urlButton = document.getElementById("urlBtn")
    const input = document.getElementById("urlInput")
    const noClick = document.getElementById("noclick")

    urlButton.addEventListener("click",postUrl)
    urlButton.addEventListener("click",(e)=>{
        setTimeout(()=>{
            noClick.style.display = "block"
            updateHref(e)    
        },3000)         
    })
    // document.getElementById("noclick").addEventListener("click",(e)=>{console.log(hi);fetchVideoByRedirect(e)}) 
    // input.addEventListener("input",updateHref)

    function updateHref(){
        document.cookie = "resetcookie=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        setCookie("url",input.value,3)
        noClick.href = `/noncompatible.html`
    }
}

const link = document.querySelector("#videolink")

function postUrl(e){
    e.preventDefault()
    let url = e.target.previousElementSibling.value
    if(!url.length) return alert("Please enter a url")
    //insert Regex to check if valid url
    fetchVideo(url)
    .then(url=>{
        link.style.display = "block"
        link.href = url;
        link.download="video.mp4";
    })
}

function fetchVideo(url,name,progressFn){

    return fetchVideoWithProgress(url,name,progressFn)

    function fetchVideoWithProgress(url,name,fn){
        return fetch("/download",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({url,name})
        })
        .then(determineResponse)
        .then(async (response) => {
            const reader = response.body.getReader()
            console.log(response)
            const contentLength = response.headers.get("Content-Length")
            let receivedLength = 0; 
            let chunks = [];
            while(true) {
                const {done, value} = await reader.read();

                if (done) {
                    break;
                }

                chunks.push(value);
                receivedLength += value.length;

                console.log(`Received ${receivedLength} of ${contentLength}`)
                
                if(fn){
                    fn(receivedLength,contentLength)
                }
            }
            const blob = new Blob([chunks],{type:"video/mp4"})
            const url = URL.createObjectURL(blob);
            // window.location.href = url
            console.log("URL",url)
            return url
        })
        .catch(err=>console.log(err))
    }

    function defaultVideoFetch(url,name){
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
    }

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

/* GET 
getComputedStyle(document.documentElement)
.getPropertyValue('--my-variable-name')
*/
/* SET document.documentElement.style
.setProperty('--my-variable-name', 'pink')
*/
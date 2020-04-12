window.addEventListener('DOMContentLoaded', (event) => {

    let url,path;

    const h1 = document.createElement("h1")
    h1.style.color="white"
    h1.style.background="red"
    document.body.appendChild(h1)

    pubsub.subscribe("downloadLoaded", renderDownloadedHtml)

    if(!!getCookie("url")){
        url = getCookie("url")
        console.log("url -- ",url)
    }
    else if (!!getCookie("name")){
        path = getCookie("name")
        console.log("name --",path)
    }
    else throw Error("no parameter supplied - please check if cookies are not disabled")

    fetchVideo(url,path,updateLoadingBar)
    .then(url=>{
        // pubsub.emit("downloadLoaded")
        const el = document.createElement("a")
        el.setAttribute("href",url)
        el.setAttribute("download","test.mp4")
        document.body.appendChild(el)
        // URL.revokeObjectURL(url)
        setTimeout(()=>el.click(),5000)
        h1.innerText = url
        return Promise.resolve()
    })
    .then(
        document.cookie = "resetcookie=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    )

    function updateLoadingBar(curr,total){
        h1.innerText = `${curr} of ${total}`

        if(!document.querySelector("loading-bar")) console.log("Doesnt exist")
        let percent = Math.floor((curr/total)*100)
        if(percent >= 100){
            percent = 100
        }
        console.log("PERCENTAGE",percent)

        document.documentElement.style
        .setProperty('--progress', `calc(${percent}% - (2 * var(--loading-bar-offset)))`)
    }

    /* GET 
    getComputedStyle(document.documentElement)
    .getPropertyValue('--my-variable-name')
    */
    /* SET document.documentElement.style
    .setProperty('--my-variable-name', 'pink')
    */
});

function renderDownloadedHtml(){
    document.documentElement.style.backgroundColor = "blue";
}
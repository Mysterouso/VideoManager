window.addEventListener('DOMContentLoaded', (event) => {

    let url,path;

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
        const el = document.createElement("a")
        document.body.style.backgroundColor="blue"
        el.setAttribute("href",url)
        el.setAttribute("download","test.mp4")
        document.body.appendChild(el)
        // URL.revokeObjectURL(url)
        el.click()
        return Promise.resolve()
    })
    .then(
        document.cookie = "resetcookie=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    )

    function updateLoadingBar(curr,total){
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
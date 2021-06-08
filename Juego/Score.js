function main(){
    const url = new URL(window.location.href);
    const score = url.searchParams.get("score");
    console.log(score);
    const scoreRef = document.getElementById("scoreText");
    const highRef = document.getElementById("highText");
    
    var scoreCookie = getCookie("score");

    if (scoreCookie == null){
        document.cookie = "score = " + score;
    }else{
        if (score > scoreCookie){
            document.cookie = "score = " + score;
            highRef.innerHTML = scoreCookie;
            const congratulation = document.getElementById("congratulations");
            congratulation.innerHTML = "Congratulations new Highscore";
        }else{
            highRef.innerHTML = scoreCookie;
        }
    }

    scoreRef.innerHTML = score;
}


function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else
    {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
        end = dc.length;
        }
    }
    // because unescape has been deprecated, replaced with decodeURI
    //return unescape(dc.substring(begin + prefix.length, end));
    return decodeURI(dc.substring(begin + prefix.length, end));
} 

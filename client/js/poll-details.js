const pollCheck = document.getElementsByClassName('pollCheck');
const pollAnswer = document.getElementsByClassName('pollAnswer');
const pollGroup = document.getElementById('pollGroup');
const likeButton = document.getElementById("likeButton")

//Server request if user liked poll already
const userLikedPoll = () => {
    const http = new XMLHttpRequest();
    http.open("GET", "/polls/likes", true);
    http.send();
    http.onreadystatechange = () => {
        if (http.readyState === 4 && http.responseText === 'Already liked poll') {
            likeButton.style.cssText = 'background-color: #156ea8; color: white; opacity: .5; cursor: default;';
        }
    };
}

//Server request for likes
likeButton.addEventListener("click",
    () => {
        const http = new XMLHttpRequest();
        http.open("POST", '/polls/likes', true);
        http.send();
        http.onreadystatechange = () => {
            if (http.readyState === 4 && http.responseText !== 'Login or register to like polls') {
                likeButton.style.cssText = 'background-color: #156ea8; color: white; opacity: .5; cursor: default;';
            } else if (http.readyState === 4 && http.responseText === 'Login or register to like polls') {
                alert("You are not logged in")
            }
        };
    }
);

//add border on checked item
pollGroup.addEventListener('click', (e) => {
    for (let i = 0; i < pollAnswer.length; i++) {
        pollAnswer[i].style.borderLeft = "1px solid #4C4F54";
    }
    if (e.target.checked) {
        e.target.parentNode.style.borderLeft = "10px solid rgb(66, 171, 158)";
    }
});
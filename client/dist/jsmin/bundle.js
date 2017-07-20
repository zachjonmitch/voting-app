'use strict';

var CHART = document.getElementById('myChart');
Chart.defaults.scale.ticks.beginAtZero = true;

var getDefaultChart = function getDefaultChart() {
    var doughnutChart = new Chart(CHART, {
        type: 'doughnut',
        data: {
            datasets: [{
                label: 'Points',
                backgroundColor: ['#754373', '#d03b3d', '#16a085', '#2980b9', '#ffd300', '#ffd300'],
                data: [10, 30, 9, 15, 22]
            }],
            labels: ["Purple", "Red", "Green", "Blue", "Yellow"]
        },
        options: {
            cutoutPercentage: 60,
            responsive: false
        }
    });
};

//Server request for Chart.js answers from Mongodb
var getPollAnswers = function getPollAnswers() {
    var http = new XMLHttpRequest();
    http.open("GET", "/polls/answers", true);
    http.send();
    http.onreadystatechange = function () {
        if (http.readyState === 4) {
            var answers = JSON.parse(http.responseText);

            var doughnutChart = new Chart(CHART, {
                type: 'doughnut',
                data: {
                    datasets: [{
                        label: 'Points',
                        backgroundColor: ['#754373', '#d03b3d', '#16a085', '#2980b9', '#ffd300', '#ffd300'],
                        data: answers.map(function (answer) {
                            return answer.total;
                        })
                    }],
                    labels: answers.map(function (answer) {
                        return answer._id;
                    })
                },
                options: {
                    cutoutPercentage: 60,
                    responsive: false
                }
            });
        }
    };
};
'use strict';

var pollCheck = document.getElementsByClassName('pollCheck');
var pollAnswer = document.getElementsByClassName('pollAnswer');
var pollGroup = document.getElementById('pollGroup');
var likeButton = document.getElementById("likeButton");

//Server request if user liked poll already
var userLikedPoll = function userLikedPoll() {
    var http = new XMLHttpRequest();
    http.open("GET", "/polls/likes", true);
    http.send();
    http.onreadystatechange = function () {
        if (http.readyState === 4 && http.responseText === 'Already liked poll') {
            likeButton.style.cssText = 'background-color: #156ea8; color: white; opacity: .5; cursor: default;';
        }
    };
};

//Server request for likes
likeButton.addEventListener("click", function () {
    var http = new XMLHttpRequest();
    http.open("POST", '/polls/likes', true);
    http.send();
    http.onreadystatechange = function () {
        if (http.readyState === 4 && http.responseText !== 'Login or register to like polls') {
            likeButton.style.cssText = 'background-color: #156ea8; color: white; opacity: .5; cursor: default;';
        } else if (http.readyState === 4 && http.responseText === 'Login or register to like polls') {
            alert("You are not logged in");
        }
    };
});

//add border on checked item
pollGroup.addEventListener('click', function (e) {
    for (var i = 0; i < pollAnswer.length; i++) {
        pollAnswer[i].style.borderLeft = "1px solid #4C4F54";
    }
    if (e.target.checked) {
        e.target.parentNode.style.borderLeft = "10px solid rgb(66, 171, 158)";
    }
});

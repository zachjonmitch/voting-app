const CHART = document.getElementById('myChart');
Chart.defaults.scale.ticks.beginAtZero = true;

const getDefaultChart = () => {
    let doughnutChart = new Chart(CHART, {
        type: 'doughnut',
        data: {
            datasets: [
                {
                    label: 'Points',
                    backgroundColor: ['#754373', '#d03b3d', '#16a085', '#2980b9', '#ffd300', '#ffd300'],
                    data: [10, 30, 9, 15, 22]
                }
            ],
            labels: ["Purple", "Red", "Green", "Blue", "Yellow"]
        },
        options: {
                cutoutPercentage: 60,
                responsive: false
        }
    });
}

//Server request for Chart.js answers from Mongodb
const getPollAnswers = () => {
    const http = new XMLHttpRequest();
    http.open("GET", "/polls/answers", true);
    http.send();
    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            let answers = JSON.parse(http.responseText);

            let doughnutChart = new Chart(CHART, {
                type: 'doughnut',
                data: {
                    datasets: [
                        {
                            label: 'Points',
                            backgroundColor: ['#754373', '#d03b3d', '#16a085', '#2980b9', '#ffd300', '#ffd300'],
                            data: answers.map((answer) => {
                                return answer.total;
                            })
                        }
                    ],
                    labels: answers.map((answer) => {
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
}

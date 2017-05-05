'use strict';

var CHART = document.getElementById('myChart');
Chart.defaults.scale.ticks.beginAtZero = true;

var doughnutChart = new Chart(CHART, {
    type: 'doughnut',
    data: {
        datasets: [{
            label: 'Points',
            backgroundColor: ['#f1c40f', '#e67e22', '#16a085', '#2980b9', '#2980b9'],
            data: [10, 20, 55, 30, 10]
        }],
        labels: ['blue', 'red', 'green', 'orange', 'yellow']
    },
    options: {
        legend: false,
        cutoutPercentage: 60
    }
});

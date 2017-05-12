const CHART = document.getElementById('myChart');
Chart.defaults.scale.ticks.beginAtZero = true;

let doughnutChart = new Chart(CHART, {
    type: 'doughnut',
    data: {
        datasets: [
            {
                label: 'Points',
                backgroundColor: ['#754373', '#d03b3d', '#16a085', '#2980b9', '#ffd300'],
                data: [10, 20, 55, 30, 10]
            }
        ],
        labels: ['purple', 'red', 'green', 'blue', 'yellow']
    },
    options: {
            legend: false,
            cutoutPercentage: 60
    }
});
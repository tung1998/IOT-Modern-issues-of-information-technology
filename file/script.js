var chart;
var chartData = [];
let tempChart

$(document).ready(function () {
    initChart()
    resizePage()
    renderPage()
    setInterval(function () {
        renderPage()
    }, 60 * 1000)

});


function renderPage() {
    getLastData().then(result => {
        $('#DHT-tem').html(`${result[0].dht22_t} độ C`)
        $('#GY-tem').html(`${result[0].gy68_t} độ C`)
        $('#DHT-humi').html(`${result[0].dht22_h} %`)
        $('#GY-atm').html(`${result[0].gy68_p} pa`)
        $('#GY-atm').html(`${result[0].gy68_p} pa`)
        $('#time').html(getTime(result[0].createdTime))
    }).catch(console.log)
    getChartData().then(result => {
        console.log(result)
        renderChart(tempChart, result.reverse())
    }).catch(console.log)
}

function reloadData() {
    $.ajax({
        async: false,
        type: 'post',
        url: '/getData',
        contentType: "application/json",
        success: function (data) {
            generateChartData(data);
            chart.dataProvider = chartData;
            chart.validateData();
        }
    })
}


function initChart() {
    tempChart = new Chart('chartData', {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                    label: ['Nhiệt độ DHT-22'],
                    data: [],
                    backgroundColor: [
                        'rgba(0, 0, 0, 0)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                    ],
                    borderWidth: 2
                },
                {
                    label: ['Nhiệt độ GY-68'],
                    data: [],
                    backgroundColor: [
                        'rgba(0, 0, 0, 0)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)'
                    ],
                    borderWidth: 2
                }
            ]
        },
        options: {
            title: {
                display: true,
                text: 'Biểu đồ nhiệt độ'
            },
            scales: {
                xAxes: [{
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 7
                    }
                }]
            },
            elements: {
                point:{
                    radius: 0
                }
            }
        }
    });

    
}

function resizePage() {
    let screenHeight = window.innerHeight
    let headerheight = $('#lastData').outerHeight()
    $('#chartData').css({
        'max-height': `${(screenHeight-headerheight-30)}px`
    })
}

function getLastData() {
    return new Promise((resolve, rejects) => {
        $.ajax({
            type: 'get',
            url: '/getLastData',
            contentType: "application/json",
            success: function (data) {
                resolve(data)
            },
            error: function (xhr) {
                rejects(xhr)
            }
        })
    })
}


function getChartData() {
    return new Promise((resolve, rejects) => {
        $.ajax({
            type: 'get',
            url: '/getDataChart',
            contentType: "application/json",
            success: function (data) {
                resolve(data)
            },
            error: function (xhr) {
                rejects(xhr)
            }
        })
    })
}

function getDate(time) {
    let newDate = new Date(time)
    return `${newDate.getDate()}/${newDate.getMonth()}/${newDate.getFullYear()}`
}

function getTime(time) {
    let newDate = new Date(time)
    return `${newDate.getDate()}/${newDate.getMonth()}/${newDate.getFullYear()} ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`
}

function renderChart(chart, data) {
    let labels = data.map(item => getTime(item.createdTime))
    let dht22_t = data.map(item => item.dht22_t)
    let gy68_t = data.map(item => item.gy68_t)
    chart.data.labels = labels
    chart.data.datasets[0].data = dht22_t
    chart.data.datasets[1].data = gy68_t
    chart.update()
}
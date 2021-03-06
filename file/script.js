var chart;
let tempChart
let humiChart
let atmChart
let tempChartAll
let humiChartAll
let atmChartAll

$(document).ready(function () {
    //event
    $('.head-card').on('click', (e) => {
        showChart($(e.currentTarget).attr('name'))
    })
    $('#check').on('change', (e) => {
        changeCheck()
        console.log($(e.currentTarget))
    })


    initChart()
    resizePage()
    renderPage()
    getChartData().then(result => {
        result.reverse()
        renderTempChart(tempChart, result)
        renderHumiChart(humiChart, result)
        renderAtmChart(atmChart, result)
    }).catch(console.log)
    getAllData().then(result => {
        renderTempChart(tempChartAll, result)
        renderHumiChart(humiChartAll, result)
        renderAtmChart(atmChartAll, result)
    }).catch(console.log)
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
    
}


function initChart() {
    humiChart = new Chart('chartHumi', {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: ['Độ ẩm DHT-22'],
                data: [],
                backgroundColor: [
                    'rgba(0, 0, 0, 0)'
                ],
                borderColor: [
                    'rgba(0, 238, 54, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Biểu đồ độ ẩm một tuần vừa qua'
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
                point: {
                    radius: 0
                }
            }
        }
    });

    atmChart = new Chart('chartAtm', {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: ['Khí áp GY-68'],
                data: [],
                backgroundColor: [
                    'rgba(0, 0, 0, 0)'
                ],
                borderColor: [
                    'rgba(255, 230, 0, 1)',
                ],
                borderWidth: 2
            }]
        },

        options: {
            title: {
                display: true,
                text: 'Biểu đồ khí áp một tuần vừa qua'
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
                point: {
                    radius: 0
                }
            }
        }
    });

    tempChart = new Chart('chartTemp', {
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
                text: 'Biểu đồ nhiệt độ một tuần vừa qua'
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
                point: {
                    radius: 0
                }
            }
        }
    });

    humiChartAll = new Chart('chartHumiAll', {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: ['Độ ẩm DHT-22'],
                data: [],
                backgroundColor: [
                    'rgba(0, 0, 0, 0)'
                ],
                borderColor: [
                    'rgba(0, 238, 54, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Biểu đồ tổng hợp dữ liệu độ ẩm'
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
                point: {
                    radius: 0
                }
            }
        }
    });

    atmChartAll = new Chart('chartAtmAll', {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: ['Khí áp GY-68'],
                data: [],
                backgroundColor: [
                    'rgba(0, 0, 0, 0)'
                ],
                borderColor: [
                    'rgba(255, 230, 0, 1)',
                ],
                borderWidth: 2
            }]
        },

        options: {
            title: {
                display: true,
                text: 'Biểu đồ tổng hợp dữ liệu khí áp'
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
                point: {
                    radius: 0
                }
            }
        }
    });

    tempChartAll = new Chart('chartTempAll', {
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
                text: 'Biểu đồ tổng hợp dữ liệu nhiệt độ'
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
                point: {
                    radius: 0
                }
            }
        }
    });
}

function resizePage() {
    let screenHeight = window.innerHeight
    let headerheight = $('#lastData').outerHeight()
    $('canvas').css({
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

function getAllData() {
    return new Promise((resolve, rejects) => {
        $.ajax({
            type: 'get',
            url: '/getAllData',
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

function changeCheck() {
    return new Promise((resolve, rejects) => {
        $.ajax({
            type: 'get',
            url: '/toggleCheck',
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
    return `${newDate.getDate()}/${newDate.getMonth()+1}/${newDate.getFullYear()}`
}

function getTime(time) {
    let newDate = new Date(time)
    return `${newDate.getDate()}/${newDate.getMonth()+1}/${newDate.getFullYear()} ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`
}

function renderTempChart(chart, data) {
    let labels = data.map(item => getTime(item.createdTime))
    let dht22_t = data.map(item => item.dht22_t)
    let gy68_t = data.map(item => item.gy68_t)
    chart.data.labels = labels
    chart.data.datasets[0].data = dht22_t
    chart.data.datasets[1].data = gy68_t
    chart.update()
}

function renderHumiChart(chart, data) {
    let labels = data.map(item => getTime(item.createdTime))
    let dht22_h = data.map(item => item.dht22_h)
    chart.data.labels = labels
    chart.data.datasets[0].data = dht22_h
    chart.update()
}

function renderAtmChart(chart, data) {
    let labels = data.map(item => getTime(item.createdTime))
    let gy68_p = data.map(item => item.gy68_p)
    chart.data.labels = labels
    chart.data.datasets[0].data = gy68_p
    chart.update()
}

function showChart(chart) {
    $('.chart').addClass('d-none')
    $(`#${chart}`).parent().removeClass('d-none')
    $(`#${chart}All`).parent().removeClass('d-none')
}
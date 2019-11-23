var chart;
var chartData = [];

$(document).ready(function() {
    $("#login").click(function () {
        window.location.replace("/login");
    });


    $("#register").click(function () {
        window.location.replace("/register");
    });

    $("#logout").click(function () {
        $.ajax({
            url:'/logout',
            type:'post',
            success: function(){
                location.reload();
            }
        });
    });




});


AmCharts.ready(function () {
    console.log(data);

    generateChartData(data);

    // SERIAL CHART
    chart = new AmCharts.AmSerialChart();


    chart.dataProvider = chartData;
    chart.categoryField = "date";

    // listen for "dataUpdated" event (fired when chart is inited) and call zoomChart method when it happens
    chart.addListener("dataUpdated", zoomChart);

    chart.synchronizeGrid = true; // this makes all axes grid to be at the same intervals

    // AXES
    // category
    var categoryAxis = chart.categoryAxis;
    categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
    categoryAxis.minPeriod = "DD"; // our data is daily, so we set minPeriod to DD
    categoryAxis.minorGridEnabled = true;
    categoryAxis.axisColor = "#DADADA";
    categoryAxis.twoLineMode = true;
    categoryAxis.dateFormats = [{
        period: 'fff',
        format: 'JJ:NN:SS'
    }, {
        period: 'ss',
        format: 'JJ:NN:SS'
    }, {
        period: 'mm',
        format: 'JJ:NN'
    }, {
        period: 'hh',
        format: 'JJ:NN'
    }, {
        period: 'DD',
        format: 'DD'
    }, {
        period: 'WW',
        format: 'DD'
    }, {
        period: 'MM',
        format: 'MMM'
    }, {
        period: 'YYYY',
        format: 'YYYY'
    }];

    // first value axis (on the left)
    var valueAxis1 = new AmCharts.ValueAxis();
    valueAxis1.axisColor = "#FF6600";
    valueAxis1.axisThickness = 2;
    valueAxis1.autoGridCount = false;
    valueAxis1.gridCount = 10;
    chart.addValueAxis(valueAxis1);


    // second value axis (on the right)
    var valueAxis2 = new AmCharts.ValueAxis();
    valueAxis2.position = "right"; // this line makes the axis to appear on the right
    valueAxis2.axisColor = "#FCD202";
    valueAxis2.gridAlpha = 0;
    valueAxis2.axisThickness = 2;
    valueAxis2.autoGridCount = false;
    valueAxis2.gridCount = 10;
    chart.addValueAxis(valueAxis2);

    // GRAPHS
    // first graph
    var graph1 = new AmCharts.AmGraph();
    graph1.valueAxis = valueAxis1; // we have to indicate which value axis should be used
    graph1.title = "humi";
    graph1.valueField = "humi";
    graph1.bullet = "round";
    graph1.hideBulletsCount = 30;
    graph1.bulletBorderThickness = 1;
    chart.addGraph(graph1);

    // second graph
    var graph2 = new AmCharts.AmGraph();
    graph2.valueAxis = valueAxis2; // we have to indicate which value axis should be used
    graph2.title = "temc";
    graph2.valueField = "temc";
    graph2.bullet = "square";
    graph2.hideBulletsCount = 30;
    graph2.bulletBorderThickness = 1;
    chart.addGraph(graph2);

    // CURSOR
    var chartCursor = new AmCharts.ChartCursor();
    chartCursor.cursorAlpha = 0.1;
    chartCursor.fullWidth = true;
    chartCursor.valueLineBalloonEnabled = true;
    chart.addChartCursor(chartCursor);

    // SCROLLBAR
    var chartScrollbar = new AmCharts.ChartScrollbar();
    chart.addChartScrollbar(chartScrollbar);

    // LEGEND
    var legend = new AmCharts.AmLegend();
    legend.marginLeft = 110;
    legend.useGraphSettings = true;
    chart.addLegend(legend);




    // WRITE
    chart.write("chartdiv");
    // $(document).ready(function() {
    setInterval(function () {
        $.ajax({
            async: false,
            type : 'post',
            url : '/getData',
            contentType: "application/json",
            success: function(data){
                // data=JSON.parse(data);
                console.log(data);
                generateChartData(data);
                chart.dataProvider = chartData;
                chart.validateData();
            }
        })
    },5000)
    // });
});

// generate some random data, quite different range
function generateChartData(data) {
    var firstDate = new Date();
    firstDate.setDate(firstDate.getDate() - 5);
    chartData=[];
    for (var i = 4; i >=0; i--) {
        // we create date objects here. In your data, you can have date strings
        // and then set format of your dates using chart.dataDateFormat property,
        // however when possible, use date objects, as this will speed up chart rendering.
        var newDate = new Date(firstDate);
        newDate.setDate(newDate.getDate() - i);
        chartData.push({
            date: newDate,
            humi: data[i].humi,
            temc: data[i].temc,
            temf: data[i].temf
        });
    }
}



// this method is called when chart is first inited as we listen for "dataUpdated" event
function zoomChart() {
    // different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
    chart.zoomToIndexes(0, 100);
}
//
//
// $(document).ready(function() {
//     setInterval(function () {
//         $.ajax({
//             type : 'get',
//             url : '/data',
//             contentType: "application/json",
//             success: function(data){
//                 JSON.parse(data);
//                 generateChartData(data);
//             }
//         })
//     },5000)
// });
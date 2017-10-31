$(window).ready(function () {
    window.scrollTo(0, 0);
});

//console.log("Trying to print local variable in js");
//console.log(clientGameState);

$(document).ready(function () {
    var hash = document.location.hash;

    if (hash == "#global")
        makeTabActive('global');
    else if (hash == "#profile")
        makeTabActive('profile');

});

function makeTabActive(tab) {

    console.log("Making " + tab + " active!");
    $('.nav-tabs a[href="#' + tab + '"]').tab('show');
};

$("#globaltab").click(function () {
    console.log("Button was clicked. Time for AJAX call");
    $.ajax(
        {
            type: "GET",
            url: "/getData/globaldata",
            success: function (result) {
                console.log("I just finished the call and got updated data");
                console.log(result);
                $("#ajaxUpdateGlobalStats").html(result);
            }
        });
});

$("#profiletab").click(function () {
    console.log("Button was clicked. Time for AJAX call");
    $.ajax(
        {
            type: "GET",
            url: "/getData/profiledata",
            success: function (result) {
                console.log("I just finished the call and got updated data");
                console.log(result);
                $("#ajaxUpdateProfileStats").html(result);
            }
        });
});

//todo - This data will actually come from nodejs to ejs to this variables in the view.

//  var timeOfKillsChartData = generateChartData();
//  var avgSnakeLengthAllChartData = generateChartData();
//  var highestSnakeLengthAllChartData = generateChartData();

console.log('Printing Avg here:');
console.log(avgSnakeLengthChartData);
console.log('Printing highest here:');
console.log(highestSnakeLengthChartData);

var avgSnakeLengthChart = makeChart("avgSnakeLengthchartdiv", avgSnakeLengthChartData);
 var highestSnakeLengthChart = makeChart("highestSnakeLengthchartdiv", highestSnakeLengthChartData);
// var timeOfKillsChart = makeChart("timeOfKillschartdiv", timeOfKillsChartData);
// var avgSnakeLengthAllChart = makeChart("avgSnakeLengthAllchartdiv", avgSnakeLengthAllChartData);
// var highestSnakeLengthAllChart = makeChart("highestSnakeLengthAllchartdiv", highestSnakeLengthAllChartData);

function makeChart(chartDiv, chartData) {

    return AmCharts.makeChart(chartDiv, {
        "type": "serial",
        "theme": "black",
        "marginRight": 80,
        "autoMarginOffset": 20,
        "marginTop": 7,
        "dataProvider": chartData,
        "categoryField": "second", //field of x-axis
        "categoryAxis":
            {

            },
        "valueAxis": [
            {
                "position": "left",
                "title": "Avg Length of snake" //not showing up
            }],
        "mouseWheelZoomEnabled": true,
        "graphs": [
            {
                "id": "g1",
                "balloonText": "[[value]]", //what the pop up when hovered is
                "bullet": "round", //available: none, square, triangleUp, traingleDown, bubble, custom, round
                "bulletBorderAlpha": 1, //bulletborderopacity
                "bulletColor": "#FFFFFF",
                 "hideBulletsCount": 50, //"If there are more data points than hideBulletsCount, the bullets will not be shown. 0 means the bullets will always be visible.
                "title": "title goes here", //just a variable for the ballonText
                "valueField": "length", //the name of the field in data in Y-axis
                "useLineColorForBulletBorder": true, //determines border of value dot(bullet)
                "type": "smoothedLine", //typeofgraph - line, column, step, smoothedLine, candlestick,ohIc
                "balloon":
                    {
                        "drop": true  //if you want the balloon to be in a tear shape
                    },
                "fillAlphas": 0.7
            }],
        "chartScrollbar":
            {
                "autoGridCount": true,
                "graph": "g1",
                "scrollbarHeight": 40
            },
        "chartCursor":
            {
                "limitToGraph": "g1"
            },
        "export":
            {
                "enabled": true
            },
        "legend":
            {
                "enabled": true,
                "useGraphSettings": true
            }
    });
};

//
// chart.addListener("rendered", zoomChart);
// zoomChart();
//
// // this method is called when chart is first inited as we listen for "rendered" event
// function zoomChart() {
//     // different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
//     chart.zoomToIndexes(chartData.length - 40, chartData.length - 1);
// }


//todo - once the data comes from the server, this function can go.

// generate some random data, quite different range
function generateChartData() {
    var chartData = [];
    var firstDate = new Date();
    firstDate.setDate(firstDate.getDate() - 5);
    var visits = 1200;
    for (var i = 0; i < 1000; i++) {
        // we create date objects here. In your data, you can have date strings
        // and then set format of your dates using chart.dataDateFormat property,
        // however when possible, use date objects, as this will speed up chart rendering.
        var newDate = new Date(firstDate);
        newDate.setDate(newDate.getDate() + i);

        visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);

        chartData.push({
            second: i*5,
            length: visits
        });
    }
    return chartData;
}
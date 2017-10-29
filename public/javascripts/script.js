
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
var avgSnakeLengthChartData = generateChartData();
 var highestSnakeLengthChartData = generateChartData();
 var timeOfKillsChartData = generateChartData();
 var avgSnakeLengthAllChartData = generateChartData();
 var highestSnakeLengthAllChartData = generateChartData();


var avgSnakeLengthChart = makeChart("avgSnakeLengthchartdiv", avgSnakeLengthChartData);
 var highestSnakeLengthChart = makeChart("highestSnakeLengthchartdiv", highestSnakeLengthChartData);
 var timeOfKillsChart = makeChart("timeOfKillschartdiv", timeOfKillsChartData);
 var avgSnakeLengthAllChart = makeChart("avgSnakeLengthAllchartdiv", avgSnakeLengthAllChartData);
 var highestSnakeLengthAllChart = makeChart("highestSnakeLengthAllchartdiv", highestSnakeLengthAllChartData);

function makeChart(chartDiv, chartData) {

    return  AmCharts.makeChart(chartDiv, {
        "type": "serial",
        "theme": "black",
        "marginRight": 80,
        "autoMarginOffset": 20,
        "marginTop": 7,
        "dataProvider": chartData,
        "valueAxes": [{
            "axisAlpha": 0.2,
            "dashLength": 1,
            "position": "left"
        }],
        "mouseWheelZoomEnabled": true,
        "graphs": [{
            "id": "g1",
            "balloonText": "[[value]]",
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "hideBulletsCount": 50,
            "title": "red line",
            "valueField": "visits",
            "useLineColorForBulletBorder": true,
            "balloon": {
                "drop": true
            }
        }],
        "chartScrollbar": {
            "autoGridCount": true,
            "graph": "g1",
            "scrollbarHeight": 40
        },
        "chartCursor": {
            "limitToGraph": "g1"
        },
        "categoryField": "date",
        "categoryAxis": {
            "parseDates": true,
            "axisColor": "#DADADA",
            "dashLength": 1,
            "minorGridEnabled": true
        },
        "export": {
            "enabled": true
        }
    });
};


// chart.addListener("rendered", zoomChart);
// //zoomChart();
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
            date: newDate,
            visits: visits
        });
    }
    return chartData;
}
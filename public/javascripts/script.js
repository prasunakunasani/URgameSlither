$(window).ready(function () {
    window.scrollTo(0, 0);
});


$(document).ready(function () {
    var hash = document.location.hash;

    if (hash == "#global")
        makeTabActive('global');
    else if (hash == "#profile")
        makeTabActive('profile');

});

function makeTabActive(tab) {

    $('.nav-tabs a[href="#' + tab + '"]').tab('show');
};


$("#profiletab").click(function () {
    $.ajax(
        {
            type: "GET",
            url: "stats/ajaxUpdate/profile",
            success: function (result) {
                console.log(result);
                $("#ajaxUpdateProfileStats").html(result);
            }
        });
});

$("#globaltab").click(function () {
    $.ajax(
        {
            type: "GET",
            url: "stats/ajaxUpdate/global",
            success: function (result) {
                console.log(result);
                $("#ajaxUpdateGlobalStats").html(result);
            }
        });
});

loadProfileCharts();
loadGlobalCharts();

function loadProfileCharts() {
    var avgSnakeLengthChart = makeChart("avgSnakeLengthchartdiv", avgSnakeLengthChartData, "length","second","#AE3F69","Average Score over time","Score","5 second interval");
    var highestSnakeLengthChart = makeChart("highestSnakeLengthchartdiv", highestSnakeLengthChartData, "length","second","#ffca74","Maximum Score over time","Score","5 second interval");
    var bestScoreAndKillsChart = makeChart("bestScoreAndKillschartdiv", bestScoreAndKillsChartData, "length","second","#AE3F69","Best Score and Kills over time","Score/Kills","5 second interval");
    var cumulativeMovingScoreChart = makeChart("cumulativeMovingScorechartdiv",cumulativeMovingScoreChartData,"score","game","#ffca74","Cumulative Score per game","Score","Game Number")
}

function loadGlobalCharts() {
    var avgSnakeLengthAllChart = makeChart("avgSnakeLengthAllchartdiv", avgSnakeLengthAllChartData, "length","second","#AE3F69","Average Score of all users over time","Score","5 second interval");
    var highestSnakeLengthAllChart = makeChart("highestSnakeLengthAllchartdiv", highestSnakeLengthAllChartData, "length","second","#AE3F69","Highest Score of all users over time","Score","5 second interval");
}

function makeChart(chartDiv, chartData, yAxisFieldName,xAxisFieldName,graphColor,title,xAxisLabel,yAxisLabel) {
    return AmCharts.makeChart(chartDiv, {
        "type": "serial",
        "theme": "black",
        "titles": [{
            "text": title,
            "size": 15
        }],
        "allLabels": [{
            "text": yAxisLabel,
            "y": "!20",
            "width": "50%",
            "size": 15,
            "bold": true,
            "align": "center"
        }, {
            "text": xAxisLabel,
            "x": "10",
            "y": "!20",
            "rotation": 270,
            "width": "50%",
            "size": 15,
            "bold": true,
            "align": "center"
        }],
        "marginRight": 80,
        "autoMarginOffset": 20,
        "marginTop": 7,
        "dataProvider": chartData,
        "categoryField": xAxisFieldName, //field of x-axis
        "categoryAxis":
            {},
        "valueAxis": [
            {
                "position": "left",
                "title": "Avg Length of snake" //not showing up
            }],
        "mouseWheelZoomEnabled": true,
        "graphs": [
            {
                "id": "g1",
                "balloonText": "[[value]]", //what the pop up has when hovered is
                "fillColors": graphColor,
                "bullet": "round", //available: none, square, triangleUp, traingleDown, bubble, custom, round
                "bulletBorderAlpha": 1, //bulletborderopacity
                "bulletColor": "#ffffff",
                "hideBulletsCount": 50, //"If there are more data points than hideBulletsCount, the bullets will not be shown. 0 means the bullets will always be visible.
                "title": "title goes here", //just a variable for the ballonText
                "valueField": yAxisFieldName, //the name of the field in data in Y-axis
                "useLineColorForBulletBorder": true, //determines border of value dot(bullet)
                "type": "smoothedLine", //typeofgraph - line, column, step, smoothedLine, candlestick,ohIc
                "balloon":
                    {
                        "drop": true  //if you want the balloon to be in a tear shape
                    },
                "fillAlphas": 0.7

            },
            {
                "id": "g2",
                "valueField": "kills",
                "type": "column"
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
                "enabled": false
            },
        "legend":
            {
                "enabled": false, //allow a legend to turn on/off the graphs.
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
//

if (totalGamesPlayedByUser<=0)
{
    runPlayGameToast();
}

function runPlayGameToast(){

    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-left",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "slideDown",
        "hideMethod": "fadeOut"
    }

    toastr.info('Play a game first');

}

var bars = [];
for(var n=0; n<3; n++) {
    bars.push( new tinyProgressbar(document.getElementById("progress" + n)) );
}
bars[0].progress(avgScore);
bars[1].progress(avgKills);
bars[2].progress(avgBoosts);

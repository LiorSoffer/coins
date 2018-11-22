function LiveReports() {
  $("#pagename").text("Live Reports");
  $(".se-pre-con").show();
  $("#main").empty();
  var htmlText = `<div id="chartContainer" style="height: 300px; width: 100%;"></div>`;
  $("#main").append(htmlText);
  const UParray = reports.map(x => x.toUpperCase());
  var str = UParray.join(",");

  var markers = [];
  for (var i = 0; i < UParray.length; i++) {
    markers.push([]);
  }
  var LineData = [];
  for (var i = 0; i < UParray.length; i++) {
    var line = {
      type: "line",
      xValueType: "dateTime",
      yValueFormatString: "###.00$",
      xValueFormatString: "hh:mm:ss TT",
      showInLegend: true,
      name: UParray[i],
      dataPoints: markers[i]
    }
    LineData.push(line);
  }

  var options = {
    title: {
      text: "Coins Value Tracker"
    },
    axisX: {
      title: ""
    },
    axisY: {
      suffix: "$",
      includeZero: false
    },
    toolTip: {
      shared: true
    },
    legend: {
      cursor: "pointer",
      verticalAlign: "top",
      fontSize: 22,
      fontColor: "dimGrey",
      itemclick: toggleDataSeries
    },
    data: LineData
  };

  var chart = $("#chartContainer").CanvasJSChart(options);

  function toggleDataSeries(e) {
    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }
    e.chart.render();
  }

  var updateInterval = 2000;

  var time = new Date();

  function updateChart(count) {
 
    count = count || 1;
    for (var i = 0; i < count; i++) {
      time.setTime(time.getTime() + updateInterval);
      $.getJSON("https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + str + "&tsyms=USD", (data) => {
        $(".se-pre-con").fadeOut("slow");
        // pushing the new values
        for (var i = 0; i < UParray.length; i++) {
          markers[i].push({
            x: time.getTime(),
            y: data[UParray[i]].USD
          });
        }
      });

    }
    console.log(markers);
    $("#chartContainer").CanvasJSChart().render();
  }
  var myinterval = setInterval(function () {
    if ($("#pagename").text() != "Live Reports")
    clearInterval(myinterval);
    else
    updateChart()
  }, updateInterval);


}
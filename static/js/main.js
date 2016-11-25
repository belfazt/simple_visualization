function drawChart() {
  $.ajax('/info')
    .done(function(data) {
      // Give the points a 3D feel by adding a radial gradient
      Highcharts.getOptions().colors = $.map(Highcharts.getOptions().colors, function (color) {
          return {
              radialGradient: {
                  cx: 0.4,
                  cy: 0.3,
                  r: 0.5
              },
              stops: [
                  [0, color],
                  [1, Highcharts.Color(color).brighten(-0.2).get('rgb')]
              ]
          };
      });
      var chart = new Highcharts.Chart({
          chart: {
              renderTo: 'chart_container',
              margin: 100,
              type: 'scatter',
              options3d: {
                  enabled: true,
                  alpha: 10,
                  beta: 30,
                  depth: 250,
                  viewDistance: 5,
                  fitToPlot: false,
                  frame: {
                      bottom: { size: 1, color: 'rgba(0,0,0,0.02)' },
                      back: { size: 1, color: 'rgba(0,0,0,0.04)' },
                      side: { size: 1, color: 'rgba(0,0,0,0.06)' }
                  }
              }
          },
          title: {
              text: 'Aceleración'
          },
          plotOptions: {
              scatter: {
                  width: 20,
                  height: 20,
                  depth: 20
              }
          },
          yAxis: {
              min: -24,
              max: 24,
              title: null
          },
          xAxis: {
              min: -24,
              max: 24,
              gridLineWidth: 1
          },
          zAxis: {
              min: -24,
              max: 24,
              showFirstLabel: false
          },
          legend: {
              enabled: false
          },
          series: [{
              name: 'Punch',
              colorByPoint: true,
              data: data
          }]
      });
      // Add mouse events for rotation
      $(chart.container).on('mousedown.hc touchstart.hc', function (eStart) {
          eStart = chart.pointer.normalize(eStart);

          var posX = eStart.pageX,
              posY = eStart.pageY,
              alpha = chart.options.chart.options3d.alpha,
              beta = chart.options.chart.options3d.beta,
              newAlpha,
              newBeta,
              sensitivity = 5; // lower is more sensitive

          $(document).on({
              'mousemove.hc touchdrag.hc': function (e) {
                  // Run beta
                  newBeta = beta + (posX - e.pageX) / sensitivity;
                  chart.options.chart.options3d.beta = newBeta;

                  // Run alpha
                  newAlpha = alpha + (e.pageY - posY) / sensitivity;
                  chart.options.chart.options3d.alpha = newAlpha;

                  chart.redraw(false);
              },
              'mouseup touchend': function () {
                  $(document).off('.hc');
              }
          });
      });
    });
}

function renderPunches() {
  $.ajax('/punches')
    .done(function(data) {
      $('#total_punches').html(data.good_punches + data.bad_punches);
      $('#good_punches').html(data.good_punches);
      $('#bad_punches').html(data.bad_punches);
    });
}

function renderAcceleration() {
  $.ajax('/info')
    .done(function(data) {
      var html = '';
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; i < data[i].length; j++) {
          data[i][j] *= mass.mass;
        }
        html += '<tr>';
        html += '<td>' + Math.sqrt(Math.abs(data[i][0] * data[i][0]) + Math.abs(data[i][1] * data[i][1]) + Math.abs(data[i][2] * data[i][2])) + '</td>'
        html += '<td>' + data[i][0] + '</td>'
        html += '<td>' + data[i][1] + '</td>'
        html += '<td>' + data[i][2] + '</td>'
        html += '</tr>';
        console.log(data[i]);
      }
      $('#table_body').html(html);
    });

}
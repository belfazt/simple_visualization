function drawChart() {
  $.ajax('/info').done(function(info) {

    var points = [];

    for (var i = info.length - 1; i >= 0; i--) {
      points[i] = {
        x: i,
        y: Math.sqrt(Math.abs(info[i][0] * info[i][0]) + Math.abs(info[i][1] * info[i][1]) + Math.abs(info[i][2] * info[i][2]))
      }
    }

    console.log(points);

    var ctx = $("#myChart");
    var scatterChart = new Chart(ctx, {
      type: 'line',
      data: {
          datasets: [{
              label: 'Magnitud',
              data: points
          }]
      },
      options: {
          scales: {
              xAxes: [{
                  type: 'linear',
                  position: 'bottom'
              }]
          }
      }
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
  var data = [];
  $.ajax('/info').then(function(info) {
    data = info;
    return $.ajax('/mass');
  }).then(function(mass) {
    var html = '';
    mass = mass.mass;
    console.log(mass);
    for (var i = data.length - 1; i >= 0; i--) {
      data[i] = data[i].map(function(x) { return x * mass; });
    }
    console.log(data);
    for (var i = 0; i < data.length; i++) {
      html += '<tr>';
      html += '<td>' + Math.sqrt(Math.abs(data[i][0] * data[i][0]) + Math.abs(data[i][1] * data[i][1]) + Math.abs(data[i][2] * data[i][2])) + '</td>'
      html += '<td>' + data[i][0] + '</td>'
      html += '<td>' + data[i][1] + '</td>'
      html += '<td>' + data[i][2] + '</td>'
      html += '</tr>';
    }
    $('#table_body').html(html);
  }, function(err) {
    console.log(err);
  });
}
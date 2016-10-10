$(console.log("working..."))

$("#location-input").autocomplete({
  source: function( request, response ) {
          $.ajax({
              type : 'GET',
              url: '/autocomplete/'+$('#location-input').val(),
              success: function(data) {
                $('#searchval').val(data.value);
                response(data);
              },
          });
      },
      minLength: 3,
      focus: function(event, ui) {
        $('#location-input').val(ui.item.label);
        return false;
      },
      select: function(event, ui) {
        $('#location-input').val(ui.item.label);
        $('#searchval').val(ui.item.value);
        return false;
      },
      change: function(event, ui) {
        $('#location-input').val(ui.item.label);
        return false;
      }
});


$('#form').on("submit",function(e){
  e.preventDefault()
  console.log("submitted")
  let query=$('#searchval').val()
  console.log(query)
  $.ajax({
  type: 'GET',
  url: 'search/'+query,

  beforeSend:function(){
    // this is where we append a loading image
    $('#ajax-panel').html('<div class="loading"><img src="/images/loading.gif" alt="Loading..." /></div>');
  },

  success:function(output){
  output=JSON.parse(output)
   myDiv = document.getElementById('myDiv');
    var toFahrenheit=function(temp){
          return Math.floor(temp* 9/5 - 459.67)
        }
    for(var i=0;i<output.list.length;i++){
      output.list[i].main.temp= toFahrenheit(output.list[i].main.temp)
      console.log(output.list)
    }
      Plotly.newPlot( myDiv, [{
          z: [[output.list[2].main.temp, output.list[10].main.temp, output.list[18].main.temp, output.list[26].main.temp, output.list[34].main.temp], [output.list[5].main.temp, output.list[13].main.temp, output.list[21].main.temp, output.list[29].main.temp, output.list[37].main.temp], [output.list[7].main.temp, output.list[15].main.temp, output.list[23].main.temp, output.list[30].main.temp, output.list[38].main.temp]],
          y: ['Morning', 'Afternoon', 'Evening'],
          x: ['Tomorrow', '+2 Days', '+3 Days', '+4 Days', '+5 Days'],
          type: 'heatmap'
        }
      ]);

    console.log(output)
  },
  error:function(error){

    console.log(error)
  }
});
})

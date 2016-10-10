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
    }

    const makeTempArray=function(startNum){
      tempArray=[];
      for(var i=startNum;i<40;i+=8){
        tempArray.push(output.list[i].main.temp)
      }
      return tempArray
    }
    const morning=makeTempArray(2);
    const afternoon=makeTempArray(5);
    const night=makeTempArray(7);
      Plotly.newPlot( myDiv, [{
          z: [morning,afternoon,night],
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

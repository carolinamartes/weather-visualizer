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
  console.log(output)
   myDiv = document.getElementById('myDiv');

    var makeTempArray=function(startNum){
      tempArray=[];
      for(var i=startNum;i<40;i+=8){
        tempArray.push(output.list[i].main.temp)
      }
      return tempArray
    }
    const morning=makeTempArray(2);

    const afternoon=makeTempArray(4);

    const night=makeTempArray(6);

      Plotly.newPlot( plot,[{
          z: [morning,afternoon,night],
          y: ['Morning', 'Afternoon', 'Evening'],
          x: ['Tomorrow', '+2 Days', '+3 Days', '+4 Days', '+5 Days'],
          type: 'heatmap',
          hoverinfo:'z',
          ygap: 5,
          xgap:5
        }], {
          title: 'Five Day Forecast for '+ $('#location-input').val(),
          font: {
            family: 'Raleway, Helvetica, monospace',
            size: 14,
            color: '#7f7f7f'
        }
      } );

    plot.on('plotly_click', function(data){
        console.log(data)
        const pointx=data.points[0].pointNumber[0]
        const pointy=data.points[0].pointNumber[1]

        switch(true) {
            case pointx==0 && pointy==0:
                $('#description').text("Tomorrow morning: " +output.list[2].weather[0].description)
                break;
            case pointx==1 && pointy==0:
                $('#description').text("Tomorrow afternoon: " +output.list[4].weather[0].description)
                break;
            case pointx==2 && pointy==0:
                $('#description').text("Tomorrow evening: " +output.list[6].weather[0].description)
                break;
            case pointx==0 && pointy==1:
               $('#description').text("In 2 days, in the morning: "+output.list[10].weather[0].description)
                break;
            case pointx==1 && pointy==1:
               $('#description').text("In 2 days, in the afternoon: "+output.list[12].weather[0].description)
                break;
            case pointx==2 && pointy==1:
               $('#description').text("In 2 days, in the evening: "+output.list[14].weather[0].description)
                break;
            case pointx==0 && pointy==2:
               $('#description').text("In 3 days, in the morning: "+output.list[18].weather[0].description)
                break;
            case pointx==1 && pointy==2:
               $('#description').text("In 3 days, in the afternoon: "+output.list[20].weather[0].description)
                break;
            case pointx==2 && pointy==2:
               $('#description').text("In 3 days, in the evening: "+output.list[22].weather[0].description)
                break;
            case pointx==0 && pointy==3:
               $('#description').text("In 4 days, in the morning: "+output.list[26].weather[0].description)
                break;
            case pointx==1 && pointy==3:
               $('#description').text("In 4 days, in the afternoon: "+output.list[28].weather[0].description)
                break;
            case pointx==2 && pointy==3:
               $('#description').text("In 4 days, in the evening: "+output.list[30].weather[0].description)
                break;
            case pointx==0 && pointy==4:
               $('#description').text("In 5 days, in the morning: "+output.list[34].weather[0].description)
                break;
            case pointx==1 && pointy==4:
               $('#description').text("In 5 days, in the afternoon: "+output.list[36].weather[0].description)
                break;
            case pointx==2 && pointy==4:
               $('#description').text("In 5 days, in the evening: "+output.list[38].weather[0].description)
                break;
            default:
                console.log("nope")
        }



    });

    console.log(output)
  },
  error:function(error){

    console.log(error)
  }
});
})

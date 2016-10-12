  $(document).ready(function() {
    console.log("working...")

  let geocoder;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
}
//Get the latitude and the longitude;
function successFunction(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    codeLatLng(lat, lng)
    coordArr=[];
    coordArr.push(lat);
    coordArr.push(lng);
    $('#latlng').val(coordArr)
}

function errorFunction(){
    console.log("Geocoder failed");
}

  function initialize() {
   geocoder = new google.maps.Geocoder();
  }

  const codeLatLng=function(lat, lng) {

    const latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {
        //find country name
            for (var i=0; i<results[0].address_components.length; i++) {
            for (var b=0;b<results[0].address_components[i].types.length;b++) {

            //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
                if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                    //this is the object you are looking for
                    const geoCity= results[0].address_components[i];
                    const geoCountry=results[0].address_components[6]
                       //city data
        $("#location-input").val(geoCity.long_name +", "+ geoCountry.short_name);
            const cityState=decodeURIComponent($('#location-input').val());
            const cityStateArray=cityState.split(', ');
            const city=cityStateArray[0];
            const state=cityStateArray[1];
             $.ajax({
                      type : 'GET',
                      url: '/geolocation/'+city+'/'+state,
                      success: function(data) {
                        $('#searchval').val(data[0].value)
                      },
                  });
                }
             }
             }
          }
        }
    });
  }
 //initialize geolocation
initialize()

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
  e.preventDefault();
  $('#map').hide();
  $('#plot').show();
  let query=$('#searchval').val()
  let temp=$("#tempType label.active input").val();
  $.ajax({
  type: 'GET',
  url: 'search/'+query+'/'+temp,

  success:function(output){
  $('#description').html('');
  output=JSON.parse(output)

    const makeTempArray=function(startNum){
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
      //end new plot

    plot.on('plotly_click', function(data){
        const pointx=data.points[0].pointNumber[0]
        const pointy=data.points[0].pointNumber[1]

        let checkDescription=function(weatherDescription){
          switch(true){
            case weatherDescription.includes("clear"):
              $('#description').html('<img class="icon" src="/images/png/sunny.png" />')
              break;
            case weatherDescription.includes("clouds"):
              $('#description').html('<img class="icon" src="/images/png/cloudy-1.png" />')
              break;
            case weatherDescription.includes("rain"):
            case weatherDescription.includes("drizzle"):
              $('#description').html('<img class="icon" src="/images/png/rain.png" />')
              break;
            case weatherDescription.includes("thunderstorm"):
              $('#description').html('<img class="icon" src="/images/png/storm.png" />')
              break;
            case weatherDescription.includes("hail"):
              $('#description').html('<img class="icon" src="/images/png/hail.png" />')
              break;
            default:
             $('#description').html('');
             console.log(weatherDescription)
          }
        }

        switch(true) {
            case pointx==0 && pointy==0:
                checkDescription(output.list[2].weather[0].description)
                break;
            case pointx==1 && pointy==0:
                checkDescription(output.list[4].weather[0].description)
                break;
            case pointx==2 && pointy==0:
                checkDescription(output.list[6].weather[0].description)
                break;
            case pointx==0 && pointy==1:
               checkDescription(output.list[10].weather[0].description)
                break;
            case pointx==1 && pointy==1:
               checkDescription(output.list[12].weather[0].description)
                break;
            case pointx==2 && pointy==1:
               checkDescription(output.list[14].weather[0].description)
                break;
            case pointx==0 && pointy==2:
               checkDescription(output.list[18].weather[0].description)
                break;
            case pointx==1 && pointy==2:
               checkDescription(output.list[20].weather[0].description)
                break;
            case pointx==2 && pointy==2:
               checkDescription(output.list[22].weather[0].description)
                break;
            case pointx==0 && pointy==3:
               checkDescription(output.list[26].weather[0].description)
                break;
            case pointx==1 && pointy==3:
               checkDescription(output.list[28].weather[0].description)
                break;
            case pointx==2 && pointy==3:
               checkDescription(output.list[30].weather[0].description)
                break;
            case pointx==0 && pointy==4:
               checkDescription(output.list[34].weather[0].description)
                break;
            case pointx==1 && pointy==4:
               checkDescription(output.list[36].weather[0].description)
                break;
            case pointx==2 && pointy==4:
               checkDescription(output.list[38].weather[0].description)
                break;
            default:
                console.log("Error")
        }

    });//end plotly on click

    console.log(output)
  },//end success ajax call

  error:function(error){
    console.log(error)
  }
}) //end ajax call
})//end form submit


$("#displayType").on("change", function(){

  if ($("#displayType label.active input").val()=="map"){
  $('#plot').hide();
  $('#map').show();
   function init(){

  var map = new ol.Map({
        target: 'map',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        view: new ol.View({
          center: ol.proj.transform([coordArr[1],coordArr[0]], 'EPSG:4326', 'EPSG:3857'),
          zoom: 8
        })
      });

      var layer_cloud = new ol.layer.Tile({
          source: new ol.source.XYZ({
          //url from: https://gist.github.com/karlfloersch/1bb1e23ae7c31082cdd4
            url: 'http://maps.owm.io:8091/56cde48b4376d3010038aa91/{z}/{x}/{y}?hash=5',
          })
      });
      map.addLayer(layer_cloud);

    }
    setTimeout(init,2000)
  }
   if ($("#displayType label.active input").val()=="graph"){

        $('#form').submit()
      }


})

    if ($("#displayType label.active input").val()=="graph"){
      var submitForm=function(){
        $('#form').submit()
      }
      setTimeout(submitForm,4000)
    }

 });



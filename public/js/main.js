$(console.log("working..."))

$('#location-input').on("keypress",function(e){
$("#location-input").select2({
  data:city.list.json.name
});
});

$('#form').on("submit",function(e){
  e.preventDefault()
  console.log("submitted")
  let query=$('#location-input').val()

  $.ajax({
  type: 'GET',
  url: 'search/'+query,

  beforeSend:function(){
    // this is where we append a loading image
    $('#ajax-panel').html('<div class="loading"><img src="/images/loading.gif" alt="Loading..." /></div>');
  },
  success:function(data){
    // successful request; do something with the data
    console.log(data)
  },
  error:function(){
    // failed request; give feedback to user
    $('#ajax-panel').html('<p class="error"><strong>Oops!</strong> Try that again in a few moments.</p>');
  }
});
})

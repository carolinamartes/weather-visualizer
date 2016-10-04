$(console.log("working..."))

$("#location-input").autocomplete({
  source: function( request, response ) {
          $.ajax({
              type : 'GET',
              url: '/autocomplete/'+$('#location-input').val(),
              success: function(data) {
                console.log(data)
                  response(data)
              },
          });
      },
      minLength: 3
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

$('.cs-hidden').each(function(i, e){
  var id = 'autoWidth';
  $(e).attr('id', id+i);
  var selector = '#'+id+i;
   $(selector).lightSlider({
      autoWidth:true,
    slideMargin:0,
    loop:true,
    pager:false,
    onSliderLoad: function() {
        $('#autoWidth').removeClass('cS-hidden');
      } 
   });
});


// $(document).ready(function() {
//     $('#autoWidth').lightSlider({
//         autoWidth:true,
//         loop:true,
//         onSliderLoad: function() {
//             $('#autoWidth').removeClass('cS-hidden');
//         } 
//     });  
//   });
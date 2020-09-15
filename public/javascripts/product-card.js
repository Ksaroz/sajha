// Lift card and show stats on Mouseover
$('.product-cards').hover(function(){
  $(this).addClass('animate');
  // $('div.carouselNext, div.carouselPrev').addClass('visible');			
}, function(){
  $(this).removeClass('animate');			
  // $('div.carouselNext, div.carouselPrev').removeClass('visible');
});	

$('.owl-carousel').owlCarousel({
  loop:true,
  margin:10,
  nav:true,
  dots: false,
  // autoplay: true,
  // autoplayTimeout: 3000,
  responsive:{
      0:{
          items:1
      },
      576:{
          items:2
      },
      768:{
          items:3
      },
      992:{
          items:4
      }
  }
})
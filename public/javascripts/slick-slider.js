/****First Slider********/
$(document).ready(function() {
    $('.slider-one')
    .not('.slick-intialized')
    .slick({
        autoplay: true,
        autoplaySpeed: 3000,
        dots: true,
        prevArrow: ".first-slider .slider-btn .prev",
        nextArrow: ".first-slider .slider-btn .next"
    });
});
/******First Slider End***********/

/****second Slider********/
$(document).ready(function() {
    $('.slider-two')
    .not('.slick-intialized')
    .slick({
        prevArrow: ".second-slider .slider-btn .prev",
        nextArrow: ".second-slider .slider-btn .next",
        arrows: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        responsive: [
                {
                breakpoint: 992,
                settings: {
                slidesToShow: 4,
                slidesToScroll: 1,
                }
                },
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 1
                }
              },
              {
                breakpoint: 600,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 1
                }
              },
              {
                breakpoint: 480,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1
                }
              }
        ]
    });
});
    

/******second Slider End***********/

/****offer Slider********/
$(document).ready(function() {
  $('.slider-offer')
  .not('.slick-intialized')
  .slick({
      prevArrow: ".second-slider .slider-btn .prev",
      nextArrow: ".second-slider .slider-btn .next",
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 4000,
      responsive: [              
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1
              }
            },
            {
              breakpoint: 600,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            }            
      ]
  });
});
/******offer Slider End***********/


                    
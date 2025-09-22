



window.addEventListener("scroll", function (){
    const body = document.body;
    if(window.scrollY > 30){
        body.classList.add("scrolled");

    }

    else{
        body.classList.remove("scrolled");
    }
});

// slick 

$(document).ready(function() {

    $('.carousel-slik').slick({
      dots: true,
      infinite: true,
      speed: 500,
      fade: true,
      slide: 'div',
      cssEase: 'linear',
      autoplay: true,
      autoplaySpeed: 2000
    });


});


// tabs


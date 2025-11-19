



window.addEventListener("scroll", function (){
    const body = document.body;
    if(window.scrollY > 30){
        body.classList.add("scrolled");

    }

    else{
        body.classList.remove("scrolled");
    }
});






// filter button
$(document).ready(function() {
  $('.filter-buttons button').click(function() {
    const filter = $(this).data('filter');

    $('.filter-buttons button').removeClass('active');
    $(this).addClass('active');

    if(filter === 'all') {
      $('.project-item').show();
    } else {
      $('.project-item').hide();
      $(`.project-item[data-category="${filter}"]`).show();
    }
  });
});



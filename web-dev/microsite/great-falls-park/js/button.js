
 
  window.onscroll = function () {
    scrollFunction();
  };

  function scrollFunction() {
    const backToTopButton = document.getElementById("backToTop");

    
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
      backToTopButton.classList.add("show");
    } else {
      backToTopButton.classList.remove("show");
    }
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth", 
    });
  }


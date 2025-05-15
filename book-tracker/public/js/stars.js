document.addEventListener("DOMContentLoaded", function () {
    const starsContainer = document.querySelector(".stars");
    const ratingInput = document.getElementById("ratingInput");

    // If the stars container or rating  input doesn't exist, exit early
    if (!starsContainer || !ratingInput) return;

    const stars = starsContainer.querySelectorAll(".star");
    let selectedValue = parseInt(ratingInput.value) || 1;

    // Show stars now that JS is running
    starsContainer.style.display = "inline-flex";

    function updateStars(value) {
      stars.forEach(star => {
        const starValue = parseInt(star.getAttribute("data-value"));
        if (starValue <= value) {
          star.classList.add("selected");
        } else {
          star.classList.remove("selected");
        }
      });
    }

    function clearHover() {
      stars.forEach(star => star.classList.remove("hover"));
    }

    stars.forEach(star => {
      const value = parseInt(star.getAttribute("data-value"));

      //Hover effect
      star.addEventListener("mouseenter", () => {
        clearHover();
        stars.forEach(s => {
          if (parseInt(s.getAttribute("data-value")) <= value) {
            s.classList.add("hover");
          }
        });
      });

      //Remove hover on mouseout
      star.addEventListener("mouseleave", () => {
        clearHover();
      });

      //Click to select
      star.addEventListener("click", () => {
        selectedValue = value;
        ratingInput.value = selectedValue;
        updateStars(selectedValue);
      });
    });

    // Set initial value
    updateStars(parseInt(ratingInput.value));
  });
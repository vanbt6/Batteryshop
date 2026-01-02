function moveCarousel(id, direction) {
  const carousel = document.getElementById(id);
  const scrollAmount = carousel.querySelector(".product").offsetWidth + 16; // ancho + gap

  carousel.scrollBy({
    left: direction * scrollAmount,
    behavior: "smooth"
  });
}


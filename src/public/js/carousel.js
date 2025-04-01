document.addEventListener('DOMContentLoaded', function() {
    // Função para inicializar o carrossel
    function initCarousel(carouselContainer) {
        const slides = carouselContainer.querySelectorAll('.carousel-slide');
        const dots = carouselContainer.querySelectorAll('.dot');
        let currentSlide = 0;
        const slideCount = slides.length;

        // Função para mostrar o slide atual
        function showSlide(index) {
            slides.forEach(slide => {
                slide.classList.remove('active');
            });
            dots.forEach(dot => {
                dot.classList.remove('active');
            });

            slides[index].classList.add('active');
            dots[index].classList.add('active');
        }

        // Função para avançar para o próximo slide
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slideCount;
            showSlide(currentSlide);
        }

        // Adicionar eventos aos dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });

        // Iniciar o carrossel automático
        setInterval(nextSlide, 5000);

        // Mostrar o primeiro slide
        showSlide(0);
    }

    // Inicializar todos os carrosséis da página
    const carousels = document.querySelectorAll('.hero-carousel, .gestante-carousel');
    carousels.forEach(carousel => {
        initCarousel(carousel);
    });
}); 
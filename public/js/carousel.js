// Função para inicializar o carrossel
function initCarousel(carouselElement) {
    const container = carouselElement.querySelector('.carousel-container');
    const slides = carouselElement.querySelectorAll('.carousel-slide');
    const dots = carouselElement.querySelectorAll('.dot');
    let currentSlide = 0;
    const slideCount = slides.length;

    // Função para atualizar o carrossel
    function updateCarousel() {
        container.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    // Event listeners para os dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateCarousel();
        });
    });

    // Autoplay
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slideCount;
        updateCarousel();
    }, 5000); // Muda a cada 5 segundos
}

// Inicializar todos os carrosséis da página
document.addEventListener('DOMContentLoaded', () => {
    // Carrossel principal
    const heroCarousel = document.querySelector('.hero-carousel');
    if (heroCarousel) {
        initCarousel(heroCarousel);
    }

    // Carrossel da seção de Gestante
    const gestanteCarousel = document.querySelector('.gestante-carousel');
    if (gestanteCarousel) {
        initCarousel(gestanteCarousel);
    }
}); 
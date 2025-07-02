document.addEventListener('DOMContentLoaded', () => {
    const envelope = document.getElementById('envelope');
    const confettiCanvas = document.getElementById('confetti-canvas');
    const balloonsContainer = document.getElementById('balloons');
    const afterOpenContent = document.getElementById('afterOpenContent');

    // Carrossel elements
    const carouselSlidesContainer = document.getElementById('carouselSlides');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Novo elemento: o botão-link "Surpresa!"
    const surpriseLinkBtn = document.getElementById('surpriseLinkBtn');

    let isEnvelopeOpen = false;
    let currentSlideIndex = 0;

    // Confetti setup (mantido)
    const confettiCtx = confettiCanvas.getContext('2d');
    const confettiColors = ['#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#fbb1bd', '#f9bec7'];
    const confettiPieces = [];

    function resizeCanvas() {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class ConfettiPiece {
        constructor(x, y, color, size, velocityX, velocityY, rotationSpeed) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.size = size;
            this.velocityX = velocityX;
            this.velocityY = velocityY;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = rotationSpeed;
            this.opacity = 1;
        }

        update() {
            this.x += this.velocityX;
            this.y += this.velocityY;
            this.velocityY += 0.2;
            this.rotation += this.rotationSpeed;
            this.opacity -= 0.01;

            if (this.opacity < 0) {
                this.opacity = 0;
            }
        }

        draw() {
            confettiCtx.save();
            confettiCtx.translate(this.x, this.y);
            confettiCtx.rotate(this.rotation * Math.PI / 180);
            confettiCtx.globalAlpha = this.opacity;
            confettiCtx.fillStyle = this.color;
            confettiCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            confettiCtx.restore();
        }
    }

    function createConfetti() {
        const numConfetti = 50;
        for (let i = 0; i < numConfetti; i++) {
            const x = envelope.getBoundingClientRect().left + envelope.offsetWidth / 2;
            const y = envelope.getBoundingClientRect().top + envelope.offsetHeight / 2;
            const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            const size = Math.random() * 10 + 5;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 10 + 5;
            const velocityX = Math.cos(angle) * speed;
            const velocityY = Math.sin(angle) * speed - 10;
            const rotationSpeed = Math.random() * 5 - 2.5;

            confettiPieces.push(new ConfettiPiece(x, y, color, size, velocityX, velocityY, rotationSpeed));
        }
    }

    function animateConfetti() {
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        for (let i = confettiPieces.length - 1; i >= 0; i--) {
            confettiPieces[i].update();
            confettiPieces[i].draw();

            if (confettiPieces[i].opacity <= 0) {
                confettiPieces.splice(i, 1);
            }
        }
        if (confettiPieces.length > 0) {
            requestAnimationFrame(animateConfetti);
        }
    }

    // Balloon creation (mantido)
    function createBalloon() {
        const balloon = document.createElement('div');
        balloon.classList.add('balloon');
        balloon.style.left = `${Math.random() * 90 + 5}%`;
        balloonsContainer.appendChild(balloon);

        balloon.addEventListener('animationend', () => {
            balloon.remove();
        });
    }

    function showBalloons() {
        const numBalloons = 10;
        for (let i = 0; i < numBalloons; i++) {
            setTimeout(createBalloon, i * 200);
        }
    }

    // Corações Flutuantes (mantido)
    function createHearts() {
        const numHearts = 20;
        for (let i = 0; i < numHearts; i++) {
            const heart = document.createElement('span');
            heart.classList.add('heart');
            heart.textContent = '❤️';

            heart.style.left = `${Math.random() * 100}vw`;
            heart.style.top = `${Math.random() * 100}vh`;

            heart.style.animationDelay = `${Math.random() * 10}s`;
            heart.style.animationDuration = `${10 + Math.random() * 10}s`;

            document.body.appendChild(heart);
        }
    }

    // --- Funções do Carrossel ---
    function updateCarousel() {
        const offset = -currentSlideIndex * 100;
        carouselSlidesContainer.style.transform = `translateX(${offset}%)`;

        // Gerencia a visibilidade dos botões de navegação
        if (currentSlideIndex === 0) {
            prevBtn.classList.add('hidden'); // Esconde o botão "Voltar" no primeiro slide
        } else {
            prevBtn.classList.remove('hidden');
        }

        // Se estiver no último slide, o botão Próximo some e o botão-link Surpresa aparece
        if (currentSlideIndex === slides.length - 1) {
            nextBtn.classList.add('hidden'); // Esconde o botão "Próximo"
            surpriseLinkBtn.classList.remove('hidden'); // Mostra o botão-link "Surpresa!"
        } else {
            nextBtn.classList.remove('hidden'); // Mostra o botão "Próximo"
            surpriseLinkBtn.classList.add('hidden'); // Esconde o botão-link "Surpresa!"
        }
    }

    function showNextSlide() {
        if (currentSlideIndex < slides.length - 1) {
            currentSlideIndex++;
            updateCarousel();
        }
    }

    function showPrevSlide() {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
            updateCarousel();
        }
    }

    // Função para mostrar o conteúdo pós-abertura (o carrossel)
    function showAfterOpenContent() {
        envelope.style.display = 'none';
        balloonsContainer.style.display = 'none';
        confettiCanvas.style.display = 'none';

        afterOpenContent.classList.add('visible');
        updateCarousel(); // Garante que o carrossel esteja no primeiro slide e botões corretos
    }

    // Event listeners
    envelope.addEventListener('click', () => {
        if (!isEnvelopeOpen) {
            envelope.classList.add('open');
            createConfetti();
            animateConfetti();
            showBalloons();
            isEnvelopeOpen = true;
            envelope.style.pointerEvents = 'none';

            // Chama a função para mostrar o conteúdo após 5 segundos
            setTimeout(showAfterOpenContent, 5000); // 5000 milissegundos = 5 segundos
        }
    });

    nextBtn.addEventListener('click', showNextSlide);
    prevBtn.addEventListener('click', showPrevSlide);

    // O botão surpriseLinkBtn já é um link no HTML, não precisa de um event listener aqui para redirecionar.
    // A visibilidade é controlada pelo updateCarousel()

    // Chamar a função para criar os corações assim que a página carregar
    createHearts();
});
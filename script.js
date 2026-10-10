// ============ АНИМАЦИЯ ПРИ СКРОЛЛЕ ============
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ============ ПОЯВЛЕНИЕ БЛОКА "ОБО МНЕ" ============
const aboutBlock = document.getElementById('aboutBlock');

if (aboutBlock) {
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                aboutBlock.classList.add('visible');
                aboutObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    aboutObserver.observe(aboutBlock);
}

// ============ МОДАЛЬНОЕ ОКНО ============
const modalOverlay = document.getElementById('modalOverlay');

function openModal() {
    if (modalOverlay) modalOverlay.classList.add('visible');
}

function closeModal() {
    if (modalOverlay) modalOverlay.classList.remove('visible');
}

if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// ============ АНИМИРОВАННЫЕ ЦИФРЫ ============
const statNumbers = document.querySelectorAll('.stat-number');
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-target'));
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                el.textContent = Math.floor(current) + (target === 100 ? '%' : '+');
            }, 30);
            statObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(el => statObserver.observe(el));

// ============ КАРУСЕЛЬ ============
function moveCarousel(btn, direction) {
    const carousel = btn.closest('.carousel');
    const track = carousel.querySelector('.carousel-track');
    const slides = track.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.carousel-dot');

    let currentIndex = parseInt(track.getAttribute('data-index') || '0');
    currentIndex += direction;

    if (currentIndex < 0) currentIndex = slides.length - 1;
    if (currentIndex >= slides.length) currentIndex = 0;

    track.setAttribute('data-index', currentIndex);
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
    });
}

// Инициализация каруселей (создание точек)
document.querySelectorAll('.carousel').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const slides = track.querySelectorAll('.carousel-slide');
    const dotsContainer = carousel.querySelector('.carousel-dots');

    track.setAttribute('data-index', '0');

    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.onclick = () => {
            track.setAttribute('data-index', i);
            track.style.transform = `translateX(-${i * 100}%)`;
            carousel.querySelectorAll('.carousel-dot').forEach((d, j) => {
                d.classList.toggle('active', j === i);
            });
        };
        dotsContainer.appendChild(dot);
    });
});

// ============ АВТОСМЕНА КАРУСЕЛИ (раз в 10 секунд) ============
document.querySelectorAll('.carousel').forEach(carousel => {
    let autoIndex = 0;
    const track = carousel.querySelector('.carousel-track');
    const slides = track.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.carousel-dot');

    function autoSlide() {
        autoIndex++;
        if (autoIndex >= slides.length) autoIndex = 0;

        track.style.transform = `translateX(-${autoIndex * 100}%)`;
        track.setAttribute('data-index', autoIndex);

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === autoIndex);
        });
    }

    // Запускаем автопрокрутку каждые 10 секунд
    let autoTimer = setInterval(autoSlide, 10000);

    // Останавливаем при наведении на карусель
    carousel.addEventListener('mouseenter', () => clearInterval(autoTimer));

    // Возобновляем при уходе курсора
    carousel.addEventListener('mouseleave', () => {
        autoTimer = setInterval(autoSlide, 10000);
    });

    // Синхронизируем autoIndex при ручном переключении
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            autoIndex = parseInt(track.getAttribute('data-index') || '0');
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            autoIndex = parseInt(track.getAttribute('data-index') || '0');
        });
    }
});
// ============ ОТПРАВКА ФОРМЫ ЧЕРЕЗ FORMSPREE ============
const form = document.querySelector('form[action*="formspree"]');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;
        button.innerHTML = 'Отправка...';
        button.disabled = true;

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                alert('Спасибо! Заявка отправлена. Я свяжусь с вами в ближайшее время.');
                form.reset();
            } else {
                alert('Ошибка отправки. Попробуйте ещё раз или напишите мне в Telegram.');
            }
        } catch (error) {
            alert('Ошибка отправки. Проверьте соединение с интернетом.');
        } finally {
            button.innerHTML = originalText;
            button.disabled = false;
        }
    });
}

// ============ ГАМБУРГЕР-МЕНЮ ============
function toggleMenu() {
    const nav = document.querySelector('.nav');
    const icon = document.querySelector('.menu-toggle i');
    
    nav.classList.toggle('open');
    
    if (nav.classList.contains('open')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

// Закрываем меню при клике на ссылку
document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
        const nav = document.querySelector('.nav');
        if (nav) nav.classList.remove('open');
    });
});

// ============ ЛАЙТБОКС ============
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

// Открытие при клике на фото в карусели
document.querySelectorAll('.carousel-slide img').forEach(img => {
    img.addEventListener('click', (e) => {
        e.stopPropagation();
        if (lightbox && lightboxImg) {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('visible');
            document.body.style.overflow = 'hidden';   // Блокируем скролл
        }
    });
});

// Закрытие
function closeLightbox(event) {
    // Закрываем по клику на фон или на кнопку ✕
    // Не закрываем, если клик по самому фото
    if (event && event.target === lightboxImg) return;
    
    if (lightbox) {
        lightbox.classList.remove('visible');
        document.body.style.overflow = '';   // Возвращаем скролл
    }
}

// Закрытие по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('visible')) {
        closeLightbox();
    }
});

// ============ МОДАЛЬНОЕ ОКНО С ФОРМОЙ ============
function openFormModal() {
    const modal = document.getElementById('formModal');
    if (modal) {
        modal.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }
}

function closeFormModal() {
    const modal = document.getElementById('formModal');
    if (modal) {
        modal.classList.remove('visible');
        document.body.style.overflow = '';
    }
}

// Закрытие по клику на фон
document.addEventListener('DOMContentLoaded', () => {
    const formModal = document.getElementById('formModal');
    if (formModal) {
        formModal.addEventListener('click', (e) => {
            if (e.target === formModal) closeFormModal();
        });
    }
});

// Закрытие по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('formModal');
        if (modal && modal.classList.contains('visible')) {
            closeFormModal();
        }
    }
});
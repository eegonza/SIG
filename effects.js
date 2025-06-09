/**
 * Efectos y Animaciones JavaScript
 * Sistema de efectos visuales y interactivos avanzados
 */

/**
 * Configuración de efectos
 */
const EFFECTS_CONFIG = {
    // Duraciones de animación
    durations: {
        fast: 150,
        normal: 300,
        slow: 500
    },
    
    // Easing functions
    easing: {
        easeOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        easeIn: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
        easeInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    },
    
    // Configuración de intersection observer
    observerOptions: {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    }
};

/**
 * Clase para manejo de efectos de scroll
 */
class ScrollEffects {
    constructor() {
        this.elements = new Map();
        this.observer = null;
        this.init();
    }
    
    init() {
        this.createObserver();
        this.observeElements();
        this.initParallax();
        this.initScrollProgress();
    }
    
    createObserver() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            EFFECTS_CONFIG.observerOptions
        );
    }
    
    observeElements() {
        // Elementos con animaciones de entrada
        const animatedElements = document.querySelectorAll(`
            .fade-in-up, .fade-in-down, .fade-in-left, .fade-in-right,
            .scale-in, .rotate-in, .slide-in, .zoom-in, .flip-in
        `);
        
        animatedElements.forEach((element, index) => {
            // Añadir delay escalonado
            element.style.transitionDelay = `${index * 100}ms`;
            this.observer.observe(element);
        });
        
        // Elementos con contadores
        const counters = document.querySelectorAll('[data-counter]');
        counters.forEach(counter => this.observer.observe(counter));
        
        // Progress bars
        const progressBars = document.querySelectorAll('[data-progress]');
        progressBars.forEach(bar => this.observer.observe(bar));
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.animateElement(entry.target);
                this.observer.unobserve(entry.target);
            }
        });
    }
    
    animateElement(element) {
        // Animaciones de entrada
        if (element.classList.contains('fade-in-up')) {
            this.fadeInUp(element);
        } else if (element.classList.contains('fade-in-down')) {
            this.fadeInDown(element);
        } else if (element.classList.contains('fade-in-left')) {
            this.fadeInLeft(element);
        } else if (element.classList.contains('fade-in-right')) {
            this.fadeInRight(element);
        } else if (element.classList.contains('scale-in')) {
            this.scaleIn(element);
        } else if (element.classList.contains('rotate-in')) {
            this.rotateIn(element);
        } else if (element.classList.contains('slide-in')) {
            this.slideIn(element);
        } else if (element.classList.contains('zoom-in')) {
            this.zoomIn(element);
        } else if (element.classList.contains('flip-in')) {
            this.flipIn(element);
        }
        
        // Contadores
        if (element.hasAttribute('data-counter')) {
            this.animateCounter(element);
        }
        
        // Progress bars
        if (element.hasAttribute('data-progress')) {
            this.animateProgress(element);
        }
    }
    
    // Animaciones específicas
    fadeInUp(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        element.style.transition = `opacity ${EFFECTS_CONFIG.durations.normal}ms ${EFFECTS_CONFIG.easing.easeOut}, transform ${EFFECTS_CONFIG.durations.normal}ms ${EFFECTS_CONFIG.easing.easeOut}`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }
    
    fadeInDown(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(-50px)';
        element.style.transition = `opacity ${EFFECTS_CONFIG.durations.normal}ms ${EFFECTS_CONFIG.easing.easeOut}, transform ${EFFECTS_CONFIG.durations.normal}ms ${EFFECTS_CONFIG.easing.easeOut}`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }
    
    fadeInLeft(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-50px)';
        element.style.transition = `opacity ${EFFECTS_CONFIG.durations.normal}ms ${EFFECTS_CONFIG.easing.easeOut}, transform ${EFFECTS_CONFIG.durations.normal}ms ${EFFECTS_CONFIG.easing.easeOut}`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }
    
    fadeInRight(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(50px)';
        element.style.transition = `opacity ${EFFECTS_CONFIG.durations.normal}ms ${EFFECTS_CONFIG.easing.easeOut}, transform ${EFFECTS_CONFIG.durations.normal}ms ${EFFECTS_CONFIG.easing.easeOut}`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }
    
    scaleIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.5)';
        element.style.transition = `opacity ${EFFECTS_CONFIG.durations.normal}ms ${EFFECTS_CONFIG.easing.bounce}, transform ${EFFECTS_CONFIG.durations.normal}ms ${EFFECTS_CONFIG.easing.bounce}`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        });
    }
    
    rotateIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'rotate(-180deg) scale(0.5)';
        element.style.transition = `all ${EFFECTS_CONFIG.durations.slow}ms ${EFFECTS_CONFIG.easing.bounce}`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'rotate(0deg) scale(1)';
        });
    }
    
    slideIn(element) {
        const direction = element.getAttribute('data-direction') || 'left';
        const distance = element.getAttribute('data-distance') || '100px';
        
        element.style.opacity = '0';
        
        switch (direction) {
            case 'left':
                element.style.transform = `translateX(-${distance})`;
                break;
            case 'right':
                element.style.transform = `translateX(${distance})`;
                break;
            case 'top':
                element.style.transform = `translateY(-${distance})`;
                break;
            case 'bottom':
                element.style.transform = `translateY(${distance})`;
                break;
        }
        
        element.style.transition = `all ${EFFECTS_CONFIG.durations.normal}ms ${EFFECTS_CONFIG.easing.easeOut}`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translate(0, 0)';
        });
    }
    
    zoomIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0)';
        element.style.transition = `all ${EFFECTS_CONFIG.durations.normal}ms ${EFFECTS_CONFIG.easing.bounce}`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        });
    }
    
    flipIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'perspective(400px) rotateY(90deg)';
        element.style.transition = `all ${EFFECTS_CONFIG.durations.slow}ms ${EFFECTS_CONFIG.easing.easeOut}`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'perspective(400px) rotateY(0deg)';
        });
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-counter'));
        const duration = parseInt(element.getAttribute('data-duration')) || 2000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function para suavizar la animación
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * easeOut);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target.toLocaleString();
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    animateProgress(element) {
        const target = parseInt(element.getAttribute('data-progress'));
        const duration = parseInt(element.getAttribute('data-duration')) || 1500;
        
        element.style.width = '0%';
        element.style.transition = `width ${duration}ms ${EFFECTS_CONFIG.easing.easeOut}`;
        
        requestAnimationFrame(() => {
            element.style.width = target + '%';
        });
    }
    
    initParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length === 0) return;
        
        const handleScroll = () => {
            const scrollTop = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
                const yPos = -(scrollTop * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        };
        
        // Throttle scroll event para mejor performance
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    initScrollProgress() {
        const progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) return;
        
        window.addEventListener('scroll', () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = (window.pageYOffset / scrollHeight) * 100;
            progressBar.style.width = scrollProgress + '%';
        });
    }
}

/**
 * Clase para efectos de hover avanzados
 */
class HoverEffects {
    constructor() {
        this.init();
    }
    
    init() {
        this.initMagneticEffect();
        this.initTiltEffect();
        this.initGlowEffect();
        this.initRippleEffect();
    }
    
    // ===== SECCIÓN CORREGIDA - REEMPLAZA DESDE initMagneticEffect HASTA EL FINAL =====

initMagneticEffect() {
    const magneticElements = document.querySelectorAll('[data-magnetic]');
    
    magneticElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = (e.clientX - centerX) * 0.1;
            const deltaY = (e.clientY - centerY) * 0.1;
            
            element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0)';
        });
    });
}

initTiltEffect() {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const rotateX = (e.clientY - centerY) / 10;
            const rotateY = (centerX - e.clientX) / 10;
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    });
}

initGlowEffect() {
    const glowElements = document.querySelectorAll('[data-glow]');
    
    glowElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            const glowColor = element.getAttribute('data-glow') || '#3b82f6';
            element.style.boxShadow = `0 0 20px ${glowColor}40, 0 0 40px ${glowColor}20`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.boxShadow = '';
        });
    });
}

initRippleEffect() {
    const rippleElements = document.querySelectorAll('[data-ripple]');
    
    rippleElements.forEach(element => {
        element.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            element.style.position = 'relative';
            element.style.overflow = 'hidden';
            element.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Agregar keyframes para la animación ripple
    if (!document.querySelector('#ripple-keyframes')) {
        const style = document.createElement('style');
        style.id = 'ripple-keyframes';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

} // FIN DE LA CLASE HoverEffects

/**
 * Clase para efectos de texto avanzados
 */
class TextEffects {
    constructor() {
        this.init();
    }
    
    init() {
        this.initTypewriter();
        this.initTextReveal();
        this.initGlitchText();
        this.initMorphingText();
    }
    
    initTypewriter() {
        const typewriterElements = document.querySelectorAll('[data-typewriter]');
        
        typewriterElements.forEach(element => {
            const text = element.getAttribute('data-typewriter');
            const speed = parseInt(element.getAttribute('data-speed')) || 50;
            const delay = parseInt(element.getAttribute('data-delay')) || 0;
            
            setTimeout(() => {
                this.typewriterEffect(element, text, speed);
            }, delay);
        });
    }
    
    typewriterEffect(element, text, speed) {
        element.textContent = '';
        let i = 0;
        
        const timer = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            
            if (i >= text.length) {
                clearInterval(timer);
            }
        }, speed);
    }
    
    initTextReveal() {
        const revealElements = document.querySelectorAll('[data-text-reveal]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.revealText(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        revealElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    revealText(element) {
        const text = element.textContent;
        const words = text.split(' ');
        
        element.innerHTML = words.map(word => 
            `<span class="word" style="opacity: 0; transform: translateY(20px); display: inline-block; transition: all 0.3s ease;">${word}</span>`
        ).join(' ');
        
        const wordElements = element.querySelectorAll('.word');
        wordElements.forEach((word, index) => {
            setTimeout(() => {
                word.style.opacity = '1';
                word.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    initGlitchText() {
        const glitchElements = document.querySelectorAll('[data-glitch]');
        
        glitchElements.forEach(element => {
            const originalText = element.textContent;
            
            element.addEventListener('mouseenter', () => {
                this.glitchEffect(element, originalText);
            });
        });
    }
    
    glitchEffect(element, originalText) {
        const chars = '!<>-_\\/[]{}—=+*^?#________';
        let iterations = 0;
        
        const interval = setInterval(() => {
            element.textContent = originalText
                .split('')
                .map((char, index) => {
                    if (index < iterations) {
                        return originalText[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');
            
            if (iterations >= originalText.length) {
                clearInterval(interval);
            }
            
            iterations += 1 / 3;
        }, 30);
    }
    
    initMorphingText() {
        const morphElements = document.querySelectorAll('[data-morph]');
        
        morphElements.forEach(element => {
            const texts = element.getAttribute('data-morph').split('|');
            let currentIndex = 0;
            
            setInterval(() => {
                currentIndex = (currentIndex + 1) % texts.length;
                this.morphText(element, texts[currentIndex]);
            }, 3000);
        });
    }
    
    morphText(element, newText) {
        const currentText = element.textContent;
        const maxLength = Math.max(currentText.length, newText.length);
        
        let progress = 0;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        
        const animate = () => {
            let result = '';
            
            for (let i = 0; i < maxLength; i++) {
                if (i < progress) {
                    result += newText[i] || '';
                } else if (i < currentText.length) {
                    result += chars[Math.floor(Math.random() * chars.length)];
                }
            }
            
            element.textContent = result;
            
            if (progress < newText.length) {
                progress += 1/3;
                requestAnimationFrame(animate);
            } else {
                element.textContent = newText;
            }
        };
        
        animate();
    }
}

/**
 * Clase para efectos de partículas
 */
class ParticleSystem {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            count: options.count || 50,
            speed: options.speed || 1,
            size: options.size || 2,
            color: options.color || '#3b82f6',
            interactive: options.interactive || false,
            ...options
        };
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        
        this.init();
    }
    
    init() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
        
        if (this.options.interactive) {
            this.container.addEventListener('mousemove', (e) => {
                const rect = this.container.getBoundingClientRect();
                this.mouse.x = e.clientX - rect.left;
                this.mouse.y = e.clientY - rect.top;
            });
        }
    }
    
    resize() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.options.count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.options.speed,
                vy: (Math.random() - 0.5) * this.options.speed,
                size: Math.random() * this.options.size + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });
        
        if (this.options.interactive) {
            this.drawConnections();
        }
        
        requestAnimationFrame(() => this.animate());
    }
    
    updateParticle(particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > this.canvas.width) {
            particle.vx *= -1;
        }
        if (particle.y < 0 || particle.y > this.canvas.height) {
            particle.vy *= -1;
        }
        
        if (this.options.interactive) {
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx += dx * force * 0.01;
                particle.vy += dy * force * 0.01;
            }
        }
    }
    
    drawParticle(particle) {
        this.ctx.save();
        this.ctx.globalAlpha = particle.opacity;
        this.ctx.fillStyle = this.options.color;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }
    
    drawConnections() {
        this.particles.forEach((particle, i) => {
            this.particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.save();
                    this.ctx.globalAlpha = (100 - distance) / 100 * 0.2;
                    this.ctx.strokeStyle = this.options.color;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.stroke();
                    this.ctx.restore();
                }
            });
        });
    }
}

/**
 * Utilidades para animaciones
 */
const AnimationUtils = {
    easeInOut: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeOut: (t) => t * (2 - t),
    easeIn: (t) => t * t,
    bounce: (t) => {
        if (t < 1/2.75) {
            return 7.5625 * t * t;
        } else if (t < 2/2.75) {
            return 7.5625 * (t -= 1.5/2.75) * t + 0.75;
        } else if (t < 2.5/2.75) {
            return 7.5625 * (t -= 2.25/2.75) * t + 0.9375;
        } else {
            return 7.5625 * (t -= 2.625/2.75) * t + 0.984375;
        }
    },
    
    animate: (duration, callback, easing = AnimationUtils.easeOut) => {
        const start = performance.now();
        
        const tick = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easing(progress);
            
            callback(easedProgress);
            
            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        };
        
        requestAnimationFrame(tick);
    },
    
    lerp: (start, end, progress) => {
        return start + (end - start) * progress;
    },
    
    lerpColor: (color1, color2, progress) => {
        const r1 = parseInt(color1.substr(1, 2), 16);
        const g1 = parseInt(color1.substr(3, 2), 16);
        const b1 = parseInt(color1.substr(5, 2), 16);
        
        const r2 = parseInt(color2.substr(1, 2), 16);
        const g2 = parseInt(color2.substr(3, 2), 16);
        const b2 = parseInt(color2.substr(5, 2), 16);
        
        const r = Math.round(AnimationUtils.lerp(r1, r2, progress));
        const g = Math.round(AnimationUtils.lerp(g1, g2, progress));
        const b = Math.round(AnimationUtils.lerp(b1, b2, progress));
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
};

/**
 * Inicialización de todos los efectos
 */
function initializeAllEffects() {
    new ScrollEffects();
    new HoverEffects();
    new TextEffects();
    
    const particleContainers = document.querySelectorAll('[data-particles]');
    particleContainers.forEach(container => {
        const options = JSON.parse(container.getAttribute('data-particles') || '{}');
        new ParticleSystem(container, options);
    });
    
    initializeLazyLoading();
    initializeSmoothScroll();
}

function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offsetTop = target.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Inicializar efectos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeAllEffects, 100);
});

// Exportar clases y utilidades
window.ScrollEffects = ScrollEffects;
window.HoverEffects = HoverEffects;
window.TextEffects = TextEffects;
window.ParticleSystem = ParticleSystem;
window.AnimationUtils = AnimationUtils;
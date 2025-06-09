/**
 * JavaScript Principal - Sistema de Activación Plataforma de Inglés
 * Funcionalidades principales y manejo de eventos
 */

// Variables globales
let currentUser = null;
let notifications = [];
let isLoading = false;

// Configuración de la aplicación
const APP_CONFIG = {
    API_BASE_URL: 'php/api/',
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_FILE_TYPES: ['pdf', 'jpg', 'jpeg', 'png'],
    NOTIFICATION_TIMEOUT: 5000,
    ANIMATION_DURATION: 300
};

/**
 * Inicialización de la aplicación
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Ocultar loading screen después de cargar
    setTimeout(() => {
        hideLoadingScreen();
    }, 1500);
    
    // Inicializar componentes
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeModals();
    initializeForms();
    initializeBackToTop();
    initializeParallax();
    initializeCounters();
    
    // Verificar sesión de usuario
    checkUserSession();
    
    console.log('🚀 Sistema inicializado correctamente');
}

/**
 * Manejo de Loading Screen
 */
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }
}

/**
 * Navegación
 */
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Smooth scroll para links de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                
                if (targetSection) {
                    scrollToSection(href.substring(1));
                    
                    // Cerrar menu móvil
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    
                    // Actualizar link activo
                    updateActiveNavLink(link);
                }
            }
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80; // Altura del navbar
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function updateActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

/**
 * Efectos de Scroll
 */
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observar elementos con clases de animación
    const animatedElements = document.querySelectorAll(
        '.fade-in-up, .fade-in-left, .fade-in-right, .scale-in'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Animaciones y efectos
 */
function initializeAnimations() {
    // Typewriter effect
    initializeTypewriter();
    
    // Progress bars
    initializeProgressBars();
    
    // Floating cards
    initializeFloatingCards();
    
    // Particles
    initializeParticles();
}

function initializeTypewriter() {
    const typewriterElement = document.querySelector('.typewriter');
    if (typewriterElement) {
        const text = typewriterElement.getAttribute('data-text');
        const speed = 50;
        let i = 0;
        
        typewriterElement.textContent = '';
        
        function typeWriter() {
            if (i < text.length) {
                typewriterElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        }
        
        setTimeout(typeWriter, 1000);
    }
}

function initializeProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const targetProgress = progressBar.getAttribute('data-progress') || 0;
                
                setTimeout(() => {
                    progressBar.style.width = targetProgress + '%';
                }, 500);
                
                progressObserver.unobserve(progressBar);
            }
        });
    });
    
    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });
}

function initializeFloatingCards() {
    const floatingCards = document.querySelectorAll('.floating');
    
    floatingCards.forEach((card, index) => {
        // Delay de animación escalonado
        card.style.animationDelay = `${index * 0.5}s`;
    });
}

function initializeParticles() {
    const particlesContainer = document.querySelector('.hero-particles');
    if (particlesContainer) {
        createParticles(particlesContainer, 20);
    }
}

function createParticles(container, count) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        container.appendChild(particle);
    }
}

/**
 * Modales
 */
function initializeModals() {
    // Cerrar modales al hacer clic en overlay
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            const modal = e.target.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        }
    });
    
    // Cerrar modales con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal.id);
            }
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus en el primer input
        setTimeout(() => {
            const firstInput = modal.querySelector('input, select, textarea');
            if (firstInput) {
                firstInput.focus();
            }
        }, APP_CONFIG.ANIMATION_DURATION);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Limpiar formularios
        const forms = modal.querySelectorAll('form');
        forms.forEach(form => form.reset());
    }
}

function switchModal(currentModalId, targetModalId) {
    closeModal(currentModalId);
    setTimeout(() => {
        openModal(targetModalId);
    }, APP_CONFIG.ANIMATION_DURATION);
}

/**
 * Formularios
 */
function initializeForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Validación en tiempo real
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', validateInput);
        input.addEventListener('blur', validateInput);
    });
}

async function handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    if (!validateLoginForm(data)) {
        return;
    }
    
    try {
        setFormLoading(form, true);
        
        const response = await fetch(APP_CONFIG.API_BASE_URL + 'auth/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            currentUser = result.user;
            showNotification('success', '¡Bienvenido!', 'Has iniciado sesión correctamente');
            closeModal('loginModal');
            redirectToDashboard();
        } else {
            showNotification('error', 'Error de acceso', result.message || 'Credenciales incorrectas');
        }
    } catch (error) {
        console.error('Error en login:', error);
        showNotification('error', 'Error', 'Ocurrió un error al iniciar sesión');
    } finally {
        setFormLoading(form, false);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    if (!validateRegisterForm(data)) {
        return;
    }
    
    try {
        setFormLoading(form, true);
        
        const response = await fetch(APP_CONFIG.API_BASE_URL + 'auth/register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('success', 'Registro exitoso', 'Tu cuenta ha sido creada. Revisa tu email para verificarla.');
            closeModal('registerModal');
            setTimeout(() => {
                openModal('loginModal');
            }, 1000);
        } else {
            if (result.errors) {
                Object.keys(result.errors).forEach(field => {
                    showFieldError(field, result.errors[field]);
                });
            } else {
                showNotification('error', 'Error de registro', result.message || 'No se pudo crear la cuenta');
            }
        }
    } catch (error) {
        console.error('Error en registro:', error);
        showNotification('error', 'Error', 'Ocurrió un error al crear la cuenta');
    } finally {
        setFormLoading(form, false);
    }
}

function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();
    const name = input.name;
    
    clearFieldError(name);
    
    // Validaciones específicas
    if (input.type === 'email') {
        validateEmail(input);
    } else if (input.type === 'password') {
        validatePassword(input);
    } else if (name === 'cedula') {
        validateCedula(input);
    } else if (name === 'confirmPassword') {
        validatePasswordConfirmation(input);
    }
}

function validateEmail(input) {
    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        showFieldError(input.name, 'Ingresa un email válido');
        return false;
    }
    
    return true;
}

function validatePassword(input) {
    const password = input.value;
    const minLength = 8;
    
    if (password && password.length < minLength) {
        showFieldError(input.name, `La contraseña debe tener al menos ${minLength} caracteres`);
        return false;
    }
    
    // Validar complejidad si es requerida
    if (password && input.hasAttribute('data-require-strong')) {
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
        
        if (!strongRegex.test(password)) {
            showFieldError(input.name, 'La contraseña debe contener mayúsculas, minúsculas, números y símbolos');
            return false;
        }
    }
    
    return true;
}

function validateCedula(input) {
    const cedula = input.value.trim();
    const cedulaRegex = /^[0-9\-]+$/;
    
    if (cedula && !cedulaRegex.test(cedula)) {
        showFieldError(input.name, 'La cédula solo puede contener números y guiones');
        return false;
    }
    
    return true;
}

function validatePasswordConfirmation(input) {
    const password = document.querySelector('input[name="password"]')?.value;
    const confirmPassword = input.value;
    
    if (confirmPassword && password !== confirmPassword) {
        showFieldError(input.name, 'Las contraseñas no coinciden');
        return false;
    }
    
    return true;
}

function validateLoginForm(data) {
    let isValid = true;
    
    if (!data.email) {
        showFieldError('email', 'El email es requerido');
        isValid = false;
    }
    
    if (!data.password) {
        showFieldError('password', 'La contraseña es requerida');
        isValid = false;
    }
    
    return isValid;
}

function validateRegisterForm(data) {
    let isValid = true;
    
    // Validaciones requeridas
    const requiredFields = ['nombre', 'apellido', 'email', 'cedula', 'carrera', 'semestre', 'password'];
    
    requiredFields.forEach(field => {
        if (!data[field]) {
            showFieldError(field, `El campo ${field} es requerido`);
            isValid = false;
        }
    });
    
    // Validar confirmación de contraseña
    if (data.password !== data.confirmPassword) {
        showFieldError('confirmPassword', 'Las contraseñas no coinciden');
        isValid = false;
    }
    
    // Validar términos y condiciones
    if (!data.terms) {
        showNotification('warning', 'Términos requeridos', 'Debes aceptar los términos y condiciones');
        isValid = false;
    }
    
    return isValid;
}

function showFieldError(fieldName, message) {
    const input = document.querySelector(`input[name="${fieldName}"], select[name="${fieldName}"]`);
    if (input) {
        input.classList.add('error');
        
        // Remover error existente
        const existingError = input.parentElement.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Agregar nuevo error
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = 'var(--error-color)';
        errorElement.style.fontSize = 'var(--font-size-sm)';
        errorElement.style.marginTop = 'var(--spacing-xs)';
        
        input.parentElement.appendChild(errorElement);
    }
}

function clearFieldError(fieldName) {
    const input = document.querySelector(`input[name="${fieldName}"], select[name="${fieldName}"]`);
    if (input) {
        input.classList.remove('error');
        const errorElement = input.parentElement.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
}

function setFormLoading(form, loading) {
    const submitButton = form.querySelector('button[type="submit"]');
    const inputs = form.querySelectorAll('input, select, button');
    
    if (loading) {
        submitButton?.classList.add('loading');
        inputs.forEach(input => input.disabled = true);
        isLoading = true;
    } else {
        submitButton?.classList.remove('loading');
        inputs.forEach(input => input.disabled = false);
        isLoading = false;
    }
}

/**
 * Notificaciones
 */
function showNotification(type, title, message, duration = APP_CONFIG.NOTIFICATION_TIMEOUT) {
    const notificationsContainer = document.getElementById('notifications');
    if (!notificationsContainer) return;
    
    const notification = createNotificationElement(type, title, message);
    notificationsContainer.appendChild(notification);
    
    // Mostrar notificación
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto-ocultar notificación
    const autoHideTimer = setTimeout(() => {
        hideNotification(notification);
    }, duration);
    
    // Permitir cerrar manualmente
    const closeButton = notification.querySelector('.notification-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            clearTimeout(autoHideTimer);
            hideNotification(notification);
        });
    }
    
    return notification;
}

function createNotificationElement(type, title, message) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <div class="notification-header">
            <div class="notification-title">
                <i class="${icons[type] || icons.info}"></i>
                ${title}
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="notification-message">${message}</div>
        <div class="notification-progress"></div>
    `;
    
    return notification;
}

function hideNotification(notification) {
    notification.classList.add('hide');
    setTimeout(() => {
        notification.remove();
    }, APP_CONFIG.ANIMATION_DURATION);
}

/**
 * Back to Top
 */
function initializeBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    if (!backToTopButton) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Parallax Effects
 */
function initializeParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    if (parallaxElements.length === 0) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

/**
 * Contadores animados
 */
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

/**
 * Utilidades de Password
 */
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentElement.querySelector('.password-toggle');
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

/**
 * Sesión de usuario
 */
async function checkUserSession() {
    try {
        const response = await fetch(APP_CONFIG.API_BASE_URL + 'auth/check-session.php', {
            credentials: 'include'
        });
        
        const result = await response.json();
        
        if (result.success && result.user) {
            currentUser = result.user;
            updateUIForLoggedUser();
        }
    } catch (error) {
        console.log('No hay sesión activa');
    }
}

function updateUIForLoggedUser() {
    if (!currentUser) return;
    
    // Actualizar navegación
    const loginButton = document.querySelector('.btn-login');
    if (loginButton) {
        loginButton.textContent = currentUser.nombre;
        loginButton.onclick = () => openUserMenu();
    }
    
    // Mostrar opciones de usuario logueado
    console.log(`Usuario conectado: ${currentUser.nombre} (${currentUser.rol})`);
}

function redirectToDashboard() {
    if (!currentUser) return;
    
    // Redireccionar según el rol
    const dashboardUrls = {
        'estudiante': 'dashboard/student.html',
        'profesor': 'dashboard/teacher.html',
        'administrador': 'dashboard/admin.html'
    };
    
    const url = dashboardUrls[currentUser.rol] || 'dashboard/student.html';
    
    setTimeout(() => {
        window.location.href = url;
    }, 1000);
}

/**
 * Manejo de archivos
 */
function validateFile(file) {
    const errors = [];
    
    // Validar tamaño
    if (file.size > APP_CONFIG.MAX_FILE_SIZE) {
        errors.push(`El archivo es demasiado grande. Máximo: ${formatFileSize(APP_CONFIG.MAX_FILE_SIZE)}`);
    }
    
    // Validar tipo
    const extension = file.name.split('.').pop().toLowerCase();
    if (!APP_CONFIG.ALLOWED_FILE_TYPES.includes(extension)) {
        errors.push(`Tipo de archivo no permitido. Formatos aceptados: ${APP_CONFIG.ALLOWED_FILE_TYPES.join(', ')}`);
    }
    
    return errors;
}

function formatFileSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * Utilidades generales
 */
function formatDate(dateString, format = 'dd/mm/yyyy') {
    const date = new Date(dateString);
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    switch (format) {
        case 'dd/mm/yyyy':
            return `${day}/${month}/${year}`;
        case 'dd/mm/yyyy hh:mm':
            return `${day}/${month}/${year} ${hours}:${minutes}`;
        default:
            return date.toLocaleDateString();
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * API Helper functions
 */
async function apiRequest(endpoint, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    };
    
    const config = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(APP_CONFIG.API_BASE_URL + endpoint, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error en la solicitud');
        }
        
        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

/**
 * Local Storage helpers
 */
function setLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function getLocalStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
}

function removeLocalStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing from localStorage:', error);
    }
}

/**
 * Error handling
 */
window.addEventListener('error', (event) => {
    console.error('JavaScript Error:', event.error);
    
    if (!isLoading) {
        showNotification('error', 'Error', 'Ocurrió un error inesperado');
    }
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    
    if (!isLoading) {
        showNotification('error', 'Error', 'Error en la comunicación con el servidor');
    }
});

/**
 * Funciones globales disponibles
 */
window.openModal = openModal;
window.closeModal = closeModal;
window.switchModal = switchModal;
window.togglePassword = togglePassword;
window.scrollToSection = scrollToSection;
window.showNotification = showNotification;

// Export para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        APP_CONFIG,
        apiRequest,
        formatDate,
        formatFileSize,
        validateFile,
        showNotification,
        setLocalStorage,
        getLocalStorage,
        removeLocalStorage
    };
}
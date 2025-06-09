/**
 * Sistema de Validaciones JavaScript
 * Manejo de validaciones de formularios y datos
 */

/**
 * Configuración de validaciones
 */
const VALIDATION_CONFIG = {
    // Expresiones regulares
    patterns: {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[0-9\-\+\s\(\)]+$/,
        cedula: /^[0-9PE\-]+$/,
        strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        alphanumeric: /^[a-zA-Z0-9\s]+$/,
        alphabetic: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        numeric: /^[0-9]+$/
    },
    
    // Longitudes mínimas y máximas
    lengths: {
        password: { min: 8, max: 128 },
        name: { min: 2, max: 50 },
        email: { min: 5, max: 255 },
        cedula: { min: 8, max: 15 },
        phone: { min: 7, max: 20 }
    },
    
    // Mensajes de error
    messages: {
        required: 'Este campo es obligatorio',
        email: 'Ingresa un email válido',
        phone: 'Ingresa un teléfono válido',
        cedula: 'Ingresa una cédula válida',
        minLength: 'Mínimo {min} caracteres',
        maxLength: 'Máximo {max} caracteres',
        pattern: 'Formato inválido',
        passwordMismatch: 'Las contraseñas no coinciden',
        strongPassword: 'La contraseña debe contener mayúsculas, minúsculas, números y símbolos',
        fileSize: 'El archivo es demasiado grande (máximo {max})',
        fileType: 'Tipo de archivo no permitido',
        numeric: 'Solo se permiten números',
        alphabetic: 'Solo se permiten letras',
        alphanumeric: 'Solo se permiten letras y números'
    }
};

/**
 * Clase principal para validaciones
 */
class FormValidator {
    constructor(form, rules = {}) {
        this.form = form;
        this.rules = rules;
        this.errors = {};
        this.isValid = true;
        
        this.init();
    }
    
    init() {
        // Agregar event listeners
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Validación en tiempo real
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input.name));
        });
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        if (this.validateForm()) {
            this.onSuccess();
        } else {
            this.onError();
        }
    }
    
    validateForm() {
        this.errors = {};
        this.isValid = true;
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Validar cada campo según las reglas
        Object.keys(this.rules).forEach(fieldName => {
            const value = data[fieldName] || '';
            const fieldRules = this.rules[fieldName];
            
            this.validateFieldValue(fieldName, value, fieldRules);
        });
        
        // Validaciones personalizadas
        this.customValidations(data);
        
        // Mostrar errores
        this.displayErrors();
        
        return this.isValid;
    }
    
    validateField(input) {
        const fieldName = input.name;
        const value = input.value.trim();
        const fieldRules = this.rules[fieldName];
        
        if (!fieldRules) return true;
        
        this.clearFieldError(fieldName);
        
        const isValid = this.validateFieldValue(fieldName, value, fieldRules);
        
        if (!isValid) {
            this.displayFieldError(fieldName);
        }
        
        return isValid;
    }
    
    validateFieldValue(fieldName, value, rules) {
        let fieldValid = true;
        
        // Validar required
        if (rules.required && !value) {
            this.addError(fieldName, VALIDATION_CONFIG.messages.required);
            fieldValid = false;
        }
        
        // Si el campo está vacío y no es requerido, no validar más
        if (!value && !rules.required) {
            return fieldValid;
        }
        
        // Validar tipo de dato
        if (rules.type) {
            switch (rules.type) {
                case 'email':
                    if (!this.validateEmail(value)) {
                        this.addError(fieldName, VALIDATION_CONFIG.messages.email);
                        fieldValid = false;
                    }
                    break;
                case 'phone':
                    if (!this.validatePhone(value)) {
                        this.addError(fieldName, VALIDATION_CONFIG.messages.phone);
                        fieldValid = false;
                    }
                    break;
                case 'cedula':
                    if (!this.validateCedula(value)) {
                        this.addError(fieldName, VALIDATION_CONFIG.messages.cedula);
                        fieldValid = false;
                    }
                    break;
                case 'password':
                    if (!this.validatePassword(value, rules)) {
                        fieldValid = false;
                    }
                    break;
                case 'numeric':
                    if (!VALIDATION_CONFIG.patterns.numeric.test(value)) {
                        this.addError(fieldName, VALIDATION_CONFIG.messages.numeric);
                        fieldValid = false;
                    }
                    break;
                case 'alphabetic':
                    if (!VALIDATION_CONFIG.patterns.alphabetic.test(value)) {
                        this.addError(fieldName, VALIDATION_CONFIG.messages.alphabetic);
                        fieldValid = false;
                    }
                    break;
                case 'alphanumeric':
                    if (!VALIDATION_CONFIG.patterns.alphanumeric.test(value)) {
                        this.addError(fieldName, VALIDATION_CONFIG.messages.alphanumeric);
                        fieldValid = false;
                    }
                    break;
            }
        }
        
        // Validar longitud mínima
        if (rules.minLength && value.length < rules.minLength) {
            this.addError(fieldName, VALIDATION_CONFIG.messages.minLength.replace('{min}', rules.minLength));
            fieldValid = false;
        }
        
        // Validar longitud máxima
        if (rules.maxLength && value.length > rules.maxLength) {
            this.addError(fieldName, VALIDATION_CONFIG.messages.maxLength.replace('{max}', rules.maxLength));
            fieldValid = false;
        }
        
        // Validar patrón personalizado
        if (rules.pattern && !rules.pattern.test(value)) {
            this.addError(fieldName, rules.message || VALIDATION_CONFIG.messages.pattern);
            fieldValid = false;
        }
        
        // Validar función personalizada
        if (rules.validator && typeof rules.validator === 'function') {
            const customResult = rules.validator(value, this.getFormData());
            if (customResult !== true) {
                this.addError(fieldName, customResult || 'Valor inválido');
                fieldValid = false;
            }
        }
        
        return fieldValid;
    }
    
    validateEmail(email) {
        return VALIDATION_CONFIG.patterns.email.test(email);
    }
    
    validatePhone(phone) {
        const cleanPhone = phone.replace(/\s/g, '');
        return VALIDATION_CONFIG.patterns.phone.test(cleanPhone) && 
               cleanPhone.length >= VALIDATION_CONFIG.lengths.phone.min;
    }
    
    validateCedula(cedula) {
        const cleanCedula = cedula.replace(/\-/g, '');
        return VALIDATION_CONFIG.patterns.cedula.test(cedula) && 
               cleanCedula.length >= VALIDATION_CONFIG.lengths.cedula.min;
    }
    
    validatePassword(password, rules = {}) {
        let isValid = true;
        
        // Longitud mínima
        if (password.length < VALIDATION_CONFIG.lengths.password.min) {
            this.addError('password', VALIDATION_CONFIG.messages.minLength.replace('{min}', VALIDATION_CONFIG.lengths.password.min));
            isValid = false;
        }
        
        // Validar complejidad si es requerida
        if (rules.strong && !VALIDATION_CONFIG.patterns.strongPassword.test(password)) {
            this.addError('password', VALIDATION_CONFIG.messages.strongPassword);
            isValid = false;
        }
        
        return isValid;
    }
    
    customValidations(data) {
        // Validar confirmación de contraseña
        if (data.password && data.confirmPassword) {
            if (data.password !== data.confirmPassword) {
                this.addError('confirmPassword', VALIDATION_CONFIG.messages.passwordMismatch);
            }
        }
        
        // Validar edad mínima
        if (data.birthDate) {
            const age = this.calculateAge(data.birthDate);
            if (age < 18) {
                this.addError('birthDate', 'Debes ser mayor de 18 años');
            }
        }
        
        // Validar email institucional
        if (data.email && this.rules.email?.institutional) {
            if (!data.email.includes('@universidad.edu')) {
                this.addError('email', 'Debes usar tu email institucional (@universidad.edu)');
            }
        }
    }
    
    calculateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    }
    
    addError(fieldName, message) {
        if (!this.errors[fieldName]) {
            this.errors[fieldName] = [];
        }
        this.errors[fieldName].push(message);
        this.isValid = false;
    }
    
    clearFieldError(fieldName) {
        if (this.errors[fieldName]) {
            delete this.errors[fieldName];
        }
        
        // Limpiar UI
        const input = this.form.querySelector(`[name="${fieldName}"]`);
        if (input) {
            input.classList.remove('error', 'invalid');
            const errorElement = input.parentElement.querySelector('.field-error');
            if (errorElement) {
                errorElement.remove();
            }
        }
    }
    
    displayErrors() {
        Object.keys(this.errors).forEach(fieldName => {
            this.displayFieldError(fieldName);
        });
    }
    
    displayFieldError(fieldName) {
        const input = this.form.querySelector(`[name="${fieldName}"]`);
        const errors = this.errors[fieldName];
        
        if (!input || !errors) return;
        
        input.classList.add('error', 'invalid');
        
        // Remover error anterior
        const existingError = input.parentElement.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Crear elemento de error
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.innerHTML = errors.join('<br>');
        
        // Estilos del error
        Object.assign(errorElement.style, {
            color: 'var(--error-color)',
            fontSize: 'var(--font-size-sm)',
            marginTop: 'var(--spacing-xs)',
            display: 'block'
        });
        
        // Insertar después del input
        input.parentElement.appendChild(errorElement);
        
        // Enfocar el primer campo con error
        if (Object.keys(this.errors).indexOf(fieldName) === 0) {
            input.focus();
        }
    }
    
    getFormData() {
        const formData = new FormData(this.form);
        return Object.fromEntries(formData);
    }
    
    onSuccess() {
        // Método a sobrescribir
        console.log('Formulario válido');
    }
    
    onError() {
        // Método a sobrescribir
        console.log('Errores en el formulario:', this.errors);
    }
}

/**
 * Validador específico para archivos
 */
class FileValidator {
    constructor(config = {}) {
        this.maxSize = config.maxSize || 5 * 1024 * 1024; // 5MB por defecto
        this.allowedTypes = config.allowedTypes || ['jpg', 'jpeg', 'png', 'pdf'];
        this.maxFiles = config.maxFiles || 1;
    }
    
    validate(files) {
        const errors = [];
        
        if (!files || files.length === 0) {
            return { valid: false, errors: ['No se ha seleccionado ningún archivo'] };
        }
        
        if (files.length > this.maxFiles) {
            errors.push(`Máximo ${this.maxFiles} archivo(s) permitido(s)`);
        }
        
        Array.from(files).forEach((file, index) => {
            const fileErrors = this.validateSingleFile(file, index);
            errors.push(...fileErrors);
        });
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    }
    
    validateSingleFile(file, index = 0) {
        const errors = [];
        const prefix = this.maxFiles > 1 ? `Archivo ${index + 1}: ` : '';
        
        // Validar tamaño
        if (file.size > this.maxSize) {
            errors.push(`${prefix}Tamaño demasiado grande (máximo ${this.formatFileSize(this.maxSize)})`);
        }
        
        // Validar tipo
        const extension = file.name.split('.').pop().toLowerCase();
        if (!this.allowedTypes.includes(extension)) {
            errors.push(`${prefix}Tipo no permitido. Formatos aceptados: ${this.allowedTypes.join(', ')}`);
        }
        
        // Validar nombre del archivo
        if (file.name.length > 255) {
            errors.push(`${prefix}Nombre demasiado largo`);
        }
        
        // Validar caracteres especiales en el nombre
        const invalidChars = /[<>:"/\\|?*]/;
        if (invalidChars.test(file.name)) {
            errors.push(`${prefix}Nombre contiene caracteres no permitidos`);
        }
        
        return errors;
    }
    
    formatFileSize(bytes) {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return `${size.toFixed(1)} ${units[unitIndex]}`;
    }
}

/**
 * Validaciones específicas para formularios de la aplicación
 */

// Reglas para el formulario de login
const loginValidationRules = {
    email: {
        required: true,
        type: 'email'
    },
    password: {
        required: true,
        minLength: 1
    }
};

// Reglas para el formulario de registro
const registerValidationRules = {
    nombre: {
        required: true,
        type: 'alphabetic',
        minLength: 2,
        maxLength: 50
    },
    apellido: {
        required: true,
        type: 'alphabetic',
        minLength: 2,
        maxLength: 50
    },
    email: {
        required: true,
        type: 'email',
        institutional: true
    },
    cedula: {
        required: true,
        type: 'cedula',
        minLength: 8,
        maxLength: 15
    },
    telefono: {
        required: false,
        type: 'phone'
    },
    carrera: {
        required: true
    },
    semestre: {
        required: true,
        type: 'numeric',
        validator: (value) => {
            const num = parseInt(value);
            if (num < 1 || num > 12) {
                return 'Selecciona un semestre válido (1-12)';
            }
            return true;
        }
    },
    password: {
        required: true,
        type: 'password',
        strong: true,
        minLength: 8
    },
    confirmPassword: {
        required: true
    }
};

// Reglas para solicitud de activación
const activationRequestRules = {
    periodo_academico: {
        required: true
    },
    recibo_matricula: {
        required: true,
        validator: function(value, data) {
            const fileInput = document.querySelector('input[name="recibo_matricula"]');
            if (fileInput && fileInput.files.length > 0) {
                const fileValidator = new FileValidator({
                    maxSize: 5 * 1024 * 1024,
                    allowedTypes: ['pdf', 'jpg', 'jpeg', 'png']
                });
                
                const result = fileValidator.validate(fileInput.files);
                if (!result.valid) {
                    return result.errors.join(', ');
                }
            }
            return true;
        }
    }
};

/**
 * Inicialización de validadores para formularios específicos
 */
function initializeFormValidators() {
    // Validador para login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const loginValidator = new FormValidator(loginForm, loginValidationRules);
        loginValidator.onSuccess = function() {
            handleLoginSubmit(this.getFormData());
        };
    }
    
    // Validador para registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        const registerValidator = new FormValidator(registerForm, registerValidationRules);
        registerValidator.onSuccess = function() {
            handleRegisterSubmit(this.getFormData());
        };
    }
    
    // Validador para solicitud de activación
    const activationForm = document.getElementById('activationRequestForm');
    if (activationForm) {
        const activationValidator = new FormValidator(activationForm, activationRequestRules);
        activationValidator.onSuccess = function() {
            handleActivationRequestSubmit(this.getFormData());
        };
    }
}

/**
 * Funciones de manejo de envío de formularios
 */
async function handleLoginSubmit(data) {
    try {
        const response = await fetch('php/api/auth/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('success', '¡Bienvenido!', 'Has iniciado sesión correctamente');
            closeModal('loginModal');
            // Redireccionar al dashboard
            setTimeout(() => {
                window.location.href = `dashboard/${result.user.rol}.html`;
            }, 1000);
        } else {
            showNotification('error', 'Error de acceso', result.message || 'Credenciales incorrectas');
        }
    } catch (error) {
        console.error('Error en login:', error);
        showNotification('error', 'Error', 'Ocurrió un error al iniciar sesión');
    }
}

async function handleRegisterSubmit(data) {
    try {
        const response = await fetch('php/api/auth/register.php', {
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
            showNotification('error', 'Error de registro', result.message || 'No se pudo crear la cuenta');
        }
    } catch (error) {
        console.error('Error en registro:', error);
        showNotification('error', 'Error', 'Ocurrió un error al crear la cuenta');
    }
}

async function handleActivationRequestSubmit(data) {
    try {
        const formData = new FormData();
        
        // Agregar datos del formulario
        Object.keys(data).forEach(key => {
            if (key !== 'recibo_matricula') {
                formData.append(key, data[key]);
            }
        });
        
        // Agregar archivo
        const fileInput = document.querySelector('input[name="recibo_matricula"]');
        if (fileInput && fileInput.files.length > 0) {
            formData.append('recibo_matricula', fileInput.files[0]);
        }
        
        const response = await fetch('php/api/requests/create.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('success', 'Solicitud creada', `Tu solicitud ${result.request.numero_solicitud} ha sido enviada correctamente`);
            // Limpiar formulario y cerrar modal si existe
            document.getElementById('activationRequestForm').reset();
        } else {
            showNotification('error', 'Error', result.message || 'No se pudo crear la solicitud');
        }
    } catch (error) {
        console.error('Error en solicitud:', error);
        showNotification('error', 'Error', 'Ocurrió un error al enviar la solicitud');
    }
}

/**
 * Utilidades de validación
 */
const ValidationUtils = {
    // Validar cédula panameña
    validatePanamanianCedula(cedula) {
        const cleanCedula = cedula.replace(/\-/g, '');
        
        // Verificar formato básico
        if (!/^[0-9PE]{8,15}$/.test(cleanCedula)) {
            return false;
        }
        
        // Validaciones específicas para cédula panameña
        if (cleanCedula.startsWith('PE')) {
            return cleanCedula.length >= 10;
        } else {
            return cleanCedula.length >= 8;
        }
    },
    
    // Validar email institucional
    validateInstitutionalEmail(email) {
        const institutionalDomains = [
            '@universidad.edu',
            '@estudiantes.universidad.edu',
            '@utp.ac.pa',
            '@usma.ac.pa'
        ];
        
        return institutionalDomains.some(domain => email.endsWith(domain));
    },
    
    // Validar fortaleza de contraseña
    getPasswordStrength(password) {
        let score = 0;
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            numbers: /\d/.test(password),
            symbols: /[@$!%*?&]/.test(password)
        };
        
        Object.values(checks).forEach(check => {
            if (check) score++;
        });
        
        const strength = ['Muy débil', 'Débil', 'Regular', 'Buena', 'Muy fuerte'][score - 1] || 'Muy débil';
        const percentage = Math.max((score / 5) * 100, 20);
        
        return { score, strength, percentage, checks };
    },
    
    // Sanitizar entrada de texto
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        return input
            .trim()
            .replace(/[<>\"']/g, '') // Remover caracteres peligrosos
            .replace(/\s+/g, ' '); // Normalizar espacios
    },
    
    // Validar fecha
    validateDate(dateString, minAge = 0, maxAge = 120) {
        const date = new Date(dateString);
        const today = new Date();
        
        if (isNaN(date.getTime())) {
            return { valid: false, message: 'Fecha inválida' };
        }
        
        if (date > today) {
            return { valid: false, message: 'La fecha no puede ser futura' };
        }
        
        const age = today.getFullYear() - date.getFullYear();
        
        if (age < minAge) {
            return { valid: false, message: `Debes tener al menos ${minAge} años` };
        }
        
        if (age > maxAge) {
            return { valid: false, message: `La edad no puede ser mayor a ${maxAge} años` };
        }
        
        return { valid: true };
    }
};

/**
 * Componente para mostrar fortaleza de contraseña
 */
function createPasswordStrengthIndicator(passwordInput) {
    const container = document.createElement('div');
    container.className = 'password-strength-indicator';
    container.innerHTML = `
        <div class="strength-bar">
            <div class="strength-fill"></div>
        </div>
        <div class="strength-text">Ingresa una contraseña</div>
        <ul class="strength-requirements">
            <li data-requirement="length">Al menos 8 caracteres</li>
            <li data-requirement="lowercase">Una letra minúscula</li>
            <li data-requirement="uppercase">Una letra mayúscula</li>
            <li data-requirement="numbers">Un número</li>
            <li data-requirement="symbols">Un símbolo (@$!%*?&)</li>
        </ul>
    `;
    
    // Estilos
    const style = document.createElement('style');
    style.textContent = `
        .password-strength-indicator {
            margin-top: var(--spacing-sm);
            font-size: var(--font-size-sm);
        }
        .strength-bar {
            height: 4px;
            background: var(--gray-200);
            border-radius: 2px;
            overflow: hidden;
            margin-bottom: var(--spacing-xs);
        }
        .strength-fill {
            height: 100%;
            transition: all 0.3s ease;
            border-radius: 2px;
        }
        .strength-text {
            margin-bottom: var(--spacing-sm);
            font-weight: var(--font-weight-medium);
        }
        .strength-requirements {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .strength-requirements li {
            padding: 2px 0;
            color: var(--gray-500);
            transition: color 0.3s ease;
        }
        .strength-requirements li.met {
            color: var(--success-color);
        }
        .strength-requirements li::before {
            content: '✗';
            margin-right: var(--spacing-xs);
            color: var(--error-color);
        }
        .strength-requirements li.met::before {
            content: '✓';
            color: var(--success-color);
        }
    `;
    
    if (!document.querySelector('#password-strength-styles')) {
        style.id = 'password-strength-styles';
        document.head.appendChild(style);
    }
    
    // Event listener para actualizar indicador
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = ValidationUtils.getPasswordStrength(password);
        
        // Actualizar barra
        const fill = container.querySelector('.strength-fill');
        const text = container.querySelector('.strength-text');
        
        fill.style.width = strength.percentage + '%';
        text.textContent = password ? strength.strength : 'Ingresa una contraseña';
        
        // Actualizar color de la barra
        const colors = ['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#16a34a'];
        fill.style.backgroundColor = colors[strength.score - 1] || '#ef4444';
        
        // Actualizar requisitos
        Object.keys(strength.checks).forEach(requirement => {
            const li = container.querySelector(`[data-requirement="${requirement}"]`);
            if (li) {
                li.classList.toggle('met', strength.checks[requirement]);
            }
        });
    });
    
    // Insertar después del input de contraseña
    passwordInput.parentElement.appendChild(container);
    
    return container;
}

/**
 * Inicializar indicadores de fortaleza de contraseña
 */
function initPasswordStrengthIndicators() {
    const passwordInputs = document.querySelectorAll('input[type="password"][name="password"]');
    passwordInputs.forEach(input => {
        if (!input.parentElement.querySelector('.password-strength-indicator')) {
            createPasswordStrengthIndicator(input);
        }
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeFormValidators();
    initPasswordStrengthIndicators();
});

// Exportar para uso global
window.FormValidator = FormValidator;
window.FileValidator = FileValidator;
window.ValidationUtils = ValidationUtils;
window.VALIDATION_CONFIG = VALIDATION_CONFIG;
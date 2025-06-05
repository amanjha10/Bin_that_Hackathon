// Contact Form JavaScript - Enhanced Version

document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeFileUpload();
    initializeFormValidation();
    initializeCharacterCount();
    console.log('Contact form initialized successfully!');
});

// Main contact form initialization
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');

    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        await handleFormSubmission();
    });
}

// Form validation
function initializeFormValidation() {
    const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
    
    requiredFields.forEach(field => {
        field.addEventListener('blur', validateField);
        field.addEventListener('input', clearFieldError);
    });
}

function validateField(e) {
    const field = e.target;
    const fieldGroup = field.closest('.form-group');
    
    // Remove existing error
    clearFieldError(e);
    
    let isValid = true;
    let errorMessage = '';
    
    // Check if field is empty
    if (!field.value.trim()) {
        isValid = false;
        errorMessage = 'This field is required.';
    }
    
    // Email validation
    if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }
    
    // Phone validation (basic)
    if (field.type === 'tel' && field.value.trim()) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(field.value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number.';
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function clearFieldError(e) {
    const field = e.target;
    const fieldGroup = field.closest('.form-group');
    const existingError = fieldGroup.querySelector('.field-error');
    
    if (existingError) {
        existingError.remove();
    }
    
    field.style.borderColor = '#ecf0f1';
}

function showFieldError(field, message) {
    const fieldGroup = field.closest('.form-group');
    
    // Create error element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = `
        color: #e74c3c;
        font-size: 12px;
        margin-top: 5px;
        display: flex;
        align-items: center;
        gap: 5px;
    `;
    errorDiv.innerHTML = `<span>⚠️</span> ${message}`;
    
    // Add error styling to field
    field.style.borderColor = '#e74c3c';
    
    // Insert error message
    fieldGroup.appendChild(errorDiv);
}

function validateForm() {
    const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
    let isFormValid = true;
    
    requiredFields.forEach(field => {
        const fieldValid = validateField({ target: field });
        if (!fieldValid) {
            isFormValid = false;
        }
    });
    
    // Check if at least one contact method is selected
    const contactMethods = document.querySelectorAll('input[name="contactMethod"]:checked');
    if (contactMethods.length === 0) {
        showNotification('Please select at least one preferred contact method.', 'error');
        isFormValid = false;
    }
    
    return isFormValid;
}

// File upload functionality
function initializeFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('photoUpload');
    const uploadedFilesContainer = document.getElementById('uploadedFiles');
    
    if (!uploadArea || !fileInput) return;
    
    let uploadedFiles = [];
    const maxFiles = 5;
    const maxFileSize = 10 * 1024 * 1024; // 10MB in bytes
    
    // Click to upload
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
        handleFileSelection(e.target.files);
    });
    
    // Drag and drop functionality
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFileSelection(e.dataTransfer.files);
    });
    
    function handleFileSelection(files) {
        const filesArray = Array.from(files);
        
        // Check total file limit
        if (uploadedFiles.length + filesArray.length > maxFiles) {
            showNotification(`You can only upload a maximum of ${maxFiles} files.`, 'error');
            return;
        }
        
        filesArray.forEach(file => {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                showNotification(`${file.name} is not a valid image file.`, 'error');
                return;
            }
            
            // Validate file size
            if (file.size > maxFileSize) {
                showNotification(`${file.name} is too large. Maximum size is 10MB.`, 'error');
                return;
            }
            
            // Add file to uploaded files
            uploadedFiles.push(file);
            displayUploadedFile(file);
        });
        
        updateFileInput();
    }
    
    function displayUploadedFile(file) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.dataset.fileName = file.name;
        
        // Create thumbnail for image
        const reader = new FileReader();
        reader.onload = (e) => {
            fileItem.innerHTML = `
                <div class="file-info">
                    <img src="${e.target.result}" alt="${file.name}" class="file-icon">
                    <div class="file-details">
                        <div class="file-name">${file.name}</div>
                        <div class="file-size">${formatFileSize(file.size)}</div>
                    </div>
                </div>
                <button type="button" class="file-remove" title="Remove file">×</button>
            `;
            
            // Add remove functionality
            const removeBtn = fileItem.querySelector('.file-remove');
            removeBtn.addEventListener('click', () => {
                removeUploadedFile(file.name);
                fileItem.remove();
            });
            
            uploadedFilesContainer.appendChild(fileItem);
        };
        reader.readAsDataURL(file);
    }
    
    function removeUploadedFile(fileName) {
        uploadedFiles = uploadedFiles.filter(file => file.name !== fileName);
        updateFileInput();
    }
    
    function updateFileInput() {
        // Update upload area text
        const uploadText = uploadArea.querySelector('.upload-text strong');
        if (uploadedFiles.length === 0) {
            uploadText.textContent = 'Click to upload';
        } else {
            uploadText.textContent = `Add more files (${uploadedFiles.length}/${maxFiles})`;
        }
        
        // Disable upload area if max files reached
        if (uploadedFiles.length >= maxFiles) {
            uploadArea.style.opacity = '0.5';
            uploadArea.style.pointerEvents = 'none';
            uploadText.textContent = 'Maximum files reached';
        } else {
            uploadArea.style.opacity = '1';
            uploadArea.style.pointerEvents = 'auto';
        }
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Character count functionality
function initializeCharacterCount() {
    const messageTextarea = document.getElementById('message');
    const charCountSpan = document.getElementById('charCount');
    const maxChars = 1000;
    
    if (!messageTextarea || !charCountSpan) return;
    
    messageTextarea.addEventListener('input', function() {
        const currentLength = this.value.length;
        charCountSpan.textContent = currentLength;
        
        // Change color based on character count
        if (currentLength > maxChars * 0.9) {
            charCountSpan.style.color = '#e74c3c';
        } else if (currentLength > maxChars * 0.7) {
            charCountSpan.style.color = '#f39c12';
        } else {
            charCountSpan.style.color = '#666';
        }
        
        // Prevent exceeding max characters
        if (currentLength > maxChars) {
            this.value = this.value.substring(0, maxChars);
            charCountSpan.textContent = maxChars;
            showNotification('Maximum character limit reached.', 'warning');
        }
    });
}

// Form submission handler
async function handleFormSubmission() {
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const formStatus = document.getElementById('formStatus');
    
    // Show loading state
    btnText.style.display = 'none';
    btnLoader.style.display = 'flex';
    submitBtn.disabled = true;
    
    try {
        // Collect form data
        const formData = collectFormData();
        
        // Simulate form submission (replace with actual API call)
        await simulateFormSubmission(formData);
        
        // Show success message
        showFormStatus('success', 'Thank you for your message! We\'ll get back to you within 24 hours.');
        resetForm();
        
    } catch (error) {
        console.error('Form submission error:', error);
        showFormStatus('error', 'Sorry, there was an error sending your message. Please try again.');
    } finally {
        // Reset button state
        btnText.style.display = 'block';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;
    }
}

function collectFormData() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    
    // Add uploaded files
    const uploadedFiles = document.querySelectorAll('.file-item');
    uploadedFiles.forEach((item, index) => {
        const fileName = item.dataset.fileName;
        // In a real application, you would add the actual file data here
        formData.append(`uploadedFile_${index}`, fileName);
    });
    
    // Convert FormData to object for easier handling
    const data = {};
    for (let [key, value] of formData.entries()) {
        if (data[key]) {
            // Handle multiple values (like contact methods)
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }
    
    return data;
}

async function simulateFormSubmission(formData) {
    // Simulate API call delay
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate random success/failure for demo
            if (Math.random() > 0.1) { // 90% success rate
                resolve({ success: true, id: Date.now() });
            } else {
                reject(new Error('Simulated server error'));
            }
        }, 2000);
    });
}

function showFormStatus(type, message) {
    const formStatus = document.getElementById('formStatus');
    formStatus.className = `form-status ${type}`;
    formStatus.textContent = message;
    formStatus.style.display = 'block';
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        formStatus.style.display = 'none';
    }, 10000);
}

function resetForm() {
    const form = document.getElementById('contactForm');
    form.reset();
    
    // Reset file uploads
    const uploadedFilesContainer = document.getElementById('uploadedFiles');
    uploadedFilesContainer.innerHTML = '';
    
    // Reset upload area
    const uploadArea = document.getElementById('uploadArea');
    const uploadText = uploadArea.querySelector('.upload-text strong');
    uploadText.textContent = 'Click to upload';
    uploadArea.style.opacity = '1';
    uploadArea.style.pointerEvents = 'auto';
    
    // Reset character count
    const charCountSpan = document.getElementById('charCount');
    if (charCountSpan) {
        charCountSpan.textContent = '0';
        charCountSpan.style.color = '#666';
    }
    
    // Clear any field errors
    document.querySelectorAll('.field-error').forEach(error => error.remove());
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.style.borderColor = '#ecf0f1';
    });
}

// Notification system (reused from main script)
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close" aria-label="Close notification">&times;</button>
    `;
    
    // Set styles
    const styles = {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '10px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        minWidth: '300px',
        maxWidth: '400px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    };
    
    // Set background color based on type
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    
    styles.backgroundColor = colors[type] || colors.info;
    
    // Apply styles
    Object.assign(notification.style, styles);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
        line-height: 1;
    `;
    
    const closeNotification = () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    };
    
    closeButton.addEventListener('click', closeNotification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            closeNotification();
        }
    }, 5000);
}

// Mobile menu functionality (if needed on contact page)
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Accessibility improvements
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu and notifications
    if (e.key === 'Escape') {
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
        
        // Close notifications
        const notification = document.querySelector('.notification');
        if (notification) {
            notification.querySelector('.notification-close').click();
        }
    }
});

// Form auto-save to prevent data loss (optional)
function initializeAutoSave() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const formFields = form.querySelectorAll('input, select, textarea');
    
    formFields.forEach(field => {
        // Load saved data
        const savedValue = sessionStorage.getItem(`contact_form_${field.name}`);
        if (savedValue && field.type !== 'file') {
            if (field.type === 'checkbox' || field.type === 'radio') {
                field.checked = savedValue === 'true';
            } else {
                field.value = savedValue;
            }
        }
        
        // Save data on change
        field.addEventListener('input', () => {
            if (field.type === 'checkbox' || field.type === 'radio') {
                sessionStorage.setItem(`contact_form_${field.name}`, field.checked);
            } else {
                sessionStorage.setItem(`contact_form_${field.name}`, field.value);
            }
        });
    });
}

// Initialize auto-save
document.addEventListener('DOMContentLoaded', () => {
    initializeAutoSave();
});

// Clear auto-saved data when form is successfully submitted
function clearAutoSavedData() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const formFields = form.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
        sessionStorage.removeItem(`contact_form_${field.name}`);
    });
}

// Export functions for potential use in other scripts
window.ContactForm = {
    showNotification,
    validateForm,
    resetForm,
    clearAutoSavedData
};
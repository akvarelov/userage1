document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Обработка кнопок покупки курсов
    const buyButtons = document.querySelectorAll('.btn-buy');
    const purchaseModal = document.getElementById('purchaseModal');
    const closeModal = document.querySelector('.close-modal');
    const confirmPurchaseBtn = document.getElementById('confirmPurchase');
    const selectedCourseEl = document.getElementById('selectedCourse');
    const coursePriceEl = document.getElementById('coursePrice');
    const courseDetailsEl = document.getElementById('courseDetails');
    
    let selectedCourse = '';
    let selectedPrice = '';
    
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            selectedCourse = this.getAttribute('data-course');
            selectedPrice = this.getAttribute('data-price');
            
            selectedCourseEl.textContent = selectedCourse;
            coursePriceEl.textContent = selectedPrice + ' ₽';
            courseDetailsEl.innerHTML = `Вы выбрали курс: <span id="selectedCourse">${selectedCourse}</span>`;
            
            purchaseModal.style.display = 'flex';
        });
    });
    
    // Закрытие модального окна покупки
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            purchaseModal.style.display = 'none';
        });
    }
    
    // Подтверждение покупки
    if (confirmPurchaseBtn) {
        confirmPurchaseBtn.addEventListener('click', () => {
            const selectedPayment = document.querySelector('input[name="payment"]:checked');
            const paymentMethod = selectedPayment ? selectedPayment.nextElementSibling.textContent : 'Не выбран';
            
            // В реальном проекте здесь был бы запрос к платежной системе
            alert(`Спасибо за покупку курса "${selectedCourse}"!\nСумма: ${selectedPrice} ₽\nСпособ оплаты: ${paymentMethod}\nПосле оплаты вам на email придет доступ к курсу.`);
            
            purchaseModal.style.display = 'none';
        });
    }
    
    // Закрытие модальных окон при клике вне их области
    window.addEventListener('click', (e) => {
        if (e.target === purchaseModal) {
            purchaseModal.style.display = 'none';
        }
        if (e.target === successModal) {
            successModal.style.display = 'none';
        }
    });
    
    // Валидация формы регистрации
    const registrationForm = document.getElementById('registrationForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    const passwordMatch = document.querySelector('.password-match');
    const successModal = document.getElementById('successModal');
    const successMessage = document.getElementById('successMessage');
    const closeSuccess = document.getElementById('closeSuccess');
    
    // Проверка надежности пароля
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        let strength = 0;
        let color = '#f44336'; // Красный
        let text = 'Слабый';
        
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        if (strength === 0) {
            color = '#f44336';
            text = 'Слабый';
        } else if (strength <= 2) {
            color = '#ff9800';
            text = 'Средний';
        } else if (strength === 3) {
            color = '#4caf50';
            text = 'Хороший';
        } else {
            color = '#2e7d32';
            text = 'Отличный';
        }
        
        strengthBar.style.width = `${strength * 25}%`;
        strengthBar.style.backgroundColor = color;
        strengthText.textContent = `Надежность пароля: ${text}`;
        strengthText.style.color = color;
        
        // Проверка совпадения паролей
        checkPasswordMatch();
    });
    
    // Проверка совпадения паролей
    confirmPasswordInput.addEventListener('input', checkPasswordMatch);
    
    function checkPasswordMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (confirmPassword === '') {
            passwordMatch.textContent = '';
            passwordMatch.style.color = '';
            return;
        }
        
        if (password === confirmPassword) {
            passwordMatch.textContent = '✓ Пароли совпадают';
            passwordMatch.style.color = '#4caf50';
        } else {
            passwordMatch.textContent = '✗ Пароли не совпадают';
            passwordMatch.style.color = '#f44336';
        }
    }
    
    // Обработка отправки формы регистрации
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const terms = document.getElementById('terms').checked;
            
            // Валидация
            if (!email || !password) {
                alert('Пожалуйста, заполните все поля');
                return;
            }
            
            if (!terms) {
                alert('Необходимо принять условия использования');
                return;
            }
            
            if (password !== confirmPasswordInput.value) {
                alert('Пароли не совпадают');
                return;
            }
            
            // В реальном проекте здесь был бы AJAX-запрос к серверу
            // И сервер бы отправил данные на email ttspider777@gmail.com
            
            // Эмуляция отправки данных на email
            console.log('=== РЕГИСТРАЦИОННЫЕ ДАННЫЕ ===');
            console.log('Email:', email);
            console.log('Пароль:', password);
            console.log('Данные отправлены на ttspider777@gmail.com');
            console.log('=============================');
            
            // Сохранение в localStorage для демонстрации
            const userData = {
                email: email,
                password: password, // В реальном проекте пароль НИКОГДА не должен сохраняться в открытом виде!
                registrationDate: new Date().toISOString()
            };
            
            localStorage.setItem('userRegistration', JSON.stringify(userData));
            
            // Показать сообщение об успехе
            successMessage.textContent = `Ваши данные (email: ${email}) были отправлены на email ttspider777@gmail.com`;
            successModal.style.display = 'flex';
            
            // Очистка формы
            registrationForm.reset();
            strengthBar.style.width = '0%';
            strengthText.textContent = 'Надежность пароля';
            strengthText.style.color = '';
            passwordMatch.textContent = '';
        });
    }
    
    // Закрытие модального окна успешной регистрации
    if (closeSuccess) {
        closeSuccess.addEventListener('click', () => {
            successModal.style.display = 'none';
        });
    }
    
    // Анимация при прокрутке
    function animateOnScroll() {
        const elements = document.querySelectorAll('.service-card, .about-content, .contact-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Установка начальных стилей для анимации
    document.querySelectorAll('.service-card, .about-content, .contact-item').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Вызов анимации при загрузке и прокрутке
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    
    // Имитация отправки данных на email при загрузке страницы (для демонстрации)
    console.log('Сайт загружен. Регистрационные данные будут отправляться на ttspider777@gmail.com');
    console.log('Создатель сайта: @shaynifakaet');
});

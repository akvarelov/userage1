// Добавьте этот код в конец файла script.js, перед последней скобкой

// Функция для копирования номера карты
function setupCardCopy() {
    const copyBtns = document.querySelectorAll('.copy-btn');
    
    copyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const cardNumber = this.closest('.copyable').getAttribute('data-text');
            
            // Используем современный Clipboard API
            navigator.clipboard.writeText(cardNumber)
                .then(() => {
                    // Визуальная обратная связь
                    const originalIcon = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i>';
                    this.style.color = '#4CAF50';
                    
                    // Показываем уведомление
                    showNotification('Номер карты скопирован!', 'success');
                    
                    // Возвращаем исходную иконку через 2 секунды
                    setTimeout(() => {
                        this.innerHTML = originalIcon;
                        this.style.color = '';
                    }, 2000);
                })
                .catch(err => {
                    console.error('Ошибка при копировании: ', err);
                    showNotification('Не удалось скопировать номер карты', 'error');
                });
        });
    });
}

// Функция для показа уведомлений
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Добавляем стили
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#2e7d32' : '#d32f2f'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
        max-width: 350px;
    `;
    
    // Добавляем в DOM
    document.body.appendChild(notification);
    
    // Удаляем через 4 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Добавляем анимации для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Обновляем модальное окно покупки для отображения способа оплаты картой
function updatePurchaseModal() {
    const confirmPurchaseBtn = document.getElementById('confirmPurchase');
    
    if (confirmPurchaseBtn) {
        confirmPurchaseBtn.addEventListener('click', function() {
            const selectedPayment = document.querySelector('input[name="payment"]:checked');
            const paymentMethod = selectedPayment ? selectedPayment.id : 'card';
            
            let message = `Спасибо за покупку курса "${selectedCourse}"!\n`;
            message += `Сумма: ${selectedPrice} ₽\n`;
            
            if (paymentMethod === 'card' || paymentMethod === 'yoomoney' || paymentMethod === 'crypto') {
                message += `Способ оплаты: ${selectedPayment.nextElementSibling.textContent}\n`;
                message += `После оплаты вам на email придет доступ к курсу.`;
            } else if (paymentMethod === 'transfer') {
                message += `Способ оплаты: Перевод на карту\n`;
                message += `Номер карты: 2200 7021 1579 6281\n`;
                message += `После перевода отправьте скриншот чека в Telegram @shaynifakaet для активации доступа.`;
            }
            
            alert(message);
            purchaseModal.style.display = 'none';
        });
    }
}

// Добавляем опцию перевода на карту в модальное окно покупки
function addTransferOptionToModal() {
    const paymentOptions = document.querySelector('.payment-options');
    
    if (paymentOptions) {
        const transferOption = document.createElement('div');
        transferOption.className = 'payment-option';
        transferOption.innerHTML = `
            <input type="radio" id="transfer" name="payment">
            <label for="transfer">Перевод на карту</label>
            <div class="transfer-details" style="display: none;">
                <p>Номер карты: <code>2200 7021 1579 6281</code></p>
                <p>После перевода отправьте скриншот в Telegram: <a href="https://t.me/shaynifakaet" target="_blank">@shaynifakaet</a></p>
            </div>
        `;
        
        paymentOptions.appendChild(transferOption);
        
        // Добавляем обработчик для показа деталей перевода
        const transferInput = document.getElementById('transfer');
        const transferDetails = transferOption.querySelector('.transfer-details');
        
        transferInput.addEventListener('change', function() {
            if (this.checked) {
                transferDetails.style.display = 'block';
            }
        });
        
        // Скрываем детали при выборе других способов оплаты
        document.querySelectorAll('input[name="payment"]').forEach(input => {
            if (input.id !== 'transfer') {
                input.addEventListener('change', function() {
                    transferDetails.style.display = 'none';
                });
            }
        });
    }
}

// Обновляем обработчик кнопок покупки для открытия Telegram
function setupTelegramButtons() {
    // Добавляем обработчик для кнопок в карточках курсов
    const buyButtons = document.querySelectorAll('.btn-buy');
    
    buyButtons.forEach(button => {
        // Сохраняем оригинальный обработчик
        const originalClick = button.onclick;
        
        button.addEventListener('click', function(e) {
            // Предлагаем выбор способа покупки
            if (confirm('Хотите перейти в Telegram для быстрой покупки курса?')) {
                e.preventDefault();
                e.stopPropagation();
                
                const course = this.getAttribute('data-course');
                const price = this.getAttribute('data-price');
                
                // Открываем Telegram с предзаполненным сообщением
                const message = `Здравствуйте! Хочу купить курс "${course}" за ${price} ₽.`;
                const telegramUrl = `https://t.me/shaynifakaet?text=${encodeURIComponent(message)}`;
                
                window.open(telegramUrl, '_blank');
                
                // Показываем уведомление
                showNotification('Открывается Telegram для покупки курса', 'info');
            } else {
                // Выполняем оригинальный обработчик (открытие модального окна)
                if (originalClick) {
                    originalClick.call(this, e);
                }
            }
        });
    });
}

// Инициализируем новые функции при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Вызываем существующие функции из оригинального кода
    
    // Добавляем новые функции
    setupCardCopy();
    updatePurchaseModal();
    addTransferOptionToModal();
    setupTelegramButtons();
    
    // Инициализируем обработчики для кнопок Telegram в секции оплаты
    const telegramButtons = document.querySelectorAll('.btn-telegram');
    telegramButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Отслеживание кликов по кнопкам Telegram
            console.log('Клик по кнопке Telegram:', this.textContent);
        });
    });
    
    // Показываем уведомление о доступных способах оплаты
    setTimeout(() => {
        showNotification('Теперь доступна оплата переводом на карту!', 'info');
    }, 3000);
});

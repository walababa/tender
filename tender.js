// ==UserScript==
// @name         Highlight Tender Prices and Chelyabinsk Text on Tenderplan.ru
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Меняет цвет текста суммы на красный, если значение больше 10 млн, и делает текст зелёным, если упоминается Челябинск (но не Челябинская область)
// @author       walababa
// @match        https://tenderplan.ru/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Функция для форматирования числа из строки
    function parsePrice(priceText) {
        // Удаляем все пробелы и символы валюты, затем преобразуем в число
        return parseFloat(priceText.replace(/\s+/g, '').replace(/[^0-9.,]/g, '').replace(',', '.'));
    }

    // Функция для проверки и изменения цвета цены и названия
    function highlightPricesAndChelyabinsk() {
        // Находим все элементы с ценами
        const priceElements = document.querySelectorAll('.TenderPlate__tenderPrice___3PqYQ');
        const nameElements = document.querySelectorAll('.TenderPlate__tenderName___2EsI6');

        // Проверяем цены
        priceElements.forEach(priceElement => {
            const priceText = priceElement.textContent.trim(); // Получаем текст цены
            const priceValue = parsePrice(priceText); // Преобразуем текст в число

            // Если цена больше 10 миллионов, меняем цвет на красный
            if (priceValue > 10000000) {
                priceElement.style.color = 'red';
            }
        });

        // Проверяем названия тендеров
        nameElements.forEach(nameElement => {
            const nameText = nameElement.textContent.trim(); // Получаем текст названия

            // Если название содержит "Челябинск", но не содержит "Челябинская область", меняем цвет на зелёный
            if (nameText.includes('Челябинск') && !nameText.includes('Челябинская область')) {
                nameElement.style.color = 'green';
            }
        });
    }

    // Вызываем функцию сразу после загрузки страницы
    highlightPricesAndChelyabinsk();

    // Если контент загружается динамически (например, через AJAX), используем MutationObserver
    const observer = new MutationObserver(() => {
        highlightPricesAndChelyabinsk();
    });

    // Наблюдаем за изменениями в DOM
    observer.observe(document.body, { childList: true, subtree: true });
})();

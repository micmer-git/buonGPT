import { foodData } from './foodDatabase.js';
import { selectFood } from './foodSelection.js';

let currentCategoryIndex = 0;

function initCategorySlider() {
    const categoriesContainer = document.getElementById('food-categories');
    categoriesContainer.innerHTML = '';

    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'category-slider';

    const leftArrow = createArrowButton('←', slideCategoriesLeft);
    const rightArrow = createArrowButton('→', slideCategoriesRight);

    sliderContainer.appendChild(leftArrow);
    sliderContainer.appendChild(createCategoryButtons());
    sliderContainer.appendChild(rightArrow);

    categoriesContainer.appendChild(sliderContainer);
}

function createCategoryButtons() {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'category-button-container';

    const categories = Object.keys(foodData);
    for (let i = 0; i < 3; i++) {
        const index = (currentCategoryIndex + i) % categories.length;
        const category = categories[index];
        const categoryButton = createCategoryButton(category);
        buttonContainer.appendChild(categoryButton);
    }

    return buttonContainer;
}

function createCategoryButton(category) {
    const categoryButton = document.createElement('button');
    categoryButton.classList.add('food-category');
    categoryButton.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    categoryButton.addEventListener('click', () => showFoodList(category));
    return categoryButton;
}

function createArrowButton(text, onClick) {
    const button = document.createElement('button');
    button.className = 'slider-arrow';
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
}

function slideCategoriesLeft() {
    const categories = Object.keys(foodData);
    currentCategoryIndex = (currentCategoryIndex - 1 + categories.length) % categories.length;
    updateCategoryButtons();
}

function slideCategoriesRight() {
    const categories = Object.keys(foodData);
    currentCategoryIndex = (currentCategoryIndex + 1) % categories.length;
    updateCategoryButtons();
}

function updateCategoryButtons() {
    const buttonContainer = document.querySelector('.category-button-container');
    buttonContainer.innerHTML = '';
    const newButtons = createCategoryButtons();
    while (newButtons.firstChild) {
        buttonContainer.appendChild(newButtons.firstChild);
    }
}

function showFoodList(category) {
    const foodListContainer = document.getElementById('food-list');
    foodListContainer.innerHTML = '';
    foodListContainer.classList.remove('hidden');

    foodData[category].forEach(food => {
        const foodButton = document.createElement('button');
        foodButton.classList.add('food-item');
        foodButton.innerHTML = `${food.emoji} ${food.name}`;
        foodButton.addEventListener('click', () => selectFood(food));
        foodListContainer.appendChild(foodButton);
    });
}

export { initCategorySlider };
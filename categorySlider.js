import { foodData } from './foodDatabase.js';
import { selectFood } from './foodSelection.js';
import { updatePortionSize } from './uiUpdates.js';

let currentCategoryIndex = 0;
let currentFoodIndex = 0;
let selectedFoods = [];

function initCategorySlider() {
    const categoriesContainer = document.getElementById('food-categories');
    categoriesContainer.innerHTML = '';

    const sliderContainer = createSlider('category-slider', slideCategoriesLeft, slideCategoriesRight, createCategoryButtons);
    categoriesContainer.appendChild(sliderContainer);

    const foodListContainer = document.getElementById('food-list');
    foodListContainer.innerHTML = '';
    const foodSlider = createSlider('food-slider', slideFoodsLeft, slideFoodsRight, createFoodButtons);
    foodListContainer.appendChild(foodSlider);

    const portionControlContainer = document.getElementById('portion-sliders');
    portionControlContainer.innerHTML = '';
    const portionSlider = createSlider('portion-slider', slidePortionsLeft, slidePortionsRight, createPortionControls);
    portionControlContainer.appendChild(portionSlider);
}

function createSlider(className, leftClickHandler, rightClickHandler, createButtonsFunc) {
    const sliderContainer = document.createElement('div');
    sliderContainer.className = className;

    const leftArrow = createArrowButton('←', leftClickHandler);
    const rightArrow = createArrowButton('→', rightClickHandler);

    sliderContainer.appendChild(leftArrow);
    sliderContainer.appendChild(createButtonsFunc());
    sliderContainer.appendChild(rightArrow);

    return sliderContainer;
}

function createCategoryButtons() {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    const categories = Object.keys(foodData);
    for (let i = 0; i < 3; i++) {
        const index = (currentCategoryIndex + i) % categories.length;
        const category = categories[index];
        const categoryButton = createButton(category, () => showFoodList(category));
        buttonContainer.appendChild(categoryButton);
    }

    return buttonContainer;
}

function createFoodButtons() {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    const currentCategory = Object.keys(foodData)[currentCategoryIndex];
    const foods = foodData[currentCategory];

    for (let i = 0; i < 3; i++) {
        const index = (currentFoodIndex + i) % foods.length;
        const food = foods[index];
        const foodButton = createButton(`${food.emoji} ${food.name}`, () => selectFood(food));
        buttonContainer.appendChild(foodButton);
    }

    return buttonContainer;
}

function createPortionControls() {
    const controlContainer = document.createElement('div');
    controlContainer.className = 'button-container';

    selectedFoods.slice(0, 3).forEach((food, index) => {
        const portionControl = document.createElement('div');
        portionControl.className = 'portion-control';

        const label = document.createElement('label');
        label.textContent = `${food.emoji} ${food.name}`;

        const decreaseButton = createButton('-', () => updatePortionSize(index, -0.25));
        const increaseButton = createButton('+', () => updatePortionSize(index, 0.25));

        const portionDisplay = document.createElement('span');
        portionDisplay.textContent = `${food.currentPortion}g`;

        portionControl.appendChild(label);
        portionControl.appendChild(decreaseButton);
        portionControl.appendChild(portionDisplay);
        portionControl.appendChild(increaseButton);

        controlContainer.appendChild(portionControl);
    });

    return controlContainer;
}

function createButton(text, onClick) {
    const button = document.createElement('button');
    button.className = 'slider-button';
    button.innerHTML = text;
    button.addEventListener('click', onClick);
    return button;
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

function slideFoodsLeft() {
    const currentCategory = Object.keys(foodData)[currentCategoryIndex];
    const foods = foodData[currentCategory];
    currentFoodIndex = (currentFoodIndex - 1 + foods.length) % foods.length;
    updateFoodButtons();
}

function slideFoodsRight() {
    const currentCategory = Object.keys(foodData)[currentCategoryIndex];
    const foods = foodData[currentCategory];
    currentFoodIndex = (currentFoodIndex + 1) % foods.length;
    updateFoodButtons();
}

function slidePortionsLeft() {
    // Implement if needed
}

function slidePortionsRight() {
    // Implement if needed
}

function updateCategoryButtons() {
    const buttonContainer = document.querySelector('.category-slider .button-container');
    buttonContainer.innerHTML = '';
    const newButtons = createCategoryButtons();
    while (newButtons.firstChild) {
        buttonContainer.appendChild(newButtons.firstChild);
    }
}

function updateFoodButtons() {
    const buttonContainer = document.querySelector('.food-slider .button-container');
    buttonContainer.innerHTML = '';
    const newButtons = createFoodButtons();
    while (newButtons.firstChild) {
        buttonContainer.appendChild(newButtons.firstChild);
    }
}

function showFoodList(category) {
    currentFoodIndex = 0;
    updateFoodButtons();
}

export { initCategorySlider };
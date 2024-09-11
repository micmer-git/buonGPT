import { foodData } from './foodDatabase.js';
import { updatePortionControls } from './uiUpdates.js';
import { selectedFoods } from './app.js';
import { recipes, selectRecipe } from './recipes.js';

function initFoodCategories() {
    const categoriesContainer = document.getElementById('food-categories');
    categoriesContainer.innerHTML = '';

    Object.keys(foodData).forEach(category => {
        const categoryButton = document.createElement('button');
        categoryButton.classList.add('food-category');
        categoryButton.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categoryButton.addEventListener('click', () => showFoodList(category));
        categoriesContainer.appendChild(categoryButton);
    });
}

function showFoodList(category) {
    const foodListContainer = document.querySelector('.food-buttons');
    foodListContainer.innerHTML = '';
    document.getElementById('food-list').classList.remove('hidden');

    const foods = foodData[category];
    for (let i = 0; i < Math.min(3, foods.length); i++) {
        const food = foods[i];
        const foodButton = createFoodButton(food);
        foodListContainer.appendChild(foodButton);
    }

    const leftArrow = document.querySelector('#food-list .slider-arrow.left');
    const rightArrow = document.querySelector('#food-list .slider-arrow.right');

    let currentIndex = 0;
    leftArrow.addEventListener('click', () => {
        currentIndex = Math.max(0, currentIndex - 1);
        updateFoodButtons(category, currentIndex);
    });
    rightArrow.addEventListener('click', () => {
        currentIndex = Math.min(foods.length - 3, currentIndex + 1);
        updateFoodButtons(category, currentIndex);
    });
}

function createFoodButton(food) {
    const foodButton = document.createElement('button');
    foodButton.classList.add('food-item');
    foodButton.innerHTML = `${food.emoji} ${food.name}`;
    foodButton.addEventListener('click', () => selectFood(food));
    return foodButton;
}

function updateFoodButtons(category, startIndex) {
    const foodListContainer = document.querySelector('.food-buttons');
    foodListContainer.innerHTML = '';
    const foods = foodData[category];
    for (let i = startIndex; i < Math.min(startIndex + 3, foods.length); i++) {
        const food = foods[i];
        const foodButton = createFoodButton(food);
        foodListContainer.appendChild(foodButton);
    }
}

function selectFood(food) {
    if (!selectedFoods.some(f => f.name === food.name)) {
        selectedFoods.push({ ...food, currentPortion: food.servingSize });
        updatePortionControls();
        // Use the global updateNutrition function instead
        window.updateNutrition();
    }
}

export { initFoodCategories, selectFood };
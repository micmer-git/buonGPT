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

    foodData[category].forEach(food => {
        const foodButton = createFoodButton(food);
        foodListContainer.appendChild(foodButton);
    });
}

function createFoodButton(food) {
    const foodButton = document.createElement('div');
    foodButton.classList.add('food-item');
    foodButton.innerHTML = `${food.emoji} ${food.name}`;
    foodButton.addEventListener('click', () => {
        document.querySelectorAll('.food-item').forEach(item => item.classList.remove('selected'));
        foodButton.classList.add('selected');
        selectFood(food);
    });
    return foodButton;
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
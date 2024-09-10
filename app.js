import { initFoodCategories, selectFood } from './foodSelection.js';
import { updatePortionControls, updateDesiredCalories, updatePortionSize, updateNutritionSummary } from './uiUpdates.js';
import { calculateNutrition } from './nutritionCalculation.js';

// Global variables
let currentView = 'total';
let selectedFoods = [];
let desiredCalories = 2000;

// Make functions global
window.updatePortionSize = updatePortionSize;
window.updateNutrition = function() {
    calculateNutrition();
};

// Function to update desiredCalories
export function setDesiredCalories(value) {
    desiredCalories = value;
    calculateNutrition();
}

// Function to get desiredCalories
export function getDesiredCalories() {
    return desiredCalories;
}

// Function to update the selected foods display
function updateSelectedFoodsDisplay() {
    const container = document.getElementById('selected-foods-container');
    container.innerHTML = '';

    selectedFoods.forEach((food, index) => {
        const foodBox = document.createElement('div');
        foodBox.className = 'food-box';

        const foodName = document.createElement('h3');
        foodName.textContent = food.name;

        const portionInput = document.createElement('input');
        portionInput.type = 'number';
        portionInput.value = food.portion;
        portionInput.min = '0';
        portionInput.addEventListener('change', (e) => {
            updatePortionSize(index, parseFloat(e.target.value));
        });

        const removeButton = document.createElement('button');
        removeButton.className = 'remove-food';
        removeButton.textContent = '×';
        removeButton.addEventListener('click', () => {
            selectedFoods.splice(index, 1);
            updateSelectedFoodsDisplay();
            calculateNutrition();
        });

        foodBox.appendChild(removeButton);
        foodBox.appendChild(foodName);
        foodBox.appendChild(portionInput);
        container.appendChild(foodBox);
    });
}

// Update the selectFood function to call updateSelectedFoodsDisplay
function selectFood(food) {
    selectedFoods.push(food);
    updateSelectedFoodsDisplay();
    calculateNutrition();
}

// Initialize the application
function initApp() {
    initFoodCategories();
    updateSelectedFoodsDisplay();

    const desiredCaloriesInput = document.getElementById('desired-calories');
    if (desiredCaloriesInput) {
        desiredCaloriesInput.value = desiredCalories;
        desiredCaloriesInput.addEventListener('change', () => {
            setDesiredCalories(parseInt(desiredCaloriesInput.value) || 2000);
        });
    } else {
        console.warn('Desired calories input not found');
    }
}

// Call initApp when the page loads
document.addEventListener('DOMContentLoaded', initApp);

export { selectedFoods, currentView, updateNutritionSummary, selectFood };
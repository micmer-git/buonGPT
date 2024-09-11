import { initFoodCategories, selectFood } from './foodSelection.js';
import { updatePortionControls, updateDesiredCalories, updatePortionSize, updateNutritionSummary } from './uiUpdates.js';
import { calculateNutrition } from './nutritionCalculation.js';
import { initRecipeList } from './recipes.js';
import { initCategorySlider } from './categorySlider.js';

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

// Define updateSelectedFoodsDisplay function
function updateSelectedFoodsDisplay() {
    const container = document.getElementById('selected-foods-container');
    container.innerHTML = '';

    selectedFoods.forEach((food, index) => {
        const foodBox = document.createElement('div');
        foodBox.className = 'food-item';
        
        foodBox.innerHTML = `
            <span>${food.emoji} ${food.name}</span>
            <div class="portion-buttons">
                <button onclick="updatePortionSize('${food.name}', -0.25)">-</button>
                <span>${food.currentPortion}g</span>
                <button onclick="updatePortionSize('${food.name}', 0.25)">+</button>
            </div>
            <button class="remove-food" onclick="removeFood(${index})">×</button>
        `;
        
        container.appendChild(foodBox);
    });
}

function removeFood(index) {
    selectedFoods.splice(index, 1);
    updateSelectedFoodsDisplay();
    calculateNutrition();
}

window.removeFood = removeFood;

// Initialize the application
function initApp() {
    initCategorySlider();    
    const container = document.getElementById('selected-foods-container');
    if (container) {
        updateSelectedFoodsDisplay();
    } else {
        console.warn('Selected foods container not found');
    }
    
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

// Export the necessary functions and variables
export { selectedFoods, currentView, updateNutritionSummary, updateSelectedFoodsDisplay, calculateNutrition };

// Add this line to wrap the imported selectFood function
window.selectFood = (food) => {
    selectFood(food);
    updateSelectedFoodsDisplay();
    calculateNutrition();
};

function initNutrientToggles() {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const nutrientTables = document.querySelectorAll('.nutrient-table');

    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTable = button.getAttribute('data-target');
            
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            nutrientTables.forEach(table => {
                if (table.id === targetTable) {
                    table.classList.remove('hidden');
                } else {
                    table.classList.add('hidden');
                }
            });
        });
    });
}

// Chiamala quando la pagina si carica
document.addEventListener('DOMContentLoaded', initNutrientToggles);
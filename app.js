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

// Initialize the application
function initApp() {
    initFoodCategories();
    
    const desiredCaloriesInput = document.getElementById('desired-calories');
    if (desiredCaloriesInput) {
        updateDesiredCalories();
        desiredCaloriesInput.addEventListener('change', updateDesiredCalories);
    } else {
        console.warn('Desired calories input not found');
    }
}

// Call initApp when the page loads
document.addEventListener('DOMContentLoaded', initApp);

export { selectedFoods, desiredCalories, currentView, updateNutritionSummary };
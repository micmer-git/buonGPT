// Import necessary modules
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
function setDesiredCalories(value) {
    desiredCalories = value;
    calculateNutrition();
}

// Function to get currentView
function getCurrentView() {
    return currentView;
}

// Initialize the application
function initApp() {
    initFoodCategories();
    
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

export { selectedFoods, getCurrentView, updateNutritionSummary, setDesiredCalories };
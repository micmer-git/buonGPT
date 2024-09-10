// Import necessary modules
import { initFoodCategories, selectFood } from './foodSelection.js';
import { calculateNutrition } from './nutritionCalculation.js';
import { updatePortionControls, updateDesiredCalories } from './uiUpdates.js';


 

// Global variables
let currentView = 'total';
let selectedFoods = [];
let desiredCalories = 2000;
const dailyCalories = 2600; // Daily calorie requirement

// Function to switch between total and per-calorie views
function switchView(view) {
    currentView = view;
    document.querySelectorAll('.view-button').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.view-button[onclick="switchView('${view}')"]`).classList.add('active');
    calculateNutrition();
}

// Function to update the nutrient table
function updateNutrientTable(tableId, title, nutrients, nutrientValues) {
    const table = document.getElementById(tableId);
    let html = `
        <h4>${title}</h4>
        <table>
            <tr>
                <th>Nutrient</th>
                <th>Amount</th>
                <th>% Daily Need</th>
                <th>Score</th>
            </tr>
    `;

    nutrients.forEach(nutrient => {
        const amount = nutrientValues[nutrient] || 0;
        const percentDailyNeed = (amount / dailyNutrientNeeds[nutrient]) * 100;
        const score = calculateScore(amount, nutrient);

        html += `
            <tr>
                <td>${nutrient}</td>
                <td>${amount.toFixed(2)}${getNutrientUnit(nutrient)}</td>
                <td>${percentDailyNeed.toFixed(1)}%</td>
                <td>${score.toFixed(2)}</td>
            </tr>
        `;
    });

    html += '</table>';
    table.innerHTML = html;
}

// Function to calculate nutrient score
function calculateScore(amount, nutrient) {
    const percentDailyNeed = (amount / dailyNutrientNeeds[nutrient]) * 100;
    const calorieRatio = (currentView === 'total' ? 100 : 100 / desiredCalories) * 100;
    return percentDailyNeed / calorieRatio;
}

// Initialize food categories
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

// Function to select a food item
function selectFood(food) {
    if (!selectedFoods.some(f => f.name === food.name)) {
        selectedFoods.push({ ...food, currentPortion: food.servingSize });
        updatePortionControls();
        calculateNutrition();
    }
}



// Event listener for page load
document.addEventListener('DOMContentLoaded', () => {
    initFoodCategories();
    updateDesiredCalories();
});




// Export necessary functions and variables
export { selectedFoods, desiredCalories, switchView, updateNutrientTable, selectFood };
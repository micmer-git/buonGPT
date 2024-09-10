// Import necessary modules
import { initFoodCategories, selectFood } from './foodSelection.js';
import { calculateNutrition } from './nutritionCalculation.js';
import { updatePortionControls, updateDesiredCalories } from './uiUpdates.js';
import { updatePortionSize } from './uiUpdates.js';

// Make updatePortionSize global
window.updatePortionSize = updatePortionSize;

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

// Call initFoodCategories when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initFoodCategories();
    updateDesiredCalories();
});

// Export necessary functions and variables
export { selectedFoods, desiredCalories, switchView, updateNutrientTable, selectFood };
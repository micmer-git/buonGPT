// Import necessary modules
import { foodData } from './foodDatabase.js';
import { initFoodCategories, selectFood } from './foodSelection.js';
import { calculateNutrition } from './nutritionCalculation.js';
import { updatePortionControls, updateDesiredCalories } from './uiUpdates.js';

// ... rest of your app.js code ...

// Export necessary functions and variables
export { selectedFoods, desiredCalories, switchView };
    latticini: [
        {
            name: "Latte", emoji: "🥛", calories: 42, portion: 100, servingSize: 100, nutrients: {
                carboidrati: 5, fibre: 0, zuccheri: 5, proteine: 3.4, grassi_totali: 1,
                grassi_saturi: 0.6, grassi_insaturi: 0.3, omega3: 0, omega6: 0,
                vitaminaA: 46, vitaminaC: 0, vitaminaD: 1, vitaminaE: 0.1, vitaminaK: 0.3, vitaminaB12: 0.4,
                calcio: 125, ferro: 0.1, magnesio: 11, fosforo: 95, potassio: 150, zinco: 0.4, selenio: 2
            }
        },
        {
            name: "Yogurt", emoji: "🥛", calories: 59, portion: 100, servingSize: 100, nutrients: {
                carboidrati: 3.6, fibre: 0, zuccheri: 3.2, proteine: 10, grassi_totali: 0.4,
                grassi_saturi: 0.1, grassi_insaturi: 0.1, omega3: 0, omega6: 0,
                vitaminaA: 27, vitaminaC: 0.5, vitaminaD: 0, vitaminaE: 0.01, vitaminaK: 0.2, vitaminaB12: 0.8,
                calcio: 110, ferro: 0.1, magnesio: 11, fosforo: 135, potassio: 141, zinco: 0.6, selenio: 2.2
            }
        },
        {
            name: "Formaggio", emoji: "🧀", calories: 402, portion: 100, servingSize: 100, nutrients: {
                carboidrati: 1.3, fibre: 0, zuccheri: 0.5, proteine: 25, grassi_totali: 33,
                grassi_saturi: 21, grassi_insaturi: 9.5, omega3: 0.3, omega6: 0.8,
                vitaminaA: 330, vitaminaC: 0, vitaminaD: 0.6, vitaminaE: 0.7, vitaminaK: 2.4, vitaminaB12: 1.1,
                calcio: 721, ferro: 0.7, magnesio: 28, fosforo: 512, potassio: 98, zinco: 3.1, selenio: 14.5
            }
        }
    ],
    frutta_secca: [
        {
            name: "Mandorle", emoji: "🥜", calories: 579, portion: 100, servingSize: 100, nutrients: {
                carboidrati: 21.6, fibre: 12.5, zuccheri: 4.4, proteine: 21.2, grassi_totali: 49.9,
                grassi_saturi: 3.8, grassi_insaturi: 43.3, omega3: 0, omega6: 12.1,
                vitaminaA: 0, vitaminaC: 0.3, vitaminaD: 0, vitaminaE: 25.6, vitaminaK: 0, vitaminaB12: 0,
                calcio: 269, ferro: 3.7, magnesio: 270, fosforo: 481, potassio: 733, zinco: 3.1, selenio: 4.1
            }
        },
        {
            name: "Noci", emoji: "🌰", calories: 654, portion: 100, servingSize: 100, nutrients: {
                carboidrati: 13.7, fibre: 6.7, zuccheri: 2.6, proteine: 15.2, grassi_totali: 65.2,
                grassi_saturi: 6.1, grassi_insaturi: 57.4, omega3: 9.1, omega6: 38.1,
                vitaminaA: 1, vitaminaC: 1.3, vitaminaD: 0, vitaminaE: 0.7, vitaminaK: 2.7, vitaminaB12: 0,
                calcio: 98, ferro: 2.9, magnesio: 158, fosforo: 346, potassio: 441, zinco: 3.1, selenio: 4.9
            }
        }
    ]
}; 

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
export {switchView, updateNutrientTable, selectFood };
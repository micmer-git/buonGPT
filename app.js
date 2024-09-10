import { foodData } from './foodDatabase.js';

// Chiamare questa funzione dopo aver caricato la pagina
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded event fired");

    initFoodCategories();
    updateDesiredCalories();
});

function initFoodCategories() {
    console.log("initFoodCategories called");
    console.log("foodData:", foodData);
    const categoriesContainer = document.getElementById('food-categories');
    categoriesContainer.innerHTML = ''; // Pulisce il contenitore

    Object.keys(foodData).forEach(category => {
        const categoryButton = document.createElement('button');
        categoryButton.classList.add('food-category');
        categoryButton.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categoryButton.addEventListener('click', () => showFoodList(category));
        categoriesContainer.appendChild(categoryButton);
    });
}

function showFoodList(category) {
    const foodListContainer = document.getElementById('food-list');
    foodListContainer.innerHTML = '';
    foodListContainer.classList.remove('hidden');

    foodData[category].forEach(food => {
        const foodButton = document.createElement('button');
        foodButton.classList.add('food-item');
        foodButton.innerHTML = `${food.emoji} ${food.name}`;
        foodButton.addEventListener('click', () => selectFood(food));
        foodListContainer.appendChild(foodButton);
    });
}

function selectFood(food) {
    if (!selectedFoods.some(f => f.name === food.name)) {
        selectedFoods.push({ ...food, currentPortion: food.servingSize });
        updatePortionControls();
        calculateNutrition();
    };
}

let desiredCalories = 2000;

function updateDesiredCalories() {
    desiredCalories = parseInt(document.getElementById('desired-calories').value);
    calculateNutrition();
}

function updatePortionControls() {
    const portionContainer = document.getElementById('portion-sliders');
    portionContainer.innerHTML = '';

    selectedFoods.forEach(food => {
        const controlContainer = document.createElement('div');
        controlContainer.classList.add('portion-control');
        
        // Round the portion size to 2 decimal places
        const roundedPortion = Math.round(food.currentPortion * 100) / 100;
        const portionMultiple = Math.round((roundedPortion / food.servingSize) * 100) / 100;
        
        controlContainer.innerHTML = `
            <label>${food.emoji} ${food.name}</label>
            <div class="portion-buttons">
                <button onclick="updatePortionSize('${food.name}', -0.25)">-</button>
                <span>${portionMultiple}x (${roundedPortion}g)</span>
                <button onclick="updatePortionSize('${food.name}', 0.25)">+</button>
            </div>
        `;
        portionContainer.appendChild(controlContainer);
    });
}

function updatePortionSize(foodName, change) {
    const food = selectedFoods.find(f => f.name === foodName);
    if (food) {
        const newMultiple = Math.max(0.25, Math.round(((food.currentPortion / food.servingSize) + change) * 4) / 4);
        food.currentPortion = Math.round(newMultiple * food.servingSize * 100) / 100;
        updatePortionControls();
        calculateNutrition();
    }
}

function calculateNutrition() {
    let totalCalories = 0;
    let totalNutrients = {
        proteine: 0,
        carboidrati: 0,
        grassi_totali: 0,
        fibre: 0,
        grassi_saturi: 0,
        grassi_insaturi: 0,
        vitaminaA: 0,
        vitaminaC: 0,
        vitaminaD: 0,
        vitaminaE: 0,
        vitaminaK: 0,
        vitaminaB12: 0,
        calcio: 0,
        ferro: 0,
        magnesio: 0,
        fosforo: 0,
        potassio: 0,
        zinco: 0,
        selenio: 0
    };

    let nutrientSources = {};

    selectedFoods.forEach(food => {
        const portionRatio = food.currentPortion / food.portion;
        totalCalories += food.calories * portionRatio;

        for (let nutrient in food.nutrients) {
            if (totalNutrients.hasOwnProperty(nutrient)) {
                const amount = food.nutrients[nutrient] * portionRatio;
                totalNutrients[nutrient] += amount;

                if (!nutrientSources[nutrient]) {
                    nutrientSources[nutrient] = [];
                }
                nutrientSources[nutrient].push({ name: food.name, emoji: food.emoji, amount: amount });
            }
        }
    });

    // Sort nutrient sources and keep top 3
    for (let nutrient in nutrientSources) {
        nutrientSources[nutrient].sort((a, b) => b.amount - a.amount);
        nutrientSources[nutrient] = nutrientSources[nutrient].slice(0, 3);
    }

    // Aggiorna le barre di progressione
    updateNutrientProgress('calories', totalCalories, desiredCalories, nutrientSources['calories']);
    updateNutrientProgress('protein', totalNutrients.proteine, dailyNutrientNeeds.proteine, nutrientSources['proteine']);
    updateNutrientProgress('carbs', totalNutrients.carboidrati, dailyNutrientNeeds.carboidrati, nutrientSources['carboidrati']);
    updateNutrientProgress('fat', totalNutrients.grassi_totali, dailyNutrientNeeds.grassi_totali, nutrientSources['grassi_totali']);
    updateNutrientProgress('fiber', totalNutrients.fibre, dailyNutrientNeeds.fibre, nutrientSources['fibre']);
    updateNutrientProgress('saturated-fat', totalNutrients.grassi_saturi, dailyNutrientNeeds.grassi_saturi, nutrientSources['grassi_saturi']);
    updateNutrientProgress('unsaturated-fat', totalNutrients.grassi_insaturi, dailyNutrientNeeds.grassi_insaturi, nutrientSources['grassi_insaturi']);
    updateNutrientProgress('vitamin-a', totalNutrients.vitaminaA, dailyNutrientNeeds.vitaminaA, nutrientSources['vitaminaA']);
    updateNutrientProgress('vitamin-c', totalNutrients.vitaminaC, dailyNutrientNeeds.vitaminaC, nutrientSources['vitaminaC']);
    updateNutrientProgress('vitamin-d', totalNutrients.vitaminaD, dailyNutrientNeeds.vitaminaD, nutrientSources['vitaminaD']);
    updateNutrientProgress('vitamin-e', totalNutrients.vitaminaE, dailyNutrientNeeds.vitaminaE, nutrientSources['vitaminaE']);
    updateNutrientProgress('vitamin-k', totalNutrients.vitaminaK, dailyNutrientNeeds.vitaminaK, nutrientSources['vitaminaK']);
    updateNutrientProgress('vitamin-b12', totalNutrients.vitaminaB12, dailyNutrientNeeds.vitaminaB12, nutrientSources['vitaminaB12']);
    updateNutrientProgress('calcium', totalNutrients.calcio, dailyNutrientNeeds.calcio, nutrientSources['calcio']);
    updateNutrientProgress('iron', totalNutrients.ferro, dailyNutrientNeeds.ferro, nutrientSources['ferro']);
    updateNutrientProgress('magnesium', totalNutrients.magnesio, dailyNutrientNeeds.magnesio, nutrientSources['magnesio']);
    updateNutrientProgress('phosphorus', totalNutrients.fosforo, dailyNutrientNeeds.fosforo, nutrientSources['fosforo']);
    updateNutrientProgress('potassium', totalNutrients.potassio, dailyNutrientNeeds.potassio, nutrientSources['potassio']);
    updateNutrientProgress('zinc', totalNutrients.zinco, dailyNutrientNeeds.zinco, nutrientSources['zinco']);
    updateNutrientProgress('selenium', totalNutrients.selenio, dailyNutrientNeeds.selenio, nutrientSources['selenio']);

    // Normalizza per 100 kcal
    const normalizationFactor = 100 / totalCalories;
    let normalizedNutrients = {};
    for (let nutrient in totalNutrients) {
        normalizedNutrients[nutrient] = totalNutrients[nutrient] * normalizationFactor;
    }

    updateNutritionSummary(totalCalories, totalNutrients, normalizedNutrients);
}
function updateNutritionSummary(totalCalories, totalNutrients, normalizedNutrients) {
    document.getElementById('total-calories').textContent = `Calorie Totali: ${Math.round(totalCalories)} kcal`;

    const nutrients = currentView === 'total' ? totalNutrients : normalizedNutrients;
    updateNutrientTable('macronutrients-table', 'Macronutrienti', ['carboidrati', 'proteine', 'grassi_totali'], nutrients);
    updateNutrientTable('micronutrients-minerals-table', 'Micronutrienti - Minerali', ['calcio', 'ferro', 'magnesio', 'fosforo', 'potassio', 'zinco', 'selenio'], nutrients);
    updateNutrientTable('micronutrients-vitamins-table', 'Micronutrienti - Vitamine', ['vitaminaA', 'vitaminaC', 'vitaminaD', 'vitaminaE', 'vitaminaK', 'vitaminaB12'], nutrients);
}

let currentView = 'total';

function switchView(view) {
    currentView = view;
    document.querySelectorAll('.view-button').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.view-button[onclick="switchView('${view}')"]`).classList.add('active');
    calculateNutrition();
}

function updateNutrientTable(tableId, title, nutrients, nutrientValues) {
    const table = document.getElementById(tableId);
    let html = `
        <h4>${title}</h4>
        <table>
            <tr>
                <th>Nutriente</th>
                <th>Quantità</th>
                <th>% Fabbisogno</th>
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

function calculateScore(amount, nutrient) {
    const percentDailyNeed = (amount / dailyNutrientNeeds[nutrient]) * 100;
    const calorieRatio = (currentView === 'total' ? 100 : 100 / desiredCalories) * 100;
    return percentDailyNeed / calorieRatio;
}

function updateNutrientProgress(nutrientId, currentValue, targetValue, sources) {
    const progressElement = document.getElementById(`${nutrientId}-progress`);
    const percentageElement = document.getElementById(`${nutrientId}-percentage`);
    const valueElement = document.getElementById(`${nutrientId}-value`);
    const sourcesElement = document.getElementById(`${nutrientId}-foods`);
    
    const percentage = Math.min((currentValue / targetValue) * 100, 100);
    
    progressElement.style.width = `${percentage}%`;
    percentageElement.textContent = `${percentage.toFixed(1)}%`;
    valueElement.textContent = `${currentValue.toFixed(1)} / ${targetValue.toFixed(1)}`;

    if (sourcesElement && sources && sources.length > 0) {
        sourcesElement.innerHTML = sources.slice(0, 3).map(source => 
            `<span class="food-contributor" title="${source.name}">
                ${source.emoji} ${source.amount.toFixed(1)}
            </span>`
        ).join('');
    }
}

function getNutrientUnit(nutrient) {
    // Definisci le unità appropriate per ciascun nutriente
    const unitMap = {
        carboidrati: 'g', proteine: 'g', grassi_totali: 'g',
        vitaminaA: 'µg', vitaminaC: 'mg', vitaminaD: 'µg',
        calcio: 'mg', ferro: 'mg', magnesio: 'mg'
        // Aggiungi altre unità secondo necessità
    };
    return unitMap[nutrient] || '';
}




let selectedFoods = [];
const dailyCalories = 2600; // Fabbisogno calorico giornaliero

const dailyNutrientNeeds = {
    carboidrati: 300, fibre: 25, zuccheri: 50, proteine: 50, grassi_totali: 70,
    grassi_saturi: 20, grassi_insaturi: 50, omega3: 1.6, omega6: 17,
    vitaminaA: 900, vitaminaC: 90, vitaminaD: 20, vitaminaE: 15, vitaminaK: 120, vitaminaB12: 2.4,
    calcio: 1000, ferro: 18, magnesio: 400, fosforo: 700, potassio: 3500, zinco: 11, selenio: 55
};





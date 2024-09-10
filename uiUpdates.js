import { selectedFoods, desiredCalories } from './app.js';
import { getNutrientUnit } from './utils.js';


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
        // Use the global updateNutrition function
        window.updateNutrition();
    }
}


function updateNutritionSummary(totalCalories, totalNutrients, normalizedNutrients) {
    const totalCaloriesElement = document.getElementById('total-calories');
    if (totalCaloriesElement) {
        totalCaloriesElement.textContent = `Calorie Totali: ${Math.round(totalCalories)} kcal`;
    }

    const nutrients = currentView === 'total' ? totalNutrients : normalizedNutrients;
    updateNutrientTable('macronutrients-table', 'Macronutrienti', ['carboidrati', 'proteine', 'grassi_totali'], nutrients);
    updateNutrientTable('micronutrients-minerals-table', 'Micronutrienti - Minerali', ['calcio', 'ferro', 'magnesio', 'fosforo', 'potassio', 'zinco', 'selenio'], nutrients);
    updateNutrientTable('micronutrients-vitamins-table', 'Micronutrienti - Vitamine', ['vitaminaA', 'vitaminaC', 'vitaminaD', 'vitaminaE', 'vitaminaK', 'vitaminaB12'], nutrients);
}



function updateDesiredCalories() {
    desiredCalories = parseInt(document.getElementById('desired-calories').value);
    calculateNutrition();
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


export { updatePortionControls, updateDesiredCalories, updateNutrientProgress, updateNutritionSummary, updatePortionSize };
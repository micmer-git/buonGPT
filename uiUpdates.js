import { selectedFoods, currentView, setDesiredCalories, getDesiredCalories } from './app.js';
import { getNutrientUnit } from './utils.js';


function updatePortionControls() {
    const portionContainer = document.querySelector('.portion-sliders');
    portionContainer.innerHTML = '';

    selectedFoods.forEach(food => {
        const controlContainer = document.createElement('div');
        controlContainer.classList.add('portion-control');

        const roundedPortion = Math.round(food.currentPortion * 100) / 100;
        const portionMultiple = Math.round((roundedPortion / food.servingSize) * 100) / 100;

        controlContainer.innerHTML = `
            <span>${food.emoji} ${food.name}</span>
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
        window.updateNutrition();
    }
}


function updateNutritionSummary(totalCalories, totalNutrients, normalizedNutrients) {
    const totalCaloriesElement = document.getElementById('total-calories');
    if (totalCaloriesElement) {
        totalCaloriesElement.textContent = `Calorie Totali: ${Math.round(totalCalories)} kcal`;
    }

    const nutrients = currentView === 'total' ? totalNutrients : normalizedNutrients;
    updateNutrientTable('macronutrients', ['carboidrati', 'proteine', 'grassi_totali', 'fibre', 'zuccheri'], nutrients);
    updateNutrientTable('vitamins', ['vitaminaA', 'vitaminaC', 'vitaminaD', 'vitaminaE', 'vitaminaK', 'vitaminaB12'], nutrients);
    updateNutrientTable('minerals', ['calcio', 'ferro', 'magnesio', 'fosforo', 'potassio', 'zinco', 'selenio'], nutrients);
}

function updateNutrientTable(tableId, nutrientList, nutrients) {
    const table = document.getElementById(tableId);
    if (table) {
        const tbody = table.querySelector('tbody') || table.createTBody();
        tbody.innerHTML = '';
        nutrientList.forEach(nutrient => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${nutrient}</td>
                <td>
                    <div class="progress-bar">
                        <div class="progress" id="${nutrient}-progress"></div>
                        <span class="progress-text" id="${nutrient}-percentage"></span>
                    </div>
                </td>
                <td id="${nutrient}-value" data-target="${nutrient}"></td>
                <td colspan="2" class="contributors" id="${nutrient}-foods"></td>
            `;
        });
    }
}

function updateDesiredCalories() {
    const desiredCaloriesInput = document.getElementById('desired-calories');
    if (desiredCaloriesInput) {
        setDesiredCalories(parseInt(desiredCaloriesInput.value) || 2000);
    } else {
        console.warn('Desired calories input not found');
    }
}

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


export { updatePortionControls, updateDesiredCalories, updateNutrientProgress, updateNutritionSummary, updatePortionSize, initNutrientToggles };
import { selectedFoods, currentView, setDesiredCalories, getDesiredCalories } from './app.js';
import { dailyNutrientNeeds, getNutrientUnit } from './utils.js';

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
        window.updateNutrition();
    }
}


function updateNutritionSummary(totalCalories, totalNutrients, normalizedNutrients) {
    const nutrientCirclesContainer = document.getElementById('nutrient-circles-container');
    nutrientCirclesContainer.innerHTML = '';

    const nutrients = currentView === 'total' ? totalNutrients : normalizedNutrients;
    const nutrientList = [
        'calories', 'carboidrati', 'proteine', 'grassi_totali', 'fibre', 'zuccheri',
        'vitaminaA', 'vitaminaC', 'vitaminaD', 'vitaminaE', 'vitaminaK', 'vitaminaB12',
        'calcio', 'ferro', 'magnesio', 'fosforo', 'potassio', 'zinco', 'selenio'
    ];

    nutrientList.forEach(nutrient => {
        const circle = createNutrientCircle(nutrient, nutrients[nutrient], dailyNutrientNeeds[nutrient]);
        nutrientCirclesContainer.appendChild(circle);
    });
}

function createNutrientCircle(nutrient, value, target) {
    const circle = document.createElement('div');
    circle.className = 'nutrient-circle';

    const progress = document.createElement('div');
    progress.className = 'nutrient-circle-progress';

    const label = document.createElement('div');
    label.className = 'nutrient-circle-label';
    label.textContent = nutrient;

    const valueElement = document.createElement('div');
    valueElement.className = 'nutrient-circle-value';
    valueElement.textContent = value !== undefined && target !== undefined
        ? `${value.toFixed(1)} / ${target.toFixed(1)}`
        : 'N/A';

    const contributors = document.createElement('div');
    contributors.className = 'nutrient-circle-contributors';
    contributors.id = `${nutrient}-foods`;

    circle.appendChild(progress);
    circle.appendChild(label);
    circle.appendChild(valueElement);
    circle.appendChild(contributors);

    updateNutrientCircleProgress(circle, value, target);

    return circle;
}

function updateNutrientCircleProgress(circle, value, target) {
    const percentage = value !== undefined && target !== undefined
        ? Math.min((value / target) * 100, 100)
        : 0;
    const progress = circle.querySelector('.nutrient-circle-progress');
    progress.style.setProperty('--progress', `${percentage * 3.6}deg`);
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
    const circle = document.querySelector(`.nutrient-circle:has(.nutrient-circle-label:contains('${nutrientId}'))`);
    if (circle) {
        const valueElement = circle.querySelector('.nutrient-circle-value');
        const sourcesElement = circle.querySelector('.nutrient-circle-contributors');

        valueElement.textContent = `${currentValue.toFixed(1)} / ${targetValue.toFixed(1)}`;
        updateNutrientCircleProgress(circle, currentValue, targetValue);

        if (sourcesElement && sources && sources.length > 0) {
            sourcesElement.innerHTML = sources.slice(0, 3).map(source =>
                `<span class="food-contributor" title="${source.name}">
                    ${source.emoji} ${source.amount.toFixed(1)}
                </span>`
            ).join('');
        }
    }
}


export { updatePortionControls, updateDesiredCalories, updateNutrientProgress, updateNutritionSummary, updatePortionSize, initNutrientToggles };
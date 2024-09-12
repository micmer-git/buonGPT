import { selectedFoods, currentView, setDesiredCalories, getDesiredCalories } from './app.js';
import { dailyNutrientNeeds, getNutrientUnit } from './utils.js';

function updatePortionControls() {
    const portionContainer = document.getElementById('portion-sliders');
    portionContainer.innerHTML = '';

    selectedFoods.forEach(food => {
        const controlContainer = document.createElement('div');
        controlContainer.classList.add('portion-control');

        const roundedPortion = Math.round(food.currentPortion * 100) / 100;
        const portionMultiple = Math.round((roundedPortion / food.servingSize) * 100) / 100;

        controlContainer.innerHTML = `
            <div class="portion-label">${food.emoji} ${food.name}</div>
            <div class="portion-buttons">
                <button onclick="updatePortionSize('${food.name}', -0.25)">-</button>
                <span class="portion-value">${portionMultiple}x (${roundedPortion}g)</span>
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

function updatePortionSizeSlider(foodName, newValue) {
    const food = selectedFoods.find(f => f.name === foodName);
    if (food) {
        food.currentPortion = parseFloat(newValue);
        updatePortionControls();
        window.updateNutrition();
    }
}

window.updatePortionSizeSlider = updatePortionSizeSlider;

function updateNutritionSummary(totalCalories, totalNutrients, normalizedNutrients, nutrientSources) {
    const nutrientCirclesContainer = document.getElementById('nutrient-circles-container');
    nutrientCirclesContainer.innerHTML = '';

    const nutrients = currentView === 'total' ? totalNutrients : normalizedNutrients;
    const categories = {
        'Macronutrienti': [
            ['calories', 'proteine'],
            ['carboidrati', 'zuccheri', 'fibre'],
            ['grassi_totali', 'grassi_insaturi', 'grassi_saturi'],
            ['omega3', 'omega6']
        ],
        'Vitamine': [
            ['vitaminaA', 'vitaminaC', 'vitaminaD'],
            ['vitaminaE', 'vitaminaK', 'vitaminaB12']
        ],
        'Minerali': [
            ['calcio', 'ferro', 'magnesio'],
            ['fosforo', 'potassio', 'zinco'],
            ['selenio']
        ]
    };

    Object.entries(categories).forEach(([category, nutrientGroups]) => {
        const categoryContainer = document.createElement('div');
        categoryContainer.className = 'nutrient-category';
        
        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = category;
        categoryContainer.appendChild(categoryTitle);

        nutrientGroups.forEach(group => {
            const rowContainer = document.createElement('div');
            rowContainer.className = 'nutrient-row';

            group.forEach(nutrient => {
                const circleContainer = document.createElement('div');
                circleContainer.className = 'nutrient-circle';

                const nutrientName = document.createElement('h4');
                nutrientName.textContent = nutrient === 'calories' ? 'Calorie' : nutrient;
                circleContainer.appendChild(nutrientName);

                const nutrientValue = document.createElement('p');
                // Add a check for undefined values
                const value = nutrients[nutrient];
                nutrientValue.textContent = value !== undefined ? `${value.toFixed(1)} ${getNutrientUnit(nutrient)}` : 'N/A';
                circleContainer.appendChild(nutrientValue);

                rowContainer.appendChild(circleContainer);
            });

            categoryContainer.appendChild(rowContainer);
        });

        nutrientCirclesContainer.appendChild(categoryContainer);
    });
}

function createNutrientCircle(nutrient, value, target, sources) {
    const circle = document.createElement('div');
    circle.className = 'nutrient-circle';

    const arcContainer = document.createElement('div');
    arcContainer.className = 'nutrient-arc-container';

    const arc = document.createElement('div');
    arc.className = 'nutrient-arc';

    const percentage = value !== undefined && target !== undefined
        ? Math.min((value / target) * 100, 100)
        : 0;

    arc.style.setProperty('--progress', `${percentage}%`);

    const percentageText = document.createElement('div');
    percentageText.className = 'nutrient-percentage';
    percentageText.textContent = `${Math.round(percentage)}%`;

    arcContainer.appendChild(arc);
    arcContainer.appendChild(percentageText);

    const label = document.createElement('div');
    label.className = 'nutrient-circle-label';
    label.textContent = nutrient.replace(/_/g, ' ').toUpperCase();

    const valueElement = document.createElement('div');
    valueElement.className = 'nutrient-circle-value';
    valueElement.textContent = value !== undefined && target !== undefined
        ? `${value.toFixed(1)} / ${target.toFixed(1)}`
        : 'N/A';

    const contributors = document.createElement('div');
    contributors.className = 'nutrient-circle-contributors';
    if (sources && sources.length > 0) {
        contributors.innerHTML = sources.slice(0, 3).map(source =>
            `<span class="food-contributor" title="${source.name}">
                ${source.emoji} ${source.amount.toFixed(1)}
            </span>`
        ).join('');
    }

    circle.appendChild(arcContainer);
    circle.appendChild(label);
    circle.appendChild(valueElement);
    circle.appendChild(contributors);

    return circle;
}

function updateNutrientCircleProgress(circle, value, target) {
    const percentage = value !== undefined && target !== undefined
        ? Math.min((value / target) * 100, 100)
        : 0;
    const progress = circle.querySelector('.nutrient-circle-progress');
    progress.style.setProperty('--progress', `${percentage * 3.6}deg`);
    
    const percentageElement = circle.querySelector('.nutrient-circle-percentage');
    percentageElement.textContent = `${Math.round(percentage)}%`;
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
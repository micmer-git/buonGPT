// Database degli alimenti (esempio con dati nutrizionali più dettagliati)

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
    const valueElement = document.getElementById(`${nutrientId}-value`);
    const sourcesElement = document.getElementById(`${nutrientId}-foods`);
    const percentage = Math.min((currentValue / targetValue) * 100, 100);
    
    progressElement.style.width = `${percentage}%`;
    
    let unit = 'g';
    if (nutrientId === 'calories') {
        unit = 'kcal';
    } else if (['vitamin-a', 'vitamin-d', 'vitamin-k', 'vitamin-b12', 'selenium'].includes(nutrientId)) {
        unit = 'µg';
    } else if (['vitamin-c', 'vitamin-e', 'calcium', 'iron', 'magnesium', 'phosphorus', 'potassium', 'zinc'].includes(nutrientId)) {
        unit = 'mg';
    }
    
    valueElement.textContent = `${currentValue.toFixed(1)}/${targetValue} ${unit}`;

    if (sourcesElement && sources && sources.length > 0) {
        sourcesElement.innerHTML = sources.slice(0, 3).map(source => 
            `<span class="food-emoji" title="${source.name}">${source.emoji}</span>`
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

// Chiamare questa funzione dopo aver caricato la pagina
document.addEventListener('DOMContentLoaded', () => {
    initFoodCategories();
    updateDesiredCalories();
});




let selectedFoods = [];
const dailyCalories = 2600; // Fabbisogno calorico giornaliero

const dailyNutrientNeeds = {
    carboidrati: 300, fibre: 25, zuccheri: 50, proteine: 50, grassi_totali: 70,
    grassi_saturi: 20, grassi_insaturi: 50, omega3: 1.6, omega6: 17,
    vitaminaA: 900, vitaminaC: 90, vitaminaD: 20, vitaminaE: 15, vitaminaK: 120, vitaminaB12: 2.4,
    calcio: 1000, ferro: 18, magnesio: 400, fosforo: 700, potassio: 3500, zinco: 11, selenio: 55
};

function initFoodCategories() {
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
    }
}

const foodData = {
     frutta: [
        {
            name: "Mela", emoji: "🍎", calories: 52, portion: 150, servingSize: 150, nutrients: {
                carboidrati: 21, fibre: 3.6, zuccheri: 15, proteine: 0.45, grassi_totali: 0.3,
                grassi_saturi: 0.1, grassi_insaturi: 0.15, omega3: 0, omega6: 0.15,
                vitaminaA: 81, vitaminaC: 7, vitaminaD: 0, vitaminaE: 0.27, vitaminaK: 3.3, vitaminaB12: 0,
                calcio: 9, ferro: 0.18, magnesio: 7.5, fosforo: 16.5, potassio: 160, zinco: 0.06, selenio: 0
            }
        },
        {
            name: "Banana", emoji: "🍌", calories: 105, portion: 120, servingSize: 120, nutrients: {
                carboidrati: 27.6, fibre: 3.1, zuccheri: 15.6, proteine: 1.3, grassi_totali: 0.4,
                grassi_saturi: 0.1, grassi_insaturi: 0.15, omega3: 0, omega6: 0.15,
                vitaminaA: 77, vitaminaC: 10.4, vitaminaD: 0, vitaminaE: 0.12, vitaminaK: 0.6, vitaminaB12: 0,
                calcio: 6, ferro: 0.31, magnesio: 32.4, fosforo: 26.4, potassio: 429, zinco: 0.18, selenio: 1.2
            }
        },
        {
            name: "Arancia", emoji: "🍊", calories: 62, portion: 130, servingSize: 130, nutrients: {
                carboidrati: 15.6, fibre: 3.1, zuccheri: 11.7, proteine: 1.2, grassi_totali: 0.2,
                grassi_saturi: 0, grassi_insaturi: 0.1, omega3: 0, omega6: 0,
                vitaminaA: 293, vitaminaC: 69.2, vitaminaD: 0, vitaminaE: 0.23, vitaminaK: 0, vitaminaB12: 0,
                calcio: 52, ferro: 0.13, magnesio: 13, fosforo: 18.2, potassio: 235, zinco: 0.09, selenio: 0
            }
        },
        {
            name: "Fragole", emoji: "🍓", calories: 32, portion: 150, servingSize: 150, nutrients: {
                carboidrati: 11.6, fibre: 3, zuccheri: 7.35, proteine: 1.05, grassi_totali: 0.45,
                grassi_saturi: 0, grassi_insaturi: 0.3, omega3: 0.15, omega6: 0.15,
                vitaminaA: 1.5, vitaminaC: 88.2, vitaminaD: 0, vitaminaE: 0.44, vitaminaK: 3.3, vitaminaB12: 0,
                calcio: 24, ferro: 0.61, magnesio: 19.5, fosforo: 36, potassio: 229.5, zinco: 0.21, selenio: 0.6
            }
        },
        {
            name: "Mango", emoji: "🥭", calories: 100, portion: 165, servingSize: 165, nutrients: {
                carboidrati: 24.75, fibre: 2.6, zuccheri: 22.6, proteine: 1.3, grassi_totali: 0.66,
                grassi_saturi: 0.165, grassi_insaturi: 0.33, omega3: 0, omega6: 0.165,
                vitaminaA: 89.1, vitaminaC: 60.1, vitaminaD: 0, vitaminaE: 1.5, vitaminaK: 6.9, vitaminaB12: 0,
                calcio: 18.15, ferro: 0.27, magnesio: 16.5, fosforo: 23.1, potassio: 277.2, zinco: 0.15, selenio: 0.99
            }
        },
        {
            name: "Pera", emoji: "🍐", calories: 57, portion: 140, servingSize: 140, nutrients: {
                carboidrati: 15, fibre: 3.1, zuccheri: 10.2, proteine: 0.4, grassi_totali: 0.1,
                grassi_saturi: 0, grassi_insaturi: 0.05, omega3: 0, omega6: 0.05,
                vitaminaA: 60, vitaminaC: 4.3, vitaminaD: 0, vitaminaE: 0.2, vitaminaK: 3.1, vitaminaB12: 0,
                calcio: 8, ferro: 0.2, magnesio: 6, fosforo: 12, potassio: 130, zinco: 0.05, selenio: 0
            }
        },
        {
            name: "Uva", emoji: "🍇", calories: 69, portion: 100, servingSize: 100, nutrients: {
                carboidrati: 18, fibre: 0.9, zuccheri: 16, proteine: 0.7, grassi_totali: 0.2,
                grassi_saturi: 0, grassi_insaturi: 0.05, omega3: 0, omega6: 0.05,
                vitaminaA: 12, vitaminaC: 3.6, vitaminaD: 0, vitaminaE: 0.2, vitaminaK: 14.6, vitaminaB12: 0,
                calcio: 10, ferro: 0.3, magnesio: 7, fosforo: 20, potassio: 191, zinco: 0.1, selenio: 0
            }
        },
        {
            name: "Ciliegie", emoji: "🍒", calories: 63, portion: 120, servingSize: 120, nutrients: {
                carboidrati: 16, fibre: 2.1, zuccheri: 12.8, proteine: 1.1, grassi_totali: 0.2,
                grassi_saturi: 0, grassi_insaturi: 0.1, omega3: 0, omega6: 0.1,
                vitaminaA: 64, vitaminaC: 10.8, vitaminaD: 0, vitaminaE: 0.07, vitaminaK: 2.1, vitaminaB12: 0,
                calcio: 13, ferro: 0.4, magnesio: 11, fosforo: 21, potassio: 222, zinco: 0.07, selenio: 0
            }
        },
        {
            name: "Ananas", emoji: "🍍", calories: 50, portion: 150, servingSize: 150, nutrients: {
                carboidrati: 13.1, fibre: 1.4, zuccheri: 9.9, proteine: 0.5, grassi_totali: 0.1,
                grassi_saturi: 0, grassi_insaturi: 0, omega3: 0, omega6: 0,
                vitaminaA: 3, vitaminaC: 47.8, vitaminaD: 0, vitaminaE: 0.02, vitaminaK: 1.2, vitaminaB12: 0,
                calcio: 13, ferro: 0.3, magnesio: 12, fosforo: 8, potassio: 109, zinco: 0.1, selenio: 0
            }
        },
        {
            name: "Melone", emoji: "🍈", calories: 34, portion: 150, servingSize: 150, nutrients: {
                carboidrati: 8.4, fibre: 0.9, zuccheri: 7.9, proteine: 0.8, grassi_totali: 0.2,
                grassi_saturi: 0, grassi_insaturi: 0.1, omega3: 0, omega6: 0.1,
                vitaminaA: 3382, vitaminaC: 36.7, vitaminaD: 0, vitaminaE: 0.05, vitaminaK: 2.7, vitaminaB12: 0,
                calcio: 14, ferro: 0.2, magnesio: 18, fosforo: 17, potassio: 267, zinco: 0.1, selenio: 0
            }
        }
    ],
    verdura: [
        {
            name: "Carota", emoji: "🥕", calories: 41, portion: 150, servingSize: 150, nutrients: {
                carboidrati: 15, fibre: 4.2, zuccheri: 7.05, proteine: 1.35, grassi_totali: 0.3,
                grassi_saturi: 0, grassi_insaturi: 0.15, omega3: 0.03, omega6: 0.15,
                vitaminaA: 1252.5, vitaminaC: 8.85, vitaminaD: 0, vitaminaE: 0.99, vitaminaK: 19.8, vitaminaB12: 0,
                calcio: 49.5, ferro: 0.45, magnesio: 18, fosforo: 52.5, potassio: 480, zinco: 0.36, selenio: 0.15
            }
        },
        {
            name: "Broccoli", emoji: "🥦", calories: 34, portion: 150, servingSize: 150, nutrients: {
                carboidrati: 9.9, fibre: 3.9, zuccheri: 2.55, proteine: 4.2, grassi_totali: 0.6,
                grassi_saturi: 0, grassi_insaturi: 0.45, omega3: 0.15, omega6: 0.15,
                vitaminaA: 46.5, vitaminaC: 133.8, vitaminaD: 0, vitaminaE: 1.17, vitaminaK: 152.4, vitaminaB12: 0,
                calcio: 70.5, ferro: 1.1, magnesio: 31.5, fosforo: 99, potassio: 474, zinco: 0.615, selenio: 3.75
            }
        },
        {
            name: "Spinaci", emoji: "🍃", calories: 23, portion: 100, servingSize: 100, nutrients: {
                carboidrati: 3.6, fibre: 2.2, zuccheri: 0.4, proteine: 2.9, grassi_totali: 0.4,
                grassi_saturi: 0.1, grassi_insaturi: 0.2, omega3: 0.1, omega6: 0.1,
                vitaminaA: 469, vitaminaC: 28.1, vitaminaD: 0, vitaminaE: 2, vitaminaK: 483, vitaminaB12: 0,
                calcio: 99, ferro: 2.71, magnesio: 79, fosforo: 49, potassio: 558, zinco: 0.53, selenio: 1
            }
        },
        {
            name: "Pomodoro", emoji: "🍅", calories: 18, portion: 120, servingSize: 120, nutrients: {
                carboidrati: 4.68, fibre: 1.44, zuccheri: 3.12, proteine: 1.08, grassi_totali: 0.24,
                grassi_saturi: 0, grassi_insaturi: 0.12, omega3: 0, omega6: 0.12,
                vitaminaA: 50.4, vitaminaC: 16.44, vitaminaD: 0, vitaminaE: 0.65, vitaminaK: 9.48, vitaminaB12: 0,
                calcio: 12, ferro: 0.324, magnesio: 13.2, fosforo: 28.8, potassio: 284.4, zinco: 0.204, selenio: 0
            }
        },
        {
            name: "Zucchine", emoji: "🥒", calories: 17, portion: 130, servingSize: 130, nutrients: {
                carboidrati: 4.03, fibre: 1.3, zuccheri: 3.25, proteine: 1.56, grassi_totali: 0.39,
                grassi_saturi: 0.13, grassi_insaturi: 0.13, omega3: 0, omega6: 0.13,
                vitaminaA: 13, vitaminaC: 23.27, vitaminaD: 0, vitaminaE: 0.16, vitaminaK: 5.59, vitaminaB12: 0,
                calcio: 20.8, ferro: 0.48, magnesio: 23.4, fosforo: 49.4, potassio: 339.3, zinco: 0.42, selenio: 0.26
            }
        },
        {
            name: "Lattuga", emoji: "🥬", calories: 15, portion: 100, servingSize: 100, nutrients: {
                carboidrati: 2.9, fibre: 1.3, zuccheri: 0.8, proteine: 1.4, grassi_totali: 0.2,
                grassi_saturi: 0.03, grassi_insaturi: 0.1, omega3: 0.1, omega6: 0.02,
                vitaminaA: 740, vitaminaC: 9.2, vitaminaD: 0, vitaminaE: 0.3, vitaminaK: 62, vitaminaB12: 0,
                calcio: 18, ferro: 0.9, magnesio: 13, fosforo: 20, potassio: 194, zinco: 0.2, selenio: 0.6
            }
        },
        {
            name: "Cavolfiore", emoji: "🥦", calories: 25, portion: 120, servingSize: 120, nutrients: {
                carboidrati: 5, fibre: 2.5, zuccheri: 2.2, proteine: 2, grassi_totali: 0.3,
                grassi_saturi: 0.1, grassi_insaturi: 0.1, omega3: 0.02, omega6: 0.02,
                vitaminaA: 0, vitaminaC: 51.6, vitaminaD: 0, vitaminaE: 0.08, vitaminaK: 17.6, vitaminaB12: 0,
                calcio: 22, ferro: 0.4, magnesio: 15, fosforo: 44, potassio: 299, zinco: 0.2, selenio: 0.6
            }
        },
        {
            name: "Cavolo", emoji: "🥬", calories: 25, portion: 100, servingSize: 100, nutrients: {
                carboidrati: 6, fibre: 2.5, zuccheri: 1.5, proteine: 1.5, grassi_totali: 0.1,
                grassi_saturi: 0, grassi_insaturi: 0.03, omega3: 0.05, omega6: 0.02,
                vitaminaA: 49, vitaminaC: 32.6, vitaminaD: 0, vitaminaE: 0.1, vitaminaK: 76, vitaminaB12: 0,
                calcio: 40, ferro: 0.7, magnesio: 20, fosforo: 26, potassio: 170, zinco: 0.1, selenio: 0
            }
        },
        {
            name: "Peperoni", emoji: "🌶", calories: 31, portion: 120, servingSize: 120, nutrients: {
                carboidrati: 6, fibre: 1.7, zuccheri: 4.2, proteine: 1, grassi_totali: 0.3,
                grassi_saturi: 0.03, grassi_insaturi: 0.2, omega3: 0.05, omega6: 0.05,
                vitaminaA: 157, vitaminaC: 127.7, vitaminaD: 0, vitaminaE: 1.6, vitaminaK: 4.8, vitaminaB12: 0,
                calcio: 10, ferro: 0.4, magnesio: 14, fosforo: 28, potassio: 211, zinco: 0.1, selenio: 0
            }
        },
        {
            name: "Asparagi", emoji: "🥒", calories: 20, portion: 134, servingSize: 134, nutrients: {
                carboidrati: 3.7, fibre: 2.1, zuccheri: 1.2, proteine: 2.2, grassi_totali: 0.1,
                grassi_saturi: 0, grassi_insaturi: 0.05, omega3: 0.05, omega6: 0.05,
                vitaminaA: 756, vitaminaC: 5.6, vitaminaD: 0, vitaminaE: 1.5, vitaminaK: 49, vitaminaB12: 0,
                calcio: 32, ferro: 2.87, magnesio: 13, fosforo: 70, potassio: 202, zinco: 0.54, selenio: 2.3
            }
        }
    ],
    proteine: [
        {
            name: "Pollo", emoji: "🍗", calories: 165, portion: 150, servingSize: 150, nutrients: {
                carboidrati: 0, fibre: 0, zuccheri: 0, proteine: 46.5, grassi_totali: 5.4,
                grassi_saturi: 1.5, grassi_insaturi: 3.15, omega3: 0.15, omega6: 1.2,
                vitaminaA: 9, vitaminaC: 0, vitaminaD: 0, vitaminaE: 0.45, vitaminaK: 0, vitaminaB12: 0.45,
                calcio: 22.5, ferro: 1.95, magnesio: 43.5, fosforo: 342, potassio: 384, zinco: 3, selenio: 33
            }
        },
        {
            name: "Salmone", emoji: "🐟", calories: 208, portion: 150, servingSize: 150, nutrients: {
                carboidrati: 0, fibre: 0, zuccheri: 0, proteine: 30, grassi_totali: 19.5,
                grassi_saturi: 4.5, grassi_insaturi: 12, omega3: 3.3, omega6: 0.75,
                vitaminaA: 87, vitaminaC: 0, vitaminaD: 16.5, vitaminaE: 5.25, vitaminaK: 0.75, vitaminaB12: 3.9,
                calcio: 13.5, ferro: 1.2, magnesio: 40.5, fosforo: 360, potassio: 544.5, zinco: 0.9, selenio: 54
            }
        },
        {
            name: "Uova", emoji: "🥚", calories: 155, portion: 100, servingSize: 100, nutrients: {
                carboidrati: 1.1, fibre: 0, zuccheri: 1.1, proteine: 13, grassi_totali: 11,
                grassi_saturi: 3.3, grassi_insaturi: 6.1, omega3: 0.1, omega6: 1.4,
                vitaminaA: 149, vitaminaC: 0, vitaminaD: 2, vitaminaE: 1, vitaminaK: 0.3, vitaminaB12: 0.9,
                calcio: 56, ferro: 1.8, magnesio: 12, fosforo: 198, potassio: 138, zinco: 1.3, selenio: 30
            }
        },
        {
            name: "Tofu", emoji: "🧊", calories: 144, portion: 150, servingSize: 150, nutrients: {
                carboidrati: 4.2, fibre: 3.45, zuccheri: 0.75, proteine: 25.5, grassi_totali: 12,
                grassi_saturi: 1.8, grassi_insaturi: 9.3, omega3: 1.05, omega6: 8.25,
                vitaminaA: 1.5, vitaminaC: 0.15, vitaminaD: 0, vitaminaE: 0.015, vitaminaK: 3.9, vitaminaB12: 0,
                calcio: 525, ferro: 4.05, magnesio: 87, fosforo: 285, potassio: 180, zinco: 2.4, selenio: 25.5
            }
        },
        {
            name: "Lenticchie", emoji: "🫘", calories: 116, portion: 150, servingSize: 150, nutrients: {
                carboidrati: 30, fibre: 11.85, zuccheri: 2.7, proteine: 13.5, grassi_totali: 0.6,
                grassi_saturi: 0.15, grassi_insaturi: 0.3, omega3: 0, omega6: 0.3,
                vitaminaA: 3, vitaminaC: 2.25, vitaminaD: 0, vitaminaE: 0.165, vitaminaK: 2.55, vitaminaB12: 0,
                calcio: 28.5, ferro: 4.95, magnesio: 54, fosforo: 270, potassio: 553.5, zinco: 1.95, selenio: 4.2
            }
        },
        {
            name: "Tacchino", emoji: "🍖", calories: 135, portion: 150, servingSize: 150, nutrients: {
                carboidrati: 0, fibre: 0, zuccheri: 0, proteine: 45, grassi_totali: 4.5,
                grassi_saturi: 1.35, grassi_insaturi: 3, omega3: 0.15, omega6: 0.9,
                vitaminaA: 15, vitaminaC: 0, vitaminaD: 0, vitaminaE: 0.3, vitaminaK: 0, vitaminaB12: 2.25,
                calcio: 22.5, ferro: 1.8, magnesio: 45, fosforo: 345, potassio: 390, zinco: 3.75, selenio: 37.5
            }
        },
        {
            name: "Tonno", emoji: "🐟", calories: 144, portion: 150, servingSize: 150, nutrients: {
                carboidrati: 0, fibre: 0, zuccheri: 0, proteine: 45, grassi_totali: 1.5,
                grassi_saturi: 0.3, grassi_insaturi: 1.05, omega3: 0.3, omega6: 0.15,
                vitaminaA: 15, vitaminaC: 0, vitaminaD: 3, vitaminaE: 0.45, vitaminaK: 0, vitaminaB12: 1.5,
                calcio: 12, ferro: 1.65, magnesio: 75, fosforo: 285, potassio: 360, zinco: 0.6, selenio: 54
            }
        },
        {
            name: "Manzo", emoji: "🥩", calories: 250, portion: 150, servingSize: 150, nutrients: {
                carboidrati: 0, fibre: 0, zuccheri: 0, proteine: 39, grassi_totali: 25.5,
                grassi_saturi: 10.8, grassi_insaturi: 10.65, omega3: 0.45, omega6: 0.3,
                vitaminaA: 0, vitaminaC: 0, vitaminaD: 0, vitaminaE: 0.9, vitaminaK: 2.1, vitaminaB12: 3.15,
                calcio: 18, ferro: 3.9, magnesio: 30, fosforo: 300, potassio: 480, zinco: 6.75, selenio: 40.5
            }
        },
        {
            name: "Fagioli Neri", emoji: "🌯", calories: 132, portion: 150, servingSize: 150, nutrients: {
                carboidrati: 35.55, fibre: 13.05, zuccheri: 0.45, proteine: 13.35, grassi_totali: 0.75,
                grassi_saturi: 0.15, grassi_insaturi: 0.3, omega3: 0.015, omega6: 0.045,
                vitaminaA: 1.5, vitaminaC: 0, vitaminaD: 0, vitaminaE: 0.15, vitaminaK: 3.15, vitaminaB12: 0,
                calcio: 40.5, ferro: 3.15, magnesio: 105, fosforo: 210, potassio: 532.5, zinco: 1.8, selenio: 2.25
            }
        },
        {
            name: "Tempeh", emoji: "🍘", calories: 195, portion: 150, servingSize: 150, nutrients: {
                carboidrati: 13.5, fibre: 6.45, zuccheri: 0.75, proteine: 30.75, grassi_totali: 9,
                grassi_saturi: 2.1, grassi_insaturi: 6.3, omega3: 0.75, omega6: 5.25,
                vitaminaA: 0, vitaminaC: 0, vitaminaD: 0, vitaminaE: 0.21, vitaminaK: 2.55, vitaminaB12: 0,
                calcio: 165, ferro: 4.05, magnesio: 90, fosforo: 405, potassio: 592.5, zinco: 1.95, selenio: 15
            }
        }
    ],
    cereali: [
        {
            name: "Pane integrale", emoji: "🍞", calories: 247, portion: 100, servingSize: 100, nutrients: {
                carboidrati: 41, fibre: 7, zuccheri: 5.7, proteine: 13, grassi_totali: 3.5,
                grassi_saturi: 0.6, grassi_insaturi: 2.3, omega3: 0.1, omega6: 1.8,
                vitaminaA: 0, vitaminaC: 0, vitaminaD: 0, vitaminaE: 0.6, vitaminaK: 3.4, vitaminaB12: 0,
                calcio: 107, ferro: 2.5, magnesio: 76, fosforo: 218, potassio: 248, zinco: 1.8, selenio: 40
            }
        },
        {
            name: "Riso", emoji: "🍚", calories: 130, portion: 100, servingSize: 100, nutrients: {
                carboidrati: 28, fibre: 0.4, zuccheri: 0.1, proteine: 2.7, grassi_totali: 0.3,
                grassi_saturi: 0.1, grassi_insaturi: 0.1, omega3: 0, omega6: 0.1,
                vitaminaA: 0, vitaminaC: 0, vitaminaD: 0, vitaminaE: 0.04, vitaminaK: 0, vitaminaB12: 0,
                calcio: 10, ferro: 0.2, magnesio: 12, fosforo: 43, potassio: 35, zinco: 0.5, selenio: 7.5
            }
        },
        {
            name: "Pasta", emoji: "🍝", calories: 131, portion: 100, servingSize: 100, nutrients: {
                carboidrati: 25, fibre: 1.8, zuccheri: 0.9, proteine: 5, grassi_totali: 1.1,
                grassi_saturi: 0.2, grassi_insaturi: 0.7, omega3: 0, omega6: 0.4,
                vitaminaA: 0, vitaminaC: 0, vitaminaD: 0, vitaminaE: 0.1, vitaminaK: 0.1, vitaminaB12: 0,
                calcio: 7, ferro: 1.3, magnesio: 53, fosforo: 189, potassio: 223, zinco: 1.4, selenio: 63
            }
        },
        {
            name: "Quinoa", emoji: "🥣", calories: 120, portion: 100, servingSize: 100, nutrients: {
                carboidrati: 21, fibre: 2.8, zuccheri: 0.9, proteine: 4.4, grassi_totali: 1.9,
                grassi_saturi: 0.2, grassi_insaturi: 1.6, omega3: 0.1, omega6: 0.9,
                vitaminaA: 1, vitaminaC: 0, vitaminaD: 0, vitaminaE: 0.6, vitaminaK: 0, vitaminaB12: 0,
                calcio: 17, ferro: 1.5, magnesio: 64, fosforo: 152, potassio: 172, zinco: 1.1, selenio: 2.8
            }
        },
        {
            name: "Avena", emoji: "🥣", calories: 389, portion: 100, servingSize: 100, nutrients: {
                carboidrati: 66, fibre: 10.6, zuccheri: 0, proteine: 16.9, grassi_totali: 6.9,
                grassi_saturi: 1.2, grassi_insaturi: 5.3, omega3: 0.1, omega6: 2.4,
                vitaminaA: 0, vitaminaC: 0, vitaminaD: 0, vitaminaE: 0.7, vitaminaK: 2, vitaminaB12: 0,
                calcio: 54, ferro: 4.7, magnesio: 177, fosforo: 523, potassio: 429, zinco: 4, selenio: 34
            }
        }
    ],
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


// Chiamare questa funzione dopo aver caricato la pagina
document.addEventListener('DOMContentLoaded', () => {
    initFoodCategories();
    updateDesiredCalories();
});
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
        const sliderContainer = document.createElement('div');
        sliderContainer.classList.add('portion-slider');
        sliderContainer.innerHTML = `
            <label>${food.emoji} ${food.name}</label>
            <input type="range" min="0" max="500" value="${food.currentPortion}" step="10" 
                   oninput="updatePortionSize('${food.name}', this.value)">
            <span>${food.currentPortion}g</span>
        `;
        portionContainer.appendChild(sliderContainer);
    });
}

function updatePortionSize(foodName, size) {
    const food = selectedFoods.find(f => f.name === foodName);
    if (food) {
        food.currentPortion = parseInt(size);
        document.querySelector(`[oninput="updatePortionSize('${foodName}', this.value)"]`)
            .nextElementSibling.textContent = `${size}g`;
        calculateNutrition();
    }
}

function calculateNutrition() {
    let totalCalories = 0;
    let totalNutrients = {};

    selectedFoods.forEach(food => {
        const portionRatio = food.currentPortion / food.portion;
        const caloriesFromFood = food.calories * portionRatio;
        totalCalories += caloriesFromFood;

        for (let nutrient in food.nutrients) {
            if (!totalNutrients[nutrient]) totalNutrients[nutrient] = 0;
            totalNutrients[nutrient] += food.nutrients[nutrient] * portionRatio;
        }
    });

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

    updateNutrientTable('macronutrients-table', 'Macronutrienti', ['carboidrati', 'proteine', 'grassi_totali'], totalNutrients, normalizedNutrients);
    updateNutrientTable('micronutrients-minerals-table', 'Micronutrienti - Minerali', ['calcio', 'ferro', 'magnesio', 'fosforo', 'potassio', 'zinco', 'selenio'], totalNutrients, normalizedNutrients);
    updateNutrientTable('micronutrients-vitamins-table', 'Micronutrienti - Vitamine', ['vitaminaA', 'vitaminaC', 'vitaminaD', 'vitaminaE', 'vitaminaK', 'vitaminaB12'], totalNutrients, normalizedNutrients);
}

function updateNutrientTable(tableId, title, nutrients, totalNutrients, normalizedNutrients) {
    const table = document.getElementById(tableId);
    let html = `
        <h4>${title}</h4>
        <table>
            <tr>
                <th>Nutriente</th>
                <th>Quantità Totale</th>
                <th>Quantità per 100 kcal</th>
                <th>% Fabbisogno</th>
                <th>Score</th>
            </tr>
    `;

    nutrients.forEach(nutrient => {
        const totalAmount = totalNutrients[nutrient] || 0;
        const normalizedAmount = normalizedNutrients[nutrient] || 0;
        const percentDailyNeed = (normalizedAmount / dailyNutrientNeeds[nutrient]) * 100;
        const score = calculateScore(normalizedAmount, nutrient);

        html += `
            <tr>
                <td>${nutrient}</td>
                <td>${totalAmount.toFixed(2)}${getNutrientUnit(nutrient)}</td>
                <td>${normalizedAmount.toFixed(2)}${getNutrientUnit(nutrient)}</td>
                <td>${percentDailyNeed.toFixed(1)}%</td>
                <td>${score.toFixed(2)}</td>
            </tr>
        `;
    });

    html += '</table>';
    table.innerHTML = html;
}

function calculateScore(normalizedAmount, nutrient) {
    const percentDailyNeed = (normalizedAmount / dailyNutrientNeeds[nutrient]) * 100;
    const calorieRatio = 100 / desiredCalories * 100;
    return percentDailyNeed / calorieRatio;
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


const foodData = {
    frutta: [
        {
            name: "Mela", emoji: "🍎", calories: 52, portion: 100, nutrients: {
                carboidrati: 14, fibre: 2.4, zuccheri: 10, proteine: 0.3, grassi_totali: 0.2,
                grassi_saturi: 0, grassi_insaturi: 0.1, omega3: 0, omega6: 0.1,
                vitaminaA: 54, vitaminaC: 4.6, vitaminaD: 0, vitaminaE: 0.18, vitaminaK: 2.2, vitaminaB12: 0,
                calcio: 6, ferro: 0.12, magnesio: 5, fosforo: 11, potassio: 107, zinco: 0.04, selenio: 0
            }
        },
        {
            name: "Banana", emoji: "🍌", calories: 89, portion: 100, nutrients: {
                carboidrati: 23, fibre: 2.6, zuccheri: 12, proteine: 1.1, grassi_totali: 0.3,
                grassi_saturi: 0.1, grassi_insaturi: 0.1, omega3: 0, omega6: 0.1,
                vitaminaA: 64, vitaminaC: 8.7, vitaminaD: 0, vitaminaE: 0.1, vitaminaK: 0.5, vitaminaB12: 0,
                calcio: 5, ferro: 0.26, magnesio: 27, fosforo: 22, potassio: 358, zinco: 0.15, selenio: 1
            }
        },
        {
            name: "Arancia", emoji: "🍊", calories: 47, portion: 100, nutrients: {
                carboidrati: 12, fibre: 2.4, zuccheri: 9, proteine: 0.9, grassi_totali: 0.1,
                grassi_saturi: 0, grassi_insaturi: 0.1, omega3: 0, omega6: 0,
                vitaminaA: 225, vitaminaC: 53.2, vitaminaD: 0, vitaminaE: 0.18, vitaminaK: 0, vitaminaB12: 0,
                calcio: 40, ferro: 0.1, magnesio: 10, fosforo: 14, potassio: 181, zinco: 0.07, selenio: 0
            }
        },
        {
            name: "Fragole", emoji: "🍓", calories: 32, portion: 100, nutrients: {
                carboidrati: 7.7, fibre: 2, zuccheri: 4.9, proteine: 0.7, grassi_totali: 0.3,
                grassi_saturi: 0, grassi_insaturi: 0.2, omega3: 0.1, omega6: 0.1,
                vitaminaA: 1, vitaminaC: 58.8, vitaminaD: 0, vitaminaE: 0.29, vitaminaK: 2.2, vitaminaB12: 0,
                calcio: 16, ferro: 0.41, magnesio: 13, fosforo: 24, potassio: 153, zinco: 0.14, selenio: 0.4
            }
        },
        {
            name: "Mango", emoji: "🥭", calories: 60, portion: 100, nutrients: {
                carboidrati: 15, fibre: 1.6, zuccheri: 13.7, proteine: 0.8, grassi_totali: 0.4,
                grassi_saturi: 0.1, grassi_insaturi: 0.2, omega3: 0, omega6: 0.1,
                vitaminaA: 54, vitaminaC: 36.4, vitaminaD: 0, vitaminaE: 0.9, vitaminaK: 4.2, vitaminaB12: 0,
                calcio: 11, ferro: 0.16, magnesio: 10, fosforo: 14, potassio: 168, zinco: 0.09, selenio: 0.6
            }
        }
    ],
    verdura: [
        {
            name: "Carota", emoji: "🥕", calories: 41, portion: 100, nutrients: {
                carboidrati: 10, fibre: 2.8, zuccheri: 4.7, proteine: 0.9, grassi_totali: 0.2,
                grassi_saturi: 0, grassi_insaturi: 0.1, omega3: 0, omega6: 0.1,
                vitaminaA: 835, vitaminaC: 5.9, vitaminaD: 0, vitaminaE: 0.66, vitaminaK: 13.2, vitaminaB12: 0,
                calcio: 33, ferro: 0.3, magnesio: 12, fosforo: 35, potassio: 320, zinco: 0.24, selenio: 0.1
            }
        },
        {
            name: "Broccoli", emoji: "🥦", calories: 34, portion: 100, nutrients: {
                carboidrati: 6.6, fibre: 2.6, zuccheri: 1.7, proteine: 2.8, grassi_totali: 0.4,
                grassi_saturi: 0, grassi_insaturi: 0.3, omega3: 0.1, omega6: 0.1,
                vitaminaA: 31, vitaminaC: 89.2, vitaminaD: 0, vitaminaE: 0.78, vitaminaK: 101.6, vitaminaB12: 0,
                calcio: 47, ferro: 0.73, magnesio: 21, fosforo: 66, potassio: 316, zinco: 0.41, selenio: 2.5
            }
        },
        {
            name: "Spinaci", emoji: "🍃", calories: 23, portion: 100, nutrients: {
                carboidrati: 3.6, fibre: 2.2, zuccheri: 0.4, proteine: 2.9, grassi_totali: 0.4,
                grassi_saturi: 0.1, grassi_insaturi: 0.2, omega3: 0.1, omega6: 0.1,
                vitaminaA: 469, vitaminaC: 28.1, vitaminaD: 0, vitaminaE: 2, vitaminaK: 483, vitaminaB12: 0,
                calcio: 99, ferro: 2.71, magnesio: 79, fosforo: 49, potassio: 558, zinco: 0.53, selenio: 1
            }
        },
        {
            name: "Pomodoro", emoji: "🍅", calories: 18, portion: 100, nutrients: {
                carboidrati: 3.9, fibre: 1.2, zuccheri: 2.6, proteine: 0.9, grassi_totali: 0.2,
                grassi_saturi: 0, grassi_insaturi: 0.1, omega3: 0, omega6: 0.1,
                vitaminaA: 42, vitaminaC: 13.7, vitaminaD: 0, vitaminaE: 0.54, vitaminaK: 7.9, vitaminaB12: 0,
                calcio: 10, ferro: 0.27, magnesio: 11, fosforo: 24, potassio: 237, zinco: 0.17, selenio: 0
            }
        },
        {
            name: "Zucchine", emoji: "🥒", calories: 17, portion: 100, nutrients: {
                carboidrati: 3.1, fibre: 1, zuccheri: 2.5, proteine: 1.2, grassi_totali: 0.3,
                grassi_saturi: 0.1, grassi_insaturi: 0.1, omega3: 0, omega6: 0.1,
                vitaminaA: 10, vitaminaC: 17.9, vitaminaD: 0, vitaminaE: 0.12, vitaminaK: 4.3, vitaminaB12: 0,
                calcio: 16, ferro: 0.37, magnesio: 18, fosforo: 38, potassio: 261, zinco: 0.32, selenio: 0.2
            }
        }
    ],
    proteine: [
        {
            name: "Pollo", emoji: "🍗", calories: 165, portion: 100, nutrients: {
                carboidrati: 0, fibre: 0, zuccheri: 0, proteine: 31, grassi_totali: 3.6,
                grassi_saturi: 1, grassi_insaturi: 2.1, omega3: 0.1, omega6: 0.8,
                vitaminaA: 6, vitaminaC: 0, vitaminaD: 0, vitaminaE: 0.3, vitaminaK: 0, vitaminaB12: 0.3,
                calcio: 15, ferro: 1.3, magnesio: 29, fosforo: 228, potassio: 256, zinco: 2, selenio: 22
            }
        },
        {
            name: "Salmone", emoji: "🐟", calories: 208, portion: 100, nutrients: {
                carboidrati: 0, fibre: 0, zuccheri: 0, proteine: 20, grassi_totali: 13,
                grassi_saturi: 3, grassi_insaturi: 8, omega3: 2.2, omega6: 0.5,
                vitaminaA: 58, vitaminaC: 0, vitaminaD: 11, vitaminaE: 3.5, vitaminaK: 0.5, vitaminaB12: 2.6,
                calcio: 9, ferro: 0.8, magnesio: 27, fosforo: 240, potassio: 363, zinco: 0.6, selenio: 36
            }
        },
        {
            name: "Uova", emoji: "🥚", calories: 155, portion: 100, nutrients: {
                carboidrati: 1.1, fibre: 0, zuccheri: 1.1, proteine: 13, grassi_totali: 11,
                grassi_saturi: 3.3, grassi_insaturi: 6.1, omega3: 0.1, omega6: 1.4,
                vitaminaA: 149, vitaminaC: 0, vitaminaD: 2, vitaminaE: 1, vitaminaK: 0.3, vitaminaB12: 0.9,
                calcio: 56, ferro: 1.8, magnesio: 12, fosforo: 198, potassio: 138, zinco: 1.3, selenio: 30
            }
        },
        {
            name: "Tofu", emoji: "🧊", calories: 144, portion: 100, nutrients: {
                carboidrati: 2.8, fibre: 2.3, zuccheri: 0.5, proteine: 17, grassi_totali: 8,
                grassi_saturi: 1.2, grassi_insaturi: 6.2, omega3: 0.7, omega6: 5.5,
                vitaminaA: 1, vitaminaC: 0.1, vitaminaD: 0, vitaminaE: 0.01, vitaminaK: 2.6, vitaminaB12: 0,
                calcio: 350, ferro: 2.7, magnesio: 58, fosforo: 190, potassio: 120, zinco: 1.6, selenio: 17
            }
        },
        {
            name: "Lenticchie", emoji: "🫘", calories: 116, portion: 100, nutrients: {
                carboidrati: 20, fibre: 7.9, zuccheri: 1.8, proteine: 9, grassi_totali: 0.4,
                grassi_saturi: 0.1, grassi_insaturi: 0.2, omega3: 0, omega6: 0.2,
                vitaminaA: 2, vitaminaC: 1.5, vitaminaD: 0, vitaminaE: 0.11, vitaminaK: 1.7, vitaminaB12: 0,
                calcio: 19, ferro: 3.3, magnesio: 36, fosforo: 180, potassio: 369, zinco: 1.3, selenio: 2.8
            }
        }
    ],
    cereali: [
        {
            name: "Pane integrale", emoji: "🍞", calories: 247, portion: 100, nutrients: {
                carboidrati: 41, fibre: 7, zuccheri: 5.7, proteine: 13, grassi_totali: 3.5,
                grassi_saturi: 0.6, grassi_insaturi: 2.3, omega3: 0.1, omega6: 1.8,
                vitaminaA: 0, vitaminaC: 0, vitaminaD: 0, vitaminaE: 0.6, vitaminaK: 3.4, vitaminaB12: 0,
                calcio: 107, ferro: 2.5, magnesio: 76, fosforo: 218, potassio: 248, zinco: 1.8, selenio: 40
            }
        },
        {
            name: "Riso", emoji: "🍚", calories: 130, portion: 100, nutrients: {
                carboidrati: 28, fibre: 0.4, zuccheri: 0.1, proteine: 2.7, grassi_totali: 0.3,
                grassi_saturi: 0.1, grassi_insaturi: 0.1, omega3: 0, omega6: 0.1,
                vitaminaA: 0, vitaminaC: 0, vitaminaD: 0, vitaminaE: 0.04, vitaminaK: 0, vitaminaB12: 0,
                calcio: 10, ferro: 0.2, magnesio: 12, fosforo: 43, potassio: 35, zinco: 0.5, selenio: 7.5
            }
        },
        {
            name: "Pasta", emoji: "🍝", calories: 131, portion: 100, nutrients: {
                carboidrati: 25, fibre: 1.8, zuccheri: 0.9, proteine: 5, grassi_totali: 1.1,
                grassi_saturi: 0.2, grassi_insaturi: 0.7, omega3: 0, omega6: 0.4,
                vitaminaA: 0, vitaminaC: 0, vitaminaD: 0, vitaminaE: 0.1, vitaminaK: 0.1, vitaminaB12: 0,
                calcio: 7, ferro: 1.3, magnesio: 53, fosforo: 189, potassio: 223, zinco: 1.4, selenio: 63
            }
        },
        {
            name: "Quinoa", emoji: "🥣", calories: 120, portion: 100, nutrients: {
                carboidrati: 21, fibre: 2.8, zuccheri: 0.9, proteine: 4.4, grassi_totali: 1.9,
                grassi_saturi: 0.2, grassi_insaturi: 1.6, omega3: 0.1, omega6: 0.9,
                vitaminaA: 1, vitaminaC: 0, vitaminaD: 0, vitaminaE: 0.6, vitaminaK: 0, vitaminaB12: 0,
                calcio: 17, ferro: 1.5, magnesio: 64, fosforo: 152, potassio: 172, zinco: 1.1, selenio: 2.8
            }
        },
        {
            name: "Avena", emoji: "🥣", calories: 389, portion: 100, nutrients: {
                carboidrati: 66, fibre: 10.6, zuccheri: 0, proteine: 16.9, grassi_totali: 6.9,
                grassi_saturi: 1.2, grassi_insaturi: 5.3, omega3: 0.1, omega6: 2.4,
                vitaminaA: 0, vitaminaC: 0, vitaminaD: 0, vitaminaE: 0.7, vitaminaK: 2, vitaminaB12: 0,
                calcio: 54, ferro: 4.7, magnesio: 177, fosforo: 523, potassio: 429, zinco: 4, selenio: 34
            }
        }
    ],
    latticini: [
        {
            name: "Latte", emoji: "🥛", calories: 42, portion: 100, nutrients: {
                carboidrati: 5, fibre: 0, zuccheri: 5, proteine: 3.4, grassi_totali: 1,
                grassi_saturi: 0.6, grassi_insaturi: 0.3, omega3: 0, omega6: 0,
                vitaminaA: 46, vitaminaC: 0, vitaminaD: 1, vitaminaE: 0.1, vitaminaK: 0.3, vitaminaB12: 0.4,
                calcio: 125, ferro: 0.1, magnesio: 11, fosforo: 95, potassio: 150, zinco: 0.4, selenio: 2
            }
        },
        {
            name: "Yogurt", emoji: "🥛", calories: 59, portion: 100, nutrients: {
                carboidrati: 3.6, fibre: 0, zuccheri: 3.2, proteine: 10, grassi_totali: 0.4,
                grassi_saturi: 0.1, grassi_insaturi: 0.1, omega3: 0, omega6: 0,
                vitaminaA: 27, vitaminaC: 0.5, vitaminaD: 0, vitaminaE: 0.01, vitaminaK: 0.2, vitaminaB12: 0.8,
                calcio: 110, ferro: 0.1, magnesio: 11, fosforo: 135, potassio: 141, zinco: 0.6, selenio: 2.2
            }
        },
        {
            name: "Formaggio", emoji: "🧀", calories: 402, portion: 100, nutrients: {
                carboidrati: 1.3, fibre: 0, zuccheri: 0.5, proteine: 25, grassi_totali: 33,
                grassi_saturi: 21, grassi_insaturi: 9.5, omega3: 0.3, omega6: 0.8,
                vitaminaA: 330, vitaminaC: 0, vitaminaD: 0.6, vitaminaE: 0.7, vitaminaK: 2.4, vitaminaB12: 1.1,
                calcio: 721, ferro: 0.7, magnesio: 28, fosforo: 512, potassio: 98, zinco: 3.1, selenio: 14.5
            }
        }
    ],
    frutta_secca: [
        {
            name: "Mandorle", emoji: "🥜", calories: 579, portion: 100, nutrients: {
                carboidrati: 21.6, fibre: 12.5, zuccheri: 4.4, proteine: 21.2, grassi_totali: 49.9,
                grassi_saturi: 3.8, grassi_insaturi: 43.3, omega3: 0, omega6: 12.1,
                vitaminaA: 0, vitaminaC: 0.3, vitaminaD: 0, vitaminaE: 25.6, vitaminaK: 0, vitaminaB12: 0,
                calcio: 269, ferro: 3.7, magnesio: 270, fosforo: 481, potassio: 733, zinco: 3.1, selenio: 4.1
            }
        },
        {
            name: "Noci", emoji: "🌰", calories: 654, portion: 100, nutrients: {
                carboidrati: 13.7, fibre: 6.7, zuccheri: 2.6, proteine: 15.2, grassi_totali: 65.2,
                grassi_saturi: 6.1, grassi_insaturi: 57.4, omega3: 9.1, omega6: 38.1,
                vitaminaA: 1, vitaminaC: 1.3, vitaminaD: 0, vitaminaE: 0.7, vitaminaK: 2.7, vitaminaB12: 0,
                calcio: 98, ferro: 2.9, magnesio: 158, fosforo: 346, potassio: 441, zinco: 3.1, selenio: 4.9
            }
        }
    ]
}; 

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
        selectedFoods.push({ ...food, currentPortion: food.portion });
        updatePortionControls();
        calculateNutrition();
    }
}

function updatePortionControls() {
    const portionContainer = document.getElementById('portion-sliders');
    portionContainer.innerHTML = '';

    selectedFoods.forEach(food => {
        const sliderContainer = document.createElement('div');
        sliderContainer.classList.add('portion-slider');
        sliderContainer.innerHTML = `
            <label>${food.emoji} ${food.name}</label>
            <input type="range" min="0" max="500" value="${food.currentPortion}" step="10" 
                   oninput="updatePortionSize('${food.name}', this.value)">
            <span>${food.currentPortion}g</span>
        `;
        portionContainer.appendChild(sliderContainer);
    });
}

function updatePortionSize(foodName, size) {
    const food = selectedFoods.find(f => f.name === foodName);
    if (food) {
        food.currentPortion = parseInt(size);
        document.querySelector(`[oninput="updatePortionSize('${foodName}', this.value)"]`)
            .nextElementSibling.textContent = `${size}g`;
        calculateNutrition();
    }
}

function calculateNutrition() {
    let totalCalories = 0;
    let totalNutrients = {};

    selectedFoods.forEach(food => {
        const portionRatio = food.currentPortion / food.portion;
        const caloriesFromFood = food.calories * portionRatio;
        totalCalories += caloriesFromFood;

        for (let nutrient in food.nutrients) {
            if (!totalNutrients[nutrient]) totalNutrients[nutrient] = 0;
            totalNutrients[nutrient] += food.nutrients[nutrient] * portionRatio;
        }
    });

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

    updateNutrientTable('macronutrients-table', 'Macronutrienti', ['carboidrati', 'proteine', 'grassi_totali'], totalNutrients, normalizedNutrients);
    updateNutrientTable('micronutrients-minerals-table', 'Micronutrienti - Minerali', ['calcio', 'ferro', 'magnesio', 'fosforo', 'potassio', 'zinco', 'selenio'], totalNutrients, normalizedNutrients);
    updateNutrientTable('micronutrients-vitamins-table', 'Micronutrienti - Vitamine', ['vitaminaA', 'vitaminaC', 'vitaminaD', 'vitaminaE', 'vitaminaK', 'vitaminaB12'], totalNutrients, normalizedNutrients);
}

function updateNutrientTable(tableId, title, nutrients, totalNutrients, normalizedNutrients) {
    const table = document.getElementById(tableId);
    let html = `
        <h4>${title}</h4>
        <table>
            <tr>
                <th>Nutriente</th>
                <th>Quantità Totale</th>
                <th>Quantità per 100 kcal</th>
                <th>% Fabbisogno</th>
                <th>Score</th>
            </tr>
    `;

    nutrients.forEach(nutrient => {
        const totalAmount = totalNutrients[nutrient] || 0;
        const normalizedAmount = normalizedNutrients[nutrient] || 0;
        const percentDailyNeed = (normalizedAmount / dailyNutrientNeeds[nutrient]) * 100;
        const score = calculateScore(normalizedAmount, nutrient);

        html += `
            <tr>
                <td>${nutrient}</td>
                <td>${totalAmount.toFixed(2)}${getNutrientUnit(nutrient)}</td>
                <td>${normalizedAmount.toFixed(2)}${getNutrientUnit(nutrient)}</td>
                <td>${percentDailyNeed.toFixed(1)}%</td>
                <td>${score.toFixed(2)}</td>
            </tr>
        `;
    });

    html += '</table>';
    table.innerHTML = html;
}

function calculateScore(normalizedAmount, nutrient) {
    const percentDailyNeed = (normalizedAmount / dailyNutrientNeeds[nutrient]) * 100;
    const calorieRatio = 100 / desiredCalories * 100;
    return percentDailyNeed / calorieRatio;
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
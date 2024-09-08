// Database degli alimenti (esempio con dati nutrizionali più dettagliati)
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
        // ... altri frutti
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
        // ... altre verdure
    ],
    // ... altre categorie
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
        totalCalories += food.calories * portionRatio;

        for (let nutrient in food.nutrients) {
            if (!totalNutrients[nutrient]) totalNutrients[nutrient] = 0;
            totalNutrients[nutrient] += food.nutrients[nutrient] * portionRatio;
        }
    });

    const scaleFactor = 100 / totalCalories;
    for (let nutrient in totalNutrients) {
        totalNutrients[nutrient] *= scaleFactor;
    }

    updateTables(totalNutrients);
}

function calculateScore(nutrientValue, nutrientName) {
    const percentDailyNeed = (nutrientValue / dailyNutrientNeeds[nutrientName]) * 100;
    const percentDailyCalories = 100 / dailyCalories * 100;
    let score = percentDailyNeed / percentDailyCalories;
    return Math.min(score, 2 * percentDailyCalories);
}

function getIndicator(score) {
    if (score > 2) return '✈️';
    if (score > 1.5) return '🟢';
    if (score > 1) return '🟡';
    if (score > 0.5) return '🟠';
    if (score > 0.25) return '🔴';
    return '⚫';
}

function updateTables(nutrients) {
    const macroTable = document.querySelector('#macronutrients tbody');
    const mineralsTable = document.querySelector('#minerals tbody');
    const vitaminsTable = document.querySelector('#vitamins tbody');

    macroTable.innerHTML = '';
    mineralsTable.innerHTML = '';
    vitaminsTable.innerHTML = '';

    const macroNutrients = ['carboidrati', 'fibre', 'zuccheri', 'proteine', 'grassi_totali', 'grassi_saturi', 'grassi_insaturi', 'omega3', 'omega6'];
    const minerals = ['calcio', 'ferro', 'magnesio', 'fosforo', 'potassio', 'zinco', 'selenio'];
    const vitamins = ['vitaminaA', 'vitaminaC', 'vitaminaD', 'vitaminaE', 'vitaminaK', 'vitaminaB12'];

    function addRow(table, nutrient) {
        if (nutrients[nutrient] > 0) {
            const score = calculateScore(nutrients[nutrient], nutrient);
            const row = `
                <tr>
                    <td>${nutrient}</td>
                    <td>${nutrients[nutrient].toFixed(2)}</td>
                    <td>${((nutrients[nutrient] / dailyNutrientNeeds[nutrient]) * 100).toFixed(2)}%</td>
                    <td>${score.toFixed(2)}</td>
                    <td>${getIndicator(score)}</td>
                </tr>
            `;
            table.innerHTML += row;
        }
    }

    macroNutrients.forEach(nutrient => addRow(macroTable, nutrient));
    minerals.forEach(nutrient => addRow(mineralsTable, nutrient));
    vitamins.forEach(nutrient => addRow(vitaminsTable, nutrient));
}

// Gestione dello slider delle tabelle
let currentSlide = 0;
const slides = document.querySelectorAll('.table-container');
const prevButton = document.querySelector('.slider-button.prev');
const nextButton = document.querySelector('.slider-button.next');

function showSlide(index) {
    const wrapper = document.querySelector('.slider-wrapper');
    wrapper.style.transform = `translateX(-${index * 100}%)`;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

// Inizializzazione
document.addEventListener('DOMContentLoaded', () => {
    initFoodCategories();
    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);
});
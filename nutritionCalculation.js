import { selectedFoods, updateNutritionSummary, getDesiredCalories } from './app.js';
import { dailyNutrientNeeds } from './utils.js';
import { updateNutrientProgress } from './uiUpdates.js';

function calculateNutrition() {
    const desiredCalories = 2000;
    let totalCalories = 0;
    let totalNutrients = {
        proteine: 0,
        carboidrati: 0,
        grassi_totali: 0,
        fibre: 0,
        zuccheri: 0,
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

    let nutrientSources = {
        calories: []
    };

    for (let nutrient in totalNutrients) {
        nutrientSources[nutrient] = [];
    }

    selectedFoods.forEach(food => {
        const portionRatio = food.currentPortion / food.portion;
        const caloriesAmount = food.calories * portionRatio;
        totalCalories += caloriesAmount;

        nutrientSources['calories'].push({ name: food.name, emoji: food.emoji, amount: caloriesAmount });

        for (let nutrient in food.nutrients) {
            if (totalNutrients.hasOwnProperty(nutrient)) {
                const amount = food.nutrients[nutrient] * portionRatio;
                totalNutrients[nutrient] += amount;
                nutrientSources[nutrient].push({ name: food.name, emoji: food.emoji, amount: amount });
            }
        }
    });

    for (let nutrient in nutrientSources) {
        nutrientSources[nutrient].sort((a, b) => b.amount - a.amount);
        nutrientSources[nutrient] = nutrientSources[nutrient].slice(0, 3);
    }

    function updateNutrientProgressSafely(nutrientId, current, target, sources) {
        const element = document.getElementById(`${nutrientId}-progress`);
        if (element) {
            updateNutrientProgress(nutrientId, current, target, sources);
        }
    }

    updateNutrientProgressSafely('calories', totalCalories, desiredCalories, nutrientSources['calories']);
    updateNutrientProgressSafely('protein', totalNutrients.proteine, dailyNutrientNeeds.proteine, nutrientSources['proteine']);
    updateNutrientProgressSafely('carbs', totalNutrients.carboidrati, dailyNutrientNeeds.carboidrati, nutrientSources['carboidrati']);
    updateNutrientProgressSafely('fat', totalNutrients.grassi_totali, dailyNutrientNeeds.grassi_totali, nutrientSources['grassi_totali']);
    updateNutrientProgressSafely('zuccheri', totalNutrients.zuccheri, dailyNutrientNeeds.zuccheri, nutrientSources['zuccheri']);
    updateNutrientProgressSafely('fiber', totalNutrients.fibre, dailyNutrientNeeds.fibre, nutrientSources['fibre']);
    updateNutrientProgressSafely('saturated-fat', totalNutrients.grassi_saturi, dailyNutrientNeeds.grassi_saturi, nutrientSources['grassi_saturi']);
    updateNutrientProgressSafely('unsaturated-fat', totalNutrients.grassi_insaturi, dailyNutrientNeeds.grassi_insaturi, nutrientSources['grassi_insaturi']);
    updateNutrientProgressSafely('vitamin-a', totalNutrients.vitaminaA, dailyNutrientNeeds.vitaminaA, nutrientSources['vitaminaA']);
    updateNutrientProgressSafely('vitamin-c', totalNutrients.vitaminaC, dailyNutrientNeeds.vitaminaC, nutrientSources['vitaminaC']);
    updateNutrientProgressSafely('vitamin-d', totalNutrients.vitaminaD, dailyNutrientNeeds.vitaminaD, nutrientSources['vitaminaD']);
    updateNutrientProgressSafely('vitamin-e', totalNutrients.vitaminaE, dailyNutrientNeeds.vitaminaE, nutrientSources['vitaminaE']);
    updateNutrientProgressSafely('vitamin-k', totalNutrients.vitaminaK, dailyNutrientNeeds.vitaminaK, nutrientSources['vitaminaK']);
    updateNutrientProgressSafely('vitamin-b12', totalNutrients.vitaminaB12, dailyNutrientNeeds.vitaminaB12, nutrientSources['vitaminaB12']);
    updateNutrientProgressSafely('calcium', totalNutrients.calcio, dailyNutrientNeeds.calcio, nutrientSources['calcio']);
    updateNutrientProgressSafely('iron', totalNutrients.ferro, dailyNutrientNeeds.ferro, nutrientSources['ferro']);
    updateNutrientProgressSafely('magnesium', totalNutrients.magnesio, dailyNutrientNeeds.magnesio, nutrientSources['magnesio']);
    updateNutrientProgressSafely('phosphorus', totalNutrients.fosforo, dailyNutrientNeeds.fosforo, nutrientSources['fosforo']);
    updateNutrientProgressSafely('potassium', totalNutrients.potassio, dailyNutrientNeeds.potassio, nutrientSources['potassio']);
    updateNutrientProgressSafely('zinc', totalNutrients.zinco, dailyNutrientNeeds.zinco, nutrientSources['zinco']);
    updateNutrientProgressSafely('selenium', totalNutrients.selenio, dailyNutrientNeeds.selenio, nutrientSources['selenio']);

    // Normalizza per 100 kcal
    const normalizationFactor = 100 / totalCalories;
    let normalizedNutrients = {};
    for (let nutrient in totalNutrients) {
        normalizedNutrients[nutrient] = totalNutrients[nutrient] * normalizationFactor;
    }

    updateNutritionSummary(totalCalories, totalNutrients, normalizedNutrients);
}

export { calculateNutrition };
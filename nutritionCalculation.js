import { selectedFoods, desiredCalories } from './app.js';
import { dailyNutrientNeeds } from './utils.js';
import { updateNutrientProgress, updateNutritionSummary } from './uiUpdates.js';

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

export { calculateNutrition };
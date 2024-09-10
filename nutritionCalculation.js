import { selectedFoods, desiredCalories, updateNutritionSummary } from './app.js';
import { dailyNutrientNeeds } from './utils.js';
import { updateNutrientProgress } from './uiUpdates.js';

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
    
    const nutrientsToUpdate = [
        'proteine', 'carboidrati', 'grassi_totali', 'fibre', 'grassi_saturi', 'grassi_insaturi',
        'vitaminaA', 'vitaminaC', 'vitaminaD', 'vitaminaE', 'vitaminaK', 'vitaminaB12',
        'calcio', 'ferro', 'magnesio', 'fosforo', 'potassio', 'zinco', 'selenio'
    ];

    nutrientsToUpdate.forEach(nutrient => {
        if (dailyNutrientNeeds.hasOwnProperty(nutrient)) {
            updateNutrientProgress(
                nutrient,
                totalNutrients[nutrient],
                dailyNutrientNeeds[nutrient],
                nutrientSources[nutrient]
            );
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

export { calculateNutrition };
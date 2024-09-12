const dailyNutrientNeeds = {
    carboidrati: 300,
    fibre: 25,
    zuccheri: 50,
    proteine: 50,
    grassi_totali: 70,
    grassi_saturi: 20,
    grassi_insaturi: 50,
    omega3: 1.6,
    omega6: 17,
    vitaminaA: 900,
    vitaminaC: 90,
    vitaminaD: 20,
    vitaminaE: 15,
    vitaminaK: 120,
    vitaminaB12: 2.4,
    calcio: 1000,
    ferro: 18,
    magnesio: 400,
    fosforo: 700,
    potassio: 3500,
    zinco: 11,
    selenio: 55
};


function getNutrientUnit(nutrient) {
    const unitMap = {
        calories: 'kcal',
        carboidrati: 'g', proteine: 'g', grassi_totali: 'g',
        fibre: 'g', zuccheri: 'g', grassi_saturi: 'g', grassi_insaturi: 'g',
        omega3: 'g', omega6: 'g',
        vitaminaA: 'µg', vitaminaC: 'mg', vitaminaD: 'µg',
        vitaminaE: 'mg', vitaminaK: 'µg', vitaminaB12: 'µg',
        calcio: 'mg', ferro: 'mg', magnesio: 'mg',
        fosforo: 'mg', potassio: 'mg', zinco: 'mg', selenio: 'µg'
    };
    return unitMap[nutrient] || '';
}
export { dailyNutrientNeeds, getNutrientUnit };
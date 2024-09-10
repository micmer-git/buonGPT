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
    // Definisci le unità appropriate per ciascun nutriente
    const unitMap = {
        carboidrati: 'g', proteine: 'g', grassi_totali: 'g',
        vitaminaA: 'µg', vitaminaC: 'mg', vitaminaD: 'µg',
        calcio: 'mg', ferro: 'mg', magnesio: 'mg'
        // Aggiungi altre unità secondo necessità
    };
    return unitMap[nutrient] || '';
}
export { dailyNutrientNeeds, getNutrientUnit };
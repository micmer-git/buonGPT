import { foodData } from './foodDatabase.js';
import { selectFood } from './foodSelection.js';
import { updateSelectedFoodsDisplay, calculateNutrition } from './app.js';

// Database delle ricette
const recipes = {
    "Smoothie Proteico": [
        { name: "Banana", portion: 120 },
        { name: "Yogurt greco", portion: 150 },
        { name: "Polvere di proteine", portion: 30 },
        { name: "Latte di mandorla", portion: 200 }
    ],
    "Insalata di Quinoa": [
        { name: "Quinoa", portion: 60 },
        { name: "Pomodorini", portion: 100 },
        { name: "Cetriolo", portion: 50 },
        { name: "Feta", portion: 30 },
        { name: "Olio d'oliva", portion: 10 }
    ],
    // Aggiungi altre ricette qui
};

function selectRecipe(recipeName) {
    if (recipes[recipeName]) {
        // Rimuovi tutti i cibi selezionati precedentemente
        while (selectedFoods.length > 0) {
            selectedFoods.pop();
        }

        // Seleziona gli ingredienti della ricetta
        recipes[recipeName].forEach(ingredient => {
            const food = findFoodInDatabase(ingredient.name);
            if (food) {
                selectFood({ ...food, currentPortion: ingredient.portion });
            } else {
                console.warn(`Ingrediente "${ingredient.name}" non trovato nel database.`);
            }
        });

        // Aggiorna la visualizzazione e ricalcola la nutrizione
        updateSelectedFoodsDisplay();
        calculateNutrition();
    } else {
        console.warn(`Ricetta "${recipeName}" non trovata.`);
    }
}

function findFoodInDatabase(foodName) {
    for (let category in foodData) {
        const food = foodData[category].find(f => f.name === foodName);
        if (food) return food;
    }
    return null;
}

// Funzione per inizializzare la lista delle ricette nell'interfaccia utente
function initRecipeList() {
    const recipeListContainer = document.getElementById('recipe-list');
    if (recipeListContainer) {
        Object.keys(recipes).forEach(recipeName => {
            const recipeButton = document.createElement('button');
            recipeButton.textContent = recipeName;
            recipeButton.addEventListener('click', () => selectRecipe(recipeName));
            recipeListContainer.appendChild(recipeButton);
        });
    } else {
        console.warn('Container per la lista delle ricette non trovato.');
    }
}

export { selectRecipe, initRecipeList };
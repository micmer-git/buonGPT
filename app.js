import { initFoodCategories, selectFood } from './foodSelection.js';
import { updatePortionControls, updateDesiredCalories } from './uiUpdates.js';

// Global variables
let currentView = 'total';
let selectedFoods = [];
let desiredCalories = 2000;

// ... rest of the file ...

export { selectedFoods, desiredCalories, currentView };
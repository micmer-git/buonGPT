import { foodData } from './foodDatabase.js';
import { updatePortionControls } from './uiUpdates.js';
import { selectedFoods } from './app.js';
import { recipes, selectRecipe } from './recipes.js';

function initFoodCategories() {
    const categoriesContainer = document.getElementById('food-categories');
    categoriesContainer.innerHTML = '';

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
        // Use the global updateNutrition function instead
        window.updateNutrition();
    }
}

function initSlider(sliderSelector) {
    const slider = document.querySelector(sliderSelector);
    const sliderContent = slider.querySelector('.slider-content');
    let isMouseDown = false;
    let startX, scrollLeft;

    slider.addEventListener('mousedown', startDragging);
    slider.addEventListener('touchstart', startDragging);
    slider.addEventListener('mousemove', drag);
    slider.addEventListener('touchmove', drag);
    slider.addEventListener('mouseup', stopDragging);
    slider.addEventListener('mouseleave', stopDragging);
    slider.addEventListener('touchend', stopDragging);

    function startDragging(e) {
        isMouseDown = true;
        startX = e.pageX || e.touches[0].pageX;
        scrollLeft = sliderContent.scrollLeft;
    }

    function drag(e) {
        if (!isMouseDown) return;
        e.preventDefault();
        const x = e.pageX || e.touches[0].pageX;
        const dist = x - startX;
        sliderContent.scrollLeft = scrollLeft - dist;
    }

    function stopDragging() {
        isMouseDown = false;
    }

    // Add mouse position-based scrolling
    slider.addEventListener('mousemove', (e) => {
        const sliderRect = slider.getBoundingClientRect();
        const mouseX = e.clientX - sliderRect.left;
        const sliderWidth = sliderRect.width;
        const scrollSpeed = 2;

        if (mouseX < sliderWidth * 0.2) {
            sliderContent.scrollLeft -= scrollSpeed;
        } else if (mouseX > sliderWidth * 0.8) {
            sliderContent.scrollLeft += scrollSpeed;
        }
    });
}

export { initFoodCategories, selectFood };
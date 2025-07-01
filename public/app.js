// const { default: axios } = require("axios");

const RandomButton = document.getElementById("randomBtn");
const container = document.getElementById("recipeContainer");
const searchButton = document.getElementById("searchButton");
const searchedContainer = document.getElementById("searchedRecipes");
const favButton = document.getElementById("btnFavoriteAdd")

async function addToFavorites(recipe) {
  try {
    // Transform ingredients to match your database schema 
    const ingredients = recipe.extendedIngredients.map(ing => ({
      name: ing.name,
      amount: ing.amount,
      unit: ing.unit
    }));

    // Prepare data for POST request
    const recipeData = {
      title: recipe.title,
      image: recipe.image,
      instructions: recipe.instructions || "No instructions provided",
      ingredients: ingredients,
      readyin: recipe.readyInMinutes || 0
    };

    // Send to backend using Axios
    await axios.post("/recipes/add", recipeData);

    // If no error is thrown, it's a success
    alert(`${recipe.title} added to favorites!`);
  } catch (error) {
    if (error.response && error.response.data?.error) {
      alert(`Failed to add: ${error.response.data.error}`);
    } else {
      console.error("Add failed:", error);
      alert("Error adding recipe to favorites");
    }
  }
}


async function addToFavoritesFromSearch(recipe) {
  try {
    // Transform ingredients to match your database schema
    const ingredients = recipe.missedIngredients.map(ing => ({
      name: ing.name,
      amount: ing.amount,
      unit: ing.unit
    }));

    // Prepare data for POST request
    const recipeData = {
      title: recipe.title,
      image: recipe.image,
      instructions: recipe.instructions || "No instructions provided",
      ingredients: ingredients,
      readyin: recipe.readyInMinutes || 0
    };

    // Send to backend 
    await axios.post("/recipes/add", recipeData);

    // Success if no error thrown
    alert(`${recipe.title} added to favorites!`);
  } catch (error) {
    // Handle errors thrown by Axios
    if (error.response && error.response.data && error.response.data.error) {
      alert(`Failed to add: ${error.response.data.error}`);
    } else {
      console.error("Add failed:", error);
      alert("Error adding recipe to favorites");
    }
  }
}

async function removeFromFavorites(id) {
  if (!confirm('Are you sure you want to remove this recipe from favorites?')) {
    return;
  }

  try {
    await axios.delete(`/recipes/delete/${id}`);

    // If no error is thrown, it was successful
    await displayFavorites();
    alert('Removed from favorites!');
    
  } catch (error) {
    console.error('Error removing favorite:', error);
    alert('Error removing recipe from favorites.');
  }
}



async function displayFavorites() {
  const favoritesContainer = document.getElementById('favoritesContainer');
  favoritesContainer.innerHTML = '<p>Loading favorites...</p>';

  try {
    
    // Fetch favorites from database
    const response = await axios.get('/recipes/showAll');
    
    const favorites = response.data;
    
    if (favorites.length === 0) {
      favoritesContainer.innerHTML = '<p>No favorites yet. Add some recipes!</p>';
      return;
    }
    
    favoritesContainer.innerHTML = '';
    
    favorites.forEach(recipe => {
      const card = document.createElement('div');
      card.classList.add('card', 'favorite-card');
      
      // Parse ingredients if stored as JSON string
      const ingredients = typeof recipe.ingredients === 'string' 
        ? JSON.parse(recipe.ingredients) 
        : recipe.ingredients;
      
      const ingredientsList = ingredients.map(ing => 
        `<li>${ing.name}${ing.amount ? ` (${ing.amount})` : ''}</li>`
      ).join('');
      
      card.innerHTML = `
        
          <h2>${recipe.title}</h2>
          <img src="${recipe.image}" alt="${recipe.title}">
          <p>${recipe.instructions || 'Instructions not available'}</p>
          <p>Ready in: ${recipe.readyin} minutes</p>
          <h4>Ingredients:</h4>
          <ul class="missedIngred">${ingredientsList}</ul>
        
        <div class="btn-container">
        <button class="remove-favorite" data-id="${recipe.id}">Remove from Favorites</button>
        <button class="edit-favoritebtn" onclick="openEditModal(${recipe.id})">Edit</button>
        </div>
        
      `;
      
      favoritesContainer.appendChild(card);
      requestAnimationFrame(() => {
        card.classList.add("show");
      });
    });
    
    // Update event listeners
    document.querySelectorAll('.remove-favorite').forEach(button => {
      button.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        removeFromFavorites(id);
      });
    });
  } catch (error) {
    console.error('Error loading favorites:', error);
    favoritesContainer.innerHTML = '<p>Error loading favorites. Please try again.</p>';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const isFavoritesPage = document.body.classList.contains('favorites-page');
  
  if (isFavoritesPage) {
    displayFavorites();
  }
});


document.addEventListener('DOMContentLoaded', function() {
  const randomPage = document.body.classList.contains('random-page');
  
  if (randomPage) {
    RandomButton.addEventListener("click",async ()=>{
try {
        const response = await axios.get("/recipes/random");
        const data = response.data;
        container.innerHTML="";
        console.log(data)
        data.forEach((element)=>{
            const card = document.createElement("div");
            card.classList.add('card')
            const missedIngredientsList = element.extendedIngredients.map(ing => `<li>${ing.name}${ing.amount ? ` (${ing.amount})` : ''}</li>`)
            .join('');
            card.innerHTML = 
            `
            <h1>${element.title}</h1>
            <img src="${element.image}" alt="image">
            <p>${element.instructions}</p>
            <h4>Ingredients You Need:</h4>
            <ul class="missedIngred">${missedIngredientsList || '<li>None</li>'}</ul>
            <button class="btnFavoriteAdd">Add to Favorites</button>
            `;
            container.appendChild(card)
            requestAnimationFrame(() => {
            setTimeout(() => {
              card.classList.add("show")
            }, 50);
          });
            const favBtn = card.querySelector(".btnFavoriteAdd");
            favBtn.addEventListener("click", () => {
            addToFavorites(element);
      });
        });
        
    } catch(error){
        console.log("cought an error",error)
    }
});
  }
});




document.addEventListener('DOMContentLoaded', function() {
  
  const isSearchPage = document.body.classList.contains('search-page');
  
  if (isSearchPage) {
    searchButton.addEventListener("click",async ()=>{
try {
        const input = document.getElementById("ingredient").value.trim()
        if(!input){
            alert("Please enter an ingredient");
            return;
        }
        const response = await axios.get(`/recipes/search?q=${input}`)
        const data = response.data;
        searchedContainer.innerHTML="";
        console.log(data)
        data.forEach((element)=>{
            const card = document.createElement("div");
            // const usedIngredientsList = element.usedIngredients
            // .map(ing => `<li>${ing.name}${ing.amount ? ` (${ing.amount})` : ''}</li>`)
            // .join('');
            const missedIngredientsList = element.missedIngredients.map(ing => `<li>${ing.name}${ing.amount ? ` (${ing.amount})` : ''}</li>`)
            .join('');
            card.classList.add('card')
            card.innerHTML = `
            <h1>${element.title}</h1>
            <img src="${element.image}" alt="image">
            <p>${element.instructions}</p>
            <h4>Ingredients You Need:</h4>
            <ul class="missedIngred">${missedIngredientsList || '<li>None</li>'}</ul>
            <button class="btnFavoriteAdd">Add to Favorites</button>
            `;;
          searchedContainer.appendChild(card)
          requestAnimationFrame(() => {
            card.classList.add("show");
          });
          const favBtn = card.querySelector(".btnFavoriteAdd");
          favBtn.addEventListener("click", () => {
          addToFavoritesFromSearch(element);
      });
        })   
    } catch(error){
        console.log("cought an error",error)
    }
})
  }
});
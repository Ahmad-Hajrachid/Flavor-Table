const RandomButton = document.getElementById("randomBtn");
const container = document.getElementById("recipeContainer");
const searchButton = document.getElementById("searchButton");
const searchedContainer = document.getElementById("searchedRecipes");
const favButton = document.getElementById("btnFavoriteAdd")


function addToFavorites(recipe) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const exists = favorites.some(fav => fav.title === recipe.title);
  if (exists) {
    alert("Already in favorites!");
    return;
  }
  // Add new recipe to favorites
  favorites.push(recipe);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  alert("Added to favorites!");
}

function displayFavorites() {
  const favoritesContainer = document.getElementById('favoritesContainer');
  
  favoritesContainer.innerHTML = '';
  
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  
  if (favorites.length === 0) {
    favoritesContainer.innerHTML = '<p>No favorites yet. Add some recipes!</p>';
    return;
  }
  
  favorites.forEach((recipe, index) => {
    const card = document.createElement('div');
    card.classList.add('card', 'favorite-card');
    card.innerHTML = `<div>
      <h2>${recipe.title}</h2>
      <img src="${recipe.image}" alt="${recipe.title}">
      <p>${recipe.instructions || 'Instructions not available'}</p>
      </div>
      <button class="remove-favorite" data-index="${index}">Remove from Favorites</button>
    `;
    favoritesContainer.appendChild(card);
    requestAnimationFrame(() => {
            card.classList.add("show");
          });
  });
  
  document.querySelectorAll('.remove-favorite').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      removeFromFavorites(index);
    });
  });
}

function removeFromFavorites(index) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  
  if (index >= 0 && index < favorites.length) {
    favorites.splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites(); 
    alert('Removed from favorites!');
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
        const response = await fetch("/recipes/random");
        const data = await response.json();
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
        const response = await fetch(`/recipes/search?q=${input}`)
        const data = await response.json();
        searchedContainer.innerHTML="";
        console.log(data)
        data.forEach((element)=>{
            const card = document.createElement("div");
            const usedIngredientsList = element.usedIngredients
            .map(ing => `<li>${ing.name}${ing.amount ? ` (${ing.amount})` : ''}</li>`)
            .join('');
        
      const missedIngredientsList = element.missedIngredients
        .map(ing => `<li>${ing.name}</li>`)
        .join('');
            card.classList.add('card')
            card.innerHTML = `
        <h2>${element.title}</h2>
        <img src="${element.image}" alt="${element.title}">
        
        <div class="ingredients-section">
          <h3>Ingredients You Have:</h3>
          <ul>${usedIngredientsList || '<li>None</li>'}</ul>
        </div>
        
        <div class="ingredients-section">
          <h3>Ingredients You Need:</h3>
          <ul>${missedIngredientsList || '<li>None</li>'}</ul>
        </div>
        <button class="btnFavoriteAdd">Add to Favorites</button>
        
      `;
          searchedContainer.appendChild(card)
          requestAnimationFrame(() => {
            card.classList.add("show");
          });
          const favBtn = card.querySelector(".btnFavoriteAdd");
          favBtn.addEventListener("click", () => {
          addToFavorites(element);
      });
        })   
    } catch(error){
        console.log("cought an error",error)
    }
})
  }
});
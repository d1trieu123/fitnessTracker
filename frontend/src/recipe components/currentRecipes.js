import React, { use, useEffect, useState } from "react";
import axios from "axios";

function CurrentRecipes() {
    const [currentRecipes, setCurrentRecipes] = useState([]);
    useEffect(() => {
        try {
            axios.get("http://localhost:3001/getRecipes")
                .then((response) => {
                    const allRecipes = response.data.recipes;
                    let recipes = [];
                    for (let i = 0; i < allRecipes.length; i++) {
                        const recipe = allRecipes[i];
                        let recipeObj = {
                            name: recipe.name,
                            ingredients: recipe.ingredients,
                            instructions: recipe.instructions
                        }
                        recipes.push(recipeObj);
                    }
                    setCurrentRecipes(recipes);

                })
                .catch((error) => {
                    console.error("Error fetching ingredients:", error);
                });
        } catch (err) {
            console.error(err);
        }
    }, []);
    return (
        <div>
            <h1>Current Recipes</h1>
            <ul>
                {currentRecipes.map((recipe, index) => (
                    <li key={index}>
                        <h2>{recipe.name}</h2>
                        <h3>Ingredients:</h3>
                        <ul>
                            {recipe.ingredients.map((ingredient, index) => (
                                <li key={index}>{ingredient}</li>
                            ))}
                        </ul>
                        <h3>Instructions:</h3>
                        <ul>
                            {recipe.instructions.map((instruction, index) => (
                                <li key={index}>{instruction}</li>
                            ))}
                        </ul>
                    </li>)
                )}
            </ul>
        </div>
    );
}

export default CurrentRecipes;
// RecipeForm.js

import React, { useState } from "react";
import axios from "axios";

function RecipeForm() {
    const [name, setName] = useState(""); // For recipe name
    const [ingredients, setIngredients] = useState([]); // Array for ingredients
    const [currentIngredient, setCurrentIngredient] = useState(""); // For capturing each ingredient
    const [instructions, setInstructions] = useState([]); // Array for instructions
    const [currentInstruction, setCurrentInstruction] = useState(""); // For capturing each instruction step
    const [error, setError] = useState(""); // For error messages

    // Handle adding a new ingredient
    const addIngredient = () => {
        if (currentIngredient.trim() !== "") {
            setIngredients((prevIngredients) => [
                ...prevIngredients,
                currentIngredient.trim(),
            ]);
            setCurrentIngredient(""); // Clear the current input field after adding
        }
    };

    // Handle adding a new instruction step
    const addInstruction = () => {
        if (currentInstruction.trim() !== "") {
            setInstructions((prevInstructions) => [
                ...prevInstructions,
                currentInstruction.trim(),
            ]);
            setCurrentInstruction(""); // Clear the current input field after adding
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (ingredients.length === 0 || instructions.length === 0) {
            setError("Please add at least one ingredient and one instruction.");
            return; // Prevent form submission if validation fails
        }
        // Create the recipe data
        const recipeData = {
            name,
            ingredients,
            instructions,
        };

        try {
            // Send POST request to the backend API
            const response = await axios.post("http://localhost:3001/addRecipe", recipeData);

            // Handle success
            alert("Recipe added successfully!");
            setName("");
            setIngredients([]);
            setInstructions([]);
            setCurrentIngredient(""); // Clear the current ingredient input
            setCurrentInstruction(""); // Clear the current instruction input
        } catch (err) {
            // Handle error
            setError("Error adding recipe");
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Add Your Recipe</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Recipe Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                {/* Ingredients Section */}
                <div>
                    <label htmlFor="ingredients">Ingredients:</label>
                    <input
                        type="text"
                        id="currentIngredient"
                        value={currentIngredient}
                        onChange={(e) => setCurrentIngredient(e.target.value)}
                        placeholder="Enter ingredient"
                    />
                    <button type="button" onClick={addIngredient}>Add Ingredient</button>
                </div>
                <div>
                    <h4>Ingredients List:</h4>
                    <ul>
                        {ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                </div>

                {/* Instructions Section */}
                <div>
                    <label htmlFor="instructions">Instructions:</label>
                    <input
                        type="text"
                        id="currentInstruction"
                        value={currentInstruction}
                        onChange={(e) => setCurrentInstruction(e.target.value)}
                        placeholder="Enter step of instruction"
                    />
                    <button type="button" onClick={addInstruction}>Add Step</button>
                </div>
                <div>
                    <h4>Instructions List:</h4>
                    <ul>
                        {instructions.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ul>
                </div>

                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit">Submit Recipe</button>
            </form>
        </div>
    );
}

export default RecipeForm;

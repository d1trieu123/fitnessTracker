import React, { useEffect, useState } from "react";
import axios from "axios";

function CurrentRecipes() {
    const [currentRecipes, setCurrentRecipes] = useState([]);
    const [availRecipes, setAvailRecipes] = useState([]);
    const [editingRecipe, setEditingRecipe] = useState(null); // Track the recipe being edited
    const [updatedRecipe, setUpdatedRecipe] = useState({ name: "", ingredients: [], instructions: [] });

    useEffect(() => {
        fetchRecipes();
        fetchAvailRecipes();
    }, []);

    const fetchRecipes = async () => {
        try {
            const response = await axios.get("http://localhost:3001/getRecipes");
            setCurrentRecipes(response.data.recipes);
        } catch (error) {
            console.error("Error fetching recipes:", error);
        }
    };

    const fetchAvailRecipes = async () => {
        try {
            const response = await axios.get("http://localhost:3001/getAvailRecipes");
            setAvailRecipes(response.data.recipes);
        } catch (error) {
            console.error("Error fetching available recipes:", error);
        }
    };

    const deleteRecipe = async (recipeName) => {
        try {
            await axios.delete(`http://localhost:3001/deleteRecipe`, { data: { name: recipeName } });
            setCurrentRecipes((prev) => prev.filter((recipe) => recipe.name !== recipeName));
        } catch (error) {
            console.error("Error deleting recipe:", error);
        }
    };

    const editRecipe = (recipe) => {
        setEditingRecipe(recipe);
        setUpdatedRecipe(recipe);
    };

    const saveRecipe = async () => {
        try {
            await axios.put("http://localhost:3001/updateRecipe", updatedRecipe);
            setEditingRecipe(null);
            fetchRecipes(); // Refresh the recipe list
        } catch (error) {
            console.error("Error updating recipe:", error);
        }
    };

    return (
        <div style={{ display: "flex", gap: "20px", justifyContent: "center", padding: "20px" }}>
            {/* Current Recipes Section */}
            <div
                style={{
                    flex: 1,
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    padding: "20px",
                    backgroundColor: "#fff",
                }}
            >
                <h1 style={{ textAlign: "center", marginBottom: "20px" }}>All Recipes</h1>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
                    {currentRecipes.map((recipe, index) => (
                        <div
                            key={index}
                            style={{
                                flex: "1 1 calc(300px - 20px)",
                                border: "1px solid #eee",
                                borderRadius: "8px",
                                padding: "15px",
                                maxWidth: "300px",
                                backgroundColor: "#f9f9f9",
                                position: "relative",
                            }}
                        >
                            <h2 style={{ color: "#333", marginBottom: "10px" }}>{recipe.name}</h2>
                            <h3 style={{ color: "#555", marginBottom: "5px" }}>Ingredients:</h3>
                            <ul style={{ paddingLeft: "20px", marginBottom: "10px" }}>
                                {recipe.ingredients.map((ingredient, i) => (
                                    <li key={i} style={{ color: "#666", marginBottom: "5px" }}>
                                        {ingredient}
                                    </li>
                                ))}
                            </ul>
                            <h3 style={{ color: "#555", marginBottom: "5px" }}>Instructions:</h3>
                            <ol style={{ paddingLeft: "20px", color: "#666" }}>
                                {recipe.instructions.map((instruction, i) => (
                                    <li key={i} style={{ marginBottom: "5px" }}>
                                        {instruction}
                                    </li>
                                ))}
                            </ol>
                            <button
                                style={{
                                    position: "absolute",
                                    top: "10px",
                                    right: "10px",
                                    backgroundColor: "red",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                                onClick={() => deleteRecipe(recipe.name)}
                            >
                                X
                            </button>
                            <button
                                style={{
                                    marginTop: "10px",
                                    backgroundColor: "blue",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    padding: "5px 10px",
                                }}
                                onClick={() => editRecipe(recipe)}
                            >
                                Edit
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Editing Section */}
            {editingRecipe && (
                <div style={{ flex: 1, padding: "20px" }}>
                    <h2>Edit Recipe</h2>
                    <input
                        type="text"
                        value={updatedRecipe.name}
                        onChange={(e) =>
                            setUpdatedRecipe((prev) => ({ ...prev, name: e.target.value }))
                        }
                        placeholder="Recipe Name"
                        style={{ width: "100%", marginBottom: "10px" }}
                    />
                    <textarea
                        value={updatedRecipe.ingredients.join(", ")}
                        onChange={(e) =>
                            setUpdatedRecipe((prev) => ({
                                ...prev,
                                ingredients: e.target.value.split(","),
                            }))
                        }
                        placeholder="Ingredients (comma-separated)"
                        style={{ width: "100%", marginBottom: "10px" }}
                    />
                    <textarea
                        value={updatedRecipe.instructions.join("\n")}
                        onChange={(e) =>
                            setUpdatedRecipe((prev) => ({
                                ...prev,
                                instructions: e.target.value.split("\n"),
                            }))
                        }
                        placeholder="Instructions (one per line)"
                        style={{ width: "100%", marginBottom: "10px" }}
                    />
                    <button
                        onClick={saveRecipe}
                        style={{
                            backgroundColor: "green",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            padding: "10px 15px",
                        }}
                    >
                        Save
                    </button>
                    <button
                        onClick={() => setEditingRecipe(null)}
                        style={{
                            backgroundColor: "gray",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            padding: "10px 15px",
                            marginLeft: "10px",
                        }}
                    >
                        Cancel
                    </button>
                </div>
            )}

            {/* Available Recipes Section */}
            <div
                style={{
                    flex: 1,
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    padding: "20px",
                    backgroundColor: "#fff",
                }}
            >
                <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Available Recipes</h1>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
                    {availRecipes.map(([recipeName, missingIngredients], index) => (
                        <div
                            key={index}
                            style={{
                                flex: "1 1 calc(300px - 20px)",
                                border: "1px solid #eee",
                                borderRadius: "8px",
                                padding: "15px",
                                maxWidth: "300px",
                                backgroundColor: "#f9f9f9",
                            }}
                        >
                            <h2 style={{ color: "#333", marginBottom: "10px" }}>{recipeName}</h2>
                            <h3 style={{ color: "red", marginBottom: "5px" }}>Missing Ingredients:</h3>
                            <ul style={{ paddingLeft: "20px", marginBottom: "10px" }}>
                                {missingIngredients.map((ingredient, i) => (
                                    <li key={i} style={{ color: "red", marginBottom: "5px" }}>
                                        {ingredient}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CurrentRecipes;

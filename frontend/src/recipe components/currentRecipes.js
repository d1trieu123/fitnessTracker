import React, { useEffect, useState } from "react";
import axios from "axios";


function CurrentRecipes() {
    const [currentRecipes, setCurrentRecipes] = useState([]);
    const [availRecipes, setAvailRecipes] = useState([]);
    const [editingRecipe, setEditingRecipe] = useState(null); // Track the recipe being edited
    const [updatedRecipe, setUpdatedRecipe] = useState({ name: "", ingredients: [], instructions: [] });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [isFullModalOpen, setIsFullModalOpen] = useState(false);

    const handleViewFullRecipe = (recipe) => {
        setSelectedRecipe(recipe);
        setIsModalOpen(true);
    };

    const handleFullViewAvailRecipe = (recipe) => {
        setSelectedRecipe(recipe);
        setIsFullModalOpen(true)
    };


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
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between", // Ensures content and buttons are spaced properly
                                position: "relative", // This will make the button's absolute positioning relative to this card
                                height: "auto",
                                minHeight: "400px", // Set a minimum height to maintain consistent card sizes
                            }}
                        >
                            <div>
                                <h2 style={{ color: "#333", marginBottom: "10px" }}>{recipe.name}</h2>
                                <h3 style={{ color: "#555", marginBottom: "5px" }}>Ingredients:</h3>
                                <ul style={{ paddingLeft: "20px", marginBottom: "10px" }}>
                                    {recipe.ingredients.slice(0, 3).map((ingredient, i) => (
                                        <li key={i} style={{ color: "#666", marginBottom: "5px" }}>
                                            {ingredient}
                                        </li>
                                    ))}
                                    {recipe.ingredients.length > 3 && (
                                        <li style={{ color: "#666", fontStyle: "italic" }}>...</li>
                                    )}
                                </ul>
                                <h3 style={{ color: "#555", marginBottom: "5px" }}>Instructions:</h3>
                                <ol style={{ paddingLeft: "20px", color: "#666" }}>
                                    {recipe.instructions.slice(0, 3).map((instruction, i) => (
                                        <li key={i} style={{ marginBottom: "5px" }}>
                                            {instruction}
                                        </li>
                                    ))}
                                    {recipe.instructions.length > 3 && (
                                        <li style={{ color: "#666", fontStyle: "italic" }}>...</li>
                                    )}
                                </ol>
                            </div>

                            <div style={{ marginTop: "auto" }}> {/* Ensures buttons are pushed to the bottom */}

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
                                        backgroundColor: "blue",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        padding: "5px 10px",
                                        marginBottom: "10px", // Add spacing between the buttons
                                        width: "100%", // Ensure the button takes full width
                                    }}
                                    onClick={() => editRecipe(recipe)}
                                >
                                    Edit
                                </button>
                                <button
                                    style={{
                                        backgroundColor: "green",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        padding: "5px 10px",
                                        width: "100%", // Ensure the button takes full width
                                    }}
                                    onClick={() => handleViewFullRecipe(recipe)}
                                >
                                    See Full Recipe
                                </button>
                            </div>
                        </div>
                    ))}

                </div>
            </div>


            {isModalOpen && (
                <>
                    {/* Modal Popup */}
                    <div
                        style={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                            padding: "20px",
                            zIndex: 1000,
                            maxWidth: "500px",
                            width: "90%",
                        }}
                    >
                        <h2>{selectedRecipe.name}</h2>
                        <h3>Ingredients:</h3>
                        <ul>
                            {selectedRecipe.ingredients.map((ingredient, i) => (
                                <li key={i}>{ingredient}</li>
                            ))}
                        </ul>
                        <h3>Instructions:</h3>
                        <ol>
                            {selectedRecipe.instructions.map((instruction, i) => (
                                <li key={i}>{instruction}</li>
                            ))}
                        </ol>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            style={{
                                marginTop: "20px",
                                backgroundColor: "gray",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                padding: "10px 15px",
                                cursor: "pointer",
                            }}
                        >
                            Close
                        </button>
                    </div>

                    {/* Grey Backdrop */}
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            zIndex: 999,
                        }}
                        onClick={() => setIsModalOpen(false)}
                    ></div>
                </>
            )}




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
                        value={updatedRecipe.ingredients.join("\n")}
                        onChange={(e) =>
                            setUpdatedRecipe((prev) => ({
                                ...prev,
                                ingredients: e.target.value.split("\n"),
                            }))
                        }
                        placeholder="Ingredients (one per line)"
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
                    {availRecipes.map(
                        ([recipeName, { missingIngredients, matchedIngredients, similarIngredientsMap }], index) => (
                            <div
                                key={index}
                                style={{
                                    flex: "1 1 calc(300px - 20px)",
                                    border: "1px solid #eee",
                                    borderRadius: "8px",
                                    padding: "15px",
                                    maxWidth: "300px",
                                    backgroundColor: "#f9f9f9",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between", // Ensures content and button are spaced properly
                                    height: "auto", // Allow the height to adjust based on content
                                    minHeight: "400px", // Set a minimum height to maintain consistent card sizes
                                }}
                            >
                                <div>
                                    <h2 style={{ color: "#333", marginBottom: "10px" }}>{recipeName}</h2>

                                    {/* Matched Ingredients Section */}
                                    <h3 style={{ color: "green", marginBottom: "5px" }}>Matched Ingredients: {matchedIngredients.length}</h3>
                                    <ul style={{ paddingLeft: "20px", marginBottom: "10px" }}>
                                        {matchedIngredients.map((ingredient, i) => (
                                            <li key={i} style={{ color: "green", marginBottom: "5px" }}>
                                                {ingredient}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Similar Ingredients Section */}
                                    <h3 style={{ color: "orange", marginBottom: "5px" }}>
                                        Similar Ingredients: {Object.keys(similarIngredientsMap).length}
                                    </h3>
                                    <ul style={{ paddingLeft: "20px", marginBottom: "10px" }}>
                                        {Object.entries(similarIngredientsMap).map(([recipeIngredient, similarIngredients], i) => (
                                            <li key={i} style={{ marginBottom: "10px" }}>
                                                <h4 style={{ color: "orange" }}>{recipeIngredient}:</h4>
                                                <ul style={{ paddingLeft: "20px", marginBottom: "10px" }}>
                                                    {similarIngredients.map((similarIngredient, j) => (
                                                        <li key={j} style={{ color: "black", marginBottom: "5px" }}>
                                                            {similarIngredient}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Missing Ingredients Section */}
                                    <h3 style={{ color: "red", marginBottom: "5px" }}>Missing Ingredients: {missingIngredients.length}</h3>
                                    <ul style={{ paddingLeft: "20px", marginBottom: "10px" }}>
                                        {missingIngredients.map((ingredient, i) => (
                                            <li key={i} style={{ color: "red", marginBottom: "5px" }}>
                                                {ingredient}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* See Full Recipe Button */}
                                <button
                                    style={{
                                        marginTop: "auto", // Push button to the bottom
                                        backgroundColor: "green",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        padding: "5px 10px",
                                        marginLeft: "10px",
                                    }}
                                    onClick={() =>
                                        handleFullViewAvailRecipe(currentRecipes.find((recipe) => recipe.name === recipeName), missingIngredients, matchedIngredients, similarIngredientsMap)
                                    }
                                >
                                    See Full Recipe
                                </button>

                            </div>

                        )
                    )}

                    {isFullModalOpen && (
                        <>
                            {/* Modal Popup */}
                            <div
                                style={{
                                    position: "fixed",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    backgroundColor: "#fff",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                    padding: "20px",
                                    zIndex: 1000,
                                    maxWidth: "500px",
                                    width: "90%",
                                }}
                            >
                                <h2>{selectedRecipe.name}</h2>
                                <h3>Ingredients:</h3>
                                <ul>
                                    {selectedRecipe.ingredients.map((ingredient, i) => (
                                        <li key={i}>{ingredient}</li>
                                    ))}
                                </ul>
                                <h3>Instructions:</h3>
                                <ol>
                                    {selectedRecipe.instructions.map((instruction, i) => (
                                        <li key={i}>{instruction}</li>
                                    ))}
                                </ol>
                                <button
                                    onClick={() => setIsFullModalOpen(false)}
                                    style={{
                                        marginTop: "20px",
                                        backgroundColor: "gray",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "4px",
                                        padding: "10px 15px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Close
                                </button>
                            </div>

                            {/* Grey Backdrop */}
                            <div
                                style={{
                                    position: "fixed",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                                    zIndex: 999,
                                }}
                                onClick={() => setIsFullModalOpen(false)}
                            ></div>
                        </>
                    )}
                </div>
            </div>

        </div>

    );
}

export default CurrentRecipes;

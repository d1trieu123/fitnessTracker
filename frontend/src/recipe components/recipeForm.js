import React, { useState } from "react";
import axios from "axios";

function RecipeForm() {
    const [name, setName] = useState("");
    const [ingredients, setIngredients] = useState([]);
    const [currentIngredient, setCurrentIngredient] = useState("");
    const [instructions, setInstructions] = useState([]);
    const [currentInstruction, setCurrentInstruction] = useState("");
    const [error, setError] = useState("");

    const addIngredient = () => {
        if (currentIngredient.trim() !== "") {
            setIngredients((prevIngredients) => [
                ...prevIngredients,
                currentIngredient.trim(),
            ]);
            setCurrentIngredient("");
        }
    };

    const addInstruction = () => {
        if (currentInstruction.trim() !== "") {
            setInstructions((prevInstructions) => [
                ...prevInstructions,
                currentInstruction.trim(),
            ]);
            setCurrentInstruction("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (ingredients.length === 0 || instructions.length === 0) {
            setError("Please add at least one ingredient and one instruction.");
            return;
        }

        const recipeData = {
            name,
            ingredients,
            instructions,
        };

        try {
            const response = await axios.post("http://localhost:3001/addRecipe", recipeData);
            alert("Recipe added successfully!");
            setName("");
            setIngredients([]);
            setInstructions([]);
            setCurrentIngredient("");
            setCurrentInstruction("");
        } catch (err) {
            setError("Error adding recipe");
            console.error(err);
        }
    };

    const styles = {
        container: {
            maxWidth: "600px",
            margin: "20px auto",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        },
        title: {
            textAlign: "center",
            color: "#333",
        },
        inputGroup: {
            marginBottom: "15px",
        },
        label: {
            display: "block",
            marginBottom: "5px",
            fontWeight: "bold",
            color: "#555",
        },
        input: {
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
        },
        button: {
            padding: "10px 20px",
            fontSize: "16px",
            color: "#fff",
            backgroundColor: "#007bff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "10px",
        },
        buttonHover: {
            backgroundColor: "#0056b3",
        },
        list: {
            listStyleType: "none",
            padding: "0",
        },
        listItem: {
            padding: "5px 0",
            borderBottom: "1px solid #ddd",
        },
        error: {
            color: "red",
            marginTop: "10px",
        },
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Add Your Recipe</h2>
            <form onSubmit={handleSubmit}>
                <div style={styles.inputGroup}>
                    <label htmlFor="name" style={styles.label}>Recipe Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label htmlFor="ingredients" style={styles.label}>Ingredients:</label>
                    <input
                        type="text"
                        id="currentIngredient"
                        value={currentIngredient}
                        onChange={(e) => setCurrentIngredient(e.target.value)}
                        placeholder="Enter ingredient"
                        style={styles.input}
                    />
                    <button
                        type="button"
                        onClick={addIngredient}
                        style={styles.button}
                        onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                        onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                    >
                        Add Ingredient
                    </button>
                </div>
                <div>
                    <h4>Ingredients List:</h4>
                    <ul style={styles.list}>
                        {ingredients.map((ingredient, index) => (
                            <li key={index} style={styles.listItem}>{ingredient}</li>
                        ))}
                    </ul>
                </div>

                <div style={styles.inputGroup}>
                    <label htmlFor="instructions" style={styles.label}>Instructions:</label>
                    <input
                        type="text"
                        id="currentInstruction"
                        value={currentInstruction}
                        onChange={(e) => setCurrentInstruction(e.target.value)}
                        placeholder="Enter step of instruction"
                        style={styles.input}
                    />
                    <button
                        type="button"
                        onClick={addInstruction}
                        style={styles.button}
                        onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                        onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                    >
                        Add Step
                    </button>
                </div>
                <div>
                    <h4>Instructions List:</h4>
                    <ul style={styles.list}>
                        {instructions.map((step, index) => (
                            <li key={index} style={styles.listItem}>{step}</li>
                        ))}
                    </ul>
                </div>

                {error && <p style={styles.error}>{error}</p>}
                <button type="submit" style={styles.button}>Submit Recipe</button>
            </form>
        </div>
    );
}

export default RecipeForm;

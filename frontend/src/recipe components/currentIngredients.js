import React, { useEffect, useState } from "react";
import axios from "axios";

function CurrentIngredients() {
    const [ingredients, setIngredients] = useState([]);
    const [currentIngredient, setCurrentIngredient] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (currentIngredient.trim() === "") {
            alert("Please enter an ingredient!");
            return;
        }
        try {
            await axios.post("http://localhost:3001/addIngredient", { name: currentIngredient });
            alert("Ingredient added successfully!");
            setIngredients((prevIngredients) => [...prevIngredients, currentIngredient]);
            setCurrentIngredient("");
        } catch (err) {
            console.error("Error adding ingredient:", err);
            alert("Error adding ingredient. Please try again.");
        }
    };

    const handleRemove = async (ingredient) => {
        try {
            await axios.delete("http://localhost:3001/deleteIngredient", { data: { name: ingredient } });
            alert("Ingredient removed successfully!");
            setIngredients((prevIngredients) => prevIngredients.filter((ing) => ing !== ingredient));
        } catch (err) {
            console.error("Error removing ingredient:", err);
            alert("Error removing ingredient. Please try again.");
        }
    };

    useEffect(() => {
        try {
            axios.get("http://localhost:3001/getIngredients")
                .then((response) => {
                    let allIngredients = response.data.ingredients;
                    let names = allIngredients.map((ingredient) => ingredient.name);
                    setIngredients(names);
                })
                .catch((error) => {
                    console.error("Error fetching ingredients:", error);
                });
        } catch (err) {
            console.error(err);
        }
    }, []);

    const styles = {
        container: {
            maxWidth: "600px",
            margin: "0 auto",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#f9f9f9",
        },
        title: {
            textAlign: "center",
            color: "#333",
        },
        form: {
            marginBottom: "20px",
        },
        inputGroup: {
            display: "flex",
            flexDirection: "column",
            marginBottom: "10px",
        },
        label: {
            marginBottom: "5px",
            fontWeight: "bold",
            color: "#555",
        },
        input: {
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
        },
        buttonHover: {
            backgroundColor: "#0056b3",
        },
        ingredientsList: {
            listStyleType: "none",
            padding: "0",
        },
        listItem: {
            padding: "10px",
            borderBottom: "1px solid #ddd",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        },
        removeButton: {
            color: "red",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
        },
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Current Ingredients</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label htmlFor="currentIngredient" style={styles.label}>
                        Current Ingredient:
                    </label>
                    <input
                        type="text"
                        id="currentIngredient"
                        value={currentIngredient}
                        placeholder="Enter ingredient"
                        onChange={(e) => setCurrentIngredient(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                <button
                    type="submit"
                    style={styles.button}
                    onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                    onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                >
                    Add Ingredient
                </button>
            </form>
            <div>
                <h4 style={styles.title}>Ingredients List:</h4>
                <ul style={styles.ingredientsList}>
                    {ingredients.map((ingredient, index) => (
                        <li key={index} style={styles.listItem}>
                            {ingredient}
                            <button
                                style={{
                                    position: "relative",
                                    top: "10px",
                                    right: "10px",
                                    backgroundColor: "red",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                                onClick={() => handleRemove(ingredient)}
                            >
                                X
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default CurrentIngredients;

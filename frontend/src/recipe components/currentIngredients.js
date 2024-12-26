import React, { useEffect, useState, } from "react";
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

    }
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



    return (
        <div>
            <h1>Current Ingredients</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="currentIngredient">Current Ingredient:</label>
                    <input
                        type="text"
                        id="currentIngredient"
                        value={currentIngredient}
                        placeholder="Enter ingredient"
                        onChange={(e) => setCurrentIngredient(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Add Ingredient</button>
            </form>
            <div>
                <h4>Ingredients List:</h4>
                <ul>
                    {ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                    ))}
                </ul>

            </div>
        </div>
    )
}

export default CurrentIngredients

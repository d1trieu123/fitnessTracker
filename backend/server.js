const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const Recipe = require("./models/Recipe");
const Ingredient = require("./models/Ingredients");
const Current_Ingredients = require("./models/currentIngredients");

dotenv.config();


const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error(err));


app.get("/", (req, res) => {
    res.send("Backend is running!");
});

app.post("/addRecipe", async (req, res) => {
    try {
        const { name, ingredients, instructions } = req.body;

        if (!name || !ingredients || !instructions) {
            return res.status(400).json({ error: "All fields are required!" });
        }
        for (let i = 0; i < ingredients.length; i++) {
            const ingredient = ingredients[i];
            const existingIngredient = await Ingredient.findOne({ name: ingredient });
            if (!existingIngredient) {
                const newIngredient = new Ingredient({ name: ingredient });
                await newIngredient.save();
            }
        }


        const newRecipe = new Recipe({ name, ingredients, instructions });
        await newRecipe.save();

        res.status(201).json({ message: "Recipe added successfully!", recipe: newRecipe });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while adding recipe" });
    }
});

app.get("/searchRecipe", async (req, res) => {
    try {
        const { ingredients } = req.body;
        if (!ingredients) {
            return res.status(400).json({ error: "Ingredients are required!" });
        }
        // 

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while searching recipe" });
    }
});

app.get("/getIngredients", async (req, res) => {
    try {
        // Fetch all ingredients from the database
        const ingredients = await Current_Ingredients.find();
        res.status(200).json({ ingredients });


    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while getting ingredients" });
    }
}
);

app.post("/addIngredient", async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Ingredient name is required!" });
        }
        const existingIngredient = await Current_Ingredients.findOne({ name });
        if (existingIngredient) {
            return res.status(400).json({ error: "You already have this ingredient!" });

        }
        const newIngredient = new Current_Ingredients({ name });
        await newIngredient.save();
        res.status(201).json({ message: "Ingredient added successfully!", ingredient: newIngredient });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while adding ingredient" });

    }
});

app.get("/getRecipes", async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.status(200).json({ recipes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while getting recipes" });
    }
});

app.get("/getAvailRecipes", async (req, res) => {
    try {
        const allIngredients = await Current_Ingredients.find();
        const ingredientNames = allIngredients.map((ingredient) => ingredient.name);
        const recipes = await Recipe.find();
        let recipeMap = {}; // map to store recipes with ingredient categories

        for (let i = 0; i < recipes.length; i++) {
            const recipe = recipes[i];
            let missingIngredients = [];
            let matchedIngredients = [];
            let similarIngredientsMap = {}; // To map the similar ingredients for each recipe ingredient

            for (let j = 0; j < recipe.ingredients.length; j++) {
                const ingredient = recipe.ingredients[j];
                let isMatched = false;
                let isSimilar = false;

                for (let k = 0; k < allIngredients.length; k++) {
                    const currentIngredient = allIngredients[k].name;

                    if (ingredient === currentIngredient) {
                        matchedIngredients.push(ingredient);
                        isMatched = true;
                        break; // Stop checking once matched
                    } else if (ingredient.includes(currentIngredient)) {
                        // If a similar ingredient is found, map it
                        if (!similarIngredientsMap[ingredient]) {
                            similarIngredientsMap[ingredient] = [];
                        }
                        similarIngredientsMap[ingredient].push(currentIngredient);
                        isSimilar = true;
                    }
                }

                if (!isMatched && !isSimilar) {
                    missingIngredients.push(ingredient);
                }
            }

            // Store the similar ingredients map
            if (
                missingIngredients.length > 0 ||
                matchedIngredients.length > 0 ||
                Object.keys(similarIngredientsMap).length > 0
            ) {
                recipeMap[recipe.name] = {
                    missingIngredients,
                    matchedIngredients,
                    similarIngredientsMap,
                };
            }
        }

        // Sort recipes by the number of missing ingredients and keep them as an array of tuples
        const sortedRecipes = Object.entries(recipeMap).sort(
            (a, b) => a[1].missingIngredients.length - b[1].missingIngredients.length
        );
        res.status(200).json({ recipes: sortedRecipes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while getting available recipes" });
    }
});


app.delete("/deleteRecipe", async (req, res) => {
    try {
        const { name } = req.body;

        // Check if the name is provided
        if (!name) {
            return res.status(400).json({ error: "Recipe Name is required!" });
        }

        // Find the recipe by name
        const recipe = await Recipe.findOne({ name });

        // Check if the recipe exists
        if (!recipe) {
            return res.status(404).json({ error: "Recipe not found!" });
        }

        // Delete the recipe
        await Recipe.deleteOne({
            name,
        });

        // Send success response
        res.status(200).json({ message: "Recipe deleted successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while deleting recipe" });
    }
});

app.put("/updateRecipe", async (req, res) => {
    try {
        const { name, ingredients, instructions } = req.body;
        if (!name || !ingredients || !instructions) {
            return res.status(400).json({ error: "All fields are required!" });
        }
        for (let i = 0; i < ingredients.length; i++) {
            const ingredient = ingredients[i];
            const existingIngredient = await Ingredient.findOne({ name: ingredient });
            if (!existingIngredient) {
                const newIngredient = new Ingredient({ name: ingredient });
                await newIngredient.save();
            }
        }

        const updatedRecipe = await Recipe.findOneAndUpdate(
            { name },
            { ingredients, instructions },
            { new: true }
        );

        res.status(200).json({ message: "Recipe updated successfully!", recipe: updatedRecipe });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while updating recipe" });
    }
});

app.delete("/deleteIngredient", async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Ingredient name is required!" });
        }
        const existingIngredient = await Current_Ingredients.findOne({ name });
        if (!existingIngredient) {
            return res.status(404).json({ error: "Ingredient not found!" });
        }
        await Current_Ingredients.deleteOne({ name });
        res.status(200).json({ message: "Ingredient deleted successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while deleting ingredient" });
    }
}
);



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

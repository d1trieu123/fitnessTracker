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

        // return all ingredients

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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const Recipe = require("./models/Recipe"); // Import the Recipe model
const Ingredient = require("./models/Ingredients"); // Import the Ingredient model

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
        const ingredients = await Ingredient.find();
        res.status(200).json({ ingredients });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while getting ingredients" });
    }
}
);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

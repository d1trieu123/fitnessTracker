// models/Recipe.js

const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    ingredients: {
        type: [String], // Array of ingredients
        required: true,
    },
    instructions: {
        type: [String], // Array of instruction steps
        required: true,
    },
});

const Recipe = mongoose.model("Recipe", recipeSchema, "recipes");

module.exports = Recipe;

const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Ensure no duplicate ingredients are added
    },
});

const Ingredient = mongoose.model("Ingredient", ingredientSchema, "ingredients");

module.exports = Ingredient;

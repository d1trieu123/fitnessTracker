const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Ensure no duplicate ingredients are added
    },
});

const Current_Ingredients = mongoose.model("Current_Ingredients", ingredientSchema, "current_ingredients");

module.exports = Current_Ingredients;

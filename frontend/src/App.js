import React, { useEffect, useState } from "react";
import API from "./api.js";
import RecipeForm from "./recipe components/recipeForm.js";
import CurrentIngredients from "./recipe components/currentIngredients.js";
import CurrentRecipes from "./recipe components/currentRecipes.js";

const App = () => {


  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch data from the backend
    API.get("/")
      .then((response) => {
        setMessage(response.data); // Set the response data
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <div style={{ flexDirection: "row" }}>
        <RecipeForm />
        <CurrentIngredients />
        <CurrentRecipes />
      </div>

    </div>


  );
};

export default App;

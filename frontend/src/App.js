import React, { useEffect, useState } from "react";
import API from "./api.js";
import RecipeForm from "./recipe components/recipeForm.js";


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
      <RecipeForm />
    </div>


  );
};

export default App;

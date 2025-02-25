import { auth, db } from "./firebase-config.js";
import {
    ref,
    set,
    get,
    remove,
    update,
    onValue
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

// Add or Update Recipe
window.addOrUpdateRecipe = function () {
    const user = auth.currentUser;
    if (!user) return showAlert("You need to be logged in.", "danger");

    const title = document.getElementById("recipe-title").value.trim();
    const ingredients = document.getElementById("recipe-ingredients").value.trim();
    const instructions = document.getElementById("recipe-instructions").value.trim();
    const category = document.getElementById("recipe-category").value;
    const recipeId = document.getElementById("recipe-id").value || Date.now().toString();

    if (!title || !ingredients || !instructions || !category) {
        showAlert("All fields are required!", "danger");
        return;
    }

    set(ref(db, `recipes/${user.uid}/${recipeId}`), {
        title,
        ingredients,
        instructions,
        category,
        favorite: false,
        id: recipeId,
        userId: user.uid
    }).then(() => {
        showAlert("Recipe saved successfully!", "success");
        resetForm(); // Clear form after successful save
        loadRecipes();
    }).catch(error => {
        showAlert("Error saving recipe: " + error.message, "danger");
    });
};

// Load Recipes with Filtering
window.loadRecipes = function () {
    const user = auth.currentUser;
    if (!user) return;

    const recipeTable = document.getElementById("recipe-list");
    recipeTable.innerHTML = "";

    const filterCategory = document.getElementById("filter-category").value;
    const filterIngredient = document.getElementById("filter-ingredient").value.trim().toLowerCase();
    const filterFavorites = document.getElementById("filter-favorites").checked;

    onValue(ref(db, `recipes/${user.uid}`), (snapshot) => {
        recipeTable.innerHTML = "";
        if (snapshot.exists()) {
            const data = snapshot.val();
            let foundRecipes = false;

            for (const key in data) {
                const { title, ingredients, instructions, category, favorite, id } = data[key];

                if (filterCategory !== "all" && category !== filterCategory) continue;
                if (filterIngredient && !ingredients.toLowerCase().includes(filterIngredient)) continue;
                if (filterFavorites && !favorite) continue;

                foundRecipes = true;

                const row = `
                    <tr>
                        <td>${title}</td>
                        <td>${ingredients}</td>
                        <td>${instructions}</td>
                        <td>${category}</td>
                        <td style="display: flex; flex-direction: column; gap: 3px; justify-content: center; align-items: center;">
                            <button class="btn btn-primary btn-sm" onclick="editRecipe('${id}')">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteRecipe('${id}')">Delete</button>
                            <button class="btn btn-warning btn-sm" onclick="toggleFavorite('${id}', ${favorite})">${favorite ? "★" : "☆"}</button>
                        </td>
                    </tr>
                `;
                recipeTable.innerHTML += row;
            }

            if (!foundRecipes) {
                recipeTable.innerHTML = "<tr><td colspan='5'>No recipes found</td></tr>";
            }
        } else {
            recipeTable.innerHTML = "<tr><td colspan='5'>No recipes found</td></tr>";
        }
    });
};

// Toggle Favorite Recipe
window.toggleFavorite = function (id, currentStatus) {
    const user = auth.currentUser;
    if (!user) return;

    update(ref(db, `recipes/${user.uid}/${id}`), { favorite: !currentStatus })
        .then(() => loadRecipes())
        .catch(error => showAlert("Error updating favorite status: " + error.message, "danger"));
};

// Delete Recipe
window.deleteRecipe = function (id) {
    const user = auth.currentUser;
    if (!user) return showAlert("You need to be logged in.", "danger");

    remove(ref(db, `recipes/${user.uid}/${id}`)).then(() => {
        showAlert("Recipe Deleted!", "success");
        loadRecipes();
    }).catch(error => {
        showAlert("Error deleting recipe: " + error.message, "danger");
    });
};

// Edit Recipe
window.editRecipe = function (id) {
    const user = auth.currentUser;
    if (!user) return showAlert("You need to be logged in.", "danger");

    get(ref(db, `recipes/${user.uid}/${id}`)).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            document.getElementById("recipe-title").value = data.title;
            document.getElementById("recipe-ingredients").value = data.ingredients;
            document.getElementById("recipe-instructions").value = data.instructions;
            document.getElementById("recipe-category").value = data.category;
            document.getElementById("recipe-id").value = id;
        } else {
            showAlert("Recipe not found!", "danger");
        }
    }).catch(error => {
        showAlert("Error loading recipe: " + error.message, "danger");
    });
};

// Reset Form
function resetForm() {
    document.getElementById("recipe-title").value = "";
    document.getElementById("recipe-ingredients").value = "";
    document.getElementById("recipe-instructions").value = "";
    document.getElementById("recipe-category").value = "Breakfast";
    document.getElementById("recipe-id").value = "";
}

// Show Alert Messages using Bootstrap Modal
function showAlert(message, type) {
    document.getElementById("modalTitle").textContent = type === "danger" ? "Error" : "Success";
    document.getElementById("modalMessage").innerHTML = message;
    
    let messageModal = new bootstrap.Modal(document.getElementById("messageModal"), { backdrop: "static" });
    messageModal.show();
}

// Ensure Recipes Load After Login
auth.onAuthStateChanged((user) => {
    if (user) {
        loadRecipes();
    }
});

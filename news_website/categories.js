document.addEventListener("DOMContentLoaded", () => {
    const categoriesContainer = document.getElementById("categories");
    const categories = ["Home", "देश", "दुनिया", "मनोरंजन", "क्रिकेट", "कारोबार", "नौकरी", "शिक्षा"];

    categories.forEach(category => {
        const categoryItem = document.createElement("a");

        if (category === "Home") {
            categoryItem.href = "index.html"; // Redirect Home category to the full-featured home page
        } else {
            categoryItem.href = `category.html?category=${encodeURIComponent(category)}`;
        }

        categoryItem.classList.add("category-item");
        categoryItem.textContent = category;
        categoriesContainer.appendChild(categoryItem);
    });
});

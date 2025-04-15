const BASE_URL = "http://localhost:8080/api/news";

// This function will fetch the categories and display them
async function fetchCategories(targetElement) {
    const categories = [
        { category: "Home", url: "" },
        { category: "देश", url: "/india-news" },
        { category: "दुनिया", url: "/world" },
        { category: "मनोरंजन", url: "/entertainment" },
        { category: "क्रिकेट", url: "/cricket" },
        { category: "कारोबार", url: "/business" },
        { category: "नौकरी", url: "/jobs" },
        { category: "शिक्षा", url: "/education" },
        { category: "टेक्नोलॉजी", url: "/technology" },
        { category: "ऑटो", url: "/automobiles" },
        { category: "ज्योतिष", url: "/astrology" },
        { category: "खेल", url: "/sports" },
        { category: "हेल्थ एंड फिटनेस", url: "/fitness" },
        { category: "फैशन", url: "/fashion" },
        { category: "शक्ति", url: "/shakti" },
        { category: "आस्था", url: "/spirituality" },
        { category: "बॉलीवुड", url: "/bollywood" },
        { category: "इंदौर", url: "/indore" },
        { category: "मध्य प्रदेश", url: "/madhya-pradesh" },
        { category: "मुंबई", url: "/mumbai" },
        { category: "दिल्ली", url: "/delhi" },
        { category: "भोपाल", url: "/bhopal" },
    ];

    targetElement.innerHTML = "";  // Clear the container

    categories.forEach(({ category, url }) => {
        const categoryItem = document.createElement("a");
        categoryItem.href = url;
        categoryItem.classList.add("category-item");
        categoryItem.textContent = category;

        // Add click event to dynamically fetch and display the news for the category
        categoryItem.addEventListener("click", (event) => {
            event.preventDefault();  // Prevent page reload on click
            renderCategoryNews(url); // Call renderCategoryNews with the URL
        });

        targetElement.appendChild(categoryItem);  // Add the link to the categories container
    });
}

// This function will fetch the news for the selected category and render it
async function fetchCategoryNews(category) {
    const fullURL = `${BASE_URL}${category}`;
    console.log("Requesting category news from:", fullURL);

    try {
        const response = await fetch(fullURL);
        if (!response.ok) {
            throw new Error(`Error fetching category news: ${response.statusText}`);
        }
        const data = await response.json();
        return data;  // Return the data for rendering
    } catch (error) {
        console.error("Error fetching category news:", error);
        return [];  // Return an empty array in case of an error
    }
}

// This function renders the fetched news into the page
async function renderCategoryNews(category) {
    const newsContainer = document.getElementById("news-container");
    const newsData = await fetchCategoryNews(category);  // Fetch news for the category

    newsContainer.innerHTML = newsData.length
        ? newsData.map(news => `
            <div class="news-item">
                <img src="${news.image}" alt="News Image" onerror="this.src='Assets/default.jpg';">
                <h2>${news.title}</h2>
                <p>${news.description}</p>
                <a href="${news.url}" target="_blank">Read More</a>
            </div>
        `).join("")
        : "<p>No news available for this category.</p>";
}

// Initialize the categories section
document.addEventListener("DOMContentLoaded", () => {
    const categoriesContainer = document.getElementById("categories");
    fetchCategories(categoriesContainer);  // Fetch and display categories when page is loaded
});

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");

    if (!category) return;

    // Update page title
    document.getElementById("category-title").textContent = `News from ${category}`;

    // Fetch news based on category
    const BASE_URL = "http://localhost:8080/api";
    async function fetchCategoryNews() {
        try {
            const response = await fetch(`${BASE_URL}/news?category=${encodeURIComponent(category)}`);
            const data = await response.json();
            if (!Array.isArray(data)) return [];

            return data.map(article => ({
                title: article.headline || "No Title",
                description: article.subheading || "No Description",
                image: article.imageUrl ? (article.imageUrl.startsWith("//") ? `https:${article.imageUrl}` : article.imageUrl) : "Assets/default.jpg",
                url: article.articleLink || "#"
            }));
        } catch (error) {
            console.error("Error fetching category news:", error);
            return [];
        }
    }

    // Render news
    async function renderCategoryNews() {
        const newsContainer = document.getElementById("news-container");
        const newsData = await fetchCategoryNews();
        
        if (!newsData.length) {
            newsContainer.innerHTML = "<p>No news available for this category.</p>";
            return;
        }

        newsContainer.innerHTML = newsData.map(news => `
            <div class="news-item">
                <img src="${news.image}" alt="News Image" onerror="this.src='Assets/default.jpg';">
                <h2>${news.title}</h2>
                <p>${news.description}</p>
                <a href="${news.url}" target="_blank">Read More</a>
            </div>
        `).join("");
    }

    await renderCategoryNews();
});

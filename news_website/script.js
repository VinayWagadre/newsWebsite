document.addEventListener("DOMContentLoaded", async () => {
    const slider = document.getElementById("slider");
    const trendingList = document.getElementById("trending-list");
    const newsContainer = document.getElementById("news-container");
    const categoriesContainer = document.getElementById("navbar-categories");
    const sidebarCategories = document.getElementById("sidebar-categories");

    
    let currentSlide = 0;
    const BASE_URL = "http://localhost:8080/api";

    // Fetch data from API
    async function fetchNews(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (!Array.isArray(data)) return [];

            return data.map(article => ({
                title: article.headline || article.breakingHeadline || "No Title",
                description: article.subheading || "No Description",
                image: article.imageUrl ? (article.imageUrl.startsWith("//") ? `https:${article.imageUrl}` : article.imageUrl) : "Assets/default.jpg",
                url: article.articleLink || article.breakingUrl || "#",
                id: article.tid || null,
                time: article.date || "Unknown Time"
            }));
        } catch (error) {
            console.error("Error fetching news:", error);
            return [];
        }
    }

    // Setup slider dynamically
    async function setupSlider() {
        const newsData = await fetchNews(`${BASE_URL}/news/home`);
        if (!newsData.length) return;

        slider.innerHTML = "";
        newsData.forEach(news => {
            let slide = document.createElement("div");
            slide.classList.add("slide");
            slide.innerHTML = `
                <img src="${news.image}" alt="news" onerror="this.src='Assets/default.jpg';">
                <div class="slide-content">
                    <h2 class="news-title" data-url="${news.url}">${news.title}</h2>
                </div>
            `;
            slider.appendChild(slide);
        });
        addClickEventToTitles();
        slider.children[0].classList.add('active');
        updateSlider();
    }

    function updateSlider() {
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    function changeSlide(direction) {
        const totalSlides = slider.children.length;
        if (!totalSlides) return;
        currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
        updateSlider();
        [...slider.children].forEach((slide, index) => slide.classList.toggle('active', index === currentSlide));
    }

    setInterval(() => changeSlide(1), 5000);
    document.getElementById("prev").addEventListener("click", () => changeSlide(-1));
    document.getElementById("next").addEventListener("click", () => changeSlide(1));

    // Fetch Breaking News
    async function fetchBreakingNews() {
        const breakingNews = await fetchNews(`${BASE_URL}/breakingnews`);
        trendingList.innerHTML = "";
        breakingNews.slice(0, 7).forEach(news => {
            let listItem = document.createElement("li");
            listItem.classList.add("news-title");
            listItem.setAttribute("data-id", news.id);
            listItem.setAttribute("data-url", news.url);  // ✅ Add URL attribute
            listItem.innerHTML = `🔥 ${news.title}`;
            trendingList.appendChild(listItem);
        });
        addClickEventToBreakingNews();
    }
    
    function addClickEventToBreakingNews() {
        document.querySelectorAll(".news-title").forEach(title => {
            title.addEventListener("click", function () {
                const newsId = this.getAttribute("data-id");
                const newsUrl = this.getAttribute("data-url");
    
                if (newsId) {
                    let finalUrl = `/news_website/breakingnews.html?id=${newsId}`;
                    if (newsUrl) {
                        finalUrl += `&url=${encodeURIComponent(newsUrl)}`;  // ✅ Append encoded URL
                    }
                    window.location.href = finalUrl;
                } else {
                    console.error("Missing News ID!");
                }
            });
        });
    }
    
    // Fetch Top News and render as cards
async function fetchTopNews() {
    const topNews = await fetchNews(`${BASE_URL}/news/home`);
    const topNewsContainer = document.getElementById("top-news");

    if (!topNews.length) return;

    topNewsContainer.innerHTML = "";

    topNews.forEach(news => {
        const card = document.createElement("div");
        card.classList.add("news-card");

        card.innerHTML = `
            <img src="${news.image}" alt="News Image" onerror="this.src='Assets/default.jpg';">
            <div class="card-content">
                <h3>${news.title}</h3>
                <a href="${news.url}" target="_blank">Read More</a>
            </div>
        `;

        topNewsContainer.appendChild(card);
    });
}


    // Fetch Categories
    async function fetchCategories(targetElement) {
        const categories = ["Home", "देश", "दुनिया", "मनोरंजन", "क्रिकेट", "कारोबार", "नौकरी", "शिक्षा","टेक्नोलॉजी","ऑटो","ज्योतिष","खेल","हेल्थ एंड फिटनेस","फैशन","आस्था","बॉलीवुड","इंदौर","मध्य प्रदेश","मुंबई","दिल्ली","भोपाल",];
        targetElement.innerHTML = "";
    
        categories.forEach(category => {
            const categoryItem = document.createElement("a");
            categoryItem.href = `category.html?category=${encodeURIComponent(category)}`;
            categoryItem.classList.add("category-item");
            categoryItem.textContent = category;
    
            categoryItem.addEventListener("click", function (event) {
                event.preventDefault();
                window.location.href = `category.html?category=${encodeURIComponent(category)}`;
            });
    
            targetElement.appendChild(categoryItem);
        });
    }
    
    

    // Fetch Breaking News Details
    async function fetchBreakingNewsDetails(newsId) {
        try {
            const response = await fetch(`${BASE_URL}/breakingnews/${newsId}`);
            const data = await response.json();
            if (!data) return;

            document.getElementById("breaking-news-details").innerHTML = `
                <h2>${data.breakingHeadline || "No Headline"}</h2>
                <img src="${data.imageUrl || 'Assets/default.jpg'}" alt="News Image">
                <p>${data.subheading || ""}</p>
                <a href="${data.breakingUrl}" target="_blank">Read Full Article</a>
            `;
        } catch (error) {
            console.error("Error fetching breaking news details:", error);
        }
    }

    // Add Click Event to News Titles
    function addClickEventToTitles() {
        document.querySelectorAll(".news-title").forEach(title => {
            title.addEventListener("click", function () {
                const newsUrl = this.getAttribute("data-url");
                if (newsUrl !== "#") window.open(newsUrl, "_blank");
            });
        });
    }

    // Initialize all sections
    await setupSlider();
    await fetchBreakingNews();
    await fetchCategories(categoriesContainer);  // Navbar
    await fetchCategories(sidebarCategories);    // Sidebar
    await fetchTopNews();
});

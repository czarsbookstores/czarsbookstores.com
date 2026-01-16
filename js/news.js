async function loadAndDisplayNews(jsonFilePath, containerId, firstArticle = 0, lastArticle = undefined) {
    try {
        const response = await fetch(jsonFilePath);
        const articles = await response.json();
        
        // Slice the articles based on firstArticle and lastArticle
        const slicedArticles = articles.slice(firstArticle, lastArticle);
        
        const container = document.getElementById(containerId);
        
        slicedArticles.forEach((article, index) => {
            // Calculate the original article index for the link
            const originalIndex = firstArticle + index;
            
            // Truncate text to 200 characters
            let truncatedText = article.text;
            if (truncatedText.length > 200) {
                truncatedText = truncatedText.substring(0, 200) + '...';
            }
            
            const articleHTML = `
                <section class="mt-5">
                    <div class="row align-items-center">
                        <div class="col-lg-8 col-md-12">
                            <h2>${article.heading}</h2>
                            <p class="text-muted">${article.date}</p>
                            <p>${truncatedText}</p>
                            <a href="displayarticle.html?article=${originalIndex}" class="btn btn-primary">Read More</a>
                        </div>
                        <div class="col-lg-4 col-md-12">
                            <img src="${article.image}" alt="${article.heading}" class="img-fluid rounded">
                        </div>
                    </div>
                </section>
            `;
            container.innerHTML += articleHTML;
        });
    } catch (error) {
        console.error('Error loading news:', error);
    }
}

async function displayFullArticle(jsonFilePath, containerId, articleIndex) {
    try {
        const response = await fetch(jsonFilePath);
        const articles = await response.json();
        
        if (articleIndex < 0 || articleIndex >= articles.length) {
            document.getElementById(containerId).innerHTML = '<p class="alert alert-danger">Article not found.</p>';
            return;
        }
        
        const article = articles[articleIndex];
        const container = document.getElementById(containerId);
        
        const articleHTML = `
            <section class="mt-5">
                <h1>${article.heading}</h1>
                <p class="text-muted fs-5">${article.date}</p>
                <img src="${article.image}" alt="${article.heading}" class="img-fluid rounded mb-4">
                <div class="fs-5 lh-lg">
                    ${article.text}
                </div>
                <div class="mt-5">
                    <a href="index.html" class="btn btn-primary">Back to Home</a>
                </div>
            </section>
        `;
        
        container.innerHTML = articleHTML;
    } catch (error) {
        console.error('Error loading article:', error);
        document.getElementById(containerId).innerHTML = '<p class="alert alert-danger">Error loading article.</p>';
    }
}
function truncateText(text, wordLimit) {
    const words = text.split(' ');
    if (words.length > wordLimit) {
        return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
}

async function loadAndDisplayBooks(jsonFilePath, containerId, firstBook = 0, lastBook = undefined) {
    try {
        const response = await fetch(jsonFilePath);
        const books = await response.json();
        
        // Slice the books based on firstBook and lastBook
        const slicedBooks = books.slice(firstBook, lastBook);
        
        const container = document.getElementById(containerId);
        
        slicedBooks.forEach((book, index) => {
            // Calculate the original book index for the link
            const originalIndex = firstBook + index;
            
            // Truncate description to 200 words
            const truncatedDescription = truncateText(book.description, 200);
            
            const bookHTML = `
                <section class="mt-5">
                    <div class="row align-items-center">
                        <div class="col-lg-8 col-md-12">
                            <h2>${book.title}</h2>
                            <p>${truncatedDescription}</p>
                            <a href="chapterpreview.html?book=${originalIndex}" class="btn btn-primary">Read Chapter Preview</a>
                        </div>
                        <div class="col-lg-4 col-md-12">
                            <img src="${book.image}" alt="${book.title}" class="img-fluid rounded">
                        </div>
                    </div>
                </section>
            `;
            container.innerHTML += bookHTML;
        });
    } catch (error) {
        console.error('Error loading books:', error);
    }
}

async function displayFullBook(jsonFilePath, containerId, bookIndex) {
    try {
        const response = await fetch(jsonFilePath);
        const books = await response.json();
        
        if (bookIndex < 0 || bookIndex >= books.length) {
            document.getElementById(containerId).innerHTML = '<p class="alert alert-danger">Book not found.</p>';
            return;
        }
        
        const book = books[bookIndex];
        const container = document.getElementById(containerId);
        
        // Format chapter preview with line breaks
        const formattedPreview = book.chapterPreview.replace(/\n/g, '<br>');
        
        const bookHTML = `
            <section class="mt-5">
                <h1>${book.title}</h1>
                <img src="${book.image}" alt="${book.title}" class="img-fluid rounded mb-4" style="max-width: 300px;">
                <div class="fs-5 lh-lg mb-4">
                    <p>${book.description}</p>
                </div>
                <hr>
                <h3 class="mt-4">Chapter Preview</h3>
                <div class="fs-5 lh-lg" style="white-space: pre-wrap;">
                    ${formattedPreview}
                </div>
                <div class="mt-5">
                    <a href="index.html" class="btn btn-primary">Back to Home</a>
                </div>
            </section>
        `;
        
        container.innerHTML = bookHTML;
    } catch (error) {
        console.error('Error loading book:', error);
        document.getElementById(containerId).innerHTML = '<p class="alert alert-danger">Error loading book.</p>';
    }
}

async function displayRecentBooks(jsonFilePath, containerId, count = 3) {
    try {
        const response = await fetch(jsonFilePath);
        const books = await response.json();
        
        // Get the most recent books (first 'count' books)
        const recentBooks = books.slice(0, count);
        
        const container = document.getElementById(containerId);
        
        let flexRow = '<div class="d-flex flex-wrap gap-3 justify-content-center">';
        
        recentBooks.forEach((book, index) => {
            // Truncate description to 50 words
            const truncatedDescription = truncateText(book.description, 50);
            
            flexRow += `
                <div class="card" style="flex: 1 1 calc(33.333% - 1rem); min-width: 250px; background-color: #e8e8e8;">
                    <img src="${book.image}" alt="${book.title}" class="card-img-top" style="max-width: 70%; margin: 0.5rem auto; display: block;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-text flex-grow-1">${truncatedDescription}</p>
                        <a href="chapterpreview.html?book=${index}" class="btn btn-primary btn-sm">Read Preview</a>
                    </div>
                </div>
            `;
        });
        
        flexRow += '</div>';
        
        container.innerHTML = flexRow;
    } catch (error) {
        console.error('Error loading recent books:', error);
        document.getElementById(containerId).innerHTML = '<p class="alert alert-danger">Error loading books.</p>';
    }
}

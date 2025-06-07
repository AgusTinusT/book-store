document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:8080/api/books';

    const bookForm = document.getElementById('bookForm');
    const bookIdInput = document.getElementById('bookId');
    const titleInput = document.getElementById('title');
    const authorInput = document.getElementById('author');
    const isbnInput = document.getElementById('isbn');
    const publisherInput = document.getElementById('publisher');
    const publicationYearInput = document.getElementById('publicationYear');
    const priceInput = document.getElementById('price');
    const stockInput = document.getElementById('stock');
    const submitBtn = document.getElementById('submitBtn');
    const cancelUpdateBtn = document.getElementById('cancelUpdateBtn');
    const bookTableBody = document.querySelector('#bookTable tbody');

    let isUpdateMode = false;

    
    async function fetchBooks() {
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const books = await response.json();
            displayBooks(books);
        } catch (error) {
            console.error('Error fetching books:', error);
            alert('Failed to load books. Please check server connection.');
        }
    }

    
    function displayBooks(books) {
        bookTableBody.innerHTML = ''; 
        books.forEach(book => {
            const row = bookTableBody.insertRow();
            row.dataset.bookId = book.id; 

            row.insertCell(0).textContent = book.id;
            row.insertCell(1).textContent = book.title;
            row.insertCell(2).textContent = book.author;
            row.insertCell(3).textContent = book.isbn || '-';
            row.insertCell(4).textContent = `Rp ${book.price.toLocaleString('id-ID')}`; 
            row.insertCell(5).textContent = book.stock;

            const actionsCell = row.insertCell(6);
            actionsCell.classList.add('action-buttons');

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.classList.add('edit-btn');
            editBtn.addEventListener('click', () => editBook(book.id));

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', () => deleteBook(book.id));

            actionsCell.appendChild(editBtn);
            actionsCell.appendChild(deleteBtn);
        });
    }

    
    bookForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        const bookData = {
            title: titleInput.value,
            author: authorInput.value,
            isbn: isbnInput.value,
            publisher: publisherInput.value,
            publicationYear: parseInt(publicationYearInput.value),
            price: parseFloat(priceInput.value),
            stock: parseInt(stockInput.value)
            
        };

        try {
            let response;
            if (isUpdateMode) {
                const bookId = bookIdInput.value;
                response = await fetch(`${API_BASE_URL}/${bookId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookData)
                });
            } else {
                response = await fetch(API_BASE_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookData)
                });
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Operation failed: ${response.status} - ${errorText}`);
            }

            
            bookForm.reset();
            isUpdateMode = false;
            submitBtn.textContent = 'Add Book';
            cancelUpdateBtn.style.display = 'none';
            fetchBooks();
            alert(`Book ${isUpdateMode ? 'updated' : 'added'} successfully!`);

        } catch (error) {
            console.error('Error saving book:', error);
            alert('Failed to save book: ' + error.message);
        }
    });

    
    async function editBook(bookId) {
        try {
            const response = await fetch(`${API_BASE_URL}/${bookId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const book = await response.json();

            bookIdInput.value = book.id;
            titleInput.value = book.title;
            authorInput.value = book.author;
            isbnInput.value = book.isbn || '';
            publisherInput.value = book.publisher || '';
            publicationYearInput.value = book.publicationYear || '';
            priceInput.value = book.price;
            stockInput.value = book.stock;

            isUpdateMode = true;
            submitBtn.textContent = 'Update Book';
            cancelUpdateBtn.style.display = 'inline-block'; 
            window.scrollTo({ top: 0, behavior: 'smooth' }); 
        } catch (error) {
            console.error('Error fetching book for edit:', error);
            alert('Failed to load book for editing.');
        }
    }

    
    async function deleteBook(bookId) {
        if (!confirm('Are you sure you want to delete this book?')) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/${bookId}`, {
                method: 'DELETE'
            });

            if (response.status === 204) { 
                alert('Book deleted successfully!');
                fetchBooks(); 
            } else if (response.status === 404) {
                alert('Book not found.');
            } else {
                const errorText = await response.text();
                throw new Error(`Delete failed: ${response.status} - ${errorText}`);
            }
        } catch (error) {
            console.error('Error deleting book:', error);
            alert('Failed to delete book: ' + error.message);
        }
    }

    
    cancelUpdateBtn.addEventListener('click', () => {
        bookForm.reset();
        isUpdateMode = false;
        submitBtn.textContent = 'Add Book';
        cancelUpdateBtn.style.display = 'none';
        bookIdInput.value = ''; 
    });


    
    fetchBooks();
});
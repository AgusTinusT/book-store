document.addEventListener('DOMContentLoaded', () => {
    const API_TRANSACTIONS_URL = 'http://localhost:8080/api/transactions';
    const API_MEMBERS_URL = 'http://localhost:8080/api/members';
    const API_BOOKS_URL = 'http://localhost:8080/api/books';

    
    const selectMember = document.getElementById('selectMember');
    const selectBook = document.getElementById('selectBook');

    
    const transactionForm = document.getElementById('transactionForm');
    const transactionTypeSelect = document.getElementById('transactionType');
    const quantityInput = document.getElementById('quantity');
    const dueDateLabel = document.getElementById('dueDateLabel');
    const dueDateInput = document.getElementById('dueDate');
    const submitTransactionBtn = document.getElementById('submitTransactionBtn');

    
    const returnForm = document.getElementById('returnForm');
    const returnTransactionIdInput = document.getElementById('returnTransactionId');
    const returnDateInput = document.getElementById('returnDate');
    const submitReturnBtn = document.getElementById('submitReturnBtn');

    
    const transactionTableBody = document.querySelector('#transactionTable tbody');
    const refreshTransactionsBtn = document.getElementById('refreshTransactionsBtn');

    let members = []; 
    let books = [];   

    
    async function initializePage() {
        await fetchMembers();
        await fetchBooks();
        await fetchTransactions(); 
    }

    
    async function fetchMembers() {
        try {
            const response = await fetch(API_MEMBERS_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            members = await response.json();
            populateSelect(selectMember, members, 'name');
        } catch (error) {
            console.error('Error fetching members:', error);
            alert('Failed to load members for selection.');
        }
    }

    async function fetchBooks() {
        try {
            const response = await fetch(API_BOOKS_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            books = await response.json();
            populateSelect(selectBook, books, 'title');
        } catch (error) {
            console.error('Error fetching books:', error);
            alert('Failed to load books for selection.');
        }
    }

    
    function populateSelect(selectElement, items, textProperty) {
        selectElement.innerHTML = `<option value="">-- Select a ${textProperty.includes('name') ? 'Member' : 'Book'} --</option>`; 
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item[textProperty];
            selectElement.appendChild(option);
        });
    }

    
    async function fetchTransactions() {
        try {
            
            const endDate = new Date();
            const startDate = new Date();
            startDate.setFullYear(endDate.getFullYear() - 1); 

            
            const formatDateTime = (date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');
                return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
            };

            const allTransactionsResponse = await fetch(API_TRANSACTIONS_URL); 

            if (!allTransactionsResponse.ok) {
                throw new Error(`HTTP error! status: ${allTransactionsResponse.status}`);
            }
            const transactions = await allTransactionsResponse.json();
            displayTransactions(transactions);

        } catch (error) {
            console.error('Error fetching transactions:', error);
            alert('Failed to load transactions. Please check server connection.');
        }
    }

    
    function displayTransactions(transactions) {
        transactionTableBody.innerHTML = '';
        transactions.forEach(transaction => {
            const row = transactionTableBody.insertRow();

            const memberName = members.find(m => m.id === transaction.member.id)?.name || 'N/A';
            const bookTitle = books.find(b => b.id === transaction.book.id)?.title || 'N/A';

            row.insertCell(0).textContent = transaction.id;
            row.insertCell(1).textContent = new Date(transaction.transactionDate).toLocaleString();
            row.insertCell(2).textContent = transaction.transactionType;
            row.insertCell(3).textContent = memberName;
            row.insertCell(4).textContent = bookTitle;
            row.insertCell(5).textContent = transaction.quantity;
            row.insertCell(6).textContent = transaction.totalAmount ? `Rp ${transaction.totalAmount.toLocaleString('id-ID')}` : '-';
            row.insertCell(7).textContent = transaction.dueDate ? new Date(transaction.dueDate).toLocaleDateString() : '-';
            row.insertCell(8).textContent = transaction.returnDate ? new Date(transaction.returnDate).toLocaleDateString() : '-';
            row.insertCell(9).textContent = transaction.status;
        });
    }

    

    
    transactionTypeSelect.addEventListener('change', () => {
        if (transactionTypeSelect.value === 'PEMINJAMAN') {
            dueDateLabel.style.display = 'block';
            dueDateInput.style.display = 'block';
            dueDateInput.setAttribute('required', 'required');
        } else {
            dueDateLabel.style.display = 'none';
            dueDateInput.style.display = 'none';
            dueDateInput.removeAttribute('required');
            dueDateInput.value = ''; 
        }
    });

    
    transactionForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const selectedMemberId = selectMember.value;
        const selectedBookId = selectBook.value;
        const transactionType = transactionTypeSelect.value;
        const quantity = parseInt(quantityInput.value);
        const dueDate = dueDateInput.value;

        if (!selectedMemberId || !selectedBookId || !transactionType || !quantity) {
            alert('Please fill all required fields (Member, Book, Type, Quantity).');
            return;
        }

        const payload = {
            memberId: selectedMemberId,
            bookId: selectedBookId,
            transactionType: transactionType,
            quantity: quantity,
            dueDate: dueDate 
        };

        try {
            const response = await fetch(`${API_TRANSACTIONS_URL}/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Transaction failed: ${response.status} - ${errorText}`);
            }

            const newTransaction = await response.json();
            alert(`Transaction successful! ID: ${newTransaction.id}`);
            transactionForm.reset();
            dueDateInput.style.display = 'none'; 
            dueDateLabel.style.display = 'none';
            await fetchTransactions(); 
            await fetchBooks(); 
        } catch (error) {
            console.error('Error performing transaction:', error);
            alert('Failed to perform transaction: ' + error.message);
        }
    });

    
    returnForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const transactionId = returnTransactionIdInput.value;
        const returnDate = returnDateInput.value;

        if (!transactionId || !returnDate) {
            alert('Please fill all required fields for return.');
            return;
        }

        const payload = {
            returnDate: returnDate
        };

        try {
            const response = await fetch(`${API_TRANSACTIONS_URL}/${transactionId}/return`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Return failed: ${response.status} - ${errorText}`);
            }

            const updatedTransaction = await response.json();
            alert(`Return processed successfully for Transaction ID: ${updatedTransaction.id}!`);
            returnForm.reset();
            await fetchTransactions(); 
            await fetchBooks(); 
        } catch (error) {
            console.error('Error processing return:', error);
            alert('Failed to process return: ' + error.message);
        }
    });

    refreshTransactionsBtn.addEventListener('click', fetchTransactions);

    
    initializePage();
});
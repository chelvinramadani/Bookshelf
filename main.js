document.addEventListener('DOMContentLoaded', function () {
    const bookForm = document.getElementById('bookForm');
    const incompleteBookList = document.getElementById('incompleteBookList');
    const completeBookList = document.getElementById('completeBookList');
    const searchBookForm = document.getElementById('searchBook');

    // Fungsi untuk membuat ID buku unik menggunakan timestamp
    function generateBookId() {
        return new Date().getTime();
    }

    // Fungsi untuk membuat elemen buku
    function createBookElement(book) {
        const bookElement = document.createElement('div');
        bookElement.classList.add('book-item');
        bookElement.setAttribute('data-bookid', book.id);
        bookElement.setAttribute('data-testid', 'bookItem');

        // Menambahkan judul, penulis, tahun
        bookElement.innerHTML = `
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      `;

        // Membuat tombol untuk memindahkan dan menghapus buku
        const buttonContainer = document.createElement('div');
        const isCompleteButton = document.createElement('button');
        const deleteButton = document.createElement('button');

        // Tambah button untuk memindahkan buku
        isCompleteButton.innerText = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
        isCompleteButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
        isCompleteButton.addEventListener('click', function () {
            toggleBookCompletion(book.id);
        });

        // Tambah button untuk menghapus buku
        deleteButton.innerText = 'Hapus Buku';
        deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
        deleteButton.addEventListener('click', function () {
            deleteBook(book.id);
        });

        buttonContainer.appendChild(isCompleteButton);
        buttonContainer.appendChild(deleteButton);
        bookElement.appendChild(buttonContainer);

        return bookElement;
    }

    // Fungsi untuk menambahkan buku ke localStorage
    function saveBookToStorage(book) {
        let books = JSON.parse(localStorage.getItem('books')) || [];
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    // Fungsi untuk mengubah kondisi buku (selesai/belum selesai dibaca)
    function toggleBookCompletion(bookId) {
        let books = JSON.parse(localStorage.getItem('books')) || [];
        books = books.map(book => {
            if (book.id === bookId) {
                book.isComplete = !book.isComplete;
            }
            return book;
        });
        localStorage.setItem('books', JSON.stringify(books));
        renderBooks();
    }

    // Fungsi untuk menghapus buku
    function deleteBook(bookId) {
        let books = JSON.parse(localStorage.getItem('books')) || [];
        books = books.filter(book => book.id !== bookId);
        localStorage.setItem('books', JSON.stringify(books));
        renderBooks();
    }

    // Fungsi untuk merender buku
    function renderBooks() {
        incompleteBookList.innerHTML = '';
        completeBookList.innerHTML = '';
        const books = JSON.parse(localStorage.getItem('books')) || [];

        books.forEach(book => {
            const bookElement = createBookElement(book);
            if (book.isComplete) {
                completeBookList.appendChild(bookElement);
            } else {
                incompleteBookList.appendChild(bookElement);
            }
        });
    }

    // Menangani form submit untuk menambah buku
    bookForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const title = document.getElementById('bookFormTitle').value;
        const author = document.getElementById('bookFormAuthor').value;
        const year = parseInt(document.getElementById('bookFormYear').value); // Pastikan year adalah number
        const isComplete = document.getElementById('bookFormIsComplete').checked;

        const newBook = {
            id: generateBookId(),
            title,
            author,
            year, // Tipe data number
            isComplete
        };

        saveBookToStorage(newBook);
        renderBooks();
        bookForm.reset(); // Reset form setelah submit
    });

    // Fungsi untuk mencari buku berdasarkan judul
    function searchBookByTitle(title) {
        const books = JSON.parse(localStorage.getItem('books')) || [];

        // Filter buku berdasarkan judul
        const filteredBooks = books.filter(book =>
            book.title.toLowerCase().includes(title.toLowerCase()) // Perbandingan case-insensitive
        );

        // Kosongkan rak buku yang sedang ditampilkan
        incompleteBookList.innerHTML = '';
        completeBookList.innerHTML = '';

        // Render buku yang sesuai dengan pencarian
        filteredBooks.forEach(book => {
            const bookElement = createBookElement(book);
            if (book.isComplete) {
                completeBookList.appendChild(bookElement);
            } else {
                incompleteBookList.appendChild(bookElement);
            }
        });

        // Jika tidak ada buku yang cocok dengan pencarian, tampilkan pesan
        if (filteredBooks.length === 0) {
            incompleteBookList.innerHTML = '<p>Tidak ada buku yang ditemukan</p>';
            completeBookList.innerHTML = '<p>Tidak ada buku yang ditemukan</p>';
        }
    }

    // Event listener untuk form pencarian
    searchBookForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const searchTitle = document.getElementById('searchBookTitle').value;
        searchBookByTitle(searchTitle); // Panggil fungsi pencarian
    });

    // Render buku saat halaman dimuat
    renderBooks();
});

const container = document.querySelector('.book-container')
const emptyEl = document.querySelector('.empty')
const errormsgEl = document.querySelector('.errormsg')
const searchInput = document.querySelector('.search-input')


// get the button and add a click event to get book data
document.querySelector('button').addEventListener('click', getFetch)
errormsgEl.textContent = ""
// get localStorage on pageload
let storedBooks = localStorage.getItem('books')
let booksArray = []

if (storedBooks) {
  try {
    booksArray = JSON.parse(storedBooks)
    renderBooks(booksArray)
  } catch (err) {
    console.log('Corrupted book data, clearing it:', err)
    localStorage.removeItem('books')
  }
}


//define getFetch function

function getFetch() {
  //getting isbn from user
  const isbn = document.querySelector('input').value.trim().replace(/-/g, '')

  //edge case -  isbn validation
  if (!isbn || (isbn.length !== 10 && isbn.length !== 13)) {
    errormsgEl.textContent = "Enter a valid isbn"
    return
  }

  if ((isbn.length === 13 && !/^\d+$/.test(isbn)) || (isbn.length === 10 && !/^\d{9}[\dx]$/i.test(isbn))) {
    errormsgEl.textContent = "Enter a valid isbn"
    return
  }

  //edge case - repeated button clicks
  const getButton = document.querySelector('button')
  getButton.disabled = true
  errormsgEl.textContent = "Searching..."
  const url = `https://openlibrary.org/isbn/${isbn}.json`

  fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error(`Nothing works${res.status}`)
      }
      return res.json()
    })

    .then(data => {
      //use local storage to store objects
      errormsgEl.textContent = ""
      let currentStorage = localStorage.getItem('books')

      if (currentStorage) {
        booksArray = JSON.parse(currentStorage)
      }

      if (booksArray.some(book => book.isbn === isbn)) {
        errormsgEl.textContent = "Books already listed"
      }
      else {
        booksArray.push({ title: data.title, isbn: isbn })
        localStorage.setItem('books', JSON.stringify(booksArray))
        renderBooks(booksArray)

      }
    })

    .catch(err => {
      errormsgEl.textContent = "Book not found"
    })
    .finally(() => {
      getButton.disabled = false
    })
}

//rendering books
function renderBooks(booksToRender) {
  // clear existing html element
  container.innerHTML = ""


  if (booksToRender.length === 0) {
    emptyEl.style.display = 'block'
  } else {
    emptyEl.style.display = 'none'

    booksToRender.forEach(book => {
      const card = document.createElement('div')
      card.classList.add('bookCard')

      const removeBtn = document.createElement('button')
      removeBtn.dataset.isbn = book.isbn
      removeBtn.classList.add('removeBtn')
      removeBtn.textContent = 'Remove'

      const titleEl = document.createElement('h2')
      titleEl.classList.add('title')
      titleEl.textContent = book.title

      const isbnEl = document.createElement("p")
      isbnEl.classList.add('isbn')
      isbnEl.textContent = book.isbn

      //removing a book card
      removeBtn.addEventListener('click', removeBookCard)

      function removeBookCard(event) {
        const btnIsbn = event.target.dataset.isbn
        booksArray = booksArray.filter(book => book.isbn !== btnIsbn)
        localStorage.setItem('books', JSON.stringify(booksArray))
        renderBooks(booksArray)

      }

      //appending child elements 
      card.appendChild(titleEl)
      card.appendChild(isbnEl)
      card.appendChild(removeBtn)
      container.appendChild(card)
    });

  }
}

//searching
searchInput.addEventListener('input', filterBook)
function filterBook() {
  const inputs = searchInput.value.trim().toLowerCase()
  const foundBook = booksArray.filter(book => book.title.toLowerCase().includes(inputs))
  renderBooks(foundBook)
}



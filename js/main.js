const container = document.querySelector('.book-container')
const emptyEl = document.querySelector('.empty')
const errormsgEl = document.querySelector('.errormsg')

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
  const isbn = document.querySelector('input').value.trim()

  //edge case - empty isbn
  if (!isbn) {
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
function renderBooks(booksArray) {
  // clear existing html element
  container.innerHTML = ""

  if (booksArray.length === 0) {
    emptyEl.style.display = 'block'
  } else {
    emptyEl.style.display = 'none'

    booksArray.forEach(book => {
      const card = document.createElement('div')
      card.classList.add('bookCard')

      const titleEl = document.createElement('h2')
      titleEl.classList.add('title')
      titleEl.textContent = book.title

      const isbnEl = document.createElement("p")
      isbnEl.classList.add('isbn')
      isbnEl.textContent = book.isbn

      card.appendChild(titleEl)
      card.appendChild(isbnEl)
      container.appendChild(card)
    });

  }
}
//code to handle states


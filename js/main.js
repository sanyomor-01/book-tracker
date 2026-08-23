// get the button and add a click event to get book data
document.querySelector('button').addEventListener('click', getFetch)



// get localStorage on pageload
let storedBooks = localStorage.getItem('books')

if (storedBooks) {
  try {
    let booksArray = JSON.parse(storedBooks)
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
    alert("Enter a valid isbn")
    return
  }
  //edge case - repeated button clicks
  const getButton = document.querySelector('button')
  getButton.disabled = true
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
      let booksArray = []
      let currentStorage = localStorage.getItem('books')

      if (currentStorage) {
        booksArray = JSON.parse(currentStorage)
      }

      booksArray.push({ title: data.title, isbn: isbn })
      localStorage.setItem('books', JSON.stringify(booksArray))
      renderBooks(booksArray)

    })

    .catch(err => {
      console.log(`Error${err}`)
    })
    .finally(() => { getButton.disabled = false })
}

//rendering books
function renderBooks(booksArray) {
  const container = document.querySelector('.book-container')
  // clear existing html element
  container.innerHTML = ""

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
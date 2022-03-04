const modal = document.getElementById('modal') /* .modal-container */
const modalSelf = document.getElementById('modal-self') /* .modal-container */
const modalShow = document.getElementById('show-modal') /* 'Add Bookmark' button */
const modalClose = document.getElementById('close-modal') /* close modal icon */
const bookmarkForm = document.getElementById('bookmark-form') /* form */
const websiteNameEl = document.getElementById('website-name') /* Input for Website Name */
const websiteUrlEl = document.getElementById('website-url') /* Input for Website URL */
const alert = document.getElementById('alert') /* Alert for Website URL */
const formSubmitButton = document.getElementById('form-submit-button') /* Form Submit Button for MarginTop */
const bookmarksContainer = document.getElementById('bookmarks-container') /* Bookmarks Container to put Bookmarks into this */
let modalMouseDown = 0;
let bookmarks = []

// Show Modal, Focus on Input
function showModal () {
  modal.classList.add('show-modal')
  modalSelf.classList.add('show-modal-self')
  websiteNameEl.focus()
}

// Hide Modal
function closeModal () {
  // Reset Form
  bookmarkForm.reset();
  alert.hidden = true;
  formSubmitButton.style.marginTop = "20px"
  // Hide Modal Container
  modal.classList.remove('show-modal')
  modal.classList.add('hide-modal')
  setTimeout(function () {
    modal.classList.remove('hide-modal')
  }, 700)
  // Hide Modal Self to Up
  modalSelf.classList.remove('show-modal-self')
  modalSelf.classList.add('hide-modal-self')
  setTimeout(function () {
    modalSelf.classList.remove('hide-modal-self')
  }, 700)
}

// Modal Mouse Down
function modalMouseDownFunction(e) {
  if (e.target.id === 'modal') {
    modalMouseDown++
  } else {
    modalMouseDown = 0
  }
}
// Modal Mouse Up
function modalMouseUpFunction(e) {
  if (e.target.id === 'modal') {
    if (modalMouseDown===1) {
      closeModal()
    }
  } else {
    modalMouseDown = 0
  }
}

// Modal Event Listeners
modalShow.addEventListener('click', showModal)
modalClose.addEventListener('click', closeModal)
window.addEventListener('mousedown', modalMouseDownFunction)
window.addEventListener('mouseup', modalMouseUpFunction)

// Validate Form
function validate (nameValue, urlValue) {
  const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g
  const regex = new RegExp(expression)
  if (!nameValue || !urlValue) {
    alert('Please submit values for both fields.')
    return false
  } else if (!urlValue.match(regex)) {
    alert('Please provide a valid web address')
    return false
  }
  // Valid
  return true
}

// Build Bookmarks DOM
function buildBookmarks() {
  // Remove all bookmark elements
  bookmarksContainer.innerHTML = '';
  // Build Items
  bookmarks.forEach((el) => {
    const {name, url} = el;
    // Item
    const item = document.createElement('div');
    item.classList.add('item')
    // Close Icon
    const closeIcon = document.createElement('i');
    closeIcon.classList.add('fas', 'fa-times');
    closeIcon.setAttribute('title', 'Delete Bookmark')
    closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`)
    // Favicon / Link Container
    const linkInfo = document.createElement('div');
    linkInfo.classList.add('name')
    // Favicon
    const favicon = document.createElement('img');
    favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`)
    favicon.setAttribute('alt', 'Favicon')
    const link = document.createElement('a')
    link.setAttribute('href', `${url}`)
    link.setAttribute('target', '_blank')
    link.textContent = name;
    // Appent to Bookmarks Container
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item)
  });
}

// Fetch Bookmarks
function fetchBookmarks() {
  // Get Bookmarks from localStorage if available
  if (localStorage.getItem('bookmarks')) {
    bookmarks = JSON.parse(localStorage.getItem('bookmarks'))
  } else {
    // Create bookmarks array in local storage
    bookmarks = [];
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
  }
  buildBookmarks()
  // SetTimeOut console.clear() for given errors for cannot taken favicons
  setTimeout(async function() {
    console.clear()
  }, 1000)
}

// Delete Bookmark
function deleteBookmark(url) {
  // Loop for each element
  bookmarks.forEach((e, i, array) => {
    if (e.url===url) {
      bookmarks.splice(i, 1)
    }
  })
  // Update Bookmarks Array in localStorage, re-populate DOM
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
  fetchBookmarks()
}

// Handle Data from Form
function storeBookmark (e) {
  e.preventDefault()
  const nameValue = websiteNameEl.value
  let urlValue = websiteUrlEl.value
  // Add https to the beginning of the URL
  if (!urlValue.includes('http://') && !urlValue.includes('https://')) {
    urlValue = `https://${urlValue}`
  }
  // Check if URL is not available and Check if string is not empty
  if (!validate(nameValue, urlValue)) {
    return false
  }
  let itHasThisLink = false
  bookmarks.forEach((e) => {
    if (e.url===urlValue) {
      itHasThisLink = true
    }
  })
  if (itHasThisLink) {
    formSubmitButton.style.marginTop="35px"
    alert.hidden = false
    return false
  }
  const bookmark = {
    name: nameValue,
    url: urlValue
  }
  bookmarks.push(bookmark)
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
  // Fetch Bookmarks
  fetchBookmarks()
  // Reset the form and Close Modal
  bookmarkForm.reset()
  closeModal()

}

// Typing URL
function typingUrl() {
  if (!alert.hidden) {
    alert.hidden = true;
    formSubmitButton.style.marginTop = "20px"
  }
}

// Event Listeners
bookmarkForm.addEventListener('submit', storeBookmark)
websiteUrlEl.addEventListener('input', typingUrl)

// On Load, Fetch Bookmarks
fetchBookmarks()

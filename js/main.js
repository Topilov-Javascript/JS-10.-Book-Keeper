const modal = document.getElementById('modal') /* .modal-container */
const modalSelf = document.getElementById('modal-self') /* .modal-container */
const modalShow = document.getElementById(
  'show-modal'
) /* 'Add Bookmark' button */
const modalClose = document.getElementById('close-modal') /* close modal icon */
const bookmarkForm = document.getElementById('bookmark-form') /* form */
const websiteNameEl = document.getElementById(
  'website-name'
) /* Input for Website Name */
const websiteUrlEl = document.getElementById(
  'website-url'
) /* Input for Website URL */
const bookmarksContainer = document.getElementById(
  'bookmarks-container'
) /* Bookmarks Container to put Bookmarks into this */

// Show Modal, Focus on Input
function showModal () {
  modal.classList.add('show-modal')
  modalSelf.classList.add('show-modal-self')
  websiteNameEl.focus()
}

// Hide Modal
function closeModal () {
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

// Close Modal On Click to Window
function closeModalByWindow (e) {
  if (e.target.id === 'modal') {
    closeModal()
  }
}

// Modal Event Listeners
modalShow.addEventListener('click', showModal)
modalClose.addEventListener('click', closeModal)
window.addEventListener('click', closeModalByWindow)

// Validate Form
function validate(nameValue, urlValue) {
  const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
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

// Handle Data from Form
function storeBookmark (e) {
  e.preventDefault()
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;
  // Add https to the beginning of the URL
  if (!urlValue.includes('http://') && !urlValue.includes('https://')) {
    urlValue = `https://${urlValue}`;
  }
  console.log(nameValue, urlValue)
  // Check if URL is not available and Check if string is not empty
  if (!validate(nameValue, urlValue)) {
    return false
  }
  bookmarkForm.reset()
}

// Event Listeners
bookmarkForm.addEventListener('submit', storeBookmark)

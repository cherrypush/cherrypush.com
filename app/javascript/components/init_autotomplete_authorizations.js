import autoComplete from '@tarekraafat/autocomplete.js'

document.addEventListener('turbo:load', () => {
  const inputEl = document.querySelector('#authorization-users-search')

  if (!inputEl) return

  const autoCompleteJS = new autoComplete({
    selector: () => inputEl,
    data: {
      src: JSON.parse(inputEl.getAttribute('data-src')),
    },
    resultItem: { highlight: true },
    resultsList: { maxResults: 12 },
    events: {
      input: {
        selection: (event) => (inputEl.value = event.detail.selection.value),
      },
    },
  })
})

import autoComplete from '@tarekraafat/autocomplete.js'

document.addEventListener(
  'DOMContentLoaded',
  () => {
    const inputEl = document.querySelector('#navbar-search')

    const autoCompleteJS = new autoComplete({
      selector: () => inputEl,
      threshold: 0, // required to automatically open on focus
      data: {
        src: JSON.parse(inputEl.getAttribute('data-src')),
        keys: ['text'],
        cache: true,
      },
      resultItem: { highlight: true },
      resultsList: { maxResults: 12 },
      events: {
        input: {
          selection: (event) => {
            window.location.href = event.detail.selection.value.href
          },
          focus: () => autoCompleteJS.start(),
        },
      },
    })
  },
  { once: true }
)

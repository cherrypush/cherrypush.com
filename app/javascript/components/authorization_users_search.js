import autoComplete from '@tarekraafat/autocomplete.js'

document.addEventListener(
  'DOMContentLoaded',
  () => {
    const inputEl = document.querySelector('#authorization-users-search')

    if (!inputEl) return

    const autoCompleteJS = new autoComplete({
      selector: () => inputEl,
      threshold: 0, // required to automatically open on focus
      data: {
        src: JSON.parse(inputEl.getAttribute('data-src')),
      },
      resultItem: { highlight: true },
      events: {
        input: {
          selection: (event) => (inputEl.value = event.detail.selection.value),
          focus: () => autoCompleteJS.start(),
        },
      },
    })
  },
  { once: true }
)

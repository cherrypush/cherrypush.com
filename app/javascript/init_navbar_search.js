import autoComplete from '@tarekraafat/autocomplete.js'

document.addEventListener(
  'DOMContentLoaded',
  () => {
    const inputEl = document.querySelector('#navbar-search')
    new autoComplete({
      selector: () => inputEl,
      placeHolder: 'Search for a metric...',
      data: {
        src: JSON.parse(inputEl.getAttribute('data-src')),
        keys: ['text'],
        cache: true,
      },
      resultItem: { highlight: true },
      events: {
        input: {
          selection: (event) => {
            window.location.href = event.detail.selection.value.href
          },
        },
      },
    })
  },
  { once: true }
)

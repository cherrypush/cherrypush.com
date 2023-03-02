import axios from 'axios'

class httpClient {}

httpClient.delete = (url) =>
  fetch(url, {
    method: 'DELETE',
    headers: {
      'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
      'Content-type': 'application/json; charset=UTF-8',
    },
  })

httpClient.post = (url, params) =>
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
      'Content-type': 'application/json; charset=UTF-8',
    },
  })

httpClient.put = (url, params) =>
  fetch(url, {
    method: 'PUT',
    body: JSON.stringify(params),
    headers: {
      'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
      'Content-type': 'application/json; charset=UTF-8',
    },
  })

httpClient.get = (url) => axios.get(url)

export default httpClient

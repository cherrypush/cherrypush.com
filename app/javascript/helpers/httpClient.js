import axios from 'axios'

class httpClient {}

httpClient.delete = (url, params) =>
  axios.delete(url, {
    data: params,
    headers: {
      'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
      'Content-type': 'application/json; charset=UTF-8',
    },
  })

httpClient.post = (url, params) =>
  axios.post(url, params, {
    headers: {
      'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
      'Content-type': 'application/json; charset=UTF-8',
    },
  })

httpClient.put = (url, params) =>
  axios.put(url, params, {
    headers: {
      'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
      'Content-type': 'application/json; charset=UTF-8',
    },
  })

httpClient.get = (url) => axios.get(url)

export default httpClient

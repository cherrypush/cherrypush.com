// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
// import '@hotwired/turbo-rails'
// import 'controllers'

import 'flowbite'
import 'chartkick'
import 'Chart.bundle'
import ApexCharts from 'apexcharts'

document.addEventListener(
  'DOMContentLoaded',
  () => {
    document.querySelectorAll('.charts').forEach((chartEl) => {
      const options = {
        chart: {
          background: 'none',
          type: 'line',
          height: 400,
          animations: { enabled: false },
          zoom: { enabled: false },
          toolbar: { show: false },
        },
        theme: { mode: 'dark', palette: 'palette2' },
        markers: { size: 1 },
        series: [
          { name: chartEl.getAttribute('data-serie-name'), data: JSON.parse(chartEl.getAttribute('data-serie')) },
        ],
        grid: { show: false },
        stroke: { curve: 'smooth' },
      }

      new ApexCharts(chartEl, options).render()
    })
  },
  { once: true }
)

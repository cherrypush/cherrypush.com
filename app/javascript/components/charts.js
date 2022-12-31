import ApexCharts from 'apexcharts'

document.addEventListener(
  'DOMContentLoaded',
  () => {
    document.querySelectorAll('[data-chart]').forEach((chartEl) => {
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

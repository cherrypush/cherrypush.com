import ApexCharts from 'apexcharts'

// For more customization options: https://apexcharts.com/docs/chart-types/area-chart/

document.addEventListener(
  'DOMContentLoaded',
  () => {
    document.querySelectorAll('[data-chart]').forEach((chartEl) => {
      const options = {
        chart: {
          background: 'none',
          type: 'area',
          height: 360,
          animations: { enabled: false },
          zoom: { enabled: false },
          toolbar: { show: false },
        },
        dataLabels: { enabled: false },
        theme: { mode: 'dark', palette: 'palette2' },
        series: [
          { name: chartEl.getAttribute('data-serie-name'), data: JSON.parse(chartEl.getAttribute('data-serie')) },
        ],
        grid: { show: false },
        yaxis: {
          min: 0,
          forceNiceScale: true,
          decimalsInFloat: 0,
          labels: {
            formatter: (value) => {
              return value.toFixed(0)
            },
          },
        },
      }

      new ApexCharts(chartEl, options).render()
    })
  },
  { once: true }
)

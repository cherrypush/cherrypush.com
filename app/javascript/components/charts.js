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
          height: 240,
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
        xaxis: { tickAmount: 6, labels: { show: JSON.parse(chartEl.getAttribute('data-show-label')) } },
        yaxis: {
          min: 0,
          forceNiceScale: true,
          labels: {
            show: JSON.parse(chartEl.getAttribute('data-show-label')),
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

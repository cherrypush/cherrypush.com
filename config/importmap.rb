# frozen_string_literal: true

# Pin npm packages by running ./bin/importmap

pin 'application', preload: true
pin 'flowbite', to: 'https://ga.jspm.io/npm:flowbite@1.5.4/dist/flowbite.js'
pin 'chartkick', to: 'chartkick.js'
pin 'Chart.bundle', to: 'Chart.bundle.js'
pin 'apexcharts', to: 'https://ga.jspm.io/npm:apexcharts@3.36.3/dist/apexcharts.common.js'
pin '@tarekraafat/autocomplete.js',
    to: 'https://ga.jspm.io/npm:@tarekraafat/autocomplete.js@10.2.7/dist/autoComplete.min.js'

pin_all_from 'app/javascript/components', under: 'components'

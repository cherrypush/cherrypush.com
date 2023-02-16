import React from 'react'
import { useQuery } from '@tanstack/react-query'

export const useMetricsShow = ({ metricId }) =>
  useQuery(['user', 'metrics', metricId], () => fetch(`/user/metrics/${metricId}`).then((response) => response.json()))

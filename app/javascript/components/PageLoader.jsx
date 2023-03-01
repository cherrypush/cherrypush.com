import React from 'react'
import ContentLoader from 'react-content-loader'

const PageLoader = ({ ...rest }) => (
  <div style={{ width: '100%' }}>
    <ContentLoader backgroundColor="#9BA3AF" foregroundColor="#1F2937" viewBox="0 0 400 200" {...rest}>
      <rect x="0" y="0" rx="4" ry="4" width="400" height="25" />
      <rect x="0" y="30" rx="4" ry="4" width="400" height="170" />
    </ContentLoader>
  </div>
)

export default PageLoader

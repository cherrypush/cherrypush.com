import { ReactNode, useEffect, useRef, useState } from 'react'

const SlideUp = ({ children }: { children: ReactNode }) => {
  const [isVisible, setVisible] = useState(false)
  const domRef = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isVisible) setVisible(true)
      })
    })
    domRef.current && observer.observe(domRef.current)
    return () => domRef.current && observer.unobserve(domRef.current)
  }, [])

  return (
    <div className={`fade-in-section ${isVisible ? 'is-visible' : ''}`} ref={domRef}>
      {children}
    </div>
  )
}

export const slideUp = (component: JSX.Element) => <SlideUp key={component.type.name}>{component}</SlideUp>

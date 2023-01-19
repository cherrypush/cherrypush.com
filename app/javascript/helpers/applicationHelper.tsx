import React from 'react'

export const numberToDiff = (number) => {
  const caret = number < 0 ? '▾' : number > 0 ? '▴' : null
  const colorClass = number < 0 ? 'text-green-300' : 'text-red-300'

  return (
    <span className={`${colorClass}`}>
      {caret} {Math.abs(number)}
    </span>
  )
}

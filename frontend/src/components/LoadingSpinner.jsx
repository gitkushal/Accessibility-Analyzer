import React from 'react'
import './LoadingSpinner.css'

const LoadingSpinner = ({message = 'Loading...'}) => {
  return (
    <div className='Loading-container'>
        <div className='spinner'></div>
        <p className='Loading-message'>{message}</p>
    </div>
  )
}

export default LoadingSpinner
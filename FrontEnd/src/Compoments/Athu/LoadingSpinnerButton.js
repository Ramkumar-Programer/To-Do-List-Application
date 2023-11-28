import React from 'react'
import '../../CSS/Athu/LoadingSpinnerButton.css';
import Spinner from '../../Assests/spinner.gif';

const LoadingSpinnerButton = ({title, loading, onClick, mame}) => {
  return (
    <button onClick={onClick} className={`${mame}${loading ? ' button':''}`}>
    {
      loading ? <img src={Spinner} alt='spinner' /> : title + ' '     
    }
    </button>
  )
}

export default LoadingSpinnerButton
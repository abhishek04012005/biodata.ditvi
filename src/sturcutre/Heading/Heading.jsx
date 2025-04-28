import React from 'react'
import './Heading.css'


const Heading = (props) => {
  return (
    <div className="heading">
        <div className="heading-text">
           <p>{props.title}</p>
        </div>
    </div>
  )
}
export default Heading
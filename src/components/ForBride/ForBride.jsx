import React from 'react'
import './ForBride.css'
import BiodataCards from '../../sturcutre/BiodataCards/BiodataCards'
import forBrideBiodata from '../../JSON/biodataContent';




const ForBride = () => {




    return (
        <>
            <BiodataCards title='For bride'
                biodataDetails={forBrideBiodata}
            />

        </>
    )
}

export default ForBride
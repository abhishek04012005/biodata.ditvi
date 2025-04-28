import React from 'react'
import './ForGroom.css'
import BiodataCards from '../../sturcutre/BiodataCards/BiodataCards';
import forGroomBiodata from '../../JSON/biodataContent';



const ForGroom = () => {



    return (
        <>

            <BiodataCards
                title='For Groom'
                biodataDetails={forGroomBiodata}
            />

        </>
    )
}

export default ForGroom
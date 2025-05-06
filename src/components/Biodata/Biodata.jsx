import React from 'react'
import './Biodata.css'
import BiodataCards from '../../sturcutre/BiodataCards/BiodataCards';
import biodataList from '../../JSON/biodataContent';



const Biodata = () => {



    return (
        <>
            <div id="biodata">
                <BiodataCards
                    title='Biodata'
                    biodataDetails={biodataList}
                />
            </div>
        </>
    )
}

export default Biodata
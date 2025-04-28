import React from 'react';
import AllBiodatas from '../../sturcutre/AllBiodata/AllBiodata';
import forGroomBiodata from '../../JSON/biodataContent';


const ForGroom = () => {

    
  return (
<>
<AllBiodatas biodataDetails={forGroomBiodata} title="FOr Groom"/>
</>
  )
};

export default ForGroom;
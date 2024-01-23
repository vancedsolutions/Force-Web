import React, { useState } from "react";


export const AlertDialog = (props) => {

    const confirmation=()=>{
        props.confirmation(props.id)
    }

    return(<>
            <div className="add_rate_popup cntnt_wrpr">
           <div className="alert-box">
           {props.message}
           </div> 
           <div className="footer">
           <button className="mla ttuc fs12 text mini" onClick={() => props.close()}>Cancel</button>
          <button className="mla ttuc fs12 primary mini" onClick={confirmation}> YES </button>
            </div>
           </div>
          


    </>)
}
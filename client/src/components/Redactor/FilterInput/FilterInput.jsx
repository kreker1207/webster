import React from "react";

function FilterInput({name, iconClass, value, ...props}) {
    return(
        <li>    
            <p className='pupi'>{name}</p>
            <div className="option">
            <div className='option-line'>
                <i className={'bi ' + iconClass}></i>
                <input type="range" min="0" className="slider" value={value} {...props}/>
                <p className="show_value">{value}</p>
                </div>
            </div>
        </li>
    )
}

export default FilterInput

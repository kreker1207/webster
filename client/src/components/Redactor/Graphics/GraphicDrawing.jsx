import React from "react";
import { useDispatch } from "react-redux";
import {addLayer} from '../../../utils/canvasSlice'

function GraphicDrawing({type, setter, ...props}) {
    const dispatch = useDispatch()
    return(
        <img
            {...props}
            onClick={(e)=> {
                const now = new Date();
                dispatch(addLayer({
                    type: type,
                    name: type + now.getHours() + ":"  + now.getMinutes() + ":" + now.getSeconds(),
                    color: '#d68e1c',
                    angles: 5,
    
                    width: 200,
                    height: 200,
                    baseWidth: 200,
                    baseHeight: 200
                }))
            }}
        />
    )
}

export default GraphicDrawing

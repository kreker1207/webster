import React from "react";
import { useDispatch } from "react-redux";
import {addLayer} from '../../../utils/canvasSlice'

function GraphicImg({source, graphicId, name, ...props}) {
    const dispatch = useDispatch() 
    return(
        <img
            src={source}
            crossOrigin="use-credentials"
            onClick={()=> {
                const graphicImg = new Image();
                const now = new Date();
                graphicImg.src = source;
                graphicImg.crossOrigin = "use-credentials"
                graphicImg.onload = () => {
                    dispatch(addLayer({
                        type: 'graphicImg',
                        name: name,
                        data: graphicImg,
                        id: graphicId,

                        width: Math.floor(graphicImg.width),
                        height: Math.floor(graphicImg.height)
                    }))
                }
            }}
        />
    )
}

export default GraphicImg

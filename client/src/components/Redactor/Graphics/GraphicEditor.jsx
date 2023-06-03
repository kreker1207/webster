import React from "react";
import { useDispatch } from "react-redux";
import {changeDrawing} from '../../../utils/canvasSlice'
import styled from 'styled-components'

function GraphicEditor({layer, ...props}) {
    const dispatch = useDispatch();
    const handleDrawAnglesChange = (angles) => {
        dispatch(changeDrawing({angles}))
    }

    const handleDrawColorChange = (color) => {
        dispatch(changeDrawing({color}))
    }

    return(
        <Container>
            {layer.type === 'polygon' || layer.type === 'star' ?
                <div className="settings">
                    <div className="graphic-info">
                        <h2>Angle Number</h2>
                    </div>
                    <input type="number" value={layer.angles} onChange={(e)=> {handleDrawAnglesChange(e.target.value)}}></input>
                </div>
                : 
                <div></div>
            }
            <div className="color">
                <div className="graphic-info">
                    <h2>Polygon Color</h2>
                </div>
                <input type="color" id="graphic-color" name="graphic-color" value={layer.color} onChange={(e)=> {handleDrawColorChange(e.target.value)}}/>
            </div>
            <div className="sizes">
                <div className="graphic-info">
                    <h2>Sizes</h2>
                </div>
                <div className="values">
                    <div>{Math.floor(layer.width)}</div>
                    <div> x </div>
                    <div>{Math.floor(layer.height)}</div>
                </div>
            </div>
        </Container>
    )
}

const Container = styled.div`
    grid-row-start: 1;
    grid-row-end: 5;
    grid-column-start: 1;
    grid-column-end: 5;
    .settings {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        input {
            border: none;
            height: 30px;
        }
    }
    .color {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    .sizes {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .values {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100px;
        }
    }
`

export default GraphicEditor
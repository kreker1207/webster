import React, {useEffect, useRef, useState } from 'react'
import './Canvas.scss'
import { useSelector, useDispatch } from 'react-redux'
import { setScale, updatePhotoPosition, resizeLayer, setObjectSizes, toggleChangeObjectsState, toogleEditLayerCoordinatesLogic, rotateLayer } from '../../../utils/canvasSlice'

const Canvas = ({canvasRef}) => {
    const dispatch = useDispatch() 
    const composition = useSelector((state) => state.canvas)
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [clickCoordinates, setClickCoordinates] = useState({ x: 0, y: 0 });

    // useEffect(() => {
    //     dispatch(createComposition())
    // }, [])

    useEffect(() => {
        if(composition.changeGlobalState) {
            drawCanvas()
        }
    }, [composition])

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const filters = composition.filters

        context.filter = `
        brightness(${filters.brightness}%)
        contrast(${filters.contrast}%)
        blur(${filters.blur}px)
        grayscale(${filters.greyScale}%)
        hue-rotate(${filters.hueRotate}deg)
        saturate(${filters.saturation})
        `;
        
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Create an off-screen canvas for drawing the grid
        const offScreenCanvas = document.createElement('canvas');
        const offScreenContext = offScreenCanvas.getContext('2d');
        offScreenCanvas.width = canvas.width;
        offScreenCanvas.height = canvas.height;


        composition.layers.forEach((layer, index) => {
            drawObject(canvas, context, layer, index)
        });

        if (composition.changeObjectsState && composition.layers.length !== 0) {
            drawGrid(offScreenCanvas, offScreenContext, 15, 'gray');
        }

        context.drawImage(offScreenCanvas, 0, 0)

        // Copy the content of the off-screen canvas to the visible canvas
        // context.drawImage(offScreenCanvas, 0, 0);
        // if (composition.changeObjectsState && composition.layers.length !== 0) {
        //     drawGrid(canvas, context, 15, 'gray');
        // }
    }

   
    const drawObject = (canvas, context, layer, index) => {
        console.log('draw Layer')
        if(layer.type === 'text') {
            const drawLines = (layer, text, xFinal, yFinal, fontSize, scaleFactor, context, maxWidth) => {

                if(layer.textAlign === 'right') {
                    if(layer.textUnderlined) {
                        let underlineWidth = context.measureText(text).width;
                        let underlineX = xFinal - underlineWidth;
                        let underlineY = yFinal + (fontSize * scaleFactor);
                        context.fillRect(underlineX, underlineY, underlineWidth, 2);
                    } 
                    if (layer.textCrossedOut) {
                        let underlineWidth = context.measureText(text).width;
                        let underlineX = xFinal - underlineWidth;
                        let underlineY = yFinal + (fontSize*scaleFactor)/2;
                        context.fillRect(underlineX, underlineY, underlineWidth, 2);
                    }
                } else if (layer.textAlign === 'center') {
                    if(layer.textUnderlined) {
                        let underlineWidth = context.measureText(text).width;
                        let underlineX = xFinal - underlineWidth/2;
                        let underlineY = yFinal + (fontSize * scaleFactor);
                        context.fillRect(underlineX, underlineY, underlineWidth, 2);
                    } 
                    if (layer.textCrossedOut) {
                        let underlineWidth = context.measureText(text).width;
                        let underlineX = xFinal - underlineWidth/2;
                        let underlineY = yFinal + (fontSize*scaleFactor)/2;
                        context.fillRect(underlineX, underlineY, underlineWidth, 2);
                    }
                } else {
                    if(layer.textUnderlined) {
                        let underlineWidth = context.measureText(text).width;
                        let underlineX = xFinal;
                        let underlineY = yFinal + (fontSize * scaleFactor);
                        context.fillRect(underlineX, underlineY, underlineWidth, 2);
                    } 
                    if (layer.textCrossedOut) {
                        let underlineWidth = context.measureText(text).width;
                        let underlineX = xFinal;
                        let underlineY = yFinal + (fontSize*scaleFactor)/2;
                        context.fillRect(underlineX, underlineY, underlineWidth, 2);
                    }
                }
            }

            let scaleFactor = composition.scale / 100
            const fontSize = layer.fontSize

            context.fillStyle = layer.fillStyle;
            context.textAlign = layer.textAlign;
            context.textBaseline = 'top'; // important!
            let font = ''
            if(layer.fontType.italic) {
                font+='italic'
            }
            if(layer.fontType.bold) {
                font+=' bold'
            }
            context.font = `${font} ${fontSize*scaleFactor}px ${layer.fontFamily}`;

            let words = layer.name.split(' ');
            let text = '';
            let lineHeight = 80 * scaleFactor

            let maxWidth = layer.maxWidth*scaleFactor + fontSize*scaleFactor

            const x = canvas.width/2 + layer.adjustedX * scaleFactor;
            const y = canvas.height/2  + layer.adjustedY * scaleFactor;

            let xFinal = x, yFinal = y
            for (let i = 0; i < words.length; i++) {
                let testLine = text + words[i] + ' ';
                let testWidth = context.measureText(testLine).width;

                if (testWidth > maxWidth) {
                    context.fillText(text, xFinal, yFinal);
                    drawLines(layer, text, xFinal, yFinal, fontSize, scaleFactor, context, maxWidth)

                    text = words[i] + ' ';
                    yFinal += lineHeight + (fontSize * scaleFactor)/2;
                } else {
                    text = testLine;
                }
            }

            context.fillText(text, xFinal, yFinal);
            drawLines(layer, text, xFinal, yFinal, fontSize, scaleFactor, context, maxWidth)
            

            if(layer.textAlign === 'right') {
                dispatch(setObjectSizes({
                    index: index,
                    x: Math.floor(x - maxWidth),
                    y: Math.floor(y),
                    visibleWidth: Math.floor(maxWidth),
                    visibleHeight: Math.floor((yFinal - y) + fontSize*scaleFactor)
                }))
            } else if(layer.textAlign === 'center') {
                dispatch(setObjectSizes({
                    index: index,
                    x: Math.floor(x - maxWidth/2),
                    y: Math.floor(y),
                    visibleWidth: Math.floor(maxWidth),
                    visibleHeight: Math.floor((yFinal - y) + fontSize*scaleFactor)
                }))
            } else {
                dispatch(setObjectSizes({
                    index: index,
                    x: Math.floor(x),
                    y: Math.floor(y),
                    visibleWidth: Math.floor(maxWidth),
                    visibleHeight: Math.floor((yFinal - y) + fontSize*scaleFactor)
                }))
            }

            if(index === composition.editLayer && composition.changeObjectsState) {
                if(layer.textAlign === 'right') {
                    const borderSize = 6;
                    context.strokeStyle = '#83c0ec';
                    context.lineWidth = 4;
                    context.strokeRect((x - borderSize / 2) - maxWidth, y - borderSize / 2, maxWidth + borderSize, (yFinal - y) + fontSize*scaleFactor + borderSize);
                } else if (layer.textAlign === 'center') {
                    const borderSize = 6;
                    context.strokeStyle = '#83c0ec';
                    context.lineWidth = 4;
                    context.strokeRect((x - borderSize / 2) - maxWidth/2, y - borderSize / 2, maxWidth + borderSize, (yFinal - y) + fontSize*scaleFactor + borderSize);
                } else {
                    const borderSize = 6;
                    context.strokeStyle = '#83c0ec';
                    context.lineWidth = 4;
                    context.strokeRect(x - borderSize / 2, y - borderSize / 2, maxWidth + borderSize, (yFinal - y) + fontSize*scaleFactor + borderSize);
                }
            } 
        } else {
            let scaleFactor = 1;
            if (layer.type === 'image') {
                scaleFactor = Math.max(canvas.width / layer.data.width, canvas.height / layer.data.height);
            } else {
                if(layer.name.includes('back')) {
                    scaleFactor = Math.max(canvas.width / layer.data.width, canvas.height / layer.data.height);
                } else {
                    scaleFactor = composition.scale  / 100
                }
            }
            
            const visibleWidth = layer.width * scaleFactor;
            const visibleHeight = layer.height * scaleFactor;
            
            // get the top left position of the image
            // in order to center the image within the canvas
            const x = (canvas.width / 2) - (visibleWidth / 2) + layer.adjustedX * (composition.scale / 100 )
            const y = (canvas.height / 2) - (visibleHeight / 2) + layer.adjustedY * (composition.scale / 100 )
            if(!layer.name.includes('back')) {
                dispatch(setObjectSizes({
                    index: index,
                    x: Math.floor(x),
                    y: Math.floor(y),
                    visibleWidth: Math.floor(visibleWidth),
                    visibleHeight: Math.floor(visibleHeight),
                }))
            }

            context.save();
            context.translate(x+visibleWidth/2, y+visibleHeight/2);
            context.rotate(layer.rotate*Math.PI/180.0);
            context.translate(-x-visibleWidth/2, -y-visibleHeight/2);

            if (layer.type === 'image' || layer.type==='graphicImg'){
                context.drawImage (
                    layer.data,
                    Math.floor(x), 
                    Math.floor(y), 
                    Math.floor(visibleWidth), 
                    Math.floor(visibleHeight) 
                );
            }
            else {
                drawFigure(context, layer.type, layer.color, x, y, visibleWidth, layer.angles)
            }

            if(index === composition.editLayer && composition.changeObjectsState) {
                const borderSize = 6;
                context.strokeStyle = '#83c0ec';
                context.lineWidth = 4;
                context.strokeRect(x - borderSize / 2 , y - borderSize / 2, visibleWidth + borderSize, visibleHeight + borderSize);
            }
            context.restore(); 
        }
    }

    const drawFigure = (context, type, color, x, y, width, gons = 4)=> {
        context.beginPath();
        //convert radians to degrees
        let rot = (Math.PI / 2) * 3;
        const step = Math.PI / gons;
        switch (type) {
            case 'star':
                const outerRadius = width / 2;
                const innerRadius = width / 4;
                x = x + width/2;
                y = y + width/2;
                
                context.moveTo(x, y - outerRadius);
                for (let i = 0; i < gons; i++) {
                    let ax = x + Math.cos(rot) * outerRadius;
                    let ay = y + Math.sin(rot) * outerRadius;
                    context.lineTo(ax, ay);
                    rot += step;

                    ax = x + Math.cos(rot) * innerRadius;
                    ay = y + Math.sin(rot) * innerRadius;
                    context.lineTo(ax, ay);
                    rot += step;
                }
                context.lineTo(x, y - outerRadius);
                break;
            case 'triangle90deg':
                context.moveTo(x, y);
                context.lineTo(x + width, y + width);
                context.lineTo(x, y + width);
                break;
            case 'polygon':
                width = width / 2;
                x = x + width;
                y = y + width;
                for(let i = 0; i < gons; i++) {
                    let ax = x + Math.cos(rot) * width
                    let ay = y + Math.sin(rot) * width
                    context.lineTo(ax, ay);
                    rot += 2 * step;
                }
                break;
            case 'square':
                width = width / 2;
                x = x + width;
                y = y + width;
                context.lineTo(x + width, y + width);
                context.lineTo(x + width, y - width);
                context.lineTo(x - width, y - width);
                context.lineTo(x - width, y + width);
                break;
            case 'circle':
                width = width / 2;
                context.arc(x+ width, y+ width, width, 0, 2 * Math.PI);
                break;
            default:
                break;
        }
        context.closePath();
        context.fillStyle = color;
        context.strokeStyle = color;
        context.fill();
        context.stroke();
    }

    const drawGrid = (canvas, context, gridSize, gridColor) => {
        const width = canvas.width;
        const height = canvas.height;
        
        const numCells = 30; // Desired number of cells in the grid
        const cellSize = Math.min(width, height) / numCells; // Calculate the cell size based on the smaller dimension
        
        context.strokeStyle = gridColor;
        context.lineWidth = 0.5;
        
        // Draw vertical grid lines
        for (let x = 0; x <= width; x += cellSize) {
          context.beginPath();
          context.moveTo(x, 0);
          context.lineTo(x, height);
          context.stroke();
        }
        
        // Draw horizontal grid lines
        for (let y = 0; y <= height; y += cellSize) {
          context.beginPath();
          context.moveTo(0, y);
          context.lineTo(width, y);
          context.stroke();
        }
      };

    //----------------------------Mouse Logic------------------------------------------//

    const handleMouseDown = (event) => {
        if(composition.changeObjectsState) {
            setIsMouseDown(true);
            const x = event.clientX || event.touches[0].clientX;
            const y = event.clientY || event.touches[0].clientY;
            setClickCoordinates({ x: x, y: y });

            //if(composition.layers[composition.editLayer]) return;
            if(!composition.layerButtonsLogic) {
                let activeLayer = -1

                for (let i = 0; i < composition.layers.length; i++) {
                    // Perform hit testing logic based on object boundaries or shape
                    if (x - canvasRef.current.getBoundingClientRect().left >= composition.layers[i].x && 
                        x - canvasRef.current.getBoundingClientRect().left <= composition.layers[i].x + composition.layers[i].visibleWidth && 
                        y - canvasRef.current.getBoundingClientRect().top >= composition.layers[i].y && 
                        y - canvasRef.current.getBoundingClientRect().top <= composition.layers[i].y + composition.layers[i].visibleHeight) 
                    {activeLayer = i}
                }
                dispatch(toogleEditLayerCoordinatesLogic(activeLayer))
            }
        }
    };
        
    const handleMouseMove = (e) => {
        if(isMouseDown && composition.changeObjectsState) {
            const newAdjustedX = e.clientX - clickCoordinates.x;
            const newAdjustedY = e.clientY - clickCoordinates.y;
            dispatch(updatePhotoPosition({
                newAdjustedX: newAdjustedX, 
                newAdjustedY: newAdjustedY
            }))
        }
    };
        
    const handleMouseUp = (e) => {
        if(composition.changeObjectsState) {
            dispatch(updatePhotoPosition({
                setLast: true
            }))
            setIsMouseDown(false);
        }
    };

    const handleMouseLeave = (e) => {
        if(composition.changeObjectsState) {
            dispatch(updatePhotoPosition({
                setLast: true
            }))
            setIsMouseDown(false);
        }
    };
    

    return (
        <div className='main'>
            <div className="canvas-container"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <canvas id='canvas'
                        ref={canvasRef} 
                        width={composition.width * (composition.scale/100)} 
                        height={composition.height * (composition.scale/100)}
                    >
                </canvas>
            </div>
            <div className='slider'>
                <input
                     type="range"
                     min={10}
                     max={200}
                     value={composition.scale}
                     onChange={(e)=> {
                        dispatch(setScale(e.target.value))
                    }}
                 />
                 <span style={{marginLeft: '10px'}}>C:{composition.scale}%</span>
            </div>
            <div onClick={() => dispatch(toggleChangeObjectsState())} className={`reposition ${composition.changeObjectsState}`}>
                <i className="bi bi-arrows-move"></i>
            </div>
            {composition.layers[composition.editLayer]&& 
            <div>
                <div className='slider layer-resize'><input
                    type="range"
                    min={5}
                    max={200}
                    value={composition.layers[composition.editLayer].resize}
                    onChange={(e)=> {dispatch(resizeLayer(e.target.value))}}
                />
                <span style={{marginLeft: '10px'}}>L:{composition.layers[composition.editLayer].resize}%</span></div>

                <div className='slider layer-rotate'><input
                    type="range"
                    min={-180}
                    max={180}
                    value={composition.layers[composition.editLayer].rotate}
                    onChange={(e)=> {dispatch(rotateLayer(e.target.value))}}
                />
                <span style={{marginLeft: '10px'}}>R:{composition.layers[composition.editLayer].rotate}%</span></div>
            </div>
            }
        </div>
    )
}

export default Canvas

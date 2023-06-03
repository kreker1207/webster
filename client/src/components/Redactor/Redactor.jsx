import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { addLayer, setComposition, filtersSet, layerDown, layerUp, setProjectName, setScale, toggleChangeObjectsState, toggleEditLayerButtonLogic, changeTextSettings, layerDelete } from '../../utils/canvasSlice';

import './Redactor.scss'

import Canvas from './Canvas/Canvas';
import FilterInput from './FilterInput/FilterInput';
import GraphicImg from './Graphics/GraphicImg';
import GraphicDrawing from './Graphics/GraphicDrawing';
import api from '../../utils/apiSetting';
import axios from 'axios';
import GraphicEditor from './Graphics/GraphicEditor';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchLogout } from '../../utils/authActions';

function Redactor() {
    const dispatch = useDispatch()
    const composition = useSelector((state) => state.canvas)
    const { userInfo } = useSelector(state => state.auth)
    const inputFileRef = useRef(null);
    const canvasRef = useRef(null);
    const navigate = useNavigate()
    const [isTitle, setTitle] = useState(false)
    const [modalSizes, setModalSizes] = useState('');
    const [modalSizesWidth, setModalSizesWidth] = useState('');
    const [modalSizesHeight, setModalSizesHeight] = useState('');
    const [activeWindow, setActiveWindow] = useState({img: 'active', eff: '', text: '', graphic: '', layers: ''});
    const params = useParams()

    useEffect(() => {
        if(params.id) {
            api.get(`/project/${params.id}`)
                .then((response) => {
                    // console.log(response.data)
                    let layers = response.data.layers.map((obj) => {
                        let nestedFieldKey = Object.keys(obj).find(function(key) {
                                return typeof obj[key] === 'object' && obj[key] !== null;
                        });

                        if (nestedFieldKey) {
                            let newLayer = { ...obj, ...obj[nestedFieldKey] }
                            newLayer[nestedFieldKey] = null
                            return newLayer
                        }
                        return obj;
                    });

                    response.data.layers = []

                    // console.log(response.data)
                   dispatch(setComposition(response.data))

                    let filteredLayers = layers.map(item => {
                        if(item.type === "text") {
                            return {...item, fontType: {italic: item.italic, bold: item.bold}}
                        } else {
                            return item
                        }
                    })
                    // console.log(filteredLayers)
                    // filteredLayers.sort((a, b) => a.index - b.index);
                    console.log(filteredLayers)

                    for (let index in filteredLayers) {
                        console.log(filteredLayers[index])
                        if(filteredLayers[index].type === 'image' || filteredLayers[index].type === 'graphicImg') {
                            const image = new Image();
                            image.crossOrigin = "use-credentials"
                            image.src = filteredLayers[index].type === 'image' ? 
                                `http://localhost:8080/images/${userInfo.login}/${response.data.project_name}/${filteredLayers[index].name}` :
                                (filteredLayers[index].name.includes('back') ? 
                                `http://localhost:8080/backgrounds/${filteredLayers[index].name}` :
                                `http://localhost:8080/svgs/${filteredLayers[index].name}`)
                            image.onload = async () => {
                                await dispatch(addLayer({...filteredLayers[index], data: image}))
                            }
                        } else {
                            dispatch(addLayer(filteredLayers[index]))
                        }
                    }
                }) 
                .catch(error => {
                    console.log(error)
                })
        } else {
            if(!composition.width || !composition.height) {
                navigate('/')
            }
        }

    }, [])

    //---------------------------------------Creation some layers logic---------------------------------------//

    const handleImageUpload = (event) => {
        const reader = new FileReader();
        const file = event.target.files[0]
        if(file) {
            reader.readAsDataURL(file);
            reader.onload = function (event) {
                const image = new Image();
                image.src = event.target.result;
                image.onload = () => {
                    dispatch(addLayer({
                        type: 'image',
                        name: file.name,
                        data: image,
                        file: file, 

                        width: image.width,
                        height: image.height
                    }))
                }
            }
        }
    }
    const handleTextCreate = () => {
        dispatch(addLayer({
            type: 'text',
            name: 'Lorem ipsum dolor sit amet',

            maxWidth: 500,

            fillStyle: '#ffffff',
            textAlign: 'left',
            fontSize: 72,
            fontFamily: 'Sans',
            fontType: {italic: true, bold: true},
            textUnderlined: true,
            textCrossedOut: false

        }))
    }
    //---------------------------------------Download Logic---------------------------------------//

    const handleSaveProject = () => {
        console.log(composition)
        api.post('/project', composition)
            .then(response => {
                alert('Success')
                const projectID = response.data.id
                for(const layer of composition.layers) {
                    
                    if(layer.type === 'image') {
                        let formData = new FormData();
                        formData.append('image', layer.file);
                        axios({
                            method: "post",
                            url: `http://localhost:8080/api/project/photo/${projectID}`,
                            data: formData,
                            headers: {'Access-Control-Allow-Origin': '*', "Content-Type": "multipart/form-data" },
                            credentials: 'include',   
                            withCredentials: true
                        }).then(response => {
                            console.log(response.data)
                        }).catch(error => {
                            console.log(error.message)
                        })
                        
                    }
                }
            })  
    
            .catch((error) => {
                console.log(error)
            })
    }

    const handleImageDownload = async() => {
        const awaiter = await dispatch(setScale(100))
        if(composition.changeObjectsState) {
            const awaiter2 = await dispatch(toggleChangeObjectsState())
        }
        const dataURL = canvasRef.current.toDataURL('websterImage/png');
        const link = document.createElement("a");

        link.href = dataURL;
        link.download = 'webster_image.png';
        link.click();
    }

    const filterSetter = (propName, propValue)=> {
        dispatch(filtersSet({propName, propValue}))
    }


    //---------------------------------------Layers Logic---------------------------------------//

    const handleLayerDown = () => {
        if (!composition.layers[composition.editLayer]) return;
        dispatch(layerDown())
    }

    const handleLayerUp = () => {
        if (!composition.layers[composition.editLayer]) return;
        dispatch(layerUp())
    }

    const handleLayerDelete = () => {
        if (!composition.layers[composition.editLayer]) return;
        dispatch(layerDelete())
    }

    //---------------------------------------Resizing Logic---------------------------------------//

    const handleSizeChange = () => {
        setModalSizes('active')
    }

    const handleSizeChangeApprove = () => {
        if(modalSizesWidth > 5000 || modalSizesWidth > 5000) {
            alert('Sizes should not be more than 5000px')
        } else if (modalSizesWidth < 50 || modalSizesWidth < 50) {
            alert('Sizes should not be less than 50px')
        } else {
            dispatch(setComposition({width: modalSizesWidth, height: modalSizesHeight}))
            setModalSizes('')
        }
    }

    //---------------------------------------TextSettings---------------------------------------//

    const handleLocationChange = (textAlign) => {
        dispatch(changeTextSettings({changeAlign: true, textAlign}))
    } 

    const handleFontSizeChange = (fontSize) => {
        dispatch(changeTextSettings({changeFontSize: true, fontSize}))
    }

    const handleFontTypeChange = (fontType) => {
        dispatch(changeTextSettings({changeFontType: true, fontType}))
    }

    const handleFontColorChange = (fontColor) => {
        dispatch(changeTextSettings({changeFontColor: true, fillStyle: fontColor}))
    }

    const handleFontFamilyChange = (fontFamily) => {
        dispatch(changeTextSettings({changeFontFamily: true, fontFamily}))
    }

    const handleTextContentChange = (textContent) => {
        dispatch(changeTextSettings({changeTextContent: true, textContent}))
    }

    //---------------------------------------Other---------------------------------------//

    const handleApplyButtonLogic = (index) => {
        if(index === -1) {
            dispatch(toggleChangeObjectsState(false))
        } else {
            dispatch(toggleChangeObjectsState(true))
        }
        dispatch(toggleEditLayerButtonLogic(index))
    }

    const handleLogout = () => {
        dispatch(fetchLogout())
        console.log('here')
    }

    return (
        <div className='upper-menu'>
            <div className={`sizeModalWindow ${modalSizes}`}>
                <div className="sizeModalWindow-contnet">
                    <div><span>Width: {composition.width}</span> <span>Height: {composition.height}</span></div>
                    <div><span>New width: </span> <input type="text" value={modalSizesWidth} onChange={e => {const value = e.target.value.replace(/\D/g, ''); setModalSizesWidth(value)}}/> </div>
                    <div><span>New height: </span> <input type="text" value={modalSizesHeight} onChange={e => {const value = e.target.value.replace(/\D/g, ''); setModalSizesHeight(value)}}/> </div>
                    <button onClick={handleSizeChangeApprove}>Change</button>
                </div>
            </div>
            <div className='up-menu'>
                <div className="menu menu-left">
                    <ul>
                        <li>
                            <div className="menu dropdown">
                                <button className="dropbtn">Menu 
                                    <i className="bi bi-caret-down-fill" style={{ marginLeft: '10px' }}></i>
                                </button>
                                <div className="dropdown-content">
                                    <a href="/"><i className="bi bi-card-image"></i> Create a Graphic</a>
                                    <a href="/account"><i className="bi bi-folder"></i> Saved Graphics</a>
                                </div>            
                            </div>
                        </li>
                        <li className='name'>
                            {
                                isTitle ? 
                                <div>
                                    <input id="title" type="text" 
                                        value={composition.project_name} 
                                        onMouseLeave={e => setTitle(!isTitle)}
                                        onChange={e => {
                                            dispatch(setProjectName(e.target.value))
                                        }}
                                    /> <i className="bi bi-pencil"></i> 
                                </div>
                                : 
                                <div>
                                    <input 
                                        id="title" 
                                        type="text" 
                                        value={composition.project_name} readOnly
                                    /><i onClick={e => {
                                        if(!params.id) {
                                            setTitle(!isTitle);
                                            document.getElementById('title').focus() 
                                        } else {
                                            alert("Edit mode")
                                        }
                                    }} className="bi bi-pencil"></i>
                                </div> 
                            }
                        </li>
                        <li>
                            <div className="project-size">
                                <span>{composition.width}px x {composition.height}px</span>
                                <button onClick={handleSizeChange} className="btn resize">Resize</button>
                            </div>
                        </li>
                        {/* <li>
                            <div className="dup-button">
                                <button className="btn duplicate">Duplicate</button>
                            </div>
                        </li> */}
                    
                    </ul>   
                </div>
                <div className="menu menu-right">
                    <ul>
                        <li>
                            <div className="menu dropdown">
                                <button className="dropbtn">Help 
                                <i className="bi bi-caret-down-fill"></i>
                                </button>
                                <div className="dropdown-content">
                                    <a href="#"><i className="bi bi-envelope-open"></i> Contact us</a>
                                    <a href="#"><i className="bi bi-camera-video"></i> Video tutorial</a>
                                </div>            
                            </div>
                        </li>
                        <li>
                            <div className="menu dropdown">
                                <button className="dropbtn">My accaunt 
                                    <i className="bi bi-caret-down-fill"></i>
                                </button>
                                <div className="dropdown-content">
                                    <a href="/account"><i className="bi bi-briefcase-fill"></i> Profile</a>
                                    <a onClick={handleLogout} href=""><i className="bi bi-box-arrow-left"></i> Log out</a>
                                </div>            
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            

            <div className="graphic-editor">
                <div className="tabble left-tab">
                    <div className="btn-group">
                        <button className={activeWindow.img} onClick={(e) => setActiveWindow({img: 'active', eff: '', text: '', graphic: '', layers: ''})} type="button" id="bkgrnd"><i className="bi bi-card-image"></i><br/>Image</button>
                        <button className={activeWindow.eff} onClick={(e) => setActiveWindow({img: '', eff: 'active', text: '', graphic: '', layers: ''})} type="button" id="effect"><i className="bi bi-magic"></i><br/>Effects</button>
                        <button className={activeWindow.text} onClick={(e) => setActiveWindow({img: '', eff: '', text: 'active', graphic: '', layers: ''})} type="button" id="btn-text"><i className="bi bi-file-earmark-font"></i><br/>Text</button>
                        <button className={activeWindow.graphic} onClick={(e) => setActiveWindow({img: '', eff: '', text: '', graphic: 'active', layers: ''})} type="button" id="graphic"><i className="bi bi-emoji-smile"></i><br/>Graphic</button>
                        <button className={activeWindow.layers} onClick={(e) => setActiveWindow({img: '', eff: '', text: '', graphic: '', layers: 'active'})} type="button" id="layers"><i className="bi bi-circle-square"></i><br/>Layers</button>
                        
                    </div>    
                    
                    <div className={`scroll-container ${activeWindow.img}`}>
                        <div className={`input-button ${activeWindow.img}`}>
                            <div className='upload-but'>
                                <button className='button-19' onClick={() => inputFileRef.current.click()}>Upload Photo</button>
                                <input ref={inputFileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleImageUpload}/>
                            </div>
                            <div className='choose-back'>
                                {/* <img src={require('../assets/back/back1.jpg')} alt="" />
                                <img src={require('../assets/back/back2.jpg')} alt="" />
                                <img src={require('../assets/back/back3.jpg')} alt="" />
                                <img src={require('../assets/back/back4.jpg')} alt="" />
                                <img src={require('../assets/back/back5.jpg')} alt="" />
                                <img src={require('../assets/back/back6.jpg')} alt="" />
                                <img src={require('../assets/back/back7.jpg')} alt="" />
                                <img src={require('../assets/back/back8.jpg')} alt="" />
                                <img src={require('../assets/back/back9.jpg')} alt="" />
                                <img src={require('../assets/back/back10.jpg')} alt="" /> */}
                                <GraphicImg graphicId='1' source={`http://localhost:8080/backgrounds/back1.jpg`} name="back1.jpg"/>
                                <GraphicImg graphicId='2' source={`http://localhost:8080/backgrounds/back2.jpg`} name="back2.jpg"/>
                                <GraphicImg graphicId='3' source={`http://localhost:8080/backgrounds/back3.jpg`} name="back3.jpg"/>
                                <GraphicImg graphicId='4' source={`http://localhost:8080/backgrounds/back4.jpg`} name="back4.jpg"/>
                                <GraphicImg graphicId='5' source={`http://localhost:8080/backgrounds/back5.jpg`} name="back5.jpg"/>
                                <GraphicImg graphicId='6' source={`http://localhost:8080/backgrounds/back6.jpg`} name="back6.jpg"/>
                                <GraphicImg graphicId='7' source={`http://localhost:8080/backgrounds/back7.jpg`} name="back7.jpg"/>
                                <GraphicImg graphicId='8' source={`http://localhost:8080/backgrounds/back8.jpg`} name="back8.jpg"/>
                                <GraphicImg graphicId='9' source={`http://localhost:8080/backgrounds/back9.jpg`} name="back9.jpg"/>
                                <GraphicImg graphicId='10' source={`http://localhost:8080/backgrounds/back10.jpg`} name="back10.jpg"/>
                            </div>
                        </div>
                        
                        
                        <div className={`effects-tab ${activeWindow.eff}`}>
                            <ul>
                                <FilterInput name="Brightness" iconClass="bi-brightness-high" max="200" id="brightness"
                                    value={composition.filters.brightness} onChange={(e)=> {filterSetter('brightness', e.target.value)}}/>
                                
                                <FilterInput name="Contrast" iconClass="bi-circle-half" max="200" id="contrast"
                                    value={composition.filters.contrast} onChange={(e)=> {filterSetter('contrast', e.target.value)}}/>

                                <FilterInput name="Blur" iconClass="bi-brush"  max="40" id="blur"
                                    value={composition.filters.blur} onChange={(e)=> {filterSetter('blur', e.target.value)}}/>

                                <FilterInput name="GreyScale" iconClass="bi-collection" max="100" id="greyScale"
                                    value={composition.filters.greyScale} onChange={(e)=> {filterSetter('greyScale', e.target.value)}}/>

                                <FilterInput name="Hue Rotate" iconClass="bi-paint-bucket" max="100" id="hueRotate"
                                    value={composition.filters.hueRotate} onChange={(e)=> {filterSetter('hueRotate', e.target.value)}}/>

                                <FilterInput name="Saturation" iconClass="bi-droplet-half" max="100" id="saturation"
                                    value={composition.filters.saturation} onChange={(e)=> {filterSetter('saturation', e.target.value)}}/>
                            </ul>
                        </div>
                        {
                            composition.editLayer!==-1 && composition.layers[composition.editLayer].type === 'text'  ? 
                            <div className={`text-tab ${activeWindow.text}`}>
                                <h2>Font</h2>
                                <select defaultValue={composition.layers[composition.editLayer].fontFamily} onChange={(e) => handleFontFamilyChange(e.target.value)}>
                                    <option value="Arial" id='op-arial'>Arial</option>
                                    <option value="Times" id='op-times'>Times New Roman</option>
                                    <option value="Helvetica" id='op-helvetica'>Helvetica</option>
                                    <option value="Verdana" id='op-verdana'>Verdana</option>
                                    <option value="Calibri" id='op-calibri'>Calibri</option>
                                    <option value="Georgia" id='op-georgia'>Georgia</option>
                                    <option value="Garamond" id='op-garamond'>Garamond</option>
                                    <option value="Futura"id='op-futura'>Futura</option>
                                    <option value="Roboto" id='op-roboto'>Roboto</option>
                                    <option value="Sans" id='op-sans'>Open Sans</option>
                                </select>
                                <div className='font-btt'>
                                    <div className='left-font'>
                                        <button onClick={(e) => handleFontTypeChange('bold')} className={`bold ${composition.layers[composition.editLayer].fontType.bold}`} > <i className="bi bi-type-bold"></i></button>
                                        <button onClick={(e) => handleFontTypeChange('italic')} className={`italic ${composition.layers[composition.editLayer].fontType.italic}`} ><i className="bi bi-type-italic"></i></button>
                                        <button onClick={(e) => handleFontTypeChange('underline')} className={`underline ${composition.layers[composition.editLayer].textUnderlined}`} ><i className="bi bi-type-underline"></i></button>
                                        <button onClick={(e) => handleFontTypeChange('crossedout')} className={`strikethrough ${composition.layers[composition.editLayer].textCrossedOut}`} ><i className="bi bi-type-strikethrough"></i></button>
                                    </div>
                                    <div className='right-font'>
                                        <input 
                                            value={composition.layers[composition.editLayer].fontSize} 
                                            onChange={(e) => handleFontSizeChange(e.target.value)} 
                                            type="number"
                                            min={1}
                                            max={250}
                                        >
                                        </input>
                                    </div>
                                </div>
                                <div className='font-btt'>
                                    <div className='left-font'>
                                        <button onClick={(e) => handleLocationChange('left')} className={`justify first-${composition.layers[composition.editLayer].textAlign}`}><i className="bi bi-justify-left"></i></button>
                                        <button onClick={(e) => handleLocationChange('center')} className={`justify second-${composition.layers[composition.editLayer].textAlign}`}><i className="bi bi-justify"></i></button>
                                        <button onClick={(e) => handleLocationChange('right')} className={`justify third-${composition.layers[composition.editLayer].textAlign}`}><i className="bi bi-justify-right"></i></button>
                                    </div>
                                    <div className='right-font colored' id="swatch">
                                        <input value={composition.layers[composition.editLayer].fillStyle} onChange={e => handleFontColorChange(e.target.value)} type="color" id="color" name="color" />
                                        <div className="info">
                                            <h2>Font Color</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-content">
                                    <textarea value={composition.layers[composition.editLayer].name} onChange = {(e) => {handleTextContentChange(e.target.value)}}> </textarea>
                                </div>
                            </div> 
                            :
                            <div className={`text-tab ${activeWindow.text}`}>
                                <div className='button'>
                                    <button onClick={handleTextCreate} className='button-19 orange'>Create text</button>
                                </div>
                            </div>
                        }
                        {
                            composition.editLayer!==-1 && 
                            (   composition.layers[composition.editLayer].type === 'star' || 
                                composition.layers[composition.editLayer].type === 'triangle90deg' ||
                                composition.layers[composition.editLayer].type === 'polygon' ||
                                composition.layers[composition.editLayer].type === 'circle' ||
                                composition.layers[composition.editLayer].type === 'square'
                            )? 
                            <div className={`graphic-tab ${activeWindow.graphic}`}>
                                <GraphicEditor layer={composition.layers[composition.editLayer]}/>
                            </div> 
                            : 
                            <div className={`graphic-tab ${activeWindow.graphic}`}>
                               
                                <GraphicImg graphicId='1' source={`http://localhost:8080/svgs/svg1.svg`} name="svg1.svg"/>
                                <GraphicImg graphicId='2' source={`http://localhost:8080/svgs/svg2.svg`} name="svg2.svg"/>
                                <GraphicImg graphicId='3' source={`http://localhost:8080/svgs/svg3.svg`} name="svg3.svg"/>
                                <GraphicImg graphicId='4' source={`http://localhost:8080/svgs/svg4.svg`} name="svg4.svg"/>
                                <GraphicImg graphicId='5' source={`http://localhost:8080/svgs/svg5.svg`} name="svg5.svg"/>
                                <GraphicImg graphicId='6' source={`http://localhost:8080/svgs/svg6.svg`} name="svg6.svg"/>
                                <GraphicImg graphicId='7' source={`http://localhost:8080/svgs/svg7.svg`} name="svg7.svg"/>
                                <GraphicImg graphicId='8' source={`http://localhost:8080/svgs/svg8.svg`} name="svg8.svg"/>
                                <GraphicImg graphicId='9' source={`http://localhost:8080/svgs/svg9.svg`} name="svg9.svg"/>
                                <GraphicImg graphicId='10' source={`http://localhost:8080/svgs/svg10.svg`} name="svg10.svg"/>
                                <GraphicImg graphicId='11' source={`http://localhost:8080/svgs/svg11.svg`} name="svg11.svg"/>
                                <GraphicImg graphicId='12' source={`http://localhost:8080/svgs/svg12.svg`} name="svg12.svg"/>

                                <GraphicDrawing type='star' src='https://d2qp0siotla746.cloudfront.net/shapes/star-outline.svg'/>
                                <GraphicDrawing type='triangle90deg' src='https://d2qp0siotla746.cloudfront.net/shapes/triangle-iso-outline.svg'/>
                                <GraphicDrawing type='polygon' src='https://d2qp0siotla746.cloudfront.net/shapes/pentagon-outline.svg'/>
                                <GraphicDrawing type='circle' src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0xMiAwYzYuNjIzIDAgMTIgNS4zNzcgMTIgMTJzLTUuMzc3IDEyLTEyIDEyLTEyLTUuMzc3LTEyLTEyIDUuMzc3LTEyIDEyLTEyem0wIDFjNi4wNzEgMCAxMSA0LjkyOSAxMSAxMXMtNC45MjkgMTEtMTEgMTEtMTEtNC45MjktMTEtMTEgNC45MjktMTEgMTEtMTF6Ii8+PC9zdmc+"/>
                                <GraphicDrawing type='square' src="data:image/svg+xml;base64,PHN2ZyBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjIiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtMjEgNGMwLS40NzgtLjM3OS0xLTEtMWgtMTZjLS42MiAwLTEgLjUxOS0xIDF2MTZjMCAuNjIxLjUyIDEgMSAxaDE2Yy40NzggMCAxLS4zNzkgMS0xem0tMTYuNS41aDE1djE1aC0xNXoiIGZpbGwtcnVsZT0ibm9uemVybyIvPjwvc3ZnPg=="/>
                            </div>
                        }
                        <div className={`layers-tab ${activeWindow.layers}`}>
                            <div className='layer-item' layervalue={-1}>
                                <button 
                                    className={`button-19 orange`}
                                    style={{width: '100%'}} 
                                    onClick={(e) => {handleApplyButtonLogic(-1)}}
                                >
                                    Save
                                </button>
                            </div>
                            {
                                composition.layers.map((layer, index) => {
                                    return(
                                        <div className='layer-item' key={index} layervalue={layer}>
                                            <div className='layer-name'>{layer.name.slice(0, 8).length === layer.name.length ? layer.name : layer.name.slice(0, 8) + '...'}</div>
                                            <svg xmlns="http://www.w3.org/2000/svg" style={{width: '35%'}} height="10">
                                                <path 
                                                    id="waveLine" d="M0 5 Q 50 0, 100 5 T 200 5 T 300 5 T 400 5" 
                                                    stroke={composition.editLayer === index && composition.layerButtonsLogic? 'red' : 'blue'} 
                                                    strokeWidth="2" 
                                                    fill="none" 
                                                />
                                            </svg>
                                            <button 
                                                className={`button-19 ${composition.editLayer === index && composition.layerButtonsLogic}`} 
                                                onClick={(e) => {handleApplyButtonLogic(index)}}
                                            >
                                                {composition.editLayer === index && composition.layerButtonsLogic ? 'Choosen' : 'Choose'}
                                            </button>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className='right-main'>
                    <div className="sub-menu">
                        <div className="btn-group2 left-group">
                            {/* <button type="button" id="bkgrnd"><i className="bi bi-arrow-counterclockwise"></i><br/>Undo</button>
                            <button type="button" id="bkgrnd"><i className="bi bi-arrow-clockwise"></i><br/>Redo</button>
                            <button type="button" id="bkgrnd"><i className="bi bi-files"></i><br/>Duplicate layer</button> */}
                            <button onClick={handleLayerDown} type="button" id="bkgrnd"><i className="bi bi-layer-backward"></i><br/>Layer-down</button>
                            <button onClick={handleLayerUp} type="button" id="bkgrnd"><i className="bi bi-layer-forward"></i><br/>Layer-up</button>
                            <button onClick={handleLayerDelete} type="button" id="bkgrnd"><i className="bi bi-trash"></i><br/>Delete</button>
                        </div>
                        <div className="btn-group2 right-group">
                            <button onClick={handleSaveProject} type="button" id="bkgrnd"><i className="bi bi-card-image"></i><br/>Save</button>
                            {/* <button type="button" id="bkgrnd"><i className="bi bi-share"></i><br/>Share</button> */}
                            <button type="button" id="bkgrnd" onClick={handleImageDownload}><i className="bi bi-cloud-arrow-down-fill"></i><br/>Download</button>
                        </div>
                    </div>
                    <Canvas canvasRef={canvasRef}/>
            </div>     
        </div>
    </div>)
}

export default Redactor

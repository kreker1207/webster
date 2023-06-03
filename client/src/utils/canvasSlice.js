import { createSlice } from "@reduxjs/toolkit";

const canvasSlice = createSlice({
    name: 'canvas',
    initialState: {
        changeGlobalState: false, //
        project_name: 'default_project',
        layers: [],
        editLayer: -1,
        layerButtonsLogic: false,
        filters:{ brightness: 100, blur: 0, greyScale: 0, hueRotate: 0, saturation: 1, contrast: 100},
        scale: 10,
        lastX: 0,
        lastY: 0,
        adjustedX: 0,
        adjustedY: 0,
        width: 0, //
        height: 0, //
        changeObjectsState: false
    },
    reducers: {
        setTemplateComposition: (state, action) => {
            state.width = action.payload.width
            state.height = action.payload.height
            state.project_name = action.payload.project_name
        },

        setComposition: (state, action) => {
            state.width = action.payload.width
            state.height = action.payload.height
            state.project_name = 'default_project' + new Date().getTime()
            if(action.payload.project_name) {
                state.project_name = action.payload.project_name
            }
            if(action.payload.filters) {
                state.filters = action.payload.filters
            }
            if(action.payload.layers) {
                state.layers = []
            }
            state.changeGlobalState = true
        },

        setProjectName: (state, action) => {
            state.project_name = action.payload
            state.changeGlobalState = false
        },

        addLayer: (state, action) => {
            // console.log(action.payload)
            if(action.payload.index) {
                state.layers.push(action.payload)
                let sortedLayers = [...state.layers]
                sortedLayers.sort((a, b) => a.index - b.index);
                state.layers = sortedLayers
            } else {
                let index = state.layers.length
                state.layers.push( {
                    x: 0,
                    y: 0,
                    visibleWidth: 0,
                    visibleHeight: 0,
    
                    lastX: 0,
                    lastY: 0,
                    adjustedX: 0,
                    adjustedY: 0,
                    rotate: 0,
                    resize: 100,
                    index: index,
                    ...action.payload
                })
            }

            state.changeGlobalState = true
        },

        layerDown: (state) => {
            const index  = state.editLayer;
            if (!state.layers[index] || !state.layers[index - 1]) return;

            const layer = state.layers[index];
            const layerBefore = state.layers[index - 1];

            state.layers[index] = layerBefore;
            state.layers[index - 1] = layer;
            state.editLayer = index - 1;
            state.layers[index - 1].index = index - 1
            state.layers[index].index = index
            state.changeGlobalState = true
        },

        layerUp: (state) => {
            const index  = state.editLayer;
            if (!state.layers[index] || !state.layers[index + 1]) return;
            
            const layer = state.layers[index];
            const layerAfter = state.layers[index + 1];

            state.layers[index] = layerAfter;
            state.layers[index + 1] = layer;
            state.editLayer = index + 1;
            state.layers[index + 1].index = index + 1
            state.layers[index].index = index
            state.changeGlobalState = true
        },

        layerDelete: (state) => {
            const index  = state.editLayer;
            if (state.editLayer === -1) return;

            const updatedLayers = [...state.layers];
            updatedLayers.splice(index, 1);

            return {
                ...state,
                layers: updatedLayers,
                changeGlobalState: true,
                editLayer: -1 
              };
        },

        setScale: (state, action) => {
            state.scale = action.payload
            state.changeGlobalState = true
        },

        toggleChangeObjectsState: (state, action) => {
            if(action.payload) {
                state.changeObjectsState = action.payload
            } else {
                state.changeObjectsState = !state.changeObjectsState
            }
            state.editLayer = -1
            state.changeGlobalState = true
            state.layerButtonsLogic = false
        },

        updatePhotoPosition: (state, action) => {
            const index  = state.editLayer;
            if (index === -1) {}
            else if (state.layers[index]){
                state.layers[index].lastX = action.payload.setLast ? state.layers[index].adjustedX : state.layers[index].lastX
                state.layers[index].lastY = action.payload.setLast ? state.layers[index].adjustedY : state.layers[index].lastY

                state.layers[index].adjustedX = action.payload.newAdjustedX ? state.layers[index].lastX + action.payload.newAdjustedX : state.layers[index].adjustedX
                state.layers[index].adjustedY = action.payload.newAdjustedY ? state.layers[index].lastY + action.payload.newAdjustedY : state.layers[index].adjustedY
            }
            state.changeGlobalState = true
        },

        setObjectSizes: (state, action) => {
            state.layers[action.payload.index].x = action.payload.x
            state.layers[action.payload.index].y = action.payload.y
            state.layers[action.payload.index].visibleWidth = action.payload.visibleWidth
            state.layers[action.payload.index].visibleHeight = action.payload.visibleHeight
            state.changeGlobalState = false
        },

        toggleEditLayerButtonLogic: (state, action) => {
            if(action.payload !== -1) {
                state.layerButtonsLogic = true
            } else {
                state.layerButtonsLogic = false
            }
            state.editLayer = action.payload;
            state.changeGlobalState = true

        },
        toogleEditLayerCoordinatesLogic: (state, action) => {
            state.editLayer = action.payload;
            state.changeGlobalState = true
        },

        resizeLayer: (state, action) => {
            const index  = state.editLayer;

            if(state.layers[index].type === 'image' || state.layers[index].type === 'graphicImg') {
                state.layers[index].width = Math.floor(state.layers[index].data.width * (action.payload / 100));
                state.layers[index].height = Math.floor(state.layers[index].data.height * (action.payload / 100));
                state.layers[index].resize = action.payload;
            } else if (state.layers[index].type === 'text') {
                state.layers[index].maxWidth = action.payload*5
            } else {
                state.layers[index].width = Math.floor(state.layers[index].baseWidth * (action.payload / 100));
                state.layers[index].height = Math.floor(state.layers[index].baseHeight * (action.payload / 100));
                state.layers[index].resize = action.payload;
            }
    
            state.changeGlobalState = true
        },

        filtersSet: (state, action) => {
            const {propName, propValue} = action.payload;
            state.filters[propName] = propValue;
            state.changeGlobalState = true
        },

        rotateLayer: (state, action) => {
            const index  = state.editLayer;
            state.layers[index].rotate = action.payload;
            state.changeGlobalState = true
        },

        changeTextSettings: (state, action) => {
            if(action.payload.changeAlign) {
                state.layers[state.editLayer].textAlign = action.payload.textAlign
            }
            if(action.payload.changeFontSize) {
                state.layers[state.editLayer].fontSize = action.payload.fontSize
            }
            if(action.payload.changeFontType) {
                if(action.payload.fontType === 'bold') {
                    state.layers[state.editLayer].fontType.bold = !state.layers[state.editLayer].fontType.bold
                }
                if(action.payload.fontType === 'italic') {
                    state.layers[state.editLayer].fontType.italic = !state.layers[state.editLayer].fontType.italic
                }
                if(action.payload.fontType === 'underline') {
                    if(state.layers[state.editLayer].textCrossedOut) {
                        state.layers[state.editLayer].textCrossedOut = false
                    }
                    if(state.layers[state.editLayer].textUnderlined) {
                        state.layers[state.editLayer].textUnderlined = false
                    } else {
                        state.layers[state.editLayer].textUnderlined = true
                    }
                }
                if(action.payload.fontType === 'crossedout') {
                    if(state.layers[state.editLayer].textUnderlined) {
                        state.layers[state.editLayer].textUnderlined = false
                    }

                    if(state.layers[state.editLayer].textCrossedOut) {
                        state.layers[state.editLayer].textCrossedOut = false
                    } else {
                        state.layers[state.editLayer].textCrossedOut = true
                    }
                }
            }
            if(action.payload.changeFontColor) {
                state.layers[state.editLayer].fillStyle = action.payload.fillStyle
            }
            if(action.payload.changeFontFamily) {
                state.layers[state.editLayer].fontFamily = action.payload.fontFamily
            }

            if(action.payload.changeTextContent) {
                state.layers[state.editLayer].name = action.payload.textContent
            }
            state.changeGlobalState = true
        },

        changeDrawing: (state, action) => {
            if(action.payload.color) {
                state.layers[state.editLayer].color = action.payload.color
            }
            if(action.payload.angles >= 0) {
                state.layers[state.editLayer].angles = action.payload.angles
            }
            state.changeGlobalState = true
        }
    }
})


export const {
    setTemplateComposition,
    setComposition,
    addLayer,
    layerDown,
    layerUp,
    setScale, 
    toggleChangeObjectsState, 
    updatePhotoPosition, 
    setObjectSizes,
    toggleEditLayerButtonLogic,
    toogleEditLayerCoordinatesLogic,
    resizeLayer,
    filtersSet,
    rotateLayer,
    setProjectName,
    changeTextSettings,
    changeDrawing,
    layerDelete
} = canvasSlice.actions
export const canvasReducer = canvasSlice.reducer
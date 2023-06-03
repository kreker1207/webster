import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLogout, fetchProfile } from '../../utils/authActions'
import './MainPage.scss'
import { useNavigate } from 'react-router-dom'
import { addLayer, setComposition, setTemplateComposition } from '../../utils/canvasSlice'

function MainPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { userInfo } = useSelector((state) => state.auth)
    const composition = useSelector((state) => state.canvas)
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)
    useEffect(() => {
        dispatch(fetchProfile())
    }, [dispatch])

    const handleRedactor =  () => {
        navigate(`/register`)
    }

    const handleCreateReadactor = async () => {
        if(width < 50 || height < 50) {
            alert('Sizes should not be less than 50px')
            return
        }
        if(width > 5000 || height > 5000) {
            alert('Sizes should not be less than 50px')
            return
        }
        await dispatch(setComposition({width: width, height: height}))
        navigate(`/redactor`)
    }

    const handleCreateReadactorDefaultSizes = async (type) => {
        if(type === 'instagram,') {
            await dispatch(setComposition({width: 1080, height: 1080}))
        } else if (type === 'story') {
            await dispatch(setComposition({width: 1080, height: 1920}))
        } else if (type === 'facebook') {
            await dispatch(setComposition({width: 1200, height: 900}))
        } else if (type === 'twitter') {
            await dispatch(setComposition({width: 1024, height: 512}))
        } else if (type === 'youtube') {
            await dispatch(setComposition({width: 1920, height: 1080}))
        } else {
            await dispatch(setComposition({width: 1200, height: 628}))
        }
        navigate(`/redactor`)
    }

    const handleTemplateCreate = async (template) =>  {
        if(template === 'template1') {

            await dispatch(setTemplateComposition({
                width: 1200,
                height: 628,
                project_name: 'template1'
            }))
            
            const image1 = new Image();
            image1.crossOrigin = "use-credentials"
            image1.src = `http://localhost:8080/backgrounds/back3.jpg`
            image1.onload = () => {
                dispatch(addLayer({
                    type: 'graphicImg',
                    name: 'back3.jpg',
                    data: image1,
                    id: 3,

                    index: 0,
                    width: Math.floor(image1.width),
                    height: Math.floor(image1.height)
                }))
            }

            const image2 = new Image();
            image2.crossOrigin = "use-credentials"
            image2.src = `http://localhost:8080/svgs/svg4.svg`
            image2.onload = () => {
                dispatch(addLayer({
                    x: 725,
                    y: 123,
                    visibleWidth: 79,
                    visibleHeight: 79,
    
                    lastX: 300,
                    lastY: -150,
                    adjustedX: 300,
                    adjustedY: -150,
                    
                    rotate: 0,
                    resize: 100,

                    type: 'graphicImg',
                    name: 'svg4.svg',
                    data: image2,
                    id: 4,
                    index: 1,

                    width: 150,
                    height: 150
                }))
            }

            dispatch(addLayer({
                type: 'text',
                name: 'Sad Piglet',

                x: 154,
                y: 86,
                visibleWidth: 187,
                visibleHeight: 38,

                lastX: -300,
                lastY: -200,
                adjustedX: -300,
                adjustedY: -200,
                
                rotate: 0,
                resize: 100,

                index: 2,
                maxWidth: 500,
    
                fillStyle: '#aa2c2c',
                textAlign: 'center',
                fontSize: 72,
                fontFamily: 'Sans',
                fontType: {italic: true, bold: true},
                textUnderlined: false,
                textCrossedOut: false
            }))

        } else if (template === 'template2') {
            await dispatch(setTemplateComposition({
                width: 1080,
                height: 1920,
                project_name: 'template2'
            }))
            
            const image1 = new Image();
            image1.crossOrigin = "use-credentials"
            image1.src = `http://localhost:8080/backgrounds/back4.jpg`
            image1.onload = () => {
                dispatch(addLayer({
                    type: 'graphicImg',
                    name: 'back4.jpg',
                    data: image1,
                    id: 3,

                    index: 0,
                    width: Math.floor(image1.width),
                    height: Math.floor(image1.height)
                }))
            }

            const image2 = new Image();
            image2.crossOrigin = "use-credentials"
            image2.src = `http://localhost:8080/svgs/svg12.svg`
            image2.onload = () => {
                dispatch(addLayer({
                    x: 82,
                    y: 420,
                    visibleWidth: 161,
                    visibleHeight: 161,
    
                    lastX: -2,
                    lastY: 659,
                    adjustedX: -2,
                    adjustedY: 659,
                    
                    rotate: 0,
                    resize: 95,

                    type: 'graphicImg',
                    name: 'svg12.svg',
                    data: image2,
                    id: 4,
                    index: 1,

                    width: 522,
                    height: 522
                }))
            }
            const image3 = new Image();
            image3.crossOrigin = "use-credentials"
            image3.src = `http://localhost:8080/svgs/svg5.svg`
            image3.onload = () => {
                dispatch(addLayer({
                    x: 120,
                    y: 183,
                    visibleWidth: 88,
                    visibleHeight: 88,
    
                    lastX: -6,
                    lastY: -224,
                    adjustedX: -4,
                    adjustedY: -224,
                    
                    rotate: 0,
                    resize: 52,

                    type: 'graphicImg',
                    name: 'svg5.svg',
                    data: image3,
                    id: 4,
                    index: 1,

                    width: 286,
                    height: 286
                }))
            }

            const image4 = new Image();
            image4.crossOrigin = "use-credentials"
            image4.src = `http://localhost:8080/svgs/svg9.svg`
            image4.onload = () => {
                dispatch(addLayer({
                    x: 87,
                    y: -5,
                    visibleWidth: 146,
                    visibleHeight: 146,
    
                    lastX: -20,
                    lastY: -738,
                    adjustedX: -20,
                    adjustedY: -738,
                    
                    rotate: 0,
                    resize: 86,

                    type: 'graphicImg',
                    name: 'svg9.svg',
                    data: image4,
                    id: 4,
                    index: 1,

                    width: 473,
                    height: 473
                }))
            }


        } else if (template === 'template3') {
            await dispatch(setTemplateComposition({
                width: 1200,
                height: 900,
                project_name: 'template3'
            }))
            
            const image1 = new Image();
            image1.crossOrigin = "use-credentials"
            image1.src = `http://localhost:8080/backgrounds/back8.jpg`
            image1.onload = () => {
                dispatch(addLayer({
                    type: 'graphicImg',
                    name: 'back8.jpg',
                    data: image1,
                    id: 3,

                    index: 0,
                    width: Math.floor(image1.width),
                    height: Math.floor(image1.height)
                }))
            }

            const image2 = new Image();
            image2.crossOrigin = "use-credentials"
            image2.src = `http://localhost:8080/svgs/svg10.svg`
            image2.onload = () => {
                dispatch(addLayer({
                    x: 228,
                    y: 151,
                    visibleWidth: 286,
                    visibleHeight: 286,
    
                    lastX: -1,
                    lastY: 25,
                    adjustedX: -1,
                    adjustedY: 25,
                    
                    rotate: 0,
                    resize: 84,

                    type: 'graphicImg',
                    name: 'svg10.svg',
                    data: image2,
                    id: 4,
                    index: 1,

                    width: 462,
                    height: 462
                }))
            }

            dispatch(addLayer({
                type: 'text',
                name: 'Oh! My heart',

                x: 208,
                y: 46,
                visibleWidth: 354,
                visibleHeight: 44,

                lastX: 22,
                lastY: -375,
                adjustedX: 22,
                adjustedY: -375,
                
                rotate: 0,
                resize: 100,

                index: 2,
                maxWidth: 500,
    
                fillStyle: '#252da7',
                textAlign: 'center',
                fontSize: 72,
                fontFamily: 'Sans',
                fontType: {italic: true, bold: true},
                textUnderlined: true,
                textCrossedOut: false
            }))


        } else if (template === 'template4') {
            await dispatch(setTemplateComposition({
                width: 1024,
                height: 512,
                project_name: 'template4'
            }))
            
            const image1 = new Image();
            image1.crossOrigin = "use-credentials"
            image1.src = `http://localhost:8080/backgrounds/back5.jpg`
            image1.onload = () => {
                dispatch(addLayer({
                    type: 'graphicImg',
                    name: 'back5.jpg',
                    data: image1,
                    id: 3,

                    index: 0,
                    width: Math.floor(image1.width),
                    height: Math.floor(image1.height)
                }))
            }

            
            dispatch(addLayer({
                type: 'text',
                name: 'Subscribe on my twitter',

                x: 402,
                y: 149,
                visibleWidth: 358,
                visibleHeight: 156,

                lastX: 190,
                lastY: -75,
                adjustedX: 190,
                adjustedY: -75,
                
                rotate: 0,
                resize: 100,

                index: 1,
                maxWidth: 360,
    
                fillStyle: '#000000',
                textAlign: 'center',
                fontSize: 72,
                fontFamily: 'Roboto',
                fontType: {italic: true, bold: true},
                textUnderlined: false,
                textCrossedOut: false
            }))


        } else {
            await dispatch(setTemplateComposition({
                width: 1200,
                height: 628,
                project_name: 'template5'
            }))
            
            const image1 = new Image();
            image1.crossOrigin = "use-credentials"
            image1.src = `http://localhost:8080/backgrounds/back6.jpg`
            image1.onload = () => {
                dispatch(addLayer({
                    type: 'graphicImg',
                    name: 'back6.jpg',
                    data: image1,
                    id: 3,

                    index: 0,
                    width: Math.floor(image1.width),
                    height: Math.floor(image1.height)
                }))
            }

            const image2 = new Image();
            image2.crossOrigin = "use-credentials"
            image2.src = `http://localhost:8080/svgs/svg12.svg`
            image2.onload = () => {
                dispatch(addLayer({
                    x: 138,
                    y: 116,
                    visibleWidth: 94,
                    visibleHeight: 94,
    
                    lastX: -305,
                    lastY: -53,
                    adjustedX: -305,
                    adjustedY: -53,
                    
                    rotate: 0,
                    resize: 100,

                    type: 'graphicImg',
                    name: 'svg12.svg',
                    data: image2,
                    id: 4,
                    index: 1,

                    width: 150,
                    height: 150
                }))
            }

            const image3 = new Image();
            image3.crossOrigin = "use-credentials"
            image3.src = `http://localhost:8080/svgs/svg7.svg`
            image3.onload = () => {
                dispatch(addLayer({
                    x: 217,
                    y: 192,
                    visibleWidth: 103,
                    visibleHeight: 103,
    
                    lastX: -173,
                    lastY: 75,
                    adjustedX: -173,
                    adjustedY: 75,
                    
                    rotate: 0,
                    resize: 30,

                    type: 'graphicImg',
                    name: 'svg7.svg',
                    data: image3,
                    id: 4,
                    index: 1,

                    width: 165,
                    height: 165
                }))
            }
            const image4 = new Image();
            image4.crossOrigin = "use-credentials"
            image4.src = `http://localhost:8080/svgs/svg8.svg`
            image4.onload = () => {
                dispatch(addLayer({
                    x: 218,
                    y: 251,
                    visibleWidth: 41,
                    visibleHeight: 41,
    
                    lastX: -220,
                    lastY: 119,
                    adjustedX: -220,
                    adjustedY: 119,
                    
                    rotate: 108,
                    resize: 12,

                    type: 'graphicImg',
                    name: 'svg8.svg',
                    data: image4,
                    id: 4,
                    index: 1,

                    width: 66,
                    height: 66
                }))
            }
            dispatch(addLayer({
                type: 'text',
                name: 'My dreams at night',

                x: 272,
                y: 148,
                visibleWidth: 420,
                visibleHeight: 45,

                lastX: 166,
                lastY: -78,
                adjustedX: 166,
                adjustedY: -78,
                
                rotate: 0,
                resize: 100,

                index: 2,
                maxWidth: 595,
    
                fillStyle: '#d21414',
                textAlign: 'center',
                fontSize: 72,
                fontFamily: 'Sans',
                fontType: {italic: true, bold: true},
                textUnderlined: false,
                textCrossedOut: true
            }))


        }

        navigate('/redactor')
    }

    const handleProfileClick = () => {
        navigate(`/account`)
    }

    const handleLogout = () => {
        dispatch(fetchLogout())
        console.log('here')
    }

    return (
        <div className="body">
            {
                Object.keys(userInfo).length !== 0 ? 
                <div>
                <div className='nav'>
                    <div className="logo left in" onClick={() => navigate(`/`)}>
                        <a href='/'style={{ fontSize: '18px' }}>Create a Graphic</a>
                        <a href='/account'style={{ fontSize: '18px' }}>Saved Graphic</a>
                    </div>
                    <div className="menu right suchechka">
                        <div className="menu dropdown loged">
                            <button className="dropbtn" style={{ fontSize: '18px' }}>Help <i className="bi bi-caret-down-fill"></i></button>
                                <div className="dropdown-content">
                                    <button   className='drp-btn'><i className="bi bi-envelope-open"></i> Contact us</button>
                                    <button   className='drp-btn'><i className="bi bi-camera-video"></i> Video tutorial</button>
                                </div>            

                    </div>
                    <div className="menu dropdown loged2">
                        <button className="dropbtn" style={{ fontSize: '16px' }}>My account <i className="bi bi-caret-down-fill"></i></button>
                        <div className="dropdown-content">
                            <button onClick={handleProfileClick} className='drp-btn'><i className="bi bi-briefcase-fill"></i> Profile</button>
                            <button className='drp-btn'><i className="bi bi-share"></i> Share profile</button>
                            <button onClick={handleLogout} className='drp-btn'><i className="bi bi-box-arrow-left"></i> Log out</button>
                        </div>            
                            </div>
                </div> 
                </div>
                </div> 
                : 
                <div className="nav">
                    <div className="logo left" onClick={() => navigate(`/`)}>
                        <img alt='' src={require('../assets/logo.png')}/>
                    </div>
                    <div className="menu right  out">
                        <a href="/login">Log in</a>
                        <button onClick={handleRedactor} className="button-19">Get Started</button>
                    </div>
                </div>
            }
            {
                Object.keys(userInfo).length !== 0 ? 
                 ///////////////////////////
                 <div className='main-page-login'>
                    <div className='line-orange'>
                        <h1 style={{ fontSize: '26px' }}>Please choose a preset size <br/>or input your desired custom dimensions for the graphic.</h1>
                    </div>
                <div className='page-login'>
                    <h1>GRAPHIC SIZE</h1>
                    <div className='size-input-group'>
                        <input value={width} onChange={e => setWidth(e.target.value)} type={"text"} maxLength={"4"} placeholder="width (px)" className='size-input'></input>
                        <input value={height} onChange={e => setHeight(e.target.value)} type={"text"} maxLength={"4"} placeholder="height (px)" className='size-input'></input>
                        <button onClick={handleCreateReadactor} className='button-19'>Create</button>
                    </div>
                    <div className='bururi'>
                        <h1>MEDIA TYPE SIZES</h1>
                        <div className='size-type'>
                            <div onClick={e => handleCreateReadactorDefaultSizes('instagramm')} className='type-wrapper'>
                                <div className='image-wrapper'>
                                    <img src={require('../assets/Instagrampost.png')} width="180px" height="130px" alt="" />
                                </div>
                                <h2>Instagram Post</h2>
                                <p>1080px x 1080px</p>
                            </div>
                            <div onClick={e => handleCreateReadactorDefaultSizes('story')} className='type-wrapper'>
                                <div className='image-wrapper'>
                                    <img src={require('../assets/InstagramStories.png')} width="180px" height="130px" alt="" />
                                </div>
                                <h2>Instagram Story</h2>
                                <p>1080px x 1920px</p>
                            </div>
                            <div onClick={e => handleCreateReadactorDefaultSizes('facebook')} className='type-wrapper'>
                                <div className='image-wrapper'>
                                    <img src={require('../assets/fBpost.png')} width="180px" height="130px" alt="" />
                                </div>
                                <h2>Facebook Post</h2>
                                <p>1200px x 900px</p>
                            </div>
                            <div onClick={e => handleCreateReadactorDefaultSizes('twitter')} className='type-wrapper'>
                                <div className='image-wrapper'>
                                    <img src={require('../assets/TWpost.png')} width="180px" height="130px" alt="" />
                                </div>
                                <h2>Twitter Post</h2>
                                <p>1024px x 512px</p>
                            </div>
                            <div onClick={e => handleCreateReadactorDefaultSizes('youtube')} className='type-wrapper'>
                                <div className='image-wrapper'>
                                    <img src={require('../assets/youtube.png')} width="180px" height="130px" alt="" />
                                </div>
                                <h2>YouTube End Screen</h2>
                                <p>1920px x 1080px</p>
                            </div>
                            <div onClick={e => handleCreateReadactorDefaultSizes('linkedin')} className='type-wrapper'>
                                <div className='image-wrapper'>
                                    <img src={require('../assets/linkedin.png')} width="180px" height="130px" alt="" />
                                </div>
                                <h2>LinkedIn Post</h2>
                                <p>1200 x 628px</p>
                            </div>
                        </div>
                    </div>
                    <div className='bururi'>
                        <h1>PRESETS</h1>
                        <div className='size-type'>
                            <div onClick={e => handleTemplateCreate('template1')} className='type-wrapper'>
                                <div className='image-wrapper'>
                                    <img src={require('../assets/sadPiglet.png')} width="180px" height="130px" alt="" />
                                </div>
                                <h2>Bebra time</h2>
                                <p>1920px x 1080px</p>
                            </div>
                            <div onClick={e => handleTemplateCreate('template2')} className='type-wrapper'>
                                <div className='image-wrapper'>
                                    <img src={require('../assets/chickIsland.png')} width="180px" height="130px" alt="" />
                                </div>
                                <h2>Instagram Bebra Story</h2>
                                <p>1080px x 1920px</p>
                            </div>
                            <div onClick={e =>handleTemplateCreate('template3')} className='type-wrapper'>
                                <div className='image-wrapper'>
                                    <img src={require('../assets/heart.png')} width="180px" height="130px" alt="" />
                                </div>
                                <h2>Facebook bimbam</h2>
                                <p>1200px x 900px</p>
                            </div>
                            <div onClick={e =>handleTemplateCreate('template4')} className='type-wrapper'>
                                <div className='image-wrapper'>
                                    <img src={require('../assets/twitterSub.png')} width="180px" height="130px" alt="" />
                                </div>
                                <h2>Twitter funnyPost</h2>
                                <p>1024px x 512px</p>
                            </div>
                            <div onClick={e => handleTemplateCreate('template5')} className='type-wrapper'>
                                <div className='image-wrapper'>
                                    <img src={require('../assets/dreams.png')} width="180px" height="130px" alt="" />
                                </div>
                                <h2>LinkedIn Work find</h2>
                                <p>1200 x 628px</p>
                            </div>
                        </div>
                    </div>
                </div>
                </div> 
             //////////////////////////////
                :
                <div className="page main-content">
                    <div className="intro">
                        
                        <h1>Edit graphics online in webster</h1>
                        <p>Create visual designs for social media, advertisements, blogs, and other content, even if you don't have graphic design skills.</p>
                        <button className="button-19">Get Started</button>
                    </div>
                    <div className="intro-right">
                        <img style={{borderRadius: '10px'}} alt='' src={require('../assets/introeditor.png')} width="400px" height="220px"/>
                    </div>
                    <div className="curved">
                        <h1>The perfect image dimensions</h1>
                        <p>The perfect sized image is always one click away. Image dimensions for social media, display ads, blogs, emails, and infographics are available as clickable presets.</p>      
                        <img style={{borderRadius: '10px'}} alt='' src={require('../assets/social.png')}/>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                            <path fill="#ff5500" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                        </svg>
                    </div>
                    <div className="curve-head">
                        <h1>Get a head start with pre-made templates</h1>
                        <p>
We've made it easier for you to choose with our collection of pre-made templates that are designed to look professional and help you attract more attention, clicks, and customers. Say goodbye to starting from scratch or staring at a blank screen ever again!</p>
                        <img style={{borderRadius: '10px'}} alt='' src={require('../assets/preset.png')}/>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                            <path fill="#333" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                        </svg>
                    </div>
                    <div className="eazy">
                        <h1>Create whatever you've imagined in seconds</h1>
                        <p>
                        We've prepared some additional elements for you, including a selection of shapes and emijies, and the ability to play with photo effects. Now, you can easily create the perfect graphic without needing any design experience. Plus, we've even included a variety of emojis for you to use. 
                        </p>
                    </div>
                    <div className="eazy-photo">
                        <img style={{borderRadius: '10px'}} alt='' src={require('../assets/graphics.png')} width="400px" height="220px"/>
                    </div>
                </div>
            }
        </div>        
    )
}

export default MainPage

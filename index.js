let airStripMarkAnimationDuration = 600;
let hadFlew = false;
let flying = false;

let animatedPlaneContainer;

let plane;
let planeContainer;
let planeShadow;
let planeShadowContainer;

const planeImageHeightOnFlight = 100;
const planeImageHeightOnGround = 80;

const planeShadowImageHeightOnFlight = 60;

const planeContainerInitialWidth = 300;

const template = document.createElement('template');
template.innerHTML = `
<style>
        .animated-plane-container {
            background: #57A0F2;
            width: 100%;
            height: 100%;
            min-height: 200px;
            position: relative;
            overflow: hidden;
            
        }

        .animated-plane-container * {
            box-sizing: border-box;
        }

        .plane-container {
            width: ${planeContainerInitialWidth}px;
            height: calc(100% - 30px);
            margin: 30px auto 0 auto;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            position: absolute;
            left: 0;
            right: 0;
            z-index: 2;
        }

        .plane {
            height: ${planeImageHeightOnGround}%;
            display: block;
            transition: all 1s ease;
            margin-bottom: 20px;
            z-index: 1;
        }

        .plane-shadow-container {
            z-index: 1;
            padding: 10px 0 0 20px;
            margin-left: 200px;
        }

        .plane-shadow {
            opacity: 0.3;
        }

        #airstrip {
            width: 50%;
            height: 100%;
            margin: 0 auto;
            background-color: #0A52A6;
            position: absolute;
            left: 25%;
            top: 0;
        }

        .marks {
            display: flex;
            justify-content: space-between;
            width: 25px;
            height: 30px;
            position: absolute;
            top: -30px;
            left: 75%;
            transition: all 1s;
        }

        .marks.left {
            left: calc(25% - 25px);
        }

        .marks.down {
            top: 100%;
        }

        .marks__mark {
            width: calc((100% / 3) - 3px);
            height: 100%;
            background-color: #57A0F2;
        }

        .spot {
            width: 7px;
            height: 7px;
            background-color: white;
            border-radius: 50%;
            position: absolute;
            left: -15px;
            top: 10px;
        }

        .spot.left {
            left: calc(100% + 8px);
        }

    </style>
    
    <div class="animated-plane-container">
        <div class="plane-container">
            <img src="./animatedplane/plane.png" id="plane" class="plane" />
        </div>
        
        <div class="plane-container plane-shadow-container">
            <img src="./animatedplane/plane_shadow.png" id="plane-shadow" class="plane plane-shadow" />
        </div>

        <div class="airstrip" id="airstrip"></div>
    </div>
`;

window.animatedPlane = function(el) {
    if(!el) return false;

    el.innerHTML = template.innerHTML;

    animatedPlaneContainer = document.querySelector('.animated-plane-container');
    plane = document.querySelector('#plane');
    planeContainer = plane.parentElement;
    planeShadow = document.querySelector('#plane-shadow');
    planeShadowContainer = document.querySelector('.plane-shadow-container');

    renderStripMark();
    planeVibrationLoop();
    renderSpots();
}

//Starts the airstrip spots rendering
function renderSpots() {
    setInterval(() => runSpot(false), 100);
}

//Animate spot
function runSpot(left = false) {
    const spot = document.createElement('span');
    const airStrip = document.getElementById('airstrip');
    spot.classList.add('spot');
    if(left) spot.classList.add('left');
    airStrip.prepend(spot);
    animateDown(spot);
    if(!left) runSpot(true);
}

//Start the airstrip mark loop
function renderStripMark() {
    setInterval(()  => runAirStripMark(), 2500)
}

//Animates the airstrip mark
function runAirStripMark(left = false) {
    const marks = document.createElement('div');
    const airStrip = document.getElementById('airstrip');
    marks.classList.add('marks');
    if(left) {
        marks.classList.add('left');
    }
    marks.innerHTML = '<span class="marks__mark"></span><span class="marks__mark"></span><span class="marks__mark"></span>';
    airStrip.prepend(marks);
    animateDown(marks, false);
    if(!left) runAirStripMark(true);
}

//Start the plane vibrations loop
function planeVibrationLoop() {
    setInterval(() => vibrate(), 2500);
}

//Do da plane vibration
function vibrate() {
    let marginLeftPlane = '0px';
    let random = Math.random();
    if(random > 0.6) {
        marginLeftPlane = '-5px';
    } else if(random > 0.3) {
        marginLeftPlane = '5px';
    }   
    plane.animate([
        {marginBottom: '20px'},
        {marginBottom: '30px'},
        {marginLeft: marginLeftPlane},
        {marginBottom: '20px'},
        {marginLeft: '0'}
    ], 2500);

    planeShadow.animate([
        {marginBottom: '20px'},
        {marginBottom: '30px'},
        {marginLeft: marginLeftPlane},
        {marginBottom: '20px'},
        {marginLeft: '0'}
    ], 2500);
}

//Execute the flight animation
function fly() {
    if(plane.style.height == planeImageHeightOnFlight + '%') return false;
    hadFlew = true;
    flying = true;

    plane.animate([
        { height: planeImageHeightOnGround + '%' },
        { height: '95%' },
        { height: '98%' },
        { height: planeImageHeightOnFlight + '%'}
    ], {
        duration: 1000
    });

    planeShadow.animate([
        { height: planeImageHeightOnGround + '%' },
        { height: '65%' },
        { height: '62%' },
        { height: planeShadowImageHeightOnFlight + '%' },
    ], {
        duration: 1000
    });

    planeShadowContainer.animate([
        { marginLeft: (((animatedPlaneContainer.offsetWidth - planeContainerInitialWidth) / 2)) + 'px'},
        { marginLeft: (((animatedPlaneContainer.offsetWidth - planeContainerInitialWidth) / 2) + 100) + 'px'},
        { marginLeft: (((animatedPlaneContainer.offsetWidth - planeContainerInitialWidth) / 2) + 120) + 'px'},
        { marginLeft: (((animatedPlaneContainer.offsetWidth - planeContainerInitialWidth) / 2) + 125) + 'px'},
    ], {
        duration: 1000
    });

    setTimeout(function() {
        plane.style.height = planeImageHeightOnFlight + '%';
        planeShadow.style.height = planeShadowImageHeightOnFlight + '%';
        planeShadowContainer.style.marginLeft = (((animatedPlaneContainer.offsetWidth - planeContainerInitialWidth) / 2) + 125) + 'px';
    });
}

//Execute the land animation
function land() {
    if(plane.style.height == planeImageHeightOnGround + '%' || !hadFlew) return false;
    flying = false;
    plane.animate([
        { height: planeImageHeightOnFlight + '%' },
        { height: '85%' },
        { height: '82%' },
        { height: planeImageHeightOnGround + '%' }
    ], {
        duration: 1000
    });

    planeShadow.animate([
        { height: planeShadowImageHeightOnFlight + '%' },
        { height: '75%' },
        { height: '78%' },
        { height: planeImageHeightOnGround + '%' },
    ], {
        duration: 1000
    });

    planeShadowContainer.animate([
        { marginLeft: (((animatedPlaneContainer.offsetWidth - planeContainerInitialWidth) / 2) + 125) + 'px'},
        { marginLeft: (((animatedPlaneContainer.offsetWidth - planeContainerInitialWidth) / 2) + 25) + 'px'},
        { marginLeft: (((animatedPlaneContainer.offsetWidth - planeContainerInitialWidth) / 2) + 5) + 'px'},
        { marginLeft: (((animatedPlaneContainer.offsetWidth - planeContainerInitialWidth) / 2)) + 'px'},
    ], {
        duration: 1000
    });


    setTimeout(function() {
        plane.style.height = planeImageHeightOnGround + '%';
        planeShadow.style.height = planeImageHeightOnGround + '%';
        planeShadowContainer.style.marginLeft = (((animatedPlaneContainer.offsetWidth - planeContainerInitialWidth) / 2)) + 'px';
    })
}

//Execute the taking off animation
function takeOff() {
    if(!flying) return false;
    planeContainer.animate([
        { bottom: '0px' },
        { bottom: '500px' },
        { bottom: '800px' },
        { bottom: '900px' }
    ], {
        duration: 10000
    });

    planeShadowContainer.animate([
        { bottom: '0px' },
        { bottom: '500px' },
        { bottom: '800px' },
        { bottom: '900px' }
    ], {
        duration: 10000
    });
}

//Create an element animation and, then, remove it
function animateDown(el, infinity = false) {
    el.animate([
        { top: '0px' },
        { top: '100%' }
        ], {
        duration: airStripMarkAnimationDuration
    });

    if(!infinity) setTimeout(() =>  el.remove(), airStripMarkAnimationDuration);
}

//Accelerate airstrip components transition
function accelerate() {
    if(airStripMarkAnimationDuration <= 100) return;
    airStripMarkAnimationDuration -= 100;
}

//Decelerate airstrip components transition
function decelerate() {
    if(airStripMarkAnimationDuration >= 1000) return;
    airStripMarkAnimationDuration += 100;
}
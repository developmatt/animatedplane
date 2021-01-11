const template = document.createElement('template');
template.innerHTML = `
<style>
        .container {
            background: #308afc;
            width: 100%;
            height: 300px;
            position: relative;
            
        }

        .plane-container {
            width: 300px;
            height: calc(100% - 30px);
            margin: 30px auto 0 auto;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            position: absolute;
            left: 0;
            right: 0;
        }

        .plane-container {
            width: 350px;
        }

        .plane {
            height: 80%;
            display: block;
            transition: all 1s ease;
            margin-bottom: 20px;
            z-index: 1;
        }

        .plane.fly {
            height: 100%;
        }

        #airstrip {
            width: 50%;
            height: 100%;
            margin: 0 auto;
            background-color: rgb(7, 11, 22);
            position: relative;
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
            background-color: white;
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
    
    <div class="container">
        <div class="plane-container">
            <img src="./animatedplane/plane.png" alt="" class="plane" id="plane" />
        </div>

        <div class="airstrip" id="airstrip"></div>
    </div>
`;

window.animatedPlane = function(el) {
    if(!el) return false;

    el.innerHTML = template.innerHTML;

    renderStripMark();
    planeVibrationLoop();
    renderSpots();
}

let airStripMarkAnimationDuration = 600;
let hadFlew = false;

const planeImageHeightOnFlight = 100;
const planeImageHeightOnGround = 80;
const plane = document.querySelector('.plane');

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
    const plane = document.querySelector('.plane');    
    plane.animate([
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
    plane.animate([
        { height: planeImageHeightOnGround + '%' },
        { height: '95%' },
        { height: '98%' },
        { height: planeImageHeightOnFlight + '%'}
    ], {
        duration: 1000
    });
    setTimeout(() => plane.style.height = planeImageHeightOnFlight + '%');
}

//Execute the land animation
function land() {
    if(plane.style.height == planeImageHeightOnGround + '%' || !hadFlew) return false;
    plane.animate([
        { height: planeImageHeightOnFlight + '%' },
        { height: '85%' },
        { height: '82%' },
        { height: planeImageHeightOnGround + '%' }
    ], {
        duration: 1000
    })
    setTimeout(function() {
        plane.style.height = planeImageHeightOnGround + '%';
    })
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
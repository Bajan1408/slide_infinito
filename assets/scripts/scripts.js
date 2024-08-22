'use strict'

const dataSlide = document.querySelector('[data-slide="wrapper"]');
const slideList = document.querySelector('[data-slide="list"]');
const navPreviousButton = document.querySelector('[data-slide="nav-previous-button"]');
const navNextButton = document.querySelector('[data-slide="nav-next-button"]');
const slideItems = document.querySelectorAll('[data-slide="item"]');
const controlsWrapper = document.querySelector('[data-slide="controls-wrapper"]');
const controlButtons = document.querySelectorAll('[data-slide="control-button"]');

const state = {
    startingPoint: 0,
    savedPositionMouse: 0,
    currentPoint: 0,
    movement: 0,
    currentSlideIndex: 0
}

function translateSlide({ position }) {
    state.savedPositionMouse = position;
    slideList.style.transform = `translateX(${position}px)`;
}

function getCenterPosition({ index }) {
    const slideItem = slideItems[index];
    const slideWidth = slideItem.clientWidth;
    const windowWidth = document.body.clientWidth;
    const margin = (windowWidth - slideWidth) / 2;
    const position = margin - (index * slideWidth);
    return position;
}

function setVisibleSlide({ index }) {
    // const slideItem = slideItems[index];
    // const slideWidth = slideItem.clientWidth;
    // const windowWidth = document.body.clientWidth;
    // const margin = (windowWidth - slideWidth) / 2;
    //const position = margin - (index * slideWidth);
    const position = getCenterPosition({ index });
    state.currentSlideIndex = index;
    translateSlide({ position: position });
}

function nextSlide() {
    setVisibleSlide({ index: state.currentSlideIndex + 1 });
}

function previousSlide() {
    setVisibleSlide({ index: state.currentSlideIndex - 1 });
}

function currentSlide() {
    setVisibleSlide({ index: state.currentSlideIndex });
}

function createControlButtons() {
    slideItems.forEach(() => {
        const controlButton = document.createElement('button');
        controlButton.classList.add('slide-control-button');
        controlButton.classList.add('fas');
        controlButton.classList.add('fa-circle');
        controlButton.setAttribute('data-slide', 'control-button');
        controlsWrapper.appendChild(controlButton);
    })
}

function onMouseDown(event, index) {
    const item = event.currentTarget;
    state.startingPoint = event.clientX;
    state.currentPoint = event.clientX - state.savedPositionMouse;
    state.currentSlideIndex = index;
    console.log('Eu sou o index do mousedown ', state.currentSlideIndex);
    //console.log('Eu sou o event.clientX, pixel do mousedown', event.clientX);
    //console.log('apertei o botão do mouse');
    item.addEventListener('mousemove', onMouseMove);
    
    //console.log('Ponto de partida', startingPoint);
}

function onMouseMove(event) {
    state.movement = event.clientX - state.startingPoint;
    const position = event.clientX - state.currentPoint;
    console.log(`Pixel do mousemove ${event.clientX} - Ponto de partida ${state.startingPoint} = ${state.movement}`);
    //console.log('Quantidade de pixels movimentada: ', moviment);
    //slideList.style.transform = `translateX(${position}px)`;
    translateSlide({ position: position });
}

function onMouseUp(event) {
    const item = event.currentTarget;
    const slideWidth = item.clientWidth;
    //console.log(`Eu sou o valor do slidewidth: ${slideWidth}`);
    
    if(state.movement < -150) {
        nextSlide();
        //setVisibleSlide({ index: state.currentSlideIndex + 1 });
        //const position = (state.currentSlideIndex + 1) * slideWidth;
        //translateSlide({ position: -position });
        //slideList.style.transform = `translateX(-${position}px)`;
        //state.savedPositionMouse = -position;
    } else if(state.movement > 150) {
        previousSlide();
        //setVisibleSlide({ index: state.currentSlideIndex - 1 });
        //const position = (state.currentSlideIndex - 1) * slideWidth;
        //translateSlide({ position: -position });
        //slideList.style.transform = `translateX(-${position}px)`;
        //state.savedPositionMouse = -position;
    } else {
        currentSlide();
        //setVisibleSlide({ index: state.currentSlideIndex });
        //const position = (state.currentSlideIndex) * slideWidth;
        //translateSlide({ position: -position });
        //slideList.style.transform = `translateX(-${position}px)`;
        //state.savedPositionMouse = -position;
    }

    item.removeEventListener('mousemove', onMouseMove);

}

slideItems.forEach((item, index) => {
    item.addEventListener('dragstart', (event) => {
        event.preventDefault();
    })
    item.addEventListener('mousedown', (event) => {
        onMouseDown(event, index);
    })
    
    item.addEventListener('mouseup', onMouseUp);
})

navNextButton.addEventListener('click', nextSlide);
navPreviousButton.addEventListener('click', previousSlide);

setVisibleSlide({ index: 0 });
createControlButtons();


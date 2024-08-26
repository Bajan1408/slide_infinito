'use strict'

const dataSlide = document.querySelector('[data-slide="wrapper"]');
const slideList = document.querySelector('[data-slide="list"]');
const navPreviousButton = document.querySelector('[data-slide="nav-previous-button"]');
const navNextButton = document.querySelector('[data-slide="nav-next-button"]');
let slideItems = document.querySelectorAll('[data-slide="item"]');
const controlsWrapper = document.querySelector('[data-slide="controls-wrapper"]');
const slideWrapper = document.querySelector('.slide-wrapper');
let controlButtons;
let slideAuto;

const state = {
    startingPoint: 0,
    savedPositionMouse: 0,
    currentPoint: 0,
    movement: 0,
    currentSlideIndex: 0,
    autoPlay: true, 
    timeInterval: 2000
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

function setVisibleSlide({ index, animate }) {
    // const slideItem = slideItems[index];
    // const slideWidth = slideItem.clientWidth;
    // const windowWidth = document.body.clientWidth;
    // const margin = (windowWidth - slideWidth) / 2;
    //const position = margin - (index * slideWidth);
    if(index === 0 || index === slideItems.length - 1) {
        index = state.currentSlideIndex;
    }
    const position = getCenterPosition({ index });
    state.currentSlideIndex = index;
    slideList.style.transition = animate === true ? `transform .5s` : `none`;
    activeControlButton({ index });
    translateSlide({ position: position });
}

function nextSlide() {
    setVisibleSlide({ index: state.currentSlideIndex + 1, animate: true });
}

function previousSlide() {
    setVisibleSlide({ index: state.currentSlideIndex - 1, animate: true });
}

function currentSlide() {
    setVisibleSlide({ index: state.currentSlideIndex, animate: true });
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

function activeControlButton({ index }) {
    const slideItem = slideItems[index];
    const dataIndex = Number(slideItem.dataset.index);
    const controlButton = controlButtons[dataIndex];
    controlButtons.forEach((contolButtonItem) => {
        contolButtonItem.classList.remove('active');
    })
    if(controlButton) controlButton.classList.add('active');
}

function createSlideClones() {
    //fazendo uma clonagem profunda dos elementos (deep clone)
    const firstSlide = slideItems[0].cloneNode(true);
    firstSlide.classList.add('slide-cloned');
    //firstSlide.setAttribute('data-index', "8");
    
    //outra forma de atribuir o data-index abaixo:

    firstSlide.dataset.index = slideItems.length;

    const secondtSlide = slideItems[1].cloneNode(true);
    secondtSlide.classList.add('slide-cloned');
    secondtSlide.setAttribute('data-index', slideItems.length + 1);

    const lastSlide = slideItems[slideItems.length - 1].cloneNode(true);
    lastSlide.classList.add('slide-cloned');
    lastSlide.setAttribute('data-index', -1);

    const penultimateSlide = slideItems[slideItems.length - 2].cloneNode(true);
    penultimateSlide.classList.add('slide-cloned');
    penultimateSlide.setAttribute('data-index', -2);

    slideList.append(firstSlide);
    slideList.append(secondtSlide);
    
    slideList.prepend(lastSlide);
    slideList.prepend(penultimateSlide);
    
    
    slideItems = document.querySelectorAll('[data-slide="item"]');

    console.log('createSlideClones passou por aqui...');
}

function onMouseDown(event, index) {
    const item = event.currentTarget;
    state.startingPoint = event.clientX;
    state.currentPoint = event.clientX - state.savedPositionMouse;
    state.currentSlideIndex = index;
    slideList.style.transition = `none`;
    item.addEventListener('mousemove', onMouseMove);
}

function onMouseMove(event) {
    state.movement = event.clientX - state.startingPoint;
    const position = event.clientX - state.currentPoint;
    translateSlide({ position: position });
}

function onMouseUp(event) {
    const item = event.currentTarget;
    const slideWidth = item.clientWidth;
    
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

function onControlButtonClick(index) {
    setVisibleSlide({ index: index + 2, animate: true });
}

function onSlideListTransitionEnd() {
    if(state.currentSlideIndex === (slideItems.length - 2)) {
        setVisibleSlide({ index: 2, animate: false });
    } 
   if(state.currentSlideIndex === 1) {
        setVisibleSlide({ index: (slideItems.length - 3), animate: false });
    } 
}

function setAutoPlay() {
    if(state.autoPlay) {
        slideAuto = setInterval(nextSlide, state.timeInterval);
    }
    
}

function setListeners() {
    controlButtons = document.querySelectorAll('[data-slide="control-button"]');

    controlButtons.forEach((controlButton, index) => {
        controlButton.addEventListener('click', (event) => {
            onControlButtonClick(index);
        })
    })

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
    slideList.addEventListener('transitionend', onSlideListTransitionEnd);
    slideWrapper.addEventListener('mouseenter', () => {
        clearInterval(slideAuto);
    });
    slideWrapper.addEventListener('mouseleave', setAutoPlay);

}

function initSlider({ startAtIndex = 0, autoPlay = true, timeInterval = 2000 }) {
    state.autoPlay = autoPlay;
    state.timeInterval = timeInterval;
    createControlButtons();
    createSlideClones();
    setListeners();
    
    setVisibleSlide({ index: startAtIndex + 2, animate: true });

    setAutoPlay();
}

initSlider({
    startAtIndex: 0,
    autoPlay: true,
    timeInterval: 2000
});





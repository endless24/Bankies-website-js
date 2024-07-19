'use strict';

///////////////////////////////////////
// Modal window
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const allImages = document.querySelectorAll('img[data-src]');

// ///////////////////////////////////////
///Open modal function

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};
/////////////////////////////////////////
// close modal
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

//////////////////////////////////////////////////
// open modal btn
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

// /////////////////////////////////////
// Close modal with Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//////////////////////////////////////////////////
// adding scroll
btnScrollTo.addEventListener('click', function () {
  // scroll
  section1.scrollIntoView({ behavior: 'smooth' });
});

// //////////////////////////////////////////////
// Page navigation
// document.querySelectorAll('.nav__link').forEach(link =>
//   link.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//     // console.log(id);
//   })
// );

///
// 1. Add event listener to common parent element
// 2. Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // matching stratagy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// /////////////////////////////////////////////
// Tabbed component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;

  // remove active on the content
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));

  tabContent.forEach(cont =>
    cont.classList.remove('operations__content--active')
  );

  // Active tab
  clicked.classList.add('operations__tab--active');

  // Tab content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////////
//  Menu fade animation
const handleOver = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const clickLink = e.target;
    const siblings = clickLink.closest('.nav').querySelectorAll('.nav__link');
    const logo = clickLink.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== clickLink) {
        el.style.opacity = this;
        logo.style.opacity = this;
      }
    });
  }
};
// passing "argument" into handler
nav.addEventListener('mouseover', handleOver.bind(0.5));

nav.addEventListener('mouseout', handleOver.bind(1));

///////////////////////////////////////////////////
// STICKY NAV
// const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (enteris) {
  // destructure
  const [entry] = enteris;

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const obsOptions = {
  root: null,
  threshold: 0,
  // rootMargin: `-${navHeight}px`,
};
const headerObserver = new IntersectionObserver(stickyNav);
headerObserver.observe(header);

//////////////////////////////////////////////////
// REVEAL SECTIONS
const revealSection = function (enteris, observer) {
  // destructure
  const [entry] = enteris;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');

  //stop observing
  observer.unobserve(entry.target);
};

const secOption = {
  root: null,
  threshold: 0.15,
};
const sectionObserver = new IntersectionObserver(revealSection, secOption);
allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

///////////////////////////////////////////////////
// Lazy loading image
const handleImgLazyLoad = function (enteris, observer) {
  // destructure
  const [entry] = enteris;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  //stop observing
  observer.unobserve(entry.target);
};

const imgOption = {
  root: null,
  threshold: 0,
};

const imgObservser = new IntersectionObserver(handleImgLazyLoad, imgOption);
allImages.forEach(image => {
  imgObservser.observe(image);
});

// /////////////////////////////////////////////
// Slider functions
const slider = function () {
  const allSlides = document.querySelectorAll('.slide');
  const bntleft = document.querySelector('.slider__btn--left');
  const bntRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlides = allSlides.length;

  // dots
  const createDots = function () {
    allSlides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        ` <button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activeDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  // right slide
  const goToSlide = function (slide) {
    allSlides.forEach((sld, i) => {
      // curSlide = 1: -100%, 0%, 100%, 200%
      sld.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };

  // Next slide
  const nextSlide = function () {
    // tracking the slide
    if (curSlide === maxSlides - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activeDot(curSlide);
  };

  // left slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlides - 1;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    activeDot(curSlide);
  };

  const init = function () {
    createDots();
    goToSlide(0);
    activeDot(0);
  };
  init();

  //event handler
  bntRight.addEventListener('click', nextSlide);
  bntleft.addEventListener('click', prevSlide);

  // targeting arrow keys
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') {
      nextSlide();
    } else {
      prevSlide();
    }
  });

  // dot event
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // destructure
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activeDot(slide);
    }
  });
};
slider();
/////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
// LECTURE
/////////////////////////////////////////////////

/////////////////////////////////////////////
// selecting Element
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);
const allSection = document.querySelectorAll('.section');
// console.log(allSection);
// console.log(document.getElementById('section--1'));
// console.log(document.getElementsByTagName('button'));
// console.log(document.getElementsByClassName('btn'));

// const header = document.querySelector('header');

///////////////////////////////////////////////////
// Creating and inserting Elements
// .insertAdjacentTHML
const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
  'We use cookie for improved functionaliy and analytics <button class="btn bnt--close-cookie">Got it</button> ';
// header.prepend(message);
// header.append(message);
// header.append(message.cloneNode(true)); //display it in another place

// header.before(message);
// header.after(message);

///////////////////////////////////////////////
// // delete element
// document
//   .querySelector('.bnt--close-cookie')
//   .addEventListener('click', function () {
//     // old way of deleting element
//     // message.parentElement.removeChild(message);
//     // new way
//     // message.remove();
// });

/////////////////////////////////////////////
// styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);

// add height
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

//////////////////////////////////
//Attribute
const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.className);
// console.log((logo.alt = 'beautifull'));

///////////////////////////////////////////
// Data Attribute
// console.log(logo.dataset.versionNumber);

///////////////////////////////////////////
// //Classes
// console.log(logo.classList.add('l'));
// console.log(logo.classList.remove('s'));
// console.log(logo.classList.toggle('e'));
// console.log(logo.classList.contains('g'));

///////////////////////////////////////////////////
// adding event nd removing it
// const h1 = document.querySelector('h1');

// const alertH1 = function () {
//   alert(`addEventListener: Great you are reading heading`);
// };

// h1.addEventListener('mouseenter', alertH1);
// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

//////////////////////////////////////////////////
// Random Color rgb(255,255,255)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('Link');
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('Link');
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('Link');
// });

///////////////////////////////////////////////////
// DOM Traversing Example
// const parentDiv = document.querySelector('.parent');

// // Accessing child nodes
// const childNodes = parentDiv.childNodes;
// console.log('All child nodes:', childNodes);

// // Accessing child elements only
// const children = parentDiv.children;
// console.log('All children elements:', children);

// // Accessing first and last child elements
// const firstChild = parentDiv.firstElementChild;
// const lastChild = parentDiv.lastElementChild;
// console.log('First child element:', firstChild);
// console.log('Last child element:', lastChild);

// // Accessing sibling elements
// const firstChildNextSibling = firstChild.nextElementSibling;
// console.log('Next sibling of first child:', firstChildNextSibling);

// const secondChildPreviousSibling = lastChild.previousElementSibling;
// console.log('Previous sibling of last child:', secondChildPreviousSibling);

// // Accessing parent element
// const parentElement = firstChild.parentElement;
// console.log('Parent element:', parentElement);

// ///
const h1 = document.querySelector('h1');

// Going downward:child
// querySelector finds children no matter how dip
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);

// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'blue';

// Going upward:Parent
// console.log('Parent', h1.parentNode);
// console.log('Parent', h1.parentElement);
// closest finds parent n matter how far up they are
// h1.closest('.header').style.background = 'var( --gradient-secondary)';

// Going sideways:Siblings
// console.log('prev-sibling', h1.previousElementSibling);
// console.log('next-sibling', h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);
// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(el => {
//   if (el === h1) el.style.color = 'green';
// });

// INTERSECTION OBSERVER API
// const obsCallBack = function (enteris, observer) {
//   enteris.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null,
//   threshold: 0.1,
// };

// const observer = new IntersectionObserver(obsCallBack, obsOptions);

// observer.observe(section1);

// checking for dom content
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree build', e);
});

window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

// before leaving the page
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });

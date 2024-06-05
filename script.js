'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContaier = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const dotsContainer = document.querySelector('.dots');
///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function (e) {
  const s1cords = section1.getBoundingClientRect();
  console.log(s1cords);

  console.log(e.target.getBoundingClientRect());
  console.log('curretsrcoll x/y:', window.pageXOffset, pageYOffset);
  console.log(
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // //Scroling

  // window.scrollTo(
  //   s1cords.left + window.pageXOffset,
  //   s1cords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1cords.left + window.pageXOffset,
  //   top: s1cords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////////////////
//page navigation

document.querySelectorAll('.nav__link').forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    const id = this.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
});

// Add eventListner to common parents
// Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //Matching Strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed Component

tabsContaier.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);

  //active tab
  if (clicked) {
    tabs.forEach(t => t.classList.remove('operations__tab--active'));
    clicked.classList.add('operations__tab--active');
  }
  //Activate content Area

  tabsContent.forEach(el => el.classList.remove('operations__content--active'));
  console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Menu Fade animation
const handleOver = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const sibling = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    sibling.forEach(el => {
      if (el !== link) {
        el.style.opacity = opacity;
      }
    });
    logo.style.opacity = opacity;
  }
};

nav.addEventListener('mouseover', function (e) {
  handleOver(e, 0.5);
});

nav.addEventListener('mouseout', function (e) {
  handleOver(e, 1);
});

//sticky navigation
// const initialCords = section1.getBoundingClientRect();
// console.log(initialCords);
// window.addEventListener('scroll', function () {
//   console.log(window.scrollY);
//   if (window.scrollY > initialCords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

// sticky navigation intersection observer API
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => console.log(entry));
// };

// const obsOptions = {
//   root: null,
//   threshold: 0.1,
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const header = document.querySelector('.header');
console.log(header);
const navHeight = nav.getBoundingClientRect().height;
console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//Display Section on Scroll
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('section--hidden');
      observer.unobserve(entry.target);
    }
  });
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// lazy img loading

const imgTarget = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTarget.forEach(img => imgObserver.observe(img));

//slider
const slider = function (e) {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  //const slider = document.querySelector('.slider');

  let curSlide = 0;
  let maxSlide = slides.length - 1;

  // functions
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const createDot = function () {
    slides.forEach(function (_, i) {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}">${i}</button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const nextSlide = function () {
    if (curSlide === maxSlide) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    createDot();
    activateDot(0);
    goToSlide(0);
  };
  init();

  //Event Handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight') nextSlide();

    event.key === 'ArrowLeft' && prevSlide();
  });

  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

////////////////////////////////////////////////
////////////////////////////////////////////////

///////////////////////////////////////////////
// Selecting and creating deleting element

// console.log(document.documentElement);
// console.log(document.body);
// console.log(document.head);

// const header = document.querySelector('.header');
// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// document.getElementById('secytion--1');

// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // message.textContent = 'We use cookies for improved functionality and analytics';
// message.innerHTML =
//   'We use cookies for improved functionality and analytics <button class="btn btn--close-cookie">Got it!</button>>';
// // header.prepend(message);
// header.append(message);
// // header.append(message.cloneNode(true));

// // header.before(message);
// // header.after(message);

// // Delete elements
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     // message.remove();
//     // or
//     message.parentElement.removeChild(message);
//   });

// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// console.log(message.style.color);
// console.log(message.style.backgroundColor);
// console.log(getComputedStyle(message).color);
// // console.log(getComputedStyle(message).height);
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// //Attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.className);

// console.log(logo.alt);
// console.log(logo.getAttribute('designer'));
// logo.alt = 'beautiful Minimal logo';
// logo.setAttribute('company', 'abiodun');

// console.log(logo.src);
// console.log(logo.getAttribute('src'));

// const link = document.querySelector('.nav__link--btn');

// console.log(link.href);
// console.log(link.getAttribute('href'));

// console.log(logo.dataset.versionNumber);

// const h1 = document.querySelector('h1');

// const alertH1 = function (e) {
//   alert('addEvetListener: Great! you are reading the heading :D');
// };

// h1.addEventListener('mouseenter', alertH1);

// setTimeout(() => {
//   h1.removeEventListener('mouseenter', alertH1);
// }, 3000);

// // h1.onmouseenter = function (e) {
// //   alert('onmouseenter: Great! you are reading the heading :D');
// // };

// const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randInt(0, 255)},${randInt(0, 255)},${randInt(0, 255)})`;

// console.log(randomColor());

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget);
//   console.log(e.currentTarget === this);

//   //stop propagation
//   //e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.target, e.currentTarget);
// });

// document.querySelector('.nav').addEventListener(
//   'click',
//   function (e) {
//     this.style.backgroundColor = randomColor();
//     console.log('NAV', e.target, e.currentTarget);
//   },
//   true
// );

// const h1 = document.querySelector('h1');

// // Going Downwards: child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);

// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// //Going upward
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest('.header').style.background = 'var(--gradient-secondary)';
// h1.closest('h1').style.background = 'var(--gradient-primary)';

// //Going sideways siblings
// //const h4 = document.querySelector('h4');

// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(el => {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });

document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built', e);
});

window.addEventListener('load', function (e) {
  console.log('page fully loaded', e);
});

window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = '';
});

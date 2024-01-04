'use strict';

// Modal window
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (evt) {
	// see explanation in commit description
	evt.preventDefault();
	modal.classList.remove('hidden');
	overlay.classList.remove('hidden');
};

const closeModal = function () {
	modal.classList.add('hidden');
	overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
	if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
		closeModal();
	}
});

// =====================================================================

// Smooth scrolling when 'Learn More' button is clicked (old way)

// const btnScrollTo = document.querySelector('.btn--scroll-to');
// const section1 = document.querySelector('#section--1');

// btnScrollTo.addEventListener('click', function () {
// 	const section1React = section1.getBoundingClientRect();

// 	// works when you are at the top of the document
// 	// breaks when you are scrolled
// 	// window.scrollTo(section1React.left, section1React.top);

// 	// scrolls correctly from anywhere
// 	// window.scrollTo(window.scrollX + section1React.left, window.scrollY + section1React.top);

// 	// smooth scrolling
// 	window.scrollTo({
// 		left: window.scrollX + section1React.left,
// 		top: window.scrollY + section1React.top,
// 		behavior: 'smooth',
// 	});
// });

// =====================================================================

// Smooth scrolling when 'Learn More' button is clicked (new way)

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function () {
	section1.scrollIntoView({ behavior: 'smooth' });
});

// =====================================================================

// Smooth scrolling for navbar links (Features, Operations and Testimonials)

// document.querySelectorAll('.nav__link').forEach(function (el) {
// 	el.addEventListener('click', function (evt) {
// 		evt.preventDefault();
//         // el.href will give the absolute address, hence getAttribute is used
// 		const sectionId = el.getAttribute('href');
// 		document.querySelector(sectionId).scrollIntoView({ behavior: 'smooth' });
// 	});
// });

// =====================================================================

// Event delegation for implementing smooth scrolling on navbar links

document.querySelector('.nav__links').addEventListener('click', function (e) {
	e.preventDefault();
	if (e.target.classList.contains('nav__link')) {
		// el.href will give the absolute address, hence getAttribute is used
		const sectionId = e.target.getAttribute('href');
		document.querySelector(sectionId).scrollIntoView({ behavior: 'smooth' });
	}
});

// =====================================================================

// Tabbed component in operations section (using Event delegation)

const tabBtnContainer = document.querySelector('.operations__tab-container');
const tabBtns = document.querySelectorAll('.operations__tab');
const tabsContents = document.querySelectorAll('.operations__content');

tabBtnContainer.addEventListener('click', function (evt) {
	// The tabBtn also contains a span element
	// if that particular span element is clicked, then evt.target refers to that span
	const clickedTabBtn = evt.target.closest('.operations__tab');

	// if the parent element and not button was clicked
	if (!clickedTabBtn) return;

	tabBtns.forEach(tabBtn => tabBtn.classList.remove('operations__tab--active'));
	tabsContents.forEach(tabContent => tabContent.classList.remove('operations__content--active'));

	clickedTabBtn.classList.add('operations__tab--active');

	const clickedTabNo = clickedTabBtn.dataset.tab;
	const clickedContent = document.querySelector(`.operations__content--${clickedTabNo}`);
	clickedContent.classList.add('operations__content--active');
});

// =====================================================================

// Fade in and out the 'complete' navbar when mouse enters any navlink

// selecting navbar here, but we just need
// the parent element of navlink for event delegation
// better to choose nav__links, but using nav for demonstration
const navbar = document.querySelector('.nav');

const handleHover = function (evt, opacity) {
	const navlink = evt.target;
	if (!navlink.classList.contains('nav__link')) return;

	// select all other navlink's (siblings)
	const navlinks = navlink.closest('.nav').querySelectorAll('.nav__link');
	const logo = navlink.closest('.nav').querySelector('img');

	navlinks.forEach(nl => nl !== navlink && (nl.style.opacity = opacity));
	logo.style.opacity = opacity;
};

// METHOD 1
// navbar.addEventListener('mouseover', function (evt) {
// 	handleHover(evt, 0.5);
// });

// navbar.addEventListener('mouseout', function (evt) {
// 	handleHover(evt, 1);
// });

// METHOD 2
// navbar.addEventListener('mouseover', evt => handleHover(evt, 0.5));
// navbar.addEventListener('mouseout', evt => handleHover(evt, 0.5));

// ===============================

// METHOD 3

// use .bind and this keyword
const handleHover2 = function (evt) {
	const navlink = evt.target;
	if (!navlink.classList.contains('nav__link')) return;

	// select all other navlink's (siblings)
	const navlinks = navlink.closest('.nav').querySelectorAll('.nav__link');
	const logo = navlink.closest('.nav').querySelector('img');

	navlinks.forEach(nl => nl !== navlink && (nl.style.opacity = this));
	logo.style.opacity = this;
};

navbar.addEventListener('mouseover', handleHover2.bind(0.5));
navbar.addEventListener('mouseout', handleHover2.bind(1));

// =====================================================================

// Sticky navigation
// Stick the navbar to the top as soon as you reach section1

// Implementation using scroll event, which is fired each time page is scrolled
// Hence it is not efficient for this task

// we take the DOMRect of section1 on page load, ie when there is no scrolling
// This does not work reliably
// If the initial page is scrolled from the top of the document, it'll work
// if there is already some scrolling (say you scrolled,navbar stuck, and then reload)
// then this does not work well

// const initialSection1Rect = section1.getBoundingClientRect();

// window.addEventListener('scroll', function () {
// 	if (window.scrollY > initialSection1Rect.top) {
// 		// console.log('Below section1, navbar should be stuck');
// 		navbar.classList.add('sticky');
// 	} else {
// 		// console.log('Above section1, navbar should not be stuck');
// 		navbar.classList.remove('sticky');
// 	}
// });

// =====================================================================

// Sticky navigation (Intersection Observer API)
// navbar sticks to the top whenever we reach section1
// so we can observe intersection of section1 and other elements (except header) with the root
// which is equivalent to observing the intersection of header and root (viewport)

const navbarHeight = navbar.getBoundingClientRect().height;
const stickyNav = function (entries) {
	const [entry] = entries;
	if (!entry.isIntersecting) navbar.classList.add('sticky');
	else navbar.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
	root: null,
	threshold: 0,
	// consider observed element as being constrained in the area after leaving this margin
	rootMargin: `-${navbarHeight}px`,
});
headerObserver.observe(document.querySelector('.header'));

// =====================================================================

// Reveal sections on scroll

// there is a section--hidden class that hides the section
// it is not added to all sections by default, so add them (see below)
// when you scroll to that section, remove the class

const revealSection = function (entries, observer) {
	const [entry] = entries;

	// a default entry is created automatically by the API
	// this entry has target section1, due to which
	// section1 was already added to the page without any hover effect
	if (!entry.isIntersecting) return;

	// since we are observing multiple sections,
	// we need the particular section observed, given by entry.target
	entry.target.classList.remove('section--hidden');

	// once the section has been scrolled, observer was still observing the section
	// hence unobserve it for performance issues
	observer.unobserve(entry.target); // notice use of observer from fn param rather than using sectionObserver
};

const sectionObserver = new IntersectionObserver(revealSection, {
	root: null,
	threshold: 0.15, // notice
});

document.querySelectorAll('.section').forEach(section => {
	// add classLists initially to all the sections
	section.classList.add('section--hidden');
	// observe multiple sections
	sectionObserver.observe(section);
});

// =====================================================================

// Lazy loading images

// default images in the HTML are the
// really small (lazy) versions of the actual image (find digital-lazy)
// they have a blur effect applied through CSS on the lazy-img class
// img elem has a data src defined, which is the actual image

// you might notice that the first entry gets fired a bit early
// this is because the section is translateY to the bottom by section--hidden
// to implement the reveal effect
const lazyLoadImg = function (entries) {
	const [entry] = entries;
	if (!entry.isIntersecting) return;

	entry.target.src = entry.target.dataset.src; // (1)
	// entry.target.classList.remove('lazy-img');

	// use slow 3G and observe that when the src is changed by (1)
	// the browser loads the new image in the background
	// but since the blur effect is already removed (due to removal of lazy-img)
	// the original lazy image is shown without the blurr effect
	// which looks bad

	// hence remove the blur effect after the image has loaded
	// the load event is fired after loading the new image
	entry.target.addEventListener('load', function () {
		entry.target.classList.remove('lazy-img');
	});
};

const featureImgObserver = new IntersectionObserver(lazyLoadImg, {
	root: null,
	threshold: 0,
	// rootMargin: '200px', // use unknown
});

document.querySelectorAll('.features__img').forEach(img => featureImgObserver.observe(img));

// =====================================================================

// Slider component

// there is a slider component which contains different slide components
// each slide component slides using relevant translateX
// slide 0 has translateX (0%), slide 1 has 100%, slide 2 has 200% and so on
// if we slide right, 0: -100%, 1: 0% and so on

// ===============================

// used below stuff for development purpose:
// find and comment this line in the script above: // section.classList.add('section--hidden');
// const slider = document.querySelector('.slider');
// slider.style.transform = 'scale(0.4) translateX(-500px)';
// slider.style.overflow = 'visible';

// ===============================

const slides = document.querySelectorAll('.slide');

const goToSlide = function (currSlide) {
	slides.forEach((s, i) => (s.style.transform = `translateX(${100 * (i - currSlide)}%)`));
};

let currSlide = 0;
goToSlide(currSlide); // initially on page load

const sliderBtnLeft = document.querySelector('.slider__btn--left');
const sliderBtnRight = document.querySelector('.slider__btn--right');

sliderBtnLeft.addEventListener('click', function () {
	currSlide = (currSlide - 1 + slides.length) % slides.length;
	goToSlide(currSlide);
});

sliderBtnRight.addEventListener('click', function () {
	currSlide = (currSlide + 1) % slides.length;
	goToSlide(currSlide);
});

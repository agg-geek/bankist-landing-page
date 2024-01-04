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
const initialSection1Rect = section1.getBoundingClientRect();

window.addEventListener('scroll', function () {
	if (window.scrollY > initialSection1Rect.top) {
		// console.log('Below section1, navbar should be stuck');
		navbar.classList.add('sticky');
	} else {
		// console.log('Above section1, navbar should not be stuck');
		navbar.classList.remove('sticky');
	}
});

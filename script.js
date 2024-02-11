'use strict';

// MODAL
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (evt) {
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
// SCROLL-TO BUTTONS

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function () {
	section1.scrollIntoView({ behavior: 'smooth' });
});

// =====================================================================
// NAVBAR LINKS SCROLL-TO

document.querySelector('.nav__links').addEventListener('click', function (e) {
	e.preventDefault();
	if (e.target.classList.contains('nav__link')) {
		const sectionId = e.target.getAttribute('href');
		document.querySelector(sectionId).scrollIntoView({ behavior: 'smooth' });
	}
});

// =====================================================================
// TABBED ELEMENT

const tabBtnContainer = document.querySelector('.operations__tab-container');
const tabBtns = document.querySelectorAll('.operations__tab');
const tabsContents = document.querySelectorAll('.operations__content');

tabBtnContainer.addEventListener('click', function (evt) {
	const clickedTabBtn = evt.target.closest('.operations__tab');

	if (!clickedTabBtn) return;

	tabBtns.forEach(tabBtn => tabBtn.classList.remove('operations__tab--active'));
	tabsContents.forEach(tabContent =>
		tabContent.classList.remove('operations__content--active')
	);

	clickedTabBtn.classList.add('operations__tab--active');

	const clickedTabNo = clickedTabBtn.dataset.tab;
	const clickedContent = document.querySelector(
		`.operations__content--${clickedTabNo}`
	);
	clickedContent.classList.add('operations__content--active');
});

// =====================================================================
// NAVBAR HOVER EFFECT

const navbar = document.querySelector('.nav');

const handleHover = function (evt) {
	const navlink = evt.target;
	if (!navlink.classList.contains('nav__link')) return;

	const navlinks = navlink.closest('.nav').querySelectorAll('.nav__link');
	const logo = navlink.closest('.nav').querySelector('img');

	navlinks.forEach(nl => nl !== navlink && (nl.style.opacity = this));
	logo.style.opacity = this;
};

navbar.addEventListener('mouseover', handleHover.bind(0.5));
navbar.addEventListener('mouseout', handleHover.bind(1));

// =====================================================================
// STICKY NAVBAR

const navbarHeight = navbar.getBoundingClientRect().height;
const stickyNav = function (entries) {
	const [entry] = entries;

	if (!entry.isIntersecting) navbar.classList.add('sticky');
	else navbar.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
	root: null,
	threshold: 0,
	rootMargin: `-${navbarHeight}px`,
});
headerObserver.observe(document.querySelector('.header'));

// =====================================================================
// REVEAL SECTION ON SCROLL

const revealSection = function (entries, observer) {
	const [entry] = entries;

	if (!entry.isIntersecting) return;

	entry.target.classList.remove('section--hidden');
	observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
	root: null,
	threshold: 0.15,
});

document.querySelectorAll('.section').forEach(section => {
	section.classList.add('section--hidden');
	sectionObserver.observe(section);
});

// =====================================================================
// LAZY LOAD IMAGES

const lazyLoadImg = function (entries) {
	const [entry] = entries;

	if (!entry.isIntersecting) return;

	entry.target.src = entry.target.dataset.src;
	entry.target.addEventListener('load', function () {
		entry.target.classList.remove('lazy-img');
	});
};

const featureImgObserver = new IntersectionObserver(lazyLoadImg, {
	root: null,
	threshold: 0,
});

document
	.querySelectorAll('.features__img')
	.forEach(img => featureImgObserver.observe(img));

// =====================================================================
// SLIDER COMPONENT

const slides = document.querySelectorAll('.slide');
const dotsContainer = document.querySelector('.dots');

const goToSlide = function (currSlide) {
	slides.forEach(
		(s, i) => (s.style.transform = `translateX(${100 * (i - currSlide)}%)`)
	);
};

const createSlideDots = function () {
	for (let i = 0; i < slides.length; i++) {
		const dot = `<button class="dots__dot" data-slide="${i}"></button>`;
		dotsContainer.insertAdjacentHTML('beforeend', dot);
	}
};

const activateDot = function (slide) {
	document
		.querySelectorAll('.dots__dot')
		.forEach(dot => dot.classList.remove('dots__dot--active'));

	document
		.querySelector(`.dots__dot[data-slide="${slide}"]`)
		.classList.add('dots__dot--active');
};

const prevSlide = function () {
	currSlide = (currSlide - 1 + slides.length) % slides.length;
	goToSlide(currSlide);
	activateDot(currSlide);
};

const nextSlide = function () {
	currSlide = (currSlide + 1) % slides.length;
	goToSlide(currSlide);
	activateDot(currSlide);
};

let currSlide = 0;
const implementSlider = function () {
	goToSlide(currSlide);
	createSlideDots();
	activateDot(currSlide);
};

implementSlider();

document.querySelector('.slider__btn--left').addEventListener('click', prevSlide);
document.querySelector('.slider__btn--right').addEventListener('click', nextSlide);

document.addEventListener('keydown', function (e) {
	e.key === 'ArrowLeft' && prevSlide();
	e.key === 'ArrowRight' && nextSlide();
});

dotsContainer.addEventListener('click', function (evt) {
	if (!evt.target.classList.contains('dots__dot')) return;
	const { slide } = evt.target.dataset;
	goToSlide(slide);
	activateDot(slide);
});

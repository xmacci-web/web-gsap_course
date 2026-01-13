import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
import { ScrollSmoother } from 'gsap/ScrollSmoother.js';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default class Animation {
  constructor(element) {
    this.element = element;

    // Map available animations
    this.animationsList = {
      box: this.boxAnimation,
      flair: this.flairAnimation,
      skill: this.skillAnimation,
    };

    this.init();
  }

  init() {
    this.createSmoothScroll();
    this;
    this.runAnimation();
  }

  createSmoothScroll() {
    ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.2,
      effects: true,
    });
  }

  runAnimation() {
    const animationName = this.element.dataset.animation;
    console.log('Element:', this.element, 'animationName:', animationName);

    const animationFunc = this.animationsList[animationName];

    if (animationFunc) {
      animationFunc.call(this, this.element);
    } else {
      console.warn(`Animation "${animationName}" n'existe pas.`);
    }
  }

  // Example animations
  boxAnimation(el) {
    gsap.to(el, {
      y: -50,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });
  }

  flairAnimation(el) {
    const wrapper = document.querySelector('.js-wrapper_poke');

    // Set rotation origin to center
    gsap.set(el, {
      transformOrigin: '50% 50%',
    });

    // Timeline
    this.flairTimeline = gsap.timeline({
      paused: true,
      defaults: { ease: 'linear' },
    });

    // Function to update animation based on current width
    const updateAnimation = () => {
      const wrapperWidth = wrapper.getBoundingClientRect().width;
      const elWidth = el.getBoundingClientRect().width;
      gsap.set(el, { x: 0, rotation: 0 });
      // Clear previous tweens
      this.flairTimeline.clear();

      // Move from 0 to wrapperWidth - elWidth
      this.flairTimeline.to(el, {
        x: wrapperWidth - elWidth,
        rotation: 360,
        duration: 2,
      });
    };

    // Initialize animation
    updateAnimation();

    // Buttons
    const playBtn = document.querySelector('.js-play');
    const stopBtn = document.querySelector('.js-stop');
    const resumeBtn = document.querySelector('.js-resume');
    const reverseBtn = document.querySelector('.js-reverse');
    const restartBtn = document.querySelector('.js-restart');

    playBtn.addEventListener('click', () => this.flairTimeline.play());
    stopBtn.addEventListener('click', () => this.flairTimeline.pause());
    resumeBtn.addEventListener('click', () => this.flairTimeline.resume());
    reverseBtn.addEventListener('click', () => this.flairTimeline.reverse());
    restartBtn.addEventListener('click', () => this.flairTimeline.restart());

    // Update animation on window resize
    window.addEventListener('resize', () => {
      updateAnimation();
    });
  }
  skillAnimation(el) {
    const thumb = el.querySelector('.thumb span');
    const abbr = el.querySelector('abbr');
    const percent = parseInt(abbr.textContent);

    const animate = () => {
      const thumbWidth = el.querySelector('.thumb').offsetWidth;
      const abbrWidth = abbr.offsetWidth;

      // Thumb animation
      gsap.fromTo(
        thumb,
        { width: 0 },
        {
          width: percent + '%',
          duration: 2,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none',
            invalidateOnRefresh: true, // recalculates values on refresh
          },
        }
      );

      // Abbr animation
      gsap.fromTo(
        abbr,
        { x: 0 },
        {
          x: (thumbWidth * percent) / 100 - abbrWidth / 2,
          duration: 2,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
          },
        }
      );
    };

    animate();

    // Update on resize
    window.addEventListener('resize', () => {
      ScrollTrigger.refresh();
      animate();
    });
  }
}

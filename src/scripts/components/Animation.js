import { gsap, random } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
import { ScrollSmoother } from 'gsap/ScrollSmoother.js';
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
export default class Animation {
  constructor(element) {
    this.element = element;
    this.init();
  }

  init() {
    this.createSmoothScroll();

    // Run each animation only if the data attribute exists
    if ('box' in this.element.dataset) {
      this.boxAnimation();
    }

    if ('arrow' in this.element.dataset) {
      this.arrowAnimation();
    }

    if ('flair' in this.element.dataset) {
      this.flairAnimation();
    }

    if ('skill' in this.element.dataset) {
      this.skillAnimation();
    }
    if ('container' in this.element.dataset) {
      this.containerAnimation();
    }
  }

  createSmoothScroll() {
    ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.2,
      effects: true,
    });
  }

  // Box float animation
  boxAnimation() {
    gsap.to(this.element, {
      y: -40,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });
  }

  // Arrow pulse animation
  arrowAnimation() {
    const icons = this.element.querySelectorAll('.icon');

    gsap.to(icons, {
      y: 40,
      scaleX: 1.5,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      opacity: 0.9,
      stagger: { each: 0.9, from: 'random' },
      transformOrigin: 'center',
    });
  }

  // Flair animation (rotating element across wrapper)
  flairAnimation() {
    const wrapper = document.querySelector('.js-wrapper_poke');
    gsap.set(this.element, { transformOrigin: '50% 50%' });

    this.flairTimeline = gsap.timeline({
      paused: true,
      defaults: { ease: 'linear' },
    });

    const updateAnimation = () => {
      const wrapperWidth = wrapper.getBoundingClientRect().width;
      const elWidth = this.element.getBoundingClientRect().width;
      gsap.set(this.element, { x: 0, rotation: 0 });
      this.flairTimeline.clear();
      this.flairTimeline.to(this.element, {
        x: wrapperWidth - elWidth,
        rotation: 360,
        duration: 2,
      });
    };

    updateAnimation();

    // Optional control buttons
    const playBtn = document.querySelector('.js-play');
    const stopBtn = document.querySelector('.js-stop');
    const resumeBtn = document.querySelector('.js-resume');
    const reverseBtn = document.querySelector('.js-reverse');
    const restartBtn = document.querySelector('.js-restart');

    playBtn?.addEventListener('click', () => this.flairTimeline.play());
    stopBtn?.addEventListener('click', () => this.flairTimeline.pause());
    resumeBtn?.addEventListener('click', () => this.flairTimeline.resume());
    reverseBtn?.addEventListener('click', () => this.flairTimeline.reverse());
    restartBtn?.addEventListener('click', () => this.flairTimeline.restart());

    window.addEventListener('resize', updateAnimation);
  }

  // Skill bar animation
  skillAnimation() {
    const thumb = this.element.querySelector('.thumb span');
    const abbr = this.element.querySelector('abbr');
    const percent = parseInt(abbr.textContent);

    const animate = () => {
      const thumbWidth = this.element.querySelector('.thumb').offsetWidth;
      const abbrWidth = abbr.offsetWidth;

      gsap.fromTo(
        thumb,
        { width: 0 },
        {
          width: percent + '%',
          duration: 2,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: this.element,
            start: 'top 80%',
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
          },
        }
      );

      gsap.fromTo(
        abbr,
        { x: 0 },
        {
          x: (thumbWidth * percent) / 100 - abbrWidth / 2,
          duration: 2,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: this.element,
            start: 'top 80%',
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
          },
        }
      );
    };

    animate();

    window.addEventListener('resize', () => {
      ScrollTrigger.refresh();
      animate();
    });
  }

  containerAnimation(rows = 10, cols = 10) {
    this.element.innerHTML = '';
    const circles = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const circle = document.createElement('div');
        circle.classList.add('circle');
        circle.style.gridRowStart = r + 1;
        circle.style.gridColumnStart = c + 1;
        this.element.appendChild(circle);
        circles.push(circle);
      }
    }

    gsap.to(circles, {
      scale: 0.1,
      opacity: 0,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      stagger: {
        amount: 1,
        from: 'edges',
        grid: [rows, cols],
      },
    });
  }
}

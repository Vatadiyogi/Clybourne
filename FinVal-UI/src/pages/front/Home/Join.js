import React, { useEffect } from 'react';
import anime from 'animejs';
import laptop from '../../../assets/finimg/laptop.png';

const Join = () => {

  useEffect(() => {
    // Handle anime.js animations
    const elements = document.querySelectorAll('[data-anime]');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const animeConfig = JSON.parse(el.getAttribute('data-anime'));
          anime({
            targets: el,
            ...animeConfig,
          });
          observer.unobserve(el);
        }
      });
    });
    elements.forEach(el => {
      observer.observe(el);
    });
    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, []);

  useEffect(() => {
    // Handle fancy-text animations
    const fancyTextElements = document.querySelectorAll('[data-fancy-text]');
    fancyTextElements.forEach(el => {
      const fancyTextConfig = JSON.parse(el.getAttribute('data-fancy-text'));

      // Sample text animation - adjust this as needed
      const effect = fancyTextConfig.effect || 'wave';
      const duration = fancyTextConfig.duration || 2000;

      if (effect === 'wave') {
        const textArray = fancyTextConfig.string || [];
        anime({
          targets: el.querySelectorAll('span'),
          keyframes: textArray.flatMap((text, index) => [
            { opacity: [0, 1], translateY: [-10, 0], delay: (duration / textArray.length) * index },
            { opacity: [1, 0], translateY: [0, 10], delay: (duration / textArray.length) * (index + 0.5) }
          ]),
          duration: duration,
          easing: 'easeInOutSine',
          loop: true
        });
      }
    });
  }, []);

  return (
    <section className="big-section pt-60px bg-section-new" style={{ paddingBottom: "100px" }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 md-mb-15 xs-mb-22 position-relative" data-anime='{ "opacity": [0,1], "duration": 1000, "delay": 0, "staggervalue": 200, "easing": "easeOutQuad" }'>
            <div className="overflow-hidden position-relative">
              <img className="w-100" src={laptop} alt="" />
            </div>
          </div>

          <div className="col-lg-6 col-md-9 text-center text-lg-start" data-anime='{ "translate": [0, 0], "opacity": [0,1], "duration": 600, "delay": 100, "staggervalue": 150, "easing": "easeOutQuad" }'>
            <h2 className="alt-font fw-600 ls-minus-1px text-base-color lh-50 margin-8px">
              Our valuation platform will save you hard -earned &nbsp;
              <span className="mb-0 mx-auto" style={{ color: "#4ea8f6" }} data-fancy-text='{ "effect": "wave", "direction": "up", "string": [ "money", " time", "effort" ], "duration": 2000 }'></span>
            </h2>
            <p className="w-95 md-w-100 fs-16 lh-28" style={{ color: "#787777" }}>
              This is how we propose to assist you in effectively assessing your company. It's as easy as filling out a form, and can use it frequently to learn more about your company and entice investors.
            </p>
            <a href="/" className="btn btn-large btn-box-shadow fw-400 btn-round-edge" style={{ backgroundColor: "#4ea8f6", color: "white", padding: "14px 30px" }}>Joining with us</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Join;

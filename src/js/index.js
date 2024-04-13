import { register } from 'swiper/element/bundle';
import Swiper from 'swiper' 
import { Navigation, Pagination } from 'swiper/modules';

register();


// const opendrop = document.getElementsByClassName("nav-brands__item");
// opendrop.addEventListener("click", function() {
//     if (opendrop.classList.contains("drop-closed")) {
//       opendrop.classList.remove("drop-closed");
//     } else {
//       opendrop.classList.add("drop-closed");
//     }
// });





const triggerSwiper = new Swiper('.triggerSwiper', {
    slidesPerView: 1,
    pagination: {
        el: '.swiper-pagination',
      },
      modules: [Pagination],
  });

const popularSlider = new Swiper('.popularSlider', {
    slidesPerView: 4,
    spaceBetween: 30,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      modules: [Navigation],
  });

const counters = document.querySelectorAll('[data-counter]');
if (counters) {
  counters.forEach(counter => {
    counter.addEventListener('click', e => {
      const target = e.target;
      if (target.closest('.counter__button')){
        let value = parseInt(target.closest('.counter').querySelector('input').value)

        if(target.classList.contains('counter__button_plus')){
          value++;
        } else{
          --value;
        }
        if (value <=0 ){
          value = 0;
        }
        target.closest('.counter').querySelector('input').value = value;
      }
    })
  })
}
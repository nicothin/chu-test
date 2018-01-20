$( document ).ready(function() {

  if (window.isMobile !== undefined) {
    // console.log(isMobile);
    if(isMobile.any) {
      $(window).on('resize', function(){
        // посчитаем реальное значение высоты вьюпорта и покостылим :(
        var real100vh = window.innerHeight;
        console.log(real100vh);
        $('.page__slide-part').css({'min-height': real100vh});
        $('.page__slide-part--full-page-only, .swiper-slide, .swiper-container-coverflow').css({'height': real100vh});
      });
      $(window).trigger('resize');
    }
  }

  // будущий айСкролл
  var iScroll = {};

  // обойдем слайды и...
  $('.swiper-slide[id]').each(function() {

    // определим ID слайда
    var id = $(this).attr('id');

    // включим айСкролл
    iScroll[id] = new IScroll('#'+id, {
      scrollX: false,
      scrollY: true,
      scrollbars: true,
      mouseWheel: true,
      interactiveScrollbars: true,
      deceleration: 0.002,
    });

    // начнем следить за скроллом
    iScroll[id].on('scrollEnd', function(){
      var scrollY = this.y;
      var scrollDirection = this.directionY;
      $('#'+id+' .page__slide-part').each(function(){
        // если скроллим вниз
        if( scrollDirection === 1 ) {
          // этот блок виден на странице сейчас, следующий за ним блок существует и тоже виден? УПРТ.
          if(checkShownSliderPart(this, scrollY) && $(this).next().length && checkShownSliderPart($(this).next(), scrollY)) {
            var nextBlockTop = Math.round($(this).next().position().top + scrollY);
            var criticalLine = window.innerHeight - window.innerHeight / 4;
            // верх следующего блока уже выше нижней четверти высоты вьюпорта?
            if(nextBlockTop < criticalLine) {
              // мотаем к следующему
              var targetPart = $(this).next().index() + 1;
              iScroll[id].scrollToElement(document.querySelector('#'+id+' .page__slide-part:nth-child('+targetPart+')'), 800);
            }
            else {
              // мотаем так, чтобы низ первого из видимых совпал с низом вьюпорта
              var targetPosition = Math.round($(this).position().top + $(this).outerHeight() - window.innerHeight) * -1;
              iScroll[id].scrollTo(0, targetPosition, 800);
            }
            return false;
          }
        }
        // если скроллим вверх
        else {
          // этот блок виден на странице сейчас, следующий за ним блок существует и тоже виден? УПРТ.
          if(checkShownSliderPart(this, scrollY) && $(this).next().length && checkShownSliderPart($(this).next(), scrollY)) {
            var thisBlockBottom = Math.round($(this).position().top + $(this).outerHeight() + scrollY);
            var criticalLine = window.innerHeight / 4;
            // нижняя граница первого видимого блока ниже первой четверти высоты вьюпорта, но не ниже нижней границы вьюпорта?
            if((thisBlockBottom > criticalLine && thisBlockBottom < window.innerHeight)) {
              // мотаем так, чтобы низ первого из видимых совпал с низом вьюпорта
              var targetPosition = Math.round($(this).position().top + $(this).outerHeight() - window.innerHeight) * -1;
              iScroll[id].scrollTo(0, targetPosition, 800);
            }
            // нижняя граница первого видимого блока ниже верхней границы вьюпорта, но не ниже первой четверти высоты вьюпорта?
            else if(thisBlockBottom > 0 && thisBlockBottom < (window.innerHeight / 4)) {
              // мотаем к верхней границе следующего
              var targetPart = $(this).next().index() + 1;
              iScroll[id].scrollToElement(document.querySelector('#'+id+' .page__slide-part:nth-child('+targetPart+')'), 800);
            }
            return false;
          }
        }
      });
    });

    // добавим data-hash атрибуты (для слайдера) на основе id слайда (нужны Swiper-у)
    $(this).attr('data-hash', id);

    // добавим фоновые цвета на слайды
    var slideBgColor = $(this).data('bg-color');
    if(slideBgColor) $(this).css({backgroundColor: slideBgColor});

  });

  // нужно подновить скролл на мобилках по ресайзу (повороту)
  if (window.isMobile !== undefined) {
    if(isMobile.any) {
      $(window).on('resize', function(){
        $('.swiper-slide[id]').each(function() {
          var id = $(this).attr('id');
          iScroll[id].refresh().dispatchEvent('scrollEnd');
        });
      });
    }
  }

  // включаем главную карусель
  var pageSwiper = new Swiper('#page-slider', {
    effect: 'coverflow',
    hashNavigation: {
      watchState: true,
    },
    speed: 300,
    spaceBetween: 10,
    coverflowEffect: {
      rotate: 30,
      slideShadows: false,
    },
    init: false,
  });

  // при инициализации главной карусели...
  pageSwiper.on('init', function() {

    // заменим метаданные (пока только title)
    metaDataChange();

    // сменим фоновый цвет страницы
    var pageNewBgColor = $('.swiper-slide-active').data('bg-color');
    if(!pageNewBgColor) pageNewBgColor = '#fff';
    pageBgColorChange(pageNewBgColor);
  });

  // инициализируем главную карусель
  pageSwiper.init();

  // по окончанию смены слайда главной карусели...
  pageSwiper.on('slideChangeTransitionEnd', function () { //console.log(this);

    // промотаем во всех прочих слайдах скролл вверх
    // $('.baron.swiper-slide[id]:not(:eq('+this.activeIndex+')) .baron__scroller').scrollTop(0);

    // заменим метаданные (пока только title)
    metaDataChange();

  });

  // в момент смены слайда главной карусели...
  pageSwiper.on('slideChange', function () { // console.log(this);

    // сменим фоновый цвет страницы
    var pageNewBgColor = $('.swiper-slide:eq('+this.activeIndex+')').data('bg-color');
    if(!pageNewBgColor) pageNewBgColor = '#fff';
    pageBgColorChange(pageNewBgColor);

  });



  /**
   * Меняет метаданные страницы (загрузка, смена слайда...)
   */
  function metaDataChange() {
    $('title').text( $('.swiper-slide-active').data('title') );
  }

  /**
   * Меняет фоновый цвет страницы
   * @param  {string} color фоновый цвет
   */
  function pageBgColorChange(color) {
    $('body').css({backgroundColor: color});
  }

  /**
   * Проверяет видимость во вьюпорте переданной части слайда
   * @param  {jquery object} block  проверяемая часть
   * @param  {int} scroll           скролл на момент проверки
   * @return {bool}                 истина, если часть сейчас видима на экране
   */
  function checkShownSliderPart(block, scroll) {
    var innerBlockTop = Math.round($(block).position().top);
    var innerBlockBottom = Math.round($(block).position().top + $(block).outerHeight());
    var viewportHeight = window.innerHeight;
    if(
      (innerBlockTop + scroll) <= viewportHeight // верхняя граница блока выше низа вьюпорта
      &&
      (innerBlockBottom + scroll) > 0 // нижняя граница блока ниже верха вьюпорта
    ) {
      return true;
    }
    else return false;
  }

  // ref https://github.com/WICG/EventListenerOptions/pull/30
  function isPassive() {
    var supportsPassiveOption = false;
    try {
      addEventListener("test", null, Object.defineProperty({}, 'passive', {
        get: function () {
          supportsPassiveOption = true;
        }
      }));
    } catch(e) {}
    return supportsPassiveOption;
  }

  document.addEventListener('touchmove', function (e) { e.preventDefault(); }, isPassive() ? {
    capture: false,
    passive: false
  } : false);
});

$( document ).ready(function() {

  // будущий айСкролл
  var iScroll = {};

  // обойдем слайды и...
  $('.swiper-slide[id]').each(function() {

    // определим ID слайда
    var id = $(this).attr('id');

    // включим айСкролл
    iScroll[id] = new IScroll('#'+id, {
      scrollX: false,
      scrollX: true,
      scrollbars: true,
      mouseWheel: true,
      interactiveScrollbars: true,
    });

    // начнем следить за скроллом
    iScroll[id].on('scrollEnd', function(){
      var scrollY = this.y;
      var scrollDirection = this.directionY;   console.log('direction: '+scrollDirection);
      // iScroll[id].scrollToElement(document.querySelector('#'+id+' .page__slide-part:nth-child(2)'));
      var viewportHeight = $('body').outerHeight();
      $('#'+id+' .page__slide-part').each(function(){
        var innerBlockTop = $(this).position().top; // console.log(innerBlockTop);
        console.log('позиция верхней границы блока '+$(this).index()+' '+Math.round(innerBlockTop + scrollY));
        if(Math.round(innerBlockTop + scrollY) <= (viewportHeight - viewportHeight / 3)) console.log('верхняя граница блок '+$(this).index()+' выше низа вьюпорта + 30% высоты');
      });
      console.log(' ');
    });

    // добавим data-hash атрибуты (для слайдера) на основе id слайда (нужны Swiper-у)
    $(this).attr('data-hash', id);

    // добавим фоновые цвета на слайды
    var slideBgColor = $(this).data('bg-color');
    if(slideBgColor) $(this).css({backgroundColor: slideBgColor});

  });

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

});

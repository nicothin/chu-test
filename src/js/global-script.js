$( document ).ready(function() {

  // свойства кастомного скролла: общие для всех сладов
  var baronStaticSettings = {
    scroller: '.baron__scroller',
    bar: '.baron__bar',
    scrollingCls: 'baron--scrolling',
    draggingCls: 'baron--dragging',
    barOnCls: 'baron--scrollbar',
  };

  // обойдем слайды и...
  $('.baron.swiper-slide[id]').each(function() {

    // добавим data-hash атрибуты (для слайдера) на основе id слайда
    $(this).attr('data-hash', $(this).attr('id'));

    // включим кастомный скролл
    var baronThisSettings = {root: '#' + $(this).attr('id')}
    $.extend(baronThisSettings, baronStaticSettings);
    baron(baronThisSettings);

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

  // заменим метаданные (пока только title, ТОЛЬКО после включения галереи)
  metaDataChange();

  // по окончанию смены слайда главной карусели...
  pageSwiper.on('slideChangeTransitionEnd', function () { //console.log(this);

    // промотаем во всех прочих слайдах скролл вверх
    $('.baron.swiper-slide[id]:not(:eq('+this.activeIndex+')) .baron__scroller').scrollTop(0);

    // заменим метаданные (пока только title)
    metaDataChange();

  });

  // при смене слайда главной карусели...
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

});

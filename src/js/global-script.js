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

  // по окончанию смены слайда главной карусели...
  pageSwiper.on('slideChangeTransitionEnd', function () { //console.log(this);

    // промотаем во всех прочих слайдах скролл вверх
    $('.baron.swiper-slide[id]:not(:eq('+this.activeIndex+')) .baron__scroller').scrollTop(0);

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

  // ВРЕМЕННО
  $('.page__slide-part').each(function(){
    $(this).find('h1').prepend('scroll: ' + Math.round($(this).position().top) + ' ');
  });

  // по скроллу в каждом конкретном слайде...
  var t0;
  $('.baron__scroller').each(function(){
    var thisBlock = $(this);
    thisBlock.on('scroll', function(){
      clearTimeout(t0);
      t0 = setTimeout(function () {
          var innerBlocks = $(thisBlock).find('.page__slide-part');
          var viewportTop = 0;
          var viewportBottom = $('body').outerHeight();
          // обойдем все вложенные части слайда
          for (var i = 0; i < innerBlocks.length; i++) {
            var innerBlockTop = $(innerBlocks[i]).offset().top;
            var innerBlockBottom = $(innerBlocks[i]).offset().top + $(innerBlocks[i]).outerHeight();
            // эта часть слайда не видна во вьюпорте
            if(innerBlockBottom <= viewportTop || innerBlockTop >= viewportBottom){}
            // эта часть слайда видна во вьюпорте
            else {
              var targetBlockIndex = 0;
              // если низ первой видимой части выше середины вьюпорта
              if(innerBlockBottom <= $('body').outerHeight() / 2) {
                targetBlockIndex = i + 1;
                // console.log('тянуть к блоку '+targetBlockIndex+' вниз');
                var scrollTraget = Math.round($(innerBlocks[targetBlockIndex]).offset().top + $(thisBlock).scrollTop());
                $(thisBlock).animate({scrollTop:scrollTraget}, 300);
              }
              // если низ первой видимой части ниже середины вьюпорта
              else {
                targetBlockIndex = i;
                if($(innerBlocks[targetBlockIndex]).is('class'));
                // console.log('тянуть к блоку '+targetBlockIndex+' вверх');
                var scrollTraget = Math.round($(innerBlocks[targetBlockIndex]).offset().top + $(thisBlock).scrollTop());
                $(thisBlock).animate({scrollTop:scrollTraget}, 300);
              }
              // выходим из цикла, нужен анализ лишь первой видимой части слайда
              break;
            }
          }
        }, 50);
    });
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

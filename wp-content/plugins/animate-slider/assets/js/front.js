jQuery(document).ready(function($){

	if($('.as-slider').length > 0 ) {

		$('.as-slider').each(function(){

			var cap = $(this).find('.as-slide-caption');
			var img = $(this).find('.as-slide-image');

			cap.each(function(){
				var cap_h = $(this).outerHeight();
				var cap_more_h = 0;
				if($(this).find('.as-slide-more').length > 0 ){
					cap_more_h += 49;
				}
				$(this).css({
					'top' : '50%',
					'margin-top' : -((cap_h - cap_more_h) / 2) 
				});
			});
			
			$(this).bxSlider({
				slideSelector: '.as-slide-item',
				pager: false,
				controls: true,
				nextSelector: "#" + $(this).parent().find('.as-slider-control').attr('id'),
				prevSelector: "#" + $(this).parent().find('.as-slider-control').attr('id'),
				autoStart: false,
				mode: 'fade',
				nextText: '<i class="fa-chevron-right"></i>',
				prevText: '<i class="fa-chevron-left"></i>',
				adaptiveHeight: true,
				onSliderLoad: function( index ) {
					$(this.slideSelector).eq(index).delay(80).queue(function(){
						$(this).addClass('active');
						$(this).dequeue();
					});
					var img = $(this.slideSelector).eq(index).find('.as-slide-image');
					img.each(function(){
						var img_h = $(this).parents('.as-slide-item').outerHeight();
						$(this).css({
							'line-height': img_h + 'px'
						})
					});
				},
				onSlideBefore: function($elem, oldI, newI){
					$(this.slideSelector).eq(oldI).removeClass('active');
					var img = $(this.slideSelector).eq(newI).find('.as-slide-image');
					img.each(function(){
						var img_h = $(this).parents('.as-slide-item').outerHeight();
						$(this).css({
							'line-height': img_h + 'px'
						})
					});

				},
				onSlideAfter: function($elem, oldI, newI){
					$(this.slideSelector).eq(newI).addClass('active');
					var img = $(this.slideSelector).eq(newI).find('.as-slide-image');
					img.each(function(){
						var img_h = $(this).parents('.as-slide-item').outerHeight();
						$(this).css({
							'line-height': img_h + 'px'
						})
					});
				}
			});
		});
	}

});
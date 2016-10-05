(function($){
	$.fn.tzSelect = function(options){
		options = $.extend({
			render : function(option){
				return $('<li>',{
					html : option.text()
				});
			},
			className : ''
		},options);
		
		return this.each(function(){
			var select = $(this);
		
			var selectBoxContainer = $('<div>',{
				width		: select.outerWidth(),
				className	: 'tzSelect',
				html		: '<div class="selectBox"></div>'
			});
		
			var dropDown = $('<ul>',{className:'dropDown'});
			var selectBox = selectBoxContainer.find('.selectBox');
			if(options.className){
				dropDown.addClass(options.className);
			}
			
			select.find('option').each(function(i){
				var option = $(this);
		
				if(i==select.attr('selectedIndex')){
					selectBox.html(option.text());
				}
				if(option.data('skip')){
					return true;
				}
				
				var li = options.render(option);

				li.click(function(){
					
					selectBox.html(option.text());
					dropDown.trigger('hide');
					select.val(option.val());
					
					return false;
				});
		
				dropDown.append(li);
			});
			
			selectBoxContainer.append(dropDown.hide());
			select.hide().after(selectBoxContainer);
			dropDown.bind('show',function(){
				
				if(dropDown.is(':animated')){
					return false;
				}
				
				selectBox.addClass('expanded');
				dropDown.slideDown();
				
			}).bind('hide',function(){
				
				if(dropDown.is(':animated')){
					return false;
				}
				
				selectBox.removeClass('expanded');
				dropDown.slideUp();
				
			}).bind('toggle',function(){
				if(selectBox.hasClass('expanded')){
					dropDown.trigger('hide');
				}
				else dropDown.trigger('show');
			});
			
			selectBox.click(function(){
				dropDown.trigger('toggle');
				return false;
			});
			$(document).click(function(){
				dropDown.trigger('hide');
			});

		});
	}
	
	$.fn.tzSelect2 = function(options){
		options = $.extend({
			render : function(option){
				return $('<li>',{
					html : option.text()
				});
			},
			className : ''
		},options);
		
		return this.each(function(){
			var select = $(this);
		
			var selectBoxContainer = $('<div>',{
				width		: select.outerWidth(),
				className	: 'tzSelect2',
				html		: '<div class="selectBox"></div>'
			});
		
			var dropDown = $('<ul>',{className:'dropDown'});
			var selectBox = selectBoxContainer.find('.selectBox');
			if(options.className){
				dropDown.addClass(options.className);
			}
			
			select.find('option').each(function(i){
				var option = $(this);
		
				if(i==select.attr('selectedIndex')){
					selectBox.html(option.text());
				}
				if(option.data('skip')){
					return true;
				}
				
				var li = options.render(option);

				li.click(function(){
					
					selectBox.html(option.text());
					dropDown.trigger('hide');
					select.val(option.val());
					
					return false;
				});
		
				dropDown.append(li);
			});
			
			selectBoxContainer.append(dropDown.hide());
			select.hide().after(selectBoxContainer);
			dropDown.bind('show',function(){
				
				if(dropDown.is(':animated')){
					return false;
				}
				
				selectBox.addClass('expanded');
				dropDown.slideDown();
				
			}).bind('hide',function(){
				
				if(dropDown.is(':animated')){
					return false;
				}
				
				selectBox.removeClass('expanded');
				dropDown.slideUp();
				
			}).bind('toggle',function(){
				if(selectBox.hasClass('expanded')){
					dropDown.trigger('hide');
				}
				else dropDown.trigger('show');
			});
			
			selectBox.click(function(){
				dropDown.trigger('toggle');
				return false;
			});
			$(document).click(function(){
				dropDown.trigger('hide');
			});

		});
	}
	
	$.fn.tzSelect3 = function(options){
		options = $.extend({
			render : function(option){
				return $('<li>',{
					html : option.text()
				});
			},
			className : ''
		},options);
		
		return this.each(function(){
			var select = $(this);
		
			var selectBoxContainer = $('<div>',{
				width		: select.outerWidth(),
				className	: 'tzSelect3',
				html		: '<div class="selectBox"></div>'
			});
		
			var dropDown = $('<ul>',{className:'dropDown'});
			var selectBox = selectBoxContainer.find('.selectBox');
			if(options.className){
				dropDown.addClass(options.className);
			}
			
			select.find('option').each(function(i){
				var option = $(this);
		
				if(i==select.attr('selectedIndex')){
					selectBox.html(option.text());
				}
				if(option.data('skip')){
					return true;
				}
				
				var li = options.render(option);

				li.click(function(){
					
					selectBox.html(option.text());
					dropDown.trigger('hide');
					select.val(option.val());
					
					return false;
				});
		
				dropDown.append(li);
			});
			
			selectBoxContainer.append(dropDown.hide());
			select.hide().after(selectBoxContainer);
			dropDown.bind('show',function(){
				
				if(dropDown.is(':animated')){
					return false;
				}
				
				selectBox.addClass('expanded');
				dropDown.slideDown();
				
			}).bind('hide',function(){
				
				if(dropDown.is(':animated')){
					return false;
				}
				
				selectBox.removeClass('expanded');
				dropDown.slideUp();
				
			}).bind('toggle',function(){
				if(selectBox.hasClass('expanded')){
					dropDown.trigger('hide');
				}
				else dropDown.trigger('show');
			});
			
			selectBox.click(function(){
				dropDown.trigger('toggle');
				return false;
			});
			$(document).click(function(){
				dropDown.trigger('hide');
			});

		});
	}	
	$.fn.tzSelect4 = function(options){
		options = $.extend({
			render : function(option){
				return $('<li>',{
					html : option.text()
				});
			},
			className : ''
		},options);
		
		return this.each(function(){
			var select = $(this);
		
			var selectBoxContainer = $('<div>',{
				width		: select.outerWidth(),
				className	: 'tzSelect4',
				html		: '<div class="selectBox"></div>'
			});
		
			var dropDown = $('<ul>',{className:'dropDown'});
			var selectBox = selectBoxContainer.find('.selectBox');
			if(options.className){
				dropDown.addClass(options.className);
			}
			
			select.find('option').each(function(i){
				var option = $(this);
		
				if(i==select.attr('selectedIndex')){
					selectBox.html(option.text());
				}
				if(option.data('skip')){
					return true;
				}
				
				var li = options.render(option);

				li.click(function(){
					
					selectBox.html(option.text());
					dropDown.trigger('hide');
					select.val(option.val());
					
					return false;
				});
		
				dropDown.append(li);
			});
			
			selectBoxContainer.append(dropDown.hide());
			select.hide().after(selectBoxContainer);
			dropDown.bind('show',function(){
				
				if(dropDown.is(':animated')){
					return false;
				}
				
				selectBox.addClass('expanded');
				dropDown.slideDown();
				
			}).bind('hide',function(){
				
				if(dropDown.is(':animated')){
					return false;
				}
				
				selectBox.removeClass('expanded');
				dropDown.slideUp();
				
			}).bind('toggle',function(){
				if(selectBox.hasClass('expanded')){
					dropDown.trigger('hide');
				}
				else dropDown.trigger('show');
			});
			
			selectBox.click(function(){
				dropDown.trigger('toggle');
				return false;
			});
			$(document).click(function(){
				dropDown.trigger('hide');
			});

		});
	}	
	$.fn.tzSelect5 = function(options){
		options = $.extend({
			render : function(option){
				return $('<li>',{
					html : option.text()
				});
			},
			className : ''
		},options);
		
		return this.each(function(){
			var select = $(this);
		
			var selectBoxContainer = $('<div>',{
				width		: select.outerWidth(),
				className	: 'tzSelect5',
				html		: '<div class="selectBox"></div>'
			});
		
			var dropDown = $('<ul>',{className:'dropDown'});
			var selectBox = selectBoxContainer.find('.selectBox');
			if(options.className){
				dropDown.addClass(options.className);
			}
			
			select.find('option').each(function(i){
				var option = $(this);
		
				if(i==select.attr('selectedIndex')){
					selectBox.html(option.text());
				}
				if(option.data('skip')){
					return true;
				}
				
				var li = options.render(option);

				li.click(function(){
					
					selectBox.html(option.text());
					dropDown.trigger('hide');
					select.val(option.val());
					
					return false;
				});
		
				dropDown.append(li);
			});
			
			selectBoxContainer.append(dropDown.hide());
			select.hide().after(selectBoxContainer);
			dropDown.bind('show',function(){
				
				if(dropDown.is(':animated')){
					return false;
				}
				
				selectBox.addClass('expanded');
				dropDown.slideDown();
				
			}).bind('hide',function(){
				
				if(dropDown.is(':animated')){
					return false;
				}
				
				selectBox.removeClass('expanded');
				dropDown.slideUp();
				
			}).bind('toggle',function(){
				if(selectBox.hasClass('expanded')){
					dropDown.trigger('hide');
				}
				else dropDown.trigger('show');
			});
			
			selectBox.click(function(){
				dropDown.trigger('toggle');
				return false;
			});
			$(document).click(function(){
				dropDown.trigger('hide');
			});

		});
	}
	$.fn.tzSelect6 = function(options){
		options = $.extend({
			render : function(option){
				return $('<li>',{
					html : option.text()
				});
			},
			className : ''
		},options);
		
		return this.each(function(){
			var select = $(this);
		
			var selectBoxContainer = $('<div>',{
				width		: select.outerWidth(),
				className	: 'tzSelect6',
				html		: '<div class="selectBox"></div>'
			});
		
			var dropDown = $('<ul>',{className:'dropDown'});
			var selectBox = selectBoxContainer.find('.selectBox');
			if(options.className){
				dropDown.addClass(options.className);
			}
			
			select.find('option').each(function(i){
				var option = $(this);
		
				if(i==select.attr('selectedIndex')){
					selectBox.html(option.text());
				}
				if(option.data('skip')){
					return true;
				}
				
				var li = options.render(option);

				li.click(function(){
					
					selectBox.html(option.text());
					dropDown.trigger('hide');
					select.val(option.val());
					
					return false;
				});
		
				dropDown.append(li);
			});
			
			selectBoxContainer.append(dropDown.hide());
			select.hide().after(selectBoxContainer);
			dropDown.bind('show',function(){
				
				if(dropDown.is(':animated')){
					return false;
				}
				
				selectBox.addClass('expanded');
				dropDown.slideDown();
				
			}).bind('hide',function(){
				
				if(dropDown.is(':animated')){
					return false;
				}
				
				selectBox.removeClass('expanded');
				dropDown.slideUp();
				
			}).bind('toggle',function(){
				if(selectBox.hasClass('expanded')){
					dropDown.trigger('hide');
				}
				else dropDown.trigger('show');
			});
			
			selectBox.click(function(){
				dropDown.trigger('toggle');
				return false;
			});
			$(document).click(function(){
				dropDown.trigger('hide');
			});

		});
	}	
	
})(jQuery);
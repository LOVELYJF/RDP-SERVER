!function(i){i.fn.extend({autoScroll:function(){return this.each(function(){var n=i(this).find(".kgo-scroll-body-ul");!function i(){n.animate({"margin-top":-n.find("li:first").height()+"px","margin-bottom":n.find("li:first").height()+"px"},1500,"linear",function(){n.css({"margin-top":"0px","margin-bottom":"0px"}).find("li:first").appendTo(n),i()})}()})},stopScroll:function(){i(this).find(".kgo-scroll-body-ul").stop(!0)}})}(jQuery);
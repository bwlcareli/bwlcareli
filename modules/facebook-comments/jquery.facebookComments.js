(function ($) {
    
	var methods = {
	
		init: function (strSettings) {
			var s = JSON.parse(strSettings),
				ctx = $(this),
				tabs = ctx.closest('.ui-tabs').first();
				
			function fbCommentInit(parse)  {
				if (ctx.is(':visible') && ctx.html().length <= 0) {
					//console.log('fb comment init');
					ctx.html(
						_.format('<fb:comments migrated="1" title="{0}" xid="{1}" migrate="1" canpost="{2}" simple="{3}" numposts="{4}" publish_feed="{5}" reverse="{6}" href="{7}"{8}><\/fb:comments>',
							s.fbTitle, s.fbXid, s.canPost, s.appSimple, s.commentsNumPosts, s.commentsPublishFeed, s.commentsReverse, location.href,
							_.setAttr('width', s.appWidth > 0 ? s.appWidth : null))
					);
					
					if (parse) {
						FB.XFBML.parse(ctx.get(0));
					}
					return true;
				}
				return false;
			}
			
			if (!fbCommentInit(false)) {
				$(document).bind('smpanelshow', function(evt, id, ui) {
					fbCommentInit(true);
				});			
			}			
			return this;
		}

	};  // methods
	
	$.fn.facebookComments = function (method) {		// plugin main
		if (methods[method])
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));

		if (typeof method === 'object' || !method)
			return methods.init.apply(this, arguments);

		$.error('Method ' + method + ' does not exist on jQuery.facebookComments');
		return null;
	};

})(jQuery);

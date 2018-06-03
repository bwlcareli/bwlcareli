/*
 * Metadata - jQuery plugin for parsing metadata from elements
 *
 * Copyright (c) 2006 John Resig, Yehuda Katz, Jï¿½Ã¶rn Zaefferer, Paul McLanahan
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Revision: $Id: jquery.metadata.js 4187 2007-12-16 17:15:27Z joern.zaefferer $
 *
 */

/**
 * Sets the type of metadata to use. Metadata is encoded in JSON, and each property
 * in the JSON will become a property of the element itself.
 *
 * There are three supported types of metadata storage:
 *
 *   attr:  Inside an attribute. The name parameter indicates *which* attribute.
 *          
 *   class: Inside the class attribute, wrapped in curly braces: { }
 *   
 *   elem:  Inside a child element (e.g. a script tag). The
 *          name parameter indicates *which* element.
 *          
 * The metadata for an element is loaded the first time the element is accessed via jQuery.
 *
 * As a result, you can define the metadata type, use $(expr) to load the metadata into the elements
 * matched by expr, then redefine the metadata type and run another $(expr) for other elements.
 * 
 * @name $.metadata.setType
 *
 * @example <p id="one" class="some_class {item_id: 1, item_label: 'Label'}">This is a p</p>
 * @before $.metadata.setType("class")
 * @after $("#one").metadata().item_id == 1; $("#one").metadata().item_label == "Label"
 * @desc Reads metadata from the class attribute
 * 
 * @example <p id="one" class="some_class" data="{item_id: 1, item_label: 'Label'}">This is a p</p>
 * @before $.metadata.setType("attr", "data")
 * @after $("#one").metadata().item_id == 1; $("#one").metadata().item_label == "Label"
 * @desc Reads metadata from a "data" attribute
 * 
 * @example <p id="one" class="some_class"><script>{item_id: 1, item_label: 'Label'}</script>This is a p</p>
 * @before $.metadata.setType("elem", "script")
 * @after $("#one").metadata().item_id == 1; $("#one").metadata().item_label == "Label"
 * @desc Reads metadata from a nested script element
 * 
 * @param String type The encoding type
 * @param String name The name of the attribute to be used to get metadata (optional)
 * @cat Plugins/Metadata
 * @descr Sets the type of encoding to be used when loading metadata for the first time
 * @type undefined
 * @see metadata()
 */

(function($) {

$.extend({
	metadata : {
		defaults : {
			type: 'class',
			name: 'metadata',
			cre: /({.*})/,
			single: 'metadata'
		},
		setType: function( type, name ){
			this.defaults.type = type;
			this.defaults.name = name;
		},
		get: function( elem, opts ){
			var settings = $.extend({},this.defaults,opts);
			// check for empty string in single property
			if ( !settings.single.length ) settings.single = 'metadata';
			
			var data = $.data(elem, settings.single);
			// returned cached data if it already exists
			if ( data ) return data;
			
			data = "{}";
			
			if ( settings.type == "class" ) {
				var m = settings.cre.exec( elem.className );
				if ( m )
					data = m[1];
			} else if ( settings.type == "elem" ) {
				if( !elem.getElementsByTagName )
					return undefined;
				var e = elem.getElementsByTagName(settings.name);
				if ( e.length )
					data = $.trim(e[0].innerHTML);
			} else if ( elem.getAttribute != undefined ) {
				var attr = elem.getAttribute( settings.name );
				if ( attr )
					data = attr;
			}
			
			if ( data.indexOf( '{' ) <0 )
			data = "{" + data + "}";
			
			data = eval("(" + data + ")");
			
			$.data( elem, settings.single, data );
			return data;
		}
	}
});

/**
 * Returns the metadata object for the first member of the jQuery object.
 *
 * @name metadata
 * @descr Returns element's metadata object
 * @param Object opts An object contianing settings to override the defaults
 * @type jQuery
 * @cat Plugins/Metadata
 */
$.fn.metadata = function( opts ){
	return $.metadata.get( this[0], opts );
};

})(jQuery);
/**
 * jQuery.ScrollTo - Easy element scrolling using jQuery.
 * Copyright (c) 2007-2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 5/25/2009
 * @author Ariel Flesler
 * @version 1.4.2
 *
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 */
;(function(d){var k=d.scrollTo=function(a,i,e){d(window).scrollTo(a,i,e)};k.defaults={axis:'xy',duration:parseFloat(d.fn.jquery)>=1.3?0:1};k.window=function(a){return d(window)._scrollable()};d.fn._scrollable=function(){return this.map(function(){var a=this,i=!a.nodeName||d.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!i)return a;var e=(a.contentWindow||a).document||a.ownerDocument||a;return d.browser.safari||e.compatMode=='BackCompat'?e.body:e.documentElement})};d.fn.scrollTo=function(n,j,b){if(typeof j=='object'){b=j;j=0}if(typeof b=='function')b={onAfter:b};if(n=='max')n=9e9;b=d.extend({},k.defaults,b);j=j||b.speed||b.duration;b.queue=b.queue&&b.axis.length>1;if(b.queue)j/=2;b.offset=p(b.offset);b.over=p(b.over);return this._scrollable().each(function(){var q=this,r=d(q),f=n,s,g={},u=r.is('html,body');switch(typeof f){case'number':case'string':if(/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(f)){f=p(f);break}f=d(f,this);case'object':if(f.is||f.style)s=(f=d(f)).offset()}d.each(b.axis.split(''),function(a,i){var e=i=='x'?'Left':'Top',h=e.toLowerCase(),c='scroll'+e,l=q[c],m=k.max(q,i);if(s){g[c]=s[h]+(u?0:l-r.offset()[h]);if(b.margin){g[c]-=parseInt(f.css('margin'+e))||0;g[c]-=parseInt(f.css('border'+e+'Width'))||0}g[c]+=b.offset[h]||0;if(b.over[h])g[c]+=f[i=='x'?'width':'height']()*b.over[h]}else{var o=f[h];g[c]=o.slice&&o.slice(-1)=='%'?parseFloat(o)/100*m:o}if(/^\d+$/.test(g[c]))g[c]=g[c]<=0?0:Math.min(g[c],m);if(!a&&b.queue){if(l!=g[c])t(b.onAfterFirst);delete g[c]}});t(b.onAfter);function t(a){r.animate(g,j,b.easing,a&&function(){a.call(this,n,b)})}}).end()};k.max=function(a,i){var e=i=='x'?'Width':'Height',h='scroll'+e;if(!d(a).is('html,body'))return a[h]-d(a)[e.toLowerCase()]();var c='client'+e,l=a.ownerDocument.documentElement,m=a.ownerDocument.body;return Math.max(l[h],m[h])-Math.min(l[c],m[c])};function p(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);
/**
 * jQuery.LocalScroll - Animated scrolling navigation, using anchors.
 * Copyright (c) 2007-2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 3/11/2009
 * @author Ariel Flesler
 * @version 1.2.7
 **/
;(function($){var l=location.href.replace(/#.*/,'');var g=$.localScroll=function(a){$('body').localScroll(a)};g.defaults={duration:1e3,axis:'y',event:'click',stop:true,target:window,reset:true};g.hash=function(a){if(location.hash){a=$.extend({},g.defaults,a);a.hash=false;if(a.reset){var e=a.duration;delete a.duration;$(a.target).scrollTo(0,a);a.duration=e}i(0,location,a)}};$.fn.localScroll=function(b){b=$.extend({},g.defaults,b);return b.lazy?this.bind(b.event,function(a){var e=$([a.target,a.target.parentNode]).filter(d)[0];if(e)i(a,e,b)}):this.find('a,area').filter(d).bind(b.event,function(a){i(a,this,b)}).end().end();function d(){return!!this.href&&!!this.hash&&this.href.replace(this.hash,'')==l&&(!b.filter||$(this).is(b.filter))}};function i(a,e,b){var d=e.hash.slice(1),f=document.getElementById(d)||document.getElementsByName(d)[0];if(!f)return;if(a)a.preventDefault();var h=$(b.target);if(b.lock&&h.is(':animated')||b.onBefore&&b.onBefore.call(b,a,f,h)===false)return;if(b.stop)h.stop(true);if(b.hash){var j=f.id==d?'id':'name',k=$('<a> </a>').attr(j,d).css({position:'absolute',top:$(window).scrollTop(),left:$(window).scrollLeft()});f[j]='';$('body').prepend(k);location=e.hash;k.remove();f[j]=d}h.scrollTo(f,b).trigger('notify.serialScroll',[f])}})(jQuery);
/*!
 * jQuery.SerialScroll
 * Copyright (c) 2007-2008 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 06/14/2009
 *
 * @projectDescription Animated scrolling of series.
 * @author Ariel Flesler
 * @version 1.2.2
 *
 * @id jQuery.serialScroll
 * @id jQuery.fn.serialScroll
 * @param {Object} settings Hash of settings, it is passed in to jQuery.ScrollTo, none is required.
 * @return {jQuery} Returns the same jQuery object, for chaining.
 *
 * @link {http://flesler.blogspot.com/2008/02/jqueryserialscroll.html Homepage}
 *
 * Notes:
 *	- The plugin requires jQuery.ScrollTo.
 *	- The hash of settings, is passed to jQuery.ScrollTo, so its settings can be used as well.
 */
;(function( $ ){

	var $serialScroll = $.serialScroll = function( settings ){
		return $(window).serialScroll( settings );
	};

	// Many of these defaults, belong to jQuery.ScrollTo, check it's demo for an example of each option.
	// @link {http://demos.flesler.com/jquery/scrollTo/ ScrollTo's Demo}
	$serialScroll.defaults = {// the defaults are public and can be overriden.
		duration:1000, // how long to animate.
		axis:'x', // which of top and left should be scrolled
		event:'click', // on which event to react.
		start:0, // first element (zero-based index)
		step:1, // how many elements to scroll on each action
		lock:true,// ignore events if already animating
		cycle:true, // cycle endlessly ( constant velocity )
		constant:true, // use contant speed ?
		smartJump:true
		/*
		navigation:null,// if specified, it's a selector a collection of items to navigate the container
		target:window, // if specified, it's a selector to the element to be scrolled.
		interval:0, // it's the number of milliseconds to automatically go to the next
		lazy:false,// go find the elements each time (allows AJAX or JS content, or reordering)
		stop:false, // stop any previous animations to avoid queueing
		force:false,// force the scroll to the first element on start ?
		jump: false,// if true, when the event is triggered on an element, the pane scrolls to it
		items:null, // selector to the items (relative to the matched elements)
		prev:null, // selector to the 'prev' button
		next:null, // selector to the 'next' button
		onBefore: function(){}, // function called before scrolling, if it returns false, the event is ignored
		exclude:0 // exclude the last x elements, so we cannot scroll past the end
		*/
	};

	$.fn.serialScroll = function( options ){
		
		return this.each(function(){
			var 
				settings = $.extend( {}, $serialScroll.defaults, options ),
				event = settings.event, // this one is just to get shorter code when compressed
				step = settings.step, // ditto
				lazy = settings.lazy, // ditto
				context = settings.target ? this : document, // if a target is specified, then everything's relative to 'this'.
				$pane = $(settings.target || this, context),// the element to be scrolled (will carry all the events)
				pane = $pane[0], // will be reused, save it into a variable
				items = settings.items, // will hold a lazy list of elements
				active = settings.start, // active index
				auto = settings.interval, // boolean, do auto or not
				nav = settings.navigation, // save it now to make the code shorter
				timer; // holds the interval id

			if( !lazy )// if not lazy, save the items now
				items = getItems();

			if( settings.force )
				jump( {}, active );// generate an initial call

			// Button binding, optional
			$(settings.prev||[], context).bind( event, -step, move );
			$(settings.next||[], context).bind( event, step, move );

			// Custom events bound to the container
			if( !pane.ssbound )// don't bind more than once
				$pane
					.bind('prev.serialScroll', -step, move ) // you can trigger with just 'prev'
					.bind('next.serialScroll', step, move ) // f.e: $(container).trigger('next');
					.bind('goto.serialScroll', jump ); // f.e: $(container).trigger('goto', 4 );

			if( auto )
				$pane
					.bind('start.serialScroll', function(e){
						if( !auto ){
							clear();
							auto = true;
							next();
						}
					 })
					.bind('stop.serialScroll', function(){// stop a current animation
						clear();
						auto = false;
					});

			$pane.bind('notify.serialScroll', function(e, elem){// let serialScroll know that the index changed externally
				var i = index(elem);
				if( i > -1 )
					active = i;
			});

			pane.ssbound = true;// avoid many bindings

			if( settings.jump )// can't use jump if using lazy items and a non-bubbling event
				(lazy ? $pane : getItems()).bind( event, function( e ){
					jump( e, index(e.target) );
				});
			
			/*
			//BEGIN: original
			if( nav )
				nav = $(nav, context).bind(event, function( e ){
					e.data = Math.round(getItems().length / nav.length) * nav.index(this);
					jump( e, this );
			});
			//END: original
			*/
			
			//BEGIN: altered code
			if( nav ){
				var s = jQuery.type(nav) == "string" ? nav : nav.selector ;
					
				nav_n = s.split(',');
				
				for(var i=0, l=nav_n.length; i<l; i++)
				{
					(function(n)
					{
						n = $(n, context).bind(event, function( e ){
							e.data = Math.round(getItems().length / n.length) * n.index(this);
							jump( e, this );
						});
					})(nav_n[i]);
				}
			}
			//END: altered code
			
			function move( e ){
				e.data += active;
				jump( e, this );
			};
			function jump( e, button ){
				
				//if( !isNaN(button) ){// initial or special call from the outside $(container).trigger('goto',[index]);
				if( _.isNumber(button) ) {
					e.data = button;
					button = pane;
				}
				
				var
					pos = e.data, n,
					real = e.type, // is a real event triggering ?
					$items = settings.exclude ? getItems().slice(0,-settings.exclude) : getItems(),// handle a possible exclude
					limit = $items.length,
					elem = $items[pos],
					duration = settings.duration;
				
				if( real )// real event object
					e.preventDefault();

				if( auto ){
					clear();// clear any possible automatic scrolling.
					timer = setTimeout( next, settings.interval ); 
				}

				if( !elem ){ // exceeded the limits
					n = pos < 0 ? 0 : limit - 1;
					if( active != n )// we exceeded for the first time
						pos = n;
					else if( !settings.cycle )// this is a bad case
						return;
					else
						pos = limit - n - 1;// invert, go to the other side
					elem = $items[pos];
				}

				if( !elem || settings.lock && $pane.is(':animated') || // no animations while busy
					real && settings.onBefore &&
					settings.onBefore(e, elem, $pane, getItems(), pos) === false ) return;

				if( settings.stop )
					$pane.queue('fx',[]).stop();// remove all its animations

				if( settings.constant )
					duration = Math.abs(duration/step * (active - pos ));// keep constant velocity

				$pane
					.scrollTo( elem, duration, settings )// do scroll
					.trigger('notify.serialScroll',[pos]);// in case serialScroll was called on this elem more than once.
			};

			function next(){// I'll use the namespace to avoid conflicts
				$pane.trigger('next.serialScroll');
			};

			function clear(){
				clearTimeout(timer);
			};

			function getItems(){
				return $( items, pane );
			};

			function index( elem ){
				if( !isNaN(elem) ) return elem;// number
				var $items = getItems(), i;
				while(( i = $items.index(elem)) == -1 && elem != pane )// see if it matches or one of its ancestors
					elem = elem.parentNode;
				return i;
			};
		});
	};

})( jQuery );
(function($) {
	
	var groups = {
		"global": { target: null, animating: false, timer: null }
	};
	
	$.fn.extend( {
		
	    smartPopup: function(options) {
	        
	        var qn = "sm.smartpopup";
	        	
	        var defaults = {
				// the target DOM element to popup (either jQuery-object, selector or function).
				// NextSibling will be taken if null.
				// function param is src element. func must return target elem.
				groupId: "global",
				target: null,
				sourceHoverClass: "hover",
				sourceActiveClass: "active",
				targetHideClass: "transparent",
				transitionThreshold: 150,
				// if true, min-width of target is the width of it's opener.
				setMinWidth: true,
				show: {
					on: "hover", // hover | click	
					fx: "fade", // blind|bounce|clip|drop|explode|fade|fold|highlight|puff|pulsate|scale|shake|size|slide|transfer
					speed: 400,
					delay: 300,
					easing: "easeInOutExpo", // putted in 'options' later
					options: { mode: "show" }, // specific jquery ui effect options
					before: null, // called before showing target. Return 'true' to prevent showing (args: src, target)
					after: null // called after showing target (args: src, target)
				},
				hide: {
					on: "leave", // leave | {selector} > within target	
					fx: "fade",
					speed: 400,
					delay: 600,
					easing: "easeInExpo", // putted in 'options' later
					options: { mode: "hide" },
					before: null, // called before hiding target. Return 'true' to prevent hiding (args: src, target)
					after: null // called after hiding target (args: src, target)
				},
				// if true, creates a sm-smartpopup around the target
				// and appends it to the body.
				createWrapper: false,
				wrapperClass: "popup ui-corner-all",
				wrapperPadding: 10,
				position: {
					/*of: [this > source > popup kicker],*/
					my:	"left top",
					at: "left bottom",
	                collision: "fit flip", // none | flip | fit
	                offset: "0 0"
				},
				// callback called only once just before positioning src <> target.
				// args: src, target, opts.position
				onPosition: null,
				// callback called after a DOM clone (createWrapper=true) was created.
				// Use this to apply delegated events on the new element.
				// args: clonedElement
				onWrap: null
	        };
	        
	        var opts = $.extend(true, defaults, options);
	        if (opts.show.options && !opts.show.options.easing) {
	        	opts.show.options.easing = opts.show.easing;	
	        }
	        if (opts.hide.options && !opts.hide.options.easing) {
	        	opts.hide.options.easing = opts.hide.easing;	
	        }
	        
	        // ensure and acquire current group
	        var groupId = opts.groupId || "global";
	        var cur = groups[groupId];
	        if (cur == undefined || cur == null) {
	        	cur = groups[groupId] = { target: null, animating: false, timer: null };
	        }
	        
	        var topZIndex = $.topZIndex() + 1;
	        
	        return this.each( function() {

				var inTarget = false,
					noTarget = false,
					src = $(this),
					target = opts.target;

				// target/popup ermitteln
				var type = $.type(target);
				if (type === "undefined" || type === "null") {
					var data = src.data("target");
					target = data ? $(data) : src.next();
					if (target.length === 0) {
						//return true;
						noTarget = true;
					}	
				}
				else if ( type === "string" ) {
					target = $(target);	
				}
				else if ( type === "function" ) {
					target = $( target(src) );	
				}

				if (target.length == 0) {
					//return true;
					noTarget = true;
				}

				// Wrapper erzeugen
				opts.createWrapper = opts.createWrapper && !noTarget;
				if (opts.createWrapper) {
					target = createWrapper();
				}

				if (!noTarget) target.data( "opener", src );
				
				// set min-width
				if (opts.setMinWidth && !noTarget) {
					target.css("min-width", (src.outerWidth() - target.horizontalCushioning()) + "px");
				}

				var afterShow = function() {
					cur.animating = false;
					cur.target = target;
					// always hide on "outer click"
					$(this).bind("mousedownoutside", function(evt) {
						quickHide();
					});	
					if ($.isFunction(opts.show.after)) {
						opts.show.after($(this), target);
					}
				}

				var afterHide = function() {
					$(this).unbind("mousedownoutside");
					var elSrc = (cur.target || target).data("opener");
					elSrc.removeClass(opts.sourceActiveClass)
						 .removeClass(opts.sourceHoverClass);
					if ($.isFunction(opts.hide.after)) {
						opts.hide.after(elSrc, cur.target || target);
					}
					cur.target = null;
					cur.animating = false;
				}

				var quickHide = function() {
					clearTimeout(cur.timer);
					doHide(true, cur.target);
				}

				// erstmal verstecken und z-index setzen
				if (!noTarget) target.hide(0).css("z-index", topZIndex);

				// wrapper erzeugen
				if (opts.createWrapper) {
					// display erzwingen für das gewrappte Element
					var realTarget = target.children(":first");
					if (realTarget.is(":hidden")) {
						realTarget.show(0);
					}	
				}

				prepareEvents();

				function createWrapper() {
					var clone = target.clone(true).css("position", "absolute");
					target.remove();
					
					/*var popups = $("#sm-popups");
					if (popups.length == 0) {
						popups = $('<div id="sm-popups"></div>').appendTo( $('body') ).css({ position: "absolute" });	
					}
					popups.append(clone);*/
					
					$('body').append(clone);
					
					var w = 0, h = 0;
					if (clone.is(":hidden")) {
						$(clone).evenIfHidden(function(el) { 
							w = el.outerWidth(true);
							h = el.outerHeight(true);
						});
					}
					else {
						w = clone.outerWidth(true);
						h = clone.outerHeight(true);
					}
					
					var wrapper = clone.wrap('<div />').css("position", "relative").parent();
					
					wrapper
						.attr("id", _.uniqueId("sm-smartpopup-"))
						.addClass("sm-smartpopup")
						.addClass(opts.wrapperClass)
						.width(w + 1)
						.height(h + 1)
						.hide()
						.css( {position: "absolute" } )
						
					if (!!opts.wrapperPadding) {
						wrapper.css("padding", _.isNumber(opts.wrapperPadding) ? opts.wrapperPadding + "px": opts.wrapperPadding);	
					}
					
					if ($.isFunction(opts.onWrap)) {
						opts.onWrap(clone);
					}
					
					return wrapper;
				}

				function prepareEvents() {
					
					var onShow = function() {
						
						var preventDefault = false;
						
						if (cur.animating) {
							cur.target.stop(true, true);
							cur.animating = false;
						}
						
						clearTimeout(cur.timer);
						
						if (noTarget) {
					    	cur.timer = setTimeout(function() {
				    			if (cur.target) {
					    			doHide(true, cur.target);
				    			}
								cur.animating = false;
								cur.target = false;
					    	}, 
					    	opts.transitionThreshold);	
						}
						else if (cur.target === false || (cur.target != null && cur.target.get(0) !== target.get(0))) {
					    	// transition between two openers
					    	cur.timer = setTimeout(function() {
				    			if (cur.target) {
				    				cur.target.stop(true, true);
				    				doHide(true, cur.target);
				    			}
								doShow(true, target);
					    	}, 
					    	opts.transitionThreshold);
						}
						else {
							// first enter of an opener
							if (target.is(":hidden")) {
					    		cur.timer = setTimeout(doShow, opts.show.delay);
					    		preventDefault = (opts.show.on === "click");
							}
						}
						
						if (preventDefault) {
							return false;	
						}

					}

					var onHide = function() {
						//console.log('onHide');
						if (cur.animating) return;
						clearTimeout(cur.timer);
						if (!noTarget && target.is(":visible") && opts.hide.on == "leave") {
							cur.timer = setTimeout(doHide, opts.hide.delay);
						}
					}
					
					// prepare "opener"
					var showEvent = (opts.show.on === "hover") ? "mouseenter" : "click";
					src.bind(showEvent, onShow);

					target.bind("mouseenter", onShow);
					
					// prepare "closer"
					var h = opts.hide.on;
					if (showEvent !== 'click') {	// mg: added... mouseleave on src should not hide popup in that case.
						src.bind("mouseleave", onHide );
					}
					if (!noTarget && h) {
						if (h == "leave" && showEvent !== 'click') {
							target.bind("mouseleave", onHide );		
						}
						else {
							target.find(h).bind("click", quickHide );	
						}
					}
					
					// hover/blur behaviour
					src.bind({
						"mouseenter": function() { $(this).addClass(opts.sourceHoverClass) },
						"mouseleave": function() { 
							var el = $(this);
							if ( !el.hasClass(opts.sourceActiveClass) ) {
								el.removeClass(opts.sourceHoverClass);
							} 
						}
					});
					src.bind("mouseenter", function() { 
						$(this).addClass(opts.sourceHoverClass);
					} );
					
					// reposition visible target on windows resize
					if (!noTarget) {
						$(window).resize(function() {
							if (target.is(":visible") && !cur.animating){
								setPosition();
								target.show(0);
							}
						});
					}
				}

				function setPosition(el) {
					el = el || target;
					var opener = el.data("opener");
					
					el.addClass(opts.targetHideClass);
					el.show(0);
					
					var pos;
					if ($.isFunction(opts.onPosition)) {
						pos = $.extend( {}, opts.position );
						opts.onPosition(opener, el, pos);
					}
					else {
						pos = opts.position;
					}
					
					pos.of = opener;
					el.position( pos );
					el.hide().removeClass(opts.targetHideClass);
				}

				function doShow(quick, el, noCallBack) {
					
					var fx = quick ? "" : opts.show.fx;
					var speed = quick ? 0 : opts.show.speed;
					el = el || target;
					elSrc = el.data("opener");
					
					if (!noCallBack && $.isFunction(opts.show.before)) {
						if (opts.show.before(elSrc, el))
							return;
					}
					
					setPosition(el);
					el.stop(true, true);
					
					elSrc.addClass(opts.sourceHoverClass)
					 	 .addClass(opts.sourceActiveClass);
					
					cur.target = el;
					
					if (fx && fx != "none") {
						cur.animating = true;
				    	el.show(fx, opts.show.options, speed, afterShow);
				    }
				    else {
				    	el.show(speed, afterShow);
				    }
				    
				}

				function doHide(quick, el, noCallBack) {

				 	var fx = quick ? "" : opts.hide.fx;
					var speed = quick ? 0 : opts.hide.speed;
					el = el || target;
					elSrc = el.data("opener");

					if (!noCallBack && $.isFunction(opts.hide.before)) {
						if (opts.hide.before(elSrc, el))
							return;
					}	

					el.stop(true, true);
					
					if (fx  && fx != "none") {
						cur.animating = true;
				    	el.hide(fx, opts.hide.options, speed, afterHide);
				    }
				    else {
				    	el.hide(speed, afterHide);
				    }
				}
	        		
	        });
	        
		}
	    
	});
    
})( jQuery );
/*
 * jQuery outside events - v1.1 - 3/16/2010
 * http://benalman.com/projects/jquery-outside-events-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($,c,b){$.map("click dblclick mousemove mousedown mouseup mouseover mouseout change select submit keydown keypress keyup".split(" "),function(d){a(d)});a("focusin","focus"+b);a("focusout","blur"+b);$.addOutsideEvent=a;function a(g,e){e=e||g+b;var d=$(),h=g+"."+e+"-special-event";$.event.special[e]={setup:function(){d=d.add(this);if(d.length===1){$(c).bind(h,f)}},teardown:function(){d=d.not(this);if(d.length===0){$(c).unbind(h)}},add:function(i){var j=i.handler;i.handler=function(l,k){l.target=k;j.apply(this,arguments)}}};function f(i){$(d).each(function(){var j=$(this);if(this!==i.target&&!j.has(i.target).length){j.triggerHandler(e,[i.target])}})}}})(jQuery,document,"outside");
/*
* Placeholder plugin for jQuery
* ---
* Copyright 2010, Daniel Stocks (http://webcloud.se)
* Released under the MIT, BSD, and GPL Licenses.
*/
(function($) {
	
    function Placeholder(input) {
        this.input = input;
        if (input.attr('type') == 'password') {
            this.handlePassword();
        }
        // Prevent placeholder values from submitting
        $(input[0].form).submit(function() {
            if (input.hasClass('placeholder') && input[0].value == input.attr('placeholder')) {
                //input[0].value = '';
                $(input[0]).plVal("");
            }
        });
    };
    
    Placeholder.prototype = {
        show : function(loading) {
            // FF and IE saves values when you refresh the page. If the user refreshes the page with
            // the placeholders showing they will be the default values and the input fields won't be empty.
            if (this.input[0].value === '' || (loading && this.valueIsPlaceholder())) {
                if (this.isPassword) {
                    try {
                        this.input[0].setAttribute('type', 'text');
                    } catch (e) {
                        this.input.before(this.fakePassword.show()).hide();
                    }
                }
                this.input.addClass('placeholder');
                //this.input[0].value = this.input.attr('placeholder');
                $(this.input[0]).plVal(this.input.attr('placeholder'));
            }
        },
        hide : function() {
            if (this.valueIsPlaceholder() && this.input.hasClass('placeholder')) {
                this.input.removeClass('placeholder');
                //this.input[0].value = '';
                $(this.input[0]).plVal('');
                if (this.isPassword) {
                    try {
                        this.input[0].setAttribute('type', 'password');
                    } catch (e) { }
                    // Restore focus for Opera and IE
                    this.input.show();
                    this.input[0].focus();
                }
            }
        },
        valueIsPlaceholder : function() {
            return this.input[0].value == this.input.attr('placeholder');
        },
        handlePassword: function() {
            var input = this.input;
            input.attr('realType', 'password');
            this.isPassword = true;
            // IE < 9 doesn't allow changing the type of password inputs
            if ($.browser.msie && input[0].outerHTML) {
                var fakeHTML = $(input[0].outerHTML.replace(/type=(['"])?password\1/gi, 'type=$1text$1'));
                this.fakePassword = fakeHTML.val(input.attr('placeholder')).addClass('placeholder').focus(function() {
                    input.trigger('focus');
                    $(this).hide();
                });
                $(input[0].form).submit(function() {
                    fakeHTML.remove();
                    input.show()
                });
            }
        }
    };
    
	// Replace the val function to never return placeholders
	$.fn.plVal = $.fn.val;
	$.fn.val = function(value) {
		if(this[0]) {
			var el = $(this[0]);
			if(value != undefined) {
				var currentValue = el.plVal();
				var returnValue = $(this).plVal(value);
				if (el.hasClass('placeholder') && currentValue == el.attr('placeholder')) {
					el.removeClass('placeholder');
				}
				return returnValue;
			}

			if (el.hasClass('placeholder') && el.plVal() == el.attr('placeholder')) {
				return '';
			} else {
				return el.plVal();
			}
		}
		return undefined;
	};
    
    var NATIVE_SUPPORT = Modernizr.input.placeholder;
    
    $.fn.placeholder = function() {
        return NATIVE_SUPPORT ? this : this.each(function() {
            var input = $(this);
            var placeholder = new Placeholder(input);
            placeholder.show(true);
            input.bind("blur dragleave", function() {
            	placeholder.show(false);	
            });
            input.bind("dragend", function() {
            	window.setTimeout(function() { placeholder.show(false); }, 1);	
            });
            input.bind("focus dragenter", function() {
            	placeholder.hide();	
            });

            // On page refresh, IE doesn't re-populate user input
            // until the window.onload event is fired.
            if ($.browser.msie) {
                $(window).load(function() {
                    if(input.val()) {
                        input.removeClass("placeholder");
                    }
                    placeholder.show(true);
                });
                // What's even worse, the text cursor disappears
                // when tabbing between text inputs, here's a fix
                input.focus(function() {
                    if(this.value == "") {
                        var range = this.createTextRange();
                        range.collapse(true);
                        range.moveStart('character', 0);
                        range.select();
                    }
                });
            }
        });
    };
    
})(jQuery);
// ------------------------- mg: BUG FIXES, AKTUALISIERT! -----------------------------------

/*
 * Version 2.0.7
 *
 * http://www.mostthingsweb.com/
 *
 * Licensed under MIT License: http://en.wikipedia.org/wiki/MIT_License
 *
 * Copyright (c) 2011 MostThingsWeb

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.

 * Changelog:
 *
 * Version 2.0.7
 *  - Fixes Issue #2: Stacking non-wrapper created and wrapper created modaled dialogs results
 *    in modal not being removed when bottom, non-wrapper-created dialog is closed
 *
 * Version 2.0.6
 *  - Fixes Issue #1: Stacking non-wrapper created and wrapper created modaled dialogs results
 *    in modal being removed when wrapper-created dialog is closed
 *
 * Version 2.0.5
 *  - Fixed the mouse and keyboard blocking problem when multiple modal dialogs were stacked
 *
 * Version 2.0.1-2.0.4
 *  - Fixed a couple of issues
 *  - Most of these versions were me failing to use Subversion correctly
 *
 * Version 2
 *   New Features
 *   - You can now use standard dialogs (i.e. created at design-time, directly in the HTML) as well as dynamic dialogs (i.e. created by dialogWrapper) at the same time
 *   - Automatic management of modals and stacked overlays can now also be used with standard dialogs
 *   - New $.input() method for dynamically creating input boxes, styled exactly the same as your other dialogs
 *   - There is now a difference between hiding, destroying, and removing dialogs: see API Changes
 *   - Ability to control the ID scheme for dynamically created dialogs
 *   - Added a $.getTopDialog utility function that returns the dialog currently on top (topmost)
 *   - API changes
 * Bugfixes:
 *   - jQuery UI Dialog events now properly fire
 *   - Because native jQuery UI Dialog options are used to achieve fading dialogs in and out, all cross-browser issues with such options should be resolved
 *   - The id parameter of $.hideDialog() and $.destroyDialog() is now much more forgiving: it will accept an object (the dialog itself), a string (with/without the # and with/without the prefix), or a number (only applicable when the main id component is a number). Also, as with the last version, passing null will select the dialog currently on top (topmost)
 * Technical
 *   - Completely rewritten
 *   - Updated for jQuery UI version 1.8.12
 *   - Less obtrusive: Only modifies the jQuery UI Dialog prototype in 1 place as opposed to 4 in the last version
 *
 * Version 1.7
 * - Fixed a variable naming issue
 *
 * Version 1.6.1 (Minified version only)
 * - (Deprecated)
 * - Fixed an issue during minifcation
 *
 * Version 1.6
 * - (Deprecated)
 * - Fixed overlay overflow issues in IE
 * - Fixed overlay fadeIn in IE
 *
 * Version 1.5
 * - Release
 *
 * Portions of this software come from jQuery UI Dialog
 * License (below):
 *
 * jQuery UI Dialog
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Dialog
 *
 */

(function($) {
    if (!$.ui || !$.ui.dialog)
        return;

    // Internal function used to generate a random ID
    function randomID() {
        var id = "";
        for ( var i = 1; i <= 10; i++)
            id += (Math.floor(Math.random() * 10) + 1);
        return id;
    }
    
    // Internal function used for getting the element on top
    function getTopElement(elems) {
        // Store the greates z-index that has been seen so far
        var maxZ = 0;
        // Stores a reference to the element that has the greatest z-index so
        // far
        var maxElem;
        // Check each element's z-index
        elems.each(function() {
            // If it's bigger than the currently biggest one, store the value
            // and reference
            if ($(this).css("z-index") > maxZ) {
                maxElem = $(this);
                maxZ = $(this).css("z-index");
            }
        });
        // Finally, return the reference to the element on top
        return maxElem;
    }
    
    $.ui.dialog.prototype.destroy = function(){
        var self = this;
        
        self.uiDialog.hide();
        self.element
        .unbind('.dialog')
        .removeData('dialog')
        .removeClass('ui-dialog-content ui-widget-content')
        .hide().appendTo('body');
        self.uiDialog.remove();

        if (self.originalTitle) {
            self.element.attr('title', self.originalTitle);
        }

        return self;
    };
    
    // Issue #1: Modaled dialogs that aren't dynamically created still need
    // the modal attribute
    var _createFn = $.ui.dialog.prototype._create;
    $.ui.dialog.prototype._create = function(){
        _createFn.apply(this);
        var options = this.options;
        if (!options.dynamicallyCreated && options.modal){
            this.uiDialog.attr("modal", true);
        }
    };
    
    // Override the default close method to handle smartModals and
    // smartModalsForClassicDialogs
    $.ui.dialog.prototype.close = function(event){
        var self = this, maxZ, thisZ;
    
        if (false === self._trigger('beforeClose', event)) {
            return;
        }

        // *** Begin modifications ***
      
        // Override overlay handling if smartModals is enabled and the dialog was
        // dynamically created, or if smartsModalsForClassicDialogs was enabled

        if (self.options.smartModalsForClassicDialogs || (self.options.dynamicallyCreated && self.options.smartModals)){
            // Get a collection of modals that are visible and that require a modal,
            // excluding this one
            var modalizedDialogs = $(".ui-dialog:visible[modal=true]").not($("#" + self.options.id).parent());
           
            var modalizedDialogLen = modalizedDialogs.size();

            // If a dialog exists that requires a modal, drop the overlay behind
            // the top dialog; otherwise, remove the overlay
            if (modalizedDialogLen > 0){
                var top = getTopElement(modalizedDialogs);
                $(".ui-widget-overlay").css("z-index", parseInt(top.css("z-index"), 10) - 1);
            } else {
                $(".ui-widget-overlay").remove();
            }
        } else if (self.overlay) {
            $(".ui-widget-overlay").fadeOut("fast").remove();
        }
        
        // Remove keyboard and mouse blocking
        $([document, window]).unbind('.dialog-overlay');
        
        // *** End modifications ***
        
        self.uiDialog.unbind('keypress.ui-dialog');

        self._isOpen = false;

        if (self.options.hide) {
            self.uiDialog.hide(self.options.hide, function() {
                self._trigger('close', event);
            });
        } else {
            self.uiDialog.hide();
            self._trigger('close', event);
        }

        $.ui.dialog.overlay.resize();

        // adjust the maxZ to allow other modal dialogs to continue to work (see #4309)
        if (self.options.modal) {
            maxZ = 0;
            $('.ui-dialog').each(function() {
                if (this !== self.uiDialog[0]) {
                    thisZ = $(this).css('z-index');
                    if(!isNaN(thisZ)) {
                        maxZ = Math.max(maxZ, thisZ);
                    }
                }
            });
            $.ui.dialog.maxZ = maxZ;
        }

        return self;
    };
    
    // Create a dialog with the given title, body, and arguments
    $.createDialog = function(){
        var title = "", body, args = null;
        // What kind of arguments do we have?
        switch (arguments.length){
            case 1:
                body = arguments[0];
                break;
            case 2:
                body = arguments[0];
                args = arguments[1];
                break;
            case 3:
                title = arguments[0];
                body = arguments[1];
                args = arguments[2];
                break;
        }
       
        var options = {
            title : title,
            hasClose: true,
            smartModals: true,
            smartModalsForClassicDialogs: false,
            id: "dwd" + randomID(),
        	show: {
        		effect: "drop",
        		direction: "up",
        		duration: 250	
	        },
            zIndex: $.topZIndex()
        };

        $.extend(options, args);
        
        // Explicitly remember that this dialog was dynamically created
        options.dynamicallyCreated = true;
        
        // Create the dialog markup
        $("body").append("<div id='" + options.id + "'><p><div>" + body + "</div></p></div>");
        var dialog = $("#" + options.id).dialog(options).parent();
        
        // If more than one overlay exists, remove the first one (since this
        // is the order in which overlays are created)
        if ($(".ui-widget-overlay").size() > 1 && options.smartModals){
            $(".ui-widget-overlay:first").remove();
        }

        // If the dialog doesn't have a close button, remove it
        if (!options.hasClose){
            dialog.find(".ui-dialog-titlebar-close").remove();
        } else {
            dialog.find(".ui-dialog-titlebar-close").unbind("click").attr("href", "javascript: void false").click(function(){
                $.destroyDialog(dialog.find(".ui-dialog-content"));
            });
        }
        
        // If the dialog has a modal, remember that
        if (options.modal){
            dialog.attr("modal", "true");
        }
        
        return options.id;
    };
    
    // Utility function for getting the top most visible dialog
    $.getTopDialog = function(){
        // Check that a dialog exists and is open
        var dialogs = $(".ui-dialog:visible");
        if (dialogs.size() == 0)
            return false;
        
        try {
            var topDialog = getTopElement(dialogs).find(".ui-dialog-content");
            return topDialog;
        } catch (ex){
            return false;
        }
    };
    
    // Utility function to resolve what "dialog" means
    // If the dialog is not given, the top most visible
    // dialog is assumed
    function resolveDialog(dialog){
        if (!dialog) {
            return $.getTopDialog();
        }
		
        //if (!(dialog instanceof Object)){		// mg: browser-unsicher... kann alles mögliche liefern
        if (typeof dialog !== 'object') {
            if (dialog.constructor === Number){
                dialog = $("#" + String(dialog));
            } else if (dialog.constructor === String) {
                if (!(/^#/.test(dialog))){
                    dialog = "#" + dialog;
                }
                dialog = $(dialog);
            } else {
                return false;
            }
        }
        
        if (!dialog.jquery){
            dialog = $(dialog);
        }
        
        if (dialog.size() === 0) {
            return false;
        }
        return dialog;
    }
    
    // Hide (but not destroy or remove) the given dialog
    $.hideDialog = function(dialog, args){
        var options = {
            hide: null
        };

        $.extend(options, args);
        
        // Resolve the dialog
        dialog = resolveDialog(dialog);
        
        if (!dialog){
            return false;
        }
        
        // If the user specified a method of hiding the dialog, override the existing
        // value
        if (options.hide){
            dialog.dialog("option", "hide", options.hide);
        }
        
        // Hide the dialog
        dialog.dialog("close");
        
        return true;
    }
    
    // Hide all visible dialogs
    $.hideDialogs = function(){
        var success = true;
        $(".ui-dialog:visible").each(function(){
            if (!$.hideDialog($(this))){
                success = false;
            }
        });
        return success;
    };
    
    // Destroy all visible dialogs, by default removing them too
    $.destroyDialogs = function(remove){
        if (remove === null)
            remove = true;
        var success = true;
        $(".ui-dialog:visible").each(function(){
            if (!$.destroyDialog($(this), {
                remove: remove
            })){
                success = false;
            }
        });
        return success;
    };
    
    // Destroy the given dialog
    $.destroyDialog = function(dialog, args){
        var options = {
            remove: true,
            hide: null
        };

        $.extend(options, args);
        
        // Resolve the dialog
        dialog = resolveDialog(dialog);
        
        if (!dialog){
            return false;
        }
        
        // Attempt to hide the dialog first
        if (!$.hideDialog(dialog, args))
            return false;
        
        // Now destroy it
        $(dialog).dialog("destroy");
        
        // Finally, if specified, remove it from the DOM tree
        if (options.remove){
            $(dialog).remove();
        }
        
        return true;
    };
    
    // Show a confirm dialog
    $.confirm = function(prompt, yes, no, args) {
        return $.createDialog(T["lbl.confirm"], prompt, $.extend({}, 
            args, {
                buttons: [
                	{
                		text: T["txt.yes"],
                		click: function() {
	                        (yes || $.noop).call();
	                        $.destroyDialog(this);
	                    }
                	},
                	{
                		text: T["txt.no"],
	                	click: function() {
	                        (no || $.noop).call();
	                        $.destroyDialog(this);
	                    }
                	}	
                ]
            }));
    };
    
    // Show an alert dialog
    $.alert = function(prompt, args) {
        return $.createDialog(T["lbl.info"], prompt, $.extend({}, 
            args, {
                buttons: [
                	{
                		text: T["dlg.ok"],
                		click: function() {
	                        // When the Ok button is clicked, just hide this dialog
	                        $.destroyDialog(this);
	                    }
                	}	
                ]
            }));
    };
    
    // Show an input dialog
    $.input = function(prompt, callback, args){
        $.extend({
            defaultValue: ""
        }, args);
        var inputID = randomID();
        var ret = $.createDialog("Eingabe", prompt + "<br/><br/><input id='" + inputID + "' style='width: 100%;' type='text'/>", $.extend({},
            args, {
                buttons: [
                	{
                		text: T["dlg.ok"],
                		click: function() {
	                        // When the Ok button is clicked, pass the value to the callback
	                        // and close the dialog
	                        callback($("#" + inputID).val());
	                        
	                        $.destroyDialog(this);
	                    }
                	}	
                ]
            }));
        $("#" + inputID).val(args.defaultValue);
        return ret;
    };
})(jQuery);
/**
* hoverIntent r5 // 2007.03.27 // jQuery 1.1.2+
* <http://cherne.net/brian/resources/jquery.hoverIntent.html>
* 
* @param  f  onMouseOver function || An object with configuration options
* @param  g  onMouseOut function  || Nothing (use configuration options object)
* @author    Brian Cherne <brian@cherne.net>
*/
(function($){$.fn.hoverIntent=function(f,g){var cfg={sensitivity:7,interval:100,timeout:0};cfg=$.extend(cfg,g?{over:f,out:g}:f);var cX,cY,pX,pY;var track=function(ev){cX=ev.pageX;cY=ev.pageY;};var compare=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);if((Math.abs(pX-cX)+Math.abs(pY-cY))<cfg.sensitivity){$(ob).unbind("mousemove",track);ob.hoverIntent_s=1;return cfg.over.apply(ob,[ev]);}else{pX=cX;pY=cY;ob.hoverIntent_t=setTimeout(function(){compare(ev,ob);},cfg.interval);}};var delay=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);ob.hoverIntent_s=0;return cfg.out.apply(ob,[ev]);};var handleHover=function(e){var p=(e.type=="mouseover"?e.fromElement:e.toElement)||e.relatedTarget;while(p&&p!=this){try{p=p.parentNode;}catch(e){p=this;}}if(p==this){return false;}var ev=jQuery.extend({},e);var ob=this;if(ob.hoverIntent_t){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);}if(e.type=="mouseover"){pX=ev.pageX;pY=ev.pageY;$(ob).bind("mousemove",track);if(ob.hoverIntent_s!=1){ob.hoverIntent_t=setTimeout(function(){compare(ev,ob);},cfg.interval);}}else{$(ob).unbind("mousemove",track);if(ob.hoverIntent_s==1){ob.hoverIntent_t=setTimeout(function(){delay(ev,ob);},cfg.timeout);}}};return this.mouseover(handleHover).mouseout(handleHover);};})(jQuery);
/* jquery.shrinkMenu.js
-------------------------------------------------------------- */

(function($) {
	
    $.fn.extend({
    	
        shrinkMenu: function(settings) {
            
            var options = {
				maxItemsInCol: 20,
				maxCols: 3,
				onShrink: null,
				onChange: null,
				shrinkOnResize: false
            }
            
            $.extend( options, settings );
            
            var holder = $("#mm-holder");
            
            return this.each(function() {
            	
            	var nav = $(this);
            	var navId = _.uniqueId('more');
            	var btn, menu, moreButtonCreated = false, btnMoreWidth;
            	
            	function reset() {
            		nav.children(".hidden:not(.more)").removeClass("hide");
            		if (btn) btn.addClass("hidden");
            		if (menu) menu.children().remove();
            	}
            	
            	function getMoreButtonWidth() {
            		if (!btnMoreWidth) {
            			btnMoreWidth = btn.outerWidth(true);
            		}
            		return btnMoreWidth;	
            	}
            	
            	function doShrink(resize) {
	                var navWidth = parseFloat(nav.width());
	                var totalButtonsWidth = 0;
	                
	                if (!menu) {
	                	menu = $('<div id="mm-' + navId + '" class="mm more"><div class="mm-col"><ul></ul></div></div>');
	                }
	                else {
	                	// weil wir sie vorher in 'reset' entfernt haben.
	                	menu.append('<div class="mm-col"><ul></ul></div>');	
	                }
	                var currentCol = menu.find('ul');
	                
	                var navElements = $.makeArray( nav.children(":not(.more)"/* LI */) ),
	                	exceedButtons = [],
	                	curWidth = 0,
	                	visibleButtons = _.filter(navElements, function(el) {
		                	if (totalButtonsWidth <= navWidth) {
			                	el = $(el);
			                	totalButtonsWidth += curWidth = el.outerWidth(true);
			                	return (totalButtonsWidth > navWidth) ? false : true;
		                	}
		                	else {
		                		return false;	
		                	}
		                });
	                
					var buttonShifter = (function(){
						var colCount = 1, itemCount = 0;
						return {
							shift: function(el) {
							    itemCount++;
								
		                		var html =  '<li class="mm-title"><h4><span class="ui-icon ui-icon-carat-1-e"></span>';
		                		html += '<a class="mm-entry" href="' + el.find('a').attr('href') + '">' + el.find('a').text() + '</a>';
		                		html += '</h4></li>';
								
		                		currentCol.append(html);
								
		                		el.addClass('hidden');
								
		                		// add new column to menu
		                		if(itemCount == options.maxItemsInCol) {
		                			itemCount = 0;
		                			if (colCount == options.maxCols) {
		                			} else {
		                				currentCol = menu.append('<div class="mm-col"><ul></ul></div>').find('ul').last();
		                			}
		                			colCount++;
		                		}
							}	
						}
					})();
	                
					if (visibleButtons.length < navElements.length) {
						moreButtonCreated = addMoreButton();
						exceedButtons = _.difference(navElements, visibleButtons);
						totalButtonsWidth -= curWidth;
						curWidth = getMoreButtonWidth();
						while (totalButtonsWidth + curWidth > navWidth) {
							totalButtonsWidth -= $(_.last(visibleButtons)).outerWidth(true);
							exceedButtons = [visibleButtons.pop()].concat( exceedButtons );
						}
						_.each(exceedButtons, function(val, i){
							buttonShifter.shift($(val));
						});	
					}
	            	function addMoreButton() {
	            		// returns true, if button had to be created
		                if (!btn) {
		                	btn = $('<li class="invisible has-children more" id="mm-btn-' + navId + '"><a class="nav-entry" data-for="' + navId + '" href="#"><span>' + T['lbl.mm-holder-more'] + '</span><em class="mm-chevron" /></a></li>');
		                	nav.append(btn);
		                	return true;
		                }
	            	}
	                
	                // finalize navbar
	                if (exceedButtons.length > 0) {
		                var created = false, changed = false;
		                moreButtonCreated ? changed = created = true : changed = true;

		                if ($("#mm-" + navId).length == 0) {
		                	holder.append(menu);
		                }
		                btn.removeClass("invisible hidden");
		                if (resize) {
		                	if (changed && $.isFunction(options.onChange)) options.onChange.call(this, menu);
		                	if (created && $.isFunction(options.onShrink)) options.onShrink.call(this, btn, menu);
		                }
	                }
	                
            	}
	    		
	    		// SHRINK IT!
	    		doShrink( false );
	    		
	    		if (options.shrinkOnResize) {
	    			var lazyShrink = _.debounce(function() {
	    				reset();
	    				doShrink( true );
	    			}, 50);
	    			$(window).resize( lazyShrink );	
	    		}
	    		
            });

        }
    });
  	
  	// TEMP
  	$(".shrinkable").shrinkMenu();
  	
})(jQuery);
/**
 * jQuery.Preload
 * Copyright (c) 2008 Ariel Flesler - aflesler(at)gmail(dot)com
 * Dual licensed under MIT and GPL.
 * Date: 3/25/2009
 *
 * @projectDescription Multifunctional preloader
 * @author Ariel Flesler
 * @version 1.0.8
 *
 * @id jQuery.preload
 * @param {String, jQuery, Array< String, <a>, <link>, <img> >} original Collection of sources to preload
 * @param {Object} settings Hash of settings.
 *
 * @id jQuery.fn.preload
 * @param {Object} settings Hash of settings.
 * @return {jQuery} Returns the same jQuery object, for chaining.
 *
 * @example Link Mode:
 *	$.preload( '#images a' );
 *
 * @example Rollover Mode:
 *	$.preload( '#images img', {
 *		find:/\.(gif|jpg)/,
 *		replace:'_over.$1'
 *	});
 *
 * @example Src Mode:
 *	$.preload( [ 'red', 'blue', 'yellow' ], {
 *		base:'images/colors/',
 *		ext:'.jpg'
 *	});
 *
 * @example Placeholder Mode:
 *	$.preload( '#images img', {
 *		placeholder:'placeholder.jpg',
 *		notFound:'notfound.jpg'
 *	});
 *
 * @example Placeholder+Rollover Mode(High res):
 *	$.preload( '#images img', {
 *		placeholder:true,
 *		find:/\.(gif|jpg)/,
 *		replace:'_high.$1'
 *	});
 */
;(function( $ ){

	function isImageLoaded(img) {
		if (typeof img.complete != 'undefined' && !img.complete) {
			return false;
		};
		if (typeof img.naturalWidth != 'undefined' && img.naturalWidth == 0) {
			return false;
		};
		return true;
	}

	var $preload = $.preload = function( original, settings ){
		if( original.split ) // selector
			original = $(original);

		settings = $.extend( {}, $preload.defaults, (settings instanceof Function) ? {onFinish: settings} : settings );
		
		var sources = $.map( original, function( source ){
			if( !source ) 
				return; // skip
			if( source.split ) // URL Mode
				return settings.base + source + settings.ext;
			var url = source.src || source.href; // save the original source
			if( typeof settings.placeholder == 'string' && source.src ) // Placeholder Mode, if it's an image, set it.
				source.src = settings.placeholder;
			if( url && settings.find ) // Rollover mode
				url = url.replace( settings.find, settings.replace );
			return url || null; // skip if empty string
		});

		var data = {
			loaded: 0, // how many were loaded successfully
			failed: 0, // how many urls failed
			next: 0, // which one's the next image to load (index)
			done: 0, // how many urls were tried
			/*
			index:0, // index of the related image			
			found:false, // whether the last one was successful
			*/
			total: sources.length // how many images are being preloaded overall
		};
		
		if( !data.total ) // nothing to preload
			return finish();
		
		var imgs = $(Array(settings.threshold+1).join('<img/>'))
			.on("load.preload error.preload abort.preload", handler).each(fetch);
		
		function handler( e ){
			
			if (++data.done > data.total) {
				// FF fires load AND error for non-existent images.
				return;
			}
			
			data.element = this;
			data.found = e.type == 'load';
			data.image = this.src;
			data.index = this.index;
			var orig = data.original = original[this.index];
			data[data.found ? 'loaded' : 'failed']++;
			//data.done++;

			// This will ensure that the images aren't "un-cached" after a while
			if( settings.enforceCache )
				$preload.cache.push( 
					$('<img/>').attr('src',data.image)[0]
				);

			if( settings.placeholder && orig.src ) // special case when on placeholder mode
				orig.src = data.found ? data.image : settings.notFound || orig.src;
			if( settings.onComplete )
				settings.onComplete( data );
			if( data.done < data.total ) // let's continue
				fetch( 0, this );
			else{ // we are finished
				if( imgs && imgs.off )
					imgs.off('.preload'); // cleanup
				imgs = null;
				finish();
			}
		};
		function fetch( i, img, retry ){
			// IE problem, can't preload more than 15
			if( img.attachEvent /* msie */ && data.next && data.next % $preload.gap == 0 && !retry ){
				setTimeout(function(){ fetch( i, img, true ); }, 0);
				return false;
			}
			if( data.next == data.total ) return false; // no more to fetch
			img.index = data.next; // save it, we'll need it.
			img.src = sources[data.next++];
			
			// added by MC
			if (isImageLoaded(img)) {
				$(img).trigger("load");
			}
			
			if( settings.onRequest ){
				data.index = img.index;
				data.element = img;
				data.image = img.src;
				data.original = original[data.next-1];
				settings.onRequest( data );
			}
		};
		function finish(){
			if( settings.onFinish )
				settings.onFinish( data );
		};
	};

	 // each time we load this amount and it's IE, we must rest for a while, make it lower if you get stack overflow.
	$preload.gap = 10; 
	$preload.cache = [];
	
	$preload.defaults = {
		threshold:2, // how many images to load simultaneously
		base:'', // URL mode: a base url can be specified, it is prepended to all string urls
		ext:'', // URL mode:same as base, but it's appended after the original url.
		replace:'' // Rollover mode: replacement (can be left empty)
		/*
		enforceCache: false, // If true, the plugin will save a copy of the images in $.preload.cache
		find:null, // Rollover mode: a string or regex for the replacement
		notFound:'' // Placeholder Mode: Optional url of an image to use when the original wasn't found
		placeholder:'', // Placeholder Mode: url of an image to set while loading
		onRequest:function( data ){ ... }, // callback called every time a new url is requested
		onComplete:function( data ){ ... }, // callback called every time a response is received(successful or not)
		onFinish:function( data ){ ... } // callback called after all the images were loaded(or failed)
		*/
	};

	$.fn.preload = function( settings ){
		$preload( this, settings );
		return this;
	};

})( jQuery );
/*
 * Depends:
 *   jquery.ui.position.js
 */
(function( $, undefined ) {

var iconClasses = {
	small: {
		left: "ui-icon ui-icon-triangle-1-w", 
		right: "ui-icon ui-icon-triangle-1-e", 
		up: "ui-icon ui-icon-triangle-1-n", 
		down: "ui-icon ui-icon-triangle-1-s"	
	},
	large: {
		left: "icon", 
		right: "icon", 
		up: "icon", 
		down: "icon"		
	}
};

$.ScrollButton = function(el, buttons, target, options) {
	var self = this;
	
	el.data("ScrollButton", this);
	
	// support metadata plugin
	var meta = $.metadata ? $.metadata.get(el[0]) : {};
	var opts = $.extend({}, options, meta || {});
	
	// make "corrections" to important options
	opts.nearSize = Math.max(12, opts.nearSize || (opts.smallIcons ? 16 : 32));
	opts.farSize = Math.max(12, opts.farSize || (opts.smallIcons ? 16 : 32));
	opts.offset = _.isNumber(opts.offset) ? opts.offset : 0;
	this.direction = opts.direction = opts.direction || "left";
	
	this.target = target;
	
	var initialized = false;
	var enabled = opts.enabled;
	var inButton = false;
	var inTarget = false;
	var outside = opts.position === "outside";
	var iconClass = iconClasses[opts.smallIcons ? "small" : "large"];
	
	var offOpacity = opts.showButtonAlways ? 40 : 0;
	var onOpacity = !target ? 100 : (opts.showButtonAlways ? 60 : 40);
	var hoverOpacity = 100;
	var removableOpacityClasses = "o{0} o{1} o{2}".format(hoverOpacity, onOpacity, offOpacity);
	
	var isVert = opts.direction == "up" || opts.direction == "down";
	var cssTransitions = Modernizr.csstransitions;
	
	this._init = function() {
		el.addClass("scroll-button ui-state-default");
		
		// set size
		if (isVert) {
			el.css({ width: opts.nearSize, height: opts.farSize });
		}
		else {
			el.css({ width: opts.farSize, height: opts.nearSize });
		}
		
		// apply 'position'
		if (!target) {
			if (opts.handleCorners) el.addClass("ui-corner-all");
		}
		else {
			var offset = [opts.offset, 0];
			var pos = { of: target, collision: "none" };
			var cornerSide, nullBorderSide;
			var dir = opts.direction;
			var atmy = "";
			
			buttons[dir] = el;
			
			// negate offset for 'near' sides if outside
			if (dir == "left" || dir == "up") {
				if (opts.position == "outside") offset[0] *= -1;	
			}
			
			// negate offset for 'far' sides if inside
			if (dir == "down" || dir == "right") {
				if (opts.position == "inside") offset[0] *= -1;	
			}
			
			// reverse offset for vertical arrows
			if (isVert) {
				offset.reverse();	
			}
			
			switch (opts.direction) {
				case "up": 
					cornerSide = (outside ? "top" : "bottom");
					nullBorderSide = (outside ? "bottom" : "top");
					pos.at = "center top";
					pos.my = (outside ? "center bottom" : pos.at);
					break;
				case "down": 
					cornerSide = (outside ? "bottom" : "top");
					nullBorderSide = (outside ? "top" : "bottom");
					pos.at = "center bottom";
					pos.my = (outside ? "center top" : pos.at);
					break;  
				case "right": 
					cornerSide = (outside ? "right" : "left");
					nullBorderSide = (outside ? "left" : "right");
					pos.at = "right center";
					pos.my = (outside ? "left center" : pos.at);
					break;  
				default: 
					cornerSide = (outside ? "left" : "right");
					nullBorderSide = (outside ? "right" : "left");
					pos.at = "left center";
					pos.my = (outside ? "right center" : pos.at);
			}
			
			if (opts.handleCorners === true) {
				if (!opts.autoPosition || opts.offset !== 0) {
					el.addClass("ui-corner-all");
				}
				else {
					el.css("border-" + nullBorderSide + "-width", 0).addClass("ui-corner-" + cornerSide);
				}
			}
			
			if (opts.autoPosition) {
				pos.offset = offset.join(" ");
				el.position(pos);
				
				if ($.Grid.bodyStretched) {
					// has resizable body
					$(window).resize(function() {
						el.position(pos);	
					});
				}
			}
			
		} // if (target)
		
		el.text("").append('<span class="' + iconClass[opts.direction] + '"></span>');
		
		el.addClass("sb-dir-" + opts.direction);

		el.bind({
			"mouseenter.scrollbutton": function() { 
				inButton = true;
				// ohne defer würde target.enter HIERNACH gefeuert, dat wollen wir nicht.
				_.defer(function() { self.setState("hovered") }, 1);
				if (enabled && $.isFunction(opts.enter)) {
					opts.enter.call(this, opts.direction);
				} 
			}, 
			"mouseleave.scrollbutton": function() {
				self.setState("on");
				inButton = false;
				if ($.isFunction(opts.leave)) {
					opts.leave.call(this, opts.direction);
				} 
			},
			"mousedown.scrollbutton": function() { 
				self.setState("active"); 
			},
			"mouseup.scrollbutton": function() { 
				self.setState("hovered");
			},
			"click.scrollbutton": function(evt) { 
				evt.preventDefault();
				if (enabled && $.isFunction(opts.click)) {
					opts.click.call(this, opts.direction);
				} 
			}
		});
		
		self.enable(enabled);
		
		el.removeClass("transparent invisible hidden");
		
		initialized = true;
	}; // init
	
	this.setInTarget = function(value) {
		inTarget = value;	
	}
	
	// to call this method, fetch the plugin instance from the
	// jq-Element first: $("#myscrollbutton").data("ScrollButton").enable(false)
	this.enable = function(enable) {
		enabled = enable;
		if (enabled) {
			self.setState(inButton ? "hovered" : (inTarget || !target ? "on" : "off"));
			el.removeClass("disabled");
		}
		else {
			el.addClass("disabled");
			self.setState("off", true);
		}
	};
	
	this.setState = function(state, selfCall /*internal*/) {
		if (!selfCall && !enabled) return;
		if (state === "off") {
			if (inButton) el.removeClass("ui-state-active ui-state-hover"); 
			self.setOpacity(offOpacity);	
		}
		else if (state === "on") {
			if (inButton) el.removeClass("ui-state-active ui-state-hover"); 
			self.setOpacity(onOpacity);	
		}
		else if (state === "hovered") {
			if (inButton) el.removeClass("ui-state-active");
			el.addClass("ui-state-hover");
			self.setOpacity(hoverOpacity);		
		}
		else if (state === "active") {
			el.addClass("ui-state-active");
			self.setOpacity(hoverOpacity);	
		}
	};
	
	this.setOpacity = function(o) {
		if (cssTransitions) {	
			var cls = "o" + o;
			if (!el.hasClass(cls)) {
				el.removeClass(removableOpacityClasses).addClass(cls);
			}
		} else {
			if (initialized) {
				el.stop(true, true).animate( {opacity: o/100}, 150 );
			}
			else {
				el.css("opacity", o/100);
			}
			if (opts.hostFix) {
				el.find(".icon, .ui-icon").css("opacity", o/100);	
			}
		}
		return self;	
	}
	
	this._init();	
}

$.ScrollButton.defaults = {
	// int (px) or null.
	nearSize: null,
	// int (px) or null.
	farSize: null,
	// when true, renders the smaller jQuery ui-icons
	smallIcons: false,
	// a selector (string | element | jqObj) if the buttons should be coupled
	// to a target panel or 'null', if buttons should be standalone.
	target: null,
	// when true, uses jQuery position plugin to auto-align the button with the target (if available) 
	autoPosition: true,
	// inside | outside. When autoPosition is true, aligns the button within or outside
	// the boundaries of the target.
	position: "inside",
	// [val]px. When autoPosition is true, shifts the button by this amount 
	// either negative or positive (depends on 'position')
	offset: 0,
	// When true, a 'very transparent' button is visible even the target is not entered.
	// If no target is set, 'false' has no effect, as there would be no chance
	// to 'get the button back'.
	showButtonAlways: false,
	// String (left | right | up | down) or null. Defines the direction of the button.
	// This affects icon-rendering, auto-positioning, corners, borders etc.
	// null means 'get direction from metadata'. If no metadata is set, 'left' is fallback.
	direction: null,
	// When false, the plugin will not attempt to add any ui-corner-classes to the button.
	// When true, *-all is added if autoPosition is true or offset is != 0. If offset is 0,
	// the plugin will determine which corner-class shoul be applied (depending on direction and position) 
	handleCorners: true, // if true, the plugin determines which sides get corners
	// When false, the button is dimmed/hidden and cannot be clicked.
	enabled: true,
	// function( string direction ) returns boolean. Is called for every button within
	// a target when it is entered. Return true, if the button should be enabled or false for disabling.
	canScroll: null,
	// function( string direction ). Slide/scroll here.
	click: null,
	enter: null,
	leave: null
}

$.fn.extend( {
	
	scrollButton: function(options) {
		options = $.extend( {}, $.ScrollButton.defaults, options );
		var buttons = { /* left: null, right: null, up: null, down: null */ };
		var target = options.target ? $(options.target) : null;
		
		if (target) {
			var scrollFn = $.isFunction(options.canScroll) ? options.canScroll : function() { return true; };
			target.bind({
				"mouseenter.scrollbutton": function() {
					_.each(buttons, function(val, i){
						var plugin = val.data("ScrollButton");
						plugin.setInTarget(true);
						plugin.setState("on");
					});
				},
				"mouseleave.scrollbutton": function() {
					_.each(buttons, function(val, i){
						var plugin = val.data("ScrollButton");
						plugin.setInTarget(false);
						plugin.setState("off", true);
					});
				}
			});
		}; // if (target)
		
		return this.each(function() {
			(new $.ScrollButton($(this), buttons, target, options));
		});
	}
	
});

})( jQuery );

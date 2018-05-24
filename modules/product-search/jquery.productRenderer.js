
SMProductList = new Array();

(function ($) {

	var options = null,
		settings = null,
		da = null,
		pkid = null,
		deliveryTimes = null,
		SMProduct = null;
		
	var methods = {
	
		init: function (opts) {
			return this.each(function () {
				normalizeSettings(opts);
			});
		},
	
		isInitialized: function () {
			return options !== null;
		},
	
		render: function(dataAdapter, listOpts, paginatorOpts) {
			return this.each(function () {
				var paginatorRenderer = new $.Renderers.PaginatorRenderer(paginatorOpts);
				listOpts.navBarHtml = paginatorRenderer.getHtml();
				
				var itemCallback = function RenderProductItem(dataAdapt) {
					return getItemHtml(dataAdapt);
				}

				dataAdapter.absolutePage(paginatorOpts.currentPage);
				
				getMediaDimension(dataAdapter);
				Init();

				var listRenderer = new $.Renderers.ListRenderer(listOpts);
				
				$(this)
					.html( listRenderer.getHtml(dataAdapter, itemCallback, paginatorOpts.currentPage) )
					.productListOptimizer({
						alignElemsToGrid: options.alignElemsToGrid,
						alignElemsPerRow: options.alignElemsPerRow,
						imageAlign: options.itemImageAlign,
						gridStyle: $.Grid.style,
						isScrollable: (options.colCount === 0),
						clientSide: true
					});
					
				$('.paginator-init', this).smPaginator({
					linkClasses: paginatorOpts.linkClasses
				});
				$('.btn', this).button();
			});
		}
		
	};  // methods
	
	$.fn.productRenderer = function (method) {		// plugin main
		if (methods[method])
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));

		if (typeof method === 'object' || !method)
			return methods.init.apply(this, arguments);

		$.error('Method ' + method + ' does not exist on jQuery.productRenderer');
		return null;
	};

	
	function getItemHtml(dataAdapter) {		// internal main
		pkid = dataAdapter.fetchRecord();
		da = dataAdapter;
	
		var html = '',
			name = '';
		
		//html = 'page {0}, idx {1}, pkid {2}, {3}'.format(da.absolutePage(), da.pos(), da.record2Val('PKID'), getDesc());
		//html = 'page {0}, idx {1}, pkid {2}<br>{3}'.format(da.absolutePage(), da.pos(), da.record2Val('PKID'), _.decodeUri(da.record2Val('VARVALUES', pkid)));
		
		executeProductJSInitCode();
		getDiscounts();
		
		if (options.showName) {
			name = getName( _.decodeUri(da.record2Val('PRODUCTNAME')), options.isTitleLinked );
		}
		
		if (options.displayTitlesOnTop) {
			html += name;
		}
	
		if (options.showItemImages) {
			html += getMediaItem();
		}
		
		html += '<div class="{0}" style="{1}">'.format(settings.plInfosheet.className, settings.plInfosheet.css);
	
		if (!options.displayTitlesOnTop) {
			html += name;
		}
		
		html += getDesc();
		
		if (options.colCount === 1) {
			html += getPartsList(false, false);
			html += getPriceBlock(false);
			html += getDataSheet();
		}
		else {
			html += getDataSheet();
			html += getPartsList(true, false);
			html += getPriceBlock(true);
		}
		
		html += getDiscountSign(true);
		
		html += '</div>';	
		return html;
	}
	
	function getMediaDimension(dataAdapter) {
		var width, height, tempWidth, tempHeight, imgName;
		
		settings.media.mediaMaxWidth = settings.media.mediaMaxHeight = 0;
		
		if (options.itemImageAlign === 'none' || dataAdapter.length <= 0) {
			return;
		}
	
		dataAdapter.moveFirst();
		
		//console.log(dataAdapter.length() + " - " + dataAdapter.eof());	
		while (!dataAdapter.eof()) {
			//console.log(settings.media.mediaMaxWidth + " - " + settings.media.mediaMaxHeight);
			pkid = dataAdapter.fetchRecord();
			imgName = dataAdapter.record2Val('THUMBNAME', pkid);
			
			if (!_.isEmpty(imgName)) {
				width = toInt(dataAdapter.record2Val('THUMBWIDTH', pkid), 0);
				height = toInt(dataAdapter.record2Val('THUMBHEIGHT', pkid), 0);
				
				if (width > 0 && height > 0) {
					tempWidth = (options.maxImageWidth == 0 ? width : Math.min(width, options.maxImageWidth));
					tempHeight = (options.maxImageHeight == 0 ? height : Math.min(height, options.maxImageHeight));
					
					settings.media.mediaMaxWidth = Math.max(settings.media.mediaMaxWidth, tempWidth);
					settings.media.mediaMaxHeight = Math.max(settings.media.mediaMaxHeight, tempHeight);
				}
			}
			//console.log(dataAdapter.length() + " - " + dataAdapter.eof() + " - " + dataAdapter.pos());
			dataAdapter.moveNext();
			//console.log(dataAdapter.length() + " - " + dataAdapter.eof()+ " - " + dataAdapter.pos());
		}
		
		dataAdapter.moveFirst();
	}
	
	function getName(name, isLinked) {	
		if (options.colCount !== 1) {
			name = _.truncate(name, 70, '...');
		}		
		
		if (isLinked) {
			name = '<a href="{0}" target="{1}">{2}</a>'.format( getItemHref(), getItemTarget(), name );
		}

		return '<h4 class="{0}" style="{1}">{2}</h4>'.format(settings.plName.className, settings.plName.css, name);
	}
	
	function getDesc() {
		var shortDesc = _.decodeUri( da.record2Val('SHORTDESC') ),
			html = '<div class="{0}" style="{1}">'.format( settings.plDesc.className, settings.plDesc.css );
		
		if (options.showItemDesc && shortDesc.length > 0) {
			html += _.truncate(shortDesc, options.descMaxLength, '...');
		}
		
		html += '</div>';		
		return html;
	}
	
	function getDiscounts() {	
		options.hasDefaultDiscount = false;
		options.defaultDiscountType = 0;
		options.itemDiscData = '';

		//if( toBool(da.record2Val('HASDISCOUNTS', pkid), false) ) {	// gibt's in der Datenquelle nicht
			var sQtyDiscounts = da.record2Val('QTYDISCOUNTS', pkid);
			if (sQtyDiscounts.length > 0) {
				var arrDiscount, arrDiscounts = sQtyDiscounts.split(',');
				
				for (var j=0; j < arrDiscounts.length; j++) {
					arrDiscount = arrDiscounts[j].split('|');
					options.itemDiscData += 'SMProduct.discounts.add({0}, {1}, {2}, "{3}");'.format( arrDiscount[0], arrDiscount[1], arrDiscount[2], _.decodeUri(arrDiscount[3]) );
					
					if(toInt(arrDiscount[0]) <= toInt(da.record2Val('MINORDERQTY'))) {
						options.hasDefaultDiscount = true;
					}
				}
			}
		//}
	}
	
	function getDiscountSign() {
		var html = '';
		
		//if( toBool(da.record2Val('HASDISCOUNTS', pkid), false) ) {
		if (options.itemDiscData.length > 0) {
			html += '<div class="ui-corner-tr ui-corner-bl discount"><span>%</span></div>';
		}
		return html;
	}

	function getDataSheet(){ 
		var html = '<div class="{0}" style="{1}">'.format(settings.plDatasheet.className, settings.plDatasheet.css);
		
		html += '<table>';
		html += getProps();
		html += getVariants();
		html += '</table>';
		html += '</div>';
		
		return html;
	}
	
	function getProps() {
		var html = '',
			deliveryCssIdx = '',
			deliveryText = '',
			weight = toFloat( _.decodeUri(da.record2Val('WEIGHT', pkid)) ),
			deliveryIndex = toInt( da.record2Val('DELIVERYTIMEIMAGE', pkid) );
		
		html += getDataSheetItem( options.showID , T['lbl.product-id'] , _.decodeUri(da.record2Val('PRODUCTID')) );
		html += getDataSheetItem( options.showEAN , T['lbl.product-ean'] , _.decodeUri(da.record2Val('EAN')) );
		html += getDataSheetItem( options.showWeight , T['lbl.product-weight'] , weight + ' ' + options.defaultWeightUnit );
		html += getDataSheetItem( options.showManufact , T['lbl.manufacturer'] , _.decodeUri(da.record2Val('MANUFACTNAME')) );
				
		if (options.showDeliveryTime && deliveryIndex > 0) {
			if (!deliveryTimes) {
				deliveryTimes = JSON.parse(options.deliveryTimes);
			}
		
			for (var i=0; deliveryTimes && i < deliveryTimes.length; ++i) {
				if (deliveryTimes[i].id === deliveryIndex) {
					deliveryCssIdx = deliveryTimes[i].fname;
					deliveryText = _.decodeUri(deliveryTimes[i].name);
					break;
				}
			}
			
			if(deliveryCssIdx !== '' && deliveryText !== '') {
				deliveryCssIdx = deliveryCssIdx.replace('symbol_deliv_', '').replace('.png', '');
			
				html += '<tr>';
				html += '<td class="pl-itemcaption ellipsis">{0}</td>'.format( T['lbl.delivery-time'] );
				html += '<td class="pl-itemvalue"><span class="delivtime delivtime-{0}">'.format(deliveryCssIdx);
				html += '<figure title="{0}">&nbsp;</figure>'.format(deliveryText);
				
				if (options.showDeliveryTimeText) {
					html += '<span class="smaller">{0}</span>'.format(deliveryText);
				}
				
				html += '</span></td>';
				html += '</tr>';
			}
		}
		return html;
	}
	
	function getVariants() {
		var html = '';
		
		if (options.showVariants) {
			var arr,
				varString = _.decodeUri(da.record2Val('SERIALIZEDVARSTRING')),
				arrVariants = toStr(varString).split('{EOL}');
			
			for (var i=0, length = arrVariants.length; i < length; i++) {
				if (!_.isEmpty(arrVariants[i])) {
					arr = arrVariants[i].split(': ');
					if (arr.length > 1) {
						html += getDataSheetItem(true , arr[0] + ':', arr[1]);
					}
				}
			}
		}
		return html;
	}
	
	function getDataSheetItem(show, caption, value) {
		value = toStr(value);
		if ( show && !(_.isEmpty(caption) && _.isEmpty(value)) ) {	
			return '<tr><td class="pl-itemcaption ellipsis">{0}</td><td class="pl-itemvalue ellipsis">{1}</td></tr>'.format(
				_.isEmpty(caption) ? '&nbsp;' : caption,
				_.isEmpty(value) ? '-' : value);
		}
		return '';
	}
	
	function getPriceBlock(small) {
		var price = '',
			hasDefaultDiscount = options.hasDefaultDiscount,
			defaultDiscountType = options.defaultDiscountType,
			priceConfig = toInt(da.record2Val('PRICINGCONFIGURATION', pkid));
			
		if ( !options.showPrice && !options.showAddToBag ) {
			return price;
		}
		
		price += '<div class="{0}" style="{1}">'.format(settings.plSales.className, settings.plSales.css);
		
		if (priceConfig === 3) {
			price += '<div class="pr-on-request">{0}</div>'.format( T['lbl.price-on-demand'] );
		}
		else if(priceConfig !== 1) {
			if (options.showPrice) {
				var baseCategoryDiscount = toInt(da.record2Val('BASECATEGORYDISCOUNT', pkid)),
					pricePrefix = toStr( _.decodeUri(da.record2Val('PRICEPREFIX', pkid)) ),
					priceSuffix = toStr( _.decodeUri(da.record2Val('PRICESUFFIX', pkid)) ),
					discountPrefix = toStr( _.decodeUri(da.record2Val('DISCOUNTPREFIX', pkid)) ),
					hideListPrice = toBool(da.record2Val('HIDELISTPRICE', pkid)),
					displayBasePrice = toBool(da.record2Val('DISPLAYBASEPRICE', pkid)),
					shippingSurcharge = toFloat(da.record2Val('SHIPPINGSURCHARGE', pkid), 0),
					shippingCostsLink = T['exp.ship-costs-info'],
					surchargeInfo = T['exp.ship-surcharge-info'];
				
				if (baseCategoryDiscount > 0 || (hasDefaultDiscount && defaultDiscountType != 2)) {
					if(!hideListPrice) {
						price += '<div class="pr-pre-panel larger{0}">'.format(options.colCount == 1 ? " quiet" : "");
						if (options.showPricePrefix && pricePrefix.length > 0 && !small) {
							price += '<span class="pr-pre-label">{0} </span>'.format(pricePrefix);
						}
						price += '<span class="pr-pre-price">{0}</span></div>'.format( cprimary.format(SMProductList[pkid].getOriginalPrice(), SM_CGROUP + SM_CSYMBOL) );
					}
					
					price += '<div class="pr-now-panel">';
					if (options.showPricePrefix && discountPrefix.length > 0 && !small) {
						price += '<span class="pr-now-label bold">{0} </span>'.format(discountPrefix);
					}
				}
				else {
					price += '<div class="pr-now-panel">';
					if (options.showPricePrefix && pricePrefix.length > 0 && !small){
						price += '<span class="pr-now-label bold">' + pricePrefix + ' </span>';
					}				
				}
				
				price += '<span class="pr-now-price {0}">{1} *</span>'.format(
					small ? 'x-larger' : 'nice xx-larger', cprimary.format(SMProductList[pkid].getPrice(), SM_CASHTML | SM_CGROUP | SM_CSYMBOL)
				);
				
				price += '</div>';
				
				if (options.showSecCur && !small) {
					price += '<div class="pr-sec-price quiet">{0}</div>'.format( csecondary.format(SMProductList[pkid].getPrice(), SM_CGROUP + SM_CSYMBOL) );
				}
				
				if ( baseCategoryDiscount > 0 || (hasDefaultDiscount && defaultDiscountType != 2) && !small) {
					if (!hideListPrice && options.showDifference) {
						price += '<div><span class="pr-save-label bold">{0} </span><span class="pr-save-price">{1}</span></div>'.format(
							T['lbl.product-price-difference'],
							cprimary.format(SMProductList[pkid].getOriginalPrice() - SMProductList[pkid].getPrice(), SM_CGROUP + SM_CSYMBOL)
						);
					}
				}

				if (options.showPriceSuffix && priceSuffix.length > 0) {
					price += '<div class="pr-now-suffix bold{0}">{1}</div>'.format( small ? "" : " larger",	priceSuffix );
				}

				options.showTax = !(toBool(da.record2Val('NOTAX', pkid), false));
				
				if ( (options.showTax || shippingCostsLink.length > 0 || shippingSurcharge > 0 || (options.showPriceBase && displayBasePrice)) && !small ) {
					price += '<div class="legal-hints smaller x-quiet">';
					
					if (options.showTax && options.showVATInfos) {
						price += '<div class="pr-vat-hint">{0} ({1}%)</div>'.format(
							options.displayGrossPrice ? T['lbl.vat-incl-info'] : T['lbl.vat-excl-info'], da.record2Val('TAXPERCENT', pkid) );
					}
					
					if (shippingSurcharge > 0 && surchargeInfo.length > 0) {
						price += '<div class="pr-transp-hint">' + surchargeInfo.replace('%su', cprimary.format(shippingSurcharge, SM_CGROUP + SM_CSYMBOL)) + '</div>';
					}

					if (shippingCostsLink.length > 0) {
						price += '<div class="pr-ship-hint">{0}</div>'.format(shippingCostsLink);
					}
					
					if (options.showPriceBase && displayBasePrice && !(da.record2Val('MUAMOUNT') == 1 && da.record2Val('MUBASE') == 1)) {
						price += '<div class="pr-pangv">({0})</div>'.format( formatProductBasePrice(SMProductList[pkid]) );
					}
					
					price += '</div>';
				}
			}
			
			if (!small) {
				price += '<div class="pl-controls">';
			}

			//if (options.showAddToBag) {
				var AddToBagOpts = {
					da:						da,
					showCaption:			false,//options.showQtyCaption,
					showQtyField: 			small ? false : options.showQtyInput,
					showQtyUnit: 			options.showQtyUnit,					
					showAddToBag: 			(options.showAddToBag && priceConfig == 0),
					showDetail: 			(options.showMore && getItemHref().length > 0),
					displaySmallInfoButton:	true,
					displaySmallAddButton: 	false,
					isSmallAddCaption: 		small ? true : false,
					detailsLink:			getItemHref()
				}
				
				var basketPanelRenderer = new $.Renderers.BasketPanelRenderer( AddToBagOpts );
				price += '<div class="pl-add-to-bag">' + basketPanelRenderer.getHtml() + '</div>';
			//}
			
			if (!small) {
				price += '</div>';
			}
		}

		price += '</div>';
		return price;
	}
	
	function getImageName() {
		var imgName = da.record2Val('THUMBNAME', pkid);
		
		if (imgName.substring(0, 5) === 'http:') {
			return imgName;
		}
		
		if (!_.isEmpty(imgName)) {
			//var oldName = imgName;
			if (imgName.indexOf('images/') !== -1) {	// relative path like '../../images/img_nopic_small.jpg' ??
				imgName = imgName.slice( imgName.lastIndexOf('/') + 1 );	// get file name
				imgName = SMOMAbsoluteRootURL + '/images/' + imgName;
			}
			else {
				imgName = options.mediaPath + 'media/images/' + imgName;
			}
			//console.log(oldName + ', ' + imgName);
			
			/*if (imgName.indexOf('images/') == -1 && imgName.substring(0, 5) != 'http:') {
				imgName = options.mediaPath + 'media/images/' + imgName;
			}
			else if (imgName.substring(0, 5) != 'http:') {
				imgName = options.basePath + imgName;	// wouldn't work anymore
			}*/
		}
		return imgName;
	}
	
	function getMediaItem() {
		var html = '',
			imgName = getImageName(),
			imgWidth = da.record2Val('THUMBWIDTH', pkid),
			imgHeight = da.record2Val('THUMBHEIGHT', pkid);
			
		html += '<figure class="{0}" style="{1}">'.format(settings.plFrameParent.className, settings.plFrameParent.css);
		
		if (!_.isEmpty(imgName)) {	//&& options.itemImageAlign !== 'none'
			var imgCss = '{0}width:{1}px; height:{2}px;'.format(settings.plImg.css, imgWidth, imgHeight);
						
			if (options.linkItemImages) {
				html += '<a href="{0}" target="{1}"><img src="{2}" style="{3}"></a>'.format(getItemHref(), getItemTarget(), imgName, imgCss);
			}
			else {
				html += '<img src="{0}" style="{1}">'.format(imgName, imgCss);
			}
		}
		
		html += '</figure>';
		return html;
	}

	function getPartsList(table, showSeps) {
		return '';	// wird in der Produktsuche nicht ausgegeben
	}
		
	function getItemHref() {
		var href = toStr(da.record2Val('WEBPATH', pkid)),
			noDetailPage = toBool(da.record2Val('NODETAILPAGE')),
			isSmartLink = toBool(da.record2Val('ISSMARTLINK', pkid)),
			smartLinkType = toInt(da.record2Val('SMARTLINKTYPE', pkid));
		
		if (!_.isEmpty(href)) {	
			if (href.charAt(0) == '.') {
				href = href.substring(1);
			}
		
			if (!options.appPreviewMode) {
				if ( !isSmartLink || (isSmartLink && smartLinkType != 99) ) {
					if (href.charAt(0) != '/') {
						href = '/' + href;
					}
					href = SMOMAbsoluteRootURL + href;
				}
			}
			
			if (href === '' && !noDetailPage) {
				href = 'product:' + pkid;
			}
		}
		return (href === '' ? '#' : href);
	}

	function getItemTarget() {
		if ( toBool(da.record2Val('ISSMARTLINK', pkid)) ) {
			return toStr( _.decodeUri(da.record2Val('SMARTLINKTARGET')) );
		}
		return '';
	}
	
	function executeProductJSInitCode() {
		var mediaFileSrc = '',
			imgName = getImageName(),
			noDetailPage = toBool(da.record2Val('NODETAILPAGE')),
			isSmartLink = toBool(da.record2Val('ISSMARTLINK', pkid)),
			smartLinkType = toInt(da.record2Val('SMARTLINKTYPE', pkid)),
			displayBasePrice = toBool(da.record2Val('DISPLAYBASEPRICE', pkid)),	
			muAmount = toFloat(da.record2Val('MUAMOUNT', pkid), 1),
			muBase = toFloat(da.record2Val('MUBASE', pkid), 1),
			variantHeader = toStr( _.decodeUri(da.record2Val('VARHEADER', pkid)) ),
			variantValues = toStr( _.decodeUri(da.record2Val('VARVALUES', pkid)) ),
			minQuantity = parseFloat(da.record2Val('MINORDERQTY', pkid)),
			noInternalDetail = (noDetailPage && !isSmartLink) || (isSmartLink && smartLinkType == 99);
			
		SMProduct = SMProductList[pkid] = SMShop.createProduct();
		
		SMProduct.set(
			da.record2Val('PRODUCTID'),
			pkid,
			toInt(da.record2Val('TAXKEY', pkid)),
			toBool(da.record2Val('NOTAX', pkid)),
			toFloat(da.record2Val('SELLINGPRICE', pkid)),
			toFloat(da.record2Val('BASECATEGORYDISCOUNT', pkid)),
			toFloat(da.record2Val('WEIGHT', pkid)),
			da.record2Val('PRODUCTNAME'),
			da.record2Val('SHORTDESC'),
			mediaFileSrc,
			minQuantity,
			parseFloat(da.record2Val('MAXORDERQTY', pkid)),
			toInt(da.record2Val('ORDERQTYSTEP', pkid)),
			toInt(da.record2Val('OQTYPE', pkid)),
			toFloat(da.record2Val('OQDEFVALUE', pkid)),
			toInt(da.record2Val('OQDDOPTIONSCOUNT', pkid)),
			_.decodeUri(da.record2Val('QTYUNIT', pkid)),
			da.record2Val('SHIPPINGSURCHARGE', pkid),
			(noInternalDetail ? 'location.href' : getItemHref()),
			toInt(da.record2Val('DELIVERYTIMEIMAGE', pkid)),
			toStr( _.decodeUri(da.record2Val('EAN')) ),
			toStr(da.record2Val('MANUFACTNAME')),
			(displayBasePrice ? muAmount : 1),
			(displayBasePrice ? muBase : 1),
			(displayBasePrice ? toStr(da.record2Val('MEASUREUNIT', pkid)) : '""'),
			toInt(da.record2Val('PRODUCTTYPE', pkid))
		);

		if (!_.isEmpty(imgName)) {
			SMProduct.setAttribute(_SMAThumb, imgName);
		}
		
		if (variantHeader.length > 0) {
			eval(variantHeader);
			eval(variantValues);
		}
				
		//if( toBool(da.record2Val('HASDISCOUNTS', pkid), false) ) {	// ist immer false!?
		var sQtyDiscounts = da.record2Val('QTYDISCOUNTS', pkid);
		
		if (sQtyDiscounts.length > 0) {
			var arrDiscount, arrDiscounts = sQtyDiscounts.split(',');
			
			for (var j=0; j < arrDiscounts.length; j++) {
				arrDiscount = arrDiscounts[j].split('|');
				SMProduct.discounts.add(arrDiscount[0], arrDiscount[1], arrDiscount[2], _.decodeUri(arrDiscount[3]));
			}
		}
		SMProduct.update();
	}	
	

	function Init() {
		if (options.displayTitlesOnTop) {
			settings.plName.css += "margin-bottom: {0}px;".format( $.Grid.marginRight );
		}
		
		if (options.colCount === 1) {
			settings.plFrameParent.css += "width: {0}px;height: {1}px;margin-right: {2}px;".format( 
				settings.media.mediaMaxWidth, 
				settings.media.mediaMaxHeight,
				$.Grid.marginLeft + $.Grid.marginRight );
		}
		else {
			settings.plFrameParent.css += "height: {0}px;".format( settings.media.mediaMaxHeight );
			
			// align images horizontal
			switch (options.itemImageAlign) {
				case 'near':
					settings.plFrameParent.className += ' al';
					break;
				case 'center':
					settings.plFrameParent.className += ' ac';
					break;
				case 'far':
					settings.plFrameParent.className += ' ar';
					break;
				case 'none':
					settings.plFrameParent.className += ' d-n';
					break;
			}
		}

		//set max-width or max-height when not 0
		if ( (options.maxImageWidth != 0) || (options.maxImageHeight != 0) ) {
			if (options.maxImageWidth != 0) {
				settings.plImg.css += "max-width:{0}px;height:auto !important;".format(options.maxImageWidth);
			}
			if (options.maxImageHeight != 0) {
				settings.plImg.css += "max-height:{0}px;width:auto !important;".format(options.maxImageHeight);
			}
		}

		if (options.displayLargeTitles) {
			settings.plName.className += (options.colCount == 1) ? " x-larger" : " larger";
		}
		else {
			settings.plName.className += (options.colCount == 1) ? " larger" : "";
		}
	}
	
	function normalizeSettings(opts) {
		settings = {
			media: {
				images:			[],
				mediaMaxWidth:	0,
				mediaMaxHeight:	0
			},
			plFrameParent:		{ css: "", className: "pl-frame-parent" },
			plImg:				{ css: "", className: "pl-img" },
			plDatasheet:		{ css: "", className: "pl-datasheet smaller quiet" },
			plInfosheet:		{ css: "", className: "pl-infosheet" },
			plDesc:				{ css: "", className: "pl-desc" },
			plName:				{ css: "", className: "pl-name" },
			plSales:			{ css: "", className: "pl-sales" }
		};	
	
		options = $.extend({
			//datasheet
			showID:					false,
			showEAN: 				false,
			showWeight:				false,
			showManufact:			false,
			showDeliveryTime:		false,
			showDeliveryTimeText:	false,
			
			//pricing
			showPrice:				true, 			//toBool(xel.getAttribute("show-item-price"), true)
			showPricePrefix:		true, 			//toBool(xel.getAttribute("show-item-price-prefix"), true)
			showPriceSuffix:		true,			//toBool(xel.getAttribute("show-item-price-suffix"), true)
			showDifference:			true,			//toBool(xel.getAttribute("show-item-difference"), false)
			showPriceBase:			false,			//toBool(xel.getAttribute("show-item-price-base"), false)
			showVATInfos:			true,			//toBool(api.getProjectSetting("show-vat-infos"), true)
			
			showSecCur:				false,
			displayGrossPrice:		true,
			defaultWeightUnit: 		"",
			
			//discounts
			hasDefaultDiscount:		false,			// plSettings.plItemDefDiscount
			defaultDiscountType:	0,				// plSettings.plItemDefDiscType
			itemDiscData:			"",				// plSettings.plItemDiscData
			
			showAddToBag:			true,			// toBool(xel.getAttribute("show-addtobag"), true)
			showMore:				false,			// toBool(xel.getAttribute("show-item-more-link"), true)
			showQtyInput:			true,			// toBool(xel.getAttribute("show-qty-input"), false)
			showQtyUnit:			false,			// toBool(xel.getAttribute("show-qty-unit"), false)
			
			showItemImages:			true, 			//toBool(xel.getAttribute("show-item-image"), true)
			isPicture:				true,			//toStr(xel.getAttribute("item-image-style"), "thumb") == "picture")
			showNoPic: 				true,			//toBool(xel.getAttribute("item-image-show-nopic"), true)
			linkItemImages:			true,			//toBool(xel.getAttribute("link-item-images"), true)
			showVariants:			true,			//toBool(xel.getAttribute("show-item-variants"), false)
			showItemPartsList:		false, 			//toBool(xel.getAttribute("show-item-partslist"), true)
			navBarPos:				"bottom",		//toStr(xel.getAttribute("navbar-position"), "bottom")
			navbarAlign:			"right",		//toStr(xel.getAttribute("navbar-align"), "right")
			maxItems:				0,				//toInt(xel.getAttribute("max-items-per-page"), 0)
			descMaxLength: 			255,			//toInt(xel.getAttribute("item-description-maxlength"), 0)
			
			displayTitlesOnTop:		false,			//toBool(xel.getAttribute("display-titles-ontop"), false)
			isTitleLinked:	 		true,			//toBool(xel.getAttribute("link-item-titles"), true)
			displayLargeTitles: 	false,			//toBool(xel.getAttribute("large-item-titles"), false)
			itemImageAlign: 		"center",		//toStr(xel.getAttribute("item-image-align"), "left") 
			showName: 				true,			//toBool(xel.getAttribute("show-item-name"), true)
			showItemDesc: 			true,			//toBool(xel.getAttribute("show-item-description"), true)
			buttonAlign:			"far",			//toStr(xel.getAttribute("buttons-align"), "far")
			
			colCount: 				3,				//toInt(xel.getAttribute("columns-count"), 3)
			currentPage:			1,
			
			alignElemsToGrid:		true,			//toBool(xel.getAttribute("align-elements-to-grid"), true)
			alignElemsPerRow:		false,			//toBool(xel.getAttribute("align-elements-per-row"), false)
			
			maxImageWidth:			0,
			maxImageHeight:			0
		}, opts);
	}

})(jQuery);
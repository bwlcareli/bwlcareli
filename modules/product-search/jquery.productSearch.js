(function ($) {
    
    var settings = {},
		deliveryTimes = '';
    
	var methods = {
	
		init: function (strSettings, strDeliveryTimes) {
			// settings normalisieren
			settings = JSON.parse(strSettings);
			deliveryTimes = strDeliveryTimes;
			
			if (settings.thumbAlign === 'left') {
				settings.thumbAlign = 'center';
			}
			if (settings.itemDescMaxLength === 0) {
				settings.itemDescMaxLength = 255;
			}
				
			// init jQuery ui tabs
			$('.product-search-tabs', this).tabs({
				hasBgGradient: true,
				show: function(event, ui) {
					eventHandlerTabShow( $(ui.panel).attr('id') );
				}
			});
			
			// paginator click
			$('a.' + settings.moduleID).live('click', function() {
				// unschön so was, besser wären pseudo-klassen + data-attribute:
				var isDisabled = ($(this).parent('li').attr('class').indexOf('disabled') !== -1);
							
				if (!isDisabled) {					
					var page = $(this).attr('data-page');
					
					if (page === '>') {
						page = settings.currentPage + 1;
					}
					else if (page === '<') {
						page = settings.currentPage - 1;
					}
					else if (page === '<<') {
						page = 0;
					}
					else if (page === '>>') {
						page = settings.totalPages;
					}
					else {
						page = parseInt(page);
					}
					
					//console.log('page ' + page);
					
					if (!isNaN(page)) {					
						if (page < 1) {
							page = settings.currentPage - 1;
						}
						else if (page > settings.totalPages) {
							page = settings.currentPage + 1;
						}
						methods.showPage(page);
					}
				}
				return false;
			});
												
			// category indentation
			$('#category-button').live('mouseup', categoryIndentation);
			
			// place loader icon hidden in DOM
			$({}).loaderIcon(false);

			autoSearch();
			return this;
		},
		
		showPage: function(pagenum) {
			kickProcessing(function() {
				try {
					getPage(settings, pagenum);
				}
				catch (err) {
					setStatus(err.name + ': ' + err.message, true);
				}
				
				$('#' + settings.moduleID).loaderIcon(false);			
			});
			return false;
		},
		
		startSearch: function(formularID, searchFilter) {
			if (!isDesginMode(true)) {
				if (typeof searchFilter === 'boolean' && searchFilter) {
					settings.searchFilter = searchFilter;
				}
				
				settings.frmSearch = document.getElementById(formularID);
				startSearching();
			}		
			return false;
		}		
		
	};  // methods
	
	$.fn.productSearch = function (method) {		// plugin main
		if (methods[method])
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));

		if (typeof method === 'object' || !method)
			return methods.init.apply(this, arguments);

		$.error('Method ' + method + ' does not exist on jQuery.productSearch');
		return null;
	};


	function kickProcessing(callbackProcessing) {
		$('#' + settings.moduleID).loaderIcon(true);
		setTimeout(callbackProcessing, 100);
	}
	
	function isDesginMode(inform) {
		if (settings.txtDesignMode.length > 0) {
			if(inform ? inform : false) {
				setStatus(settings.txtDesignMode, true);
			}
			return true;
		}
		return false;
	}
	
	function categoryIndentation() {
		var depth, depthFactor = 15;
		$selectList = $('#category option');
		
		$('#category-menu li a').each(function(index) {
			depth = parseInt( $selectList.eq(index).attr('data-opt') ) || 0;
			
			//console.log($selectList.eq(index).attr('data-opt') + ', ' + $selectList.eq(index).text());
			
			if (depth > 0) {
				$(this).css('padding-left', (depth * depthFactor) + 'px');
			}
			else if (depth === 0 && index > 0) {
				$(this).css('font-weight', 'bold');
			}
		});
	}

	function autoSearch() {
		if (isDesginMode(false)) {
			return;
		}
			
		var sQuery = window.location.search.toString(),
			sTab = settings.moduleID + '-general',
			sForm = 'frmGeneral',
			frmSearch = null,
			arrQuery = new Array();
			
		var arrQuery = initGetVars(sQuery, arrQuery);
						
		if (!arrQuery['searchterm']) {
			sQuery = SMShop.xml.getAttribute('search-query');
			arrQuery = initGetVars(sQuery, arrQuery);
						
			if (!arrQuery['searchterm']) {
				document.getElementById(sForm).term.focus();
				scrollToModule();
				return;
			}
		}
		
		if (arrQuery['searchterm']) {
			settings.searchTerm = _.decodeUri(arrQuery['searchterm']);
		}
		if (arrQuery['manufact']) {
			settings.searchManufact = toInt(arrQuery['manufact']);
		}
		if (arrQuery['category']) {
			settings.searchCategory = toInt(arrQuery['category']);
		}
		if (arrQuery['maxprice']) {
			settings.searchMaxPrice = toInt(_.decodeUri(arrQuery['maxprice']));
		}
		if (arrQuery['desconly']) {
			settings.searchDescOnly = toBool(arrQuery['desconly']);
		}		
		if (arrQuery['termfilter']) {
			settings.termFilter = toInt(arrQuery['termfilter']);
		}
		if (arrQuery['productid']) {
			settings.searchProductId = toBool(arrQuery['desconly']);
		}
		
		if (arrQuery['method']) {
			switch (arrQuery['method'].toString()) {
				case '1':
					sTab = settings.moduleID + '-advanced';
					sForm = 'frmAdvanced';
					break;
				case '2':
					sTab = settings.moduleID + '-productid';
					sForm = 'frmProductId';
					break;
			}
		}

		frmSearch = document.getElementById(sForm);	
		frmSearch.term.value = settings.searchTerm;
		
		eventHandlerTabShow(sTab, true);
		
		if (arrQuery['dosearch'].toString() == '1') {
			settings.frmSearch = frmSearch;
			
			if (arrQuery['pagenum']) {
				settings.currentPage = toInt(arrQuery['pagenum']);
			}

			startSearching();
		}
	}
	
	function eventHandlerTabShow(activeTabID, doSwitch) {
		if (doSwitch ? true : false) {
			$('#' + settings.moduleID + ' .product-search-tabs').tabs('select', activeTabID);
		}
			
		if (activeTabID.indexOf('-advanced') !== -1) {
			var term = $('#frmGeneral input[name=term]').val();
			if (term.length > 0) {
				$('#termadvanced').val(term);
			}
			if (settings.searchManufact > 0) {
				$('select[id=manufacturer] option').removeAttr('selected').siblings('[value="' + settings.searchManufact + '"]').attr('selected', 'selected');
			}
			if (settings.searchCategory > 0) {
				$('select[id=category] option').removeAttr('selected').siblings('[value="' + settings.searchCategory + '"]').attr('selected', 'selected');
			}
			if (settings.searchMaxPrice > 0) {
				$('input[id=maxprice]').val(settings.searchMaxPrice.toString());
			}
			if (settings.searchDescOnly) {
				$('input[id=searchdesc]').attr('checked', 'checked');
			}
			if (settings.termFilter >= 0) {
				$('input[name=termfilter]').removeAttr('checked').eq(settings.termFilter).attr('checked', 'checked');
			}
			
			$.smartform.update( $('#frmAdvanced').smartform().elements );
		}
		else if (activeTabID.indexOf('-general') !== -1) {
			var term = $('#termadvanced').val();
			if (term.length > 0) {
				$('#frmGeneral input[name=term]').val(term);
			}			
		}

		setTimeout(function() {
			$('#' + activeTabID + ' [name=term]').focus();
		}, 200);
	}

	function startSearching() {
		var completeCount = 0;
	
		function kickAjax(url, callID) {
			var data = (settings.phpPowerSearch ? 'searchterm=' + _.encodeUri(settings.frmSearch.term.value) + '&t=' + Date.parse(new Date) : '');

			$.ajax({
				url: url,
				data: data,
				dataType: 'text',
				mimeType: 'text/plain; charset=x-user-defined',
				error: function(jqXHR, textStatus, errorThrown) {
					var str = (_.isEmpty(textStatus) ? '' : textStatus);
					if (!_.isEmpty(errorThrown)) {
						str += (str.length > 0 ? ', ' + errorThrown : errorThrown);
					}
					if (str.length > 0) {
						setStatus(str, true);
					}
				},
				complete: function(response) {
					var gotAllData = (++completeCount >= 2 || settings.phpPowerSearch);
					
					try {
						if (callID === 0) {
							var arrResponse = response.responseText.split('[SM_PRODUCTS_DATA]\n');
							setSearchIndex(arrResponse[0]);
							setSearchData(arrResponse[1]);
						}
						else if (callID === 1) {
							setSearchIndex(response.responseText + '\n');
						}
						else if (callID === 2) {
							setSearchData(response.responseText + '\n');
						}
					}
					catch (err) {
						setStatus(err.name + ': ' + err.message, true);
					}
					
					if (gotAllData) {
						searchFile(settings);
						$('#' + settings.moduleID).loaderIcon(false);
					}
				}
			});		
		}
		
		kickProcessing(function() {
			var doAjax = (settings.searchindex == null || (settings.phpPowerSearch && settings.newSearch));
					
			if (doAjax) {
				if (settings.phpPowerSearch) {
					kickAjax(settings.moduleBase + 'powersearch.php', 0);
				}
				else {
					kickAjax(settings.moduleBase + 'searchindex.txt', 1);
					kickAjax(settings.moduleBase + 'searchdata.txt', 2);
				}			
			}
			else {	// lokale Daten verwenden
				searchFile(settings);
				$('#' + settings.moduleID).loaderIcon(false);			
			}		
		});
	}
	
	function searchFile(s) {
		try {
			var term = _.trim(s.frmSearch.term.value);
		
			if (term.length <= 0) {
				setStatus(s.txtTermEmpty, true);
				s.frmSearch.term.focus();
				return;
			}
			
			setSearchResult('');
			s.newSearch = (_.encodeUri(term) != _.encodeUri(s.searchTerm));
			s.searchTerm = term;
			s.searchProductId = (s.frmSearch.id == 'frmProductId');
			s.itemCount = 0;
			
			if (s.frmSearch.id == 'frmAdvanced' && s.searchFilter) {
				s.searchManufact = getValue('manufacturer');
				s.searchCategory = getValue('category');
				s.searchDescOnly = getValue('searchdesc');
				s.termFilter = getRadioIndex(s.frmSearch.termfilter);
				s.searchEntireWords = s.frmSearch.termfilter[1].checked;
				s.searchEntireTerm = s.frmSearch.termfilter[2].checked;
				setMaxPrice(s);
			}
			else {
				s.searchManufact = 0;
				s.searchCategory = 0;
				s.searchMaxPrice = 0;
				s.searchDescOnly = false;
				s.searchEntireWords = false;
				s.searchEntireTerm = false;
			}
			
			if (s.newSearch || s.phpPowerSearch || s.arrFirstFilter == null || s.searchEntireWords || s.searchEntireTerm) {
				s.arrFirstFilter = plainTextFilter(s, s.searchindex, s.searchTerm);
			}

			if (s.searchFilter) {
				s.arrResult = detailedFilter(s);
			}
			else {
				if (s.arrFirstFilter != null) {
					s.arrResult = s.arrFirstFilter;
				}
				else {
					s.searchTerm = splitTerm(s);
					s.arrFirstFilter = plainTextFilter(s, s.searchindex, s.searchTerm);
					s.arrResult = (s.arrFirstFilter ? s.arrFirstFilter : new Array());					
				}
			}
			
			if (s.arrResult.length > 0) {
				s.totalPages = 1;			
				s.itemCount = s.arrResult.length;

				if (s.maxItemsPerPage > 0) {
					s.totalPages = parseInt( Math.round((s.itemCount / s.maxItemsPerPage) + 0.49) );
				}

				getPage(s, s.currentPage);				
			}
			else {
				if (s.searchFilter) {
					s.arrFirstFilter = null;
					setStatus(settings.txtNoResult);
					
					setSearchResult(
						'<a href="javascript:void(0)" onclick="return $(\'#{0}\').productSearch(\'startSearch\', \'{1}\', false)">{2}</a>'.format(
							settings.moduleID, s.frmSearch.id, settings.txtExtendSearch)
					);
				}
				else {
					setStatus(settings.txtNoResult);
				}
			}
			s.searchFilter = true;
		}
		catch(err) {
			setStatus(err.name + ': ' + err.message, true);
		}
	}
	
	function setMaxPrice(s) {
		var txtMaxPrice = s.frmSearch.maxprice;
		var price = txtMaxPrice.value.toString();
		s.searchMaxPrice = 0;
		
		if (price.length > 0) {
			price = price.replace(',', '.');
			if (isNaN(price)) {
				txtMaxPrice.value = '';
			}
			else {
				s.searchMaxPrice = parseInt(price);
				txtMaxPrice.value = s.searchMaxPrice;
			}
		}
	}

	function getValue(fieldid) {
		var sValue = '';
		if (document.getElementById(fieldid)) {
			sValue = document.getElementById(fieldid).value;
			if (sValue == 'on') {
				if (document.getElementById(fieldid).checked)
					return true;
			} else {
				return sValue;
			}
		}
		return parseInt(0);
	}
	
	function replaceRChars($t) {
		var $rc = new Array("\\", ".", ":", "(", ")", "[", "]", "?", "*", "+", "-");
		for (var i=0; i < $rc.length; i++) {
			$t = $t.replace(new RegExp("\\" + $rc[i], "ig"), "\\" + $rc[i]);
		}
		$t = $t.replace(/SMRegExpB/gi, "\\b");
		return $t;
	}

	function plainTextFilter(s, $d, $t) {
		// t == term
		var $r = $t.match(/\S+/ig);
		var sEntireWords = (s.searchEntireWords) ? 'SMRegExpB' : '';
		var resultCount = 1;
		
		if ($r && !s.searchEntireTerm) {
			$t = '';
			for (var i=0; i < $r.length; i++) {
				//$t += (($t.length!=0) ? "|" : "") + _.encodeUri($r[i]);
				$t += (($t.length != 0) ? "|" : "") + sEntireWords + _.encodeUri($r[i]) + sEntireWords;
			}
			$r = null;
		}
		else {
			$t = _.encodeUri($t);
		}
		
		if ($t.length != 0) {
			// Ersetze Steuerzeichen für RegExp
			$t = replaceRChars($t);
			
			// Weiter
			var $rows = $d.split('\n');
			$r = new Array();
			
			if (s.phpPowerSearch) { // PHP-Suchergebnisse nicht weiter filtern
				for (var i=0; i < $rows.length; i++) {
					if ($rows[i] != '') {
						$r[$r.length] = $rows[i];
					}
				}
			} 
			else {
				if (s.searchEntireWords) {
					for (var i=0; i < $rows.length; i++) {
						if (_.decodeUri($rows[i]).match(new RegExp(_.decodeUri($t), 'ig'))) {
							$r[$r.length] = $rows[i];
							resultCount++;
						}
					}
				} 
				else {
					for (var i=0; i < $rows.length; i++) {
						if ($rows[i].match(new RegExp($t, 'ig'))) {
							$r[$r.length] = $rows[i];
							resultCount++;
						}
					}
				}
			}
		}
		return $r;
	}

	function detailedFilter(s) {
		var arrDst = new Array();
		var arrTerm = s.searchTerm.split(' ');
		var matchCount = 0, oWord = arrLine = null;
		var arrTermLength = arrTerm.length;
		var dblMaxPrice = 0;
		var resultCount = 0;
		
		if (!s.arrFirstFilter)
			return arrDst;
		
		if (s.searchProductId) {
			var sProductId = '';
			for (var i=0; i < s.arrFirstFilter.length; i++) {
				sProductId = _.decodeUri(s.arrFirstFilter[i].split(';')[s.fIndex['PRODUCTID']]);
				
				if (sProductId.match(eval('/' + s.searchTerm + '/i')) != null) {
					arrDst[arrDst.length] = s.arrFirstFilter[i];
				}
				
				// mod: search for variant product ids in keywords
				sKeywords = _.decodeUri(s.arrFirstFilter[i].split(';')[s.fIndex['SEEALSOKEYWORDS']]);
				if (sKeywords.indexOf("[[@") >= 0) {
					sVariantIDs = sKeywords.split("[[@").pop();
					
					if (sVariantIDs.match(eval('/' + s.searchTerm + '/i')) != null) {
						arrDst[arrDst.length] = s.arrFirstFilter[i];
					}
				}
				// end mod
			}
		}
		else {
			var sNameDesc = '', arrHelper = null;
			for (var i=0; i < s.arrFirstFilter.length; i++) {
				matchCount = 0;
				
				if (s.searchDescOnly) {
					arrHelper = s.arrFirstFilter[i].split(';');
					sNameDesc = arrHelper[s.fIndex['PRODUCTNAME']] + arrHelper[s.fIndex['SHORTDESC']];
				}
				
				for (var j=0; j < arrTerm.length; j++) {
					oWord = eval('/' + replaceRChars(_.encodeUri(arrTerm[j])) + '/i');
					if (s.arrFirstFilter[i].match(oWord) != null) {
						if (!s.searchDescOnly) {
							matchCount++;
						} 
						else {
							if (sNameDesc.match(oWord) != null) {
								matchCount++;
							}
						}
					}
				}
				
				if (matchCount == arrTermLength) {
					resultCount++;
					arrDst[arrDst.length] = s.arrFirstFilter[i];
					if (resultCount >= s.maxResults)
						break;
				}
			}
			
			if (parseInt(s.searchManufact) > 0) {
				arrDst = singleFieldFilter(s, 'ManufactPKID', arrDst, parseInt(s.searchManufact));
			}
			if (parseInt(s.searchCategory) > 0) {
				arrDst = singleFieldFilter(s, 'ProductsCategories', arrDst, parseInt(s.searchCategory));
			}
			dblMaxPrice = parseInt(s.searchMaxPrice);
			if (dblMaxPrice > 0) {
				dblMaxPrice = (dblMaxPrice / cprimary.rate);
				arrDst = singleFieldFilter(s, 'CalculatedPrice', arrDst, parseInt(dblMaxPrice));
			}				
		}		
		return arrDst;
	}

	function singleFieldFilter(s, fieldName, arrSrc, compVal) {
		fieldName = fieldName.toUpperCase();
		var lPkidNum = s.fIndex['PKID'];
		var lFieldNum = s.fData[fieldName];
		var lPkid = 0, iValue = 0, arrDst = new Array();
		var categories = [], sCats = '', oCat = null, leafDepth = -1, catID, depth;
				
		if (fieldName == 'PRODUCTSCATEGORIES' && s.searchCategory.length > 0) {			
			$('#category option').each(function(index) {
				catID = $(this).val();
				depth = parseInt($(this).attr('data-opt')) || 0;
				
				if(catID.length > 0) {
					if (s.searchCategory === catID) {
						leafDepth = depth;
						sCats = catID.substring(3, catID.length);
					}				
					else if (leafDepth >= 0) {
						if (depth <= leafDepth) {
							return false;
						}
						sCats += '|' + catID.substring(3, catID.length);
					}	
				}
			});
			
			if (sCats.length > 0) {
				sCats += '|';
			}
			sCats += s.searchCategory;
			sCats = '/\\b' + sCats.replace(/\|/g, '\\b\|\\b') + '\\b/';
			oCat = eval(sCats);			
		}

		for (var i=0; i < arrSrc.length; i++) {
			lPkid = arrSrc[i].split(';')[lPkidNum];
			if (fieldName == 'CALCULATEDPRICE') {
				iValue = parseInt(s.arrData[lPkid][lFieldNum]);
				if(iValue <= compVal) {
					arrDst[arrDst.length] = arrSrc[i];
				}
			} 
			else if(fieldName == 'PRODUCTSCATEGORIES') {
				if (s.arrData[lPkid][lFieldNum].match(oCat) != null) {
					arrDst[arrDst.length] = arrSrc[i];
				}
			} 
			else {
				iValue = parseInt(s.arrData[lPkid][lFieldNum]);
				if (iValue == compVal) {
					arrDst[arrDst.length] = arrSrc[i];
				}
			}
		}
		return arrDst;
	}

	function splitTerm(s) {
		var newTerm = '';
		var arrTerm = s.searchTerm.replace(/-/gi, ' ').toLowerCase().split(' ');
		
		for (var i=0; i < arrTerm.length; i++) {
			if(newTerm.length > 0)
				newTerm += ' ';
			//if(arrTerm[i].charAt(arrTerm[i].length-1) == 's'){
				arrTerm[i] = arrTerm[i].substring(0, arrTerm[i].length - 1);
			//};
			if (arrTerm[i].length > 10) {
				newTerm += arrTerm[i].substring(0,5) + ' ' + arrTerm[i].substring(5, arrTerm[i].length);
			}
			else {
				newTerm += arrTerm[i];
			}
		}
		return newTerm;
	}

	function getPage(s, pagenum) {
		if (pagenum > s.totalPages) {
			pagenum = s.totalPages - 1;
		}
		if (pagenum < 1) {
			pagenum = 1;
		}
		
		s.currentPage = pagenum;
		setQuery(s);
		
		if (s.itemCount > 0) {
			setStatus( '{0} {1}, {2} {3}/{4}'.format(settings.txtHits, s.itemCount, T['txt.label.page'], pagenum, s.totalPages) );
		}
		
		$ctx = $('#' + settings.moduleID + ' .progress-result');
		
		if (!$ctx.productRenderer('isInitialized')) {
			$ctx.productRenderer('init', {
				showID: s.showProductId,
				showEAN: s.showEan,
				showWeight:	s.showWeight,
				showManufact: s.showManufacturer,
				showDeliveryTime: s.showDeliveryTimeImage,
				showDeliveryTimeText: s.showDeliveryTimeText,
				showPrice: s.showItemPrice,
				showPriceBase: s.showPriceBase,
				showVATInfos: s.showVATInfos,
				showSecCur: s.showSecCur,
				showAddToBag: s.showAddtobag,
				showQtyUnit: s.showQtyUnit,
				showQtyInput: s.showQtyField,
				//showQtyCaption: s.showQtyCaption,
				navBarPos: s.navBarPos,
				navbarAlign: s.navBarAlign,
				maxItems: s.maxItemsPerPage,
				descMaxLength: s.itemDescMaxLength,
				displayTitlesOnTop: s.showTitleOnTop,
				displayLargeTitles: s.itemLargeTitle,
				itemImageAlign: s.thumbAlign,
				showItemDesc: s.showItemDesc,
				colCount: s.columnsCount,
				currentPage: s.currentPage,
				alignElemsToGrid: s.alignElemsToGrid,
				alignElemsPerRow: s.alignElemsPerRow,
				maxImageWidth: s.maxImageWidth,
				maxImageHeight: s.maxImageHeight,
				showVariants: s.showVariants,
				showMore: s.showMore,

				mediaPath: s.mediaPath,
				//basePath: s.basePath,
				appPreviewMode: s.appPreviewMode,
				deliveryTimes: deliveryTimes,
				
				displayGrossPrice: s.displayGrossPrice
			});
		}

		var paginatorOpts = {
			pageCount: s.totalPages,
			currentPage: s.currentPage,	// one-based erwartet!
			navbarAlign: s.navBarAlign,
			//maxElements: s.maxItemsPerPage,
			maxElements: 12,
			target: 'javascript:void(0)',
			linkClasses: settings.moduleID
		};
	
		var listOpts = {
			itemsInRow: s.columnsCount,
			itemsInPage: s.maxItemsPerPage,
			alternateItems:	false,
			showItemBorders: s.showItemBorder,
			animateItemOnHover:	s.animateItemOnHover,
			showRowSeparator: s.showRowSeparator,
			navBarPos: s.navBarPos,
			navBarAlign: s.navBarAlign
		};
		
		var dataAdapter = new $.productSearchDataAdapter(s.arrResult, s.arrData, s.fIndex, s.fData, s.maxItemsPerPage /* s.totalPages */);
				
		$ctx.productRenderer('render', dataAdapter, listOpts, paginatorOpts);
		
		if (s.showMiniBasket) {
			$('#minibasket > div')
				.smMinibasket('registerDraggables', '.product-list .pl-frame-parent img')
				.smMinibasket('registerButtons', '.pnl-addtobasket-button, .addtobasket');
		}
				
		scrollToModule();
		return false;
	}
	
	function scrollToModule() {
		$(window).stop().scrollTo( $('#' + settings.moduleID + ' .product-search-progress'), 1000, {easing: 'easeOutQuint'} );
	}

	function setQuery(s) {
		var sQuery = 'searchterm=' + _.encodeUri(s.searchTerm)
			+ '&manufact=' + s.searchManufact
			+ '&category=' + s.searchCategory
			+ '&maxprice=' + s.searchMaxPrice
			+ '&desconly=' + (s.searchDescOnly ? '1' : '0')
			+ '&productid=' + (s.searchProductId ? '1' : '0')
			+ '&termfilter=' + s.termFilter
			+ '&pagenum=' + s.currentPage
			+ '&dosearch=1';
		
		switch (s.frmSearch.id.toUpperCase()) {
			case 'FRMADVANCED': sQuery += '&method=1'; break;
			case 'FRMPRODUCTID': sQuery += '&method=2'; break;
			default: sQuery += '&method=0'; break;
		}
		
		SMShop.xml.setAttribute('search-query', sQuery);
		SMShop.update();
	}

	function setSearchIndex(strindex) {
		var sFields = '',
			arrFields = null;
			
		if (strindex.indexOf('|' != -1)) {
			sFields = strindex.substring(0, strindex.indexOf('\n'));
			arrFields = sFields.split(';');
			
			for (var i=0; i < arrFields.length; i++) {
				settings.fIndex[arrFields[i].toUpperCase()] = i;
			}
			settings.searchindex = strindex.replace(sFields + '\n', '');
		}
	}

	function setSearchData(strdata) {
		var sFields = '',
			arrFields,
			arrData = arrRow = null;
			
		if (strdata && strdata.indexOf('|' != -1)) {
			strdata = strdata.replace(/\r/, '');
			sFields = strdata.substring(0, strdata.indexOf('\n'));
			arrFields = sFields.split(';');
			
			for (var i=0; i < arrFields.length; i++) {
				settings.fData[arrFields[i].toUpperCase()] = i;
			}
			
			strdata = strdata.replace(sFields + '\n', '');
			arrData = strdata.split('\n');
			
			for (var i=0; i < arrData.length; i++) {
				if (arrData[i].length > 0) {
					arrRow = arrData[i].split('{BOL}');
					settings.arrData[arrRow[0]] = arrRow[1].split(';');
				}
			}
		}
	}
	
	function getRadioIndex(arr) {
		for (var i=0; i < arr.length; i++) {
			if (arr[i].checked)
				return i;
		}
		return 0;
	}

	function setStatus(statustext, error) {
		if (error ? error : false) {
			statustext = '<span class="product-search-error">' + statustext + '</span>';
		}
		$('#' + settings.moduleID + ' .progress-status').html(statustext);
	}
	
	function setSearchResult(result) {
		$('#' + settings.moduleID + ' .progress-result').html(result);
	}	

})(jQuery);

function SMBasket_onBeforeAdd(args) {
	var smproduct = args[1];
	var minamount = parseInt(smproduct.getAttribute(_SMAMinAmount));
	var maxamount = parseInt(smproduct.getAttribute(_SMAMaxAmount));
	var amount = parseFloat(smproduct.getAttribute(_SMAAmount));
	var qtyamount = document.getElementById("PD" + smproduct.getAttribute(_SMAUniqueID) + "amount");
	
	if (qtyamount != null) {
		if (minamount.toString().length > 0 && maxamount.toString().length > 0) {
			if (!(parseInt(qtyamount.value) >= minamount)) {
				$.alert(T['msg.min-order-qty']);
				qtyamount.value = minamount;
				return false;
			}
			else if (maxamount > 0 && !(parseInt(qtyamount.value) <= maxamount)) {
				$.alert(T['msg.max-order-qty']);
				qtyamount.value = maxamount;
				return false;
			}
			else {
				smproduct.setAttribute(_SMAAmount, qtyamount.value);
				smproduct.update();
				return true;
			}
		}
		else {
			$.alert(T['msg.min-order-qty']);
			qtyamount.value = minamount;
			return false;
		}
	}
};
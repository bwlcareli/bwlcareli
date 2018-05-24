(function () {
	jQuery.Affiliates = function () {
	}

	jQuery.Affiliates.prototype = {

		outputAffiliates: function () {
			var sAffiliates = '',
				oTotalPrice = new cSMPrice(),
				oSubTotalPrice = new cSMPrice(),
				arrAffiliates = [],
				sUrl;



			oTotalPrice.decode(SMShop.basket.getAttribute(_SMAFinalSum));
			oSubTotalPrice.decode(SMShop.basket.getAttribute(_SMADSubTotal));

			for (var i=0; i < arrAffiliates.length; i++) {
				sUrl = arrAffiliates[i][2];
				sUrl = sUrl.replace(/SMParamMerchantId/g, escape(arrAffiliates[i][0]) );
				sUrl = sUrl.replace(/SMParamAffiliateId/g, escape(SMShop.getEntryParam(arrAffiliates[i][1])) );
				sUrl = sUrl.replace(/SMParamOrderId/g, escape(SMShop.getAttribute(_SMAMailOrderID)) );
				sUrl = sUrl.replace(/SMParamSubTotalPriceGross/g, escape(cprimary.format(oSubTotalPrice.gross, SM_CNOFORMAT)) );
				sUrl = sUrl.replace(/SMParamSubTotalPriceNet/g, escape(cprimary.format(oSubTotalPrice.net, SM_CNOFORMAT)) );
				sUrl = sUrl.replace(/SMParamTotalPriceGross/g, escape(cprimary.format(oTotalPrice.gross, SM_CNOFORMAT)) );
				sUrl = sUrl.replace(/SMParamTotalPriceNet/g, escape(cprimary.format(oTotalPrice.net, SM_CNOFORMAT)) );

				sAffiliates += '<img src="' + sUrl + '" border="0" width="1" height="1" />';
			}

			var affiliElem = document.getElementById('affiliates');

			if(affiliElem)
				affiliElem.innerHTML = sAffiliates;
		}

	};
})();

SMShop.base.addMember("SMAffiliates");
function SMAffiliates_windowOnLoad(args) {
	var obj = new jQuery.Affiliates();
	obj.outputAffiliates();
};

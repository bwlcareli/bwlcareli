(function($) {

	$.productSearchDataAdapter = function(arrResult, arrData, fieldsIndex, fieldsData, pageSize) {
		this.arrResult = arrResult;
		this.arrData = arrData;
		this.fieldsIndex = fieldsIndex;
		this.fieldsData = fieldsData;
		this._record = null;
		
		this._pageSize = pageSize || 0;		// items per page
		this._pageCount = 1;
		this._absolutePage = 1;		// one-based!
		
		this._idx = 0;
		this._idxStart = 0;
		this._idxEnd = 0;
		
		this._firstIdxOfPage = function() {
			return (this._absolutePage - 1) * this._pageSize;
		}
		
		this._isValidIdx = function() {
			return this._idx >= 0 && this._idx < arrResult.length;
		}
		
		this._refresh = function() {
			var isPageable = (this._pageSize > 0 && _.isArray(this.arrResult) && this.arrResult.length > 0);
			
			if (isPageable) {
				this._pageCount = Math.ceil(this.arrResult.length / this._pageSize);
				this._idxStart = this._firstIdxOfPage();
				this._idxEnd = this._idxStart + this._pageSize;
				//$('.progress-status').html( '{0} {1} ({2} {3} {4})'.format(this._idxStart, this._idxEnd, this._idx, this._absolutePage, this.arrResult.length) );
			}
			else {
				//this._curSlice = this.arrResult;
				this._pageCount = 1;
				this._absolutePage = 1;
				this._idxStart = 0;
				this._idxEnd = 0;				
			}
		}
				
		this._refresh();
	}

	$.productSearchDataAdapter.prototype = {
			
		hasData: function() {
			return (_.isArray(this.arrResult) && this.arrResult.length > 0);
		},
			
		dispose: function() {
			// nada
		},

		length: function() {
			return this.arrResult.length;
		},
			
		pos: function(idx) {
			if ( !_.isNumber(idx) ) {
				return this._idx;
			}
			this._idx = idx;
		},
		
		bof: function() {
			return this._idx < this._firstIdxOfPage() || !this._isValidIdx();
		},
			
		eof: function() {
			return !this._isValidIdx() || this._idx >= (this._firstIdxOfPage() + this._pageSize);
		},
			
		moveFirst: function() {
			this._idx = this._firstIdxOfPage();
		},
		moveLast: function() {
			this._idx = this._firstIdxOfPage() + this._pageSize - 1;
		},
		moveNext: function() { this._idx++; },	
		movePrev: function() { this._idx--; },
			
		pageCount: function() {
			return this._pageCount;	
		},
			
		pageSize: function(size) {
			if ( !_.isNumber(size) ) {
				return this._pageSize;
			}
			// setter
			if (size !== this._pageSize) {
				this._pageSize = size;
				this._absolutePage = 1; // changing pageSize resets the pager.
				this._refresh();
			}
		},
			
		absolutePage: function(idx) {
			if ( !_.isNumber(idx) ) {
				return this._absolutePage;
			}
			// setter
			var isValidIndex = (idx >= 1 && idx <= this._pageCount && idx !== this._absolutePage);
			
			if (isValidIndex) {
				this._absolutePage = idx;
				this._idx = this._firstIdxOfPage();
				this._refresh();	
			}
		},
			
		val: function(idx) {		
			var val = '';
			if (this._isValidIdx()) {
				idx = idx.toUpperCase();
			
				var data = this.arrResult[this._idx].split(';');
				val = data[ this.fieldsIndex[idx] ];
				
				if (val === undefined) {
					var pkid = data[ this.fieldsIndex['PKID'] ];
					val = this.arrData[pkid][ this.fieldsData[idx] ];
					
					var decode = (idx === 'QTYUNIT');
					
					if (decode) {
						val = _.decodeUri(val);
					}
				}
			}
			return val;			
		},
		
		fetchRecord: function() {
			if (this._isValidIdx()) {
				this._record = this.arrResult[this._idx].split(';');
				return this._record[ this.fieldsIndex['PKID'] ];
			}
			
			this._record = null;
			return null;
		},
		
		record2Val: function(idx, pkid) {
			if (this._record !== null) {
				if (pkid === undefined) {
					return this._record[ this.fieldsIndex[idx] ];
				}
				return this.arrData[pkid][ this.fieldsData[idx] ];
			}
			return '';
		}

	};
	
})(jQuery);

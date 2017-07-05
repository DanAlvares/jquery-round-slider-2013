$(function(){
	'use strict';

	var _date = new Date();
	var _startDate = new Date('May 18 2013 10:00')

	var _circle = $('#Dial'); 						// Dial
	var _slider = $('#Handle'); 					// Slider Handle
	var _sliderW2 = _slider.width() / 2;
	var _sliderH2 = _slider.height() / 2;
	var _radius = 130;										// Half the width of the circle
	var _elP = _circle.offset();					// The circle offset position
	var _elPos = { x: _elP.left, y: _elP.top};
	var _deg = null;	 										// Create "empty" _deg variable
	var _X = 0, _Y = 0;										// Create "empty" X Y variables
	var _hours;														// Create "empty" _hours variable
	var _minutes;													// Create "empty" _minutes variable
	var _degStart;												// Create "empty" start degree variable
	var _pageX, _pageY;

	function DateTime(date){
		var _days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
			_months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
			_day = _days[date.getDay()],
			_date = date.getDate(),
			_month = _months[date.getMonth()],
			_year = date.getFullYear(),
			_hours = date.getHours(),
			_minutes = date.getMinutes(),
			_jsTimestamp = date.getTime();

		$('.day').text(_day);
		$('.date').text(_date);
		$('.month').text(_month);
		$('.hours').text(_hours.toString().length == 2 ? _hours : '0'+_hours);
		$('.minutes').text(_minutes.toString().length == 2 ? _minutes : '0'+_minutes );
		$('.year').text(_year);
	}

	function DialSlider(startDate) {
		// Set slider handle position based on time at page load
		_circle.each(initiateDial);

		$(window).resize(function(){
			_elP = _circle.offset();				// The circle offset position
			_elPos = { x: _elP.left, y: _elP.top};	// X Y coordinates using the circles offset position
		});

		_slider.on('mousedown touchstart', function (e) {
			$(document).on('mousemove touchmove', function (e) {
				_degStart = _deg;
				if(_hours != undefined)  var _newHours = _hours;

				// Check if device supports touch
				_pageX = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX;
				_pageY = e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY;

				var _mPos = {x: _pageX - _elPos.x, y: _pageY - _elPos.y};
				var atan = Math.atan2(_mPos.x - _radius, _mPos.y - _radius); 	// JS atan() method - Returns the arctangent of number specified in ()
				_deg = -atan/(Math.PI/180) + 180; 								// final (0-360 positive) degrees from mouse position

				_X = Math.round(_radius * Math.sin(_deg * Math.PI/180));
				_Y = Math.round(_radius * -Math.cos(_deg * Math.PI/180));

				var _degrees = (Math.round(_deg / 2) * 2);			/// Round off degrees to 2 so that there are 60 "minutes" in each 1hour segment
				_hours = (Math.floor(_deg / 30) * 30) / 30; 		// Split 360degrees into 30degree (1 hour) segments and round down
				_minutes = (_degrees - (_hours * 30)) * 2;		// Minutes in each segment

				var _today = new Date();
				var _day = $('.day').text();
				var _date = $('.date').text();
				var _month = $('.month').text();
				var _year = _today.getFullYear();
				var _hr = $('.hours').text();
				var _min = $('.minutes').text();
				var _newDate, _diff;

				var _dateNow = new Date(_month + ' ' + _date + ' ' + _year + ' ' + _hr + ':' + _min);

				if(_degStart <= _deg || Math.floor(_deg / 20) * 20 == 0){
					// Moving Forward
					var _diff = Math.round(_degStart) - Math.round(_deg)
					if(Math.abs(_diff) > 5) _diff = 0
					_newDate = new Date(_dateNow.setMinutes(_dateNow.getMinutes() + (Math.abs(_diff)*2)));
				}
				else{
					// Moving Backward
					_diff = Math.round(_degStart) - Math.round(_deg);
					_newDate = new Date(_dateNow.setMinutes(_dateNow.getMinutes() - (_diff*2)));
				}

				DateTime(_newDate);

				_slider.css({
					'transform':'rotate(' + (_deg + 45) + 'deg)',
					'-ms-transform':'rotate(' + (_deg + 45) + 'deg)',
					'-moz-transform':'rotate(' + (_deg + 45) + 'deg)',
					'-o-transform':'rotate(' + (_deg + 45) + 'deg)',
					'left': (_X + _radius - _sliderW2) + 20 + 'px',
					'top': (_Y + _radius - _sliderH2) + 20 + 'px'
				});

				e.preventDefault();
			});

			$(document).on('mouseup touchend', function() {
				$(document).unbind('mousemove touchmove mouseup touchend');
			});

		});
	};

	function initiateDial(){
		var _time = new Date(),
			_hrs = _time.getHours(),
			_mins = _time.getMinutes(),
			_hPos = _hrs + '.' + Math.floor(_mins/60*100),

			// Calculate X and Y position based on current time
			_degrees = _hPos * 30 - 90,
			_rad = _degrees * (Math.PI / 180),
			_a = 260/2,
			_b = 260/2,
			_x = _a + _radius * Math.cos(_rad) - _sliderW2 + 20,
			_y = _b + _radius * Math.sin(_rad) - _sliderH2 + 20,

			// Rotate handle accoringly
			_angle = Math.floor(_degrees - 45);

		// Position Slider
		_slider.css({
			'left': _x,
			'top': _y,
			'visibility': 'visible',
			'-webkit-transform':'rotate('+_angle + 'deg)',
			'-ms-transform':'rotate(' + _angle + 'deg)',
			'-moz-transform':'rotate(' + _angle + 'deg)',
			'-o-transform':'rotate(' + _angle + 'deg)',
			'transform':'rotate(' + _angle + 'deg)'
		});

		_deg = _hPos;
	};

	DateTime(_date);
	DialSlider(_startDate);
});

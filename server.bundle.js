/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {'use strict';

	var _express = __webpack_require__(1);

	var _express2 = _interopRequireDefault(_express);

	var _path = __webpack_require__(2);

	var _path2 = _interopRequireDefault(_path);

	var _compression = __webpack_require__(3);

	var _compression2 = _interopRequireDefault(_compression);

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _server = __webpack_require__(5);

	var _reactRouter = __webpack_require__(6);

	var _Routes = __webpack_require__(7);

	var _Routes2 = _interopRequireDefault(_Routes);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var app = (0, _express2.default)();

	app.use((0, _compression2.default)());

	// serve our static stuff like index.css
	app.use(_express2.default.static(_path2.default.join(__dirname, 'dist')));

	// send all requests to index.html so browserHistory works
	app.get('*', function (req, res) {
	  (0, _reactRouter.match)({ routes: _Routes2.default, location: req.url }, function (err, redirect, props) {
	    if (err) {
	      res.status(500).send(err.message);
	    } else if (redirect) {
	      res.redirect(redirect.pathname + redirect.search);
	    } else if (props) {
	      // hey we made it!
	      var appHtml = (0, _server.renderToString)(_react2.default.createElement(_reactRouter.RouterContext, props));
	      res.send(renderPage(appHtml));
	    } else {
	      res.status(404).send('Not Found');
	    }
	  });
	});

	function renderPage(appHtml) {
	  return '\n    <!doctype html public="storage">\n    <html>\n    <meta charset=utf-8/>\n    <title>(s) Map Test</title>\n    <link rel=stylesheet href=/index.css>\n    <div id=app>' + appHtml + '</div>\n    <script src="/bundle.js"></script>\n   ';
	}

	var PORT = process.env.PORT || 8080;
	app.listen(PORT, function () {
	  console.log('Production Express server running at localhost:' + PORT);
	});
	/* WEBPACK VAR INJECTION */}.call(exports, ""))

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("compression");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("react");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("react-dom/server");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("react-router");

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(6);

	var _App = __webpack_require__(8);

	var _App2 = _interopRequireDefault(_App);

	var _TestComponent = __webpack_require__(11);

	var _TestComponent2 = _interopRequireDefault(_TestComponent);

	var _TestClass = __webpack_require__(12);

	var _TestClass2 = _interopRequireDefault(_TestClass);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var NotFound = function NotFound() {
		return _react2.default.createElement(
			'h1',
			null,
			'404 error - This page is not found!'
		);
	};

	module.exports = _react2.default.createElement(
		_reactRouter.Route,
		{ path: '/', component: _App2.default },
		_react2.default.createElement(_reactRouter.Route, { path: '/testClass', component: _TestClass2.default }),
		_react2.default.createElement(_reactRouter.Route, { path: '/testComponent', component: _TestComponent2.default }),
		_react2.default.createElement(_reactRouter.Route, { path: '*', component: NotFound })
	);

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	                         value: true
	});

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _Geolocation = __webpack_require__(9);

	var _Geolocation2 = _interopRequireDefault(_Geolocation);

	var _Version = __webpack_require__(10);

	var _Version2 = _interopRequireDefault(_Version);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var _version = "0.10";

	var App = function App(props) {
	                         return _react2.default.createElement(
	                                                  'div',
	                                                  null,
	                                                  _react2.default.createElement(
	                                                                           'h1',
	                                                                           null,
	                                                                           'Map Test'
	                                                  ),
	                                                  _react2.default.createElement(_Geolocation2.default, null),
	                                                  props.children,
	                                                  _react2.default.createElement(_Version2.default, { version: _version })
	                         );
	};

	exports.default = App;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var GeolocationDisplay = function GeolocationDisplay(props) {
	  return _react2.default.createElement(
	    "div",
	    null,
	    _react2.default.createElement(
	      "div",
	      { className: "geolocation_display {props.real ? geolocation_display_ok : geolocation_display_ko}" },
	      "Latitude: ",
	      props.latitude ? props.latitude : "unknown",
	      _react2.default.createElement("br", null),
	      "Longitude: ",
	      props.longitude ? props.longitude : "unknown",
	      _react2.default.createElement("br", null)
	    ),
	    _react2.default.createElement(
	      "div",
	      { className: "geolocation_statistics" },
	      "Statistics:",
	      _react2.default.createElement(
	        "ul",
	        null,
	        _react2.default.createElement(
	          "li",
	          null,
	          "Nb refreshes: ",
	          props.nbRefreshes
	        ),
	        _react2.default.createElement(
	          "li",
	          null,
	          "Nb different positions: ",
	          props.nbDiffs
	        ),
	        _react2.default.createElement(
	          "li",
	          null,
	          "Nb real positions: ",
	          props.nbReal
	        ),
	        _react2.default.createElement(
	          "li",
	          null,
	          "Nb estimated positions: ",
	          props.nbEstimated
	        ),
	        _react2.default.createElement(
	          "li",
	          null,
	          "Last error code: ",
	          props.errorCode
	        )
	      )
	    )
	  );
	};

	function getPosition(position) {
	  // alert("getPosition");
	  var current = {
	    latitude: position.coords.latitude,
	    longitude: position.coords.longitude,
	    real: true
	  };
	  var statistics = this.state.statistics;
	  statistics.nbRefreshes++;
	  statistics.nbReal++;
	  if (current.latitude != this.state.position.latitude || current.longitude != this.state.position.longitude) {
	    statistics.nbDiffs++;
	  }
	  this.setState({
	    position: current,
	    statistics: statistics
	  });
	}

	/*
	  showError: function (error) {
	    switch(error.code) {
	        case error.PERMISSION_DENIED:
	            x.innerHTML = "User denied the request for Geolocation."
	            break;
	        case error.POSITION_UNAVAILABLE:
	            x.innerHTML = "Location information is unavailable."
	            break;
	        case error.TIMEOUT:
	            x.innerHTML = "The request to get user location timed out."
	            break;
	        case error.UNKNOWN_ERROR:
	            x.innerHTML = "An unknown error occurred."
	            break;
	    }
	  }
	*/

	function errorPosition(error) {
	  // alert("errorPosition");
	  var position = this.state.position;
	  var statistics = this.state.statistics;
	  position.real = false;
	  if (position.latitude != null && position.longitude != null) statistics.nbEstimated++;
	  this.setState({
	    position: position,
	    statistics: statistics,
	    errorCode: error.errorCode
	  });
	};

	exports.default = _react2.default.createClass({
	  displayName: "Geolocation",


	  watchID: null,

	  getInitialState: function getInitialState() {
	    return {
	      position: { latitude: null, longitude: null, real: false },
	      statistics: { nbRefreshes: 0, nbDiffs: 0, nbReal: 0, nbEstimated: 0 },
	      errorCode: 0
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    // alert("componentDidMount");
	    navigator.geolocation.getCurrentPosition(getPosition.bind(this), errorPosition.bind(this), { enableHighAccuracy: true, timeout: 3000, maximumAge: 3000 });
	    this.watchID = navigator.geolocation.watchPosition(getPosition.bind(this), errorPosition.bind(this));
	  },

	  componentWillUnmount: function componentWillUnmount() {
	    navigator.geolocation.clearWatch(this.watchID);
	  },

	  render: function render() {
	    var displayLatitude = Math.round(this.state.position.latitude * 10000) / 10000;
	    var displayLongitude = Math.round(this.state.position.longitude * 10000) / 10000;
	    return _react2.default.createElement(GeolocationDisplay, {
	      latitude: displayLatitude,
	      longitude: displayLongitude,
	      real: this.state.position.real,
	      nbRefreshes: this.state.statistics.nbRefreshes,
	      nbDiffs: this.state.statistics.nbDiffs,
	      nbReal: this.state.statistics.nbReal,
	      nbEstimated: this.state.statistics.nbEstimated,
	      errorCode: this.state.errorCode });
	  }
	});

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Version = function Version(props) {
	  return _react2.default.createElement(
	    'div',
	    null,
	    _react2.default.createElement('br', null),
	    'Version: ',
	    props.version
	  );
	};

	exports.default = Version;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var TestComponent = function (_React$Component) {
		_inherits(TestComponent, _React$Component);

		function TestComponent() {
			_classCallCheck(this, TestComponent);

			return _possibleConstructorReturn(this, (TestComponent.__proto__ || Object.getPrototypeOf(TestComponent)).apply(this, arguments));
		}

		_createClass(TestComponent, [{
			key: 'render',
			value: function render() {
				return _react2.default.createElement(
					'div',
					null,
					'component test3'
				);
			}
		}]);

		return TestComponent;
	}(_react2.default.Component);

	exports.default = TestComponent;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var TestClass = _react2.default.createClass({
		displayName: 'TestClass',
		render: function render() {
			return _react2.default.createElement(
				'div',
				null,
				'class Test'
			);
		}
	});

	exports.default = TestClass;

/***/ }
/******/ ]);
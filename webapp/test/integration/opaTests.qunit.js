/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require(["fabrica/mm/crearempleado/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});

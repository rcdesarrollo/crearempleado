/*global QUnit*/

sap.ui.define([
	"fabricamm./crearempleado/controller/Crear.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Crear Controller");

	QUnit.test("I should test the Crear controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});

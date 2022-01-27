sap.ui.define([
    "sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel',
	"sap/m/MessageToast",
	"sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * 
     */
    function (Controller, JSONModel, MessageToast, MessageBox) {
        "use strict";

        return Controller.extend("fabrica.mm.crearempleado.controller.Crear", {
            onInit: function () {
                this._wizard = this.byId("CreateProductWizard");
                this._oNavContainer = this.byId("wizardNavContainer");
                this._oWizardContentPage = this.byId("wizardContentPage");
    
                this.model = new JSONModel();
                this.model.setData({
                    productNameState: "Error",
                    productWeightState: "Error"
                });
                this.getView().setModel(this.model);
                /*
                this.model.setProperty("/productType", "Mobile");
                this.model.setProperty("/availabilityType", "In Store");
                this.model.setProperty("/navApiEnabled", true);
                this.model.setProperty("/productVAT", false);
                this.model.setProperty("/measurement", "");
                this._setEmptyValue("/productManufacturer");
                this._setEmptyValue("/productDescription");
                this._setEmptyValue("/size");
                this._setEmptyValue("/productPrice");
                this._setEmptyValue("/manufacturingDate");
                this._setEmptyValue("/discountGroup"); */
            },
            onCancelar: function(){
                // Mensaje de regreso al menur porincipal
            },
            additionalInfoValidation: function () {
                var name = this.byId("ProductName").getValue();
                // var weight = parseInt(this.byId("ProductWeight").getValue());
    
                /* if (isNaN(weight)) {
                    this.model.setProperty("/productWeightState", "Error");
                } else {
                    this.model.setProperty("/productWeightState", "None");
                } */
    
                if (name.length < 6) {
                    this.model.setProperty("/productNameState", "Error");
                } else {
                    this.model.setProperty("/productNameState", "None");
                }
    
                //if (name.length < 6 || isNaN(weight)) {
                if (name.length < 6) {                    
                    this._wizard.invalidateStep(this.byId("ProductInfoStep"));
                } else {
                    this._wizard.validateStep(this.byId("ProductInfoStep"));
                }
            },
            wizardCompletedHandler: function () {
                this._oNavContainer.to(this.byId("wizardReviewPage"));
            },



        });
    });

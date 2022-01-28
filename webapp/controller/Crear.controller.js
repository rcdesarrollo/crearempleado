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
                this._oNavContainer = this.byId("wizardNavContainer");
                this._oWizardContentPage = this.byId("wizardContentPage");
                this._wizard = this.byId("CreateProductWizard");

                this.model = new JSONModel();
                this.model.setData({
                    productNameState: "Error",
                    productWeightState: "Error",
                    apellidoState: "Error",
                    numDocumentoState: "Error",
                });
                this.getView().setModel(this.model);

                this.model.setProperty("/productType", "Interno");
                this.model.setProperty("/tipoDocumento", "DNI");
                this.model.setProperty("/TipoSaldoPrecio", "Saldo bruto anual");
                this.byId("rangeSaldoPrecio").setMin(12000);
                this.byId("rangeSaldoPrecio").setMax(80000);
                this.byId("rangeSaldoPrecio").setRange([12000, 24000]);




                /*                this.model.setProperty("/availabilityType", "In Store");
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
            onCancelar: function () {
                // Mensaje de regreso al menur porincipal
            },
            setProductTypeFromSegmented: function (evt) {
                var productType = evt.getParameters().item.getText();
                this.model.setProperty("/productType", productType);
                this._wizard.validateStep(this.byId("ProductTypeStep"));        // Aparece el boton siguiente

                switch (productType) {
                    case "Interno":
                        this.model.setProperty("/tipoDocumento", "DNI");
                        this.model.setProperty("/TipoSaldoPrecio", "Saldo bruto anual");

                        this.byId("rangeSaldoPrecio").setMin(12000);
                        this.byId("rangeSaldoPrecio").setMax(80000);
                        this.byId("rangeSaldoPrecio").setRange([12000, 24000]);
                        break;
                    case "Autonomo":
                        this.model.setProperty("/tipoDocumento", "CFI");
                        this.model.setProperty("/TipoSaldoPrecio", "Precio diario");
                        this.byId("rangeSaldoPrecio").setMin(100);
                        this.byId("rangeSaldoPrecio").setMax(2000);
                        this.byId("rangeSaldoPrecio").setRange([100, 400]);
                        break;
                    case "Gerente":
                        this.model.setProperty("/tipoDocumento", "DNI");
                        this.model.setProperty("/TipoSaldoPrecio", "Saldo bruto anual");
                        this.byId("rangeSaldoPrecio").setMin(50000);
                        this.byId("rangeSaldoPrecio").setMax(200000);
                        this.byId("rangeSaldoPrecio").setRange([50000, 70000]);
                        break;
                    default:
                        break;
                }

            },


            additionalInfoValidation: function () {
                var name = this.byId("ProductName").getValue();
                var apellido = this.byId("txtApellido").getValue();
                var numeroDocumento = this.byId("txtNumDoc").getValue();
                // var weight = parseInt(this.byId("ProductWeight").getValue());

                /* if (isNaN(weight)) {
                    this.model.setProperty("/productWeightState", "Error");
                } else {
                    this.model.setProperty("/productWeightState", "None");
                } */

                if (name.length < 1) {
                    this.model.setProperty("/productNameState", "Error");
                } else {
                    this.model.setProperty("/productNameState", "None");
                }

                if (apellido.length < 1) {
                    this.model.setProperty("/apellidoState", "Error");
                } else {
                    this.model.setProperty("/apellidoState", "None");
                }

                if (numeroDocumento.length != 8) {
                    this.model.setProperty("/numDocumentoState", "Error");
                } else {
                    this.model.setProperty("/numDocumentoState", "None");
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
            editStepOne: function () {
                this._handleNavigationToStep(0);
            },
            editStepTwo: function () {
                this._handleNavigationToStep(1);
            },
            editStepFour: function () {
                this._handleNavigationToStep(2);
            },
            _handleNavigationToStep: function (iStepNumber) {
                var fnAfterNavigate = function () {
                    this._wizard.goToStep(this._wizard.getSteps()[iStepNumber]);
                    this._oNavContainer.detachAfterNavigate(fnAfterNavigate);
                }.bind(this);

                this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
                this.backToWizardContent();
            },

            backToWizardContent: function () {
                this._oNavContainer.backToPage(this._oWizardContentPage.getId());
            },


        });
    });

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
                    fechaState: "Error",
                });
                this.getView().setModel(this.model);

                this.model.setProperty("/productType", "Interno");
                this.model.setProperty("/productTypeID", "0");
                this.model.setProperty("/tipoDocumento", "DNI");
                this.model.setProperty("/TipoSaldoPrecio", "Saldo bruto anual");
                this.byId("rangeSaldoPrecio").setMin(12000);
                this.byId("rangeSaldoPrecio").setMax(80000);
                this.byId("rangeSaldoPrecio").setRange([12000, 24000]);

                /* this._setEmptyValue("/discountGroup"); */
            },
            _setEmptyValue: function (sPath) {
                this.model.setProperty(sPath, "");
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
                        this.model.setProperty("/productTypeID", "0");
                        this.model.setProperty("/tipoDocumento", "DNI");
                        this.model.setProperty("/TipoSaldoPrecio", "Saldo bruto anual");

                        this.byId("rangeSaldoPrecio").setMin(12000);
                        this.byId("rangeSaldoPrecio").setMax(80000);
                        this.byId("rangeSaldoPrecio").setRange([12000, 24000]);
                        break;
                    case "Autonomo":
                        this.model.setProperty("/productTypeID", "1");
                        this.model.setProperty("/tipoDocumento", "CFI");
                        this.model.setProperty("/TipoSaldoPrecio", "Precio diario");
                        this.byId("rangeSaldoPrecio").setMin(100);
                        this.byId("rangeSaldoPrecio").setMax(2000);
                        this.byId("rangeSaldoPrecio").setRange([100, 400]);
                        break;
                    case "Gerente":
                        this.model.setProperty("/productTypeID", "3");
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
                var fechaIncorporacion = this.byId("DP1").getValue();

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

                if (fechaIncorporacion == '') {
                    this.model.setProperty("/fechaState", "Error");
                } else {
                    this.model.setProperty("/fechaState", "None");
                }

                //if (name.length < 6 || isNaN(weight)) {
                if (name.length < 1 || apellido.length < 1 || numeroDocumento.length != 8 || fechaIncorporacion == '') {
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


            // Grabar
            handleWizardSubmit: function () {
                this._handleMessageBoxOpen("Esta seguro que quiere grabar?", "confirm");
            },
            _handleMessageBoxOpen: function (sMessage, sMessageBoxType) {
                MessageBox[sMessageBoxType](sMessage, {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {

                            this._handleNavigationToStep(0);
                            this._wizard.discardProgress(this._wizard.getSteps()[0]);
                            
                            var empID = '';
                            // Listar Usuarios
                            this.getView().getModel("employeesModel").read("/Users", {
                                filters: [
                                    new sap.ui.model.Filter("SapId", "EQ", this.getOwnerComponent().SapId)
                                ],
                                success: function (data) {
                                    empID = data.results;
                                    // Grabar

                                    empID = ('000' + empID.length).substr(-3, 3);
                                    // Formatear Fecha
                                    var fecha = this.model.getProperty("/CreationDate");
                                    var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                                        pattern: "yyyy-MM-dd"
                                    });
                                    var oDate = dateFormat.format(new Date(fecha), true);
                                    oDate = oDate + "T00:00:00";

                                    var body = {
                                        EmployeeId: empID,
                                        SapId: this.getOwnerComponent().SapId,
                                        Type: this.model.getProperty("/productTypeID"),
                                        FirstName: this.model.getProperty("/FirstName"),
                                        LastName: this.model.getProperty("/LastName"),
                                        Dni: this.model.getProperty("/Dni"),
                                        CreationDate: oDate,
                                        Comments: this.model.getProperty("/Comments"),
                                    };

                                    this.getView().getModel("employeesModel").create("/Users", body, {
                                        success: function () {
                                            console.log();
                                            // Grabar Monto
                                            var bodyDos = {
                                                SalaryId: "001",
                                                SapId: this.getOwnerComponent().SapId,
                                                EmployeeId: empID,
                                                CreationDate: oDate,
                                                Amount: this.model.getProperty("/Amount").toString(),
                                                Waers: "EUR",
                                                Comments: this.model.getProperty("/Comments"),
                                            }

                                            this.getView().getModel("employeesModel").create("/Salaries", bodyDos, {
                                                success: function () {
                                                    console.log();

                                                    this._setEmptyValue("/FirstName");
                                                    this._setEmptyValue("/LastName");
                                                    this._setEmptyValue("/Dni");
                                                    this._setEmptyValue("/Comments");
                                                    this._setEmptyValue("/Amount");
                                                    //this._setEmptyValue("/CreationDate");

                                                    MessageToast.show("Se grabo satisfactoriamente el usuario " + empID);
                                                }.bind(this),
                                            });
                                        }.bind(this),
                                    });




                                }.bind(this),
                                error: function (e) {
                                    //sap.m.MessageToast.show(oResourceBundle.getText("odataNoChanges"));
                                }

                            });

                            /* this.model.setProperty("/productType", "Interno");
                            this.model.setProperty("/productTypeID", "0");
                            this.model.setProperty("/tipoDocumento", "DNI");
                            this.model.setProperty("/TipoSaldoPrecio", "Saldo bruto anual");
                            this.byId("rangeSaldoPrecio").setMin(12000);
                            this.byId("rangeSaldoPrecio").setMax(80000);
                            this.byId("rangeSaldoPrecio").setRange([12000, 24000]); */



                            //var oSegmentedButton = this.byId('SB1');
                            //oSegmentedButton.setSelectedItem(0);


                        }
                    }.bind(this)
                });
            },

            // Cancelar
            handleWizardCancel: function () {
                this._handleMessageBoxOpenCancel("Esta seguro que desea cancelar?", "warning");
            },
            _handleMessageBoxOpenCancel: function (sMessage, sMessageBoxType) {
                MessageBox[sMessageBoxType](sMessage, {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            this._handleNavigationToStep(0);
                            this._wizard.discardProgress(this._wizard.getSteps()[0]);  // Resetea los pasos

                        }
                    }.bind(this)
                });
            },


        });
    });

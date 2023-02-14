/*--------------------------------------------------------------------
Fecha: 21/08/2017
Detalles: 
Captura la imagen de la placa y obtiene los datos
Selecciona una placa y obtiene los datos
Escanea el codigo de barras del automovil, recupera el chasis y obtiene los datos
Ingresa texto de Placa o VIN y obtiene los datos
Autor: RRP.
--------------------------------------------------------------------*/
// 'use strict';
var resp = "Error";
var respimagen;
var validaServicios = 1;
var inforModelos = "";
var inforModelosN = "";
var arrTipPers = ["NATURAL", "JURIDICA"];
var arDoc = ["CEDULA", "RUC", "PASAPORTE"];
var arrDir = ["DOMICILIO", "TRABAJO"];
var arrMatr = ["SI", "NO"];
var arrTipAva = ["AVALUO", "PRE AVALUO"];
app.lector_barras = kendo.observable({
    onShow: function () {
        try {
            window.scroll(0,0);
            pedirPermiso();
            pedirPermiso("RECORD_AUDIO");
            localStorage.setItem("bandera","1");
            localStorage.removeItem("ls_aniovh62");
            localStorage.removeItem("ls_secuenciavh62");
            if (localStorage.getItem("ls_verRecepcion").toLocaleString() == "0") {
                vaciaCampos();
                //onDeviceReady();
                var anch = screen.width;
                var height1 = (anch / 2) - 30;
                var tama = height1 + "px;";
                consultaLinks();
                var rbtMarcas = document.getElementsByName("rdbMarca");
                document.getElementById("lblKia").textContent = localStorage.getItem("ls_marca").toLocaleString();
                rbtMarcas[0].value = document.getElementById("lblKia").textContent;
                //marcas
                marcaVhe("KIA");
                //modelo
               cboModeloVhe(document.getElementById("marcas2").value, "A4");
                cboModeloAutoN("KiA", "");
                //vendedores
                cboVendedores("");
                //sucursales
                cboSucursales("");
                //color
                cboColores("AZUL");
                //Ubicacion
                cboUbicacion("ORELLANA");
                //// Pais
                cboPaises("ECUADOR");
                //// Ciudad
                cboCiudades(document.getElementById("pais2").value, "QUITO");
                // Cbo. Tipo persona
                cboCarga_2("tpers", arrTipPers, arrTipPers[0], "divcbotpers");
                // Cbo. Tipod de documento
                cboCarga_2("tid", arDoc, arDoc[0], "divcbotid");
                //// Cbo. tipo direccion
                cboCarga_2("direc", arrDir, arrDir[0], "divcbodirec");
                // Cbo. Matriculado
                cboCarga_2("tmatr", arrMatr, arrMatr[0], "divcbotmatr");
                // Cbo. tipo avaluo
                cboCarga_3("tavaluo", arrTipAva, arrTipAva[0], "divcboTiAva");
                // Cbo. enajenar
                cboCarga_2("tenajena", arrMatr, arrMatr[0], "divcboEnajena");
                //tipo formulario
                tipoFormulario("SEMI_NUEVO");
                //transmision
                cbogenerico(localStorage.getItem("ls_idempresa").toLocaleString(),"VH","transmision","transmision2","","dbotransmision");
                //traccion
                cbogenerico(localStorage.getItem("ls_idempresa").toLocaleString(),"VH","tipo_traccion","traccionn2","","dboTraccion");
                //subclase
                cbogenerico(localStorage.getItem("ls_idempresa").toLocaleString(),"IN","subclase_auto","subclase2","","dboCarroceria");
                //grupo auto
                cbogenerico(localStorage.getItem("ls_idempresa").toLocaleString(),"IN","clase_auto","clase2","","dboClase");
                //combustible
                cbogenerico(localStorage.getItem("ls_idempresa").toLocaleString(),"VH","tipo_combustible","combustible2","","dboCombustible");
                llamarNuevoestilo("btnBuscarRCP");
                llamarNuevoestilo("lydOT");
                llamarNuevoestiloIconB("icnBuscarRCP");
                llamarColorTexto(".w3-text-red")
            }
            else {
                localStorage.setItem("ls_verRecepcion", "0");
            }
        } catch (e) {
            alert("onshow"+e);
        }
    },
    afterShow: function () { }//,
    //inicializa: function () {
    //}
});
app.localization.registerView('lector_barras');
// START_CUSTOM_CODE_lector_barras
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes
//document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    $(document).ready(function () {
        $("#tabstripSN").kendoTabStrip({
            animation: {
                open: {
                    effects: "fadeIn"
                }
            }
        });
    });
    //---------------------------------------------------------------------------
    // resetControls("");
    navigator.splashscreen.hide();
    var app = new App();
    app.run();
}

function App() { }
App.prototype = {
    resultsField: null,
    _pictureSource: null,
    _destinationType: null,
    run: function () {
        var that = this,
            scanButton = document.getElementById("scanButton");
        //RRP: boton captura placa -----------------------------
        var capturePhotoButton = document.getElementById("capturePhotoButton");
        capturePhotoButton.addEventListener("click",
            function () {
                //    resetControls();
                that._pictureSource = navigator.camera.PictureSourceType;
                that._destinationType = navigator.camera.DestinationType;
                that._capturePhoto.apply(that, arguments);
            });
        //RRP: boton captura placa -----------------------------
        that.resultsField = document.getElementById("result");
        scanButton.addEventListener("click",
            function () {
                document.getElementById("divLoading").innerHTML = "";
                // Borrar imagen de placa
                document.getElementById("smallImage").style.display = "none";
                //resetControls("");
                vaciaCampos();
                that._scan.call(that);
            });
    },

    _scan: function () {
        var that = this;
        try {
            if (window.navigator.simulator === true) {
                // loading
                document.getElementById("divLoading").innerHTML = "";
                // Borrar imagen de placa
                document.getElementById("smallImage").style.display = "none";
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Aplicaci\u00F3n no compatible.");
            } else {
                cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        if (!result.cancelled) {
                            that._addMessageToLog(result.format, result.text);
                        }
                    },
                    function (error) {
                        // ERROR: SCAN  is already in progress   
                        //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No se realiz\u00F3 el escaneo. Intentelo nuevamente.");
                    });
            }
        } catch (e) {
            alert(e);
        }
    },

    _addMessageToLog: function (format, text) {
        //var that = this,
        //    currentMessage = that.resultsField.innerHTML,
        //    html = '<input type="text" id="txtResPlaca" value="' + text + '"/>';
        //that.resultsField.innerHTML = html;
        TraerInformacion(text, "C");
    },

    //-------------------------------------------
    _capturePhoto: function () {
        var that = this;
        // Take picture using device camera and retrieve image as base64-encoded string.
        navigator.camera.getPicture(function () {
            that._onPhotoDataSuccess.apply(that, arguments);
        }, function () {
            that._onFail.apply(that, arguments);
        }, {
                //quality: 100,
                //targetWidth: 1000,
                //targetHeight: 500,
                quality: 100,
                targetWidth: 1280,
                targetHeight: 720,
                //      encodingType: Camera.encodingType.PNG,
                allowEdit: true,
                destinationType: that._destinationType.FILE_URI,
                //   destinationType: that._destinationType.DATA_URL,
                correctOrientation: true,
                saveToPhotoAlbum: true // RRP: Guarda la imagen en el album
            });
    },

    //----------------------------------------
    // Captura la imagen y la presenta en tipo PATH
    //----------------------------------------
    _onPhotoDataSuccess: function (imageURI) {
        vaciaCampos();
        //resetControls("");
        var smallImage = document.getElementById('smallImage');
        smallImage.style.display = 'block';
        smallImage.style.visibility = 'visible';
        // Show the captured photo.
        smallImage.src = imageURI;
        uploadPhoto(imageURI);
    },
    //----------------------------------------
    // Captura la imagen y la presenta en tipo BASE64
    //----------------------------------------
    //_onPhotoDataSuccess: function (imageData) {
    //    var smallImage = document.getElementById('smallImage');
    //    smallImage.style.display = 'block';
    //    smallImage.style.visibility = 'visible';
    //    // Show the captured photo.
    //    smallImage.src = "data:image/jpeg;base64," + imageData;
    //  //  document.getElementById("smallImage").style.visibility = 'visible';
    //},
    _onFail: function (message) {
        // no se tomo la foto
        //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No se ha guardado ninguna imagen. Intentelo nuevamente.");
    }
}

//-------------------------------------------
// Called when capture operation is finished
function captureSuccess1111(mediaFiles) {
    var i, len;
    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
        uploadFile2(mediaFiles[i]);
    }
}

// Called if something bad happens.
function captureError(error) {
    //var msg = 'An error occurred during capture: ' + error.code;
    //navigator.notification.alert(msg, null, 'Uh oh!');
    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso. Int\u00E9ntelo nuevamente.");
}

// A button will call this function
//function captureVideo() {
    // Iniciar la aplicaci?n de grabaci?n de video
    // permite capturar hasta 2 clips de video
    //navigator.device.capture.captureVideo(captureSuccess, captureError, { limit: 1 });
//}

// Upload files to server
function uploadFile2(mediaFile) {
    var ft = new FileTransfer(),
        path = mediaFile.fullPath,
        name = mediaFile.name;
    //  window.myalert("<center><i class=\"fa fa-check-circle-o\"></i> GUARDADO</center>", "El video fue almacenado exitosamente.");
    var vidPorcentaje = 80;
    //  var vidAlto = (screen.height * vidPorcentaje) / 100;
    var vidAncho = (screen.width * vidPorcentaje) / 100;
    document.getElementById("videosOT").innerHTML = "<br /><video width='" + vidAncho + "' height='" + vidAncho + "' controls Autoplay=autoplay><source src='" + path + "' type='video/mp4'></video>";
    //ft.upload(path,
    //    "http://my.domain.com/upload.php",
    //    function (result) {
    //        console.log('Upload success: ' + result.responseCode);
    //        console.log(result.bytesSent + ' bytes sent');
    //    },
    //    function (error) {
    //        console.log('Error uploading file ' + path + ': ' + error.code);
    //    },
    //    { fileName: name });
}
// vehiculos
function cbogenerico(emp,tipo,tipovh,tipoID,seltipo,nombreTipo) {
    var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ComboParametroEmpGet/2,"+
    emp+";"+tipo+";"+tipovh+";";
    //"http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;IN;MARCAS;"
    var inforGene;
    //alert(Url);
    $.ajax({
        url: Url,
        type: "GET",
        async: false,
        dataType: "json",
        success: function (data) {
            try {
                inforGene = (JSON.parse(data.ComboParametroEmpGetResult));
            } catch (e) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso");
                return;
            }
        },
        error: function (err) {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso. Int\u00E9ntelo nuevamente.");
            return;
        }
    });
    if (inforGene.length > 0) {
        var cboMarcaHTML = "<p><select id='"+tipoID+"' class='w3-input w3-border textos'>";
        cboMarcaHTML += "<option value='0,0'>Seleccione</option>";
        for (var i = 0; i < inforGene.length; i++) {
            if (seltipo == inforGene[i].CodigoClase) {
                cboMarcaHTML += "<option  value='" + inforGene[i].CodigoClase + "' selected>" + inforGene[i].NombreClase + "</option>";
            }
            else {
                cboMarcaHTML += "<option  value='" + inforGene[i].CodigoClase + "'>" + inforGene[i].NombreClase + "</option>";
            }
        }
        cboMarcaHTML += "</select>";
        document.getElementById(nombreTipo).innerHTML = cboMarcaHTML;
    }
    else {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Marcas");
    }
}
//-----------------------------------------
//marcas de vehiculos
function marcaVhe(selMarca) {
    var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;IN;MARCAS;";
    //"http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;IN;MARCAS;"
    var inforMarca;
    //alert(Url);
    $.ajax({
        url: Url,
        type: "GET",
        async: false,
        dataType: "json",
        success: function (data) {
            try {
                inforMarca = (JSON.parse(data.ComboParametroEmpGetResult));
            } catch (e) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso");
                return;
            }
        },
        error: function (err) {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso. Int\u00E9ntelo nuevamente.");
            return;
        }
    });
    if (inforMarca.length > 0) {
        var cboMarcaHTML = "<p><select id='marcas2' onchange='cboModeloVhe(this.value)' class='w3-input w3-border textos'>";
        for (var i = 0; i < inforMarca.length; i++) {
            if (selMarca == inforMarca[i].CodigoClase) {
                cboMarcaHTML += "<option  value='" + inforMarca[i].CodigoClase + "' selected>" + inforMarca[i].NombreClase + "</option>";
            }
            else {
                cboMarcaHTML += "<option  value='" + inforMarca[i].CodigoClase + "'>" + inforMarca[i].NombreClase + "</option>";
            }
        }
        cboMarcaHTML += "</select>";
        document.getElementById("divcbomarcas").innerHTML = cboMarcaHTML;
    }
    else {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Marcas");
    }
}

function cboModeloVhe(itmMarca, selModelo) {
    if (itmMarca != "") {
        var UrlCboModelos = localStorage.getItem("ls_url2").toLocaleString() + "/Services/in/Inventarios.svc/in11ModelosGet/1,1;" + itmMarca;
        //"http://186.71.21.170:8077/taller/Services/in/Inventarios.svc/in11ModelosGet/1,1;" + itmMarca;
        inforModelos = "";
        //alert(UrlCboModelos);
        $.ajax({
            url: UrlCboModelos,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (data) {
                try {
                    inforModelos = JSON.parse(data.in11ModelosGetResult);
                } catch (e) {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Modelos");
                    return;
                }
            },
            error: function (err) {
                //alert(err);
                //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Ciudad");
                return;
            }
        });
        if (inforModelos.length > 0) {
            cboModelosHTML = "<p><select id='modelo2' onchange='cboDescVhe(this.value)' class='w3-input w3-border textos'>";
            var banDescr = 0;
            for (var i = 0; i < inforModelos.length; i++) {
                if (inforModelos[i].CodigoClase != " " || inforModelos[i].CodigoClase != "ninguna") {
                    if (selModelo == inforModelos[i].CodigoClase) {
                        cboModelosHTML += "<option  value='" + inforModelos[i].CodigoClase + "' selected>" + inforModelos[i].CodigoClase + " (" + inforModelos[i].NombreClase + ")" + "</option>";
                        document.getElementById("desmodelo").value = inforModelos[i].NombreClase;
                        banDescr = 1;
                    }
                    else {
                        cboModelosHTML += "<option  value='" + inforModelos[i].CodigoClase + "'>" + inforModelos[i].CodigoClase + " (" + inforModelos[i].NombreClase + ")" + "</option>";
                    }
                }
            }
            cboModelosHTML += "</select>";
        }
        else {
            cboModelosHTML = "<p><select id='modelo2' class='w3-input w3-border textos'>";
            cboModelosHTML += "<option  value=' '>Ninguna</option>";
            cboModelosHTML += "</select>";
        }
    }
    document.getElementById("divcboModelo").innerHTML = cboModelosHTML;
    if (selModelo === undefined) {
        if (inforModelos.length === 1) {
            document.getElementById("desmodelo").value = inforModelos[0].NombreClase;
        } else {
            document.getElementById("desmodelo").value = "";
        }
    }

    //else {
    //    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Ciudad");
    //}
}

function cboDescVhe(itmdes, prueba) {
    for (var j = 0; j < inforModelos.length; j++) {
        if (itmdes == inforModelos[j].CodigoClase) {
            document.getElementById("desmodelo").value = inforModelos[j].NombreClase;
        }
    }

}

function cboColores(selColor) {
    var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;VH;COLOR_VEHICULO;";
    //"http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;VH;COLOR_VEHICULO;"
    var inforColor;
    $.ajax({
        url: Url,
        type: "GET",
        async: false,
        dataType: "json",
        success: function (data) {
            try {
                inforColor = (JSON.parse(data.ComboParametroEmpGetResult));
            } catch (e) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso");
                return;
            }
        },
        error: function (err) {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso. Int\u00E9ntelo nuevamente.");
            return;
        }
    });
    if (inforColor.length > 0) {
        var cboColorHTML = "<p><select id='Color2' class='w3-input w3-border textos'>";
        for (var i = 0; i < inforColor.length; i++) {
            if (selColor == inforColor[i].CodigoClase) {
                cboColorHTML += "<option  value='" + inforColor[i].CodigoClase + "' selected>" + inforColor[i].NombreClase + "</option>";
            }
            else {
                cboColorHTML += "<option  value='" + inforColor[i].CodigoClase + "'>" + inforColor[i].NombreClase + "</option>";
            }
        }
        cboColorHTML += "</select>";
        document.getElementById("divcboColor").innerHTML = cboColorHTML;
    }
    else {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Color");
    }
}
function cboSucursales(selSucursal) {
    try {
        // Recupera las Agencias por Empresa y Usuario
        var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/AU/Seguridad.svc/EmpAgUsuario/" + localStorage.getItem("ls_idempresa").toLocaleString() + ";" + localStorage.getItem("ls_usulog").toLocaleString();
        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", Url);
        var accResp = "";
        $.ajax({
            url: Url,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (data) {
                try {
                    accResp = JSON.parse(data.EmpAgUsuarioResult);
                } catch (e) {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Datos Incorrectos");
                    return;
                }
            },
            error: function (err) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Datos Incorrectos");
                return;
            }
        });
        // Crea el combo de Agencias con la data anterior 
        if (accResp.length > 0) {
            var cboAgenHTML = "<p><select id='cboAgenciasVD' class='w3-input w3-border textos'>";
            cboAgenHTML += "<option value='0,0'>Seleccione</option>";
            for (var i = 0; i < accResp.length; i++) {
                if (selSucursal == accResp[i].CodigoSucursal) {
                    cboAgenHTML += "<option  value='" + accResp[i].CodigoSucursal  + "," + accResp[i].CodigoAgencia + "' selected>" + accResp[i].NombreAgencia + "</option>";
                }else{
                    cboAgenHTML += "<option  value='" + accResp[i].CodigoSucursal + "," + accResp[i].CodigoAgencia + "'>" + accResp[i].NombreAgencia + "</option>";
                }
            }
            cboAgenHTML += "</select>";
            document.getElementById("divcboSucursal").innerHTML = cboAgenHTML;
        }
        else {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "El usuario no tiene asignado empresa o agencia");
        }
    } catch (e) {

    }
    
}
function cboVendedores(selVender) {
    var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/Combotg39VendedoresGet/2,"+
    localStorage.getItem("ls_idempresa").toString()+";"+localStorage.getItem("ls_ussucursal").toString() +";"+
    localStorage.getItem("ls_usagencia").toString()+";VH";
    //"http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;VH;COLOR_VEHICULO;"
    var inforVender;
    //alert(Url);
    $.ajax({
        url: Url,
        type: "GET",
        async: false,
        dataType: "json",
        success: function (data) {
            try {
                inforVender = (JSON.parse(data.Combotg39VendedoresGetResult));
            } catch (e) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso");
                return;
            }
        },
        error: function (err) {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso. Int\u00E9ntelo nuevamente.");
            return;
        }
    });
    if (inforVender.length > 0) {
        var cboVenderHTML = "<p><select id='Vender2' class='w3-input w3-border textos'>";
        for (var i = 0; i < inforVender.length; i++) {
            if (selVender == inforVender[i].CodigoClase) {
                cboVenderHTML += "<option  value='" + inforVender[i].CodigoClase + "' selected>" + inforVender[i].NombreClase + "</option>";
            }
            else {
                cboVenderHTML += "<option  value='" + inforVender[i].CodigoClase + "'>" + inforVender[i].NombreClase + "</option>";
            }
        }
        cboVenderHTML += "</select>";
        document.getElementById("divcboVender").innerHTML = cboVenderHTML;
    }
    else {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio");
    }
}

function cboUbicacion(selUbica) {
    var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;VH;UBICACION_USADOS;";
     // "http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;VH;UBICACION_USADOS;"
    var inforUbica;
    $.ajax({
        url: Url,
        type: "GET",
        async: false,
        dataType: "json",
        success: function (data) {
            try {
                inforUbica = (JSON.parse(data.ComboParametroEmpGetResult));
            } catch (e) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso");
                return;
            }
        },
        error: function (err) {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso. Int\u00E9ntelo nuevamente.");
            return;
        }
    });
    if (inforUbica.length > 0) {
        var cboUbicaHTML = "<p><select id='Ubica2' class='w3-input w3-border textos'>";
        for (var i = 0; i < inforUbica.length; i++) {
            if (selUbica == inforUbica[i].CodigoClase) {
                cboUbicaHTML += "<option  value='" + inforUbica[i].CodigoClase + "' selected>" + inforUbica[i].NombreClase + "</option>";
            }
            else {
                cboUbicaHTML += "<option  value='" + inforUbica[i].CodigoClase + "'>" + inforUbica[i].NombreClase + "</option>";
            }
        }
        cboUbicaHTML += "</select>";
        document.getElementById("divcboUbica").innerHTML = cboUbicaHTML;
    }
    else {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Ubicación");
    }
}

function cboModeloAutoN(itmMarca, selModelo) {
    if (itmMarca != "") {
        var UrlCboModelos = localStorage.getItem("ls_url2").toLocaleString() + "/Services/in/Inventarios.svc/in11ModelosGet/1,1;KIA";
        //"http://186.71.21.170:8077/taller/Services/in/Inventarios.svc/in11ModelosGet/1,1;" + itmMarca;
        inforModelosN = "";
        $.ajax({
            url: UrlCboModelos,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (data) {
                try {
                    inforModelosN = JSON.parse(data.in11ModelosGetResult);
                } catch (e) {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Modelos");
                    return;
                }
            },
            error: function (err) {
                alert(err);
                //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Ciudad");
                return;
            }
        });
        if (inforModelosN.length > 0) {
            cboModelosNHTML = "<p><select id='modelo3' class='w3-input w3-border textos'>";
            var banDescr = 0;
            for (var i = 0; i < inforModelosN.length; i++) {
                if (inforModelosN[i].CodigoClase != " " || inforModelosN[i].CodigoClase != "ninguna") {
                    if (selModelo == inforModelosN[i].CodigoClase) {
                        cboModelosNHTML += "<option  value='" + inforModelosN[i].CodigoClase + "' selected>" + inforModelosN[i].CodigoClase + " (" + inforModelosN[i].NombreClase + ")" + "</option>";
                        //document.getElementById("desmodeloN").value = inforModelosN[i].NombreClase;
                        //banDescr = 1;
                    }
                    else {
                        cboModelosNHTML += "<option  value='" + inforModelosN[i].CodigoClase + "'>" + inforModelosN[i].CodigoClase + " (" + inforModelosN[i].NombreClase + ")" + "</option>";
                    }
                }
            }
            cboModelosNHTML += "</select>";
        }
        else {
            cboModelosNHTML = "<p><select id='modelo3' class='w3-input w3-border textos'>";
            cboModelosNHTML += "<option  value=' '>Ninguna</option>";
            cboModelosNHTML += "</select>";
        }
    }
    document.getElementById("divcboAutoN").innerHTML = cboModelosNHTML;
}

function tipoFormulario(selForm) {
    //http://192.168.1.50:8089/concesionario/Services/TG/Parametros.svc/ComboParametroEmpGet/10,1;VH;TIPO_FORMULARIO_USADOS;;;SEMINUEVOS;;;;;
    var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ComboParametroEmpGet/10,1;VH;TIPO_FORMULARIO_USADOS;;;SEMINUEVOS;;;;;";
    var inforTipoForm;
   // window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", Url);
    $.ajax({
        url: Url,
        type: "GET",
        async: false,
        dataType: "json",
        success: function (data) {
            try {
                //alert(inspeccionar(data));
                inforTipoForm = (JSON.parse(data.ComboParametroEmpGetResult));
            } catch (e) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso");
                return;
            }
        },
        error: function (err) {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso. Int\u00E9ntelo nuevamente.");
            return;
        }
    });
    if (inforTipoForm.length > 0) {
        var cboFormHTML = "<p><select id='formulario2' onchange='cboformularioVhe(this.value)' class='w3-input w3-border textos'>";
        for (var i = 0; i < inforTipoForm.length; i++) {
            if (selForm == inforTipoForm[i].CodigoClase) {
                cboFormHTML += "<option  value='" + inforTipoForm[i].CodigoClase + "' selected>" + inforTipoForm[i].NombreClase + "</option>";
            }
            else {
                cboFormHTML += "<option  value='" + inforTipoForm[i].CodigoClase + "'>" + inforTipoForm[i].NombreClase + "</option>";
            }
        }
        cboFormHTML += "</select>";
        document.getElementById("divcboForm").innerHTML = cboFormHTML;
    }
    else {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Tipo Formulario");
    }

}

function llamar(placaVIN) {
    kendo.ui.progress($("#lector_barrasScreen"), true);
    setTimeout(function () {
        buscaPlacaVIN(placaVIN.toUpperCase());
    }, 2000)    ;
}

function buscaPlacaVIN(placaVIN) {
    try {
        document.getElementById("tabstripSN").style.display = "none";
        document.getElementById("tablaOT").style.display = "none";
        document.getElementById("datosOT").style.display = "none";
        document.getElementById("tablaPrmEM").style.display = "none";
        document.getElementById("divtableEM").style.display = "none";
        
        resetControls("");
        // Borrar imagen de placa
        document.getElementById("smallImage").style.display = "none";
        if (document.getElementById('infoPlacasVINRCP').value != "") {
            if (placaVIN.length > 8) {
				
				
                var patron = /^\d*$/;
                if (patron.test(placaVIN)) {
				//------------------------------------
				/*
				// RRP: 2018-08-24
				if (placaVIN.length >= 17){					
					TraerInformacion(placaVIN, "C");
				}
				else
				{
					TraerInformacion(placaVIN, "O");					
				}
				*/
				//------------------------------------
					
                    TraerInformacion(placaVIN, "O");
                }
                else {
                    TraerInformacion(placaVIN, "C");
                }
					
            }
            else {
                TraerInformacion(placaVIN, "P");
            }
        }
        else {
            // loading
            document.getElementById("divLoading").innerHTML = "";
            // Borrar imagen de placa
            document.getElementById("smallImage").style.display = "none";
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Ingrese la Placa o VIN");
        }
       kendo.ui.progress($("#lector_barrasScreen"), false);
    } catch (e1) {
        alert("buscaVin  " + e1);
    }
}

function cboPaises(selPais) {
    //  http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/ParametroGralGet/1,18
    var UrlCboPaises = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ParametroGralGet/1,18"
    //  alert(UrlCboPaises);
    var cboPaResp = "";
    $.ajax({
        url: UrlCboPaises,
        type: "GET",
        dataType: "json",
        async: false,
        success: function (data) {
            try {
                cboPaResp = JSON.parse(data.ParametroGralGetResult);
            } catch (e) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Pais");
                return;
            }
        },
        error: function (err) {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Pais");
            return;
        }
    });
    if (cboPaResp.length > 0) {
        var cboPaisHTML = "<p><select id='pais2' onchange='cboCiudades(this.value)' class='w3-input w3-border textos'>";
        for (var i = 0; i < cboPaResp.length; i++) {
            if (selPais == cboPaResp[i].CodigoClase) {
                cboPaisHTML += "<option  value='" + cboPaResp[i].CodigoClase + "' selected>" + cboPaResp[i].NombreClase + "</option>";
            }
            else {
                cboPaisHTML += "<option  value='" + cboPaResp[i].CodigoClase + "'>" + cboPaResp[i].NombreClase + "</option>";
            }
        }
        cboPaisHTML += "</select>";
        document.getElementById("divcboPais").innerHTML = cboPaisHTML;
    }
    else {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Pais");
    }
}

function cboCiudades(itmPais, selCiudad) {
    // http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/CiudadesGet/1,ECUADOR
    var cboCiudadHTML = "<p><select id='ciudad2' onchange='cboMantenimientos(this.value)' class='w3-input w3-border textos'>";
    cboCiudadHTML += "<option  value=' '>Ninguna</option>";
    cboCiudadHTML += "</select>";
    if (itmPais != "") {
        var UrlCboCiudades = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/CiudadesGet/1," + itmPais;
        //alert(UrlCboCiudades);
        var cboCiuResp = "";
        $.ajax({
            url: UrlCboCiudades,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (data) {
                try {
                    cboCiuResp = JSON.parse(data.CiudadesGetResult);
                } catch (e) {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Ciudad");
                    return;
                }
            },
            error: function (err) {
                alert(inspeccionar(err));
                //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Ciudad");
                return;
            }
        });
        if (cboCiuResp.length > 0) {
            cboCiudadHTML = "<p><select id='ciudad2' class='w3-input w3-border textos'>";
            for (var i = 0; i < cboCiuResp.length; i++) {
                if (cboCiuResp[i].CodigoClase != " " || cboCiuResp[i].CodigoClase != "ninguna") {
                    if (selCiudad == cboCiuResp[i].CodigoClase) {
                        cboCiudadHTML += "<option  value='" + cboCiuResp[i].CodigoClase + "' selected>" + cboCiuResp[i].NombreClase + "</option>";
                    }
                    else {
                        cboCiudadHTML += "<option  value='" + cboCiuResp[i].CodigoClase + "'>" + cboCiuResp[i].NombreClase + "</option>";
                    }
                }
            }
            cboCiudadHTML += "</select>";
        }
        else {
            cboCiudadHTML = "<p><select id='ciudad2' class='w3-input w3-border textos'>";
            cboCiudadHTML += "<option  value=' '>Ninguna</option>";
            cboCiudadHTML += "</select>";
        }
    }
    document.getElementById("divcboCiudad").innerHTML = cboCiudadHTML;
    //else {
    //    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Ciudad");
    //}
}
function cboCarga_3(idCombo, arrCombo, selItem, divCombo) {
    //alert(selItem);
    var cboAgenciaHTML = "<p><select id='" + idCombo + "' class='w3-input w3-border textos' onchange='cambioAvaluo(this.value)'>";
    for (var i = 0; i < arrCombo.length; i++) {
        if (selItem == arrCombo[i]) {
            cboAgenciaHTML += "<option  value='" + arrCombo[i] + "' selected>" + arrCombo[i] + "</option>";
        }
        else {
            cboAgenciaHTML += "<option  value='" + arrCombo[i] + "'>" + arrCombo[i] + "</option>";
        }
    }
    cboAgenciaHTML += "</select>";
    document.getElementById(divCombo).innerHTML = cboAgenciaHTML;
}
function cboCarga_2(idCombo, arrCombo, selItem, divCombo) {
    //alert(selItem);
    var cboAgenciaHTML = "<p><select id='" + idCombo + "' class='w3-input w3-border textos')'>";
    for (var i = 0; i < arrCombo.length; i++) {
        if (selItem == arrCombo[i]) {
            cboAgenciaHTML += "<option  value='" + arrCombo[i] + "' selected>" + arrCombo[i] + "</option>";
        }
        else {
            cboAgenciaHTML += "<option  value='" + arrCombo[i] + "'>" + arrCombo[i] + "</option>";
        }
    }
    cboAgenciaHTML += "</select>";
    document.getElementById(divCombo).innerHTML = cboAgenciaHTML;
}

function grabarEstado() {
    //http://192.168.1.50:8089/concesionario/Services/VH/Vehiculos.svc/vh62VinUsadoGet/6,json;1;01;01;;;;;;2017;1;PENDIENTE
	/*// RRP: 2018-08-27 
    var urlEstado = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh62VinUsadoGet/6,json;" + localStorage.getItem("ls_idempresa").toLocaleString() +
        ";" + localStorage.getItem("ls_ussucursal").toLocaleString() + ";" + localStorage.getItem("ls_usagencia").toLocaleString() +
        ";;;;;;" + document.getElementById("anio_vh62").value + ";" + document.getElementById("secuencia").value + ";PENDIENTE";
	*/
    var urlEstado = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh62VinUsadoGet/6,json;" + localStorage.getItem("ls_idempresa").toLocaleString() +
        ";" + localStorage.getItem("ls_ussucursal").toLocaleString() + ";" + localStorage.getItem("ls_usagencia").toLocaleString() +
        ";;;"+ localStorage.getItem("ls_usulog").toLocaleString() +";;;" + localStorage.getItem("ls_aniovh62").toLocaleString() + ";" + localStorage.getItem("ls_secuenciavh62").toLocaleString() + ";PARA_AVALUO";
    
    //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", urlEstado);
    var inforEst;
    $.ajax({
        url: urlEstado,
        type: "GET",
        async: false,
        dataType: "json",
        success: function (data) {
            try {
                if (data.vh62VinUsadoGetResult.substr(0, 1) == "1") {
                    alert("se actualizaron los datos");
                    desabilitaTodo(true);
                    //return;
                } else { alert(data.vh62VinUsadoGetResult.substr(2, data.length)); return; }
                //infor = (JSON.parse(data.vh62VinUsadoGetResult));
            } catch (e) {
                alert(inspeccionar(e));
                recurrenteOT = 1;
            }
        },
        error: function (err) {
            // loading
            // Borrar imagen de placa
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso. Int\u00E9ntelo nuevamente.");
            return;
        }
    });
    //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "aqui va cambia de estado");
}
function desabilitaTodo(sn) {
    try {
        
        document.getElementById("chasis").disabled = sn;
        document.getElementById("motor").disabled = sn;
        document.getElementById("anio_modelo").disabled = sn;
        document.getElementById("kilometros").disabled = sn;
        document.getElementById("divcbomarcas").disabled = sn;
        document.getElementById("divcboModelo").disabled = sn;
        document.getElementById("desmodelo").disabled = sn;
        document.getElementById("observacionR").disabled = sn;
        var color2 = document.getElementById("Color2");
        document.getElementById("cilindraje").disabled = sn;
        document.getElementById("placa").disabled = sn;
        document.getElementById("anio_matricula").disabled = sn;
        var ubica2 = document.getElementById("Ubica2");
        var formulario = document.getElementById("formulario2");
        var modelo3 = document.getElementById("modelo3");
        var vender2 = document.getElementById("Vender2");
        var cboAgenciasVD = document.getElementById("cboAgenciasVD");
        document.getElementById("fecha_recepcion").disabled = sn;
        //document.getElementById("anio_vh62").disabled = sn;
        //.getElementById("secuencia").disabled = sn;
        //document.getElementById("estado").disabled = sn;
        color2.disabled = sn;
        formulario.disabled = sn;
        modelo3.disabled = sn;
        vender2.disabled = sn;
        cboAgenciasVD.disabled = sn;
        ubica2.disabled = sn;
        document.getElementById("tpers").disabled = sn;
        document.getElementById("tid").disabled = sn;
        document.getElementById("numero_id_propietario").disabled = sn;
        document.getElementById("persona_numero").disabled = sn;
        document.getElementById("persona_nombre").disabled = sn;
        document.getElementById("persona_nombre2").disabled = sn;
        document.getElementById("persona_apellido").disabled = sn;
        document.getElementById("persona_apellido2").disabled = sn;
        document.getElementById("pais2").disabled = sn;
        document.getElementById("ciudad2").disabled = sn;
        document.getElementById("direc").disabled = sn;
        document.getElementById("cli_calle_principal_propietario").disabled = sn;
        document.getElementById("cli_numero_calle_propietario").disabled = sn;
        document.getElementById("cli_calle_interseccion_propieta").disabled = sn;
        document.getElementById("telefono_celular").disabled = sn;
        document.getElementById("cli_telefono_propietario").disabled = sn;
        document.getElementById("mail").disabled = sn;
        document.getElementById("guardaUsa2").disabled = sn;
        document.getElementById("guardaUsa0").disabled = sn;
    } catch (e) {
        alert("11"+e);
    }
    
}
/*--------------------------------------------------------------------
Fecha: 16/08/2017
Detalle: Obtiene la informacion a traves del Chasis
Autor: RRP
--------------------------------------------------------------------*/
function TraerInformacion(responseText, tipo) {
	
    // Presenta el primer item del tabtrip
    var tabstrip = $("#tabstripSN").kendoTabStrip().data("kendoTabStrip");
    var placaActiva = "";
    var cilindrajeActiva = "";
    tabstrip.select(0);
    document.getElementById('infoPlacasVINRCP').value = responseText;
    document.getElementById("divOTVideosCont").innerHTML = "";
    var recurrenteOT = "";
    var intResult = "";
    var today = new Date();
    var hora = today.getHours();
    var minu = today.getMinutes();
    var segu = today.getSeconds();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //Enero is 0
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }

    try {
        var Url = "";
        // http://186.71.21.170:8077/taller/Services/TL/Taller.svc/tl06OrdenesGet/1,json;1;;;PCT7242;
        // http://186.71.21.170:8077/taller/Services/TL/Taller.svc/tl06OrdenesGet/1,json;1;;;PCT7242;
        //"/Services/vh/Vehiculos.svc/vh62VinUsadoGet"
        //"/Services/TL/Taller.svc/tl06OrdenesGet/1,json;"    antes
        //llave
        //ctipo_archivo;iempresa;csucursal;cagencia;cplaca;cchasis;cuser;
        //cid_cliente; cpropietario; ianio_vh62; isecuencia_vh62; cestado;cestado_certificacion;cobser;dvalo;

        if (tipo == "P") {
            // Placa
            Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/vh/Vehiculos.svc/vh62VinUsadoGet/1,json;" +
                localStorage.getItem("ls_idempresa").toLocaleString() + ";" + localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
                localStorage.getItem("ls_usagencia").toLocaleString() + ";" + responseText + ";;" + localStorage.getItem("ls_usulog").toLocaleString() +
                ";;;;;;;;";
        } else {
            if (tipo == "C") {
                // Chasis
                //Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl06OrdenesGet/1,json;" + localStorage.getItem("ls_idempresa").toLocaleString() + ";;;;" + responseText;
                Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/vh/Vehiculos.svc/vh62VinUsadoGet/1,json;" +
                  localStorage.getItem("ls_idempresa").toLocaleString() + ";" + localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
                  localStorage.getItem("ls_usagencia").toLocaleString() + ";;" + responseText + ";" + localStorage.getItem("ls_usulog").toLocaleString() +
                  ";;;;;;;;";
            }
        }
        //else {
        //    // OT
        //    Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl06OrdenesGet/4,json;" + localStorage.getItem("ls_idempresa").toLocaleString() + ";" + localStorage.getItem("ls_ussucursal").toLocaleString() + ";" + localStorage.getItem("ls_usagencia").toLocaleString() + ";;;;;;" + responseText + ";";
        //}
        var infor;
		
	//	document.getElementById("RRPOT").value = Url;
		
        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", Url);
		
		$.ajax({
            url: Url,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    
                    if (data.vh62VinUsadoGetResult.substr(0, 1) == "0") {
                        recurrenteOT = 1;
                    } else {
                        infor = (JSON.parse(data.vh62VinUsadoGetResult)).tvh62[0];
                        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", inspeccionar(infor));
                    }

                    
                } catch (e) {
                    //alert(e);
                    recurrenteOT = 1;
                }
            },
            error: function (err) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso. Int\u00E9ntelo nuevamente.");
                return;
            }
        });
        if (recurrenteOT < 1) {
            try {
                //alert(inspeccionar(infor));
                // Usuario crea => login actual
                //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", inspeccionar(infor));
                localStorage.setItem("ls_ultimokm", infor.kilometraje);
                localStorage.setItem("ls_aniovh62", infor.anio_vh62);
                localStorage.setItem("ls_secuenciavh62", infor.secuencia_vh62);
                if (infor.tipo_registro == "COMPRA") {
                    var radios = document.getElementsByName("rdbDatos");
                    radios[1].checked = true;
                } 
                if (tipo == "O") {
                    document.getElementById("usuario_modificacion").value = infor.usuario_modificacion;
                    document.getElementById("km").value = infor.kilometraje;
                     // Info Orden de trabajo
                    document.getElementById("numOT").value = responseText;
                    document.getElementById("divInfOT").style.display = "block";
                    document.getElementById("divInfOT").style.visibility = "visible";
                    // Cbo. Seccion
                    cboSecciones(infor.seccion_orden_trabajo.toUpperCase());
                    // Cbo. Seccion
                    cboSecciones("MECANICA");
                    // Tipo trabajo
                    cboTrabajos(document.getElementById("seccion2").value, infor.tipo_trabajo);
                    // Mantenimiento
                    cboMantenimientos(document.getElementById("trabajo2").value, infor.tipo_mantenimiento);
                    document.getElementById("anio2").value = infor.anio;
                    document.getElementById("secuencia_orden2").value = infor.secuencia_orden;
                    document.getElementById("fecha_recepcion").value = infor.fecha_recepcion;
                    document.getElementById("observacionR").value = infor.observaciones;
                    document.getElementById("btnGuardaInfo").innerHTML = "<button id='guardaUsa0' onclick='GuardarDatosCV();' class='w3-btn'>MODIFICAR</button>" + "    " + 
                                                                         "<button id='guardaUsa1' onclick='vaciaCampos();' class='w3-btn'>NUEVO</button>" + "    " + 
                                                                         "<button id='guardaUsa2' onclick='grabarEstado();' class='w3-btn'>CAMBIAR ESTADO</button>";
                    llamarNuevoestilo("guardaUsa");
                }
                else {
                    noOT(yyyy,mm,dd,hora,minu,segu);
                }
                //alert(yyyy);
                //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", inspeccionar(infor));
                datosCon(infor,yyyy,dd + '-' + mm + '-' + yyyy);
                document.getElementById("tabstripSN").style.display = 'block';
                placaActiva = infor.placa.toUpperCase();
                cilindrajeActiva = infor.cilindraje
                desabilitaTodo(false);
                activaDesactiva(true, placaActiva, cilindrajeActiva);
                if (infor.estado !== "" && infor.estado !== "INSPECCION_VISUAL") {
                    desabilitaTodo(true);
                    //document.getElementbyId('datosVEH').style.disabled = true;
                }
            } catch (e2) {
                alert("11"+e2);

            }
        }
        else {
            //-----------------------------------------
                
            if ($('input:radio[name=rdbMarca]:checked').val() == "otros") {
                document.getElementById("estado").value = "INSPECCION_VISUAL";
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No existen datos del \nC\u00F3digo: " + responseText);
                document.getElementById("videosOT").innerHTML = "";
                document.getElementById("videosOT").innerHTML = "<br /><a id='btnVideo0' class='w3-btn primary' aria-label='Video' onclick='captureVideo();'><i id='icnVideo0' class='fa fa-video-camera' aria-hidden='true'></i>&nbsp;Grabar Video</a>" +
                                                               "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a id='btnVideo1' class='w3-btn primary' aria-label='Foto' onclick='captureImagen();'><i id='icnVideo1' class='fa fa-camera' aria-hidden='true'></i>&nbsp;Grabar Fotos</a>";
                console.log("1"+document.getElementById("videosOT").innerHTML);
                llamarNuevoestilo("btnVideo");
                llamarNuevoestiloIconB("icnVideo");                                               
                document.getElementById("tabstripSN").style.display = 'block';
                if(tipo=="P"){
                    document.getElementById("placa").value = responseText;
                }else{
                    document.getElementById("chasis").value = responseText;
                }
                document.getElementById("fecha_recepcion").value = yyyy + '-' + mm + '-' + dd + '  ' + hora + ':' + minu + ':' + segu;
                document.getElementById("btnGuardaInfo").innerHTML = "<button id='guardaUsa0' onclick='GuardarDatosCV();' class='w3-btn '>GUARDAR</button>" + "    " + 
                                                                     "<button id='guardaUsa1' onclick='vaciaCampos();' class='w3-btn'>NUEVO</button>" + "    " + 
                                                                     "<button id='guardaUsa2' onclick='grabarEstado();' class='w3-btn'>CAMBIAR ESTADO</button>";
                                                                     llamarNuevoestilo("guardaUsa");
                activaDesactiva(false, "", "");
                desabilitaTodo(false);
                cboSucursales(false);
               return;
            }
            if (tipo == "P") {
                // Placa
                Url = localStorage.getItem("ls_url1").toLocaleString() + "/Services/vh/Vehiculos.svc/vh62VinUsadoGet/1,json;" +
                    localStorage.getItem("ls_idempresa").toLocaleString() + ";" + localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
                    localStorage.getItem("ls_usagencia").toLocaleString() + ";" + responseText + ";;" + localStorage.getItem("ls_usulog").toLocaleString() +
                    ";;;;;;;;";
            } else if (tipo == "C") {
                // Chasis
                //Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl06OrdenesGet/1,json;" + localStorage.getItem("ls_idempresa").toLocaleString() + ";;;;" + responseText;
                Url = localStorage.getItem("ls_url1").toLocaleString() + "/Services/vh/Vehiculos.svc/vh62VinUsadoGet/2,json;" +
                  localStorage.getItem("ls_idempresa").toLocaleString() + ";" + localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
                  localStorage.getItem("ls_usagencia").toLocaleString() + ";;" + responseText + ";" + localStorage.getItem("ls_usulog").toLocaleString() +
                  ";;;;;;;;";
            }
            //if (tipo == "P") {
            //    // Placa
            //    Url = localStorage.getItem("ls_url1").toLocaleString() + "/Services/GA/Garantias.svc/ga35OrdenesGet/1,json;" + localStorage.getItem("ls_idempresa").toLocaleString() + ";;;" + responseText + ";";
            //} else if (tipo == "C") {
            //    // Chasis
            //    Url = localStorage.getItem("ls_url1").toLocaleString() + "/Services/GA/Garantias.svc/ga35OrdenesGet/1,json;" + localStorage.getItem("ls_idempresa").toLocaleString() + ";;;;" + responseText;
            //}
            //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No existen datos del \nC\u00F3digo: " + Url);
			
			//alert(Url);
			
            $.ajax({
                url: Url,
                type: "GET",
                async: false,
                dataType: "json",
                success: function (data) {
                    try {
                        infor = (JSON.parse(data.ga35OrdenesGetResult)).tga35[0];
                        if (infor.estado !== "" || infor.estado !== "INSPECCION_VISUAL") {
                            document.getElementById("tablaAuto").disabled = true;
                        }
                    } catch (e) {
                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No existen datos para: " + responseText);
                        vaciaCampos();
                        return;
                    }
                },
                error: function (err) {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso. Int\u00E9ntelo nuevamente.");
                    vaciaCampos();
                    return;
                }
            });
            // Usuario crea => login actual
            document.getElementById("usuario_creacion").value = localStorage.getItem("ls_usulog").toLocaleString();
            // Usuario modif => login actual
            document.getElementById("usuario_modificacion").value = localStorage.getItem("ls_usulog").toLocaleString();
            noOT(yyyy, mm, dd, hora, minu, segu);
            datosCon(infor,yyyy,dd + '-' + mm + '-' + yyyy);
            
        }
        if (validaServicios > 0) {
            document.getElementById("result").style.display = 'block';
            document.getElementById("vehiculo").style.display = 'block';
            document.getElementById("tabstripSN").style.display = 'block';
        }
        verArchivosOT_2(document.getElementById('placa').value);
        //verArchivosOT("USADOPR");
    } catch (e1) {
        //alert("2222"+e1);
        vaciaCampos();
        //        resetControls("");
        //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso. Int\u00E9ntelo nuevamente.");
    }
}
function noOT(yyyy, mm, dd, hora, minu, segu) {
    document.getElementById("numOT").value = "";
    document.getElementById("btnGuardaInfo").innerHTML = "<button id='guardaUsa0' onclick='GuardarDatosCV();' class='w3-btn'>GUARDAR</button>" + "    " + 
                                                         "<button id='guardaUsa1' onclick='vaciaCampos();' class='w3-btn'>NUEVO</button>" + "    " + 
                                                         "<button id='guardaUsa2' onclick='grabarEstado();' class='w3-btn'>CAMBIAR ESTADO</button>";
                                                         llamarNuevoestilo("guardaUsa");
    document.getElementById("fecha_recepcion").value = yyyy + '-' + mm + '-' + dd + '  ' + hora + ':' + minu + ':' + segu;
}
function cambioAvaluo(avaluo) {
    if (avaluo == "AVALUO") {
        document.getElementById("num_orden").disabled = false;
    } else {
        document.getElementById("num_orden").value = "";
        document.getElementById("num_orden").disabled = true;
    }
    
}
function cambiaAM(anio) {
    var td = new Date();
    if (anio == td.getFullYear()) {
        // Cbo. Matriculado
        cboCarga_2("tmatr", arrMatr, "SI", "divcbotmatr");
    } else {
        // Cbo. Matriculado
        cboCarga_2("tmatr", arrMatr, "NO", "divcbotmatr");
    }
}
function datosCon(infor,yyyy,fecha) {
    try {
        document.getElementById("placa").value = infor.placa.toUpperCase();
        document.getElementById("chasis").value = infor.chasis;
        document.getElementById("motor").value = infor.numero_motor;
        marcaVhe(infor.codigo_marca);
        cboModeloVhe(infor.codigo_marca, infor.codigo_modelo);
        
        cboSucursales(infor.codigo_sucursal_vendedor);
        cboVendedores(infor.persona_numero_vendedor);
        document.getElementById("anio_modelo").value = infor.anio_modelo;
        cboColores(infor.color_vehiculo);
        tipoFormulario(infor.tipo_formulario);
        cboModeloAutoN("KiA", infor.codigo_modelo_nuevo);
        document.getElementById("cilindraje").value = infor.cilindraje;
        document.getElementById("kilometros").value = infor.kilometraje;
        if (infor.anio_matricula == yyyy) {
            // Cbo. Matriculado
            cboCarga_2("tmatr", arrMatr, "SI", "divcbotmatr");
        } else {
            // Cbo. Matriculado
            cboCarga_2("tmatr", arrMatr, "NO", "divcbotmatr");
        }
        cboCarga_3("tavaluo", arrTipAva, infor.tipo_avaluo, "divcboTiAva");
        var proEna = "NO";
        if (infor.prohibido_enajenar) {
            proEna = "SI";
        }
        cboCarga_2("tenajena", arrMatr, proEna, "divcboEnajena");
        document.getElementById("num_orden").value = infor.numero_orden;
        document.getElementById("tmatr").disabled = true;
        document.getElementById("anio_matricula").value = infor.anio_matricula;
        document.getElementById("anio_vh62").value = infor.anio_vh62;
        document.getElementById("secuencia").value = infor.secuencia_vh62;
        document.getElementById("estado").value = infor.estado;
        document.getElementById("pais").value = infor.pais_propietario;
        document.getElementById("ciudad_propietario").value = infor.ciudad_propietario;
        document.getElementById("tipo_dir_propietario").value = infor.direccion_propietario;
        document.getElementById("numero_id_propietario").value = infor.identifica_propietario;
        document.getElementById("persona_numero").value = infor.persona_numero;
        document.getElementById("observacionR").value = infor.observaciones;
		
		//transmision
        cbogenerico(localStorage.getItem("ls_idempresa").toLocaleString(),"VH","transmision","transmision2",infor.tipo_transmision,"dbotransmision");
        //traccion
        cbogenerico(localStorage.getItem("ls_idempresa").toLocaleString(),"VH","tipo_traccion","traccionn2",infor.codigo_traccion,"dboTraccion");
        //subclase
        cbogenerico(localStorage.getItem("ls_idempresa").toLocaleString(),"IN","subclase_auto","subclase2",infor.subclase_auto,"dboCarroceria");
        //grupo auto
        cbogenerico(localStorage.getItem("ls_idempresa").toLocaleString(),"IN","clase_auto","clase2",infor.clase_auto,"dboClase");
        //combustible
        cbogenerico(localStorage.getItem("ls_idempresa").toLocaleString(),"VH","tipo_combustible","combustible2",infor.tipo_combustible,"dboCombustible");
      //alert(infor.nombre_propietario);
        var arrNombre = infor.nombre_propietario.split(",");
        if (infor.nombre_propietario.split(",").length > 1) {
            var arrNombre = infor.nombre_propietario.split(",");
        }else{
             var arrNombre = infor.nombre_propietario.split(" ");
        }
        document.getElementById("persona_apellido").value = arrNombre[0];
        document.getElementById("persona_apellido2").value = arrNombre[1];
        if (arrNombre.length > 2) {
            document.getElementById("persona_nombre").value = arrNombre[2];
            document.getElementById("persona_nombre2").value = arrNombre[3];
        }
        else {
            document.getElementById("persona_nombre").value = "";
            document.getElementById("persona_nombre2").value = "";
        }
		
		
		
        document.getElementById("mail").value = infor.mail_propietario;
        document.getElementById("telefono_celular").value = infor.persona_celular_propietario;
        document.getElementById("cli_calle_principal_propietario").value = infor.direccion_propietario; //document.getElementById("calle_principal_propietario").value;
        document.getElementById("cli_numero_calle_propietario").value = infor.numero_calle_propietario; //document.getElementById("numero_calle_propietario").value;
        document.getElementById("cli_calle_interseccion_propieta").value = infor.calle_interseccion_propietario; //document.getElementById("calle_interseccion_propieta").value;
        document.getElementById("cli_telefono_propietario").value = infor.telefono_propietario; //document.getElementById("telefono_propietario").value;
        //Info Orden de Trabajo  
        //-------------------------*/
        $("#dpInicio").kendoDatePicker({ format: "dd-MM-yyyy" });
        $("#dpFin").kendoDatePicker({ format: "dd-MM-yyyy" });
        document.getElementById("dpFin").value = fecha;
        // Pais
        cboPaises(infor.pais_propietario);
        // Ciudad
        cboCiudades(document.getElementById("pais2").value, infor.ciudad_propietario);
        // Cbo. Tipo persona
        cboCarga_2("tpers", arrTipPers, infor.persona_tipo_propietario.toUpperCase(), "divcbotpers");
        // Cbo. Tipod de documento
        cboCarga_2("tid", arDoc, infor.tipo_id_propietario.toUpperCase(), "divcbotid");
        //// Cbo. tipo direccion
        cboCarga_2("direc", arrDir, infor.direccion_propietario.toUpperCase(), "divcbodirec");
        placaActiva = infor.placa.toUpperCase(); 
        cilindrajeActiva = infor.cilindraje
        //alert(placaActiva + " pr2 " + cilindrajeActiva);
        activaDesactiva(true, placaActiva, cilindrajeActiva);
        desabilitaTodo(false);
        if (infor.estado_vh62 !== "" && infor.estado_vh62 !== "INSPECCION_VISUAL") {
            desabilitaTodo(true);
        }
        ConsultarEM(infor.chasis)
        ConsultarOT(infor.chasis, document.getElementById("dpInicio").value, document.getElementById("dpFin").value);
        document.getElementById("videosOT").innerHTML = "<br /><a id='btnVideo0' class='w3-btn primary' aria-label='Video' onclick='captureVideo();'><i id='icnVideo0' class='fa fa-video-camera' aria-hidden='true'></i>&nbsp;Grabar Video</a>" +
                                                         "&nbsp;&nbsp;&nbsp;&nbsp;<a id='btnVideo1' class='w3-btn primary' aria-label='Foto' onclick='captureImagen();'><i id='icnVideo1' class='fa fa-camera' aria-hidden='true'></i>&nbsp;Grabar Fotos</a>";
        //verArchivosOT_2(document.getElementById('placa').value);
        llamarNuevoestilo("btnVideo");
        llamarNuevoestiloIconB("icnVideo");
    } catch (e) {
        alert("00"+e);
    }
    
}
function activaDesactiva(sino, placa, cilindraje) {
    try {
        document.getElementById("chasis").disabled = sino;
        document.getElementById("motor").disabled = sino;
        document.getElementById("anio_modelo").disabled = sino;
        document.getElementById("anio_modelo").disabled = sino;
        var marca = document.getElementById("marcas2");
        var modelo = document.getElementById("modelo2");
        var vender2 = document.getElementById("Vender2");
        var cboAgenciasVD = document.getElementById("cboAgenciasVD");
        //vender2.disabled = sino;
        modelo.disabled = sino;
        marca.disabled = sino;
        document.getElementById("desmodelo").disabled = sino;
        if (placa.length==0) {
            document.getElementById("placa").disabled = false;
        } else {
            document.getElementById("placa").disabled = true;
        }

        if (cilindraje.length==0) {
            document.getElementById("cilindraje").disabled = false;
        } else {
            document.getElementById("cilindraje").disabled = true;
        }
    } catch (e) {
        alert("01"+e);

    }
    
}

/*--------------------------------------------------------------------
Fecha: 11/09/2017
Descripcion: Informacion del cliente
Parametros: identificacion
--------------------------------------------------------------------*/
function llamarConsultaCliente(identificacion) {
    kendo.ui.progress($("#lector_barrasScreen"), true);
    setTimeout(function () {
        ConsultarClienteUSA(identificacion);
    }, 2000);
}
function ConsultarClienteUSA(identificacion) {
    try {
        var arrTipPers = ["NATURAL", "JURIDICA"];
        var arDoc = ["CEDULA", "RUC", "PASAPORTE"];
        var arrDir = ["DOMICILIO", "TRABAJO"];
        document.getElementById("persona_numero").value = "";
        document.getElementById("mail").value = "";
        document.getElementById("persona_nombre").value = "";
        document.getElementById("persona_nombre2").value = "";
        document.getElementById("persona_apellido").value = "";
        document.getElementById("persona_apellido2").value = "";
        document.getElementById("cli_calle_principal_propietario").value = "";
        document.getElementById("cli_numero_calle_propietario").value = "";
        document.getElementById("cli_calle_interseccion_propieta").value = "";
        document.getElementById("telefono_celular").value = "0";
        document.getElementById("cli_telefono_propietario").value = "0";
        document.getElementById("mail").value = "";
        //// Pais
        cboPaises("ECUADOR");
        //// Ciudad
        cboCiudades(document.getElementById("pais2").value, "QUITO");
        // Cbo. Tipo persona
        cboCarga_2("tpers", arrTipPers, arrTipPers[0], "divcbotpers");
        // Cbo. Tipod de documento
        cboCarga_2("tid", arDoc, arDoc[0], "divcbotid");
        //// Cbo. tipo direccion
        cboCarga_2("direc", arrDir, arrDir[0], "divcbodirec");
        if (identificacion != "") {
            var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/tg04PersonaGet/JSON;" + identificacion;
            //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> e</center>", Url);
            $.ajax({
                url: Url,
                type: "GET",
                async: false,
                dataType: "json",
                success: function (data) {
                    try {
                        data = (JSON.parse(data.tg04PersonaGetResult)).ttg04[0];
                        if (data.persona_nombre) {
                            var NombreCompleto = data.persona_nombre;
                            //alert("2"+NombreCompleto);
                            var arrNombre = NombreCompleto.split(',');
                            document.getElementById("persona_numero").value = data.persona_numero;
                            if (arrNombre.length > 0) {
                                if (arrNombre[2] == "") {
                                    document.getElementById("persona_nombre").value = "";
                                    document.getElementById("persona_nombre2").value = "";
                                    document.getElementById("persona_apellido").value = arrNombre[0];
                                    document.getElementById("persona_apellido2").value = "";
                                }
                                else {
                                    document.getElementById("persona_nombre").value = arrNombre[2];
                                    document.getElementById("persona_nombre2").value = arrNombre[3];
                                    document.getElementById("persona_apellido").value = arrNombre[0];
                                    document.getElementById("persona_apellido2").value = arrNombre[1];
                                }
                                document.getElementById("cli_calle_principal_propietario").value = data.calle_cliente;
                                document.getElementById("cli_numero_calle_propietario").value = data.numero_calle;
                                document.getElementById("cli_calle_interseccion_propieta").value = data.calle_interseccion;
                                document.getElementById("telefono_celular").value = (data.celular_cliente);
                                document.getElementById("cli_telefono_propietario").value = (data.telefono_cliente);
                                document.getElementById("mail").value = data.email_cliente;
                                // Pais
                                cboPaises(data.pais_cliente);
                                // Ciudad
                                cboCiudades(document.getElementById("pais2").value, data.ciudad_cliente);
                                // Cbo. Tipo persona
                                cboCarga_2("tpers", arrTipPers, data.persona_tipo.toUpperCase(), "divcbotpers");
                                // Cbo. Tipod de documento
                                cboCarga_2("tid", arDoc, data.tipo_id_representante.toUpperCase(), "divcbotid");
                                //// Cbo. tipo direccion
                                cboCarga_2("direc", arrDir, data.direccion.toUpperCase(), "divcbodirec");
                                //  alert("recurrr");
                                kendo.ui.progress($("#lector_barrasScreen"), false);
                            }
                        } else {
                            ConsultarCliente_USA(identificacion);
                            kendo.ui.progress($("#lector_barrasScreen"), false);
                            //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existen datos del documento:&nbsp;" + identificacion);
                            return;
                        }
                    } catch (e) {
                        //    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Error durante el proceso. Int\u00E9ntelo nuevamente.");
                        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existen datos del documento:&nbsp;" + identificacion);
                        ConsultarCliente_USA(identificacion);
                        kendo.ui.progress($("#lector_barrasScreen"), false);
                        return;
                    }
                },
                error: function (err) {
                    ConsultarCliente_USA(identificacion);
                    kendo.ui.progress($("#lector_barrasScreen"), false);
                    return;
                }
            });
        }
        else {
            kendo.ui.progress($("#lector_barrasScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Ingrese el N&uacute;mero de C&eacute;dula");
            return;
        }
        kendo.ui.progress($("#lector_barrasScreen"), false);
    } catch (e) {
        kendo.ui.progress($("#lector_barrasScreen"), false);
        alert("03"+e);
        return;
    }
    kendo.ui.progress($("#lector_barrasScreen"), false);
}

/*--------------------------------------------------------------------
Fecha: 13/10/2017
Descripcion: Trae la Informacion del cliente en caso de que no exista en la anterior
Parametros: identificacion
--------------------------------------------------------------------*/
function ConsultarCliente_USA(identificacion) {
    try {
        if (identificacion != "") {
            var arrTipPers = ["NATURAL", "JURIDICA"];
            var arDoc = ["CEDULA", "RUC", "PASAPORTE"];
            var arrDir = ["DOMICILIO", "TRABAJO"];
            var Url = localStorage.getItem("ls_url1").toLocaleString() + "/Services/TG/Parametros.svc/tg91PersonaGet/JSON;" + identificacion;
            //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> e</center>", Url);
            $.ajax({
                url: Url,
                type: "GET",
                async: false,
                dataType: "json",
                success: function (data) {
                    try {
                        //  alert(inspeccionar(data));
                        data = (JSON.parse(data.tg91PersonaGetResult)).ttg91[0];
                        if (data.persona_nombre) {
                            var NombreCompleto = data.persona_nombre;
                            //alert("1"+NombreCompleto);
                            var arrNombre = NombreCompleto.split(',');
                            document.getElementById("persona_numero").value = 0; //data.persona_numero;
                            if (arrNombre.length > 0) {
                                if (arrNombre[2] == "") {
                                    document.getElementById("persona_nombre").value = "";
                                    document.getElementById("persona_nombre2").value = "";
                                    document.getElementById("persona_apellido").value = arrNombre[0];
                                    document.getElementById("persona_apellido2").value = "";
                                }
                                else {
                                    document.getElementById("persona_nombre").value = arrNombre[2];
                                    document.getElementById("persona_nombre2").value = arrNombre[3];
                                    document.getElementById("persona_apellido").value = arrNombre[0];
                                    document.getElementById("persona_apellido2").value = arrNombre[1];
                                }
                                document.getElementById("cli_calle_principal_propietario").value = data.calle_cliente;
                                document.getElementById("cli_numero_calle_propietario").value = data.numero_calle;
                                document.getElementById("cli_calle_interseccion_propieta").value = data.calle_interseccion;
                                document.getElementById("telefono_celular").value = (data.celular_cliente);
                                document.getElementById("cli_telefono_propietario").value = (data.telefono_cliente);
                                document.getElementById("mail").value = data.email_cliente;
                                // Pais
                                cboPaises(data.pais_cliente);
                                // Ciudad
                                cboCiudades(document.getElementById("pais2").value, data.ciudad_cliente);
                                // Cbo. Tipo persona
                                cboCarga_2("tpers", arrTipPers, data.persona_tipo, "divcbotpers");
                                // Cbo. Tipod de documento
                                cboCarga_2("tid", arDoc, data.tipo_id_representante, "divcbotid");
                                // Cbo. tipo direccion
                                cboCarga_2("direc", arrDir, data.direccion_cliente, "divcbodirec");
                                //  alert("recurr");
                            }

                        } else {
                            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existen datos del documento:&nbsp;" + identificacion);
                            return;
                        }
                    } catch (e) {
                         //alert(e);
                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existen datos del documento:&nbsp;" + identificacion);
                        return;
                    }
                },
                error: function (err) {
                    //  alert(err);
                    return;
                }
            });
        }
        else {

            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Ingrese el N&uacute;mero de C&eacute;dula");
            return;
        }
    } catch (e) {
        return;
    }
}


/*--------------------------------------------------------------------
Fecha: 20/09/2017
Descripcion: Estado de Mantenimiento
Parametros: VIN, Fecha inicio, Fecha fin
--------------------------------------------------------------------*/
function ConsultarEManter(emvin) {
    try {
        var erroresEM = "0";
        document.getElementById("tablaPrmEM").style.display = "none";
        document.getElementById("divtableEM").style.display = "none";
        document.getElementById("fecEM").value = "";
        document.getElementById("kmEM").value = "";
        var UrlEM = localStorage.getItem("ls_url1").toLocaleString() + "/Services/SL/Sherloc/Sherloc.svc/Mantenimiento/" + "2," + emvin;
        var inforEM;
        $.ajax({
            url: UrlEM,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    inforEM = (JSON.parse(data.MantenimientoGetResult)).KilometrajeOT;
                } catch (e) {
                    // loading
                    document.getElementById("divLoading").innerHTML = "";
                    // Borrar imagen de placa
                    document.getElementById("smallImage").style.display = "none";
                    //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No existen datos del Estado de Mantenimiento");
                    for (var i = 0; i < 30; i++) {
                        document.getElementById("cl" + inforEM[i].codigo).style.background = "red";
                        document.getElementById("cx" + inforEM[i].codigo + "x").style.display = "";
                        bandera = "rojo";
                    }
                    document.getElementById("fecEM").value = "";
                    document.getElementById("kmEM").value = "";
                    // Si hay error
                    erroresEM = "1";
                    return;
                }
            },
            error: function (err) {
                // loading
                document.getElementById("divLoading").innerHTML = "";
                // Borrar imagen de placa
                document.getElementById("smallImage").style.display = "none";
                //     window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error de conexi&oacute;n al servicio Estado de Mantenimiento. Int\u00E9ntelo nuevamente.");
                return;
            }
        });
        
        if (erroresEM == "0") {
            try {
                for (var i = 0; i < 15; i++) {
                    document.getElementById("cl" + inforEM[i].codigo).style.background = "transparent";
                    document.getElementById("cx" + inforEM[i].codigo + "v").style.display = "none";
                    document.getElementById("cx" + inforEM[i].codigo + "x").style.display = "none";
                    
                }
                
            } catch (error) {
               alert("05"+error); 
            }
            var bandera = "verde";
            if (inforEM.length > 0) {
                for (var i = 0; i < inforEM.length; i++) {
                    if (i < 30) {
                        if (inforEM[i].validacion == true) {
                            document.getElementById("cl" + inforEM[i].codigo).style.background = "green";
                            document.getElementById("cx" + inforEM[i].codigo + "v").style.display = "";
                        }
                        else {
                            document.getElementById("cl" + inforEM[i].codigo).style.background = "red";
                            document.getElementById("cx" + inforEM[i].codigo + "x").style.display = "";
                            bandera = "rojo";
                        }
                    }
                    if (inforEM[i].ultimo == true) {
                        document.getElementById("fecEM").value = inforEM[i].fecha_kilometraje;
                        document.getElementById("kmEM").value = inforEM[i].kilometraje;
                        break;
                    }
                }
                document.getElementById("tablaPrmEM").style.display = "block";
                document.getElementById("divtableEM").style.display = "block";
            }
        }
    } catch (e) {
        // loading
        document.getElementById("divLoading").innerHTML = "";
        // Borrar imagen de placa
        document.getElementById("smallImage").style.display = "none";
        //     window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error de conexi&oacute;n al servicio Estado de Mantenimiento. Int\u00E9ntelo nuevamente.");
        return;
    }
}
function ConsultarEM(emvin) {

    try {
        kendo.ui.progress($("#lector_barrasScreen"), true);
        setTimeout(function () {
            // precarga *********************************************************************************************
            var anchoInput = "";
        document.getElementById("divtableEM").innerHTML = "";
        if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 360) {
            anchoInput = "7";
        }     

            //var marca = document.getElementById("codigo_marca").value;

            /* if (marca.trim() == "") {
                kendo.ui.progress($("#lector_barrasScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "La marca " + marca + " no esta registrada");
                return;
            } */

            var erroresEM = 0;
            document.getElementById("tablaPrmEM").style.display = "none";
            document.getElementById("divtableEM").style.display = "none";
            document.getElementById("fecEM").value = "";
            document.getElementById("kmEM").value = "";
            var UrlEM = localStorage.getItem("ls_url1").toLocaleString() + "/Services/SL/Sherloc/Sherloc.svc/Mantenimiento/" + "2," + emvin;

               //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>ConsultarEM 1</center>", UrlEM);


            // Si marca es <> "KIA")
            //if (marca.trim() != localStorage.getItem("ls_idmarca").toLocaleString().trim()) {
                // nuevo servicio
                // http://186.71.21.170:8077/taller/Services/SL/Sherloc/Sherloc.svc/Mantenimiento/1,8LCFT4111GE006737,TRUE,
                //UrlEM = localStorage.getItem("ls_url2").toLocaleString() + "/Services/SL/Sherloc/Sherloc.svc/Mantenimiento/" + localStorage.getItem("ls_idempresa").toLocaleString() + "," + emvin + ",TRUE,";

                //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>ConsultarEM 2</center>", UrlEM);
           // }
            //else {
                try {
                    
                if (localStorage.getItem("ls_emant_rec") != undefined && localStorage.getItem("ls_emant_rec").toLocaleString() == "0") {
                    UrlEM = localStorage.getItem("ls_url2").toLocaleString() + "/Services/SL/Sherloc/Sherloc.svc/Mantenimiento/" + localStorage.getItem("ls_idempresa").toLocaleString() + "," + emvin + ",TRUE,";
                    //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>ConsultarEM 3</center>", UrlEM);
                }
                } catch (error) {
                   alert("06"+error) 

                }
                //UrlEM = localStorage.getItem("ls_url2").toLocaleString() + "/Services/SL/Sherloc/Sherloc.svc/Mantenimiento/" + localStorage.getItem("ls_idempresa").toLocaleString() + "," + emvin + ",TRUE,";
            //}
            //http://200.31.10.92:8092/appk_aekia/Services/SL/Sherloc/Sherloc.svc/Mantenimiento/2,KNAB2512BKT310330
             // window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", UrlEM);
            var inforEM;
            $.ajax({
                url: UrlEM,
                type: "GET",
                async: false,
                dataType: "json",
                success: function (data) {
                    try {
                        inforEM = (JSON.parse(data.MantenimientoGetResult)).KilometrajeOT;
                        // alert(inspeccionar(data));
                    } catch (e) {
                        kendo.ui.progress($("#lector_barrasScreen"), false);
                        // loading
                        document.getElementById("divLoading").innerHTML = "";
                        // Borrar imagen de placa
                        document.getElementById("smallImage").style.display = "none";

                        //for (var i = 0; i < 30; i++) {

                        //    document.getElementById("cl" + inforEM[i].codigo).style.background = "red";
                        //    document.getElementById("cx" + inforEM[i].codigo + "x").style.display = "";
                        //    bandera = "rojo";
                        //}

                        document.getElementById("fecEM").value = "";
                        document.getElementById("kmEM").value = "";

                        // Si hay error
                        erroresEM = 1;


                        return;
                    }
                },
                error: function (err) {
                    kendo.ui.progress($("#lector_barrasScreen"), false);
                    // loading
                    document.getElementById("divLoading").innerHTML = "";
                    // Borrar imagen de placa
                    document.getElementById("smallImage").style.display = "none";
                    //     window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error de conexi&oacute;n al servicio Estado de Mantenimiento. Int\u00E9ntelo nuevamente.");
                    return;
                }
            });
// Si no existen datos funion recurrente
            if (erroresEM > 0) {
                localStorage.setItem("ls_emant_rec", "0");
                //ConsultarEM(emvin);
                return;
            }

            if (erroresEM == 0) {
                var bandera = "verde";
                if (inforEM.length > 0) {

                    //------------------
                    document.getElementById("divtableEM").innerHTML = "";

                    var tableContenedor = "<table id='tableEM' align='center' style='width: 100%;'><tr>";
                    tableContenedor += "<td>";

                    var tableEM = "<table>";
                    var emKM = inforEM[0].codigo/1000;
                    try {
                        for (var i = 0; i < 35; i++) {
                            tableEM += "<tr><td class='clase'><input type='text' value='" + emKM + ",000' size='" + anchoInput + "' disabled></td>" +
                             "<td>&nbsp;</td>" +
                            "<td><input id='cl" + emKM + "000' type='text' style='width: 20px;' disabled></td>" +
                            "<td>&nbsp;</td>" +
                            "<td><i id='cx" + emKM + "000v' class='fa fa-check' aria-hidden='true' style='color:green; display:none;width: 30%;'></i>" +
                            "<i id='cx" + emKM + "000x' class='fa fa-times' aria-hidden='true' style='color:red; display:none;width: 30%;'></i></td></tr>";
                            emKM = emKM + inforEM[0].codigo/1000;
                        }
                    } catch (error) {
                        alert("06"+error)
                    }
                    
                    tableEM += " </table>"
                    tableContenedor += tableEM;
                    tableContenedor += "</td>";
                    tableContenedor += "<td>&nbsp;&nbsp;</td>";
                    tableContenedor += "<td>";
                    tableEM = "<table>";
                    emKM = 180;
                    for (var i = 0; i < 35; i++) {
                        tableEM += "<tr><td class='clase'><input type='text' value='" + emKM + ",000' size='" + anchoInput + "' disabled></td>" +
                     "<td>&nbsp;</td>" +
                    "<td><input id='cl" + emKM + "000' type='text' style='width: 20px;' disabled></td>" +
                    "<td>&nbsp;</td>" +
                    "<td><i id='cx" + emKM + "000v' class='fa fa-check' aria-hidden='true' style='color:green; display:none;width: 30%;'></i>" +
                    "<i id='cx" + emKM + "000x' class='fa fa-times' aria-hidden='true' style='color:red; display:none;width: 30%;'></i></td></tr>";

                        emKM = emKM + 5;
                    }
                    tableEM += " </table>"

                    tableContenedor += tableEM;
                    tableContenedor += "</td>";
                    tableContenedor += "</tr></table>";

                    document.getElementById("divtableEM").innerHTML = tableContenedor;

                    //-------------------
                    var bolVerif = false;
                    for (var i = 0; i < inforEM.length; i++) {
                        if (i < 70) {
                            if (inforEM[i].validacion == true) {
                                document.getElementById("cl" + inforEM[i].codigo).style.background = "green";
                                document.getElementById("cx" + inforEM[i].codigo + "v").style.display = "";
                                bolVerif = true;
                            }
                            else {
                                document.getElementById("cl" + inforEM[i].codigo).style.background = "red";
                                document.getElementById("cx" + inforEM[i].codigo + "x").style.display = "";
                                bandera = "rojo";
                            }
                        }
                        if (inforEM[i].ultimo == true) {

                            var feckm = inforEM[i].fecha_kilometraje;

                            if (feckm.includes("-") == true) {
                                var arrfeckM = feckm.split("-");
                                if (arrfeckM[0] < 10) {
                                    arrfeckM[0] = "0" + arrfeckM[0];
                                }

                                if (arrfeckM[1] < 10) {
                                    arrfeckM[1] = "0" + arrfeckM[1];
                                }

                                feckm = arrfeckM[0] + "-" + arrfeckM[1] + "-" + arrfeckM[2];
                            }

                            document.getElementById("fecEM").value = feckm;
                            document.getElementById("kmEM").value = inforEM[i].kilometraje;
                            break;
                        }
                    }
                    //// elimina recurrente historial EM
                    //if (localStorage.getItem("ls_emant_rec") != undefined) {
                    //    localStorage.removeItem("ls_emant_rec");
                    //}

                    if (bolVerif == false) {
                        document.getElementById("divtableEM").innerHTML = "<br/><b>No existen registros</b>";
                        document.getElementById("tablaPrmEM").style.display = "none";

                    }
                    else {
                        document.getElementById("divtableEM").style.display = "block";
                        document.getElementById("tablaPrmEM").style.display = "block";
                    }

                    //document.getElementById("tablaPrmEM").style.display = "block";

                }
            }

            kendo.ui.progress($("#lector_barrasScreen"), false);
            // precarga *********************************************************************************************
        }, 2000);

    } catch (e) {
        alert("07"+e);
        kendo.ui.progress($("#lector_barrasScreen"), false);
        // loading
        document.getElementById("divLoading").innerHTML = "";
        // Borrar imagen de placa
        document.getElementById("smallImage").style.display = "none";
        //     window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error de conexi&oacute;n al servicio Estado de Mantenimiento. Int\u00E9ntelo nuevamente.");
        return;
    }
}

/*--------------------------------------------------------------------
Fecha: 18/08/2017
Descripcion: Orden de Trabajo
Parametros: VIN, Fecha inicio, Fecha fin
--------------------------------------------------------------------*/
function ConsultarOT(strVIN, datFecIni, datFecFin) {
    try {
        document.getElementById("tablaOT").style.display = "none";
        document.getElementById("datosOT").style.display = "none";
        var respOT = "0";
        var UrlOrdenTrab = localStorage.getItem("ls_url1").toLocaleString() + "/Services/SL/Sherloc/Sherloc.svc/Ordenes/1,2," + strVIN + "," + datFecIni + "," + datFecFin;
        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", UrlOrdenTrab);
        var infOrden;
        $.ajax({
            url: UrlOrdenTrab,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    infOrden = (JSON.parse(data.OrdenesGetResult)).CabeceraOT01;

                    respOT = "1";
                } catch (e) {
                    // loading
                    document.getElementById("divLoading").innerHTML = "";
                    // Borrar imagen de placa
                    document.getElementById("smallImage").style.display = "none";
                    //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No existen datos de Orden de Trabajo");
                    return;
                }
            },
            error: function (err) {
                // loading
                document.getElementById("divLoading").innerHTML = "";
                // Borrar imagen de placa
                document.getElementById("smallImage").style.display = "none";
                //      window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error de conexi&oacute;n al servicio Orden de Trabajo. Int\u00E9ntelo nuevamente.");
                return;
            }
        });
        if (respOT == "1") {
            var obs = (screen.width * 9) / 100;
            var fecha = (screen.width * 14) / 100;
            var ot = (screen.width * 17) / 100;
            var taller = (screen.width * 12) / 100;
            var registro;
            var banderaOT;
            registro = "";
            $("#datosOT").kendoGrid({
                dataSource: {
                    data: infOrden,
                    pageSize: 1000
                },
                scrollable: false,
                pageable: {
                    input: true,
                    numeric: false
                },
                columns: [
                    {
                        width: "30px",
                        command: [{
                            name: "ver",
                            text: " ",
                            imageClass: "fa fa-calculator",
                            click: function (e) {
                                try {
                                    var grid = $("#datosOT").data("kendoGrid");
                                    var dataItem = grid.dataItem($(e.currentTarget).closest("tr"));
                                    e.preventDefault();
                                    var UrlDetalleOTEnvia = localStorage.getItem("ls_url1").toLocaleString() + "/Services/SL/Sherloc/Sherloc.svc/Detalle/" + dataItem.codigo_empresa + "," + dataItem.anio_ga35 + "," + dataItem.secuencia_orden;
                                    localStorage.setItem("ls_urldetot", UrlDetalleOTEnvia);
                                    localStorage.setItem("ls_nomtall", dataItem.nombre_taller);
                                    localStorage.setItem("ls_otobs", dataItem.observacion);
                                    kendo.mobile.application.navigate("components/detalle_ot/view.html");
                                } catch (f) {
                                    //mensajePrm("timeAlert", 0, "<img id='autoInpse2'  width='60' height='26' src='resources/Kia-logo.png'>",
                                    //   "OBSERVACION", "<span align='justify'>" + f + "</b></span>", true, true);
                                }
                            }
                        }],
                    },
                    { field: "fecha_recepcion", title: "Fecha", width: fecha },
                    { field: "numero_ot", title: "No.OT", width: fecha },
                    { field: "nombre_taller", title: "Taller", width: ot },
                    { field: "kilometraje", title: "Km.", width: fecha },
                    //   { field: "observacion", title: "Obs." }
                    {
                        title: "Obs", width: obs,
                        command: [{
                            name: "obs",
                            text: " ",
                            imageClass: "fa fa-info-circle",
                            visible: function (dataItem) { return dataItem.observacion != "0," },
                            click: function (e) {
                                try {
                                    e.preventDefault();
                                    banderaOT = 1;
                                    var tr = $(e.target).closest('tr');
                                    var dataItem = this.dataItem(tr);
                                    var arrObservacion = dataItem.observacion.split(",");
                                    window.myalert("<center><i class=\"fa fa-ambulance\"></i> <font style='font-size: 14px'>OBSERVACIONES</font></center>", arrObservacion[1]);
                                } catch (f) {
                                    //mensajePrm("timeAlert", 0, "<img id='autoInpse2'  width='60' height='26' src='resources/Kia-logo.png'>",
                                    //   "OBSERVACION", "<span align='justify'>" + f + "</b></span>", true, true);
                                }
                            }
                        }],
                    },
                ]
            });
            document.getElementById("tablaOT").style.display = "block";
            document.getElementById("datosOT").style.display = "block";
        }
    } catch (e) {
        return;
        //mens("Error de conexi?n a la base", "mens"); return;
    }
}

function showDetails(e) {
    var grid = $("#datosOT").data("kendoGrid");
    var dataItem = grid.dataItem($(e.currentTarget).closest("tr"));
    e.preventDefault();
    var UrlDetalleOTEnvia = localStorage.getItem("ls_url1").toLocaleString() + "/Services/SL/Sherloc/Sherloc.svc/Detalle/" + dataItem.codigo_empresa + "," + dataItem.anio_ga35 + "," + dataItem.secuencia_orden;
    localStorage.setItem("ls_urldetot", UrlDetalleOTEnvia);
    kendo.mobile.application.navigate("components/detalle_ot/view.html");
}

/*--------------------------------------------------------------------
Fecha: 18/08/2017
Detalle: Captura la imagen y la sube a un repositorio
Autor: RRP
--------------------------------------------------------------------*/
function getImage() {
    vaciaCampos();
    //  resetControls("");
    document.getElementById("result").innerHTML = "";
    navigator.camera.getPicture(uploadPhoto, function (message) {
        // loading
        document.getElementById("divLoading").innerHTML = "";
        // Borrar imagen de placa
        document.getElementById("smallImage").style.display = "none";
        //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No ha seleccionado una imagen. Int\u00E9ntelo nuevamente.");
    }, {
            quality: 50,
            destinationType: navigator.camera.DestinationType.FILE_URI,
            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
        });
}

/*--------------------------------------------------------------------
Fecha: 29/08/2017
Detalle: Guarda el archivo seleccionado (imagen en este caso) en un repositorio (ASMX)
Autor: RRP
--------------------------------------------------------------------*/
function uploadPhoto(imageURI) {
    //  document.getElementById("vehiculo").style.visibility = 'visible';
    // Presenta la imagen seleccionada
    var smallImage = document.getElementById('smallImage');
    smallImage.style.display = 'block';
    smallImage.style.visibility = 'visible';
    smallImage.src = imageURI;
    // Loading
    document.getElementById("divLoading").innerHTML = "<i class='fa fa-cog fa-spin fa-3x fa-fw'></i>";
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1).replace('.jpg', '');
    // variable global
    resp = imageURI.substr(imageURI.lastIndexOf('/') + 1).replace('.jpg', '');
    options.mimeType = "image/jpeg";
    var params = new Object();
    params.value1 = "test";
    params.value2 = "param";
    options.params = params;
    options.chunkedMode = false;
    var ft = new FileTransfer();
    // alert(imageURI);
    ft.upload(imageURI, "http://ecuainfo78-002-site3.btempurl.com/FileUpload.asmx/SaveImage", win, fail, options);
}

function win(r) {
    MIshowHint(resp);
}

function fail(error) {
    // loading
    document.getElementById("divLoading").innerHTML = "";
    // Borrar imagen de placa
    document.getElementById("smallImage").style.display = "none";
    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "La imagen no se ha guardado correctamente. Int\u00E9ntelo nuevamente.");
}

/*--------------------------------------------------------------------
Fecha: 15/08/2017
Detalle: Extrae el texto de la placa de una imagen seleccionada
Autor: RRP
--------------------------------------------------------------------*/
function MIshowHint(str) {
    str = str.replace("%", "_");
    str = str + ".jpg";
    var data = new FormData();
    if (str.length > 0) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("result").innerHTML = this.responseText;
                var answ = document.getElementById("txtResPlaca").value;
                document.getElementById("result").innerHTML = "";
                if (answ == "ERROR") {
                    // loading
                    document.getElementById("divLoading").innerHTML = "";
                    // Borrar imagen de placa
                    document.getElementById("smallImage").style.display = "none";
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso. Int\u00E9ntelo nuevamente.");
                } else {
                    TraerInformacion(answ, "P");
                }
            }
        };
        xmlhttp.open("GET", "http://ecuainfo78-002-site6.btempurl.com/index.aspx?q=" + str, true);
        xmlhttp.send();
    } else {
        document.getElementById("divLoading").innerHTML = "";
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "La imagen no se ha procesado correctamente. Int\u00E9ntelo nuevamente.");
    }
}

function resetControls(visControl) {
    var myStringArray = ["result", "vehiculo", "tabstripSN"];
    var arrayLength = myStringArray.length;
    for (var i = 0; i < arrayLength; i++) {
        document.getElementById(myStringArray[i]).style.display = 'none';
    }
    if (visControl != "") {
        document.getElementById(imgAuto).style.visibility = 'visible';
    }
    document.getElementById("smallImage").style.display = "none";
    nuevoForm();
}

function vaciaCampos() {
    try {
        document.getElementById("tabstripSN").style.display = "none";
         var radios = document.getElementsByName("rdbMarca");
        radios[0].checked = true;
        var radiosT = document.getElementsByName("rdbDatos");
        radiosT[0].checked = true;
        nuevoForm();
        document.getElementById("infoPlacasVINRCP").value = "";
        document.getElementById("infoPlacasVINRCP").style.display = "block";
    } catch (e) {
        alert("vaci"+e);
    }
}

function nuevoForm() {
    // OT
    document.getElementById("numOT").value = "";
    document.getElementById("vehiculo").style.display = 'block';
    // datos vehiculo
    document.getElementById("placa").value = "";
    document.getElementById("chasis").value = "";
    document.getElementById("motor").value = "";
    document.getElementById("anio_modelo").value = "";
    document.getElementById("cilindraje").value = "";
    document.getElementById("anio_vh62").value = "";
    document.getElementById("secuencia").value = "";
    document.getElementById("estado").value = ""; 
    document.getElementById("pais").value = "";
    document.getElementById("ciudad_propietario").value = "";
    document.getElementById("cli_calle_principal_propietario").value = "";
    document.getElementById("cli_numero_calle_propietario").value = "";
    document.getElementById("cli_calle_interseccion_propieta").value = "";
    //document.getElementById("telefono_propietario").value = "";
    //document.getElementById("tipo_dir_propietario").value = "";
    document.getElementById("kilometros").value = "";
    document.getElementById("anio_matricula").value = "";
    document.getElementById("cilindraje").value = "";

    // datos usuario
    document.getElementById("numero_id_propietario").value = "";
    document.getElementById("persona_numero").value = "";
    document.getElementById("persona_nombre").value = "";
    document.getElementById("persona_nombre2").value = "";
    document.getElementById("persona_nombre").value = "";
    document.getElementById("persona_nombre2").value = "";
    document.getElementById("persona_apellido").value = "";
    document.getElementById("persona_apellido2").value = "";
    document.getElementById("mail").value = "";
    document.getElementById("telefono_celular").value = "0";

    document.getElementById("cli_calle_principal_propietario").value = "";
    document.getElementById("cli_numero_calle_propietario").value = "";
    document.getElementById("cli_calle_interseccion_propieta").value = "";
    document.getElementById("cli_telefono_propietario").value = 0;
    try {
        document.getElementById("clase2").value = "";
        document.getElementById("subclase2").value = "";
        document.getElementById("combustible2").value = "";
        document.getElementById("traccionn2").value = "";
        document.getElementById("transmision2").value = "";
    } catch (error) {
        
    }
}

function GuardarDatosCV() {
    try {
        var numord = "";
        if (document.getElementById("tavaluo").value == "AVALUO") {
            numord = document.getElementById("num_orden").value
        } else {
            numord = "0";
        }
        var chasis = document.getElementById("chasis").value;
        var motor = document.getElementById("motor").value;
        chasis = chasis.toUpperCase();
        motor = motor.toUpperCase();
        var sucur = document.getElementById("cboAgenciasVD").value;
       
        var param = {
            codigo_empresa: empRespa.empresa_erp,
            codigo_sucursal: localStorage.getItem("ls_ussucursal").toLocaleString(),
            codigo_agencia: localStorage.getItem("ls_usagencia").toLocaleString(),
            anio_vh62: document.getElementById("anio_vh62").value,
            secuencia_vh62: document.getElementById("secuencia").value,
            fecha_registro: document.getElementById("fecha_recepcion").value.substr(0, 10),
            codigo_marca: document.getElementById("marcas2").value,
            codigo_modelo: document.getElementById("modelo2").value,
            descripcion_modelo: document.getElementById("desmodelo").value,
            anio_modelo: document.getElementById("anio_modelo").value,
            chasis: chasis,
            numero_motor: motor,
            color_vehiculo: document.getElementById("Color2").value,
            kilometraje: document.getElementById("kilometros").value,
            anio_matricula: document.getElementById("anio_matricula").value,
            placa: document.getElementById("placa").value.toUpperCase(),
            cilindraje: document.getElementById("cilindraje").value,
            ubicacion_fisica: document.getElementById("Ubica2").value,
            tipo_formulario: document.getElementById("formulario2").value,
            codigo_modelo_nuevo: document.getElementById("modelo3").value,
            codigo_sucursal_vendedor: sucur.split(",")[0].toString(),
            codigo_agencia_vendedor: sucur.split(",")[1].toString(),
            persona_numero: document.getElementById("persona_numero").value,
            persona_tipo_propietario: document.getElementById("tpers").value,
            tipo_id_propietario: document.getElementById("tid").value,
            identifica_propietario: document.getElementById("numero_id_propietario").value,
            
			//nombre_propietario: document.getElementById("persona_nombre").value + " " + document.getElementById("persona_nombre2").value + " " +
            //document.getElementById("persona_apellido").value + " " + document.getElementById("persona_apellido2").value,
			
			//RRP: 2018-08-24
			nombre_propietario: document.getElementById("persona_apellido").value + "," + document.getElementById("persona_apellido2").value + "," +
            document.getElementById("persona_nombre").value + "," + document.getElementById("persona_nombre2").value,
		
		
            giro_comercial: "",
            direccion_propietario: document.getElementById("cli_calle_principal_propietario").value, // document.getElementById("direc").value,
            calle_interseccion_propietario: document.getElementById("cli_calle_principal_propietario").value,
            numero_calle_propietario: document.getElementById("cli_numero_calle_propietario").value,
            calle_interseccion_propietario: document.getElementById("cli_calle_interseccion_propieta").value,
            tipo_dir_propietario: document.getElementById("direc").value,
            pais_propietario: document.getElementById("pais2").value,
            ciudad_propietario: document.getElementById("ciudad2").value,
            tipo_avaluo: document.getElementById("tavaluo").value,
            numero_orden: numord,//document.getElementById("num_orden").value,
            canton_propietario: "",
            parroquia_propietario: "",
            telefono_cliente:document.getElementById("cli_telefono_propietario").toString(),
            telefono_propietario: document.getElementById("cli_telefono_propietario").value, //document.getElementById("telefono_propietario").value,
            persona_celular_propietario: document.getElementById("telefono_celular").value,
            observaciones: document.getElementById("observacionR").value,
            observacion_tecnica: " ",
            observacion_certificacion: " ",
            monto_avaluo: "0",
            persona_numero_vendedor: document.getElementById("Vender2").value,
            mail_propietario: document.getElementById("mail").value,
            estado: document.getElementById("estado").value,
            prohibido_enajenar: document.getElementById("tenajena").value,
            matriculado: document.getElementById("tmatr").value,
            fecha_anulacion: "",
            usuario_anulacion: "",
            hora_anulacion: "",
            fecha_creacion: "",
            hora_creacion: "",
            usuario_creacion: localStorage.getItem("ls_usulog").toLocaleString(),
            prog_creacion: "",
            fecha_modificacion: "",
            hora_modificacion: "",
            usuario_modificacion: localStorage.getItem("ls_usulog").toLocaleString(),
            prog_modificacion: "",
            clase_auto:document.getElementById("clase2").value,
            subclase_auto:  document.getElementById("subclase2").value,
            tipo_combustible: document.getElementById("combustible2").value,
            codigo_traccion: document.getElementById("traccionn2").value,
            tipo_transmision: document.getElementById("transmision2").value,
            tipo_registro: $('input:radio[name=rdbDatos]:checked').val()
        };
      // window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(param));
        
        
    } catch (e) {
        alert("09"+e);
        }
    try {
		
		
       var Url = empRespa.URL_concesionario + "/Services/vh/Vehiculos.svc/vh62VinUsadoSet";
		
		//var Url = "http://localhost:4044/Services/vh/Vehiculos.svc/vh62VinUsadoSet";
		
        var indicador = 0;
        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", Url);
        $.each(param, function (k, v) {
            ////display the key and value pair  
            if (k != "persona_numero" && k != "secuencia_vh62" && k != "anio_vh62" && k != "giro_comercial" &&
                k != "canton_propietario" && k != "parroquia_propietario" && k != "observaciones" && k != "estado" && k != "fecha_anulacion"
                 && k != "usuario_anulacion" && k != "hora_anulacion" && k != "fecha_creacion" && k != "hora_creacion" &&
                k != "usuario_creacion" && k != "prog_creacion" && k != "fecha_modificacion" && k != "hora_modificacion" && k != "usuario_modificacion" && k != "prog_modificacion" ) {
                if (v == "") {
                    alert("Verificar: "+k+" esta en blanco");
                    indicador = 1;
            }
          }
        });
        if (indicador == 1) {
            //alert("Verificar datos en blanco", "mens"); 
            return;
        } else {
            if (param.codigo_sucursal_vendedor == "0"){
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No ha seleccionado sucursal vendedor");
                return;
            }
            if (param.kilometraje < 1) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Kilometraje debe ser mayor a cero");
                return;
            }
            if (param.cli_telefono_propietario < 1) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Telefono debe ser mayor a cero");
                return;
            }
            if (param.persona_celular_propietario < 1) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Celular debe ser mayor a cero");
                return;
            }
            if (param.anio_matricula < 1) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Matricula debe ser mayor a cero");
                return;
            }
            if (param.clase_auto == "Seleccione") {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Matricula debe ser mayor a cero");
                return;
            }
            if (param.subclase_auto == "Seleccione") {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Matricula debe ser mayor a cero");
                return;
            }
            if (param.tipo_combustible == "Seleccione") {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Matricula debe ser mayor a cero");
                return;
            }
            if (param.codigo_traccion == "Seleccione") {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Matricula debe ser mayor a cero");
                return;
            }
            if (param.tipo_transmision == "Seleccione") {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Matricula debe ser mayor a cero");
                return;
            }
        }
        
        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(param));
        $.ajax({
            url: Url,
            type: "POST",
            data: JSON.stringify(param),
            async: false,
            dataType: "json",
            //Content-Type: application/json
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            success: function (datas) {
                if (datas.substr(0,1) == "1") {
                    alert("se actualizaron los datos");
                    TraerInformacion(param.placa, "P");
                    var tabstripUsa = $("#tabstripSN").kendoTabStrip().data("kendoTabStrip");
                        tabstripUsa.select(0);
                    //vaciaCampos();
                    //return;
                } else { alert(datas);/* alert(datas.substr(2, datas.length - 2)); */ return;}
            },
            error: function (err) { window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(err)); alert("Error en servicio clientes"); return; } //alert(err);
        });
    } catch (e) { alert("grabar:  "+e.message); }
}

function cboTrabajos_ok(itmSeccion, selTrabajo) {
    var cboTrabajoHTML = "<p><select id='trabajo2' onchange='cboMantenimientos2(this.value)' class='w3-input w3-border textos'>";
    cboTrabajoHTML += "<option  value=' '>Ninguno</option>";
    cboTrabajoHTML += "</select>";
    if (itmSeccion != "") {
        var UrlCboTrabajos = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ComboParametroEmpGet/13,1;TL;TIPOS_TRABAJO;;;;;" + itmSeccion + ";";
        var cboTrbResp = "";
        $.ajax({
            url: UrlCboTrabajos,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (data) {
                try {
                    cboTrbResp = JSON.parse(data.ComboParametroEmpGetResult);
                } catch (e) {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Tipo Trabajo");
                    return;
                }
            },
            error: function (err) {
                //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Tipo Trabajo");
                return;
            }
        });
        var matchTrabajo = "0";
        if (cboTrbResp.length > 0) {
            cboTrabajoHTML = "<p><div class='select-style2'><select id='trabajo2' onchange='cboMantenimientos2(this.value, 0)' class='w3-input w3-border textos'>";
            for (var i = 0; i < cboTrbResp.length; i++) {
                if (itmSeccion == "MECANICA") {
                    selTrabajo = "MP";
                }
                if (cboTrbResp[i].CodigoClase != " " || cboTrbResp[i].CodigoClase != "ninguna") {
                    if (selTrabajo == cboTrbResp[i].CodigoClase) {
                        cboTrabajoHTML += "<option  value='" + cboTrbResp[i].CodigoClase + "' selected>" + cboTrbResp[i].NombreClase + "</option>";
                        matchTrabajo = "1";
                    }
                    else {
                        cboTrabajoHTML += "<option  value='" + cboTrbResp[i].CodigoClase + "'>" + cboTrbResp[i].NombreClase + "</option>";
                    }
                }
            }
            if (matchTrabajo == "0") {
                cboTrabajoHTML = "<p><div class='select-style2'><select id='trabajo2' onchange='cboMantenimientos2(this.value, 0)' class='w3-input w3-border textos'>";
                for (var i = 0; i < cboTrbResp.length; i++) {
                    if (itmSeccion == "MECANICA") {
                        selTrabajo = "MANTENIMIENTO";
                    }
                    if (cboTrbResp[i].CodigoClase != " " || cboTrbResp[i].CodigoClase != "ninguna") {
                        if (selTrabajo == cboTrbResp[i].CodigoClase) {
                            cboTrabajoHTML += "<option  value='" + cboTrbResp[i].CodigoClase + "' selected>" + cboTrbResp[i].NombreClase + "</option>";
                        }
                        else {
                            cboTrabajoHTML += "<option  value='" + cboTrbResp[i].CodigoClase + "'>" + cboTrbResp[i].NombreClase + "</option>";
                        }
                    }
                }
            }
            cboTrabajoHTML += "</select></div>";
        }
        else {
            cboTrabajoHTML = "<p><select id='trabajo2' class='w3-input w3-border textos'>";
            cboTrabajoHTML += "<option  value=' '>Ninguno</option>";
            cboTrabajoHTML += "</select>";
        }
    }
}

// END_CUSTOM_CODE_lector_barras
// VIDEO
function captureVideo1() {
    try {
        //alert("video");
        //navigator.device.capture.captureVideo(captureSuccess1, captureError1, { limit: 1, quality: 0, duration: 20 });
    } catch (e) {
        alert("10"+e);
    }
    
}

function captureError1(error) {
    try {
        kendo.ui.progress($("#lector_barrasScreen"), false);
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", error);
    } catch (e) {
        alert(e);
    }
    
}

function captureSuccess1(mediaFiles) {
    try {
        //alert("video");
        //var i, len;
        //for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            // SU FUNCION
         //   uploadVideo(mediaFiles[i]); 
            //alert(inspeccionar(mediaFiles[i]));
        //}
        
    } catch (e) {
        alert(e);
    }
    
}

//-----------------------------------------------------------------------------------------------------------------

// IMAGEN
function captureImagen() {
    try {
        if (document.getElementById("estado").value !== "") {
            if (document.getElementById("estado").value != "INSPECCION_VISUAL") {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Auto ya tiene registrado videos y fotos");
            } else {
                navigator.camera.getPicture(captureSuccessImg, captureError, {
                    quality: 100,
                    targetWidth: 800,
                    targetHeight: 800,
                    destinationType: Camera.DestinationType.FILE_URI,
                    correctOrientation: true
                });
            }
        }
        //var options = { destinationFilename: "images/cam01.jpg", highRes: false };
       
            //quality: 0,
            //targetWidth: 10,
            //targetHeight: 10
        //});
    } catch (e) {
        alert(e);
    }
    
}

function captureError1(error) {
    kendo.ui.progress($("#lector_barrasScreen"), false);
    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", error);
}

//function captureSuccess1(mediaFiles) {
//    var i, len;
//    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
//        // SU FUNCION
//        uploadVideo(mediaFiles[i]);
//        alert(mediaFiles[i]);
//    }
//}

function playVideoOT(idVideo) {
    if (idVideo == "0") {
        document.getElementById("playVideo").innerHTML = "";
    }
    else {
        var vidPorcentaje = 80;
        var vidAlto = (screen.width * 50) / 100;
        var vidAncho = (screen.width * 80) / 100;
        //  var playIdVideo = "http://ecuainfo78-002-site3.btempurl.com/repositorio/" + document.getElementById('numOT_2').value + "/" + idVideo;
        var playIdVideo = idVideo;
        if (idVideo.includes("mp4")) {
            //var arrVd = idVideo.split("_");
            //playIdVideo = "http://ecuainfo78-002-site3.btempurl.com/repositorio/" + arrVd[3] + "/" + idVideo;
            document.getElementById("playVideo").innerHTML = "<center><p><br /><video width='" + vidAncho + "' height='" + vidAlto +
                "' controls Autoplay=autoplay><source src='" + playIdVideo + "' type='video/mp4'></video></p></center><br />";
        }
        else {
            document.getElementById("playVideo").innerHTML = "<center><p><br /><img src='" + playIdVideo + "' width='" + vidAncho + "' /></p></center><br />";
        }
    }
}

function captureVideo() {
    console.log(document.getElementById("estado").value);
    // navigator.device.capture.captureVideo(captureSuccess, captureError, { limit: 1 }); || 
    if (document.getElementById("estado").value !== "") {
        if (document.getElementById("estado").value !== "INSPECCION_VISUAL") {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Auto ya tiene registrado videos y fotos");
        } else {
            /* var imageModes = navigator.device.capture.supportedVideoModes;
            navigator.device.capture.configurationData = {type: "videdo/mp4"  } */
            navigator.device.capture.captureVideo(captureSuccess, captureError, { limit: 1, quality: 0, duration: 20 });
        }
    }
}
function captureSuccessImg(mediaFiles) {

    //     uploadVideo_2(mediaFiles);

    kendo.confirm("<center><h1><i class=\"fa fa-cloud-upload\"></i> SUBIR ARCHIVO</h1><br />Desea guardar el archivo en el Repositorio ?</center>")
       .done(function () {
           uploadVideo_2(mediaFiles);
       })
       .fail(function () {
           kendo.ui.progress($("#lector_barrasScreen"), false);
       });
}
/*--------------------------------------------------------------------
Fecha: 12/12/2017
Detalle: Sube el imagenes al repositorio
Autor: RRP
--------------------------------------------------------------------*/
function uploadVideo_2(mediaFile) {
    try {

        //document.getElementById("listaVideo_ev").innerHTML = "";
        //document.getElementById("playVideo_ev").innerHTML = "";

        var ft = new FileTransfer();
        path = mediaFile.fullPath,
        name = mediaFile.name;

        var vidPorcentaje = 80;
        var vidAlto = (screen.width * 50) / 100;
        var vidAncho = (screen.width * 80) / 100;

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //Enero is 0

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }

        var hhmm = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric", second:"numeric" });
        hhmm = hhmm.replace(":", "")
        var arrExtension = mediaFile.split(".");

        var camposOT = parametrosOTCompleto();
        var pathServidor = camposOT["descripcion-2"] + "\\" + document.getElementById("placa").value.toUpperCase();

        var nombreArchivoEV = localStorage.getItem("ls_empresa").toLocaleString().substring(0, 5) + "_" +
        localStorage.getItem("ls_ussucursal").toLocaleString() + "_" +
        localStorage.getItem("ls_usagencia").toLocaleString() + "_" + document.getElementById("placa").value.toUpperCase() + "_" + yyyy + mm + dd + "_" + hhmm.replace(":", "") + "." + arrExtension[arrExtension.length - 1];
        
        //localStorage.getItem("ls_empresa").toLocaleString().substring(0, 5) + "_" +
    //localStorage.getItem("ls_ussucursal").toLocaleString() + "_" +
    //localStorage.getItem("ls_usagencia").toLocaleString() + "_" +
    //document.getElementById("numOT_2").value + "_" + yyyy + mm + dd + "_" + hhmm.replace(":", "") + "." + arrExtension[arrExtension.length - 1];

        var fileVideo = mediaFile + "|" + nombreArchivoEV + "|" + pathServidor;

        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> fileVideo</center>", fileVideo);
        //return;

        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = fileVideo;

        var params = new Object();
        params.value1 = "test";
        params.value2 = "param";
        options.params = params;
        options.chunkedMode = false;

        //   var UrlSube = "http://localhost:4044/Services/TL/Taller.svc/guardaArchivoEntrega";

        // MAYORISTA:  var UrlSube = localStorage.getItem("ls_url1").toLocaleString() + "/Services/TL/Taller.svc/guardaArchivoEntrega";
        var UrlSube = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/guardaArchivoEntrega";
        //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> UrlSube</center>", UrlSube);


        kendo.ui.progress($("#lector_barrasScreen"), true);
        setTimeout(function () {
            // precarga *********************************************************************************************

            ft.upload(mediaFile, UrlSube,
                       function (result) {

                           verArchivosOT_2(document.getElementById('placa').value);

                           //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", result);

                           //  verArchivosEV(document.getElementById("ev_vin").value);

                           //var vidAlto = (screen.width * 50) / 100;
                           //var vidAncho = (screen.width * 80) / 100;

                           //if (mediaFile.includes("mp4")) {
                           //    document.getElementById("playVideo_ev").innerHTML = "<center><p><br /><video width='" + vidAncho + "' height='" + vidAlto +
                           //        "' controls Autoplay=autoplay><source src='" + mediaFile + "' type='video/mp4'></video></p></center><br />";
                           //}
                           //else if (mediaFile.includes("jpg")) {
                           //    document.getElementById("playVideo_ev").innerHTML = "<center><p><br /><img src='" + mediaFile + "' width='" + vidAncho + "' /></p></center><br />";
                           //}

                           //document.getElementById('fileOT_ev').value = "OK";
                           document.getElementById("videosOT").innerHTML = "<br /><a id='btnVideo0' class='w3-btn primary' aria-label='Video' onclick='captureVideo();'><i id='icnVideo0' class='fa fa-video-camera' aria-hidden='true'></i>&nbsp;Grabar Video</a>" +
                           "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a id='btnVideo1' class='w3-btn primary' aria-label='Foto' onclick='captureImagen();'><i id='icnVideo1' class='fa fa-camera' aria-hidden='true'></i>&nbsp;Grabar Fotos</a>";
                            llamarNuevoestilo("btnVideo");
                            llamarNuevoestiloIconB("icnVideo");
                           /* if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
                               document.getElementById("videosOT").innerHTML = "<p><label class='w3-text-red'> <b>Importante</b></label><br/>Para realizar la grabaci&oacute;n de video o captura de imagen coloque el dispositivo en posici&oacute;n horizontal. </p><br />" +
                               "<p><center><img src='kendo/styles/images/tablet_orientacion.png' /></center></p><br />" +
                               "<p><center>" +
                               "<a class='w3-btn w3-red primary' aria-label='Video' onclick='captureVideo();'><i class='fa fa-video-camera' aria-hidden='true'></i>&nbsp;Video</a>" +
                               "<a class='w3-btn w3-red primary' aria-label='Video' onclick='captureImagen();'><i class='fa fa-camera' aria-hidden='true'></i>&nbsp;Imagen</a>" +
                              // "<a class='w3-btn w3-red primary' aria-label='Video' onclick='captureAudio();'><i class='fa fa-microphone' aria-hidden='true'></i>&nbsp;Audio</a>" +
                               "</center></p>";
                           }
                           else {
                               document.getElementById("videosOT").innerHTML = "<p><label class='w3-text-red'> <b>Importante</b></label><br/>Para realizar la grabaci&oacute;n de video o captura de imagen coloque el dispositivo en posici&oacute;n horizontal. </p><br />" +
                               "<p><center><img src='kendo/styles/images/tablet_orientacion.png' /></center></p><br />" +
                               "<p><center>" +
                               "<a class='w3-btn w3-red' aria-label='Video' onclick='captureVideo();'><i class='fa fa-video-camera' aria-hidden='true'></i></a>" +
                               "<a class='w3-btn w3-red' aria-label='Video' onclick='captureImagen();'><i class='fa fa-camera' aria-hidden='true'></i></a>" +
                               "<a class='w3-btn w3-red' aria-label='Video' onclick='captureAudio();'><i class='fa fa-microphone' aria-hidden='true'></i></a>" +
                               "</center></p>";
                           } */


                           kendo.ui.progress($("#lector_barrasScreen"), false);

                       },
                   function (error) {
                       //   document.getElementById('fileOT_ev').value = "";
                       kendo.ui.progress($("#lector_barrasScreen"), false);
                       window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(error));
                   },
           options);

            kendo.ui.progress($("#lector_barrasScreen"), false);
            // precarga *********************************************************************************************
        }, 2000);

    }
    catch (e) {
        //  document.getElementById('fileOT_ev').value = "";
        kendo.ui.progress($("#lector_barrasScreen"), false);
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", e);
        return;
    }
}

/*--------------------------------------------------------------------
Fecha: 12/12/2017
Detalle: Sube el imagenes al repositorio
Autor: RRP
--------------------------------------------------------------------*/
function parametrosOTCompleto() {
    try {

        var accResp = "";

        //http://192.168.1.50:8089/concesionario/Services/TG/Parametros.svc/ParametroEmpGet/6,;TG;APP_ENTREGAS;;PATH_ENTREGAS

        //var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ParametroEmpGet/6,;TG;APP_ENTREGAS;;PATH_ENTREGAS";
        var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ParametroEmpGet/6,;TG;APP_USADOS;;PATH_USADOS";
        // window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> USADOUrl</center>", Url);

        var respPar;

        $.ajax({
            url: Url,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (data) {
                try {
                    accResp = JSON.parse(data.ParametroEmpGetResult).tmpParamEmp;
                    respPar = accResp[0];
                }
                catch (e) {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(e));
                    respPar = "error";
                }
            },
            error: function (err) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(err));
                respPar = "error";
            }
        });

        return respPar;
    } catch (f) {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", f);
        return "error";
    }
}
//function captureImagen() {
//    //// navigator.device.capture.captureImage(captureSuccess, captureError, { limit: 1 });

//    ///*captura imagen*/
//    navigator.camera.getPicture(captureSuccessImg, captureError, {
//        quality: 100,
//        targetWidth: 800,
//        targetHeight: 800,
//        destinationType: Camera.DestinationType.FILE_URI,
//        correctOrientation: true
//    });

//    ///*selecciona imagen*/
//    //navigator.camera.getPicture(captureSuccessImg, function (message) {
//    //    kendo.ui.progress($("#lector_barrasScreen"), false);
//    //}, {
//    //    quality: 50,
//    //    destinationType: navigator.camera.DestinationType.FILE_URI,
//    //    sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
//    //});
//}
function captureSuccess(mediaFiles) {

    //var i, len;
    //for (i = 0, len = mediaFiles.length; i < len; i += 1) {
    //    uploadVideo(mediaFiles[i]);
    //}

    kendo.confirm("<center><h1><i class=\"fa fa-cloud-upload\"></i> SUBIR ARCHIVO</h1><br />Desea guardar el archivo en el Repositorio ?</center>")
   .done(function () {
       var i, len;
       for (i = 0, len = mediaFiles.length; i < len; i += 1) {
           uploadVideo(mediaFiles[i]);
       }
   })
   .fail(function () {
       kendo.ui.progress($("#lector_barrasScreen"), false);
   });
}
function uploadVideo(mediaFile) {

    try {
        document.getElementById("divOTVideosCont").innerHTML = "";
        document.getElementById("videosOT").innerHTML = "";

        var mediaPlayer = "";

        var ft = new FileTransfer(),
        path = mediaFile.fullPath,
        name = mediaFile.name;

        var videoURI = path;

        var vidPorcentaje = 80;
        var vidAlto = (screen.width * 50) / 100;
        var vidAncho = (screen.width * 80) / 100;

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //Enero is 0

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }

        var hhmm = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric", second:"numeric" });
        hhmm = hhmm.replace(":", "")
        var arrExtension = videoURI.split(".");
        var camposOT = parametrosOTCompleto();
        var pathServidorOT = camposOT["descripcion-2"] + "\\" + document.getElementById("placa").value.toUpperCase();

        var fileVideo = localStorage.getItem("ls_empresa").toLocaleString().substring(0, 5) + "_" +
        localStorage.getItem("ls_ussucursal").toLocaleString() + "_" +
        localStorage.getItem("ls_usagencia").toLocaleString() + "_" + document.getElementById("placa").value.toUpperCase() + "_" + yyyy + mm + dd + "_" + hhmm.replace(":", "") + "." + arrExtension[arrExtension.length - 1];


        //var camposOT = parametrosOTCompleto();
        //var pathServidorOT = camposOT["descripcion-2"] + "\\" + document.getElementById("numOT_2").value;


        //var fileVideo = localStorage.getItem("ls_empresa").toLocaleString().substring(0, 5) + "_" +
        //    localStorage.getItem("ls_ussucursal").toLocaleString() + "_" +
        //    localStorage.getItem("ls_usagencia").toLocaleString() + "_" +
        //    document.getElementById('numOT_2').value + "_" + yyyy + mm + dd + "_" + hhmm.replace(":", "") + "." + arrExtension[1];

        fileVideo = fileVideo + "|" + fileVideo + "|" + pathServidorOT;

        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = fileVideo;
        options.mimeType = arrExtension==="mp4" ? "video/mp4" : "video/3gpp";

        var params = new Object();
        params.value1 = "test";
        params.value2 = "param";
        options.params = params;
        options.chunkedMode = false;

        // Variable del archivo
        var ft = new FileTransfer();
        // Presenta el porcentaje de subida de la imagen
        ft.onprogress = function (progressEvent) {
            if (progressEvent.lengthComputable) {
                var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                document.getElementById("videosOT").innerHTML = "";
                document.getElementById("statusDom").innerHTML = "<br/><center><i class='fa fa-cog fa-spin fa-lg'></i><br/><b>" + perc + "% guardando...</b></center>";

            } else {
                if (document.getElementById("statusDom").innerHTML == "") {
                    document.getElementById("statusDom").innerHTML = "guardando";
                } else {
                    document.getElementById("statusDom").innerHTML += ".";
                }
            }
        };

        // Ejecuta el proceso de subida de la imagen       
        // http://ecuainfo78-002-site3.btempurl.com/FileUpload.asmx/guardaArchivo

        //  var UrlSube = "http://localhost:4044/Services/TL/Taller.svc/guardaArchivoEntrega";

        var UrlSube = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/guardaArchivoEntrega";

        ft.upload(videoURI, UrlSube,
            function (result) {


                document.getElementById("statusDom").innerHTML = "";

                //// Eliminar video
                //window.resolveLocalFileSystemURL(path.replace("/" + name, ""),
                //    function (dir) {
                //        dir.getFile(name, { create: false }, function (fileEntry) {
                //            fileEntry.remove(function () {


                //            }, function (error) {
                //              //  alert("Error removing file: " + error.code);
                //            }, function () {
                //               // alert("The file doesn't exist");
                //            });
                //        });
                //    });

                // verArchivosOT(document.getElementById('numOT_2').value);
                //verArchivosOT_2(document.getElementById('numOT_2').value);
                verArchivosOT_2(document.getElementById('placa').value);
                document.getElementById("videosOT").innerHTML = "<br /><a id='btnVideo0' class='w3-btn primary' aria-label='Video' onclick='captureVideo();'><i id='icnVideo0' class='fa fa-video-camera' aria-hidden='true'></i>&nbsp;Grabar Video</a>" +
                "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a id='btnVideo1' class='w3-btn primary' aria-label='Foto' onclick='captureImagen();'><i id='icnVideo1' class='fa fa-camera' aria-hidden='true'></i>&nbsp;Grabar Fotos</a>";
                llamarNuevoestilo("btnVideo");
                llamarNuevoestiloIconB("icnVideo");
                /* if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
                    document.getElementById("videosOT").innerHTML = "<p><label class='w3-text-red'> <b>Importante</b></label><br/>Para realizar la grabaci&oacute;n de video o captura de imagen coloque el dispositivo en posici&oacute;n horizontal. </p><br />" +
                    "<p><center><img src='kendo/styles/images/tablet_orientacion.png' /></center></p><br />" +
                    "<p><center>" +
                    "<a class='w3-btn w3-red primary' aria-label='Video' onclick='captureVideo();'><i class='fa fa-video-camera' aria-hidden='true'></i>&nbsp;Video</a>" +
                    "<a class='w3-btn w3-red primary' aria-label='Video' onclick='captureImagen();'><i class='fa fa-camera' aria-hidden='true'></i>&nbsp;Imagen</a>" +
                   // "<a class='w3-btn w3-red primary' aria-label='Video' onclick='captureAudio();'><i class='fa fa-microphone' aria-hidden='true'></i>&nbsp;Audio</a>" +
                    "</center></p>";
                }
                else {
                    document.getElementById("videosOT").innerHTML = "<p><label class='w3-text-red'> <b>Importante</b></label><br/>Para realizar la grabaci&oacute;n de video o captura de imagen coloque el dispositivo en posici&oacute;n horizontal. </p><br />" +
                    "<p><center><img src='kendo/styles/images/tablet_orientacion.png' /></center></p><br />" +
                    "<p><center>" +
                    "<a class='w3-btn w3-red' aria-label='Video' onclick='captureVideo();'><i class='fa fa-video-camera' aria-hidden='true'></i></a>" +
                    "<a class='w3-btn w3-red' aria-label='Video' onclick='captureImagen();'><i class='fa fa-camera' aria-hidden='true'></i></a>" +
                    "<a class='w3-btn w3-red' aria-label='Video' onclick='captureAudio();'><i class='fa fa-microphone' aria-hidden='true'></i></a>" +
                    "</center></p>";
                } */
                kendo.ui.progress($("#lector_barrasScreen"), false);


            },
        function (error) {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>uno ERROR</center>", inspeccionar(error));
        },
        options);
    }
    catch (e) {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>dos ERROR</center>", e);
    }
}
//function uploadVideo(mediaFile) {
//    try {
//        document.getElementById("divOTVideosCont").innerHTML = "";
//        document.getElementById("videosOT").innerHTML = "";
//        var mediaPlayer = "";
//        var ft = new FileTransfer();
//        path = mediaFile.fullPath;
//        name = mediaFile.name;
//        var videoURI = path;
//        var vidPorcentaje = 80;
//        var vidAlto = (screen.width * 50) / 100;
//        var vidAncho = (screen.width * 80) / 100;
//        var today = new Date();
//        var dd = today.getDate();
//        var mm = today.getMonth() + 1; //Enero is 0
//        var yyyy = today.getFullYear();
//        if (dd < 10) {
//            dd = '0' + dd;
//        }
//        if (mm < 10) {
//            mm = '0' + mm;
//        }
//        var placa = document.getElementById("placa").value.toUpperCase();
//        var hhmm = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric" });
//        var arrExtension = videoURI.split(".");
//        var fileVideo = localStorage.getItem("ls_empresa").toLocaleString().substring(0, 5) + "_" +
//            localStorage.getItem("ls_ussucursal").toLocaleString() + "_" +
//            localStorage.getItem("ls_usagencia").toLocaleString() + "_"  + placa +"_" + yyyy + mm + dd + "_" + hhmm.replace(":", "") + "." + arrExtension[1];
//            //alert(fileVideo);
//        var options = new FileUploadOptions();
//        options.fileKey = "file";
//        options.fileName = fileVideo;
//        options.mimeType = "video/mp4";
//        var params = new Object();
//        params.value1 = "test";
//        params.value2 = "param";
//        options.params = params;
//        options.chunkedMode = false;

//        // Variable del archivo
//        var ft = new FileTransfer();
//        // Presenta el porcentaje de subida de la imagen
//        ft.onprogress = function (progressEvent) {
//            if (progressEvent.lengthComputable) {
//                var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
//                document.getElementById("videosOT").innerHTML = "";
//                document.getElementById("statusDom").innerHTML = "<br/><center><i class='fa fa-cog fa-spin fa-lg'></i><br/><b>" + perc + "% guardando...</b></center>";

//            } else {
//                if (document.getElementById("statusDom").innerHTML == "") {
//                    document.getElementById("statusDom").innerHTML = "guardando";
//                } else {
//                    document.getElementById("statusDom").innerHTML += ".";
//                }
//            }
//        };
//       ft.upload(videoURI, "http://ecuainfo78-002-site3.btempurl.com/FileUpload.asmx/guardaArchivo",
//            function (result) {
//                document.getElementById("statusDom").innerHTML = "";
//                document.getElementById("videosOT").innerHTML = "<p>Para realizar la grabaci&oacute;n coloque el dispositivo en posici&oacute;n horizontal. </p><br />" +
//                "<p><center><img src='kendo/styles/images/tablet_orientacion.png' /></center></p><br />" +
//                "<p><center><a class='w3-btn w3-red primary' aria-label='Video' onclick='captureVideo();'><i class='fa fa-video-camera' aria-hidden='true'></i>&nbsp;Grabar</a></center></p>";
//                verArchivosOT("USADOPR");
//                //alert("termino");
//            },
//        function (error) {
//            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(error));
//        },
//        options);
//    }
//    catch (e) {
//        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", e);
//    }
//}
function uploadVideoNuevo(mediaFile) {

    try {

        kendo.ui.progress($("#lector_barrasScreen"), true);
        setTimeout(function () {
            // precarga *********************************************************************************************


            document.getElementById("divOTVideosCont").innerHTML = "";
            document.getElementById("videosOT").innerHTML = "";

            var mediaPlayer = "";

            var ft = new FileTransfer(),
            path = mediaFile.fullPath,
            name = mediaFile.name;
            //alert(path + "  " + name);
            var videoURI = path;

            var vidPorcentaje = 80;
            var vidAlto = (screen.width * 50) / 100;
            var vidAncho = (screen.width * 80) / 100;

            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //Enero is 0

            var yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }

            var hhmm = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric",second:"numeric" });
            hhmm = hhmm.replace(":", "")
            var arrExtension = videoURI.split(".");
            var fileVideo = localStorage.getItem("ls_empresa").toLocaleString().substring(0, 5) + "_" +
                localStorage.getItem("ls_ussucursal").toLocaleString() + "_" +
                localStorage.getItem("ls_usagencia").toLocaleString() + "_" +
                document.getElementById("placa").value.toUpperCase() + "_" + yyyy + mm + dd + "_" + hhmm.replace(":", "") + "." + arrExtension[1];
            //alert(fileVideo);
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = fileVideo;
            //   options.mimeType = "video/mp4";

            var params = new Object();
            params.value1 = "test";
            params.value2 = "param";
            options.params = params;
            options.chunkedMode = false;

            // Variable del archivo
            // var ft = new FileTransfer();
            // Presenta el porcentaje de subida de la imagen
            ft.onprogress = function (progressEvent) {
                if (progressEvent.lengthComputable) {
                    var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                    document.getElementById("videosOT").innerHTML = "";
                    document.getElementById("statusDom").innerHTML = "<br/><center><i class='fa fa-cog fa-spin fa-lg'></i><br/><b>" + perc + "% Guardando...</b></center>";

                } else {
                    if (document.getElementById("statusDom").innerHTML == "") {
                        document.getElementById("statusDom").innerHTML = "guardando";
                    } else {
                        document.getElementById("statusDom").innerHTML += ".";
                    }
                }
            };

            // Ejecuta el proceso de subida de la imagen       
            // http://ecuainfo78-002-site3.btempurl.com/FileUpload.asmx/guardaArchivo

            //   var UrlSube = "http://localhost:4044/Services/TL/Taller.svc/guardaArchivo";

           // var UrlSube = "http://ecuainfo78-002-site3.btempurl.com/FileUpload.asmx/guardaArchivo";

            var UrlSube = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/guardaArchivo";
             //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> UrlSube</center>", UrlSube);

            kendo.confirm("<center><h1><i class=\"fa fa-cloud-upload\"></i> SUBIR ARCHIVO</h1><br />Desea subir el Archivo al Repositorio ?</center>")
             .done(function () {

                 document.getElementById("statusDom").innerHTML = "";

                 //// Eliminar video
                 //window.resolveLocalFileSystemURL(path.replace("/" + name, ""),
                 //    function (dir) {
                 //        dir.getFile(name, { create: false }, function (fileEntry) {
                 //            fileEntry.remove(function () {
                 //            }, function (error) {
                 //              //  alert("Error removing file: " + error.code);
                 //            }, function () {
                 //               // alert("The file doesn't exist");
                 //            });
                 //        });
                 //    });

                 ft.upload(videoURI, UrlSube, function (result) {
           document.getElementById("statusDom").innerHTML = "";
           document.getElementById("videosOT").innerHTML = "<p>Para realizar la grabaci&oacute;n coloque el dispositivo en posici&oacute;n horizontal. </p><br />" +
           "<p><center><img src='kendo/styles/images/tablet_orientacion.png' /></center></p><br />" +
           "<p><center><a class='w3-btn w3-red primary' aria-label='Video' onclick='captureVideo();'><i class='fa fa-video-camera' aria-hidden='true'></i>&nbsp;Grabar</a></center></p>";
           verArchivosOT("USADOPR");
           //alert("termino");
       },
   function (error) {
       window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(error));
   },
   options);

                 if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
                     document.getElementById("videosOT").innerHTML = "<p>Para realizar la grabaci&oacute;n coloque el dispositivo en posici&oacute;n horizontal. </p><br />" +
                     "<p><center><img src='kendo/styles/images/tablet_orientacion.png' /></center></p><br />" +
                     "<p><center>" +
                     "<a class='w3-btn w3-red primary' aria-label='Video' onclick='captureVideo();'><i class='fa fa-video-camera' aria-hidden='true'></i>&nbsp;Video</a>" +
                     "<a class='w3-btn w3-red primary' aria-label='Video' onclick='captureImagen();'><i class='fa fa-camera' aria-hidden='true'></i>&nbsp;Imagen</a>" +
                     "<a class='w3-btn w3-red primary' aria-label='Video' onclick='captureAudio();'><i class='fa fa-microphone' aria-hidden='true'></i>&nbsp;Audio</a>" +
                     "</center></p>";
                 }
                 else {
                     document.getElementById("videosOT").innerHTML = "<p>Para realizar la grabaci&oacute;n coloque el dispositivo en posici&oacute;n horizontal. </p><br />" +
                     "<p><center><img src='kendo/styles/images/tablet_orientacion.png' /></center></p><br />" +
                     "<p><center>" +
                     "<a class='w3-btn w3-red' aria-label='Video' onclick='captureVideo();'><i class='fa fa-video-camera' aria-hidden='true'></i></a>" +
                     "<a class='w3-btn w3-red' aria-label='Video' onclick='captureImagen();'><i class='fa fa-camera' aria-hidden='true'></i></a>" +
                     "<a class='w3-btn w3-red' aria-label='Video' onclick='captureAudio();'><i class='fa fa-microphone' aria-hidden='true'></i></a>" +
                     "</center></p>";
                 }

                 //verArchivosOT(document.getElementById('numOT_2').value);


             })
             .fail(function () {
                 document.getElementById("videosOT").innerHTML = "<p><label class='w3-text-red'> <b>Importante</b></label><br/>Para realizar la grabaci&oacute;n de video o captura de imagen coloque el dispositivo en posici&oacute;n horizontal. </p><br />" +
                 "<p><center><img src='kendo/styles/images/tablet_orientacion.png' /></center></p><br />" +
                 "<p><center><a class='w3-btn w3-red primary' aria-label='Video' onclick='captureVideo();'><i class='fa fa-video-camera' aria-hidden='true'></i>&nbsp;Grabar</a>" +
                 "<a class='w3-btn w3-red primary' aria-label='Video' onclick='captureImagen();'><i class='fa fa-camera' aria-hidden='true'></i>&nbsp;Capturar</a></center></p>" +
                 verArchivoDisp;
             });

            //  kendo.ui.progress($("#lector_barrasScreen"), false);
            // precarga *********************************************************************************************
        }, 2000);


    }
    catch (e) {
        kendo.ui.progress($("#lector_barrasScreen"), false);
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", e);
        return;
    }
}

function scanCedula() {
    var that = this;
        try {
           if (window.navigator.simulator === true) {
                // loading
                document.getElementById("divLoading").innerHTML = "";
                // Borrar imagen de placa
                document.getElementById("smallImage").style.display = "none";

                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Aplicaci\u00F3n no compatible.");
            } else {
                cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        if (!result.cancelled) {
                            alert(result.text);
                            var empsucage = result.text;
                            if (empsucage.length != 10) {
                                alert("Codigo inválido"); 
                            } else {
                                kendo.ui.progress($("#lector_barrasScreen"), true);
                                setTimeout(function () {
                                    document.getElementById("numero_id_propietario").value = result.text;
                                    llamarConsultaCliente(result.text);                                
                                }, 2000);                   
                            }
                            
                        }
                    },
                    function (error) {
                        alert(error);
                    });
            }

        } catch (e) {
            kendo.ui.progress($("#lector_barrasScreen"), false);
            alert(e);
        }
        kendo.ui.progress($("#lector_barrasScreen"), false);
}

function verArchivosOT(numOT) {
    try {
        if (localStorage.getItem("ls_mailFileOT") != undefined) {
            localStorage.removeItem("ls_mailFileOT");
        }
        document.getElementById("divOTVideosCont").innerHTML = "";
        var jsonData = JSON.stringify({ 'strOT': numOT });
        var ArchivoOT = "";
        var arrImgOT = [];
        var arrVidOT = [];
        var vidPorcentaje = 80;
        var vidAlto = (screen.width * 50) / 100;
        var vidAncho = (screen.width * 80) / 100;
        $.ajax({
            type: "POST",
            url: "http://ecuainfo78-002-site3.btempurl.com/FileUpload.asmx/verArchivo",
            data: jsonData,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            error: function (xhr, status, error) {
                kendo.ui.progress($("#lector_barrasScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", xhr.responseText);
                return;
            },
            success: function (responseData) {
                ArchivoOT = responseData.d;
                if (ArchivoOT.includes("*") == true) {
                    var arrfileGral = ArchivoOT.split("*");
                    for (var c1 = 0; c1 < arrfileGral.length; c1++) {
                        if (arrfileGral[c1].includes(".") == true) {
                            arrVidOT.push("http://ecuainfo78-002-site3.btempurl.com/repositorio/" + numOT + "/" + arrfileGral[c1]);
                        }
                    }
                    var mailFileOT = "<br />Archivos registrados:<br />";
                    var pathFiles;
                    var htmlVideo = "";
                    if (arrVidOT.length > 0) {
                        for (var c2 = 0; c2 < arrVidOT.length; c2++) {
                            pathFiles = "http://ecuainfo78-002-site3.btempurl.com/repositorio/" + numOT + "/" + arrfileGral[c2];
                            if (c2 == 0) {
                                htmlVideo += "<br/><p><table><tr><td>" +
                                 "<select id='select_file' onchange='playVideoOT(this.value);'>" +
                                 "<option value='0'>- Seleccione el Archivo -</option>";
                            }
                            var arr1 = arrfileGral[c2].split("_");
                            htmlVideo += "<option value='" + pathFiles + "'>" + arr1[3] + "_" + arr1[4] + "_" + arr1[5] + " </option>";
                            mailFileOT += "<a href='" + pathFiles + "'>" + arr1[3] + "_" + arr1[4] + "_" + arr1[5] + "</a><br />";
                            if (c2 == arrVidOT.length - 1) {
                                htmlVideo += "</select> </td></tr></table></p><br />";
                            }
                        }
                    };
                    document.getElementById("divOTVideosCont").innerHTML = htmlVideo;
                    document.getElementById("videosOT").innerHTML = "<br /><a id='btnVideo0' class='w3-btn primary' aria-label='Video' onclick='captureVideo();'><i id='icnVideo0' class='fa fa-video-camera' aria-hidden='true'></i>&nbsp;Grabar Video</a>" +
                                                              "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a id='btnVideo1' class='w3-btn primary' aria-label='Foto' onclick='captureImagen();'><i id='icnVideo1' class='fa fa-camera' aria-hidden='true'></i>&nbsp;Grabar Fotos</a>";
                    llamarNuevoestilo("btnVideo");
                    llamarNuevoestiloIconB("icnVideo");
                                                              
                    // Storage archivos OT
                    localStorage.setItem("ls_mailFileOT", mailFileOT);
                }
                else {
                    localStorage.setItem("ls_mailFileOT", "<br/><p><b>No tiene archivos registrados</b></p><br />");
                    document.getElementById("divOTVideosCont").innerHTML = "<br/><p><b>No tiene archivos registrados</b></p><br />";
                }
            }
        });
    }
    catch (eFile) {
        kendo.ui.progress($("#lector_barrasScreen"), false);
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", eFile);
    }
}
function validaVIN() {
    if (document.getElementById("chasis").value != "") {
        if (document.getElementById("chasis").value.length !== 17) {
            alert("VIN debe tener 17 digitos");
            document.getElementById("chasis").focus();
            document.getElementById("chasis").style.borderColor = "red";
            return;
        } else {
            document.getElementById("chasis").style.borderColor = "";
        }
    }
}
function ValidaMailR() {
    try {
        if (document.getElementById("mail").value != "") {
            var result = /^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(document.getElementById("mail").value);
            if (result == false) {
                alert("Email no valido");
                document.getElementById("mail").focus();
                document.getElementById("mail").style.borderColor = "red";
            } else {
                document.getElementById("mail").style.borderColor = "";
            }
        }
    } catch (f) { mens("Error validaci" + String.fromCharCode(243) + "n mail", "mens"); return; }
}
function ValidaCelularR() {
    try {
        //var result = /^[09][0-9]{9}$/.test(document.getElementById("telefono_celular").value);
        var result = /^[0][9][0-9]{8}$/.test(document.getElementById("telefono_celular").value);
            //alert(result);
        if (result == false) {
                alert("Numero de Celular no valido");
                document.getElementById("telefono_celular").focus();
                document.getElementById("telefono_celular").style.borderColor = "red";
            } else {
                document.getElementById("telefono_celular").style.borderColor = "";
            }
        
    }catch (f) { mens("Error validaci" + String.fromCharCode(243) + "n celular", "mens"); return; }
}
function ValidaTelefR() {
    try {
        if (document.getElementById("cli_telefono_propietario").value != "" && document.getElementById("cli_telefono_propietario").value > 0) {
            var result = /^[0][2|3|4|5|6|7][0-9]{7}$/.test(document.getElementById("cli_telefono_propietario").value);
            //alert(result);
            if (result == false) {
                alert("Numero de Telefono no valido");
                document.getElementById("cli_telefono_propietario").focus();
                document.getElementById("cli_telefono_propietario").style.borderColor = "red";
                //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>Ingrese correctamente el numero de telefono</center>");
            } else {
                document.getElementById("cli_telefono_propietario").style.borderColor = "";
            }
        }
    }
    catch (f) { mens("Error validaci" + String.fromCharCode(243) + "n telefono", "mens"); return; }
}
function validacedulaR(cedula) {
    try {
        var verificado = "false";
        var total = 0;
        var isNumeric;
        var coeficiente = [2, 1, 2, 1, 2, 1, 2, 1, 2];
        if (cedula.length == 10) {
            if (cedula.substring(0, 2) <= 24 && cedula.substring(0, 2) > 0) {
                var digito = cedula.substr(9, 1);
                for (var k = 0; k < coeficiente.length; k++) {
                    var valor = coeficiente[k] * cedula[k];
                    if (valor > 9) {
                        valor = valor - 9;
                    }
                    total = total + valor;
                }
                if (total > 9) {
                    total = total % 10;
                }
                var digi = 10 - total;
                if (digito == digi) { verificado = "true"; }
            }
        }
    } catch (e) {
        mensajePrm("timeAlert", 0, "<img id='autoInpse2'  width='60' height='26' src='resources/Kia-logo.png'>",
                "ERROR", "<span align='justify'>" + e + "</b></span>", true, true);
    }
    return verificado;
}
function linkCorpaire() {
    var linkC = "http://servicios.amt.gob.ec:10041/appAMT/AMT/datosxVehiculo/veh_histxRTV_bsq.jsp";
    
    //document.getElementById("linkC").setAttribute("class", "w3-input w3-border textos");
    window.open(linkC, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
}
function linkSRI() {
    var linkS = "https://declaraciones.sri.gob.ec/mat-vehicular-internet/comercializadoras/vehiculoBuscar.jspa";
    window.open(linkS, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
}
function linkSRI1() {
    var linkS1 = "https://declaraciones.sri.gob.ec/sri-en-linea/#/SriVehiculosWeb/ConsultaValoresPagarVehiculo/Consultas/consultaRubros";
    window.open(linkS1, "_system");
    //window.open(linkS1, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
}
function validaanio() {
    try {
        if (document.getElementById("anio_matricula").value != "") {
            var valor = parseInt(document.getElementById("anio_matricula").value);
            today = new Date();
            var anio = today.getFullYear();
            if (valor <= today.getFullYear() && valor > (today.getFullYear() - 20) && valor.toString().length == 4) {
                document.getElementById("anio_matricula").style.borderColor = "";
            } else {
                alert("Anio debe estar entre valor actual y 20 años atras");
                document.getElementById("anio_matricula").focus();
                document.getElementById("anio_matricula").style.borderColor = "red";
            }
        }
    }catch (f) { mens("Error validaci" + String.fromCharCode(243) + "n matricula", "mens"); return; }
}
function consultaLinks() {
    try {
        var infImagen;
        //http://192.168.1.50:8089/concesionario/Services/TG/Parametros.svc/ParametroEmpGet/6,1;TG;APP_USADOS_LINKS_CONSULTA
        var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ParametroEmpGet/6,1;TG;APP_USADOS_LINKS_CONSULTA";
        var bandera=1;
        //alert(Url);
        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", Url);
        $.ajax({
            url: Url,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    if (data.ParametroEmpGetResult.substring(0,1) == "0") {
                        alert("No existe parametrizacion");
                    } else {
                        infImagen = (JSON.parse(data.ParametroEmpGetResult)).tmpParamEmp;
                        bandera=0;
                    }
                    
                    //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(infImagen[0]));
                } catch (e) {
                    mens("No existe datos para esta cosnulta", "mens"); return;
                }
            },
            error: function (err) {
                mens("Error en consulta", "mens"); return;
            }
        });
    } catch (e) {
        mens("Error de conexi" + String.fromCharCode(243) + "n a base", "mens"); return;
    }
    var height1 = (screen.width / 2) - 30;
    var container = document.getElementById("contenedor");
    var tama = height1 + "px;";
    
    var tabla_html = "";
    if (bandera==0) {
    for (var i = 0; i < infImagen.length; i++) {
        if (i == 0) {
            tabla_html = "<table width='100%'>";
        }

        tabla_html += "<tr>" +
         "<td>" +
        "<div class='km-listview-wrapper'><ul id='navigation-container' data-role='listview' class='km-widget km-listview km-list' style='touch-action: none;'>" +
        "<li>" +
        "<a onclick='window.open(\"" + infImagen[i].descrip2 + "\",\"" + "_system" + "\",\"" + "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400" + "\");' class='km-listview-link' data-role='listview-link'>" +
        "<span class='fa-stack fa-lg'>" +
        "<i class='fa fa-square-o fa-stack-2x w3-text-red'></i>" +
        "<i id='icnLink"+i+"' class='" + infImagen[i].campo01 + "'></i>" +
        "</span>" +
        "<span class='w3-text-red' style='font-size:18px'>" +
        "Link  " + infImagen[i].elemento + 
        "</span>" +
        "</a>" +
        "</li>" +
        "</ul></div>" +
        "</td>" +
        "</tr>";
        if (i == infImagen.length - 1) {
            tabla_html += "</table>";
        }
    }
  }
    container.innerHTML = tabla_html;
    llamarNuevoestiloIcon("icnLink");
    llamarColorTexto(".w3-text-red");
}
/*--------------------------------------------------------------------
Fecha: 20/03/2018
Detalle: Despliega en un combo todos los archivos relacionados a la OT seleccionada
Autor: RRP
--------------------------------------------------------------------*/
function verArchivosOT_2(plactaFoto) {
    kendo.ui.progress($("#lector_barrasScreen"), true);
    setTimeout(function () {
        // precarga *********************************************************************************************
        try {
            if (localStorage.getItem("ls_mailFileOT") != undefined) {
                localStorage.removeItem("ls_mailFileOT");
            }
            document.getElementById("divOTVideosCont").innerHTML = "";
            var pathVer_ot = "";
            if (parametrosOTCompleto() == "error") {
                kendo.ui.progress($("#lector_barrasScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existen Parametros ingresados");
                return;
            }
            else {
                var camposOT = parametrosOTCompleto();
                pathVer_ot = camposOT["campo01"];
                var pathVinEV = camposOT["descripcion-2"] + "\\" + plactaFoto;
                var jsonData = JSON.stringify({ 'pathVinEV': pathVinEV });
                var ArchivoOT = "";
                var arrImgOT = [];
                var arrVidOT = [];
                var vidPorcentaje = 80;
                var vidAlto = (screen.width * 50) / 100;
                var vidAncho = (screen.width * 80) / 100;
                //   var UrlVerArc = "http://localhost:4044/Services/TL/Taller.svc/verArchivoEntrega";
                var UrlVerArc = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/verArchivoEntrega";
                //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", UrlVerArc);
                //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", pathVinEV);
                $.ajax({
                    type: "POST",
                    url: UrlVerArc,
                    data: jsonData,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    error: function (xhr, status, error) {
                        kendo.ui.progress($("#lector_barrasScreen"), false);
                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", xhr.responseText);
                        return;
                    },
                    success: function (responseData) {

                        ArchivoOT = inspeccionar(responseData).replace("string verArchivoEntregaResult : ", "");
                        var htmlVideoEV = "";
                        var mailFileOT = "<br />Archivos registrados:<br />";

                        if (ArchivoOT.includes("*") == true) {
                            var arrfileGral = ArchivoOT.split("*");

                            //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> arrfileGral</center>", inspeccionar(arrfileGral));

                            if (arrfileGral.length > 0) {
                                for (var c1 = 0; c1 < arrfileGral.length; c1++) {
                                    if (arrfileGral[c1].includes(".") == true) {

                                        //   var pathFilesEV = localStorage.getItem("ls_url2").toLocaleString() + "/Services/Repositorio/" + numOT + "/" + arrfileGral[c1];
                                        var pathFilesEV = pathVer_ot + "/" + plactaFoto + "/" + arrfileGral[c1];
                                        arrVidOT.push(pathFilesEV);

                                        if (c1 == 0) {
                                            htmlVideoEV += "<br/><table><tr><td><p>" +
                                             "<select id='select_file' onchange='playVideoOT(this.value);' class='w3-input w3-border textos'>" +
                                             "<option value='0'>- Seleccione el Archivo -</option>";
                                        }

                                        htmlVideoEV += "<option value='" + pathFilesEV + "'>" + arrfileGral[c1] + "</option>";

                                        mailFileOT += "<a href='" + pathFilesEV + "'>" + arrfileGral[c1] + "</a><br />";

                                        if (c1 == arrfileGral.length - 1) {
                                            htmlVideoEV += "</select></p></td></tr></table><br />";
                                        }
                                    }
                                }
                            }
                            else {
                                htmlVideoEV = "<br/><p><b>No tiene archivos registrados</b></p><br />";
                            }

                            // Storage archivos OT
                            localStorage.setItem("ls_mailFileOT", mailFileOT);
                        }
                        else {
                            htmlVideoEV = "<br/><p><b>No tiene archivos registrados</b></p><br />";
                        }
                        document.getElementById("divOTVideosCont").innerHTML = htmlVideoEV;

                        kendo.ui.progress($("#lector_barrasScreen"), false);
                    }
                });
            }
        }
        catch (eFile) {
            kendo.ui.progress($("#lector_barrasScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", eFile);
            return;
        }

        //  kendo.ui.progress($("#lector_barrasScreen"), false);
        // precarga *********************************************************************************************
    }, 2000);
}




/*--------------------------------------------------------------------
Fecha: 18/12/2017
Detalle: Presenta el archivo seleccionado video o imagen
Autor: RRP
--------------------------------------------------------------------*/
function playVideoOT(idVideo) {
    //  http://186.71.68.154:8089/test/Services/Repositorio/

    //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> UrlVerArc</center>", idVideo);

    if (idVideo == "0") {
        document.getElementById("playVideo").innerHTML = "";
    }
    else {
        var vidPorcentaje = 80;
        var vidAlto = (screen.width * 50) / 100;
        var vidAncho = (screen.width * 80) / 100;

        //  var playIdVideo = "http://ecuainfo78-002-site3.btempurl.com/repositorio/" + document.getElementById('numOT_2').value + "/" + idVideo;
        var playIdVideo = idVideo;

        if (idVideo.includes("mp4") || idVideo.includes("MP4")) {
            //var arrVd = idVideo.split("_");
            //playIdVideo = "http://ecuainfo78-002-site3.btempurl.com/repositorio/" + arrVd[3] + "/" + idVideo;
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> UrlVerArc</center>", "<center><p><br /><video width='" + vidAncho + "' height='" + vidAlto +
            "' controls Autoplay=autoplay><source src='" + playIdVideo + "' type='video/mp4'></video></p></center><br />");
            document.getElementById("playVideo").innerHTML = "<center><p><br /><video width='" + vidAncho + "' height='" + vidAlto +
                "' controls Autoplay=autoplay><source src='" + playIdVideo + "' type='video/mp4'></video></p></center><br />";
        }
        else if (idVideo.includes("jpg") || idVideo.includes("JPG")) {
            document.getElementById("playVideo").innerHTML = "<center><p><br /><img src='" + playIdVideo + "' width='" + vidAncho + "' /></p></center><br />";
        }
        else {
            document.getElementById("playVideo").innerHTML = "<center><p><br /><audio controls autoplay><source src='" + playIdVideo + "' type='audio/mpeg'>La aplicacion no soporta este formato</audio></p></center><br />";
        }
    }
}

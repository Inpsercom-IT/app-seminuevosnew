/* //// 'use strict';  
//var resp = "Error";
//var respimagen;
//var validaServicios = 1;
//var inforModelos = "";
//var tamano = "";
//var dataRespuesta;
//var usadoFormulario;
//var dataRespuesta1 = "";
//app.avaluo_vehi = kendo.observable({
//    onShow: function () {
//        try {
//            document.getElementById("tabstripUsa").style.display = "none";
//            if (localStorage.getItem("ls_verRecepcion").toLocaleString() == "0") {
//                usadoFormulario = "";
//                vaciaCamposUsa();
//                onDeviceReady();
//                //document.getElementById("btnGuardaInfoUsa").innerHTML = " <button onclick='GuardarDatosCVUsa();' class='w3-btn w3-red'>GUARDAR</button>" + "<button onclick='vaciaCamposUsa();' class='w3-btn w3-red'>NUEVO</button>";;
//                //marcas
//                marcaVheUsa(localStorage.getItem("ls_verRecepcion").toLocaleString());
//                //modelo
//                cboModeloVheUsa(document.getElementById("marcasUsa").value, "A4");
//                //color
//                cboColoresUsa("AZUL");
//                //Ubicacion
//                cboUbicacionUsa("ORELLANA");
//            }
//            else {
//                localStorage.setItem("ls_verRecepcion", "0");
//            }
//        } catch (e) {
//            alert(e);
//        }
//    },
//    afterShow: function () { }//,
//    //inicializa: function () {
//    //}
//});
//app.localization.registerView('avaluo_vehi');

//document.addEventListener("deviceready", onDeviceReady, false);
//function onDeviceReady() {
//    try {
//        $(document).ready(function () {
//            $("#tabstripUsa").kendoTabStrip({
//                animation: {
//                    open: {
//                        effects: "fadeIn"
//                    }
//                }
//            });
//        });
//    } catch (e) {
//        alert("on" + e);
//    }
   
//}
////-----------------------------------------
////marcas de vehiculos
//function marcaVheUsa(selMarca) {
//    try {
//    var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;IN;MARCAS;";
//    //"http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;IN;MARCAS;"
//    var inforMarca;
//    $.ajax({
//        url: Url,
//        type: "GET",
//        async: false,
//        dataType: "json",
//        success: function (data) {
//            try {
//                inforMarca = (JSON.parse(data.ComboParametroEmpGetResult));
//            } catch (e) {
//                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso");
//                return;
//            }
//        },
//        error: function (err) {
//            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso. Int\u00E9ntelo nuevamente.");
//            return;
//        }
//    });
//    if (inforMarca.length > 0) {
//        var cboMarcaHTML = "<p><select id='marcasUsa' onchange='cboModeloVheUsa(this.value)' class='w3-input w3-border textos'>";
//        for (var i = 0; i < inforMarca.length; i++) {
//            if (selMarca == inforMarca[i].CodigoClase) {
//                cboMarcaHTML += "<option  value='" + inforMarca[i].CodigoClase + "' selected>" + inforMarca[i].NombreClase + "</option>";
//            }
//            else {
//                cboMarcaHTML += "<option  value='" + inforMarca[i].CodigoClase + "'>" + inforMarca[i].NombreClase + "</option>";
//            }
//        }
//        cboMarcaHTML += "</select>";
//        document.getElementById("divcbomarcasUsa").innerHTML = cboMarcaHTML;
//    }
//    else {
//        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Marcas");
//    }
//    } catch (e) {
//        alert("marca" + e);
//    }
//}

//function cboModeloVheUsa(itmMarca, selModelo) {
//    try {
//    if (itmMarca != "") {
//        var UrlCboModelos = localStorage.getItem("ls_url2").toLocaleString() + "/Services/in/Inventarios.svc/in11ModelosGet/1,1;" + itmMarca;
//        //"http://186.71.21.170:8077/taller/Services/in/Inventarios.svc/in11ModelosGet/1,1;" + itmMarca;
//        inforModelos = "";
//        $.ajax({
//            url: UrlCboModelos,
//            type: "GET",
//            dataType: "json",
//            async: false,
//            success: function (data) {
//                try {
//                    inforModelos = JSON.parse(data.in11ModelosGetResult);
//                } catch (e) {
//                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Modelos");
//                    return;
//                }
//            },
//            error: function (err) {
//                alert(err);
//                return;
//            }
//        });
//        if (inforModelos.length > 0) {
//            cboModelosHTML = "<p><select id='modeloUsa' onchange='cboDescVheUsa(this.value)' class='w3-input w3-border textos'>";
//            var banDescr = 0;
//            for (var i = 0; i < inforModelos.length; i++) {
//                if (inforModelos[i].CodigoClase != " " || inforModelos[i].CodigoClase != "ninguna") {
//                    if (selModelo == inforModelos[i].CodigoClase) {
//                        cboModelosHTML += "<option  value='" + inforModelos[i].CodigoClase + "' selected>" + inforModelos[i].CodigoClase + " (" + inforModelos[i].NombreClase + ")" + "</option>";
//                        document.getElementById("desmodeloUsa").value = inforModelos[i].NombreClase;
//                        banDescr = 1;
//                    }
//                    else {
//                        cboModelosHTML += "<option  value='" + inforModelos[i].CodigoClase + "'>" + inforModelos[i].CodigoClase + " (" + inforModelos[i].NombreClase + ")" + "</option>";
//                    }
//                }
//            }
//            cboModelosHTML += "</select>";
//        }
//        else {
//            cboModelosHTML = "<p><select id='modeloUsa' class='w3-input w3-border textos'>";
//            cboModelosHTML += "<option  value=' '>Ninguna</option>";
//            cboModelosHTML += "</select>";
//        }
//    }
//    document.getElementById("divcboModeloUsa").innerHTML = cboModelosHTML;
//    if (selModelo === undefined) {
//        if (inforModelos.length === 1) {
//            document.getElementById("desmodeloUsa").value = inforModelos[0].NombreClase;
//        } else {
//            document.getElementById("desmodeloUsa").value = "";
//        }
//    }
//    } catch (e) {
//        alert("modelo" + e);
//    }
//}

//function seleccionUSA(sele1, i, sele2) {
//    try {
//        var cboMarcaHTML = "<p><select id='" + "SEL" + i + "'class='w3-input w3-border textos'>";
//        for (var k = 0; k < sele1.length; k++) {
//            if (sele2 == sele1[k].sele) {
//                cboMarcaHTML += "<option  value='" + sele1[k].sele + "' selected>" + sele1[k].sele + "</option>";
//            }
//            else {
//                cboMarcaHTML += "<option  value='" + sele1[k].sele + "'>" + sele1[k].sele + "</option>";
//            }
//        }
//        cboMarcaHTML += "</select></p>";
//        return cboMarcaHTML;
//    } catch (e) {
//        alert("selec" + e);
//    }
    
//}

//function cargatabla(griddata1) {
//    try {
//    document.getElementById("divOtEstado").innerHTML = "";
//    dataRespuesta = "";
//    var tablaOT = "";
//    tablaOT = "<table BORDER CELLPADDING=10 CELLSPACING=10 id='docume'>";
//    var cuerpo;
//    tablaOT += "<tr align='center' style='background-color:#88282C'><td></td><td><label style='font-weight:bold; font-size:13px;color:#ffffff'>B=BUENO   R=REGULAR   M=MALO</label></td><td></td></tr>"
//    for (var i = 0; i < griddata1.length; i++) {
//        var seccionFor = griddata1[i].seccion_formulario;
//        tablaOT += "<tr style='background-color:#88282C'><td align='center' style='width: 50%;'><label style='font-weight:bold; font-size:13px;color:#ffffff'>" + griddata1[i].seccion_formulario + "</label></td><td style='width: 25%;'></td><td style='width: 25%;'></td></tr>";
//        while (griddata1[i].seccion_formulario == seccionFor) {
//            var tipoUsa = "";
//            if (griddata1[i].tipo_valor == "NUMERICO") {
//                tipoUsa = "number";
//            } else {
//                tipoUsa = "text";
//            }
//            tablaOT += "<tr><td>" + griddata1[i].orden_presentacion + "&nbsp;&nbsp;<label class='w3-text-black' style='font-weight:bold; font-size:13px'>" + griddata1[i].pregunta + "</label></td>";
//            if (griddata1[i].tipo_respuesta == "SELECCION" || griddata1[i].tipo_respuesta == "SEV") {
//                var sevUsa = "<td><table style='width: 100%;'><tr>";
//                if (griddata1[i].tipo_respuesta == "SEV") {
//                    var valorsev = griddata1[i].sevRespt.split(',');
//                    for (var l = 0; l < griddata1[i].sevResp.length; l++) {
//                        sevUsa += "<td><p><input id=SEV" + i + "" + l + " type='" + tipoUsa + "' style='width:100%' placeholder=" + (l + 1) + " value=" + valorsev[l] + "></p></td>";
//                    }
//                    //alert(sevUsa);
//                }
//                sevUsa += "</tr></table></td>";
//                var selUsa = seleccionUSA(griddata1[i].selResp, i, griddata1[i].selRespt);
//                tablaOT += sevUsa + "<td>" + selUsa + "</td>";
//            } else {
//                if (griddata1[i].tipo_respuesta == "ER") {
//                    var sevUsa = "<td><table style='width: 100%;'><tr>";
//                    var valorer = griddata1[i].erRespt.split(',');
//                    for (var l = 0; l < griddata1[i].erResp.length; l++) {
//                          sevUsa += "<td><p><input id=ER" + i+""+l + " type='text' size='2' placeholder=" + griddata1[i].erResp[l].erR + " value="+valorer[l] +"></p></td>";
//                        }
//                        //alert(sevUsa);
//                    sevUsa += "</tr></table></td>";
//                    var selUsa = seleccionUSA(griddata1[i].selResp, i, griddata1[i].selRespt);
//                    tablaOT += sevUsa + "<td>" + selUsa + "</td>";
//                } else {
//                    if (griddata1[i].tipo_respuesta == "EV") {
//                        var sevUsa = "<td><table style='width: 100%;'><tr>";
//                        var valorev = griddata1[i].evRespt.split(',');
//                        for (var l = 0; l < griddata1[i].evResp.length; l++) {
//                            sevUsa += "<td><p><input id=EV" + i + "" + l + " type='text' size='2' placeholder=" + griddata1[i].evResp[l].evR + " value="+valorev[l] +"></p></td>";
//                        }
//                        sevUsa += "</tr></table></td>";
//                        tablaOT += sevUsa+ "<td></td>";
//                    }
//                }
//            }
//            tablaOT += "</tr>";
//            i++;
//            if (i == tamano) {
//                break;
//            }
//        }
//        i--;
//    }
//    tablaOT += "</table>";
//    document.getElementById("divOtEstado").innerHTML = " ";
//   document.getElementById("divOtEstado").innerHTML = tablaOT;
//   document.getElementById("divOtEstado").style.display = 'block';
//   dataRespuesta = griddata1;
//    } catch (e) {
//        alert("carga" + e);
//    }
//}

//function seleccionUSAIV(insp1, i) {
//    try {
//        var cboMarcaHTMLIV = "<p><select id='" + "INV" + i + "'class='w3-input w3-border textos'>";
//        for (var k = 0; k < insp1.length; k++) {
//            if ("Seleccione" == insp1[k].sele) {
//                cboMarcaHTMLIV += "<option  value='" + insp1[k].sele + "' selected>" + insp1[k].sele + "</option>";
//            }
//            else {
//                cboMarcaHTMLIV += "<option  value='" + insp1[k].sele + "'>" + insp1[k].sele + "</option>";
//            }
//        }
//        cboMarcaHTMLIV += "</select></p>";
//        return cboMarcaHTMLIV;
//    } catch (e) {
//        alert("selecci" + e);
//    }
    
//}

//function cargaInspeccion(griddataIV) {
//    try {
//        var tablaOT = "<div align='center' style='background-color:#88282C'><label style='font-weight:bold; font-size:13px;color:#ffffff'>INSPECCION PARTES MOVILES</label></div>";
//        tablaOT += "<table BORDER CELLPADDING=10 CELLSPACING=10 id='docume'>";
//        var cuerpo;
//        for (var i = 0; i < griddataIV.length; i++) {
//            tablaOT += "<tr><td width='10%'>&nbsp;" + griddataIV[i].codigoclase + "</td><td width='50%'><label class='w3-text-black' style='font-weight:bold; font-size:13px'>&nbsp;" + griddataIV[i].nombreclase + "</label></td>";
//            var selINV = seleccionUSAIV(griddataIV[i].selINV, i);
//            tablaOT += "<td width='30%'>" + selINV + "</td>";
//        }
//        tablaOT += "</table>";
//        document.getElementById("divInspeccion").innerHTML = tablaOT;
//        document.getElementById("divInspeccion").style.display = "initial";
//        dataRespuesta1 = griddataIV;
//        alert(inspeccionar(dataRespuesta1[0]));
//    } catch (e) {
//        alert("cargai" + e);
//    }
    
//}

//function cboDescVheUsa(itmdes, prueba) {
//    try {
//        for (var j = 0; j < inforModelos.length; j++) {
//            if (itmdes == inforModelos[j].CodigoClase) {
//                document.getElementById("desmodeloUsa").value = inforModelos[j].NombreClase;
//            }
//        }
//    } catch (e) {
//        alert("desc" + e);
//    }
//}

//function cboColoresUsa(selColor) {
//    try {
//    var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;VH;COLOR_VEHICULO;";
//    //"http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;VH;COLOR_VEHICULO;"
//    var inforColor;
//    $.ajax({
//        url: Url,
//        type: "GET",
//        async: false,
//        dataType: "json",
//        success: function (data) {
//            try {
//                inforColor = (JSON.parse(data.ComboParametroEmpGetResult));
//            } catch (e) {
//                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso");
//                return;
//            }
//        },
//        error: function (err) {
//            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso. Int\u00E9ntelo nuevamente.");
//            return;
//        }
//    });
//    if (inforColor.length > 0) {
//        var cboColorHTML = "<p><select id='ColorUsa' class='w3-input w3-border textos'>";
//        for (var i = 0; i < inforColor.length; i++) {
//            if (selColor == inforColor[i].CodigoClase) {
//                cboColorHTML += "<option  value='" + inforColor[i].CodigoClase + "' selected>" + inforColor[i].NombreClase + "</option>";
//            }
//            else {
//                cboColorHTML += "<option  value='" + inforColor[i].CodigoClase + "'>" + inforColor[i].NombreClase + "</option>";
//            }
//        }
//        cboColorHTML += "</select>";
//        document.getElementById("divcboColorUsa").innerHTML = cboColorHTML;
//    }
//    else {
//        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Color");
//    }
//    } catch (e) {
//        alert("colores" + e);
//    }
//}

//function cboUbicacionUsa(selUbica) {
//    try {
//    var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;VH;UBICACION_USADOS;";
//    // "http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;VH;UBICACION_USADOS;"
//    var inforUbica;
//    $.ajax({
//        url: Url,
//        type: "GET",
//        async: false,
//        dataType: "json",
//        success: function (data) {
//            try {
//                inforUbica = (JSON.parse(data.ComboParametroEmpGetResult));
//            } catch (e) {
//                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso");
//                return;
//            }
//        },
//        error: function (err) {
//            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso. Int\u00E9ntelo nuevamente.");
//            return;
//        }
//    });
//    if (inforUbica.length > 0) {
//        var cboUbicaHTML = "<p><select id='UbicaUsa' class='w3-input w3-border textos'>";
//        for (var i = 0; i < inforUbica.length; i++) {
//            if (selUbica == inforUbica[i].CodigoClase) {
//                cboUbicaHTML += "<option  value='" + inforUbica[i].CodigoClase + "' selected>" + inforUbica[i].NombreClase + "</option>";
//            }
//            else {
//                cboUbicaHTML += "<option  value='" + inforUbica[i].CodigoClase + "'>" + inforUbica[i].NombreClase + "</option>";
//            }
//        }
//        cboUbicaHTML += "</select>";
//        document.getElementById("divcboUbicaUsa").innerHTML = cboUbicaHTML;
//    }
//    else {
//        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Ubicaci?n");
//    }
//    } catch (e) {
//        alert("ubica" + e);
//    }
//}

//function llamarUSA(placaVIN) {
//    try {
//        alert(placaVIN);
//        vaciaCamposUsa();
//        alert(placaVIN);
//        //document.getElementById("infoPlacasVINUsa").value = placaVIN;
//        kendo.ui.progress($("#avaluo_vehiScreen"), true);
//        setTimeout(function () {
//            buscaPlacaVINUsa(placaVIN);
//        }, 2000);
//    } catch (e) {
//        alert("llama" + e);
//    }
    
//}

//function buscaPlacaVINUsa(placaVIN) {
//    try {
//        document.getElementById("tabstripUsa").style.display = "none";
//        resetControlsUsa("");
//        // Borrar imagen de placa
//       // document.getElementById("smallImage").style.display = "none";
//        if (placaVIN != "") {
//            if (placaVIN.includes("*") == true) {
//                listaVin(placaVIN);
//            } else {
//                if (placaVIN.length > 8) {
//                    var patron = /^\d*$/;
//                    if (patron.test(placaVIN)) {
//                        TraerInformacionUsa(placaVIN, "O");
//                    }
//                    else {
//                        TraerInformacionUsa(placaVIN, "C");
//                    }
//                }
//                else {
//                    TraerInformacionUsa(placaVIN, "P");
//                }
//            }
//        }
//        else {
//             window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Ingrese la Placa o VIN");
//        }
//        kendo.ui.progress($("#avaluo_vehiScreen"), false);
//    } catch (e1) {
//        alert("buscaVin  " + e1);
//    }
//}

//function listaVin(strVIN) {
//    try {
//    document.getElementById("gridVINUsa").innerHTML = "";
//    strVIN = strVIN.replace('*', ' ').trim();
//    if (strVIN.length < 8) {
//        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Ingrese m&iacute;nimo 8 caracteres");
//        return;
//    }
//    // var UrlVIN = "http://200.31.10.92:8092/appk_aekia/Services/VH/Vehiculos.svc/vh01VehiculosGet/1,JSON;;;;;10039;";
//    var UrlVIN = localStorage.getItem("ls_url1").toLocaleString() + "/Services/VH/Vehiculos.svc/vh01VehiculosGet/1,JSON;;;;;" + strVIN + ";";
//    var infVINResp = "";
//    $.ajax({
//        url: UrlVIN,
//        type: "GET",
//        dataType: "json",
//        async: false,
//        success: function (data) {
//            try {
//                infVINResp = (JSON.parse(data.vh01VehiculosGetResult)).tvh01;
//            } catch (e) {
//                //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", e);
//                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No se han encontrado registros");
//                return;
//            }
//        },
//        error: function (err) {
//            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", err);
//            return;
//        }
//    });
//    if (infVINResp.length > 0) {
//        $("#gridVINUsa").kendoGrid({
//            dataSource: {
//                data: infVINResp,

//                pageSize: 20
//            },
//            // height: 400,
//            scrollable: false,
//            pageable: {
//                input: true,
//                numeric: false
//            },
//            columns: [
//                {
//                    title: "", width: obs,
//                    command: [{
//                        name: "obs",
//                        text: " ",
//                        imageClass: "fa fa-search-plus",

//                        visible: function (dataItem) { return dataItem.chasis != "0," },
//                        click: function (e) {
//                            try {
//                                e.preventDefault();
//                                var tr = $(e.target).closest('tr');
//                                var dataItem = this.dataItem(tr);
//                                //   window.myalert("<center><i class=\"fa fa-ambulance\"></i> <font style='font-size: 14px'>CHASIS</font></center>", dataItem.chasis);
//                                TraerInformacionUsa(dataItem.chasis, "C");

//                            } catch (f) {
//                                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No se han encontrado registros");
//                                return;
//                                //alert(f);
//                            }
//                        }
//                    }],
//                },

//                { field: "chasis", title: "VIN", width: fecha },
//                { field: "nombre_propietario", title: "Propietario", width: fecha },
//                //{ field: "placa", title: "Placa", width: obs}
//            ]
//        });

//    }
//    } catch (e) {
//        alert("lista" + e);
//    }
//}

///*--------------------------------------------------------------------
//Fecha: 16/08/2017
//Detalle: Obtiene la informacion a traves del Chasis
//Autor: RRP
//--------------------------------------------------------------------*/
//function TraerInformacionUsa(responseText, tipo) {
//    try {
//    var inforUsa;
//    var tabstripUsa = $("#tabstripUsa").kendoTabStrip().data("kendoTabStrip");
//    tabstripUsa.select(0);
//    document.getElementById("divOtEstado").innerHTML = "";
//    document.getElementById('gridVINUsa').innerHTML = "";
//    var intResult = "";
    
//        if (tipo=="P") {
//            var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh62VinUsadoGet/4,json;" + localStorage.getItem("ls_idempresa").toLocaleString() + ";" + localStorage.getItem("ls_ussucursal").toLocaleString() + ";" + localStorage.getItem("ls_usagencia").toLocaleString() + ";" + responseText + ";";
//        } else {
//            var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh62VinUsadoGet/4,json;" + localStorage.getItem("ls_idempresa").toLocaleString() + ";" + localStorage.getItem("ls_ussucursal").toLocaleString() + ";" + localStorage.getItem("ls_usagencia").toLocaleString() + ";;" + responseText + ";";
//        }
//        $.ajax({
//            url: Url,
//            type: "GET",
//            async: false,
//            dataType: "json",
//            success: function (data) {
//                try {
//                    inforUsa = (JSON.parse(data.vh62VinUsadoGetResult)).tvh62[0];
//                } catch (e) {
//                    recurrenteOT = 1;
//                }
//            },
//            error: function (err) {
//                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso. Int\u00E9ntelo nuevamente.");
//                return;
//            }
//        });
//        if (inforUsa != "" || inforUsa != null) {
//            try {
//                // Usuario crea => login 
//                document.getElementById("placaUsa").value = inforUsa.placa;
//                document.getElementById("chasisUsa").value = inforUsa.chasis;
//                document.getElementById("motorUsa").value = inforUsa.numero_motor;
//                document.getElementById("kilometrosUsa").value = inforUsa.kilometraje;
//                marcaVheUsa(inforUsa.codigo_marca);
//                cboModeloVheUsa(inforUsa.codigo_marca, inforUsa.codigo_modelo);
//                document.getElementById("anio_modeloUsa").value = inforUsa.anio_modelo;
//                cboColoresUsa(inforUsa.color_vehiculo);
//                document.getElementById("cilindrajeUsa").value = inforUsa.cilindraje;
//                document.getElementById("anio_vh62Usa").value = inforUsa.anio_vh62;
//                document.getElementById("secuenciaUsa").value = inforUsa.secuencia_vh62;
//                document.getElementById("estadoUsa").value = inforUsa.estado;
//                document.getElementById("anio_matriculaUsa").value = inforUsa.anio_matricula;
//                document.getElementById("cilindrajeUsa").value = inforUsa.cilindraje;
//                cboUbicacionUsa(inforUsa.ubicacion_fisica);
//                document.getElementById("fecha_recepcionUsa").value = inforUsa.fecha_registro;
//                document.getElementById("btnGuardaInfoUsa").innerHTML = " <button onclick='GuardarDatosCVUsa();' class='w3-btn w3-red'>MODIFICAR</button>" + "  " + "<button onclick='vaciaCamposUsa();' class='w3-btn w3-red'>NUEVO</button>" + "  " + "<button onclick='cambiarestado();' class='w3-btn w3-red'>CAMBIA ESTADO</button>";
                
//                //usadoFormulario = inforUsa.tipo_formulario;
//        //Info Orden de Trabajo  
//        //-------------------------*/
//                document.getElementById("tabstripUsa").style.display = 'block';
//                ConsultarEMUSA(inforUsa.chasis);
//                ConsultarIVUSA();
//                //

//                activaDesactivaUsa(true, inforUsa.placa, inforUsa.cilindraje);
//                ConsultarMEUSA(inforUsa);
//                if (validaServicios > 0) {
//                    //document.getElementById("resultUsa").style.display = 'block';
//                    document.getElementById("vehiculoUsa").style.display = 'block';
//                    document.getElementById("tabstripUsa").style.display = 'block';
//                }
//                //document.getElementById("tabstripUsa-2").style.height = "300px";
//                //document.getElementById("tabstripUsa-2").removeAttribute("style");

                
//            } catch (e2) {
//                alert("e2"+e2);
//            }
//        }
        
        
//        //alert("fin");
//    } catch (e1) {
//        alert(e1);
//        vaciaCamposUsa();
//        }
//}

//function win(r) {
//    try {
//        MIshowHint(resp);
//    } catch (e) {
//        alert("win" + e);
//    }
    
//}

//function fail(error) {
//    try {
//        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "La imagen no se ha guardado correctamente. Int\u00E9ntelo nuevamente.");
//    } catch (e) {
//        alert("fail" + e);
//    }
    
//}

//function resetControlsUsa(visControl) {
//    try {
//        var myStringArray = ["vehiculoUsa", "tabstripUsa"];
//        var arrayLength = myStringArray.length;
//        for (var i = 0; i < arrayLength; i++) {
//            document.getElementById(myStringArray[i]).style.display = 'none';
//        }
//        if (visControl != "") {
//            document.getElementById(imgAuto).style.visibility = 'visible';
//        }
//        nuevoFormUsa();
//    } catch (e) {
//        alert("reset" + e);
//    }
    
//}

//function vaciaCamposUsa() {
//    try {
//        document.getElementById("tabstripUsa").style.display = "none";
//        nuevoFormUsa();
//        document.getElementById("infoPlacasVINUsa").value = "";
//    } catch (e) {
//        alert(e);
//    }
//}

//function nuevoFormUsa() {
//    try {
//        document.getElementById("vehiculoUsa").style.display = 'block';
//        // datos vehiculo
//        document.getElementById("placaUsa").value = "";
//        document.getElementById("chasisUsa").value = "";
//        document.getElementById("motorUsa").value = "";
//        document.getElementById("anio_modeloUsa").value = "";
//        document.getElementById("cilindrajeUsa").value = "";
//        document.getElementById("anio_matriculaUsa").value = "";
//    } catch (e) {
//        alert("nuevo" + e);
//    }
    
//    }

//function GuardarDatosCVUsaPP() {
//    try {
//        for (var i = 0; i < dataRespuesta.length; i++) {
//            //alert(dataRespuesta[i].tipo_respuesta);
//            var sevRespts = [];
//            var erRespts = [];
//            var evRespts = [];
//            if (dataRespuesta[i].tipo_respuesta == "SELECCION" || dataRespuesta[i].tipo_respuesta == "SEV") {
//                if (dataRespuesta[i].tipo_respuesta == "SEV") {
                    
//                    for (var l = 0; l < dataRespuesta[i].sevResp.length; l++) {
//                        if (document.getElementById("SEV" + i + "" + l) != null) {
//                            //dataRespuesta[i].sevResp[l] = document.getElementById("SEV" + i + "" + l).value.toLocaleString();
//                            sevRespts[l] = document.getElementById("SEV" + i + "" + l).value.toLocaleString();
//                            //alert(i + "sev " + inspeccionar(dataRespuesta[i].sevResp[l]));
//                        }
//                    }
//                }
//                dataRespuesta[i].selRespt = document.getElementById("SEL" + i).value.toLocaleString();
//            }
//            if (dataRespuesta[i].tipo_respuesta == "ER") {
//                for (var k = 0; k < dataRespuesta[i].erResp.length; k++) {
//                    if (document.getElementById("ER" + i + "" + k) != null) {
//                        //dataRespuesta[i].erResp[l].erR = document.getElementById("ER" + i + "" + l).value;
//                        erRespts[k] = document.getElementById("ER" + i + "" + k).value;
//                    }
//                    //alert(inspeccionar(erRespts));
//                }
//                dataRespuesta[i].selRespt = document.getElementById("SEL" + i).value.toLocaleString();
//             } 
//            if (dataRespuesta[i].tipo_respuesta == "EV") {
//                //var sevUsa = "<td><table style='width: 100%;'><tr>";
//                for (var m = 0; m < dataRespuesta[i].evResp.length; m++) {
//                    if (document.getElementById("EV" + i + "" + m) != null) {
//                        //dataRespuesta[i].evResp[l].evR = document.getElementById("EV" + i + "" + l).value;
//                        evRespts[m] = document.getElementById("EV" + i + "" + m).value;
//                    }
//                } 
//            }
//            dataRespuesta[i].sevRespt = sevRespts;
//            dataRespuesta[i].erRespt = erRespts;
//            dataRespuesta[i].evRespt = evRespts
//        } 
        
//        //alert("termino");
//        var para = [];
//        if (dataRespuesta.length > 0) {
//            try {
//                for (var i = 0; i < dataRespuesta.length; i++) {
//                    var sevRespuesta = dataRespuesta[i].sevRespt;
//                    var erRespuesta = dataRespuesta[i].erRespt;
//                    var evRespuesta = dataRespuesta[i].evRespt;
//                    var sevRespuestaS = "";
//                    if (sevRespuesta != null) {
//                        for (var j = 0; j < sevRespuesta.length; j++) {
//                            sevRespuestaS += sevRespuesta[j];
//                            sevRespuestaS += ",";
//                        }
//                    }
//                    var erRespuestaS = "";
//                    if (erRespuesta != null) {
//                        for (var j = 0; j < erRespuesta.length; j++) {
//                            erRespuestaS += erRespuesta[j];
//                            erRespuestaS += ",";
//                        }
//                    }

//                    var evRespuestaS = "";
//                    if (evRespuesta != null) {
//                        for (var j = 0; j < evRespuesta.length; j++) {
//                            evRespuestaS += evRespuesta[j];
//                            evRespuestaS += ",";
//                        }
//                    }
                    
//                    para[i] = {
//                        "codigo_empresa": dataRespuesta[i].codigo_empresa,
//                        "codigo_sucursal": dataRespuesta[i].codigo_sucursal,
//                        "codigo_agencia": dataRespuesta[i].codigo_agencia,
//                        "anio_vh62": dataRespuesta[i].anio_vh62,
//                        "secuencia_vh65": dataRespuesta[i].secuencia_vh65,
//                        "secuencia_vh62": dataRespuesta[i].secuencia_vh62,
//                        "tipo_formulario": dataRespuesta[i].tipo_formulario,
//                        "seccion_formulario": dataRespuesta[i].seccion_formulario,
//                        "pregunta": dataRespuesta[i].pregunta,
//                        "orden_presentacion": dataRespuesta[i].orden_presentacion,
//                        "selRespt": dataRespuesta[i].selRespt,
//                        "sevRespt": sevRespuestaS, //dataRespuesta[i].sevRespt,
//                        "erRespt": erRespuestaS, //dataRespuesta[i].erRespt,
//                        "evRespt": evRespuestaS //dataRespuesta[i].evRespt,
//                    };
//                }
//                var cont = i;
//                var codigo_empresa= dataRespuesta[i-1].codigo_empresa;
//                var codigo_sucursal= dataRespuesta[i-1].codigo_sucursal;
//                var codigo_agencia= dataRespuesta[i-1].codigo_agencia;
//                var anio_vh62= dataRespuesta[i-1].anio_vh62;
//                var secuencia_vh65 = dataRespuesta[i - 1].secuencia_vh65;
//                var secuencia_vh62 = dataRespuesta[i - 1].secuencia_vh62;
//                var tipo_formulario = dataRespuesta[i - 1].tipo_formulario;

//                for (var j = 0; j < dataRespuesta1.length; j++) {
//                    dataRespuesta1[j].respuestaclase = document.getElementById("INV" + j).value;
//                }
//                alert(inspeccionar(para[cont]));
//                for (var k = 0; k < dataRespuesta1.length; k++) {
//                    alert(dataRespuesta1[k].nombreclase + "  " + dataRespuesta1[k].respuestaclase);
//                    para[cont] = {
//                        "codigo_empresa": codigo_empresa,
//                        "codigo_sucursal": codigo_sucursal,
//                        "codigo_agencia": codigo_agencia,
//                        "anio_vh62": anio_vh62,
//                        "secuencia_vh65": secuencia_vh65,
//                        "secuencia_vh62": secuencia_vh62,
//                        "tipo_formulario": tipo_formulario,
//                        "seccion_formulario": "",
//                        "pregunta": dataRespuesta1[k].nombreclase,
//                        "orden_presentacion": "",
//                        "selRespt": dataRespuesta1[k].respuestaclase,
//                        "sevRespt": "",
//                        "erRespt": "",
//                        "evRespt": ""
//                    };
//                    alert(cont+"  "+inspeccionar(para[cont]));
//                    cont += 1;
//                    alert(cont);
                    
//                }
//            } catch (e) {
//                alert(e);
//            }
            
//            var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/vh/Vehiculos.svc/vh66VehiculosSet";
//            //var indicador = 0;
//            //$.each(dataRespuesta, function (k, v) {
//            //    ////display the key and value pair
//            //    if (k != "giro_comercial" && k != "canton_propietario" && k != "parroquia_propietario" && k != "observaciones" && k != "estado" && k != "fecha_anulacion"
//            //         && k != "usuario_anulacion" && k != "hora_anulacion" && k != "fecha_creacion" && k != "hora_creacion" && k != "usuario_creacion" && k != "prog_creacion"
//            //         && k != "fecha_modificacion" && k != "hora_modificacion" && k != "usuario_modificacion" && k != "prog_modificacion") {
//            //        if (v == "") {
//            //            alert(k);
//            //            indicador = 1;
//            //        }
//            //    }
//            //});
//            //if (indicador == 1) {
//            //    alert("Verificar datos en blanco", "mens"); return;
//            //}
//            //alert(Url);
//            $.ajax({
//                url: Url,
//                type: "POST",
//                data: JSON.stringify(para),
//                async: false,
//                dataType: "json",
//                //Content-Type: application/json
//                headers: {
//                    'Content-Type': 'application/json;charset=UTF-8'
//                },
//                success: function (datas) {
//                    //alert((datas));
//                    if (datas.substr(0, 1) == "1") {
//                        alert("se actualizaron los datos");
//                        vaciaCampos();
//                        return;
//                    } else { alert(datas.substr(2, datas.length - 2)); return; }
//                },
//                error: function (err) { alert(inspeccionar(err)); alert("Error en servicio clientes"); return; } //alert(err);
//            });
//        }
        
//    } catch (e) { alert(e); }
//}

//function activaDesactivaUsa(sino, placa, cilindraje) {
//    try {
//        document.getElementById("chasisUsa").disabled = sino;
//        document.getElementById("motorUsa").disabled = sino;
//        document.getElementById("anio_modeloUsa").disabled = sino;
//        var marca = document.getElementById("marcasUsa");
//        var modelo = document.getElementById("modeloUsa");
//        var ubica = document.getElementById("UbicaUsa");
//        var color = document.getElementById("ColorUsa");
//        color.disabled = sino;
//        modelo.disabled = sino;
//        marca.disabled = sino;
//        ubica.disabled = sino
//        document.getElementById("desmodeloUsa").disabled = sino;
//        if (placa.length == 0) {
//            document.getElementById("placaUsa").disabled = false;
//        } else {
//            document.getElementById("placaUsa").disabled = true;
//        }

//        if (cilindraje.length == 0) {
//            document.getElementById("cilindrajeUsa").disabled = false;
//        } else {
//            document.getElementById("cilindrajeUsa").disabled = true;
//        }
//    } catch (e) {
//        alert("sino "+e);

//    }

//}

//function ConsultarMEUSA(inforusa) {
//    try {
//        var respOT = "0";
//        var UrlMotorEscape = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh65PreguntasAvaluoGet/1,json;"+inforusa.codigo_empresa+";" + inforusa.tipo_formulario + ";;;"+inforusa.codigo_sucursal+";"+
//            inforusa.codigo_agencia+";"+inforusa.anio_vh62+";"+inforusa.secuencia_vh62;//"/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;VH;PARTE_MOTOR_USADOS;";
//        var infME;
//        $.ajax({
//            url: UrlMotorEscape,
//            type: "GET",
//            async: false,
//            dataType: "json",
//            success: function (data) {
//                try {
//                    infME = (JSON.parse(data.vh65PreguntasAvaluoGetResult)).otro_tvh65;   //(JSON.parse(data.ComboParametroEmpGetResult));
//                    respOT = "1";
//                } catch (e) {
//                    return;
//                }
//            },
//            error: function (err) {
//                return;
//            }
//        });
//        if (respOT == "1") {
//            try {
//                var griddata = [];
//                tamano = infME.length;
//                for (var t = 0; t < infME.length; t++) {
//                    if (infME[t].orden_presentacion < 10) {
//                        infME[t].orden_presentacion = "0" + infME[t].orden_presentacion;
//                    }
//                }

//                infME.sort(function myfunction(a, b) {
//                    return (a.corden_seccion + "" + a.orden_presentacion) - (b.corden_seccion + "" + b.orden_presentacion)
//                });
//              for (var i = 0; i < infME.length; i++) {
//                var selecResp = new Array();
//                var sevResp = new Array();
//                var erResp = new Array();
//                var evResp = new Array();
//                if (infME[i].tipo_respuesta == "SELECCION" || infME[i].tipo_respuesta == "SEV") {
//                    if (infME[i].tipo_respuesta == "SEV") {
//                        sevResp = infME[i].lista_etiquetas.split(",");
//                        var sevRes = [];
//                        for (var k = 0; k < sevResp.length; k++) {
//                            sevRes.push({ sevR: sevResp[k] });
//                        }
//                    }
//                    selecResp = infME[i].lista_respuesta.split(",");
//                    var selRes = [];
//                    selRes.push({ sele: "Seleccione" });
//                    for (var j = 0; j < selecResp.length; j++) {
//                        selRes.push({ sele: selecResp[j] });
//                    }
//                } else {
//                    if (infME[i].tipo_respuesta == "ER") {
//                        erResp = infME[i].lista_etiquetas.split(",");
//                        var erRes = [];
//                        for (var l = 0; l < erResp.length; l++) {
//                            erRes.push({ erR: erResp[l] });
//                        }
//                        selecResp = infME[i].lista_respuesta.split(",");
//                        var selRes = [];
//                        selRes.push({ sele: "Seleccione" });
//                        for (var j = 0; j < selecResp.length; j++) {
//                            selRes.push({ sele: selecResp[j] });
//                        }
//                    } else {
//                        if (infME[i].tipo_respuesta == "EV") {
//                            evResp = infME[i].lista_etiquetas.split(",");
//                            var evRes = [];
//                            for (var l = 0; l < evResp.length; l++) {
//                                evRes.push({ evR: evResp[l] });
//                            }
//                        }
//                    }
//                }
//                griddata.push({
//                    codigo_empresa: infME[i].codigo_empresa,
//                    codigo_sucursal: inforusa.codigo_sucursal,
//                    codigo_agencia: inforusa.codigo_agencia,
//                    anio_vh62: inforusa.anio_vh62,
//                    secuencia_vh65: infME[i].secuencia_vh65,
//                    secuencia_vh62: inforusa.secuencia_vh62,
//                    seccion_formulario: infME[i].seccion_formulario,
//                    pregunta: infME[i].pregunta,
//                    orden_presentacion: infME[i].orden_presentacion,
//                    tipo_formulario: infME[i].tipo_formulario,
//                    tipo_respuesta: infME[i].tipo_respuesta,
//                    lista_respuesta: infME[i].lista_respuesta,
//                    lista_etiquetas: infME[i].lista_etiquetas,
//                    tipo_valor: infME[i].tipo_valor,
//                    selResp: selRes,
//                    sevResp: sevRes,
//                    erResp: erRes,
//                    evResp: evRes,
//                    selRespt: infME[i].selRespt,
//                    sevRespt: infME[i].sevRespt,
//                    erRespt: infME[i].erRespt,
//                    evRespt: infME[i].evRespt,
//                });
//                }
//            } catch (e) {
//                alert("1" + e);
//            }
//            cargatabla(griddata);
//            registroME = "";
//        }
//    } catch (e) {
//        alert("2"+e);
//        return;
//    }
//}

//function ConsultarIVUSA() {
//    try {
//        document.getElementById("divInspeccion").style.display = "none";
//        var respOT = "0";
//        var UrlInspeccion = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;VH;PARTE_MOVIL_USADOS;";
//        var infIV;
//        $.ajax({
//            url: UrlInspeccion,
//            type: "GET",
//            async: false,
//            dataType: "json",
//            success: function (data) {
//                try {
//                    infIV = (JSON.parse(data.ComboParametroEmpGetResult));
//                    respOT = "1";
//                } catch (e) {
//                    return;
//                }
//            },
//            error: function (err) {
//                return;
//            }
//        });
//        if (respOT == "1") {
//            try {
//                var griddataIV = [];
//                tamano = infIV.length;
//                infIV.sort(function myfunction(a, b) {
//                    return (a - b);
//                });
//                var selIV = [];
//                //selIV.push({ sele: "Seleccione" });
//                selIV.push({ sele: "NO" });
//                selIV.push({ sele: "SI" });
//                for (var i = 0; i < infIV.length; i++) {
//                    griddataIV.push({
//                        codigoclase: infIV[i].CodigoClase,
//                        nombreclase: infIV[i].NombreClase,
//                        respuestaclase: "",
//                        selINV: selIV
//                    });
//                }
//                //cargaInspeccion(griddataIV);
//            } catch (e) {
//                alert("1" + e);
//            }
//        }
            
//    } catch (e) {
//        alert("2" + e);
//        return;
//    }
//}

//function ConsultarEMUSA(emvin) {
//    try {
//        var erroresEM = 0;
//        document.getElementById("tablaPrmEMUSA").style.display = "none";
//        document.getElementById("tableEMUSA").style.display = "none";
//        document.getElementById("fecEMUSA").value = "";
//        document.getElementById("kmEMUSA").value = "";
//        var UrlEM = localStorage.getItem("ls_url1").toLocaleString() + "/Services/SL/Sherloc/Sherloc.svc/Mantenimiento/" + "2," + emvin;
//        var inforEMUSA;
//        $.ajax({
//            url: UrlEM,
//            type: "GET",
//            async: false,
//            dataType: "json",
//            success: function (data) {
//                try {
//                    inforEMUSA = (JSON.parse(data.MantenimientoGetResult)).KilometrajeOT;
//                    //alert(inspeccionar(inforEMUSA[0]));
//                } catch (e) {
//                    for (var i = 0; i < 30; i++) {
//                        document.getElementById("cl" + inforEMUSA[i].codigo).style.background = "red";
//                        document.getElementById("cx" + inforEMUSA[i].codigo + "x").style.display = "";
//                        bandera = "rojo";
//                    }
//                    document.getElementById("fecEMUSA").value = "";
//                    document.getElementById("kmEMUSA").value = "";
//                    // Si hay error
//                    erroresEM = 1;
//                    return;
//                }
//            },
//            error: function (err) {
//                alert("1"+err);
//                return;
//            }
//        });
//        if (erroresEM == 0) {
//            for (var i = 0; i < 30; i++) {
//                document.getElementById("cl" + inforEMUSA[i].codigo+"U").style.background = "transparent";
//                document.getElementById("cx" + inforEMUSA[i].codigo + "vU").style.display = "none";
//                document.getElementById("cx" + inforEMUSA[i].codigo + "xU").style.display = "none";
//            }
//            var bandera = "verde";
//            if (inforEMUSA.length > 0) {
//                for (var i = 0; i < inforEMUSA.length; i++) {
//                    if (i < 30) {
//                        if (inforEMUSA[i].validacion == true) {
//                            document.getElementById("cl" + inforEMUSA[i].codigo + "U").style.background = "green";
//                            document.getElementById("cx" + inforEMUSA[i].codigo + "vU").style.display = "";
//                        }
//                        else {
//                            document.getElementById("cl" + inforEMUSA[i].codigo + "U").style.background = "red";
//                            document.getElementById("cx" + inforEMUSA[i].codigo + "xU").style.display = "";
//                            bandera = "rojo";
//                        }
//                    }
//                    if (inforEMUSA[i].ultimo == true) {
//                        document.getElementById("fecEMUSA").value = inforEMUSA[i].fecha_kilometraje;
//                        document.getElementById("kmEMUSA").value = inforEMUSA[i].kilometraje;
//                        break;
//                    }
//                }
//                document.getElementById("tablaPrmEMUSA").style.display = "block";
//                document.getElementById("tableEMUSA").style.display = "block";
//            }
//        }
//    } catch (e) {
//        alert("2"+e);
//        return;
//    }
//}

//// END_CUSTOM_CODE */
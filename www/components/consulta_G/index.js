var respG = "Error";
var respimagenG;
var validaServiciosG = 1;
var inforModelosG = "";
var tamanoG = "";
var dataRespuestaG;
app.consultaG = kendo.observable({
    onShow: function () {
        try {
            kendo.ui.progress($("#consultaGScreen"), true);
            document.getElementById("tabstripUsaG").style.display = "none";
            registroG = JSON.parse(localStorage.getItem("registroGe"));
            if (localStorage.getItem("ls_verRecepcion").toLocaleString() == "0") {
                //marcas
                marcaVheUsaG(localStorage.getItem("ls_verRecepcion").toLocaleString());
                //modelo
                cboModeloVheUsaG(document.getElementById("marcasUsaG").value, "A4");
                //color
                cboColoresUsaG("AZUL");
                //Ubicacion
                cboUbicacionUsaG("ORELLANA");
                //transmision
                cbogenericoCG(localStorage.getItem("ls_idempresa").toLocaleString(),"VH","transmision","transmisionCG2","","dbotransmisionCG");
                //traccion
                cbogenericoCG(localStorage.getItem("ls_idempresa").toLocaleString(),"VH","tipo_traccion","traccionnCG2","","dboTraccionCG");
                //subclase
                cbogenericoCG(localStorage.getItem("ls_idempresa").toLocaleString(),"IN","subclase_auto","subclaseCG2","","dboCarroceriaCG");
                //grupo auto
                cbogenericoCG(localStorage.getItem("ls_idempresa").toLocaleString(),"IN","clase_auto","claseCG2","","dboClaseCG");
                //combustible
                cbogenericoCG(localStorage.getItem("ls_idempresa").toLocaleString(),"VH","tipo_combustible","combustibleCG2","","dboCombustibleCG");

            }
            else {
                localStorage.setItem("ls_verRecepcion", "0");
            }
            llamarUSADG(registroG.placa);
            llamarColorTexto(".w3-text-red");
            llamarNuevoestilo("lydCG");
            //desactivaTabla(true);
            //kendo.ui.progress($("#consultaGScreen"), false);
        } catch (e) {
            alert("1"+e);
            //kendo.ui.progress($("#consultaGScreen"), false);
        }
    },
    afterShow: function () { }
});
app.localization.registerView('consultaG');

function marcaVheUsaG(selMarca) {
    try {
        var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;IN;MARCAS;";
        //"http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;IN;MARCAS;"
        var inforMarca;
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
            var cboMarcaHTML = "<p><select id='marcasUsaG' onchange='cboModeloVheUsa(this.value)' class='w3-input w3-border textos'>";
            for (var i = 0; i < inforMarca.length; i++) {
                if (selMarca == inforMarca[i].CodigoClase) {
                    cboMarcaHTML += "<option  value='" + inforMarca[i].CodigoClase + "' selected>" + inforMarca[i].NombreClase + "</option>";
                }
                else {
                    cboMarcaHTML += "<option  value='" + inforMarca[i].CodigoClase + "'>" + inforMarca[i].NombreClase + "</option>";
                }
            }
            cboMarcaHTML += "</select>";
            document.getElementById("divcbomarcasUsaG").innerHTML = cboMarcaHTML;
        }
        else {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Marcas");
        }
    } catch (e) {
        alert("marca" + e);
    }
}
function cboModeloVheUsaG(itmMarca, selModelo) {
    try {
        if (itmMarca != "") {
            var UrlCboModelos = localStorage.getItem("ls_url2").toLocaleString() + "/Services/in/Inventarios.svc/in11ModelosGet/1,1;" + itmMarca;
            //"http://186.71.21.170:8077/taller/Services/in/Inventarios.svc/in11ModelosGet/1,1;" + itmMarca;
            inforModelosG = "";
            $.ajax({
                url: UrlCboModelos,
                type: "GET",
                dataType: "json",
                async: false,
                success: function (data) {
                    try {
                        inforModelosG = JSON.parse(data.in11ModelosGetResult);
                    } catch (e) {
                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Modelos");
                        return;
                    }
                },
                error: function (err) {
                    alert(err);
                    return;
                }
            });
            if (inforModelosG.length > 0) {
                cboModelosHTML = "<p><select id='modeloUsaG' onchange='cboDescVheUsa(this.value)' class='w3-input w3-border textos'>";
                var banDescr = 0;
                for (var i = 0; i < inforModelosG.length; i++) {
                    if (inforModelosG[i].CodigoClase != " " || inforModelosG[i].CodigoClase != "ninguna") {
                        if (selModelo == inforModelosG[i].CodigoClase) {
                            cboModelosHTML += "<option  value='" + inforModelosG[i].CodigoClase + "' selected>" + inforModelosG[i].CodigoClase + " (" + inforModelosG[i].NombreClase + ")" + "</option>";
                            document.getElementById("desmodeloUsaG").value = inforModelosG[i].NombreClase;
                            banDescr = 1;
                        }
                        else {
                            cboModelosHTML += "<option  value='" + inforModelosG[i].CodigoClase + "'>" + inforModelosG[i].CodigoClase + " (" + inforModelosG[i].NombreClase + ")" + "</option>";
                        }
                    }
                }
                cboModelosHTML += "</select>";
            }
            else {
                cboModelosHTML = "<p><select id='modeloUsaG' class='w3-input w3-border textos'>";
                cboModelosHTML += "<option  value=' '>Ninguna</option>";
                cboModelosHTML += "</select>";
            }
        }
        document.getElementById("divcboModeloUsaG").innerHTML = cboModelosHTML;
        if (selModelo === undefined) {
            if (inforModelos.length === 1) {
                document.getElementById("desmodeloUsaG").value = inforModelosG[0].NombreClase;
            } else {
                document.getElementById("desmodeloUsaG").value = "";
            }
        }
    } catch (e) {
        alert("modelo" + e);
    }
}
function cboColoresUsaG(selColor) {
    try {
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
            var cboColorHTML = "<p><select id='ColorUsaG' class='w3-input w3-border textos'>";
            for (var i = 0; i < inforColor.length; i++) {
                if (selColor == inforColor[i].CodigoClase) {
                    cboColorHTML += "<option  value='" + inforColor[i].CodigoClase + "' selected>" + inforColor[i].NombreClase + "</option>";
                }
                else {
                    cboColorHTML += "<option  value='" + inforColor[i].CodigoClase + "'>" + inforColor[i].NombreClase + "</option>";
                }
            }
            cboColorHTML += "</select>";
            document.getElementById("divcboColorUsaG").innerHTML = cboColorHTML;
        }
        else {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Color");
        }
    } catch (e) {
        alert("colores" + e);
    }
}
function listaVinG(strVIN) {
    try {
        document.getElementById("gridVINUsaG").innerHTML = "";
        strVIN = strVIN.replace('*', ' ').trim();
        if (strVIN.length < 8) {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Ingrese m&iacute;nimo 8 caracteres");
            return;
        }
        // var UrlVIN = "http://200.31.10.92:8092/appk_aekia/Services/VH/Vehiculos.svc/vh01VehiculosGet/1,JSON;;;;;10039;";
        var UrlVIN = localStorage.getItem("ls_url1").toLocaleString() + "/Services/VH/Vehiculos.svc/vh01VehiculosGet/1,JSON;;;;;" + strVIN + ";";
        var infVINResp = "";
        $.ajax({
            url: UrlVIN,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (data) {
                try {
                    infVINResp = (JSON.parse(data.vh01VehiculosGetResult)).tvh01;
                } catch (e) {
                    //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", e);
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No se han encontrado registros");
                    return;
                }
            },
            error: function (err) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", err);
                return;
            }
        });
        if (infVINResp.length > 0) {
            var obs = (screen.width * 20) / 100;
            var fecha = (screen.width * 40) / 100;
            $("#gridVINUsaG").kendoGrid({
                dataSource: {
                    data: infVINResp,
                    pageSize: 20
                },
                // height: 400,
                scrollable: false,
                pageable: {
                    input: true,
                    numeric: false
                },
                columns: [
                    {title: "", width: obs,
                        command: [{
                            name: "obs",
                            text: " ",
                            imageClass: "fa fa-search-plus",
                            visible: function (dataItem) { return dataItem.chasis != "0," },
                            click: function (e) {
                                try {
                                    e.preventDefault();
                                    var tr = $(e.target).closest('tr');
                                    var dataItem = this.dataItem(tr);
                                    kendo.ui.progress($("#consultaGScreen"), true);
                                    setTimeout(function () {
                                        TraerInformacionUsadG(dataItem.chasis, "C");
                                    }, 2000);

                                } catch (f) {
                                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No se han encontrado registros");
                                    return;
                                    //alert(f);
                                }
                            }
                        }],
                    },

                    { field: "chasis", title: "VIN", width: fecha },
                    { field: "nombre_propietario", title: "Propietario", width: fecha },
                    //{ field: "placa", title: "Placa", width: obs}
                ]
            });
            document.getElementById("gridVINUsaG").style.display = "block";
        }
        kendo.ui.progress($("#consultaGScreen"), false);
    } catch (e) {
        alert("lista" + e);
    }
    kendo.ui.progress($("#consultaGScreen"), false);
}
function cboUbicacionUsaG(selUbica) {
    try {
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
            var cboUbicaHTML = "<p><select id='UbicaUsaG' class='w3-input w3-border textos'>";
            for (var i = 0; i < inforUbica.length; i++) {
                if (selUbica == inforUbica[i].CodigoClase) {
                    cboUbicaHTML += "<option  value='" + inforUbica[i].CodigoClase + "' selected>" + inforUbica[i].NombreClase + "</option>";
                }
                else {
                    cboUbicaHTML += "<option  value='" + inforUbica[i].CodigoClase + "'>" + inforUbica[i].NombreClase + "</option>";
                }
            }
            cboUbicaHTML += "</select>";
            document.getElementById("divcboUbicaUsaG").innerHTML = cboUbicaHTML;
        }
        else {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Ubicaci?n");
        }
    } catch (e) {
        alert("ubica" + e);
    }
}
function llamarUSADG(placaVIN) {
    try {
        //vaciaCamposUsaG();
        kendo.ui.progress($("#consultaGScreen"), true);
        setTimeout(function () {
            buscaPlacaUsaG(placaVIN);
            //desactivaTablaG(true);
        }, 2000);
    } catch (e) {
        alert("llama" + e);
    }
}
function buscaPlacaUsaG(placaVIN) {
    try {
        document.getElementById("tabstripUsaG").style.display = "none";
        if (placaVIN != "") {
            if (placaVIN.includes("*") == true) {
                listaVinG(placaVIN);
            } else {
                if (placaVIN.length > 8) {
                    var patron = /^\d*$/;
                    if (patron.test(placaVIN)) {
                        TraerInformacionUsadG(placaVIN, "O");
                    }
                    else {
                        TraerInformacionUsadG(placaVIN, "C");
                    }
                }
                else {
                    TraerInformacionUsadG(placaVIN, "P");
                }
            }
        }
        else {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Ingrese la Placa o VIN");
        }
        kendo.ui.progress($("#consultaGScreen"), false);
    } catch (e1) {
        alert("buscaVin  " + e1);
    }
}
function TraerInformacionUsadG(responseText, tipo) {
   //alert(responseText + "  " + tipo);
    try {
        var inforUsa;
        var tabstripUsa = $("#tabstripUsaG").kendoTabStrip().data("kendoTabStrip");
        tabstripUsa.select(0);
        document.getElementById("divOtEstadoG").innerHTML = "";
        document.getElementById('gridVINUsaG').innerHTML = "";
        var intResult = "";
        if (tipo == "P") {
            //var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh62VinUsadoGet/4,json;" + localStorage.getItem("ls_idempresa").toLocaleString() + ";" + localStorage.getItem("ls_ussucursal").toLocaleString() + ";" + localStorage.getItem("ls_usagencia").toLocaleString() + ";" + responseText + ";";
            var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/vh/Vehiculos.svc/vh62VinUsadoGet/8,json;" +
                localStorage.getItem("ls_idempresa").toLocaleString() + ";" + registroG.codigo_sucursal/* localStorage.getItem("ls_ussucursal").toLocaleString() */ + ";" +
                registroG.codigo_agencia /* localStorage.getItem("ls_usagencia").toLocaleString() */ + ";" + responseText + ";;" + localStorage.getItem("ls_usulog").toLocaleString() +
                ";;;"+registroG.anio_vh62+";"+registroG.secuencia_vh62+";;;;";
        } else {
            //var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh62VinUsadoGet/4,json;" + localStorage.getItem("ls_idempresa").toLocaleString() + ";" + localStorage.getItem("ls_ussucursal").toLocaleString() + ";" + localStorage.getItem("ls_usagencia").toLocaleString() + ";;" + responseText + ";";
            var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/vh/Vehiculos.svc/vh62VinUsadoGet/8,json;" +
               localStorage.getItem("ls_idempresa").toLocaleString() + ";" + registroG.codigo_sucursal /* localStorage.getItem("ls_ussucursal").toLocaleString() */ + ";" +
               registroG.codigo_agencia /* localStorage.getItem("ls_usagencia").toLocaleString() */ + ";;" + responseText + ";" + localStorage.getItem("ls_usulog").toLocaleString() +
               ";;;"+registroG.anio_vh62+";"+registroG.secuencia_vh62+";;;;";
        }
        //if (tipo == "P") {
        //    var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh62VinUsadoGet/4,json;" + localStorage.getItem("ls_idempresa").toLocaleString() + ";" + localStorage.getItem("ls_ussucursal").toLocaleString() + ";" + localStorage.getItem("ls_usagencia").toLocaleString() + ";" + responseText + ";";
        //} else {
        //    var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh62VinUsadoGet/4,json;" + localStorage.getItem("ls_idempresa").toLocaleString() + ";" + localStorage.getItem("ls_ussucursal").toLocaleString() + ";" + localStorage.getItem("ls_usagencia").toLocaleString() + ";;" + responseText + ";";
        //}
        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", Url);
        $.ajax({
            url: Url,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                   if (data.vh62VinUsadoGetResult.substr(0,1)=="0") {
                        alert(data.vh62VinUsadoGetResult.substr(2,data.vh62VinUsadoGetResult.length));
                        inforUsa=null;                       
                   } else {
                    inforUsa = (JSON.parse(data.vh62VinUsadoGetResult)).tvh62[0];
                    //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", inspeccionar(inforUsa));
                   }
                } catch (e) {
                    recurrenteOT = 1;
                }
            },
            error: function (err) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso. Int\u00E9ntelo nuevamente.");
                return;
            }
        });
        if (inforUsa != null) {
            try {
                document.getElementById("placaUsaG").value = inforUsa.placa;
                document.getElementById("chasisUsaG").value = inforUsa.chasis;
                document.getElementById("motorUsaG").value = inforUsa.numero_motor;
                document.getElementById("kilometrosUsaG").value = inforUsa.kilometraje;
                marcaVheUsaG(inforUsa.codigo_marca);
                cboModeloVheUsaG(inforUsa.codigo_marca, inforUsa.codigo_modelo);
                document.getElementById("anio_modeloUsaG").value = inforUsa.anio_modelo;
                cboColoresUsaG(inforUsa.color_vehiculo);
                document.getElementById("cilindrajeUsaG").value = inforUsa.cilindraje;
                document.getElementById("anio_vh62UsaG").value = inforUsa.anio_vh62;
                document.getElementById("secuenciaUsaG").value = inforUsa.secuencia_vh62;
                document.getElementById("estadoUsaG").value = inforUsa.estado;
                document.getElementById("anio_matriculaUsaG").value = inforUsa.anio_matricula;
                document.getElementById("cilindrajeUsaG").value = inforUsa.cilindraje;
                //transmision
                cbogenericoCG(localStorage.getItem("ls_idempresa").toLocaleString(),"VH","transmision","transmisionCG2",inforUsa.tipo_transmision,"dbotransmisionCG");
                //traccion
                cbogenericoCG(localStorage.getItem("ls_idempresa").toLocaleString(),"VH","tipo_traccion","traccionnCG2",inforUsa.codigo_traccion,"dboTraccionCG");
                //subclase
                cbogenericoCG(localStorage.getItem("ls_idempresa").toLocaleString(),"IN","subclase_auto","subclaseCG2",inforUsa.subclase_auto,"dboCarroceriaCG");
                //grupo auto
                cbogenericoCG(localStorage.getItem("ls_idempresa").toLocaleString(),"IN","clase_auto","claseCG2",inforUsa.clase_auto,"dboClaseCG");
                //combustible
                cbogenericoCG(localStorage.getItem("ls_idempresa").toLocaleString(),"VH","tipo_combustible","combustibleCG2",inforUsa.tipo_combustible,"dboCombustibleCG");
                document.getElementById("observacionUG").value = inforUsa.observacion_certificacion;
                cboUbicacionUsaG(inforUsa.ubicacion_fisica);
                document.getElementById("fecha_recepcionUsaG").value = inforUsa.fecha_registro;
                //document.getElementById("btnGuardaInfoUsa").innerHTML = " <button onclick='GuardarDatosCVUsa();' class='w3-btn w3-red'>MODIFICAR</button>" + "  " + "<button onclick='vaciaCamposUsa();' class='w3-btn w3-red'>NUEVO</button>" + "  " + "<button onclick='cambiarestado();' class='w3-btn w3-red'>CAMBIA ESTADO</button>";
                ConsultarEMUSAG(inforUsa.chasis);
                ConsultarMEUSAG(inforUsa);
                //ConsultarIVUSA();
                //desactivaTablaG(true);
                kendo.ui.progress($("#consultaGScreen"), false);

                //if (validaServiciosG > 0) {
                //    document.getElementById("vehiculoUsaG").style.display = 'block';
                document.getElementById("tabstripUsaG").style.display = 'initial';
                //}
                document.getElementById("marcasUsaG").disabled = true;
                document.getElementById("modeloUsaG").disabled = true;
                document.getElementById("ColorUsaG").disabled = true;
                document.getElementById("UbicaUsaG").disabled = true;
                document.getElementById("observacionUG").disabled = true;
                document.getElementById("claseCG2").disabled = true;
                document.getElementById("subclaseCG2").disabled = true;
                document.getElementById("combustibleCG2").disabled = true;
                document.getElementById("traccionnCG2").disabled = true;
                document.getElementById("transmisionCG2").disabled = true;

                //desactivaTablaG(true);
            } catch (e2) {
                alert("e2" + e2);
            }
        }
    } catch (e1) {
        alert("2"+e1);
    }
}

// vehiculos
function cbogenericoCG(emp,tipo,tipovh,tipoID,seltipo,nombreTipo) {
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

function ConsultarEMUSAG(emvin) {
    try {
        var erroresEM = 0;
        document.getElementById("tablaPrmEMUSAG").style.display = "none";
        document.getElementById("tableEMUSAG").style.display = "none";
        document.getElementById("fecEMUSAG").value = "";
        document.getElementById("kmEMUSAG").value = "";
        var UrlEM = localStorage.getItem("ls_url1").toLocaleString() + "/Services/SL/Sherloc/Sherloc.svc/Mantenimiento/" + "2," + emvin;
        
        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", UrlEM);
        var inforEMUSA;
        $.ajax({
            url: UrlEM,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    //alert(("c1" + data.MantenimientoGetResult));
                    if (data.MantenimientoGetResult.substr(0,1)  == "0") {
                        erroresEM = 1;
                        //alert(data.MantenimientoGetResult.substr(2, (data.MantenimientoGetResult.length -2)))
                    } else {
                        inforEMUSA = (JSON.parse(data.MantenimientoGetResult)).KilometrajeOT;
                    }
                                        
                } catch (e) {
                    alert(e);
                    for (var i = 0; i < 30; i++) {
                        document.getElementById("cl" + inforEMUSA[i].codigo).style.background = "red";
                        document.getElementById("cx" + inforEMUSA[i].codigo + "x").style.display = "";
                        bandera = "rojo";
                    }
                    document.getElementById("fecEMUSAG").value = "";
                    document.getElementById("kmEMUSAG").value = "";
                    // Si hay error
                    erroresEM = 1;
                    return;
                }
            },
            error: function (err) {
                alert("1" + err);
                return;
            }
        });
        
        if (erroresEM == 0) {
            //for (var i = 0; i < 30; i++) {
            //    document.getElementById("cl" + inforEMUSA[i].codigo + "U").style.background = "transparent";
            //    document.getElementById("cx" + inforEMUSA[i].codigo + "vU").style.display = "none";
            //    document.getElementById("cx" + inforEMUSA[i].codigo + "xU").style.display = "none";
            //}
            var bandera = "verde";
            if (inforEMUSA.length > 0) {
                for (var i = 0; i < inforEMUSA.length; i++) {
                    if (i < 30) {
                        if (inforEMUSA[i].validacion == true) {
                            document.getElementById("Gl" + inforEMUSA[i].codigo + "U").style.background = "green";
                            document.getElementById("Gx" + inforEMUSA[i].codigo + "vU").style.display = "block";
                        }
                        else {
                            document.getElementById("Gl" + inforEMUSA[i].codigo + "U").style.background = "red";
                            document.getElementById("Gx" + inforEMUSA[i].codigo + "xU").style.display = "block";
                            bandera = "rojo";
                        }
                    }
                    if (inforEMUSA[i].ultimo == true) {
                        document.getElementById("fecEMUSAG").value = inforEMUSA[i].fecha_kilometraje;
                        document.getElementById("kmEMUSAG").value = inforEMUSA[i].kilometraje;
                        break;
                    }
                }
                document.getElementById("tablaPrmEMUSAG").style.display = "block";
                document.getElementById("tableEMUSAG").style.display = "block";
            }
        }
    } catch (e) {
        alert("3" + e);
        return;
    }
}
function ConsultarMEUSAG(inforusa) {
    try {
        var respOT = "0";
        //var UrlMotorEscape = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh65PreguntasAvaluoGet/1,json;" + inforusa.codigo_empresa + ";" + inforusa.tipo_formulario + ";;;" + inforusa.codigo_sucursal + ";" +
        //    inforusa.codigo_agencia + ";" + inforusa.anio_vh62 + ";" + inforusa.secuencia_vh62;//"/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;VH;PARTE_MOTOR_USADOS;";
        var UrlMotorEscape = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh64PreguntasAvaluoGet/1,json;" +
            inforusa.codigo_empresa + ";" + inforusa.codigo_sucursal + ";" + inforusa.codigo_agencia + ";" + inforusa.anio_vh62 + ";" +
            inforusa.secuencia_vh62 + ";" + inforusa.tipo_formulario + ";;;;;;";
        var infME;
        $.ajax({
            url: UrlMotorEscape,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    infME = (JSON.parse(data.vh64PreguntasAvaluoGetResult)).tvh64;
                    //infME = (JSON.parse(data.vh65PreguntasAvaluoGetResult)).otro_tvh65;   //(JSON.parse(data.ComboParametroEmpGetResult));
                    respOT = "1";
                } catch (e) {
                    return;
                }
            },
            error: function (err) {
                return;
            }
        });
        if (respOT == "1") {
            try {
                var griddata = [];
                tamano = infME.length;
                for (var t = 0; t < infME.length; t++) {
                    if (infME[t].orden_presentacion < 10) {
                        infME[t].orden_presentacion = "0" + infME[t].orden_presentacion;
                    }
                }

                infME.sort(function myfunction(a, b) {
                    return (a.corden_seccion + "" + a.orden_presentacion) - (b.corden_seccion + "" + b.orden_presentacion)
                });
                for (var i = 0; i < infME.length; i++) {
                    var selecResp = new Array();
                    var sevResp = new Array();
                    var erResp = new Array();
                    var evResp = new Array();
                    if (infME[i].tipo_respuesta == "SELECCION" || infME[i].tipo_respuesta == "SEV") {
                        if (infME[i].tipo_respuesta == "SEV") {
                            sevResp = infME[i].lista_etiquetas.split(",");
                            var sevRes = [];
                            for (var k = 0; k < sevResp.length; k++) {
                                sevRes.push({ sevR: sevResp[k] });
                            }
                        }
                        selecResp = infME[i].lista_respuesta.split(",");
                        var selRes = [];
                        selRes.push({ sele: "Seleccione" });
                        for (var j = 0; j < selecResp.length; j++) {
                            selRes.push({ sele: selecResp[j] });
                        }
                    } else {
                        if (infME[i].tipo_respuesta == "ER") {
                            erResp = infME[i].lista_etiquetas.split(",");
                            var erRes = [];
                            for (var l = 0; l < erResp.length; l++) {
                                erRes.push({ erR: erResp[l] });
                            }
                            selecResp = infME[i].lista_respuesta.split(",");
                            var selRes = [];
                            selRes.push({ sele: "Seleccione" });
                            for (var j = 0; j < selecResp.length; j++) {
                                selRes.push({ sele: selecResp[j] });
                            }
                        } else {
                            if (infME[i].tipo_respuesta == "EV") {
                                evResp = infME[i].lista_etiquetas.split(",");
                                var evRes = [];
                                for (var l = 0; l < evResp.length; l++) {
                                    evRes.push({ evR: evResp[l] });
                                }
                            }
                        }
                    }
                    griddata.push({
                        codigo_empresa: infME[i].codigo_empresa,
                        codigo_sucursal: inforusa.codigo_sucursal,
                        codigo_agencia: inforusa.codigo_agencia,
                        anio_vh62: inforusa.anio_vh62,
                        secuencia_vh65: infME[i].secuencia_vh65,
                        secuencia_vh62: inforusa.secuencia_vh62,
                        seccion_formulario: infME[i].seccion_formulario,
                        pregunta: infME[i].pregunta,
                        orden_presentacion: infME[i].orden_presentacion,
                        tipo_formulario: infME[i].tipo_formulario,
                        tipo_respuesta: infME[i].tipo_respuesta,
                        lista_respuesta: infME[i].lista_respuesta,
                        lista_etiquetas: infME[i].lista_etiquetas,
                        tipo_valor: infME[i].tipo_valor,
                        selResp: selRes,
                        sevResp: sevRes,
                        erResp: erRes,
                        evResp: evRes,
                        selRespt: infME[i].selRespt,
                        sevRespt: infME[i].sevRespt,
                        erRespt: infME[i].erRespt,
                        evRespt: infME[i].evRespt,
                    });
                }
            } catch (e) {
                alert("4" + e);
            }
            cargatablaG(griddata);
            localStorage.setItem("dataRespuestaG", JSON.stringify(griddata));
            registroME = "";
        }
    } catch (e) {
        alert("5" + e);
        return;
    }
}
function cargatablaG(griddata1) {
    try {
        document.getElementById("divOtEstadoG").innerHTML = "";
        dataRespuestaG = "";
        var tablaOT = "";
        tablaOT = "<table BORDER CELLPADDING=10 CELLSPACING=10 id='docume'>";
        var cuerpo;
        tablaOT += "<tr align='center' style='background-color:#000000'><td></td><td><label style='font-weight:bold; font-size:13px;color:#ffffff'>B=BUENO   R=REGULAR   M=MALO</label></td><td></td></tr>"
        for (var i = 0; i < griddata1.length; i++) {
            var seccionFor = griddata1[i].seccion_formulario;
            tablaOT += "<tr style='background-color:#000000'><td align='center' style='width: 50%;'><label style='font-weight:bold; font-size:13px;color:#ffffff'>" + griddata1[i].seccion_formulario + "</label></td><td style='width: 25%;'></td><td style='width: 25%;'></td></tr>";
            while (griddata1[i].seccion_formulario == seccionFor) {
                var tipoUsa = "";
                if (griddata1[i].tipo_valor == "NUMERICO") {
                    tipoUsa = "number";
                } else {
                    tipoUsa = "text";
                }
                tablaOT += "<tr><td>" + griddata1[i].orden_presentacion + "&nbsp;&nbsp;<label class='w3-text-black' style='font-weight:bold; font-size:13px'>" + griddata1[i].pregunta + "</label></td>";
                if (griddata1[i].tipo_respuesta == "SELECCION" || griddata1[i].tipo_respuesta == "SEV") {
                    var sevUsa = "<td><table style='width: 100%;'><tr>";
                    if (griddata1[i].tipo_respuesta == "SEV") {
                        var valorsev = griddata1[i].sevRespt.split(',');
                        for (var l = 0; l < griddata1[i].sevResp.length; l++) {
                            sevUsa += "<td><p><input id=SEV" + i + "" + l + " type='" + tipoUsa + "' style='width:100%' placeholder=" + (l + 1) + " value=" + valorsev[l] + "></p></td>";
                        }
                        //alert(sevUsa);
                    }
                    sevUsa += "</tr></table></td>";
                    var selUsa = seleccionUSA(griddata1[i].selResp, i, griddata1[i].selRespt);
                    tablaOT += sevUsa + "<td>" + selUsa + "</td>";
                } else {
                    if (griddata1[i].tipo_respuesta == "ER") {
                        var sevUsa = "<td><table style='width: 100%;'><tr>";
                        var valorer = griddata1[i].erRespt.split(',');
                        for (var l = 0; l < griddata1[i].erResp.length; l++) {
                            sevUsa += "<td><p><input id=ER" + i + "" + l + " type='text' size='2' placeholder=" + griddata1[i].erResp[l].erR + " value=" + valorer[l] + "></p></td>";
                        }
                        //alert(sevUsa);
                        sevUsa += "</tr></table></td>";
                        var selUsa = seleccionUSA(griddata1[i].selResp, i, griddata1[i].selRespt);
                        tablaOT += sevUsa + "<td>" + selUsa + "</td>";
                    } else {
                        if (griddata1[i].tipo_respuesta == "EV") {
                            var sevUsa = "<td><table style='width: 100%;'><tr>";
                            var valorev = griddata1[i].evRespt.split(',');
                            for (var l = 0; l < griddata1[i].evResp.length; l++) {
                                sevUsa += "<td><p><input id=EV" + i + "" + l + " type='text' size='2' placeholder=" + griddata1[i].evResp[l].evR + " value=" + valorev[l] + "></p></td>";
                            }
                            sevUsa += "</tr></table></td>";
                            tablaOT += sevUsa + "<td></td>";
                        }
                    }
                }
                tablaOT += "</tr>";
                i++;
                if (i == tamano) {
                    break;
                }
            }
            i--;
        }
        tablaOT += "</table>";
        document.getElementById("divOtEstadoG").innerHTML = " ";
        document.getElementById("divOtEstadoG").innerHTML = tablaOT;
        document.getElementById("divOtEstadoG").style.display = 'block';
        dataRespuestaG = griddata1;
    } catch (e) {
        alert("carga" + e);
    }
}
function seleccionUSAG(sele1, i, sele2) {
    try {
        var cboMarcaHTML = "<p><select id='" + "SEL" + i + "'class='w3-input w3-border textos'>";
        for (var k = 0; k < sele1.length; k++) {
            if (sele2 == sele1[k].sele) {
                cboMarcaHTML += "<option  value='" + sele1[k].sele + "' selected>" + sele1[k].sele + "</option>";
            }
            else {
                cboMarcaHTML += "<option  value='" + sele1[k].sele + "'>" + sele1[k].sele + "</option>";
            }
        }
        cboMarcaHTML += "</select></p>";
        return cboMarcaHTML;
    } catch (e) {
        alert("selec" + e);
    }
}
function ConsultarIVUSAG() {
    try {
        document.getElementById("divInspeccionG").style.display = "none";
        var respOT = "0";
        var UrlInspeccion = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;VH;PARTE_MOVIL_USADOS;";
        var infIV;
        $.ajax({
            url: UrlInspeccion,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    infIV = (JSON.parse(data.ComboParametroEmpGetResult));
                    respOT = "1";
                } catch (e) {
                    return;
                }
            },
            error: function (err) {
                return;
            }
        });
        if (respOT == "1") {
            try {
                var griddataIV = [];
                tamanoG = infIV.length;
                infIV.sort(function myfunction(a, b) {
                    return (a - b);
                });
                var selIV = [];
                //selIV.push({ sele: "Seleccione" });
                selIV.push({ sele: "NO" });
                selIV.push({ sele: "SI" });
                for (var i = 0; i < infIV.length; i++) {
                    griddataIV.push({
                        codigoclase: infIV[i].CodigoClase,
                        nombreclase: infIV[i].NombreClase,
                        respuestaclase: "",
                        selINV: selIV
                    });
                }
                cargaInspeccionG(griddataIV);
            } catch (e) {
                alert("1" + e);
            }
        }

    } catch (e) {
        alert("6" + e);
        return;
    }
}
function desactivaTablaG(sn) {
    try {
        dataRespuestaG = JSON.parse(localStorage.getItem("dataRespuestaG"));
        alert("0");
        alert(dataRespuestaG[i].tipo_respuesta);
        alert(dataRespuestaG);
        alert("1");
        for (var i = 0; i < dataRespuestaG.length; i++) {
            if (dataRespuestaG[i].tipo_respuesta == "SELECCION" || dataRespuestaG[i].tipo_respuesta == "SEV") {
                if (dataRespuestaG[i].tipo_respuesta == "SEV") {
                    alert(dataRespuestaG[i].sevResp.length);
                    for (var l = 0; l < dataRespuestaG[i].sevResp.length; l++) {
                        if (document.getElementById("SEV" + i + "" + l) != null) {
                            document.getElementById("SEV" + i + "" + l).disabled = sn;
                        }
                    }
                }
                document.getElementById("SEL" + i).disabled = sn;
            }
            if (dataRespuestaG[i].tipo_respuesta == "ER") {
                alert(dataRespuestaG[i].erResp.length);
                for (var k = 0; k < dataRespuestaG[i].erResp.length; k++) {
                    if (document.getElementById("ER" + i + "" + k) != null) {
                        document.getElementById("ER" + i + "" + k).disabled = sn;
                    }
                }
                document.getElementById("SEL" + i).disabled = sn;
            }
            if (dataRespuestaG[i].tipo_respuesta == "EV") {
                alert(dataRespuestaG[i].evResp.length);
                for (var m = 0; m < dataRespuestaG[i].evResp.length; m++) {
                    if (document.getElementById("EV" + i + "" + m) != null) {
                        document.getElementById("EV" + i + "" + m).disabled = sn;
                    }
                }
            }
        }
    } catch (e) { alert("t"+e); }
}
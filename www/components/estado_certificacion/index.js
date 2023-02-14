app.est_certifica = kendo.observable({
    onShow: function () {
        try {
            var tabstripUsa = $("#tabstripUsaCE").kendoTabStrip().data("kendoTabStrip");
            tabstripUsa.select(0);
            kendo.ui.progress($("#est_certificaScreen"), false);
            document.getElementById("valorA").value = 0;
            var arrTipAva = ["SEMINUEVO", "TRADE IN", "NO CONVIENE", "CPO"];
            // Cbo. Tipo avaluo
            cboaTipoAvaluo("taval", arrTipAva, arrTipAva[0], "divcbotaval");
            //transmision
            cbogenericoEC(localStorage.getItem("ls_idempresa").toLocaleString(),"VH","transmision","transmisionEC2","","dbotransmisionEC");
            //traccion
            cbogenericoEC(localStorage.getItem("ls_idempresa").toLocaleString(),"VH","tipo_traccion","traccionnEC2","","dboTraccionEC");
            //subclase
            cbogenericoEC(localStorage.getItem("ls_idempresa").toLocaleString(),"IN","subclase_auto","subclaseEC2","","dboCarroceriaEC");
            //grupo auto
            cbogenericoEC(localStorage.getItem("ls_idempresa").toLocaleString(),"IN","clase_auto","claseEC2","","dboClaseEC");
            //combustible
            cbogenericoEC(localStorage.getItem("ls_idempresa").toLocaleString(),"VH","tipo_combustible","combustibleEC2","","dboCombustibleEC");

            cboUbicacionEC("");
            //alert(registroavaluo.placa);
            llamarUSADCE(registroavaluo.placa);
            
            document.getElementById("btnGuardaInfoAVA").innerHTML = " <button id='btnGuardarAvaluo0' onclick='GardarDatosAVA();' class='w3-btn'>GUARDAR</button>";
            llamarColorTexto(".w3-text-red");
            llamarNuevoestilo("btnGuardarAvaluo");
            llamarNuevoestilo("lydDC");
        } catch (e) {
            alert("1" + e);
        }
    },
    afterShow: function () { }
});
app.localization.registerView('est_certifica');

function cboaTipoAvaluo(idCombo, arrCombo, selItem, divCombo) {
    //alert(selItem);
    var cboAgenciaHTML = "<p><select id='" + idCombo + "' class='w3-input w3-border textos' onchange='tipoDeAvaluo(this.value)' readonly>";
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
function GardarDatosAVA() {
    try {
        if (document.getElementById("observacionA").value=="") {
            alert("Certificación Certificacion esta en blanco, llenar por favor");
            return;
        } else {
            if (document.getElementById("valorA").value =="" && document.getElementById("taval").value != "NO CONVIENE") {
                alert("Valor esta en blanco, llenar por favor");
                return;
            }
        }
        if (document.getElementById("taval").value == "NO CONVIENE") {
            document.getElementById("valorA").value = 0;
        }
        //http://192.168.1.50:8089/concesionario/Services/VH/Vehiculos.svc/vh62VinUsadoGet/6,json;1;01;01;;;;;;2017;1;PENDIENTE
        var urlEstado = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh62VinUsadoGet/7,json;" + registroavaluo.codigo_empresa +
            ";" + registroavaluo.codigo_sucursal + ";" + registroavaluo.codigo_agencia + ";;;"+localStorage.getItem("ls_usulog").toLocaleString()+";;;" + registroavaluo.anio_vh62 + ";" +
            registroavaluo.secuencia_vh62 + ";FINALIZADO;" + document.getElementById("taval").value + ";" + document.getElementById("observacionA").value +
            ";" + document.getElementById("valorA").value + ";"
        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", urlEstado);
        var inforEst;
        
        $.ajax({
            url: urlEstado,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    inforEst = data.vh62VinUsadoGetResult;
                    if (inforEst.substr(0, 1) == "1") {
                        alert("se actualizaron los datos");
                        kendo.ui.progress($("#est_certificaScreen"), true);
                        setTimeout(function () {
                            kendo.mobile.application.navigate("components/certificacion_vehiculo/view.html");
                            // window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", dataItem.observacion);
                        }, 2000);
                        return;
                    } else { alert(inforEst.substr(2, inforEst.length - 2)); return; }
                } catch (e) {
                    alert(e);
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
        // window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "aqui va cambiar de estado");
    } catch (e) {
        alert("usu" + e);
        return;
    }
    //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Datos Guardados correctamente");
}

function llamarUSADCE(placaVIN) {
    try {
        kendo.ui.progress($("#est_certificaScreen"), true);
        setTimeout(function () {
            TraerInformacionUsadCE(placaVIN, "P");
        }, 2000);
    } catch (e) {
        alert("llama" + e);
    }

}
function TraerInformacionUsadCE(responseText, tipo) {
    try {
        //alert("1");
        var today = new Date();
        var yyyy = today.getFullYear();
        var tabstripUsa = $("#tabstripUsaCE").kendoTabStrip().data("kendoTabStrip");
        tabstripUsa.select(0);
        document.getElementById("divOtEstadoCER").innerHTML = "";
        var intResult = "";
        datosConCE(registroavaluo, yyyy);
        ConsultarEMUSACE(registroavaluo.chasis);
        ConsultarMEUSACE(registroavaluo);
        if (registroavaluo.estado == "AVALUADO") {
            desactivaTablaCE(true);
        }
    } catch (e1) {
        alert("traeinf" + e1);
    }
    kendo.ui.progress($("#est_certificaScreen"), false);
}
function marcaVheEC(selMarca) {
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
        var cboMarcaHTML = "<p><select id='marcas2EC' onchange='cboModeloVheEC(this.value)' class='w3-input w3-border textos' readonly>";
        for (var i = 0; i < inforMarca.length; i++) {
            if (selMarca == inforMarca[i].CodigoClase) {
                cboMarcaHTML += "<option  value='" + inforMarca[i].CodigoClase + "' selected>" + inforMarca[i].NombreClase + "</option>";
            }
            else {
                cboMarcaHTML += "<option  value='" + inforMarca[i].CodigoClase + "'>" + inforMarca[i].NombreClase + "</option>";
            }
        }
        cboMarcaHTML += "</select>";
        document.getElementById("divcbomarcasEC").innerHTML = cboMarcaHTML;
    }
    else {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Marcas");
    }
}
function cboModeloVheEC(itmMarca, selModelo) {
    if (itmMarca != "") {
        var UrlCboModelos = localStorage.getItem("ls_url2").toLocaleString() + "/Services/in/Inventarios.svc/in11ModelosGet/1,1;" + itmMarca;
        //"http://186.71.21.170:8077/taller/Services/in/Inventarios.svc/in11ModelosGet/1,1;" + itmMarca;
        inforModelos = "";
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
                alert("cboModeloVheEC"+err);
                //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Ciudad");
                return;
            }
        });
        if (inforModelos.length > 0) {
            cboModelosHTML = "<p><select id='modelo2EC' onchange='cboDescVheEC(this.value)' class='w3-input w3-border textos' readonly>";
            var banDescr = 0;
            for (var i = 0; i < inforModelos.length; i++) {
                if (inforModelos[i].CodigoClase != " " || inforModelos[i].CodigoClase != "ninguna") {
                    if (selModelo == inforModelos[i].CodigoClase) {
                        cboModelosHTML += "<option  value='" + inforModelos[i].CodigoClase + "' selected>" + inforModelos[i].CodigoClase + " (" + inforModelos[i].NombreClase + ")" + "</option>";
                        document.getElementById("desmodeloEC").value = inforModelos[i].NombreClase;
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
            cboModelosHTML = "<p><select id='modelo2EC' class='w3-input w3-border textos'>";
            cboModelosHTML += "<option  value=' '>Ninguna</option>";
            cboModelosHTML += "</select>";
        }
    }
    document.getElementById("divcboModeloEC").innerHTML = cboModelosHTML;
    if (selModelo === undefined) {
        if (inforModelos.length === 1) {
            document.getElementById("desmodeloEC").value = inforModelos[0].NombreClase;
        } else {
            document.getElementById("desmodeloEC").value = "";
        }
    }

    //else {
    //    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Ciudad");
    //}
}
function cboDescVheEC(itmdes, prueba) {
    for (var j = 0; j < inforModelos.length; j++) {
        if (itmdes == inforModelos[j].CodigoClase) {
            document.getElementById("desmodeloEC").value = inforModelos[j].NombreClase;
        }
    }

}
function cboColoresEC(selColor) {
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
        var cboColorHTML = "<p><select id='Color2EC' class='w3-input w3-border textos' readonly>";
        for (var i = 0; i < inforColor.length; i++) {
            if (selColor == inforColor[i].CodigoClase) {
                cboColorHTML += "<option  value='" + inforColor[i].CodigoClase + "' selected>" + inforColor[i].NombreClase + "</option>";
            }
            else {
                cboColorHTML += "<option  value='" + inforColor[i].CodigoClase + "'>" + inforColor[i].NombreClase + "</option>";
            }
        }
        cboColorHTML += "</select>";
        document.getElementById("divcboColorEC").innerHTML = cboColorHTML;
    }
    else {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Color");
    }
}
function cboVendedoresEC(selVender) {
    var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/Combotg39VendedoresGet/2,1;01;01;VH";
    //"http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;VH;COLOR_VEHICULO;"
    var inforVender;
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
        var cboVenderHTML = "<p><select id='Vender2EC' class='w3-input w3-border textos' readonly>";
        for (var i = 0; i < inforVender.length; i++) {
            if (selVender == inforVender[i].CodigoClase) {
                cboVenderHTML += "<option  value='" + inforVender[i].CodigoClase + "' selected>" + inforVender[i].NombreClase + "</option>";
            }
            else {
                cboVenderHTML += "<option  value='" + inforVender[i].CodigoClase + "'>" + inforVender[i].NombreClase + "</option>";
            }
        }
        cboVenderHTML += "</select>";
        document.getElementById("divcboVenderEC").innerHTML = cboVenderHTML;
    }
    else {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio");
    }
}
function cboUbicacionEC(selUbica) {
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
        var cboUbicaHTML = "<p><select id='Ubica2EC' class='w3-input w3-border textos' readonly>";
        for (var i = 0; i < inforUbica.length; i++) {
            if (selUbica == inforUbica[i].CodigoClase) {
                cboUbicaHTML += "<option  value='" + inforUbica[i].CodigoClase + "' selected>" + inforUbica[i].NombreClase + "</option>";
            }
            else {
                cboUbicaHTML += "<option  value='" + inforUbica[i].CodigoClase + "'>" + inforUbica[i].NombreClase + "</option>";
            }
        }
        cboUbicaHTML += "</select>";
        document.getElementById("divcboUbicaEC").innerHTML = cboUbicaHTML;
    }
    else {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Ubicaci�n");
    }
}
function cboModeloAutoNEC(itmMarca, selModelo) {
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
                alert("cboModeloAutoNEC"+err);
                //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Ciudad");
                return;
            }
        });
        if (inforModelosN.length > 0) {
            cboModelosNHTML = "<p><select id='modelo3EC' class='w3-input w3-border textos' readonly>";
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
            cboModelosNHTML = "<p><select id='modelo3EC' class='w3-input w3-border textos'>";
            cboModelosNHTML += "<option  value=' '>Ninguna</option>";
            cboModelosNHTML += "</select>";
        }
    }
    document.getElementById("divcboAutoNEC").innerHTML = cboModelosNHTML;
}
function tipoFormularioEC(selForm) {
    try {
    //http://192.168.1.50:8089/concesionario/Services/TG/Parametros.svc/ComboParametroEmpGet/10,1;VH;TIPO_FORMULARIO_USADOS;;;SEMINUEVOS;;;;;
    var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ComboParametroEmpGet/10,1;VH;TIPO_FORMULARIO_USADOS;;;SEMINUEVOS;;;;;";
    var inforTipoForm;
    //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", Url);
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
                alert("tipoFormularioEC"+inspeccionar(e));
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso");
                return;
            }
        },
        error: function (err) {
            alert("tipoFormularioEC"+inspeccionar(err));
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso. Int\u00E9ntelo nuevamente.");
            return;
        }
    });
    if (inforTipoForm.length > 0) {
        var cboFormHTML = "<p><select id='formulario2EC' onchange='cboformularioVheEC(this.value)' class='w3-input w3-border textos' readonly>";
        for (var i = 0; i < inforTipoForm.length; i++) {
            if (selForm == inforTipoForm[i].CodigoClase) {
                cboFormHTML += "<option  value='" + inforTipoForm[i].CodigoClase + "' selected>" + inforTipoForm[i].NombreClase + "</option>";
            }
            else {
                cboFormHTML += "<option  value='" + inforTipoForm[i].CodigoClase + "'>" + inforTipoForm[i].NombreClase + "</option>";
            }
        }
        cboFormHTML += "</select>";
        document.getElementById("divcboFormEC").innerHTML = cboFormHTML;
    }
    else {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Tipo Formulario");
    }

    } catch (e) {
        alert("tipoD" + e);
    }
}
function cboPaisesEC(selPais) {
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
        var cboPaisHTML = "<p><select id='pais2EC' onchange='cboCiudadesEC(this.value)' class='w3-input w3-border textos' readonly>";
        for (var i = 0; i < cboPaResp.length; i++) {
            if (selPais == cboPaResp[i].CodigoClase) {
                cboPaisHTML += "<option  value='" + cboPaResp[i].CodigoClase + "' selected>" + cboPaResp[i].NombreClase + "</option>";
            }
            else {
                cboPaisHTML += "<option  value='" + cboPaResp[i].CodigoClase + "'>" + cboPaResp[i].NombreClase + "</option>";
            }
        }
        cboPaisHTML += "</select>";
        document.getElementById("divcboPaisEC").innerHTML = cboPaisHTML;
    }
    else {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Pais");
    }
}
function cboCiudadesEC(itmPais, selCiudad) {
    // http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/CiudadesGet/1,ECUADOR
    var cboCiudadHTML = "<p><select id='ciudad2EC' onchange='cboMantenimientosEC(this.value)' class='w3-input w3-border textos' readonly>";
    cboCiudadHTML += "<option  value=' '>Ninguna</option>";
    cboCiudadHTML += "</select>";
    if (itmPais != "") {
        var UrlCboCiudades = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/CiudadesGet/1," + itmPais;
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
                alert("cboCiudadesEC"+err);
                //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Ciudad");
                return;
            }
        });
        if (cboCiuResp.length > 0) {
            cboCiudadHTML = "<p><select id='ciudad2EC' class='w3-input w3-border textos' readonly>";
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
            cboCiudadHTML = "<p><select id='ciudad2EC' class='w3-input w3-border textos'>";
            cboCiudadHTML += "<option  value=' '>Ninguna</option>";
            cboCiudadHTML += "</select>";
        }
    }
    document.getElementById("divcboCiudadEC").innerHTML = cboCiudadHTML;
    //else {
    //    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Ciudad");
    //}
}
function cboCarga_3EC(idCombo, arrCombo, selItem, divCombo) {
    //alert(selItem);
    var cboAgenciaHTML = "<p><select id='" + idCombo + "' class='w3-input w3-border textos' onchange='cambioAvaluoEC(this.value)' readonly>";
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
function cboCarga_2EC(idCombo, arrCombo, selItem, divCombo) {
    //alert(selItem);
    var cboAgenciaHTML = "<p><select id='" + idCombo + "' class='w3-input w3-border textos')' readonly>";
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
function datosConCE(infor, yyyy) {
    try {
        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(infor));
        document.getElementById("observacionRG").value = infor.observaciones;
        document.getElementById("observacionTC").value = infor.observacion_tecnica;
        document.getElementById("placaEC").value = infor.placa.toUpperCase();
        document.getElementById("chasisEC").value = infor.chasis;
        document.getElementById("motorEC").value = infor.numero_motor;
        marcaVheEC(infor.codigo_marca);
        cboModeloVheEC(infor.codigo_marca, infor.codigo_modelo);
        cboVendedoresEC(infor.persona_numero_vendedor);
        //transmision
        cbogenericoEC(localStorage.getItem("ls_idempresa").toLocaleString(),"VH","transmision","transmisionEC2",infor.tipo_transmision,"dbotransmisionEC");
        //traccion
        cbogenericoEC(localStorage.getItem("ls_idempresa").toLocaleString(),"VH","tipo_traccion","traccionnEC2",infor.codigo_traccion,"dboTraccionEC");
        //subclase
        cbogenericoEC(localStorage.getItem("ls_idempresa").toLocaleString(),"IN","subclase_auto","subclaseEC2",infor.subclase_auto,"dboCarroceriaEC");
        //grupo auto
        cbogenericoEC(localStorage.getItem("ls_idempresa").toLocaleString(),"IN","clase_auto","claseEC2",infor.clase_auto,"dboClaseEC");
        //combustible
        cbogenericoEC(localStorage.getItem("ls_idempresa").toLocaleString(),"VH","tipo_combustible","combustibleEC2",infor.tipo_combustible,"dboCombustibleEC");
        document.getElementById("observacionR").value = infor.observacion_tecnica;
        document.getElementById("anio_modeloEC").value = infor.anio_modelo;
        cboColoresEC(infor.color_vehiculo);
        tipoFormularioEC(infor.tipo_formulario);
        cboModeloAutoNEC("KiA", infor.codigo_modelo_nuevo);
        document.getElementById("cilindrajeEC").value = infor.cilindraje;
        document.getElementById("kilometrosEC").value = infor.kilometraje;
        if (infor.anio_matricula == yyyy) {
            // Cbo. Matriculado
            cboCarga_2("tmatrEC", arrMatr, "SI", "divcbotmatrEC");
        } else {
            // Cbo. Matriculado
            cboCarga_2("tmatrEC", arrMatr, "NO", "divcbotmatrEC");
        }
        cboCarga_3("tavaluoEC", arrTipAva, infor.tipo_avaluo, "divcboTiAvaEC");
        var proEna = "NO";
        if (infor.prohibido_enajenar) {
            proEna = "SI";
        }
        cboCarga_2("tenajenaEC", arrMatr, proEna, "divcboEnajenaEC");
        document.getElementById("num_ordenEC").value = infor.numero_orden;
        document.getElementById("tmatrEC").disabled = true;
        document.getElementById("anio_matriculaEC").value = infor.anio_matricula;
        document.getElementById("anio_vh62EC").value = infor.anio_vh62;
        document.getElementById("secuenciaEC").value = infor.secuencia_vh62;
        document.getElementById("estadoEC").value = infor.estado;
        document.getElementById("pais").value = infor.pais_propietario;
        document.getElementById("ciudad_propietario").value = infor.ciudad_propietario;
        document.getElementById("tipo_dir_propietario").value = infor.direccion_propietario;
        document.getElementById("numero_id_propietarioEC").value = infor.identifica_propietario;
        document.getElementById("persona_numeroEC").value = infor.persona_numero;
        var arrNombre = infor.nombre_propietario.split(",");
        if (infor.nombre_propietario.split(",").length > 1) {
            var arrNombre = infor.nombre_propietario.split(",");
        }else{
             var arrNombre = infor.nombre_propietario.split(" ");
        }
        document.getElementById("persona_apellidoEC").value = arrNombre[0];
        document.getElementById("persona_apellido2EC").value = arrNombre[1];
        if (arrNombre.length > 2) {
            document.getElementById("persona_nombreEC").value = arrNombre[2];
            document.getElementById("persona_nombre2EC").value = arrNombre[3];
        }
        else {
            document.getElementById("persona_nombreEC").value = "";
            document.getElementById("persona_nombre2EC").value = "";
        }
        
        document.getElementById("mailEC").value = infor.mail_propietario;
        document.getElementById("telefono_celularEC").value = infor.persona_celular_propietario;
        document.getElementById("cli_calle_principal_propietarioEC").value = infor.direccion_propietario; //document.getElementById("calle_principal_propietario").value;
        document.getElementById("cli_numero_calle_propietarioEC").value = infor.numero_calle_propietario; //document.getElementById("numero_calle_propietario").value;
        document.getElementById("cli_calle_interseccion_propietaEC").value = infor.calle_interseccion_propietario; //document.getElementById("calle_interseccion_propieta").value;
        document.getElementById("cli_telefono_propietarioEC").value = infor.telefono_propietario; //document.getElementById("telefono_propietario").value;
        //Info Orden de Trabajo  
        //-------------------------*/
        //$("#dpInicioEC").kendoDatePicker({ format: "dd-MM-yyyy" });
        // $("#dpFinEC").kendoDatePicker({ format: "dd-MM-yyyy" });
        // Pais
        cboPaisesEC(infor.pais_propietario);
        // Ciudad
        cboCiudadesEC(document.getElementById("pais2EC").value, infor.ciudad_propietario);
        // Cbo. Tipo persona
        //alert(inspeccionar(infor));
        cboCarga_2EC("tpersEC", arrTipPers, infor.direccion_propietario.toUpperCase(), "divcbotpersEC");
        //cbo ubicacion
        cboUbicacionEC(infor.ubicacion_fisica);
        // Cbo. Tipod de documento
        cboCarga_2EC("tidEC", arDoc, infor.persona_tipo_propietario.toUpperCase(), "divcbotidEC");
        //// Cbo. tipo direccion
        cboCarga_2EC("direcEC", arrDir, infor.direccion_propietario.toUpperCase(), "divcbodirecEC");
        placaActiva = infor.placa.toUpperCase();
        cilindrajeActiva = infor.cilindraje
        //alert(placaActiva + " pr2 " + cilindrajeActiva);
        //activaDesactiva(true, placaActiva, cilindrajeActiva);
        //desabilitaTodo(true);
        document.getElementById("claseEC2").disabled = true;
        document.getElementById("subclaseEC2").disabled = true;
        document.getElementById("combustibleEC2").disabled = true;
        document.getElementById("traccionnEC2").disabled = true;
        document.getElementById("transmisionEC2").disabled = true;

    } catch (e) {
        alert("datos"+e);
    }

}
// vehiculos
function cbogenericoEC(emp,tipo,tipovh,tipoID,seltipo,nombreTipo) {
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
function ConsultarEMUSACE(emvin) {
    try {
        var erroresEM = 0;
        document.getElementById("tablaPrmEMUSAEC").style.display = "none";
        document.getElementById("tableEMUSAEC").style.display = "none";
        document.getElementById("fecEMUSAEC").value = "";
        document.getElementById("kmEMUSAEC").value = "";
        var UrlEM = localStorage.getItem("ls_url1").toLocaleString() + "/Services/SL/Sherloc/Sherloc.svc/Mantenimiento/" + "2," + emvin;
        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", UrlEM);
         var inforEMUSA;
        $.ajax({
            url: UrlEM,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    if (data.MantenimientoGetResult.substr(0, 1) == "0") {
                        erroresEM = 1;
                        //alert(data.MantenimientoGetResult.substr(2, (data.MantenimientoGetResult.length - 2)))
                    } else {
                        inforEMUSA = (JSON.parse(data.MantenimientoGetResult)).KilometrajeOT;
                    }
                    //if (data.MantenimientoGetResult !== null) {
                    //    inforEMUSA = (JSON.parse(data.MantenimientoGetResult)).KilometrajeOT;
                    //    alert(inspeccionar(inforEMUSA));
                    //} else {
                    //    erroresEM = 1;
                    //}

                } catch (e) {
                    alert(e);
                    for (var i = 0; i < 30; i++) {
                        document.getElementById("cl" + inforEMUSA[i].codigo).style.background = "red";
                        document.getElementById("cx" + inforEMUSA[i].codigo + "x").style.display = "";
                        bandera = "rojo";
                    }
                    document.getElementById("fecEMUSAEC").value = "";
                    document.getElementById("kmEMUSAEC").value = "";
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
            /* for (var i = 0; i < 30; i++) {
                document.getElementById("cl" + inforEMUSA[i].codigo + "U").style.background = "transparent";
                document.getElementById("cx" + inforEMUSA[i].codigo + "vU").style.display = "none";
                document.getElementById("cx" + inforEMUSA[i].codigo + "xU").style.display = "none";
            } */
            var bandera = "verde";
            if (inforEMUSA.length > 0) {
                for (var i = 0; i < inforEMUSA.length; i++) {
                    if (i < 30) {
                        if (inforEMUSA[i].validacion == true) {
                            document.getElementById("cl" + inforEMUSA[i].codigo + "U").style.background = "green";
                            document.getElementById("cx" + inforEMUSA[i].codigo + "vU").style.display = "";
                        }
                        else {
                            document.getElementById("cl" + inforEMUSA[i].codigo + "U").style.background = "red";
                            document.getElementById("cx" + inforEMUSA[i].codigo + "xU").style.display = "";
                            bandera = "rojo";
                        }
                    }
                    if (inforEMUSA[i].ultimo == true) {
                        document.getElementById("fecEMUSAEC").value = inforEMUSA[i].fecha_kilometraje;
                        document.getElementById("kmEMUSAEC").value = inforEMUSA[i].kilometraje;
                        break;
                    }
                }
                document.getElementById("tablaPrmEMUSAEC").style.display = "block";
                document.getElementById("tableEMUSAEC").style.display = "block";
            }
        }
    } catch (e) {
        alert("24" + e);
        return;
    }
   // alert("fin");
}
function ConsultarMEUSACE(inforusa) {
    try {
        //alert("tabla");
        var respOT = "0";
        //http://192.168.1.50:8089/concesionario/Services/VH/Vehiculos.svc/vh64PreguntasAvaluoGet/1,json;1;01;01;2018;1
        var UrlMotorEscape = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh64PreguntasAvaluoGet/1,json;" +
            inforusa.codigo_empresa + ";" + inforusa.codigo_sucursal + ";" + inforusa.codigo_agencia + ";" + inforusa.anio_vh62 + ";" +
            inforusa.secuencia_vh62 + ";" + inforusa.tipo_formulario + ";;;;;;";
        //var UrlMotorEscape = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh65PreguntasAvaluoGet/1,json;"+inforusa.codigo_empresa+";" + inforusa.tipo_formulario + ";;;"+inforusa.codigo_sucursal+";"+
        //    inforusa.codigo_agencia+";"+inforusa.anio_vh62+";"+inforusa.secuencia_vh62;//"/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;VH;PARTE_MOTOR_USADOS;";
        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", UrlMotorEscape);
        var infME;
        $.ajax({
            url: UrlMotorEscape,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    infME = (JSON.parse(data.vh64PreguntasAvaluoGetResult)).tvh64;   //(JSON.parse(data.ComboParametroEmpGetResult));
                    //infME = (JSON.parse(data.vh65PreguntasAvaluoGetResult)).otro_tvh65;
                    //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(infME));
                    respOT = "1";
                } catch (e) {
                    return;
                }
            },
            error: function (err) {
                alert(err);
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
                            //alert("etiqu"+infME[i].lista_etiquetas);
                            sevResp = infME[i].lista_etiquetas.split(",");
                            //alert(inspeccionar(sevResp));
                            var sevRes = [];
                            for (var k = 0; k < sevResp.length; k++) {
                                sevRes.push({ sevR: sevResp[k] });
                                //alert(inspeccionar(sevRes[k]));
                            }
                            //alert(inspeccionar(sevRes[0]));
                        }
                        //alert("resp"+infME[i].lista_respuesta)
                        selecResp = infME[i].lista_respuesta.split(",");
                        var selRes = [];
                        selRes.push({ sele: "Seleccione" });
                        for (var j = 0; j < selecResp.length; j++) {
                            selRes.push({ sele: selecResp[j] });
                        }
                    } else {
                        if (infME[i].tipo_respuesta == "ER") {
                            //alert("else eti" + infME[i].lista_etiquetas);
                            erResp = infME[i].lista_etiquetas.split(",");
                            var erRes = [];
                            for (var l = 0; l < erResp.length; l++) {
                                erRes.push({ erR: erResp[l] });
                            }
                            //alert("else resp" + infME[i].lista_respuesta);
                            selecResp = infME[i].lista_respuesta.split(",");
                            var selRes = [];
                            selRes.push({ sele: "Seleccione" });
                            for (var j = 0; j < selecResp.length; j++) {
                                selRes.push({ sele: selecResp[j] });
                            }
                        } else {
                            if (infME[i].tipo_respuesta == "EV") {
                                //alert("else ev"+infME[i].lista_etiquetas);
                                evResp = infME[i].lista_etiquetas.split(",");
                                //alert((evResp.length));
                                var evRes = [];
                                for (var hh = 0; hh < evResp.length; hh++) {
                                    evRes.push({ evR: evResp[hh] });
                                }
                                //alert("0:" + evRes[0].evR);
                                //alert("1:" + evRes[1].evR);
                                //alert("2:" + evRes[2].evR);
                                //alert("3:" + evRes[3].evR);
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
                        nombre_seccion: infME[i].nombre_seccion,
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
                    //if (infME[i].tipo_respuesta == "EV") { alert(griddata[i].evResp[0].evR); alert(griddata[i].evResp[1].evR); alert(griddata[i].evResp[2].evR); alert(griddata[i].evResp[3].evR); }
                    //alert("sevRespt" + infME[i].sevRespt);
                    //alert("sevRes" + inspeccionar(sevRes));
                    //alert("sevResp"+inspeccionar(griddata[i].sevResp));
                    //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", inspeccionar(griddata[i].sevResp));
                }
            } catch (e) {
                alert("1" + e);
            }
            //alert("antes de func");
            cargatablaCE(griddata);
            registroME = "";
        }
    } catch (e) {
        alert("21" + e);
        return;
    }
}
function cargatablaCE(griddata1) {
    try {
        document.getElementById("divOtEstadoCER").innerHTML = "";
        dataRespuesta = "";
        var tablaOT = "";
        tablaOT = "<table BORDER CELLPADDING=10 CELLSPACING=10 id='docume'>";
        var cuerpo;
        tablaOT += "<tr align='center' style='background-color:#000000'><td></td><td><label style='font-weight:bold; font-size:13px;color:#ffffff'>B=BUENO   R=REGULAR   M=MALO</label></td><td></td></tr>"
        for (var i = 0; i < griddata1.length; i++) {
            var seccionFor = griddata1[i].seccion_formulario;
            tablaOT += "<tr style='background-color:#000000'><td align='center' style='width: 25%;'><label style='font-weight:bold; font-size:13px;color:#ffffff'>" + griddata1[i].nombre_seccion + "</label></td><td style='width: 50%;'></td><td style='width: 25%;'></td></tr>";
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
                            if (valorsev[l] === "undefined" || valorsev[l] === null) {
                                valorsev[l] = " ";
                            }
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
                            if (valorer[l] === "undefined" || valorer[l] === null) {
                                valorer[l] = " ";
                            }
                            sevUsa += "<td><p><input id=ER" + i + "" + l + " type='text' size='2' placeholder=" + griddata1[i].erResp[l].erR + " value=" + valorer[l] + "></p></td>";
                        }
                        sevUsa += "</tr></table></td>";
                        var selUsa = seleccionUSA(griddata1[i].selResp, i, griddata1[i].selRespt);
                        tablaOT += sevUsa + "<td>" + selUsa + "</td>";
                    } else {
                        if (griddata1[i].tipo_respuesta == "EV") {
                            var sevUsa = "<td><table style='width: 100%;'><tr>";
                            var valorev = griddata1[i].evRespt.split(',');
                            for (var l = 0; l < griddata1[i].evResp.length; l++) {
                                if (valorev[l] === "undefined" || valorev[l] === null) {
                                    valorev[l] = " ";
                                }
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
        document.getElementById("divOtEstadoCER").innerHTML = " ";
        document.getElementById("divOtEstadoCER").innerHTML = tablaOT;
        document.getElementById("divOtEstadoCER").style.display = 'block';
        dataRespuesta = griddata1;
    } catch (e) {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(griddata1[i]));
        alert("carga" + i + e);

    }
}
function desactivaTablaCE(sn) {
    try {
        for (var i = 0; i < dataRespuesta.length; i++) {
            if (dataRespuesta[i].tipo_respuesta == "SELECCION" || dataRespuesta[i].tipo_respuesta == "SEV") {
                if (dataRespuesta[i].tipo_respuesta == "SEV") {
                    for (var l = 0; l < dataRespuesta[i].sevResp.length; l++) {
                        if (document.getElementById("SEV" + i + "" + l) != null) {
                            document.getElementById("SEV" + i + "" + l).disabled = sn;
                        }
                    }
                }
                document.getElementById("SEL" + i).disabled = sn;
            }
            if (dataRespuesta[i].tipo_respuesta == "ER") {
                for (var k = 0; k < dataRespuesta[i].erResp.length; k++) {
                    if (document.getElementById("ER" + i + "" + k) != null) {
                        document.getElementById("ER" + i + "" + k).disabled = sn;
                    }
                }
                document.getElementById("SEL" + i).disabled = sn;
            }
            if (dataRespuesta[i].tipo_respuesta == "EV") {
                for (var m = 0; m < dataRespuesta[i].evResp.length; m++) {
                    if (document.getElementById("EV" + i + "" + m) != null) {
                        document.getElementById("EV" + i + "" + m).disabled = sn;
                    }
                }
            }
        }
        //document.getElementById("cambiaEstadoAV").disabled = true;
        //document.getElementById("guardaAV").disabled = true;
    } catch (e) { alert(e); }
}

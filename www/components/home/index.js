// <reference path="../../Plugins/cordova-plugin-file-hash-master/www/FileHash.js" />
// <reference path="../../Plugins/cordova-plugin-file-hash-master/www/FileHash.js" />
//'use strict';

app.home = kendo.observable({
    onShow: function () {

        // RRP
    //botonPagos();

    llamarColorTexto(".w3-text-red");
    llamarNuevoestiloIcon("icnMenu");
       homeInfo();
    },
    afterShow: function () { }
});
app.localization.registerView('home');

// START_CUSTOM_CODE_home RRP
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes
function llamaravaluo() {
    kendo.ui.progress($("#homeScreen"), true);
    setTimeout(function () {
        avaluo();
    }, 2000);
}
function avaluo() {
    kendo.mobile.application.navigate("components/avaluo/view.html");
    //kendo.mobile.application.navigate("components/avaluo_vehiculo/view.html");
    kendo.ui.progress($("#homeScreen"), false);
}
function llamarrecepcion() {
    kendo.ui.progress($("#homeScreen"), true);
    setTimeout(function () {
        recepcion();
    }, 2000);
}
function llamarcertifica() {
    kendo.ui.progress($("#homeScreen"), true);
    setTimeout(function () {
        certificacion();
    }, 2000);
}
function recepcion() {
    kendo.mobile.application.navigate("components/lector_barras/view.html");
    kendo.ui.progress($("#homeScreen"), false);
}
function certificacion() {
    kendo.mobile.application.navigate("components/certificacion_vehiculo/view.html");
    kendo.ui.progress($("#homeScreen"), false);
}
function llamarestadocertifica() {
    //botonPagos();
    kendo.mobile.application.navigate("components/certifica_general/view.html");
    kendo.ui.progress($("#homeScreen"), false);
}
/*--------------------------------------------------------------------
Fecha: 26/09/2017
Descripcion: Carga el cbo de agencias por empresa y usu.
Parametros:
--------------------------------------------------------------------*/
function homeInfo() {
    // Nombre de empresa en pagina Incio
    document.getElementById("usuEmpresa2").innerHTML = localStorage.getItem("ls_empresa").toLocaleString();
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
        var cboAgenciaHTML = "<p><label class='w3-text-red'><b>Sucursal / Agencia</b></label><select id='cboAgenciasUS' class='w3-input w3-border textos select-style'>";
        cboAgenciaHTML += "<option value='0'>Seleccione</option>";
        for (var i = 0; i < accResp.length; i++) {
            cboAgenciaHTML += "<option  value='" + accResp[i].CodigoSucursal + "," + accResp[i].CodigoAgencia + "'>" + accResp[i].NombreAgencia + "</option>";
        }
        cboAgenciaHTML += "</select> </p><button id='btnAsignar0' class='w3-button w3-block w3-section w3-ripple w3-padding' onclick='agenciaActiva()'>ASIGNAR</button>";
        document.getElementById("cboAgenciaUsu").innerHTML = cboAgenciaHTML;
        llamarColorTexto(".w3-text-red");
        llamarNuevoestilo("btnAsignar");
        if (localStorage.getItem("bandera").toString() == "0") {
            verMenu("0");
        } else {
            verMenu("1");
        }
    }
    else {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "El usuario no tiene asignado empresa o agencia");
        cerrarSistema();
    }
}

/*--------------------------------------------------------------------
Fecha: 27/09/2017
Descripcion: Presenta el Usuario, Empresa, Agencia
Parametros:
--------------------------------------------------------------------*/
function agenciaActiva() {
    try {
    if (document.getElementById("cboAgenciasUS").value != 0) {
        localStorage.setItem("ls_usagencia", document.getElementById("cboAgenciasUS").value);
        var arrSucAgen = document.getElementById("cboAgenciasUS").value.split(",");
        if (arrSucAgen.length > 0) {
            localStorage.setItem("ls_ussucursal", arrSucAgen[0]);
            localStorage.setItem("ls_usagencia", arrSucAgen[1]);
        }
        localStorage.setItem("ls_usagencianom", document.getElementById("cboAgenciasUS").options[document.getElementById("cboAgenciasUS").selectedIndex].innerHTML);
        var infoUsuEmpAg =
            "<font color='black' style='font-size: 10px'>USUARIO:&nbsp; " + localStorage.getItem("ls_usunom").toLocaleString() + '</font> <br />' +
            "<font color='black' style='font-size: 10px'>EMPRESA:&nbsp; " + localStorage.getItem("ls_empresa").toLocaleString() + '</font> <br />' +
            "<font color='black' style='font-size: 10px'>AGENCIA:&nbsp; " + localStorage.getItem("ls_usagencianom").toLocaleString() + "</font>";
        //    window.myalert("<center><i class=\"fa fa-check-circle-o\"></i> ASIGNADO</center>", infoUsuEmpAg);
        // Nombre del usuario en el Menu Principal
        var infoUsuHtml = "<font color='white'><i class='fa fa-user-circle' aria-hidden='true'></i>&nbsp;&nbsp;</font>" +
            localStorage.getItem("ls_usunom").toLocaleString() + ' <br />' +
            "<font color='white'>EMPRESA:</font>&nbsp; " + localStorage.getItem("ls_empresa").toLocaleString() + ' <br />' +
            "<font color='white'>AGENCIA:</font>&nbsp; " + localStorage.getItem("ls_usagencianom").toLocaleString();
           
        document.getElementById("iniUsuario").innerHTML = infoUsuHtml;
        document.getElementById("iniUsuarioMenu").innerHTML = "<table align='center'> <tr><td><h1>" +
            "<font color='black'>USUARIO:</font>&nbsp; " + localStorage.getItem("ls_usunom").toLocaleString() + ' <br />' +
            "<font color='black'>EMPRESA:</font>&nbsp; " + localStorage.getItem("ls_empresa").toLocaleString() + ' <br />' +
            "<font color='black'>AGENCIA:</font>&nbsp; " + localStorage.getItem("ls_usagencianom").toLocaleString() +
            "</h1></td></tr> </table>";
        verMenu("1");
    }
    else {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Seleccione la Agencia");
    }
} catch (error) {
        alert(error);
}
}

function verMenu(vista) {
    if (vista == "0") {
        document.getElementById("menuCboAgencia").style.display = "block";
        document.getElementById("menuPagInicio").style.display = "none";
    }
    else {
        document.getElementById("menuCboAgencia").style.display = "none";
        document.getElementById("menuPagInicio").style.display = "block";
    }
}

// END_CUSTOM_CODE_home
function imprimirPDF() {
    var filename = "prd.pdf";
    var encodedString = '.../css/' + filename;
    try {
        var encodedString = 'base64encodedStringHere';
        print({
            data: encodedString,
            type: 'Data',
            title: 'Print Document',
            success: function () {
                console.log('success');
            },
            error: function (data) {
                data = JSON.parse(data);
                console.log('failed: ' + data.error);
            }
        });
        print({
        data: encodedString,
        type: 'Data',
        title: 'Print Document',
        success: function () {alert("imprimio uff");
            console.log('success');
        },
        error: function (data) {
            data = JSON.parse(data);
            console.log('failed: ' + data.error);
        }
    });
    } catch (e) { alert(e); }


    /*alert("segundo print");
        print({
        data: "http://200.31.10.92:8092/appk_aekia/imagenes/prd.pdf" + filename,
        type: 'File',
        title: 'Print document',
        success: function () { alert("logre"); },
        error: function (data) {
            data = JSON.parse(data);
            alert(data.error);
            console.log('Failed:' + data.error);
        }
    });
    downloadfile("http://200.31.10.92:8092/appk_aekia/imagenes/prd.pdf", filename,
        function (error, Filepath) {
            alert(Filepath);
            alert(inspeccionar(error));
            if (error) {
                alert(inspeccionar(error));
                console.log(error);
                //return;
            }
            //cdvfile: //localHost/documents
            print({
                data: "http://200.31.10.92:8092/appk_aekia/imagenes/prd.pdf" + filename,
                type: 'File',
                title: 'Print document',
                success: function () { alert("logre"); },
                error: function (data) {
                    data = JSON.parse(data);
                    alert(data.error);
                    console.log('Failed:' + data.error);
                }
            });
        });
}

function downloadfile(url, filename, callback) {
    alert(url);
    var filetTransFer = new FileTransfer();
    var uri = encodeURI(url);
    alert(uri);
    var pp = "/storege/emulated/0/Download/" + filename;
    alert(pp);
    filetTransFer.download(
        uri,
        pp,
        function (entry) {
            callback(null, entry);
        },
        function (error) {
            callback(error);

        });*/
}

function Print() {
    try {
        var printTitle = 'Print:' + $scope.Something + ', Date:' + new Date();
        var datauri = response.data.PdfBase64Str;//base64 string
        window.plugins.PrintPDF.isPrintingAvailable(function (isAvailable) {
            if (isAvailable) {
                var encodedString = datauri;
                window.plugins.PrintPDF.print({
                    data: encodedString,
                    type: 'Data',
                    title: printTitle,
                    success: function () {
                        ons.notification.alert({ message: 'Your printout was successful or cancel', title: null, animation: 'slide', buttonLabel: 'OK' });
                    },
                    error: function () {
                        ons.notification.alert({ message: 'Failed to Print', title: null, animation: 'slide', buttonLabel: 'OK' });
                    }
                });
            } else {
                ons.notification.alert({ message: 'Printer is not available', title: null, animation: 'slide', buttonLabel: 'OK' });
            }
        });
    } catch (e) {
        alert(e);
    }
    
}
function autoriza(loginT, tran ) {
    try {
        if ((loginT !== "") && (loginT)) {
            var resultado = "";
            var Url = "http://200.31.10.92:8092/appk_aekia/Services/SL/Sherloc/Sherloc.svc/AutenticacionGet/" + loginT + "," + tran;
            $.ajax({
                url: Url,
                type: "GET",
                dataType: "json",
                async: false,
                success: function (data) {
                    try {
                        resultado = JSON.parse(data.GenerateResult);
                    } catch (e) {
                        mensajePrm("timeAlert", 0, "<img id='autoInpse2'  width='60' height='26' src='resources/Kia-logo.png'>",
                            "ERROR", "<span align='justify'>" + data + "</b></span>", true, true);
                        return;
                    }
                },
                error: function (err) {
                    mens("Error conexi" + String.fromCharCode(243) + "n servicio Veh" + String.fromCharCode(237) + "culo", "mens"); return;

                }
            });
            return resultado;
        }
    } catch (f) {
        mens("Error conexi" + String.fromCharCode(243) + "n servicio Veh" + String.fromCharCode(237) + "culo", "mens"); return;
    }
}
function botonPagos() {
    try {
       var trank = autoriza("524cac752b0a69f7db009daebf78c49a", "w0e8OA4Lj9fLRPxm");
        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> para_RedirectRequest</center>", inspeccionar(trank));
        var par_auth = {
            "login": trank.login,
            "tranKey": trank.tranKey,
            "nonce": trank.nonce,
            "seed": trank.seed      //now.toISOString()
        };

    //------------------------------------------------------------------------
          
    // DIRECCION PAGADOR
    var par_payer_Address = {
        "street": "6 DICIEMBRE",
        "city": "QUITO",
        "state": "PICHINCHA",
        "postalCode": "170103",
        "country": "EC",
        "phone": "59322525175"
    };


    // DIRECCION COMPRADOR
    var par_buyer_Address = {
        "street": "ELOY ALFARO",
        "city": "QUITO",
        "state": "PICHINCHA",
        "postalCode": "170102",
        "country": "EC",
        "phone": "59322525666"
    };


    // PAGADOR
    var par_payer = {
        "documentType": "CC",
        "document": "1706991294",
        "name": "MYRIAM",
        "surname": "MMMM",
        "company": "PAGADOR",
        "email": "miryam@paga.com",
        "address": par_payer_Address,
        "mobile": "593982384253"
    };


    // COMPRADOR
    var par_buyer = {
        "documentType": "CC",
        "document": "1002794855",
        "name": "WILMER",
        "surname": "WWWW",
        "company": "COMPRADOR",
        "email": "willy@compra.COM",
        "address": par_buyer_Address,
        "mobile": "593982384666"
    };


    //------------------------------------------------------------------------

    var par_TaxDetail = {
        "kind": "valueAddedTax",
        "amount": 4.75,
        "base": 25
    };


    var par_AmountDetail = {
        "kind": "subtotal",
        "amount": 25
    };


    var par_Amount = {
        "currency": "USD",
        "total": 35.25,
        //"taxes": par_TaxDetail,
        //"details": par_AmountDetail
    };


    // DIRECCION COMPRADOR
    var par_persona_shipping_Address = {
        "street": "2561 Cortez Stream",
        "city": "Jeffryfort",
        "state": "Antioquia",
        "postalCode": "75289-6495",
        "country": "CO",
        "phone": "1-286-594-6243 x397"
    };

    // PERSON_SHIPPING
    var par_persona_shipping = {
        "documentType": "CC",
        "document": "1713314290",
        "name": "CARLOS",
        "surname": "CCCC",
        "company": "CIA_ENVIOS",
        "email": "carlos@envia.com",
        "address": par_persona_shipping_Address,
        "mobile": "593982384253"
    };

    var par_Items = [
            {
                "sku": 95749,
                "name": "MI_ARTICULO",
                "category": "physical",
                "qty": 1,
                "price": 25,
                "tax": 4.75
            }
    ];


    var par_fields = [
        {
            "keyword": "Redeem Code",
            "value": 586364,
            "displayOn": "payment"
        }
    ];

    var par_Recurring = {
        "periodicity": "M",
        "interval": 1,
        "nextPayment": "2018-06-18T15:26:54-05:00",
        "maxPeriods": -1,
        "dueDate": "2018-06-18T15:26:54-05:00",
        "notificationUrl": "https://minotificacion.com"
    };

    var par_PaymentRequest = {
        "reference": "MI_REFERENCIA",
        "description": "MI_DESCRIPCION_DE_LA_CUENTA",
        "amount": par_Amount,
        //"allowPartial": false,
       // "shipping": par_persona_shipping,
        //"items": par_Items,
        //"fields": par_fields,
        //"recurring": par_Recurring  //EN EL DE COLOMBIA NO ESTA
    };

    //------------------------------------------------------------------------

    var par_NameValuePairs = [
    {
        "keyword": "MI_CLAVE_1",
        "value": 777111,
        "displayOn": "payment"
    }
    ];

    var par_SubscriptionRequest = {
        "reference": "MI_REFERENCIA",
        "description": "MI_DESCRIPCION",
        "fields": par_NameValuePairs
    };

    //------------------------------------------------------------------------

    var par_Principal_NameValuePairs = [
    {
        "keyword": "MI_CLAVE_PRINC",
        "value": 123456,
        "displayOn": "payment"
    }
    ];
    //------------------------------------------------------------------------


    //// RedirectRequest
    //var para_RedirectRequest = {
    //    "locale": "es_CO",
    //    "payer": par_payer,
    //    "buyer": par_buyer,
    //    "payment": par_PaymentRequest,
    //    "subscription": par_SubscriptionRequest, //EN EL DE COLOMBIA NO ESTA
    //    "fields": par_Principal_NameValuePairs,
    //    "paymentMethod": "CR_VS", // EN EL DE COLOMBIA es null
    //    "expiration": "2018-05-18T15:26:54-05:00",
    //    "returnUrl": "https://retorna.com",
    //    "cancelUrl": "https://cancela.com",
    //    "ipAddress": "190.85.82.130",
    //    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36"
    //};



    // RedirectRequest
    var para_RedirectRequest = {
        "auth": par_auth,
        "locale": "es_CO",
        "payer": par_payer,
        "buyer": par_buyer,
        "payment": par_PaymentRequest,
        //"subscription": par_SubscriptionRequest, //EN EL DE COLOMBIA NO ESTA
        //"fields": par_Principal_NameValuePairs,
        "paymentMethod": null, //"CR_VS", // EN EL DE COLOMBIA es null
        "expiration": "2018-05-18T15:26:54-05:00",
        "returnUrl": "https://retorna.com",
        "cancelUrl": "https://cancela.com",
        "ipAddress": "190.85.82.130",
        "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36"
    };

   //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> para_RedirectRequest</center>", inspeccionar(para_RedirectRequest));

   // window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> para_RedirectRequest</center>", JSON.stringify(para_RedirectRequest, null, ' '));
     var urlRedir = "https://test.placetopay.ec/redirection/api/session";


   $.ajax({
       url: urlRedir,
       type: "POST",
       data: JSON.stringify(para_RedirectRequest),  
       async: false,
       dataType: "json",
       //Content-Type: application/json
       headers: {
           'Content-Type': 'application/json;charset=UTF-8'
       },
       success: function (datas) {

           //alert(datas);

           window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> OK</center>", inspeccionar(datas));
           return datas;
       },
       error: function (err) {
         //  alert(inspeccionar(err));

           window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(err));

           return;
       } 
   });
    } catch (e) {
        alert(e);
    }
 //  alert("ok");

}
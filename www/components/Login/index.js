//'use strict';

app.login = kendo.observable({
    onShow: function () {
try {
        localStorage.setItem("ls_verRecepcion", "0");
        kendo.bind($("#vwEmpresa"), kendo.observable({ isVisible: true }));
        kendo.bind($("#vwLogin2"), kendo.observable({ isVisible: false}));
        var scrWidth = $(window).width();
        var scrHeight = $(window).height();
        localStorage.setItem("ls_dimensionW", scrWidth);
        localStorage.setItem("ls_dimensionH", scrHeight);
        llamarNuevoestilo("btnAceptar");
        llamarNuevoestiloIcon("icnAceptar");
        llamarColorTexto(".w3-text-red");
        llamarColorTexto(".w3-border-red");
    } catch (error) {
    alert(error);
    }
    },
    afterShow: function () {
    }
});
app.localization.registerView('login');

// START_CUSTOM_CODE_login
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes


function mostrarPassword(){
    var cambio = document.getElementById("usuPass");
    if(cambio.type == "password"){
        cambio.type = "text";
        $('.icon').removeClass('fa fa-eye-slash').addClass('fa fa-eye');
    }else{
        cambio.type = "password";
        $('.icon').removeClass('fa fa-eye').addClass('fa fa-eye-slash');
    }
}

/*--------------------------------------------------------------------
Fecha: 26/09/2017
Descripcion: Acceso por codigo de empresa
Parametros:
    codEmpresa: codigo de la empresa (EJ.100001)
--------------------------------------------------------------------*/
function llamarEmpresa(codEmpresa) {
    kendo.ui.progress($("#loginScreen"), true);
    setTimeout(function () {
        accesoEmpresa(codEmpresa);
    }, 2000);
}
function llamarUsuario(accUsu, accPass) {
    kendo.ui.progress($("#loginScreen"), true);
    setTimeout(function () {
        accesoUsuario(accUsu, accPass);
    }, 2000);
}
function accesoEmpresa(codEmpresa) {
    try {
        if ((codEmpresa != "") && (codEmpresa)) {
            var empResp = "";
            //var Url2 = wsPrincipal + "/biss.sherloc/Services/MV/Moviles.svc/mv00EmpresasGet/1,json;" + codEmpresa + ";";
            var Url2 = wsPrincipal + "/Services/MV/Moviles.svc/mv00EmpresasGet/1,json;" + codEmpresa + ";";
                 //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", Url2);
            $.ajax({
                url: Url2,
                type: "GET",
                dataType: "json",
                async: false,
                success: function (data) {
                    try {
                        empResp = (JSON.parse(data.mv00EmpresasGetResult)).tmpEmpresas[0];
                        if (empResp.estado == "ACTIVO") {
                             localStorage.setItem("ls_empresa", empResp.nombre_empresa);
                             localStorage.setItem("ls_idempresa", empResp.empresa_erp);
                             localStorage.setItem("ls_url1", empResp.URL_mayorista);
                             localStorage.setItem("ls_url2", empResp.URL_concesionario);
                             localStorage.setItem("ls_marca", empResp.codigo_marca);
                            empRespa = empResp;
                            //    document.getElementById("usuEmpresa").innerHTML = "<b>" + empResp.nombre_empresa + "</b>";
                            document.getElementById("usuEmpresa").innerHTML = localStorage.getItem("ls_empresa").toLocaleString();
                            kendo.bind($("#vwEmpresa"), kendo.observable({ isVisible: false }));
                            kendo.bind($("#vwLogin2"), kendo.observable({ isVisible: true }));
                            kendo.ui.progress($("#loginScreen"), false);
                        }
                         else {
                             kendo.ui.progress($("#loginScreen"), false);
                            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Acceso Denegado.</br>Empresa Desactivada");
                        }
                    } catch (e) {
                        kendo.ui.progress($("#loginScreen"), false);
                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Acceso Denegado.</br>C&oacute;digo Incorrecto");
                        //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe de conexi&oacute;n con el servicio.");
                        //borraCamposlogin();
                        return;
                    }
                },
                error: function (err) {
                    kendo.ui.progress($("#loginScreen"), false);
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el <br/>Servicio Distribuidor");
                    return;
                }
            });
            return empResp;
        }
        else {
            kendo.ui.progress($("#loginScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Acceso Denegado.</br>Ingrese el C&oacute;digo");
        }
        kendo.ui.progress($("#loginScreen"), false);
    } catch (f) {
        kendo.ui.progress($("#loginScreen"), false);
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Acceso Denegado.</br>C&oacute;digo Incorrecto");
        return;
    }
    kendo.ui.progress($("#loginScreen"), false);
}

/*--------------------------------------------------------------------
Fecha: 26/09/2017
Descripcion: Acceso de Usuario
Parametros:
    accUsu: usuario
    accPass: pass
--------------------------------------------------------------------*/
function accesoUsuario(accUsu, accPass) {
    try {
        if ((accUsu != "") && (accUsu)) {
            var accResp = "";             
           var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/AU/Seguridad.svc/accesoUsuario/" + accUsu;
            //var Url = "http://localhost:4044/Services/AU/Seguridad.svc/accesoUsuario/" + accUsu;
            //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", Url);
            $.ajax({
                url: Url,
                type: "GET",
                dataType: "json",
                async: false,
                success: function (data) {
                    try {
                        var mensaje = inspeccionar(data);
                        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>" + mensaje + "</center>"); 
                        if (mensaje.includes(",") == true) {
                            var arrMsjLogin = mensaje.split(',');
                            if (arrMsjLogin[0].includes("0") == true) {
                                var arrAccMsj = mensaje.split(",");
                                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>" + arrAccMsj[1].replace(";", "") + "</center>");
                                kendo.ui.progress($("#loginScreen"), false);
                                return;
                            }
                        }
                        accResp = JSON.parse(data.accesoUsuarioResult);
                        
                        //   localStorage.setItem("usuarioActual", JSON.parse(data.accesoUsuarioResult));
                        localStorage.setItem("ls_usunom", accResp.Observaciones);
                        localStorage.setItem("ls_usulog", accResp.UserName);
                        kendo.bind($("#vwLogin"), kendo.observable({ isVisible: false }));
                        kendo.bind($("#vwLogout"), kendo.observable({ isVisible: true }));
                        kendo.ui.progress($("#loginScreen"), false);
                        localStorage.setItem("bandera","0");
                        kendo.mobile.application.navigate("components/home/view.html");
                    } catch (e) {
                        kendo.ui.progress($("#loginScreen"), false);
                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", data);
                        //borraCamposlogin();
                        return;
                    }
                },
                error: function (err) {
                    kendo.ui.progress($("#loginScreen"), false);
                    alert(inspeccionar(err));
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Acceso Denegado.</br>Datos Incorrectos");

                    //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe de conexi&oacute;n con el servicio.");
                    return;
                }
            });
            return accResp;
        }
        kendo.ui.progress($("#loginScreen"), false);
    } catch (f) {
        kendo.ui.progress($("#loginScreen"), false);
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Acceso Denegado.</br>Datos Incorrectos");
        return;
    }
    kendo.ui.progress($("#loginScreen"), false);
}

function imprimePDF() {
    try {
        var filename = "prd.pdf";
        var encodedString = "///storage/emulated/0/Download/" + filename;
        print({
            data: encodedString,
            type: 'File',
            title: 'Print Document',
            success: function () {
                alert("llego");
                console.log('success');
            },
            error: function (data) {
                data = JSON.parse(data);
                alert(data.error);
                console.log('failed: ' + data.error);
            }
        });
        alert("paso");
        print({
            data: "cdvfile: ///storage/emulated/0/Download/" + filename,
            type: 'File',
            title: 'Print document',
            success: function () { alert("logre"); },
            error: function (data) {
                data = JSON.parse(data);
                alert(data.error);
                console.log('Failed:' + data.error);
            }
        });
        //alert("algo paso");
        downloadfile1("http://200.31.10.92:8092/appk_aekia/imagenes/prd.pdf", filename,
            function (error, Filepath) {
                if (error) {
                    alert(inspeccionar(error));
                    console.log(error);
                    //return;
                }

                print({
                    data: "cdvfile: ///storage/emulated/0/Download/" + filename,
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
    } catch (e) {
        alert(e);
    }
    
}

function downloadfile1(url, filename, callback) {
    try {
        var filetTransFer = new FileTransfer();
        var uri = encodeURI(url);
        filetTransFer.download(
            uri,
            cordova.file.documentsDirectory + filename,
            function (entry) {
                alert("entry");
                callback(null, entry);
            },
            function (error) {
                alert("erro");
                callback(error);

            });
    } catch (e1) {
        alert("e1:   "+e1);

    }
    
}
// END_CUSTOM_CODE_login
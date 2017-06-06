if (window.location.href.indexOf("cg.portal.uscg.mil") > -1) {
    $(document).ready(function () {
        $("#handlebarsTemplates").load("/spframework/CSOM/bundle.html", function () {
            Contoso.Helpers.log("All Templates loaded");
            Contoso.Helpers.bootstrap();
        });
    });
}
else {
    $(window).load(function () {
        $("#handlebarsTemplates").load("/spframework/CSOM/bundle.html", function () {
            Contoso.Helpers.log("All Templates loaded");
            Contoso.Helpers.bootstrap();
        });
    });
}

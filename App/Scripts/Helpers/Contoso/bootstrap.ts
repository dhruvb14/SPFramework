/// <reference path="init.ts" />
if (Contoso.Helpers.inDesignMode()) {
    Contoso.Helpers.log("Detected Edit Mode, Halting execution");
}
else {
    $(window).load(function () {
        $.get(Contoso.init.rootSiteCollectionPrefix + "/CSOM/bundle.html", function (data) {
            $("#handlebarsTemplates").append(data);
            Contoso.Helpers.log("All Templates loaded");
            Contoso.Helpers.bootstrap();
        });
    })
}
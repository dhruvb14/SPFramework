var Contoso;
(function (Contoso) {
    var HelpersController = (function () {
        function HelpersController() {
            this.debugMode = false;
            this.console = new Array();
        }
        HelpersController.prototype.bootstrap = function () {
            var controllers = $('[data-controller]').each(function (index, value) {
                var container = $(value);
                var controllerName = container.data('controller');
                var controller = Controllers[controllerName];
                if (controller) {
                    controller.container = value;
                    controller.load();
                }
                else {
                    Contoso.Helpers.log(controllerName + " controller not found");
                }
            });
        };
        HelpersController.prototype.log = function (log) {
            this.console.push(log);
            if (this.debugMode && console !== undefined) {
                console.log(log);
            }
            ;
        };
        HelpersController.prototype.productionDebug = function () {
            $.each(this.console, function (key, val) {
                if (console !== undefined) {
                    console.log(val);
                }
            });
        };
        HelpersController.prototype.setDebugFlag = function () {
            this.debugMode = window.location.href.indexOf("sharepoint.com") > -1 || window.location.href.indexOf("#DEBUG") < 0 ? true : false;
        };
        HelpersController.prototype.getQueryStringParameter = function (sParam) {
            var sPageURL = window.location.search.substring(1);
            var sURLVariables = sPageURL.split('&');
            for (var i = 0; i < sURLVariables.length; i++) {
                var sParameterName = sURLVariables[i].split('=');
                if (sParameterName[0] == sParam) {
                    return sParameterName[1];
                }
            }
        };
        return HelpersController;
    }());
    Contoso.HelpersController = HelpersController;
    Contoso.Helpers = new HelpersController();
    Contoso.Helpers.setDebugFlag();
})(Contoso || (Contoso = {}));

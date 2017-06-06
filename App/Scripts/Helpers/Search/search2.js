var Contoso;
(function (Contoso) {
    var Helpers;
    (function (Helpers) {
        var SearchController = (function () {
            function SearchController() {
                this.debugMode = false;
                this.console = new Array();
            }
            SearchController.prototype.bootstrap = function () {
                var controllers = $('[data-controller]').each(function (index, value) {
                    var container = $(value);
                    var controllerName = container.data('controller');
                    var controller = Controllers[controllerName];
                    if (controller) {
                        controller.container = value;
                        controller.load();
                    }
                    else {
                        Helpers.log(controllerName + " controller not found");
                    }
                });
            };
            SearchController.prototype.log = function (log) {
                this.console.push(log);
                if (this.debugMode && console !== undefined) {
                    console.log(log);
                }
                ;
            };
            SearchController.prototype.productionDebug = function () {
                $.each(this.console, function (key, val) {
                    if (console !== undefined) {
                        console.log(val);
                    }
                });
            };
            SearchController.prototype.setDebugFlag = function () {
                this.debugMode = window.location.href.indexOf("sharepoint.com") > -1 || window.location.href.indexOf("#DEBUG") < 0 ? true : false;
            };
            SearchController.prototype.getQueryStringParameter = function (sParam) {
                var sPageURL = window.location.search.substring(1);
                var sURLVariables = sPageURL.split('&');
                for (var i = 0; i < sURLVariables.length; i++) {
                    var sParameterName = sURLVariables[i].split('=');
                    if (sParameterName[0] == sParam) {
                        return sParameterName[1];
                    }
                }
            };
            return SearchController;
        }());
        Helpers.SearchController = SearchController;
        Helpers.Search = new SearchController();
    })(Helpers || (Helpers = {}));
})(Contoso || (Contoso = {}));

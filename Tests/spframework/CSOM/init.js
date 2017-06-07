/// <reference path="../Contoso/Contoso.ts" />
/// <reference path="../../Controllers/Example/exampleList.ts" />
var Contoso;
(function (Contoso) {
    var initController = (function () {
        function initController() {
            this.rootSiteCollectionPrefix = "/sites";
            this.dataAttributeTag = "data-controller";
        }
        initController.prototype.getDependency = function (filename, filetype, successCallback) {
            if (filetype == "js") {
                var inject = document.createElement('script');
                inject.setAttribute("type", "text/javascript");
                inject.setAttribute("src", filename);
            }
            else if (filetype == "css") {
                var inject = document.createElement("link");
                inject.setAttribute("rel", "stylesheet");
                inject.setAttribute("type", "text/css");
                inject.setAttribute("href", filename);
            }
            if (typeof inject != "undefined") {
                var head = document.getElementsByTagName('head')[0], done = false;
                // Attach handlers for all browsers
                inject.onload = inject.onreadystatechange = function () {
                    if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
                        done = true;
                        inject.onload = inject.onreadystatechange = null;
                        if (filetype == "js") {
                            head.removeChild(inject);
                        }
                    }
                };
                head.appendChild(inject);
            }
        };
        initController.prototype.domBuilder = function () {
            if (document.getElementById("handlebarsTemplates") === null) {
                var handlebarsTemplates = document.createElement('div');
                handlebarsTemplates.setAttribute("id", "handlebarsTemplates");
                document.body.appendChild(handlebarsTemplates);
            }
            Contoso.init.loadJs();
        };
        initController.prototype.loadJs = function () {
            Contoso.init.getDependency(Contoso.init.rootSiteCollectionPrefix + '/CSOM/vendor.js', 'js', function () {
                console.log("Successfully boostrapped Vendor JS");
                Contoso.init.getDependency(Contoso.init.rootSiteCollectionPrefix + '/CSOM/bundle.js', 'js', function () {
                    if (typeof Controllers === 'undefined' || typeof Contoso.Helpers === 'undefined') {
                        if (console !== undefined) {
                            console.log('Failed to bootstrap CSOM JS');
                        }
                    }
                    else {
                        Contoso.Helpers.log('Successfully bootstraped CSOM JS');
                    }
                });
            });
        };
        initController.prototype.loadCss = function () {
            Contoso.init.getDependency(Contoso.init.rootSiteCollectionPrefix + '/CSOM/bundle.css', 'css', function () {
                Contoso.Helpers.log('Successfully bootstraped CSOM CSS');
            });
            Contoso.init.getDependency(Contoso.init.rootSiteCollectionPrefix + '/CSOM/vendor.css', 'css', function () {
                Contoso.Helpers.log('Successfully bootstraped Vendor CSS');
            });
            Contoso.init.getDependency('//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.css', 'css', function () {
            });
        };
        return initController;
    }());
    Contoso.init = new initController();
    if (window.location.hostname !== "localhost") {
        Contoso.init.domBuilder();
        Contoso.init.loadCss();
    }
})(Contoso || (Contoso = {}));

//# sourceMappingURL=init.js.map

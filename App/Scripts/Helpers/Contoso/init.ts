/// <reference path="../Contoso/Contoso.ts" />
/// <reference path="../../Controllers/Example/exampleList.ts" />
module Contoso {
    export interface IInit {
        getDependency(filename: string, filetype: string, successCallback: Function): void;
        dataAttributeTag: string;
        rootSiteCollectionPrefix: string;
    }
    class initController implements IInit {
        getDependency(filename: string, filetype: string, successCallback: Function) {
            if (filetype == "js") { //if filename is a external JavaScript file
                var inject: any = document.createElement('script')
                inject.setAttribute("type", "text/javascript")
                inject.setAttribute("src", filename)
            }
            else if (filetype == "css") { //if filename is an external CSS file
                var inject: any = document.createElement("link")
                inject.setAttribute("rel", "stylesheet")
                inject.setAttribute("type", "text/css")
                inject.setAttribute("href", filename)
            }
            if (typeof inject != "undefined") {
                var head = document.getElementsByTagName('head')[0], done = false;
                // Attach handlers for all browsers
                inject.onload = inject.onreadystatechange = function () {
                    if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
                        done = true;
                        successCallback();
                        inject.onload = inject.onreadystatechange = null;
                        if (filetype == "js") { head.removeChild(inject); }
                    }
                };
                head.appendChild(inject);
            }
            // successCallback();

        }
        domBuilder() {
            if (document.getElementById("handlebarsTemplates") === null) {
                var handlebarsTemplates = document.createElement('div');
                handlebarsTemplates.setAttribute("id", "handlebarsTemplates")
                document.body.appendChild(handlebarsTemplates);
            }
            Contoso.init.loadJs();
        }
        loadJs() {
            Contoso.init.getDependency(Contoso.init.rootSiteCollectionPrefix + '/CSOM/vendor.js', 'js', function () {
                console.log("Successfully boostrapped Vendor JS");
                Contoso.init.loadBundle();
            });
        }
        loadBundle(){
            Contoso.init.getDependency(Contoso.init.rootSiteCollectionPrefix + '/CSOM/bundle.js', 'js', function () {
                    if (typeof Controllers === 'undefined' || typeof Contoso.Helpers === 'undefined') {
                        if (console !== undefined) {
                            console.log('Failed to bootstrap CSOM JS');
                        }
                    } else {
                        Contoso.Helpers.log('Successfully bootstraped CSOM JS');
                    }
                });
        }
        loadCss() {
            Contoso.init.getDependency(Contoso.init.rootSiteCollectionPrefix + '/CSOM/bundle.css', 'css', function () {
                console.log('Successfully bootstraped CSOM CSS');
            });
            Contoso.init.getDependency(Contoso.init.rootSiteCollectionPrefix + '/CSOM/vendor.css', 'css', function () {
                console.log('Successfully bootstraped Vendor CSS');
            });
            Contoso.init.getDependency('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.css', 'css', function () {
            });
        }
        // rootSiteCollectionPrefix = "/sites";
        rootSiteCollectionPrefix = "/spframework";
        dataAttributeTag = "data-controller";
    }
    export var init = new initController();
    if (window.location.hostname !== "localhost") {
        init.domBuilder();
        init.loadCss();
    }
}
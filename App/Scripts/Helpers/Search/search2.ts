module Contoso {
    module Helpers {
        export interface ISearchController {
            bootstrap(): void;
            debugMode: boolean;
            log(log: string): void;
            productionDebug(): void;
            console: Array<string>;
            setDebugFlag(): void;
            getQueryStringParameter(sParam: string): void;
        }
        export class SearchController implements ISearchController {
            bootstrap() {
                var controllers = $('[data-controller]').each(function (index, value) {
                    var container = $(value);
                    var controllerName = container.data('controller');
                    var controller = (<any>Controllers)[controllerName];
                    if (controller) {
                        controller.container = value;
                        controller.load();
                    } else {
                        Contoso.Helpers.log(controllerName + " controller not found")
                    }
                })
            }
            debugMode = false;
            log(log: string) {
                this.console.push(log);
                if (this.debugMode && console !== undefined) { console.log(log) };
            }
            productionDebug() {
                $.each(this.console, function (key, val) {
                    if (console !== undefined) {
                        console.log(val);
                    }
                });
            }
            console = new Array();
            setDebugFlag() {
                this.debugMode = window.location.href.indexOf("sharepoint.com") > -1 || window.location.href.indexOf("#DEBUG") < 0 ? true : false;
            }
            getQueryStringParameter(sParam: string) {
                var sPageURL = window.location.search.substring(1);
                var sURLVariables = sPageURL.split('&');
                for (var i = 0; i < sURLVariables.length; i++) {
                    var sParameterName = sURLVariables[i].split('=');
                    if (sParameterName[0] == sParam) {
                        return sParameterName[1];
                    }
                }
            }
        }
        export var Search = new SearchController();
    }
}
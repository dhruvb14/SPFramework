// Interfaces needed for inDesignMode Function
interface Window { MSOWebPartPageFormName: any; }
interface HTMLFormElement {MSOLayout_InDesignMode: any, _wikiPageMode:any}

module Contoso {
    export interface IHelpersController {
        inDesignMode():boolean;
        bootstrap(): void;
        debugMode: boolean;
        log(log: string): void;
        productionDebug(): void;
        console: Array<string>;
        setDebugFlag(): void;
        getQueryStringParameter(sParam: string): void;
        getResultsFromSearchQuery(results: any): any;
        getImageFromSearch(value: string): string;
        getImageRendition(image: string, rendition: number): string;
        SPSearchQuery(query: string, selectProperties: string[], startPosition: number): JQueryPromise<any>;
    }
    export class HelpersController implements IHelpersController {
        inDesignMode() {
            var result = (window.MSOWebPartPageFormName != undefined) && ((document.forms[window.MSOWebPartPageFormName] && document.forms[window.MSOWebPartPageFormName].MSOLayout_InDesignMode && ("1" == document.forms[window.MSOWebPartPageFormName].MSOLayout_InDesignMode.value)) || (document.forms[window.MSOWebPartPageFormName] && document.forms[window.MSOWebPartPageFormName]._wikiPageMode && ("Edit" == document.forms[window.MSOWebPartPageFormName]._wikiPageMode.value)));
            return result || false;
        }
        bootstrap() {
            var controllers = $('[' + Contoso.init.dataAttributeTag + ']').each(function (index, value) {
                var container = $(value);
                var controllerName = container.data('controller');
                var controller = (<any>Controllers)[controllerName];
                if (controller) {
                    controller.container = value;
                    controller.load();
                } else {
                    Helpers.log(controllerName + " controller not found")
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
        getResultsFromSearchQuery(results: any) {
            if (results && results.m_value && results.m_value.ResultTables[0] && results.m_value.ResultTables[0].ResultRows) {
                return results.m_value.ResultTables[0].ResultRows
            }
            return [];

        }
        getImageFromSearch(value: string) {
            return $(value).attr("src") || "#";
        }
        getImageRendition(image: string, rendition: number) {
            if (!image) return "";
            var returnImg = "";
            var imgArray = ["png", "jpg", "gif", "jpeg", "PNG", "JPG", "GIF", "JPEG"];
            $.each(imgArray, function (index, value) {
                if (image.indexOf(value) > 0) {
                    returnImg = image.replace(eval("/(" + value + ")([?]RenditionID=[0-9])?/gi"), value + "?RenditionID=" + rendition);
                }
            });
            if (returnImg == "" && image) {
                returnImg = image;
            }
            return returnImg;
        };
        SPSearchQuery(query: string, selectProperties: string[], startPosition: number) {
            //When modifing this be careful as many other widgets use this method to retrieve data.
            var context: any = this;
            var deferred = $.Deferred();
            SP.SOD.executeFunc("SP.js", "SP.ClientContext", function () {
                SP.SOD.executeFunc("SP.Search.js", "Microsoft.SharePoint.Client.Search.Query.KeywordQuery", function () {
                    var sContext: any = SP.ClientContext.get_current();
                    var keywordQuery = new Microsoft.SharePoint.Client.Search.Query.KeywordQuery(sContext);
                    keywordQuery.set_trimDuplicates(false);
                    // keywordQuery.set_rowLimit(context.initialResultsAmount);
                    keywordQuery.set_startRow(startPosition);
                    var properties = keywordQuery.get_selectProperties();
                    //Add all select properties needed for the query
                    $.each(selectProperties, function (key, value) {
                        properties.add(value);
                    });
                    // Sorting (Ascending = 0, Descending = 1)
                    // keywordQuery.set_enableSorting(true);
                    // var sortproperties = keywordQuery.get_sortList();
                    // properties.add("Title");
                    // properties.add("PublishingImage");
                    // properties.add("SlideOWSIMGE");
                    // sortproperties.add("BAHShowcasePublishDate", 1);
                    // sortproperties.add("BAHStartDate", 0);
                    var queryText = query;
                    keywordQuery.set_queryText(queryText);
                    var searchExecutor = new Microsoft.SharePoint.Client.Search.Query.SearchExecutor(sContext);
                    var results = searchExecutor.executeQuery(keywordQuery);
                    sContext.executeQueryAsync(
                        function () {
                            deferred.resolve(results);
                        },
                        function (err: any) {
                            deferred.reject(null);
                        }
                    );
                });
            });
            return deferred.promise();
        }

    }
    export var Helpers = new HelpersController();
    Contoso.Helpers.setDebugFlag();
}
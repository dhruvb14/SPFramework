//reference: http://stackoverflow.com/questions/35873617/async-typescript-function-return-jquery-promise
var JQueryPromise = (function () {
    function JQueryPromise(executor) {
        var dfd = $.Deferred();
        function fulfilled(value) {
            var promise = value;
            if (value && promise.then) {
                promise.then(fulfilled, rejected);
            }
            else {
                dfd.resolve(value);
            }
        }
        function rejected(reason) {
            var promise = reason;
            // if (reason && promise.then) {
            //     promise.then(fulfilled, rejected);
            // }
            // else {
            dfd.reject(reason);
            // }
        }
        executor(fulfilled, rejected);
        return dfd.promise();
    }
    return JQueryPromise;
}());

var Contoso;
(function (Contoso) {
    var HelpersController = (function () {
        function HelpersController() {
            this.debugMode = false;
            this.console = new Array();
        }
        HelpersController.prototype.inDesignMode = function () {
            var result = (window.MSOWebPartPageFormName != undefined) && ((document.forms[window.MSOWebPartPageFormName] && document.forms[window.MSOWebPartPageFormName].MSOLayout_InDesignMode && ("1" == document.forms[window.MSOWebPartPageFormName].MSOLayout_InDesignMode.value)) || (document.forms[window.MSOWebPartPageFormName] && document.forms[window.MSOWebPartPageFormName]._wikiPageMode && ("Edit" == document.forms[window.MSOWebPartPageFormName]._wikiPageMode.value)));
            return result || false;
        };
        HelpersController.prototype.bootstrap = function () {
            var controllers = $('[' + Contoso.init.dataAttributeTag + ']').each(function (index, value) {
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
        HelpersController.prototype.getResultsFromSearchQuery = function (results) {
            if (results && results.m_value && results.m_value.ResultTables[0] && results.m_value.ResultTables[0].ResultRows) {
                return results.m_value.ResultTables[0].ResultRows;
            }
            return [];
        };
        HelpersController.prototype.getImageFromSearch = function (value) {
            return $(value).attr("src") || "#";
        };
        HelpersController.prototype.getImageRendition = function (image, rendition) {
            if (!image)
                return "";
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
        ;
        HelpersController.prototype.SPSearchQuery = function (query, selectProperties, startPosition) {
            //When modifing this be careful as many other widgets use this method to retrieve data.
            var context = this;
            var deferred = $.Deferred();
            SP.SOD.executeFunc("SP.js", "SP.ClientContext", function () {
                SP.SOD.executeFunc("SP.Search.js", "Microsoft.SharePoint.Client.Search.Query.KeywordQuery", function () {
                    var sContext = SP.ClientContext.get_current();
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
                    sContext.executeQueryAsync(function () {
                        deferred.resolve(results);
                    }, function (err) {
                        deferred.reject(null);
                    });
                });
            });
            return deferred.promise();
        };
        return HelpersController;
    }());
    Contoso.HelpersController = HelpersController;
    Contoso.Helpers = new HelpersController();
    Contoso.Helpers.setDebugFlag();
})(Contoso || (Contoso = {}));

var Controllers;
(function (Controllers) {
    var exampleListItem = (function () {
        function exampleListItem(title) {
            this.title = title;
        }
        return exampleListItem;
    }());
    var exampleListVM = (function () {
        function exampleListVM() {
            this.listItem = new Array();
        }
        return exampleListVM;
    }());
    var exampleListController = (function () {
        function exampleListController(Helpers) {
            this.Helpers = Helpers;
            this.name = "exampleListController";
        }
        exampleListController.prototype.load = function (viewtemplate) {
            viewtemplate = viewtemplate ? viewtemplate : "exampleList";
            var vm = new exampleListVM();
            for (var i = 0; i < 10; i++) {
                var tmpTitle = "Item number " + i;
                var item = new exampleListItem(tmpTitle);
                vm.listItem.push(item);
            }
            //var Handlebars: Handlebars;
            var template = Handlebars.compile($('#' + viewtemplate + "Template").html());
            var html = template(vm);
            var $controller = "[data-controller='" + viewtemplate + "']";
            $($controller).html(html);
            this.Helpers.log("Loaded " + viewtemplate);
        };
        return exampleListController;
    }());
    Controllers.exampleList = new exampleListController(Contoso.Helpers);
})(Controllers || (Controllers = {}));

var Controllers;
(function (Controllers) {
    var exampleListGroupController = (function () {
        function exampleListGroupController(exampleList) {
            this.exampleList = exampleList;
            this.name = "Example List Group Controller";
        }
        exampleListGroupController.prototype.load = function () {
            this.exampleList.load("exampleListGroup");
        };
        return exampleListGroupController;
    }());
    Controllers.exampleListGroup = new exampleListGroupController(Controllers.exampleList);
})(Controllers || (Controllers = {}));

var Controllers;
(function (Controllers) {
    var exampleOwlItem = (function () {
        function exampleOwlItem(title, image) {
            this.title = title;
            this.image = image;
        }
        return exampleOwlItem;
    }());
    var exampleOwlVM = (function () {
        function exampleOwlVM() {
            this.person = new Array();
        }
        return exampleOwlVM;
    }());
    var exampleOwlDemoController = (function () {
        function exampleOwlDemoController(exampleList, Helpers) {
            this.exampleList = exampleList;
            this.Helpers = Helpers;
            this.name = "Example Owl Demo Controller";
        }
        exampleOwlDemoController.prototype.load = function (viewtemplate) {
            viewtemplate = viewtemplate ? viewtemplate : "exampleOwlDemo";
            var vm = new exampleOwlVM();
            this.Helpers.log("Loaded " + viewtemplate);
            var properties = [];
            properties.push("Title");
            properties.push("PublishingImage");
            properties.push("SlideOWSIMGE");
            var queryData = this.Helpers.SPSearchQuery("ContentType:OwlPeople", properties, 0);
            var filteredSearchResults = [];
            $.when(queryData).done(function (results) {
                filteredSearchResults = Contoso.Helpers.getResultsFromSearchQuery(results);
                Contoso.Helpers.log(filteredSearchResults);
                $.each(filteredSearchResults, function (index, value) {
                    var person = new exampleOwlItem(value.Title, Contoso.Helpers.getImageRendition(Contoso.Helpers.getImageFromSearch(value.SlideOWSIMGE), 5));
                    vm.person.push(person);
                });
                var template = Handlebars.compile($('#' + viewtemplate + "Template").html());
                var html = template(vm);
                var $controller = "[data-controller='" + viewtemplate + "']";
                $($controller).html(html);
                $('.owl-carousel').owlCarousel({
                    loop: true,
                    margin: 10,
                    responsiveClass: false,
                    responsive: {
                        0: {
                            items: 1,
                            nav: false
                        },
                        600: {
                            items: 2,
                            nav: false
                        },
                        1000: {
                            items: 3,
                            nav: false,
                            loop: false
                        }
                    }
                });
                Contoso.Helpers.log("Loaded " + viewtemplate);
            });
        };
        return exampleOwlDemoController;
    }());
    Controllers.exampleOwlDemo = new exampleOwlDemoController(Controllers.exampleList, Contoso.Helpers);
})(Controllers || (Controllers = {}));

var Controllers;
(function (Controllers) {
    var exampleSlideShowItem = (function () {
        function exampleSlideShowItem(title, image) {
            this.title = title;
            this.image = image;
        }
        return exampleSlideShowItem;
    }());
    var exampleSlideShowVM = (function () {
        function exampleSlideShowVM() {
            this.slides = new Array();
        }
        return exampleSlideShowVM;
    }());
    var exampleSlideShowController = (function () {
        function exampleSlideShowController(Helpers) {
            this.Helpers = Helpers;
            this.name = "exampleSlideShowController";
        }
        exampleSlideShowController.prototype.load = function (viewtemplate) {
            viewtemplate = viewtemplate ? viewtemplate : "exampleSlideShow";
            var vm = new exampleSlideShowVM();
            this.Helpers.log("Loaded " + viewtemplate);
            var properties = [];
            properties.push("Title");
            properties.push("PublishingImage");
            properties.push("SlideOWSIMGE");
            var queryData = this.Helpers.SPSearchQuery("ContentType:Slideshow", properties, 0);
            var filteredSearchResults = [];
            $.when(queryData).done(function (results) {
                filteredSearchResults = Contoso.Helpers.getResultsFromSearchQuery(results);
                Contoso.Helpers.log(filteredSearchResults);
                $.each(filteredSearchResults, function (index, value) {
                    var slide = new exampleSlideShowItem(value.Title, Contoso.Helpers.getImageRendition(Contoso.Helpers.getImageFromSearch(value.SlideOWSIMGE), 5));
                    vm.slides.push(slide);
                });
                var template = Handlebars.compile($('#' + viewtemplate + "Template").html());
                var html = template(vm);
                var $controller = "[data-controller='" + viewtemplate + "']";
                $($controller).html(html);
                $('.flexslider').flexslider({
                    animation: "slide"
                });
                Contoso.Helpers.log("Loaded " + viewtemplate);
            });
        };
        return exampleSlideShowController;
    }());
    Controllers.exampleSlideShow = new exampleSlideShowController(Contoso.Helpers);
})(Controllers || (Controllers = {}));

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// var pnp = require("pnp");
var Controllers;
(function (Controllers) {
    var siteCreationItem = (function () {
        function siteCreationItem(Title, ID, BaseUrl, CategoryDescription, Portal) {
            this.Title = Title;
            this.ID = ID;
            this.BaseUrl = BaseUrl;
            this.CategoryDescription = CategoryDescription;
            this.Portal = Portal;
        }
        return siteCreationItem;
    }());
    var SelectedTemplate = (function () {
        function SelectedTemplate(SiteTitle, SiteTemplateID, URLPrefix, URLSuffix, SBU, Restricted, Portal, URLValidation) {
            this.SiteTitle = SiteTitle;
            this.SiteTemplateID = SiteTemplateID;
            this.URLPrefix = URLPrefix;
            this.URLSuffix = URLSuffix;
            this.SBU = SBU;
            this.Restricted = Restricted;
            this.Portal = Portal;
            this.URLValidation = URLValidation;
        }
        return SelectedTemplate;
    }());
    var siteCreationVM = (function () {
        function siteCreationVM() {
            this.PnPTemplates = new Array();
        }
        return siteCreationVM;
    }());
    var siteCreationController = (function () {
        function siteCreationController(Helpers) {
            this.Helpers = Helpers;
            this.name = "siteCreationController";
            this.vm = new siteCreationVM();
        }
        siteCreationController.prototype.convertToSlug = function (Text) {
            if (Text.charAt(0) === "_") {
                Controllers.siteCreation.enableVisibilityError();
                while (Text.charAt(0) === "_") {
                    Text = Text.substr(1, Text.length);
                }
            }
            else {
                Controllers.siteCreation.disableVisibilityError();
            }
            return Text
                .toLowerCase()
                .replace(/[^\w ]+/g, '')
                .replace(/ +/g, '-');
        };
        siteCreationController.prototype.enableVisibilityError = function () {
            $("#siteurlUnderscore").show();
        };
        siteCreationController.prototype.disableVisibilityError = function () {
            $("#siteurlUnderscore").hide();
        };
        siteCreationController.prototype.urlExists = function (url, callback) {
            $.ajax({
                type: 'HEAD',
                url: url,
                success: function () {
                    var message = "Site Collection for " + url + "already exists";
                    Contoso.Helpers.log(message);
                    callback(false);
                },
                error: function () {
                    callback(true);
                }
            });
        };
        siteCreationController.prototype.isUniqueSiteRequest = function (url, callback) {
            $.ajax({
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Site Creation')/items?$filter=SiteURL eq '" + encodeURIComponent(url) + "'",
                type: "GET",
                contentType: "application/json;odata=verbose",
                headers: {
                    "Accept": "application/json;odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val()
                },
                success: function (data) {
                    var listItems = data.d.results;
                    callback(listItems.length == 0);
                },
                error: function (data) {
                    callback(true);
                }
            });
        };
        siteCreationController.prototype.type2site = function () {
            $('#Restriction').hide();
            $('#SBU').show();
            //Update Save VM
            Controllers.siteCreation.vm.SelectedTemplate.Portal = "Type2Site";
        };
        siteCreationController.prototype.type1site = function () {
            $('#Restriction').show();
            $('#SBU').hide();
            //Update Save VM
            Controllers.siteCreation.vm.SelectedTemplate.Portal = "Type1Site";
        };
        siteCreationController.prototype.render = function (viewtemplate) {
            viewtemplate = viewtemplate ? viewtemplate : "siteCreation";
            var container = "siteCreation";
            var template = Handlebars.compile($('#' + viewtemplate + "Template").html());
            var html = template(Controllers.siteCreation.vm);
            var $controller = "[" + Contoso.init.dataAttributeTag + "='" + container + "']";
            $($controller).html(html);
            if (viewtemplate == "siteCreation") {
                Controllers.siteCreation.viewLogic();
            }
            $("#siteurlUnderscore").hide();
            var categoryDescription = $('#pnptemplate').find('option:selected').attr('description');
            $("#pnptemplateDescription").text(categoryDescription);
            Contoso.Helpers.log("Loaded " + viewtemplate);
        };
        siteCreationController.prototype.viewLogic = function () {
            //Create VM to track changes so we don't have to do it when saving...
            Controllers.siteCreation.vm.SelectedTemplate = new SelectedTemplate($('#title').val(), (Number($('#pnptemplate').find('option:selected').attr('templateID')) || -1), $('#pnptemplate').val(), $('#siteurl').val(), false, false, $('#pnptemplate').find('option:selected').attr('portal'), false);
            $('#pnptemplate').change(function (value) {
                var URLPrefix = $('#pnptemplate').val();
                var templateID = Number($('#pnptemplate').find('option:selected').attr('templateID'));
                var categoryDescription = $('#pnptemplate').find('option:selected').attr('description');
                $("#pnptemplateDescription").text(categoryDescription);
                $("#urlprefix").text(URLPrefix);
                var element = $(this).find('option:selected');
                var myTag = element.attr("portal");
                //Update Save VM
                $('input[type="radio"][name=RestrictionRadios]:eq(1)').click();
                $('input[type="radio"][name=SBURadios]:eq(1)').click();
                Controllers.siteCreation.vm.SelectedTemplate.SBU = false;
                Controllers.siteCreation.vm.SelectedTemplate.Restricted = false;
                Controllers.siteCreation.vm.SelectedTemplate.SiteTemplateID = templateID;
                Controllers.siteCreation.vm.SelectedTemplate.URLPrefix = URLPrefix;
                myTag === "Type2Site" ? Controllers.siteCreation.type2site() : Controllers.siteCreation.type1site();
            });
            function title() {
                var currentTitle = $('#title').val();
                var URLSuffix = Controllers.siteCreation.convertToSlug(currentTitle);
                Controllers.siteCreation.vm.SelectedTemplate.SiteTitle = currentTitle;
                Controllers.siteCreation.vm.SelectedTemplate.URLSuffix = URLSuffix;
                $("#siteurl").val(URLSuffix);
            }
            $('#title').on('keyup', function (value) {
                title();
            });
            $('#title').on('blur', function (value) {
                title();
            });
            $('input[type=radio][name=SBURadios]').change(function () {
                Controllers.siteCreation.vm.SelectedTemplate.SBU = Boolean($(this).val());
            });
            $('input[type=radio][name=RestrictionRadios]').change(function () {
                Controllers.siteCreation.vm.SelectedTemplate.Restricted = Boolean($(this).val());
            });
            $("#submit").on('click', function (event) {
                Controllers.siteCreation.urlExists($("#urlprefix").text() + $("#siteurl").val(), function (response) {
                    Controllers.siteCreation.vm.SelectedTemplate.URLValidation = response;
                    //Quick rest call to check if the endpoint already exists on the tenant, if so no need to check if its been requested but just not processed
                    if (response == false) {
                        alert("Site with that URL already exists, please update your title or request permissions to the existing site");
                        Controllers.siteCreation.vm.SelectedTemplate.URLValidation = response;
                    }
                    else {
                        //Go to the site creation list and verify that this user has not already requested this exact site, if they have then throw error
                        Controllers.siteCreation.isUniqueSiteRequest($("#urlprefix").text() + $("#siteurl").val(), function (response2) {
                            //If SharePoint says that this user already requested to create this site then alert.
                            if (!response2) {
                                alert("A site with the specified URL has already been requested, please update your title, or check the status of your previous Site Creation Request");
                                Controllers.siteCreation.vm.SelectedTemplate.URLValidation = response2;
                            }
                            else {
                                //Last and final check which makes sure required fields are not blank or longer than supported by SP
                                Controllers.siteCreation.validateUIFields() ? Controllers.siteCreation.post() : Controllers.siteCreation.error();
                            }
                        });
                    }
                });
            });
            $('#pnptemplate').find('option:selected').attr('portal') === "Type1Site" ? Controllers.siteCreation.type1site() : Controllers.siteCreation.type2site();
        };
        siteCreationController.prototype.post = function () {
            var listName = "Site Creation";
            var item = {
                "__metadata": { "type": "SP.Data.Site_x0020_CreationListItem" },
                "Title": Controllers.siteCreation.vm.SelectedTemplate.SiteTitle,
                "PnPProfileId": Controllers.siteCreation.vm.SelectedTemplate.SiteTemplateID,
                "Restricted0": Controllers.siteCreation.vm.SelectedTemplate.Restricted == true ? "Yes" : "No",
                "SBU_x0020_Community": Controllers.siteCreation.vm.SelectedTemplate.SBU == true ? "Yes" : "No",
                "SiteURL": Controllers.siteCreation.vm.SelectedTemplate.URLPrefix + Controllers.siteCreation.vm.SelectedTemplate.URLSuffix,
                "ContentTypeId": "0x0100B7235E8992FABB469447A05D2C9BE007",
                "CategoryDescription": $("#sitedescription").text()
            };
            $.ajax({
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + listName + "')/items",
                type: "POST",
                contentType: "application/json;odata=verbose",
                data: JSON.stringify(item),
                headers: {
                    "Accept": "application/json;odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val()
                },
                success: function (data) {
                    Controllers.siteCreation.render("siteCreationSuccess");
                },
                error: function (data) {
                    alert("Something went wrong with your request. Please try again");
                }
            });
        };
        siteCreationController.prototype.error = function () {
            alert(" Form Fields are invalid! \n\n Site's title can not be blank\n\n Site URL's full length can not be longer than 128 characters \n\n Please verify and try again");
        };
        siteCreationController.prototype.validateUIFields = function () {
            var valid = true;
            var vm = Controllers.siteCreation.vm.SelectedTemplate;
            valid = ((vm.Portal == "Type1Site") || (vm.Portal == "Type2Site")) && (vm.SiteTitle != "") && (vm.URLSuffix != "") && (vm.SiteTemplateID != -1) && (vm.URLValidation == true) && ((vm.URLPrefix + vm.URLSuffix).length < 128) ? true : false;
            return valid;
        };
        siteCreationController.prototype.getTemplates = function () {
            return __awaiter(this, void 0, JQueryPromise, function () {
                var siteUrl;
                return __generator(this, function (_a) {
                    siteUrl = _spPageContextInfo.webAbsoluteUrl;
                    return [2 /*return*/, $.ajax({
                            url: siteUrl + "/_api/web/lists/getbytitle('Site Templates')/items",
                            method: "GET",
                            headers: { "Accept": "application/json; odata=verbose" },
                            success: function (data) {
                            },
                            error: function (data) {
                            }
                        })];
                });
            });
        };
        siteCreationController.prototype.executeAsync = function () {
            return __awaiter(this, void 0, JQueryPromise, function () {
                var vm, data, listItems, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            vm = Controllers.siteCreation.vm;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, Controllers.siteCreation.getTemplates()];
                        case 2:
                            data = _a.sent();
                            listItems = data.d.results;
                            listItems.forEach(function (entry) {
                                var PnPTemplate = new siteCreationItem(entry.Title, entry.ID, entry.BaseUrl, entry.CategoryDescription, entry.Portal);
                                vm.PnPTemplates.push(PnPTemplate);
                            });
                            Controllers.siteCreation.render();
                            return [3 /*break*/, 4];
                        case 3:
                            err_1 = _a.sent();
                            Contoso.Helpers.log("Error retrieving data for  " + Controllers.siteCreation.name);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        siteCreationController.prototype.load = function () {
            //Don't call async methods directly in load as it ties up the main thread if a catch is hit.
            Controllers.siteCreation.executeAsync();
        };
        return siteCreationController;
    }());
    Controllers.siteCreation = new siteCreationController(Contoso.Helpers);
})(Controllers || (Controllers = {}));

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
    });
}

//# sourceMappingURL=bundle.js.map

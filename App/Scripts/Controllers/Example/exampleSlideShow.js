var Controllers;
(function (Controllers) {
    var exampleSlideShowItem = (function () {
        function exampleSlideShowItem(title) {
            this.title = title;
        }
        return exampleSlideShowItem;
    }());
    var exampleSlideShowVM = (function () {
        function exampleSlideShowVM() {
            this.listItem = new Array();
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
            for (var i = 0; i < 10; i++) {
                var tmpTitle = "Item number " + i;
                var item = new exampleSlideShowItem(tmpTitle);
                vm.listItem.push(item);
            }
            //var Handlebars: Handlebars;
            // var template = Handlebars.compile($('#' + viewtemplate + "Template").html());
            // var html = template(vm);
            // var $controller = "[data-controller='" + viewtemplate + "']";
            // $($controller).html(html);
            this.Helpers.log("Loaded " + viewtemplate);
            var query = new queryExecutor();
            var queryData = query.query("ContentType:Slideshow", 0);
            var actualResults = null;
            $.when(queryData).done(function (results) {
                actualResults = results;
                this.Helpers.log(results);
            });
        };
        return exampleSlideShowController;
    }());
    var queryExecutor = (function () {
        function queryExecutor() {
        }
        queryExecutor.prototype.query = function (parameter, startPosition) {
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
                    // $.each(context.selectProperties, function (key, widgetConfiguration) {
                    //     properties.add(widgetConfiguration);
                    // });
                    // Sorting (Ascending = 0, Descending = 1)
                    // keywordQuery.set_enableSorting(true);
                    // var sortproperties = keywordQuery.get_sortList();
                    properties.add("Title");
                    properties.add("PublishingImage");
                    properties.add("SlideOWSIMGE");
                    // sortproperties.add("BAHShowcasePublishDate", 1);
                    // sortproperties.add("BAHStartDate", 0);
                    var queryText = parameter;
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
        return queryExecutor;
    }());
    Controllers.exampleSlideShow = new exampleSlideShowController(Contoso.Helpers);
})(Controllers || (Controllers = {}));

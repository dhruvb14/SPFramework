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

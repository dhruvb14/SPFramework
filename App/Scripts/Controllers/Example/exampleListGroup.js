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

var Controllers;
(function (Controllers) {
    var exampleOwlDemoController = (function () {
        function exampleOwlDemoController(exampleList) {
            this.exampleList = exampleList;
            this.name = "Example Owl Demo Controller";
        }
        exampleOwlDemoController.prototype.load = function () {
            this.exampleList.load("exampleOwlDemo");
            $('.owl-carousel').owlCarousel({
                loop: true,
                margin: 10,
                responsiveClass: true,
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
        };
        return exampleOwlDemoController;
    }());
    Controllers.exampleOwlDemo = new exampleOwlDemoController(Controllers.exampleList);
})(Controllers || (Controllers = {}));

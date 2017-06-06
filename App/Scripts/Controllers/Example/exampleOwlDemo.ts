module Controllers {
    export interface IExampleOwlDemoModel {
        load(viewtemplate?: string): void;
        name: string;
    }
    class exampleOwlItem {
        constructor(private title: string, private image: string) {
        }
    }
    class exampleOwlVM {
        person: Array<exampleOwlItem> = new Array<exampleOwlItem>()
    }
    class exampleOwlDemoController implements IExampleOwlDemoModel {
        constructor(private exampleList: IExampleListController, private Helpers: Contoso.IHelpersController) { }
        name = "Example Owl Demo Controller";
        load(viewtemplate: string) {
            viewtemplate = viewtemplate ? viewtemplate : "exampleOwlDemo";
            var vm = new exampleOwlVM();
            this.Helpers.log("Loaded " + viewtemplate);
            var properties = [];
            properties.push("Title");
            properties.push("PublishingImage");
            properties.push("SlideOWSIMGE");
            var queryData = this.Helpers.SPSearchQuery("ContentType:OwlPeople", properties, 0);
            var filteredSearchResults: any = []
            $.when(queryData).done(function (results: any) {
                filteredSearchResults = Contoso.Helpers.getResultsFromSearchQuery(results);
                Contoso.Helpers.log(filteredSearchResults)
                $.each(filteredSearchResults, function (index, value) {
                    var person = new exampleOwlItem(value.Title, Contoso.Helpers.getImageRendition(Contoso.Helpers.getImageFromSearch(value.SlideOWSIMGE), 5))
                    vm.person.push(person);
                })
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
                })
                Contoso.Helpers.log("Loaded " + viewtemplate);
            })
        }
    }
    export var exampleOwlDemo = new exampleOwlDemoController(exampleList, Contoso.Helpers);
}
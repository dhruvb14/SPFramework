module Controllers {
    class exampleSlideShowItem {
        constructor(private title: string, private image: string) {
        }
    }
    class exampleSlideShowVM {
        slides: Array<exampleSlideShowItem> = new Array<exampleSlideShowItem>()
    }
    export interface IExampleSlideShowController {
        load(viewtemplate?: string): void;
    }
    class exampleSlideShowController implements IExampleSlideShowController {
        constructor(private Helpers: Contoso.IHelpersController) { }
        name = "exampleSlideShowController";
        load(viewtemplate: string) {
            viewtemplate = viewtemplate ? viewtemplate : "exampleSlideShow";
            var vm = new exampleSlideShowVM();
            this.Helpers.log("Loaded " + viewtemplate);
            var properties = [];
            properties.push("Title");
            properties.push("PublishingImage");
            properties.push("SlideOWSIMGE");
            var queryData = this.Helpers.SPSearchQuery("ContentType:Slideshow", properties, 0);
            var filteredSearchResults: any = []
            $.when(queryData).done(function (results: any) {
                filteredSearchResults = Contoso.Helpers.getResultsFromSearchQuery(results);
                Contoso.Helpers.log(filteredSearchResults)
                $.each(filteredSearchResults, function (index, value) {
                    var slide = new exampleSlideShowItem(value.Title, Contoso.Helpers.getImageRendition(Contoso.Helpers.getImageFromSearch(value.SlideOWSIMGE), 5))
                    vm.slides.push(slide);
                })
                var template = Handlebars.compile($('#' + viewtemplate + "Template").html());
                var html = template(vm);
                var $controller = "[data-controller='" + viewtemplate + "']";
                $($controller).html(html);
                $('.flexslider').flexslider({
                    animation: "slide"
                });
                Contoso.Helpers.log("Loaded " + viewtemplate);
            })
        }
    }
    export var exampleSlideShow = new exampleSlideShowController(Contoso.Helpers);
}
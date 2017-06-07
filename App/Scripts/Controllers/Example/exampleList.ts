module Controllers {
    class exampleListItem {
        constructor(private title: string) {
        }
    }
    class exampleListVM {
        listItem: Array<exampleListItem> = new Array<exampleListItem>()
    }
    export interface IExampleListController {
        load(viewtemplate?: string): void;
    }
    class exampleListController implements IExampleListController {
        constructor(private Helpers: Contoso.IHelpersController) { }
        name = "exampleListController";
        load(viewtemplate: string) {
            viewtemplate = viewtemplate ? viewtemplate : "exampleList";
            var vm = new exampleListVM();
            for (var i: number = 0; i < 10; i++) {
                var tmpTitle: string = "Item numbers " + i;
                var item = new exampleListItem(tmpTitle);
                vm.listItem.push(item);
            }
            //var Handlebars: Handlebars;
            var template = Handlebars.compile($('#' + viewtemplate + "Template").html());
            var html = template(vm);
            var $controller = "[data-controller='" + viewtemplate + "']";
            $($controller).html(html);
            this.Helpers.log("Loaded " + viewtemplate);
        }
    }
    export var exampleList = new exampleListController(Contoso.Helpers);
}
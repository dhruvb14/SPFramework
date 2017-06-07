module Controllers {
    class DemoItem {
        constructor(private title: string, private message: string) {
        }
    }
    export interface IDemoController {
        load(): void;
    }
    class DemoController implements IDemoController {
        constructor(private Helpers: Contoso.IHelpersController) { }
        name = "Demo";
        load() {
            var self = this;
            // var uid = $(self.container).attr("id");
            var vm = new DemoItem("Hello World Title", "Hello World Body");
            self.render(vm);
        }
        render(vm: DemoItem) {
            var controller = "div[data-controller='Demo']";
            var viewSource = $("#Demo-template").html();
            var template = Handlebars.compile(viewSource);
            var html = template(vm);
            $(controller).html(html);
        }
    }
    export var Demo = new DemoController(Contoso.Helpers);
}
module Controllers {
    class $name$Item {
        constructor(private title: string, private message: string) {
        }
    }
    export interface I$name$Controller {
        load(): void;
    }
    class $name$Controller implements I$name$Controller {
        constructor(private Helpers: Contoso.IHelpersController) { }
        name = "$name$";
        load() {
            var self = this;
            // var uid = $(self.container).attr("id");
            var vm = new $name$Item("Hello World Title", "Hello World Body");
            self.render(vm);
        }
        render(vm: $name$Item) {
            var controller = "div[data-controller='$name$']";
            var viewSource = $("#$name$-template").html();
            var template = Handlebars.compile(viewSource);
            var html = template(vm);
            $(controller).html(html);
        }
    }
    export var $name$ = new $name$Controller(Contoso.Helpers);
}
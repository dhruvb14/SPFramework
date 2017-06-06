module Controllers {
    export interface IexampleListGroupModel {
        load(viewtemplate?: string) : void;
        name: string;
    }
    class exampleListGroupController implements IexampleListGroupModel {
        constructor(private exampleList: IExampleListController) { }
        name = "Example List Group Controller";
        load() {
            this.exampleList.load("exampleListGroup");
        }
    }
    export var exampleListGroup = new exampleListGroupController(exampleList);
}
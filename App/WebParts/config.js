var webparts = [
        //Add comments anywhere inside file
        {
            "controllerName": "directiveSearch",
            "description": "Find a Directive - Autocompleteing WebPart For Searching Directives ",
            "include": { "Contoso": false },
            "title": "Find A Directive",
            "webpartConfig": { "id": "123124", "data-test": "testParameter", "class": "dhruv's Css Class" }
        },
        {
            "controllerName": "formsSearch",
            "description": "Find a Form - Autocompleteing WebPart For Searching Forms",
            "include": { "Contoso": false },
            "title": "Find A Form",
            "webpartConfig": {}
        },
        {
            "controllerName": "generalSearch",
            "description": "This is the typeahead used when searching for general messages",
            "include": { "Contoso": false },
            "title": "Find A Coast Guard General Message",
            "webpartConfig": {}
        },
        {
            "controllerName": "alcoast",
            "description": "DO NOT USE THIS WEBPART",
            "include": { "Contoso": false },
            "title": "Alcoast new items",
            "webpartConfig": { }
        },
        {
            "controllerName": "exampleList",
            "description": "Example List Demo",
            "include": { "Contoso": true },
            "title": "Demo 1 Webpart",
            "webpartConfig": { }
        },
        {
            "controllerName": "exampleListGroup",
            "description": "Example List Group Demo",
            "include": { "Contoso": true },
            "title": "Demo 2 Webpart",
            "webpartConfig": {}
        },
        {
            "controllerName": "exampleOwlDemo",
            "description": "Example Owl Demo",
            "include": { "Contoso": true },
            "title": "Demo 3 Webpart",
            "webpartConfig": {}
        },
        {
            "controllerName": "testWebPart",
            "description": "DO NOT USE THIS WEBPART",
            "include": { "Contoso": false },
            "title": "Test webpart, Do not copy to production",
            "webpartConfig": { "data-testProperty": "testvalue", "class": "test" }
        }
]
var projects = [
"Contoso",
]
try {
    if (exports) {
        /*
         * Exports Variable name is very important. It is what decides the output directory
         * Follow my naming scheme below. Local variables may be named anything but when exported
         * please always use the same export casing for all related projects
         * after adding to exports do NOT forget to add to project variable also or the gulp script
         * won't know to look for it.
         */
        exports.webparts = webparts;
        exports.projects = projects;
    }
} catch (e) {

}
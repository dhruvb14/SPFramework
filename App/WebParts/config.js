var webparts = [
        //Add comments anywhere inside file
        {
            "controllerName": "testWebPart",
            "description": "DO NOT USE THIS WEBPART",
            "include": { "Contoso": false },
            "title": "Test webpart, Do not copy to production",
            "webpartConfig": { "data-testProperty": "testvalue", "class": "test" }
        },
        {
            "controllerName": "Demo",
            "description": "Hello World Controller",
            "include": { "Contoso": false },
            "title": "Hello World",
            "webpartConfig": { }
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
var Contoso = [
    // Controllers
    "./App/Templates/Controllers/Example/exampleList.html",
    "./App/Templates/Controllers/Example/exampleListGroup.html",
    "./App/Templates/Controllers/Example/exampleOwlDemo.html",
    "./App/Templates/Controllers/Example/exampleSlideshow.html",
    "./App/Templates/Controllers/SiteCreation/siteCreation.html",
    "./App/Templates/Controllers/SiteCreation/siteCreationSuccess.html",
];

var projects = [
"Contoso",
]
// needed for the build script, that tells nodejs to return this variable from the loaded module
try {
    if (exports) {
        /*
         * Exports Variable name is very important. It is what decides the output directory
         * Follow my naming scheme below. Local variables may be named anything but when exported
         * please always use the same export casing for all related projects
         * after adding to exports do NOT forget to add to project variable also or the gulp script
         * won't know to look for it.
         */
        exports.Contoso = Contoso;
        exports.projects = projects;
    }
} catch (e) {

}


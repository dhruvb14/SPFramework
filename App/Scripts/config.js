var Contoso = {}
Contoso.Vendor = [
    // Dependencies
    "./App/Scripts/Libraries/jQuery/jquery-2.2.3.js",
    "./App/Scripts/Libraries/Bootstrap/bootstrap.js",
    "./App/Scripts/Libraries/HandleBars/handlebars-v4.0.5.js",
    "./App/Scripts/Libraries/Owl Carousel/owl.carousel.min.js",
    "./App/Scripts/Libraries/Bootstrap-Datepicker/bootstrap-datepicker.js",
    "./App/Scripts/Libraries/Moment/moment.js",
    "./App/Scripts/Libraries/FlexSlider/jquery.flexslider.js"

];
Contoso.Controllers = [
    //Typings and Definately Typed refrences. Required for Gulp Script
    "./typings/index.d.ts",    
    "./App/Scripts/Libraries/jQuery/jQueryAsyncPromises.ts",

    // Helpers
    "./App/Scripts/Helpers/Contoso/Contoso.ts",

    // Controllers
    "./App/Scripts/Controllers/Example/exampleList.ts",
    "./App/Scripts/Controllers/Example/exampleListGroup.ts",
    "./App/Scripts/Controllers/Example/exampleOwlDemo.ts",
    "./App/Scripts/Controllers/Example/exampleSlideShow.ts",
    "./App/Scripts/Controllers/SiteCreation/siteCreation.ts",

    //Init Code
    "./App/Scripts/Helpers/Contoso/bootstrap.ts"
];
Contoso.Init = [
    "./typings/index.d.ts",  
    "./App/Scripts/Helpers/Contoso/init.ts"
]
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
    };
} catch (e) {

}
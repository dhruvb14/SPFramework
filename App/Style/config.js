var Contoso = [
    // Controllers
    "./App/Style/Controllers/Example/branding.css",
    "./App/Style/Controllers/Example/menu.css",
    "./App/Style/Controllers/Example/grid.css",
    "./App/Style/Controllers/Example/exampleSlideShow.css",
    "./App/Style/Controllers/Example/exampleOwlDemo.css",

];
var Vendor =[
    "./App/Style/Libraries/Bootstrap/Bootstrap.css",
    "./App/Style/Libraries/Bootstrap-Datepicker/datepicker.css",
    "./App/Style/Libraries/Owl Carousel/owl.carousel.css",
    "./App/Style/Libraries/FlexSlider/flexslider.css"
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
        exports.Vendor = Vendor;
    }
} catch (e) {

}


var Controllers = Controllers || {};
(function ($) {
    Controllers = Controllers || {};
    Controllers.directiveSearch = Controllers.directiveSearch || {};
    if (OSC.isFirstLoad(Controllers.directiveSearch, "directiveSearch.js")) {
        Controllers.directiveSearch = {
            name: "Directive Search Autsocomplete",
            load: function () {
                Search.genericSearchTypeahead('generalSearch', 'CG Directive', 'CGDirectiveDNumberOWSTEXT,CGDirectivePublicationTitleOWSTEXT', true, "/library/directives/SitePages/directives.aspx?searchterm=", "-");
            },
            firstLoad: Controllers.directiveSearch.firstLoad
        }
    }
})(jQuery);
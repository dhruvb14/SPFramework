var Controllers = Controllers || {};
(function ($) {
    Controllers = Controllers || {};
    Controllers.formsSearch = Controllers.formsSearch || {};
    if (OSC.isFirstLoad(Controllers.formsSearch, "formsSearch.js")) {
        Controllers.formsSearch = {
            name: "Forms Search Autocomplete",
            load: function () {
                Search.genericSearchTypeahead('formsSearch', 'CG Form', 'CGFormFormNumberOWSTEXT,CGFormPublicationTitleOWSTEXT', false, "/library/forms/SitePages/Forms.aspx?searchterm=", "-");
            },
            firstLoad: Controllers.formsSearch.firstLoad
        }
    }
})(jQuery);
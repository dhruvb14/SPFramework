var Controllers = Controllers || {};
(function ($) {
    Controllers = Controllers || {};
    Controllers.generalSearch = Controllers.generalSearch || {};
    if (OSC.isFirstLoad(Controllers.generalSearch, "generalSearch.js")) {
        Controllers.generalSearch = {
            name: "General Search Autocomplete",
            load: function () {
                Search.genericSearchTypeahead('generalSearch', 'General Messages', 'Title', true, "/Search/Pages/cgmsresults.aspx?&k=", "-");
            },
            firstLoad: Controllers.generalSearch.firstLoad
        }
    }
})(jQuery);
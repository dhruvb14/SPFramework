var Search = {};
/**
 * @param  {string} controllerName
 * @param  {string} contentType
 * @param  {string (csv)} selectPropertiesForName
 * @param  {bool} showDocumentTypeIconBool
 * @param  {relative url} searchCenterUrl
 * @param  {string} delimiter
 */
Search.genericSearchTypeahead = function (controllerName, contentType, selectPropertiesForName, showDocumentTypeIconBool, searchCenterUrl, delimiter) {
    var options = {
        url: function (phrase) {
            //Sort Order does not work since the schema needs updating to allow sorting on the fields making up the title
            return "/_api/search/query?querytext='\"" + phrase + "\" AND ContentType:\"" + contentType + "\"'&selectproperties='path,SecondaryFileExtension," + selectPropertiesForName + "'&sortlist='modifiedby:ascending'";
        },
        getValue: "name",
        ajaxSettings: {
            headers: { "Accept": "application/json; odata=verbose" },
            /**
            * Pass in results from JSON call and format into JSON needed by easy auto complete widget for rendering
            * @param  {json} data
            * @return {json} results
            */
            dataFilter: function (data) {
                var searchResults = [];
                var rawResults = JSON.parse(data);
                rawResults = rawResults.d ? rawResults.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results : [];
                var selectProperties = selectPropertiesForName.split(",");
                if (rawResults) {
                    $.each(rawResults, function (index, row) {
                        var extension = "";
                        var path = "";
                        var titleObject = {};
                        $.each(row.Cells.results, function (index, attribute) {
                            //Check for select properties needed to generate viewable title
                            $.each(selectProperties, function (index, value) {
                                if (attribute.Key == value) {
                                    titleObject[value] = attribute.Value;
                                }
                            })
                            //Get path for when result is clicked
                            path = attribute.Key == 'path' ? attribute.Value : path;
                            //Get file extension for generating fileIcon
                            extension = attribute.Key == 'SecondaryFileExtension' ? attribute.Value : extension;
                        })
                        var imageExt = extension == "txt" ? "gif" : "png";
                        var searchResultVM = {
                            name: Search.searchQueryNameBuilder(selectProperties, titleObject, delimiter),
                            url: path,
                            fileIcon: '/_layouts/15/images/ic' + extension + '.' + imageExt,
                            fileExtension: extension
                        };
                        searchResults.push(searchResultVM);
                    })
                }
                return JSON.stringify(searchResults);
            }
        },
        template: {
            type: "custom",
            method: function (value, item) {
                var withImage = "<a href='" + item.url + "'><img class='eac-icon'src='" + item.fileIcon + "' alt=" + value.fileExtension + " /> " + value + "</a>";
                var withoutImage = "<a href='" + item.url + "' >" + value + "</a>";
                return showDocumentTypeIconBool ? withImage : withoutImage;
            }
        },
        list: {
            maxNumberOfElements: 5
        },
        //Debounce delay on keyup if wanted
        requestDelay: 0,
        theme: "round"
    };
    var vm = { controllerName: controllerName };
    var template = Handlebars.compile($('#autoCompleteTemplate').html());
    var html = template(vm);
    $('[data-controller="' + controllerName + '"]').html(html);
    $("[data-autocomplete=" + controllerName + "]").easyAutocomplete(options);
    $("[data-autocomplete=" + controllerName + "]").keypress(function (e) {
        if (e.which == 13) {
            var input = $("[data-autocomplete=" + controllerName + "]").val();
            if (input !== "") {
                window.location = searchCenterUrl + input;
            }
            return false;
        }
    });

}
/**
 * @param  {array} orderedArray
 * @param  {object} nameObject
 * @param  {string} delimiter
 */
Search.searchQueryNameBuilder = function (orderedArray, nameObject, delimiter) {
    var output = "";
    for (var i = 0; i < orderedArray.length; i++) {
        //Add the objects value to build out the custom title
        output += nameObject[orderedArray[i]];
        if (i != (orderedArray.length - 1)) {
            //Add the delimiter to all but the last item
            output += " " + delimiter + " ";
        }
    }
    //Return generated name
    return output;
}
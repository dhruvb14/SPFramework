// var pnp = require("pnp");
module Controllers {
    class siteCreationItem {
        constructor(
            private Title: string,
            private ID: number,
            private BaseUrl: string,
            private CategoryDescription: string,
            private Portal: string) {
        }
    }
    class SelectedTemplate {
        constructor(
            public SiteTitle: string,
            public SiteTemplateID: number,
            public URLPrefix: string,
            public URLSuffix: string,
            public SBU: boolean,
            public Restricted: boolean,
            public Portal: string,
            public URLValidation: boolean) {
        }
    }
    class siteCreationVM {
        PnPTemplates: Array<siteCreationItem> = new Array<siteCreationItem>();
        SelectedTemplate: SelectedTemplate;
    }
    export interface ISiteCreationController {
        name: string;
        load(): void;
        convertToSlug(Text: string): string;
        urlExists(url: string, callback: Function): void;
        // isUniqueSiteRequest(url: string, callback: Function): void;
        vm: Object;
    }
    class siteCreationController implements ISiteCreationController {
        constructor(private Helpers: Contoso.IHelpersController) { }
        name = "siteCreationController";
        convertToSlug(Text: string) {
            if (Text.charAt(0) === "_") {
                Controllers.siteCreation.enableVisibilityError();
                while (Text.charAt(0) === "_") {
                    
                    Text = Text.substr(1, Text.length);
                }
            }
            else {
                Controllers.siteCreation.disableVisibilityError()
            }
            return Text
                .toLowerCase()
                .replace(/[^\w ]+/g, '')
                .replace(/ +/g, '-');
        }
        enableVisibilityError() {
            $("#siteurlUnderscore").show();
        }
        disableVisibilityError() {
            $("#siteurlUnderscore").hide();
        }
        urlExists(url: string, callback: Function) {
            $.ajax({
                type: 'HEAD',
                url: url,
                success: function () {
                    var message = "Site Collection for " + url + "already exists";
                    Contoso.Helpers.log(message);
                    callback(false);
                },
                error: function () {
                    callback(true);
                }
            });
        }
        isUniqueSiteRequest(url: string, callback: Function) {
            $.ajax({
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Site Creation')/items?$filter=SiteURL eq '" + encodeURIComponent(url) + "'",
                type: "GET",
                contentType: "application/json;odata=verbose",
                headers: {
                    "Accept": "application/json;odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val()
                },
                success: function (data) {
                    var listItems = data.d.results;
                    callback(listItems.length == 0);

                },
                error: function (data) {
                    callback(true);
                }
            });
        }
        type2site() {
            $('#Restriction').hide();
            $('#SBU').show();
            //Update Save VM
            Controllers.siteCreation.vm.SelectedTemplate.Portal = "Type2Site";
        }
        type1site() {
            $('#Restriction').show();
            $('#SBU').hide();
            //Update Save VM
            Controllers.siteCreation.vm.SelectedTemplate.Portal = "Type1Site";
        }
        render(viewtemplate?: string) {
            viewtemplate = viewtemplate ? viewtemplate : "siteCreation";
            var container = "siteCreation";
            var template = Handlebars.compile($('#' + viewtemplate + "Template").html());
            var html = template(Controllers.siteCreation.vm);
            var $controller = "[" + Contoso.init.dataAttributeTag + "='" + container + "']";
            $($controller).html(html);
            if (viewtemplate == "siteCreation") { Controllers.siteCreation.viewLogic(); }
            $("#siteurlUnderscore").hide();
            var categoryDescription = $('#pnptemplate').find('option:selected').attr('description');
            $("#pnptemplateDescription").text(categoryDescription);
            Contoso.Helpers.log("Loaded " + viewtemplate);
        }
        viewLogic() {
            //Create VM to track changes so we don't have to do it when saving...
            Controllers.siteCreation.vm.SelectedTemplate = new SelectedTemplate(
                $('#title').val(),
                (Number($('#pnptemplate').find('option:selected').attr('templateID')) || -1),
                $('#pnptemplate').val(),
                $('#siteurl').val(),
                false,
                false,
                $('#pnptemplate').find('option:selected').attr('portal'),
                false
            )

            $('#pnptemplate').change(function (value) {
                var URLPrefix = $('#pnptemplate').val()
                var templateID = Number($('#pnptemplate').find('option:selected').attr('templateID'));
                var categoryDescription = $('#pnptemplate').find('option:selected').attr('description');
                $("#pnptemplateDescription").text(categoryDescription);
                $("#urlprefix").text(URLPrefix);
                var element = $(this).find('option:selected');
                var myTag = element.attr("portal");
                //Update Save VM
                $('input[type="radio"][name=RestrictionRadios]:eq(1)').click();
                $('input[type="radio"][name=SBURadios]:eq(1)').click();
                Controllers.siteCreation.vm.SelectedTemplate.SBU = false;
                Controllers.siteCreation.vm.SelectedTemplate.Restricted = false;
                Controllers.siteCreation.vm.SelectedTemplate.SiteTemplateID = templateID;
                Controllers.siteCreation.vm.SelectedTemplate.URLPrefix = URLPrefix;
                myTag === "Type2Site" ? Controllers.siteCreation.type2site() : Controllers.siteCreation.type1site();
            });
            function title(){
                var currentTitle = $('#title').val();
                var URLSuffix = Controllers.siteCreation.convertToSlug(currentTitle)
                Controllers.siteCreation.vm.SelectedTemplate.SiteTitle = currentTitle;
                Controllers.siteCreation.vm.SelectedTemplate.URLSuffix = URLSuffix;
                $("#siteurl").val(URLSuffix);
            }
            $('#title').on('keyup', function (value) {
                title();
            });
            $('#title').on('blur', function (value) {
                title();
            });
            $('input[type=radio][name=SBURadios]').change(function () {
                Controllers.siteCreation.vm.SelectedTemplate.SBU = Boolean($(this).val());
            });
            $('input[type=radio][name=RestrictionRadios]').change(function () {
                Controllers.siteCreation.vm.SelectedTemplate.Restricted = Boolean($(this).val());
            });
            $("#submit").on('click', function (event) {
                Controllers.siteCreation.urlExists($("#urlprefix").text() + $("#siteurl").val(), function (response: boolean) {
                    Controllers.siteCreation.vm.SelectedTemplate.URLValidation = response;
                    //Quick rest call to check if the endpoint already exists on the tenant, if so no need to check if its been requested but just not processed
                    if (response == false) {
                        alert("Site with that URL already exists, please update your title or request permissions to the existing site")
                        Controllers.siteCreation.vm.SelectedTemplate.URLValidation = response
                    }
                    //Since the URL does not exist its possible for someone to want to request it. Now we check to see if someone already requested it
                    else {
                        //Go to the site creation list and verify that this user has not already requested this exact site, if they have then throw error
                        Controllers.siteCreation.isUniqueSiteRequest($("#urlprefix").text() + $("#siteurl").val(), function (response2: boolean) {
                            //If SharePoint says that this user already requested to create this site then alert.
                            if (!response2) {
                                alert("A site with the specified URL has already been requested, please update your title, or check the status of your previous Site Creation Request");
                                Controllers.siteCreation.vm.SelectedTemplate.URLValidation = response2;
                            }
                            //If the site does not exist on SharePoint and they have not already requested it then lets attempt to validate the site requirements
                            //If requirements not met then show error otherwise go ahead and process the request
                            else {
                                //Last and final check which makes sure required fields are not blank or longer than supported by SP
                                Controllers.siteCreation.validateUIFields() ? Controllers.siteCreation.post() : Controllers.siteCreation.error();
                            }
                        })
                    }
                })
            });
            $('#pnptemplate').find('option:selected').attr('portal') === "Type1Site" ? Controllers.siteCreation.type1site() : Controllers.siteCreation.type2site();
        }
        post() {
            var listName = "Site Creation"
            var item = {
                "__metadata": { "type": "SP.Data.Site_x0020_CreationListItem" },
                "Title": Controllers.siteCreation.vm.SelectedTemplate.SiteTitle,
                "PnPProfileId": Controllers.siteCreation.vm.SelectedTemplate.SiteTemplateID,
                "Restricted0": Controllers.siteCreation.vm.SelectedTemplate.Restricted == true ? "Yes" : "No",
                "SBU_x0020_Community": Controllers.siteCreation.vm.SelectedTemplate.SBU == true ? "Yes" : "No",
                "SiteURL": Controllers.siteCreation.vm.SelectedTemplate.URLPrefix + Controllers.siteCreation.vm.SelectedTemplate.URLSuffix,
                "ContentTypeId": "0x0100B7235E8992FABB469447A05D2C9BE007",
                "CategoryDescription": $("#sitedescription").text()
            };
            $.ajax({
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + listName + "')/items",
                type: "POST",
                contentType: "application/json;odata=verbose",
                data: JSON.stringify(item),
                headers: {
                    "Accept": "application/json;odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val()
                },
                success: function (data: any) {
                    Controllers.siteCreation.render("siteCreationSuccess");
                },
                error: function (data: any) {
                    alert("Something went wrong with your request. Please try again");
                }
            });
        }

        error() {
            alert(" Form Fields are invalid! \n\n Site's title can not be blank\n\n Site URL's full length can not be longer than 128 characters \n\n Please verify and try again")
        }
        vm = new siteCreationVM();
        validateUIFields(): boolean {
            var valid = true;
            var vm = Controllers.siteCreation.vm.SelectedTemplate;
            valid = ((vm.Portal == "Type1Site") || (vm.Portal == "Type2Site")) && (vm.SiteTitle != "") && (vm.URLSuffix != "") && (vm.SiteTemplateID != -1) && (vm.URLValidation == true) && ((vm.URLPrefix + vm.URLSuffix).length < 128) ? true : false;
            return valid;
        }
        async getTemplates(): JQueryPromise<any> {
            var siteUrl = _spPageContextInfo.webAbsoluteUrl;
            return $.ajax({
                url: siteUrl + "/_api/web/lists/getbytitle('Site Templates')/items",
                method: "GET",
                headers: { "Accept": "application/json; odata=verbose" },
                success: function (data: any) {
                },
                error: function (data: any) {
                }
            });
            // return dfd;
        }
        async executeAsync(): JQueryPromise<any> {
            var vm = Controllers.siteCreation.vm;
            try {
                let data = await Controllers.siteCreation.getTemplates()
                var listItems = data.d.results;
                listItems.forEach(function (entry: any) {
                    var PnPTemplate = new siteCreationItem(entry.Title, entry.ID, entry.BaseUrl, entry.CategoryDescription, entry.Portal);
                    vm.PnPTemplates.push(PnPTemplate);
                });
                Controllers.siteCreation.render();
            }
            catch (err) {
                Contoso.Helpers.log("Error retrieving data for  " + Controllers.siteCreation.name);
            }
        }
        load() {
            //Don't call async methods directly in load as it ties up the main thread if a catch is hit.
            Controllers.siteCreation.executeAsync();
        }
    }
    export var siteCreation = new siteCreationController(Contoso.Helpers);
}
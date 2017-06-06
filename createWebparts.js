var jsdom = require('jsdom'),
    fs = require('fs'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    xmlConfig = {};

var createWebpart = function (webpart) {
    //MODERN WEBPART DOES NOT WORK IN 2010 MODE
    //var xml = '<webParts>';
    //xml += '\n     <webPart xmlns="http://schemas.microsoft.com/WebPart/v3">';
    //xml += '\n          <metaData>';
    //xml += '\n            <type name="Microsoft.SharePoint.WebPartPages.ScriptEditorWebPart, Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" />';
    //xml += '\n            <importErrorMessage>Cannot import this Web Part.</importErrorMessage>';
    //xml += '\n          </metaData>';
    //xml += '\n          <data>';
    //xml += '\n            <properties>';
    //xml += '\n              <property name="ExportMode" type="exportmode">All</property>';
    //xml += '\n              <property name="HelpUrl" type="string" />';
    //xml += '\n              <property name="Hidden" type="bool">False</property>';
    //xml += '\n              <property name="Description" type="string">' + webpart.description + '</property>';
    //xml += '\n              <property name="Content" type="string">&lt;div data-controller="' + webpart.controller + '" ' + webpart.attributes + '&gt;&lt;/div&gt;</property>';
    //xml += '\n              <property name="CatalogIconImageUrl" type="string" />';
    //xml += '\n              <property name="Title" type="string">' + webpart.title + '</property>';
    //xml += '\n              <property name="AllowHide" type="bool">True</property>';
    //xml += '\n              <property name="AllowMinimize" type="bool">True</property>';
    //xml += '\n              <property name="AllowZoneChange" type="bool">True</property>';
    //xml += '\n              <property name="TitleUrl" type="string" />';
    //xml += '\n              <property name="ChromeType" type="chrometype">None</property>';
    //xml += '\n              <property name="AllowConnect" type="bool">True</property>';
    //xml += '\n              <property name="Width" type="unit" />';
    //xml += '\n              <property name="Height" type="unit" />';
    //xml += '\n              <property name="HelpMode" type="helpmode">Navigate</property>';
    //xml += '\n              <property name="AllowEdit" type="bool">True</property>';
    //xml += '\n              <property name="TitleIconImageUrl" type="string" />';
    //xml += '\n              <property name="Direction" type="direction">NotSet</property>';
    //xml += '\n              <property name="AllowClose" type="bool">True</property>';
    //xml += '\n              <property name="ChromeState" type="chromestate">Normal</property>';
    //xml += '\n            </properties>';
    //xml += '\n          </data>';
    //xml += '\n     </webPart>';
    //xml += '\n</webParts>';
    var xml = '<?xml version="1.0" encoding="utf-8"?>'
    xml += '\n<WebPart xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/WebPart/v2">'
    xml += '\n      <Title>' + webpart.title + '</Title>'
    xml += '\n      <FrameType>TitleBarOnly</FrameType>'
    xml += '\n      <Description>' + webpart.description + '</Description>'
    xml += '\n      <IsIncluded>true</IsIncluded>'
    xml += '\n      <ZoneID>wpz</ZoneID>'
    xml += '\n      <PartOrder>22</PartOrder>'
    xml += '\n      <FrameState>Normal</FrameState>'
    xml += '\n      <Height />'
    xml += '\n      <Width />'
    xml += '\n      <AllowRemove>true</AllowRemove>'
    xml += '\n      <AllowZoneChange>true</AllowZoneChange>'
    xml += '\n      <AllowMinimize>false</AllowMinimize>'
    xml += '\n      <AllowConnect>false</AllowConnect>'
    xml += '\n      <AllowEdit>false</AllowEdit>'
    xml += '\n      <AllowHide>false</AllowHide>'
    xml += '\n      <IsVisible>true</IsVisible>'
    xml += '\n      <DetailLink />'
    xml += '\n      <HelpLink />'
    xml += '\n      <HelpMode>Modeless</HelpMode>'
    xml += '\n      <Dir>Default</Dir>'
    xml += '\n      <PartImageSmall />'
    xml += '\n      <MissingAssembly>Cannot import this Web Part.</MissingAssembly>'
    xml += '\n      <PartImageLarge>/_layouts/images/mscontl.gif</PartImageLarge>'
    xml += '\n      <IsIncludedFilter />'
    xml += '\n      <Assembly>Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c</Assembly>'
    xml += '\n      <TypeName>Microsoft.SharePoint.WebPartPages.ContentEditorWebPart</TypeName>'
    xml += '\n      <ContentLink xmlns="http://schemas.microsoft.com/WebPart/v2/ContentEditor" />'
    xml += '\n      <Content xmlns="http://schemas.microsoft.com/WebPart/v2/ContentEditor" >&lt;div data-controller="' + webpart.controller + '" ' + webpart.attributes + '&gt;&lt;/div&gt;</Content>'
    xml += '\n      <PartStorage xmlns="http://schemas.microsoft.com/WebPart/v2/ContentEditor" />'
    xml += '\n</WebPart>'
    writeWebpartsToDisk(webpart, xml);
};
var writeWebpartsToDisk = function (webpart, xml) {
    $.each(webpart.outputDirectory, function (index, value) {
        var filePath = "Output/" + index + "/WebParts/" + webpart.controller + ".webpart";
        if (value) {
            var count = 0;
            function writeFile() {
                try {
                    //Written syncronously so it can create directory 
                    //structure if it does not exist and not print out false failures
                    fs.writeFileSync(filePath, xml);
                    console.log("\nSUCCESS: Created " + filePath)
                }
                catch (err) {
                    console.log("Attempting to create Directory automatically for " + index)
                    if (count == 0) {
                        try {
                            fs.mkdirSync("Output/" + index);
                        }
                        catch (err) { }
                        try {
                            fs.mkdirSync("Output/" + index + "/WebParts");
                        } catch (err) { }
                        writeFile();
                    } else {
                        console.log("\nFAIL:Verify Folder Exists For " + index + " in Output/");
                        console.log("Failed to Automatically to create Directory");
                    }
                }
            }
            writeFile();
        } else {
            fs.access(filePath, fs.F_OK, function (err) {
                if (!err) {
                    fs.unlink(filePath, function (err) {
                        console.log("\nDELETED: " + filePath);
                    });
                }
            });
        }
    });
};
function createPnpConfig(webpart) {

    $.each(webpart.outputDirectory, function (index, value) {
        var filePath = "Output/" + index + "/WebParts/" + webpart.controller + ".webpart";
        if (value) {
            var xml = '<pnp:File Src=".' + filePath + '" Folder="/_catalogs/wp" Overwrite="true">\n';
            xml += '\t<pnp:Properties>\n'
            xml += '\t\t<pnp:Property Key="Group" Value="' + index + '" />\n'
            xml += '\t</pnp:Properties>\n'
            xml += '</pnp:File>\n'
            //Force writing of output to config incase you removed widgets so widgets properly get deleted
            xmlConfig[index] ? xmlConfig[index] += xml : xmlConfig[index] = xml;
        }
    });
}

gulp.task('webparts', function () {
    delete require.cache[require.resolve('./App/WebParts/config.js')];
    var webpartsArray = require('./App/WebParts/config.js');
    return jsdom.env({
        html: "<html><body></body></html>",
        scripts: [
          'App/Scripts/Libraries/jQuery/jquery-2.2.3.js'
        ],
        done: function (err, window) {
            for (var i = 0; i < webpartsArray.projects.length; i++) {
                xmlConfig[webpartsArray.projects[i]] = ""
            }
            console.log("PLEASE REMEMBER TO TOGGLE HIDDEN FILES IN VS AND ADD ALL NEW WEBPARTS TO SOURCECONTROL");
            global.$ = window.jQuery;
            $.each(webpartsArray.webparts, function (index, value) {
                if (value.webpartConfig && value.include && value.controllerName) {
                    var vm = { title: "", description: "", attributes: "", controller: value.controllerName, outputDirectory: value.include };
                    vm.title = value.title ? value.title : value.controllerName;
                    vm.description = value.description ? value.description : "No Description";
                    $.each(value.webpartConfig, function (attribute, val) {
                        vm.attributes += attribute + "=\"" + val + "\" ";
                    });
                    createWebpart(vm); //Create or delete webparts on FS. Also create dir structure if missing
                    createPnpConfig(vm); //Write pnp config to local variable for output in following each loop
                } else { console.log("\nFAIL:" + value.title + " has no autogeneration properties") }
            });
            //});
            //Loop through all configurations and write out a config file reguardless of if its empty or not
            $.each(xmlConfig, function (index, value) {
                var filePath = "Output/" + index + "/webparts.xml";
                fs.writeFile(filePath, value.replace(/^\s+|\s+$/g, ""), function (err) {
                    if (err) {
                        return console.log("\nFAIL:Verify Folder Exists For " + index + " in Output/");
                    }
                    console.log("\nSUCCESS: Created webpart deployment file " + filePath);
                });
            });
        }
    });
});

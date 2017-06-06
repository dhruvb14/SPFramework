/// <reference path="../App/Scripts/Controllers/SiteCreation/siteCreation.ts" />
QUnit.config.autostart = false;
QUnit.config.reorder = false;
setTimeout(function () {
  QUnit.start();
  console.log("Delayed execution for 2 seconds");
}, 2000);
QUnit.module("Bundle Tests");
QUnit.test("Bundle.js Loaded", function (assert) {
  assert.notEqual(Controllers, "undefined");
  assert.notEqual(Contoso.Helpers, "undefined");
});
QUnit.test("jQuery Loaded", function (assert) {
  assert.notEqual(jQuery, "undefined");
});
QUnit.module("Site Creation Controller Tests");

QUnit.test("JS Included", function (assert) {
  assert.notEqual(Controllers.siteCreation, "undefined");
});
QUnit.test("URL Generator ", function (assert) {
  assert.equal(Controllers.siteCreation.convertToSlug("_Dhruv's Test Site"), "dhruvs-test-site");
  assert.equal(Controllers.siteCreation.convertToSlug("_____Dhruv's Test Site"), "dhruvs-test-site");
  assert.equal(Controllers.siteCreation.convertToSlug("Dhruv's Test Site"), "dhruvs-test-site");
  assert.equal(Controllers.siteCreation.convertToSlug("Dhruv'!&*#%$^!s 78Test Site"), "dhruvs-78test-site");
  assert.equal(Controllers.siteCreation.convertToSlug("Dhruv'!&*#%$^!s - - -- 78Test Site"), "dhruvs-78test-site");
  assert.equal(Controllers.siteCreation.convertToSlug("Dhruv'!&*#%$^!--s 78Test Site"), "dhruvs-78test-site");
  assert.equal(Controllers.siteCreation.convertToSlug("Dhruv'!@#$%^&*(){}|;'s 78Test Site"), "dhruvs-78test-site");
});
QUnit.test("URL Checker ", function (assert) {
  assert.expect(5);
  var done1 = assert.async();
  var done2 = assert.async();
  var done3 = assert.async();
  var done4 = assert.async();
  var done5 = assert.async();
  Controllers.siteCreation.urlExists("/status/200", function (response) {
    assert.notEqual(response, true);
    done1();
  });
  Controllers.siteCreation.urlExists("/status/404", function (response) {
    assert.notEqual(response, false);
    done2();
  });
  Controllers.siteCreation.urlExists("/status/401", function (response) {
    assert.notEqual(response, false);
    done3();
  });
  Controllers.siteCreation.urlExists("/status/500", function (response) {
    assert.notEqual(response, false);
    done4();
  });
  Controllers.siteCreation.urlExists("/status/201", function (response) {
    assert.notEqual(response, true);
    done5();
  });
});
QUnit.test("URL Prefix On Load ", function (assert) {
  assert.equal($("#urlprefix").text(), "https://contoso.com/communities/sites/");
});
QUnit.test("UI Change BaseUrl on DropDown Selection ", function (assert) {
  $('#pnptemplate').prop('selectedIndex', 4).change();
  assert.equal($("#urlprefix").text(), "http://localhost/");
});
QUnit.test("UI Change Site Name, verify slug creation ", function (assert) {
  $('#title').val("Dhruv's Test Site").keyup();
  assert.equal($("#siteurl").val(), "dhruvs-test-site");
});
QUnit.test("UI Change SBU and Restriction updates when changing Template ", function (assert) {
  $('#pnptemplate').prop('selectedIndex', 2).change();
  assert.equal($('#Restriction').is(':visible'), false);
  assert.equal($('#SBU').is(':visible'), true);
  $('#pnptemplate').prop('selectedIndex', 0).change();
  assert.equal($('#Restriction').is(':visible'), true);
  assert.equal($('#SBU').is(':visible'), false);
});
QUnit.test("Custom Binding Model Change State ", function (assert) {
  $('#title').val("Dhruv's Model Test Site").keyup();
  $('#pnptemplate').prop('selectedIndex', 4).change();
  assert.equal(Controllers.siteCreation.vm.SelectedTemplate.SiteTitle, "Dhruv's Model Test Site");
  assert.equal(Controllers.siteCreation.vm.SelectedTemplate.SiteTemplateID, 11);
  assert.equal(Controllers.siteCreation.vm.SelectedTemplate.URLPrefix, "http://localhost/");
  assert.equal(Controllers.siteCreation.vm.SelectedTemplate.URLSuffix, "dhruvs-model-test-site");
  assert.equal(Controllers.siteCreation.vm.SelectedTemplate.SBU, false);
  assert.equal(Controllers.siteCreation.vm.SelectedTemplate.Restricted, false);
  assert.equal(Controllers.siteCreation.vm.SelectedTemplate.URLValidation, false);
  $('input[type="radio"][name=RestrictionRadios]:eq(0)').click();
  assert.equal(Controllers.siteCreation.vm.SelectedTemplate.Restricted, true);
  $('#title').val("Dhruv's Models Test Site").keyup();  
  $('#pnptemplate').prop('selectedIndex', 3).change();
  assert.equal(Controllers.siteCreation.vm.SelectedTemplate.SiteTitle, "Dhruv's Models Test Site");
  assert.equal(Controllers.siteCreation.vm.SelectedTemplate.SiteTemplateID, 10);
  assert.equal(Controllers.siteCreation.vm.SelectedTemplate.URLPrefix, "https://mod383492.sharepoint.com/");
  assert.equal(Controllers.siteCreation.vm.SelectedTemplate.URLSuffix, "dhruvs-models-test-site");
  assert.equal(Controllers.siteCreation.vm.SelectedTemplate.SBU, false);
  assert.equal(Controllers.siteCreation.vm.SelectedTemplate.Restricted, false);
  assert.equal(Controllers.siteCreation.vm.SelectedTemplate.URLValidation, false);
  $('input[type="radio"][name=SBURadios]:eq(0)').click();
  assert.equal(Controllers.siteCreation.vm.SelectedTemplate.SBU, true);
});
QUnit.test("Validation before sending", function (assert) {
  $('#title').val("").keyup();
  $('#pnptemplate').prop('selectedIndex', 4).change();
  $('input[type="radio"][name=RestrictionRadios]:eq(0)').click();
  assert.equal(Controllers.siteCreation.validateUIFields(), false);
  $('#title').val("Dhruv's Test Site").keyup();
  Controllers.siteCreation.urlExists($("#urlprefix").text() + $("#siteurl").val(), function (response) {
      Controllers.siteCreation.vm.SelectedTemplate.URLValidation = response;
      assert.equal(Controllers.siteCreation.validateUIFields(), true);
  })
});
QUnit.test("Submit Form", function (assert) {
  assert.expect(1);
  $('#title').val("Dhruv's Submission Test Site").keyup();
  $('#pnptemplate').prop('selectedIndex', 3).change();
  $('#pnptemplate').prop('selectedIndex', 4).change();
  $('input[type="radio"][name=RestrictionRadios]:eq(0)').click();
  var expected = {
      "__metadata": { "type": "SP.Data.Site_x0020_CreationListItem" },
      "Title": "Dhruv's Submission Test Site",
      "PnPProfileId": 11,
      "Restricted0": "Yes",
      "SBU_x0020_Community": "No",
      "SiteURL": "http://localhost/dhruvs-submission-test-site",
      "ContentTypeId": "0x0100B7235E8992FABB469447A05D2C9BE007",
      "CategoryDescription": "",
  };
  Controllers.siteCreation.vm.SelectedTemplate.URLValidation = true;
  $.mockjax({
    url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Site Creation')/items",
    data: function ( json ) {
      assert.deepEqual( JSON.parse(json), expected ); // QUnit example.
      return true;
    },
    type: "POST"    
  });
  Controllers.siteCreation.post();
});
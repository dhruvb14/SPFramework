$(document).ready(function () {
  $.mockjax({
    url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Site Templates')/items",
    responseText: SiteTemplatesList,
    type: "GET"
  });
  $.mockjax({
    url: "/status/200",
    responseText: "Success",
  });
  $.mockjax({
    url:"/status/201",
    status: 201,
    responseText: "Success",
  });
  $.mockjax({
    url: "/status/401",
    status: 401,
    responseText: "Unauthorized",
  });
  $.mockjax({
    url: "/status/404",
    status: 404,
    responseText: "Not Found",
  });
  $.mockjax({
    url: "http://localhost/dhruvs-test-site", //have to put whole url for dropdown validation
    status: 404,
    responseText: "Not Found",
  });
  $.mockjax({
    url: "/status/500",
    status: 500,
    responseText: "Internal Server Error",
  });
})
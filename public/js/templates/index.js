define(["handlebars"], function(Handlebars) { return Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, buffer = "<!doctype html>\n<html lang=\"en\">\n<head>\n	<meta charset=\"UTF-8\">\n	<title>HAR viewer</title>\n	<link rel=\"stylesheet\" href=\"/css/out.css\" />\n	<script type=\"text/javascript\" src=\"/js/libs/require.js\" data-main=\"/js/app.js\"></script>\n	<script type=\"text/plain\" id=\"har-viewer-config\">";
  stack1 = ((helper = (helper = helpers.config || (depth0 != null ? depth0.config : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"config","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</script>\n</head>\n<body>\n</body>\n</html>";
},"useData":true}); });
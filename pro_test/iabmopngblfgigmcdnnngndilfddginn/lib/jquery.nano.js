//---- double load protection
if (!window.scmhp) window.scmhp = {count:0}; if (typeof window.scmhp["nano"] === "undefined") { window.scmhp["nano"] = window.scmhp['count']++;

(function($){
  $.nano = function(template, data) {
    return template.replace(/\{([\w\.]*)\}/g, function (str, key) {
      var keys = key.split("."), value = data[keys.shift()];
      $.each(keys, function () { value = value[this]; });
      return (value === null || value === undefined) ? "" : value;
    });
  };
})(jQuery);

} //-- double load protection
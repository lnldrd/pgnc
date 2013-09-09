/**
 ** PGNC namespace.
 **/
if (typeof PGNC == "undefined") {
   var PGNC = {
      warn : function(log) {
         nb.appendNotification(log,'warning', 'chrome://global/skin/icons/Warning.png', nb.PRIORITY_WARNING_HIGH,{});
      },
      error : function(log) {
         nb.appendNotification(log,'error', 'chrome://global/skin/icons/Error.png', nb.PRIORITY_CRITICAL_HIGH,{});
      }
   };
};

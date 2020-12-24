
var http = (function(){
    return {
        // Get method
        get: function(url, CRSFToken, callBack, fail) {
            var timeout = Math.random() * 500 + 500;
            setTimeout(function(){
                $.ajax({
                    url: url,
                    type: 'GET',
                    timeout: consts.httpTimeout,
                    error: fail,
                    beforeSend: function(xhr) {
                        if(CRSFToken) {
                            xhr.setRequestHeader('csrf-token', CRSFToken);
                        }
                    },
                    success: callBack
                });
            }, timeout);
        },

        // Post
        post: function(url, data, success, fail) {

            var xmlHttp = new XMLHttpRequest();
            xmlHttp.responseType = 'blob';

            xmlHttp.onload = function(e) {
                success(this.response);
            };
            xmlHttp.onerror = function() {
                fail();
            };
            xmlHttp.open('POST', url, true);
            xmlHttp.send(JSON.stringify(data));
        },

        // Post form data
        postFormData: function(url, data, success, fail) {

            var fdata = '';
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.responseType = 'blob';

            // Object to form data
            for(var k in data) {
                fdata += k + '=' + data[k] + '&'
            }

            fdata = fdata.substr(0, fdata.length - 1);

            xmlHttp.onload = function(e) {
                success(this.response);
            };
            xmlHttp.onerror = function() {
                fail();
            };
            xmlHttp.open('POST', url, true);
            xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlHttp.send(fdata);
        }
    };
}());

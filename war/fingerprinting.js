var fingerprint_cache = {};

//提取uuid的函数
function extension_id_from_uri( input_uri ) {
	input_uri = input_uri.replace( "chrome-extension://", "" );
	var parts = input_uri.split( "/" );
	if( parts.length > 0 ) {
		return parts[0];
	}
	return false;
}

function start_fingerprinting( wars ) {
	var head = document.getElementsByTagName( "head" )[0];

	fingerprint_cache[ wars.extension_id ] = {
		"callback": wars.callback,
		"resources": {},
    }
    
    //初始化为false
	for( var i = 0; i < wars.resources.length; i++ ) {
		fingerprint_cache[ wars.extension_id ][ "resources" ][ wars.resources[i].resource ] = false;
	}

	for( var i = 0; i < wars.resources.length; i++ ) {
		var new_link = document.createElement( "link" );
		new_link.setAttribute( "rel", "stylesheet" );
		new_link.setAttribute( "type", "text/css" );
		new_link.setAttribute( "href", wars.resources[i].resource );
		new_link.onload = function() {
			var extension_id = extension_id_from_uri( this.href );
			var resource_path = this.href;

			fingerprint_cache[ extension_id ][ "resources" ][ resource_path ] = true;

			var fingerprint_successful = true;
			for( var key in fingerprint_cache[ extension_id ][ "resources" ] ) {
				if( fingerprint_cache[ extension_id ][ "resources" ].hasOwnProperty( key ) && fingerprint_cache[ extension_id ][ "resources" ][ key ] === false ) {//严格比较全部war资源
					fingerprint_successful = false;
					break;
				}
			}
			if( fingerprint_successful ) {
				fingerprint_cache[ extension_id ][ "callback" ]();//检测到扩展程序调用后续函数
			}
		}
		head.appendChild(new_link);
	}
}


//主程序
function start() {
    start_fingerprinting(lingocloud);
}

//自动启动
if( window.attachEvent ) {
    window.attachEvent( "onload", start );
} else {
    if( window.onload ) {
        var curronload = window.onload;
        var newonload = function( evt ) {
            curronload( evt );
            start( evt );
        };
        window.onload = newonload;
    } else {
        window.onload = start;
    }
}
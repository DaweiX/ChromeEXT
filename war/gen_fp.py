#!/usr/bin/env python

import re
import os
import sys
import uuid
import time
import json
import yaml
import requests
import zipfile


sys.setdefaultencoding( "utf8" )
current_dir = os.path.dirname(
	os.path.realpath(
		__file__
	)
)
chrome_extension_id = ""
FINGERPRINT_BASE_JS = "./fingerprinting.js"
report_data = {
	"extension_id": chrome_extension_id,
	"manifest": {},
	"web_accessible_resources": [],

}

#扫描war资源
chrome_extension_handler = get_chrome_extension(
	chrome_extension_id
)


chrome_extension_zip = zipfile.ZipFile(
		chrome_extension_handler
	)

for file_path in chrome_extension_zip.namelist():
		file_data = chrome_extension_zip.read( file_path )
		if not ends_in_ext_list( file_path, prettified_exts ):
			beautified_extension.writestr(
				file_path,
				file_data
			)

web_accessible_resources_paths = []
if "web_accessible_resources" in manifest_data:
	report_data[ "web_accessible_resources" ] = manifest_data[ "web_accessible_resources" ]
	for web_accessible_resource in manifest_data[ "web_accessible_resources" ]:

		if "*" in web_accessible_resource:
			pre_regex = web_accessible_resource.replace( "*", "starplaceholderstring" )
			pre_regex = pre_regex.lower()
			regex_web_accessible_resource = re.compile( re.escape( pre_regex ).replace( "starplaceholderstring", ".*" ) )
			for chrome_extension_path in chrome_ext_file_list:
				if regex_web_accessible_resource.search( "\/" + chrome_extension_path.lower() ):
					web_accessible_resources_paths.append(
						chrome_extension_path
					)
		elif web_accessible_resource.lower() in get_lowercase_list( chrome_ext_file_list ):
			web_accessible_resources_paths.append(
				web_accessible_resource
			)

#去重
web_accessible_resources_paths = list( set( web_accessible_resources_paths ) )
web_accessible_resources_paths = [resource for resource in web_accessible_resources_paths if not resource.endswith( "/" )]

# 生成指纹检测脚本
report_data[ "web_accessible_resources_paths" ] = web_accessible_resources_paths
report_data[ "fingerprint_js" ] = FINGERPRINT_BASE_JS
report_data[ "fingerprint_js" ] = "var extension_fingerprint_resources = " + json.dumps({
	"extension_id": chrome_extension_id,
	"resources": report_data[ "fingerprint_json" ],
	"callback": "{{REPLACE_ME_CALLBACK_HOLDER}}"
}, indent=4) + ";\n" + report_data[ "fingerprint_js" ]

report_data[ "fingerprint_js" ] = report_data[ "fingerprint_js" ].replace(
	"\"{{REPLACE_ME_CALLBACK_HOLDER}}\"",
	"""function () {
	console.log('XXX is installed！');
}"""
)
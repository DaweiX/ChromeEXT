//---- double load protection
if (!window.scmph) window.scmph = {count:0}; if (typeof window.scmph["scm.providers"] === "undefined") { window.scmph["scm.providers"] = window.scmph['count']++;

var SCM_PROVIDERS = {
    'github': {
        rx_urls: [
            /(http|https):\/\/github.com\/([^\/]+)\/([^\/]+)\/*.*$/i, // https://github.com/username/projectname
            /(http|https):\/\/github.com\/([^\/]+)\/([^\/]+)\/*.*$/i, // https://github.com/username/projectname
            /(http|https):\/\/(.*)\.github.com\/([^\/]+)\/*.*$/i // http://username.github.com/projectname/
        ],
        project_url: '{0}://github.com/{1}/{2}/commits',
        momento_format: 'MMM DD, YYYY',

        last_commit_time_handler: function(html) {
            var t = $('div.commit-group-title:first', html).text().trim().split("Commits on ");
            return (t.length == 2) ? t[1] : "";
        },

        extra_info_handler: function(html) {
            var watch = $('.pagehead-actions > li:nth-child(1) .social-count', html).text().trim().replace(',',''),
                stars = $('.pagehead-actions > li:nth-child(2) .social-count:first', html).text().trim().replace(',',''),
                forks = $('.pagehead-actions > li:nth-child(3) .social-count', html).text().trim().replace(',',''),
                issues = $('.reponav span:nth-child(2) .counter', html).text().trim().replace(',',''),
                pr = $('.reponav span:nth-child(3) .counter', html).text().trim().replace(',','');


            return {
                watch: watch,
                stars: stars,
                forks: forks,
                issues: issues,
                pr: pr
            };
        }
    },

    'bitbucket': {
        rx_urls: [
            /(http|https):\/\/bitbucket.org\/([^\/]+)\/([^\/]+)\/*$/i, // https://bitbucket.org/username/projectname
        ],
        project_url: '{0}://bitbucket.org/{1}/{2}/commits/all',
        momento_format: 'YYYY-MM-DDTHH:mm:ssZ',

        last_commit_time_handler: function(html) {
        	return $('#chg_1 > td.date > div > time', html).attr('datetime');
        },

        extra_info_handler: function(html) {
            var watch = $('#followers-dialog-trigger > span', html).text().trim().replace(',',''),
                forks = $('#forks-dialog-trigger > span', html).text().trim().replace(',',''),
                issues = $('#issues-count', html).text().trim().replace(',',''),
                pr = $('#pullrequests-count', html).text().trim().replace(',','');

            return {
                watch: watch,
                forks: forks,
                issues: issues,
                pr: pr
            };
        }
    },

    'google': {
        rx_urls: [
            /(http|https):\/\/code.google.com\/p\/([^\/]+)\/*$/i
        ],
        project_url: '{0}://code.google.com/p/{1}/source/list',
        momento_format: 'ddd MMM DD HH:mm:ss YYYY', // Wed Jun 25 14:20:08 2014

        last_commit_time_handler: function(html) {
        	return $('#resultstable > tbody > tr:nth-child(2) > td[title]:first', html).attr('title');
        },

        extra_info_handler: function(html) {
            return null;
        }
    },

    'sourceforge': {
        rx_urls: [
            /(http|https):\/\/sourceforge.net\/projects\/([^\/]+)\/*$/i,
            /(http|https):\/\/sourceforge.net\/p\/([^\/]+)\/*$/i,
        ],
        project_url: '{0}://sourceforge.net/projects/{1}/',
        momento_format: 'YYYY-MM-DD',

        last_commit_time_handler: function(html) {
        	return $('#last-updated > section > time', html).attr('datetime');
        },

        extra_info_handler: function(html) {
            return null;
        }
    },

    'launchpad': {
    	rx_urls: [
            /(http|https):\/\/launchpad.net\/([^\/]+)\/*$/i
    	],

    	project_url: '{0}://launchpad.net/{1}/+all-branches?field.lifecycle=ALL&field.lifecycle-empty-marker=1&field.sort_by=newest+first&field.sort_by-empty-marker=1',
    	momento_format: 'YYYY-MM-DD HH:mm:ss',

    	last_commit_time_handler: function(html) {
    		return $('#branchtable > tbody > tr:nth-child(1) > td:nth-child(4) > span:nth-child(2)', html).attr('title');
    	},

        extra_info_handler: function(html) {
            return null;
        }
    },

    // add proxy feature, to request
    'pypi': {
        proxy_page: true,
        rx_urls: [
            /(http|https):\/\/pypi.python.org\/pypi\/([^\/]+\/*.*)$/i
        ],

        project_url: '{0}://pypi.python.org/pypi/{1}',
        momento_format: 'YYYY-MM-DD',

        last_commit_time_handler: function(html) {
            return $('#content > div.section > table > tbody > tr.odd > td:nth-child(4)', html).text().trim();
        },

        extra_info_handler: function(html) {
            return null;
        }
    }
}

} //-- double load protection

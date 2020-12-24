/**
 * Created by admin on 8/24/15.
 */
(function() {

    this.Config = {

        set: function(name, value) {
            this[name] = value;
        },

        get: function(name) {
            var value;

            if (typeof this[name] == 'function') {
                value = this[name]();
            }
            else {
                value = this[name];
            }

            return value;
        }
    };

    this.Config.set('utmSource', 'plugin');
    this.Config.set('utmCampaign', 'smc');

    this.Config.set('customCouponImagePath', 'http://cdn.meucupom.com/uploads/custom-coupon-images');

    this.Config.set('autoOpen', false);
    this.Config.set('autoOpenTime', undefined);
    this.Config.set('autoOpenRest', undefined);

    this.Config.set('cachedApiBase', 'https://api.meucupom.com/services/api');
    this.Config.set('noCacheApiBase', 'https://api2.meucupom.com/services/api');

    this.Config.set('siteBaseUrl', 'https://www.meucupom.com');

})();
// Rivets.js + Sightglass.js
// version: 0.7.1
// author: Michael Richards
// license: MIT
(function(){function t(t,i,s,n){return new e(t,i,s,n)}function e(t,e,s,n){this.options=n||{},this.options.adapters=this.options.adapters||{},this.obj=t,this.keypath=e,this.callback=s,this.objectPath=[],this.parse(),i(this.target=this.realize())&&this.set(!0,this.key,this.target,this.callback)}function i(t){return"object"==typeof t&&null!==t}function s(t){throw new Error("[sightglass] "+t)}t.adapters={},e.tokenize=function(t,e,i){for(tokens=[],current={i:i,path:""},index=0;index<t.length;index++)chr=t.charAt(index),~e.indexOf(chr)?(tokens.push(current),current={i:chr,path:""}):current.path+=chr;return tokens.push(current),tokens},e.prototype.parse=function(){interfaces=this.interfaces(),interfaces.length||s("Must define at least one adapter interface."),~interfaces.indexOf(this.keypath[0])?(root=this.keypath[0],path=this.keypath.substr(1)):("undefined"==typeof(root=this.options.root||t.root)&&s("Must define a default root adapter."),path=this.keypath),this.tokens=e.tokenize(path,interfaces,root),this.key=this.tokens.pop()},e.prototype.realize=function(){return current=this.obj,unreached=!1,this.tokens.forEach(function(t,e){i(current)?("undefined"!=typeof this.objectPath[e]?current!==(prev=this.objectPath[e])&&(this.set(!1,t,prev,this.update.bind(this)),this.set(!0,t,current,this.update.bind(this)),this.objectPath[e]=current):(this.set(!0,t,current,this.update.bind(this)),this.objectPath[e]=current),current=this.get(t,current)):(unreached===!1&&(unreached=e),(prev=this.objectPath[e])&&this.set(!1,t,prev,this.update.bind(this)))},this),unreached!==!1&&this.objectPath.splice(unreached),current},e.prototype.update=function(){(next=this.realize())!==this.target&&(i(this.target)&&this.set(!1,this.key,this.target,this.callback),i(next)&&this.set(!0,this.key,next,this.callback),oldValue=this.value(),this.target=next,this.value()!==oldValue&&this.callback())},e.prototype.value=function(){return i(this.target)?this.get(this.key,this.target):void 0},e.prototype.setValue=function(t){i(this.target)&&this.adapter(this.key).set(this.target,this.key.path,t)},e.prototype.get=function(t,e){return this.adapter(t).get(e,t.path)},e.prototype.set=function(t,e,i,s){action=t?"observe":"unobserve",this.adapter(e)[action](i,e.path,s)},e.prototype.interfaces=function(){return interfaces=Object.keys(this.options.adapters),Object.keys(t.adapters).forEach(function(t){~interfaces.indexOf(t)||interfaces.push(t)}),interfaces},e.prototype.adapter=function(e){return this.options.adapters[e.i]||t.adapters[e.i]},e.prototype.unobserve=function(){this.tokens.forEach(function(t,e){(obj=this.objectPath[e])&&this.set(!1,t,obj,this.update.bind(this))},this),i(this.target)&&this.set(!1,this.key,this.target,this.callback)},"undefined"!=typeof module&&module.exports?module.exports=t:"function"==typeof define&&define.amd?define([],function(){return this.sightglass=t}):this.sightglass=t}).call(this);
(function(){var t,e,i,n,r=function(t,e){return function(){return t.apply(e,arguments)}},s=[].slice,o={}.hasOwnProperty,u=function(t,e){function i(){this.constructor=t}for(var n in e)o.call(e,n)&&(t[n]=e[n]);return i.prototype=e.prototype,t.prototype=new i,t.__super__=e.prototype,t},h=[].indexOf||function(t){for(var e=0,i=this.length;i>e;e++)if(e in this&&this[e]===t)return e;return-1};t={options:["prefix","templateDelimiters","rootInterface","preloadData","handler"],extensions:["binders","formatters","components","adapters"],"public":{binders:{},components:{},formatters:{},adapters:{},prefix:"rv",templateDelimiters:["{","}"],rootInterface:".",preloadData:!0,handler:function(t,e,i){return this.call(t,e,i.view.models)},configure:function(e){var i,n,r,s;null==e&&(e={});for(r in e)if(s=e[r],"binders"===r||"components"===r||"formatters"===r||"adapters"===r)for(n in s)i=s[n],t[r][n]=i;else t["public"][r]=s},bind:function(e,i,n){var r;return null==i&&(i={}),null==n&&(n={}),r=new t.View(e,i,n),r.bind(),r}}},window.jQuery||window.$?(n="on"in jQuery.prototype?["on","off"]:["bind","unbind"],e=n[0],i=n[1],t.Util={bindEvent:function(t,i,n){return jQuery(t)[e](i,n)},unbindEvent:function(t,e,n){return jQuery(t)[i](e,n)},getInputValue:function(t){var e;return e=jQuery(t),"checkbox"===e.attr("type")?e.is(":checked"):e.val()}}):t.Util={bindEvent:function(){return"addEventListener"in window?function(t,e,i){return t.addEventListener(e,i,!1)}:function(t,e,i){return t.attachEvent("on"+e,i)}}(),unbindEvent:function(){return"removeEventListener"in window?function(t,e,i){return t.removeEventListener(e,i,!1)}:function(t,e,i){return t.detachEvent("on"+e,i)}}(),getInputValue:function(t){var e,i,n,r;if("checkbox"===t.type)return t.checked;if("select-multiple"===t.type){for(r=[],i=0,n=t.length;n>i;i++)e=t[i],e.selected&&r.push(e.value);return r}return t.value}},t.TypeParser=function(){function t(){}return t.types={primitive:0,keypath:1},t.parse=function(t){return/^'.*'$|^".*"$/.test(t)?{type:this.types.primitive,value:t.slice(1,-1)}:"true"===t?{type:this.types.primitive,value:!0}:"false"===t?{type:this.types.primitive,value:!1}:"null"===t?{type:this.types.primitive,value:null}:"undefined"===t?{type:this.types.primitive,value:void 0}:isNaN(Number(t))===!1?{type:this.types.primitive,value:Number(t)}:{type:this.types.keypath,value:t}},t}(),t.TextTemplateParser=function(){function t(){}return t.types={text:0,binding:1},t.parse=function(t,e){var i,n,r,s,o,u,h;for(u=[],s=t.length,i=0,n=0;s>n;){if(i=t.indexOf(e[0],n),0>i){u.push({type:this.types.text,value:t.slice(n)});break}if(i>0&&i>n&&u.push({type:this.types.text,value:t.slice(n,i)}),n=i+e[0].length,i=t.indexOf(e[1],n),0>i){o=t.slice(n-e[1].length),r=u[u.length-1],(null!=r?r.type:void 0)===this.types.text?r.value+=o:u.push({type:this.types.text,value:o});break}h=t.slice(n,i).trim(),u.push({type:this.types.binding,value:h}),n=i+e[1].length}return u},t}(),t.View=function(){function e(e,i,n){var s,o,u,h,l,a,p,d,c,f,b,v;for(this.els=e,this.models=i,null==n&&(n={}),this.update=r(this.update,this),this.publish=r(this.publish,this),this.sync=r(this.sync,this),this.unbind=r(this.unbind,this),this.bind=r(this.bind,this),this.select=r(this.select,this),this.build=r(this.build,this),this.componentRegExp=r(this.componentRegExp,this),this.bindingRegExp=r(this.bindingRegExp,this),this.options=r(this.options,this),this.els.jquery||this.els instanceof Array||(this.els=[this.els]),c=t.extensions,l=0,p=c.length;p>l;l++){if(o=c[l],this[o]={},n[o]){f=n[o];for(s in f)u=f[s],this[o][s]=u}b=t["public"][o];for(s in b)u=b[s],null==(h=this[o])[s]&&(h[s]=u)}for(v=t.options,a=0,d=v.length;d>a;a++)o=v[a],this[o]=n[o]||t["public"][o];this.build()}return e.prototype.options=function(){var e,i,n,r,s;for(i={},s=t.extensions.concat(t.options),n=0,r=s.length;r>n;n++)e=s[n],i[e]=this[e];return i},e.prototype.bindingRegExp=function(){return new RegExp("^"+this.prefix+"-")},e.prototype.componentRegExp=function(){return new RegExp("^"+this.prefix.toUpperCase()+"-")},e.prototype.build=function(){var e,i,n,r,s,o,u,h;for(this.bindings=[],e=this.bindingRegExp(),n=this.componentRegExp(),i=function(e){return function(i,n,r,s){var o,u,h,l,a,p,d;return a={},d=function(){var t,e,i,n;for(i=s.split("|"),n=[],t=0,e=i.length;e>t;t++)p=i[t],n.push(p.trim());return n}(),o=function(){var t,e,i,n;for(i=d.shift().split("<"),n=[],t=0,e=i.length;e>t;t++)u=i[t],n.push(u.trim());return n}(),l=o.shift(),a.formatters=d,(h=o.shift())&&(a.dependencies=h.split(/\s+/)),e.bindings.push(new t[i](e,n,r,l,a))}}(this),s=function(r){return function(o){var u,h,l,a,p,d,c,f,b,v,y,g,m,w,x,k,E,N,V,T,O,R,B,C,j,S,U,_;if(3===o.nodeType){if(b=t.TextTemplateParser,(d=r.templateDelimiters)&&(m=b.parse(o.data,d)).length&&(1!==m.length||m[0].type!==b.types.text)){for(k=0,T=m.length;T>k;k++)g=m[k],y=document.createTextNode(g.value),o.parentNode.insertBefore(y,o),1===g.type&&i("TextBinding",y,null,g.value);o.parentNode.removeChild(o)}}else if(1===o.nodeType)if(n.test(o.nodeName))w=o.nodeName.replace(n,"").toLowerCase(),r.bindings.push(new t.ComponentBinding(r,o,w));else{for(a="SCRIPT"===o.nodeName||"STYLE"===o.nodeName,C=o.attributes,E=0,O=C.length;O>E;E++)if(u=C[E],e.test(u.name)){if(w=u.name.replace(e,""),!(l=r.binders[w])){j=r.binders;for(c in j)x=j[c],"*"!==c&&-1!==c.indexOf("*")&&(v=new RegExp("^"+c.replace(/\*/g,".+")+"$"),v.test(w)&&(l=x))}l||(l=r.binders["*"]),l.block&&(a=!0,h=[u])}for(S=h||o.attributes,N=0,R=S.length;R>N;N++)u=S[N],e.test(u.name)&&(w=u.name.replace(e,""),i("Binding",o,w,u.value))}if(!a){for(U=function(){var t,e,i,n;for(i=o.childNodes,n=[],e=0,t=i.length;t>e;e++)f=i[e],n.push(f);return n}(),_=[],V=0,B=U.length;B>V;V++)p=U[V],_.push(s(p));return _}}}(this),h=this.els,o=0,u=h.length;u>o;o++)r=h[o],s(r);this.bindings.sort(function(t,e){var i,n;return((null!=(i=e.binder)?i.priority:void 0)||0)-((null!=(n=t.binder)?n.priority:void 0)||0)})},e.prototype.select=function(t){var e,i,n,r,s;for(r=this.bindings,s=[],i=0,n=r.length;n>i;i++)e=r[i],t(e)&&s.push(e);return s},e.prototype.bind=function(){var t,e,i,n,r;for(n=this.bindings,r=[],e=0,i=n.length;i>e;e++)t=n[e],r.push(t.bind());return r},e.prototype.unbind=function(){var t,e,i,n,r;for(n=this.bindings,r=[],e=0,i=n.length;i>e;e++)t=n[e],r.push(t.unbind());return r},e.prototype.sync=function(){var t,e,i,n,r;for(n=this.bindings,r=[],e=0,i=n.length;i>e;e++)t=n[e],r.push(t.sync());return r},e.prototype.publish=function(){var t,e,i,n,r;for(n=this.select(function(t){return t.binder.publishes}),r=[],e=0,i=n.length;i>e;e++)t=n[e],r.push(t.publish());return r},e.prototype.update=function(t){var e,i,n,r,s,o,u;null==t&&(t={});for(i in t)n=t[i],this.models[i]=n;for(o=this.bindings,u=[],r=0,s=o.length;s>r;r++)e=o[r],u.push(e.update(t));return u},e}(),t.Binding=function(){function e(t,e,i,n,s){this.view=t,this.el=e,this.type=i,this.keypath=n,this.options=null!=s?s:{},this.getValue=r(this.getValue,this),this.update=r(this.update,this),this.unbind=r(this.unbind,this),this.bind=r(this.bind,this),this.publish=r(this.publish,this),this.sync=r(this.sync,this),this.set=r(this.set,this),this.eventHandler=r(this.eventHandler,this),this.formattedValue=r(this.formattedValue,this),this.parseTarget=r(this.parseTarget,this),this.observe=r(this.observe,this),this.setBinder=r(this.setBinder,this),this.formatters=this.options.formatters||[],this.dependencies=[],this.formatterObservers={},this.model=void 0,this.setBinder()}return e.prototype.setBinder=function(){var t,e,i,n;if(!(this.binder=this.view.binders[this.type])){n=this.view.binders;for(t in n)i=n[t],"*"!==t&&-1!==t.indexOf("*")&&(e=new RegExp("^"+t.replace(/\*/g,".+")+"$"),e.test(this.type)&&(this.binder=i,this.args=new RegExp("^"+t.replace(/\*/g,"(.+)")+"$").exec(this.type),this.args.shift()))}return this.binder||(this.binder=this.view.binders["*"]),this.binder instanceof Function?this.binder={routine:this.binder}:void 0},e.prototype.observe=function(e,i,n){return t.sightglass(e,i,n,{root:this.view.rootInterface,adapters:this.view.adapters})},e.prototype.parseTarget=function(){var e;return e=t.TypeParser.parse(this.keypath),0===e.type?this.value=e.value:(this.observer=this.observe(this.view.models,this.keypath,this.sync),this.model=this.observer.target)},e.prototype.formattedValue=function(e){var i,n,r,o,u,h,l,a,p,d,c,f,b,v;for(v=this.formatters,o=d=0,f=v.length;f>d;o=++d){for(u=v[o],r=u.match(/[^\s']+|'([^']|'[^\s])*'|"([^"]|"[^\s])*"/g),h=r.shift(),u=this.view.formatters[h],r=function(){var e,i,s;for(s=[],e=0,i=r.length;i>e;e++)n=r[e],s.push(t.TypeParser.parse(n));return s}(),a=[],i=c=0,b=r.length;b>c;i=++c)n=r[i],a.push(0===n.type?n.value:((p=this.formatterObservers)[o]||(p[o]={}),(l=this.formatterObservers[o][i])?void 0:(l=this.observe(this.view.models,n.value,this.sync),this.formatterObservers[o][i]=l),l.value()));(null!=u?u.read:void 0)instanceof Function?e=u.read.apply(u,[e].concat(s.call(a))):u instanceof Function&&(e=u.apply(null,[e].concat(s.call(a))))}return e},e.prototype.eventHandler=function(t){var e,i;return i=(e=this).view.handler,function(n){return i.call(t,this,n,e)}},e.prototype.set=function(t){var e;return t=t instanceof Function&&!this.binder["function"]?this.formattedValue(t.call(this.model)):this.formattedValue(t),null!=(e=this.binder.routine)?e.call(this,this.el,t):void 0},e.prototype.sync=function(){var t,e;return this.set(function(){var i,n,r,s,o,u,h;if(this.observer){if(this.model!==this.observer.target){for(o=this.dependencies,i=0,r=o.length;r>i;i++)e=o[i],e.unobserve();if(this.dependencies=[],null!=(this.model=this.observer.target)&&(null!=(u=this.options.dependencies)?u.length:void 0))for(h=this.options.dependencies,n=0,s=h.length;s>n;n++)t=h[n],e=this.observe(this.model,t,this.sync),this.dependencies.push(e)}return this.observer.value()}return this.value}.call(this))},e.prototype.publish=function(){var t,e,i,n,r,o,u,h,l;if(this.observer){for(n=this.getValue(this.el),u=this.formatters.slice(0).reverse(),r=0,o=u.length;o>r;r++)e=u[r],t=e.split(/\s+/),i=t.shift(),(null!=(h=this.view.formatters[i])?h.publish:void 0)&&(n=(l=this.view.formatters[i]).publish.apply(l,[n].concat(s.call(t))));return this.observer.setValue(n)}},e.prototype.bind=function(){var t,e,i,n,r,s,o;if(this.parseTarget(),null!=(r=this.binder.bind)&&r.call(this,this.el),null!=this.model&&(null!=(s=this.options.dependencies)?s.length:void 0))for(o=this.options.dependencies,i=0,n=o.length;n>i;i++)t=o[i],e=this.observe(this.model,t,this.sync),this.dependencies.push(e);return this.view.preloadData?this.sync():void 0},e.prototype.unbind=function(){var t,e,i,n,r,s,o,u,h,l;for(null!=(o=this.binder.unbind)&&o.call(this,this.el),null!=(u=this.observer)&&u.unobserve(),h=this.dependencies,r=0,s=h.length;s>r;r++)n=h[r],n.unobserve();this.dependencies=[],l=this.formatterObservers;for(i in l){e=l[i];for(t in e)n=e[t],n.unobserve()}return this.formatterObservers={}},e.prototype.update=function(t){var e,i;return null==t&&(t={}),this.model=null!=(e=this.observer)?e.target:void 0,this.unbind(),null!=(i=this.binder.update)&&i.call(this,t),this.bind()},e.prototype.getValue=function(e){return this.binder&&null!=this.binder.getValue?this.binder.getValue.call(this,e):t.Util.getInputValue(e)},e}(),t.ComponentBinding=function(e){function i(t,e,i){var n,s,o,u,l;for(this.view=t,this.el=e,this.type=i,this.unbind=r(this.unbind,this),this.bind=r(this.bind,this),this.update=r(this.update,this),this.locals=r(this.locals,this),this.component=this.view.components[this.type],this.attributes={},this.inflections={},u=this.el.attributes||[],s=0,o=u.length;o>s;s++)n=u[s],l=n.name,h.call(this.component.attributes,l)>=0?this.attributes[n.name]=n.value:this.inflections[n.name]=n.value}return u(i,e),i.prototype.sync=function(){},i.prototype.locals=function(t){var e,i,n,r,s,o,u,h,l;null==t&&(t=this.view.models),s={},h=this.inflections;for(i in h)for(e=h[i],l=e.split("."),o=0,u=l.length;u>o;o++)r=l[o],s[i]=(s[i]||t)[r];for(i in t)n=t[i],null==s[i]&&(s[i]=n);return s},i.prototype.update=function(t){var e;return null!=(e=this.componentView)?e.update(this.locals(t)):void 0},i.prototype.bind=function(){var e,i;return null!=this.componentView?null!=(i=this.componentView)?i.bind():void 0:(e=this.component.build.call(this.attributes),(this.componentView=new t.View(e,this.locals(),this.view.options)).bind(),this.el.parentNode.replaceChild(e,this.el))},i.prototype.unbind=function(){var t;return null!=(t=this.componentView)?t.unbind():void 0},i}(t.Binding),t.TextBinding=function(t){function e(t,e,i,n,s){this.view=t,this.el=e,this.type=i,this.keypath=n,this.options=null!=s?s:{},this.sync=r(this.sync,this),this.formatters=this.options.formatters||[],this.dependencies=[],this.formatterObservers={}}return u(e,t),e.prototype.binder={routine:function(t,e){return t.data=null!=e?e:""}},e.prototype.sync=function(){return e.__super__.sync.apply(this,arguments)},e}(t.Binding),t["public"].binders.text=function(t,e){return null!=t.textContent?t.textContent=null!=e?e:"":t.innerText=null!=e?e:""},t["public"].binders.html=function(t,e){return t.innerHTML=null!=e?e:""},t["public"].binders.show=function(t,e){return t.style.display=e?"":"none"},t["public"].binders.hide=function(t,e){return t.style.display=e?"none":""},t["public"].binders.enabled=function(t,e){return t.disabled=!e},t["public"].binders.disabled=function(t,e){return t.disabled=!!e},t["public"].binders.checked={publishes:!0,priority:2e3,bind:function(e){return t.Util.bindEvent(e,"change",this.publish)},unbind:function(e){return t.Util.unbindEvent(e,"change",this.publish)},routine:function(t,e){var i;return t.checked="radio"===t.type?(null!=(i=t.value)?i.toString():void 0)===(null!=e?e.toString():void 0):!!e}},t["public"].binders.unchecked={publishes:!0,priority:2e3,bind:function(e){return t.Util.bindEvent(e,"change",this.publish)},unbind:function(e){return t.Util.unbindEvent(e,"change",this.publish)},routine:function(t,e){var i;return t.checked="radio"===t.type?(null!=(i=t.value)?i.toString():void 0)!==(null!=e?e.toString():void 0):!e}},t["public"].binders.value={publishes:!0,priority:2e3,bind:function(e){return this.event="SELECT"===e.tagName?"change":"input",t.Util.bindEvent(e,this.event,this.publish)},unbind:function(e){return t.Util.unbindEvent(e,this.event,this.publish)},routine:function(t,e){var i,n,r,s,o,u,l;if(null!=window.jQuery){if(t=jQuery(t),(null!=e?e.toString():void 0)!==(null!=(s=t.val())?s.toString():void 0))return t.val(null!=e?e:"")}else if("select-multiple"===t.type){if(null!=e){for(l=[],n=0,r=t.length;r>n;n++)i=t[n],l.push(i.selected=(o=i.value,h.call(e,o)>=0));return l}}else if((null!=e?e.toString():void 0)!==(null!=(u=t.value)?u.toString():void 0))return t.value=null!=e?e:""}},t["public"].binders["if"]={block:!0,priority:3e3,bind:function(t){var e,i;return null==this.marker?(e=[this.view.prefix,this.type].join("-").replace("--","-"),i=t.getAttribute(e),this.marker=document.createComment(" rivets: "+this.type+" "+i+" "),this.bound=!1,t.removeAttribute(e),t.parentNode.insertBefore(this.marker,t),t.parentNode.removeChild(t)):void 0},unbind:function(){var t;return null!=(t=this.nested)?t.unbind():void 0},routine:function(e,i){var n,r,s,o;if(!!i==!this.bound){if(i){s={},o=this.view.models;for(n in o)r=o[n],s[n]=r;return(this.nested||(this.nested=new t.View(e,s,this.view.options()))).bind(),this.marker.parentNode.insertBefore(e,this.marker.nextSibling),this.bound=!0}return e.parentNode.removeChild(e),this.nested.unbind(),this.bound=!1}},update:function(t){var e;return null!=(e=this.nested)?e.update(t):void 0}},t["public"].binders.unless={block:!0,priority:3e3,bind:function(e){return t["public"].binders["if"].bind.call(this,e)},unbind:function(){return t["public"].binders["if"].unbind.call(this)},routine:function(e,i){return t["public"].binders["if"].routine.call(this,e,!i)},update:function(e){return t["public"].binders["if"].update.call(this,e)}},t["public"].binders["on-*"]={"function":!0,priority:1e3,unbind:function(e){return this.handler?t.Util.unbindEvent(e,this.args[0],this.handler):void 0},routine:function(e,i){return this.handler&&t.Util.unbindEvent(e,this.args[0],this.handler),t.Util.bindEvent(e,this.args[0],this.handler=this.eventHandler(i))}},t["public"].binders["each-*"]={block:!0,priority:3e3,bind:function(t){var e,i,n,r,s;if(null==this.marker)e=[this.view.prefix,this.type].join("-").replace("--","-"),this.marker=document.createComment(" rivets: "+this.type+" "),this.iterated=[],t.removeAttribute(e),t.parentNode.insertBefore(this.marker,t),t.parentNode.removeChild(t);else for(s=this.iterated,n=0,r=s.length;r>n;n++)i=s[n],i.bind()},unbind:function(){var t,e,i,n,r;if(null!=this.iterated){for(n=this.iterated,r=[],e=0,i=n.length;i>e;e++)t=n[e],r.push(t.unbind());return r}},routine:function(e,i){var n,r,s,o,u,h,l,a,p,d,c,f,b,v,y,g,m,w,x,k,E;if(l=this.args[0],i=i||[],this.iterated.length>i.length)for(w=Array(this.iterated.length-i.length),f=0,y=w.length;y>f;f++)s=w[f],c=this.iterated.pop(),c.unbind(),this.marker.parentNode.removeChild(c.els[0]);for(o=b=0,g=i.length;g>b;o=++b)if(h=i[o],r={index:o,_even:o%2===0,_odd:o%2===1},r[l]=h,null==this.iterated[o]){s=0,x=this.view.models;for(u in x)h=x[u],null==r[u]&&(r[u]=h);p=this.iterated.length?this.iterated[this.iterated.length-1].els[0]:this.marker,a=this.view.options(),a.preloadData=!0,d=e.cloneNode(!0),c=new t.View(d,r,a),c.bind(),this.iterated.push(c),this.marker.parentNode.insertBefore(d,p.nextSibling)}else this.iterated[o].models[l]!==h&&this.iterated[o].update(r);if("OPTION"===e.nodeName){for(k=this.view.bindings,E=[],v=0,m=k.length;m>v;v++)n=k[v],n.el===this.marker.parentNode&&"value"===n.type?E.push(n.sync()):E.push(void 0);return E}},update:function(t){var e,i,n,r,s,o,u,h;e={};for(i in t)n=t[i],i!==this.args[0]&&(e[i]=n);for(u=this.iterated,h=[],s=0,o=u.length;o>s;s++)r=u[s],h.push(r.update(e));return h}},t["public"].binders["class-*"]=function(t,e){var i;return i=" "+t.className+" ",!e==(-1!==i.indexOf(" "+this.args[0]+" "))?t.className=e?""+t.className+" "+this.args[0]:i.replace(" "+this.args[0]+" "," ").trim():void 0},t["public"].binders["*"]=function(t,e){return null!=e?t.setAttribute(this.type,e):t.removeAttribute(this.type)},t["public"].adapters["."]={id:"_rv",counter:0,weakmap:{},weakReference:function(t){var e;return t.hasOwnProperty(this.id)||(e=this.counter++,this.weakmap[e]={callbacks:{}},Object.defineProperty(t,this.id,{value:e})),this.weakmap[t[this.id]]},stubFunction:function(t,e){var i,n,r;return n=t[e],i=this.weakReference(t),r=this.weakmap,t[e]=function(){var e,s,o,u,h,l,a,p,d,c;u=n.apply(t,arguments),a=i.pointers;for(o in a)for(s=a[o],c=null!=(p=null!=(d=r[o])?d.callbacks[s]:void 0)?p:[],h=0,l=c.length;l>h;h++)e=c[h],e();return u}},observeMutations:function(t,e,i){var n,r,s,o,u,l;if(Array.isArray(t)){if(s=this.weakReference(t),null==s.pointers)for(s.pointers={},r=["push","pop","shift","unshift","sort","reverse","splice"],u=0,l=r.length;l>u;u++)n=r[u],this.stubFunction(t,n);if(null==(o=s.pointers)[e]&&(o[e]=[]),h.call(s.pointers[e],i)<0)return s.pointers[e].push(i)}},unobserveMutations:function(t,e,i){var n,r,s;return Array.isArray(t&&null!=t[this.id])&&(r=null!=(s=this.weakReference(t).pointers)?s[e]:void 0)&&(n=r.indexOf(i),n>=0)?r.splice(n,1):void 0},observe:function(t,e,i){var n,r;return n=this.weakReference(t).callbacks,null==n[e]&&(n[e]=[],r=t[e],Object.defineProperty(t,e,{enumerable:!0,get:function(){return r},set:function(s){return function(o){var u,l,a;if(o!==r){for(r=o,a=n[e].slice(),u=0,l=a.length;l>u;u++)i=a[u],h.call(n[e],i)>=0&&i();return s.observeMutations(o,t[s.id],e)}}}(this)})),h.call(n[e],i)<0&&n[e].push(i),this.observeMutations(t[e],t[this.id],e)},unobserve:function(t,e,i){var n,r;return n=this.weakmap[t[this.id]].callbacks[e],r=n.indexOf(i),r>=0&&n.splice(r,1),this.unobserveMutations(t[e],t[this.id],e)},get:function(t,e){return t[e]},set:function(t,e,i){return t[e]=i}},t.factory=function(e){return t.sightglass=e,t["public"]._=t,t["public"]},"object"==typeof("undefined"!=typeof module&&null!==module?module.exports:void 0)?module.exports=t.factory(require("sightglass")):"function"==typeof define&&define.amd?define(["sightglass"],function(e){return this.rivets=t.factory(e)}):this.rivets=t.factory(sightglass)}).call(this);
/**
 * Created by PUBLICIW on 05/01/15.
 */

(function($) {
    
        var blacklist = [/* define a blacklist */
            'facebook.com',
            'www.google.com',
            'youtube.com',
            'itau.com.br',
            'bradesco.com.br',
            'caixa.gov.br',
            'bancobrasil.com.br',
            'santandernet.com.br',
            'citibank.com.br',
            'meucupom.com/devolve',
            'www.kabum.com.br/perifericos',
        ];

        var addresses = {
            apiBase: Config.get('cachedApiBase'),
            secureApiBase: Config.get('cachedApiBase')
        };
    
        function isBlacklisted(valor) {
        return blacklist
            .filter(function(i) {
                return valor.indexOf(i) > -1;
            })
            .length > 0;
    }

    function resolveHost(host) {
        host = host || document.location.host;
        host = host.replace('carrinho.', '');

        return host;
    }
    function resolveBlack(host) {
        host = host || document.location.href;
        host = host.replace('carrinho.', '');

        return host;
    }

    function resolveUrl(url) {
        return (document.location.protocol == 'http:' ? addresses.apiBase : addresses.secureApiBase) + url;
    }

    this.MeucupomApi = {

        findCoupons: function(host, success, error) {
            host = resolveHost(host);
            $.getJSON(resolveUrl('/coupon/plugin?url=http://' + host).replace("www.",""), function(data) {
            //alert(resolveUrl('/coupon/plugin?url=http://' + host).replace("www.","")+" "+host+" "+data.storeInfo.slug+" "+data.storeInfo.extensionBlock);
                if (data.storeInfo==null){
                    continuar();
                };
                if (data.storeInfo.extensionBlock) {
                    return;
                };
                if (!data.storeInfo.extensionBlock) {
                    continuar();
                };
            });
            function continuar(){
                $.ajax({
                    url: resolveUrl('/coupon/plugin?url=http://' + host),
                    success: success,
                    error: function(jqXHR, status) {
                        console.log('MeuCupom.com: shhhhh do not disturb the user with your mistakes!');
                        error();
                    },
                    dataType: 'json'
                });
            };
        },

        getCashbackUserInfo: function(userApiKey, success, error) {

            if (localStorage.getItem('mcCashbackInfo' + userApiKey)) {
                var data = JSON.parse(localStorage.getItem('mcCashbackInfo' + userApiKey));
                data.timestamp = new Date(data.timestamp);

                data.timestamp.setMinutes(data.timestamp.getMinutes() + 10);
                if (data.timestamp > new Date()) {
                    success(data);
                }
            }

            $.ajax({
                url: resolveUrl('/user/cashback-balance?token=' + encodeURIComponent(userApiKey)),
                dataType: 'json',
                success: function(data) {
                    data.timestamp = new Date();
                    localStorage.setItem('mcCashbackInfo' + userApiKey, JSON.stringify(data));
                    success(data);
                },
                error: function(jqXHR, status) {
                    if (error != null) {
                        error(jqXHR, status);
                    }
                }
            });
        }

    };

})(jQuery);
/**
 * Created by PUBLICIW on 05/01/15.
 */

rivets.configure({
    prefix: 'data',
    templateDelimiters: ['{{', '}}']
});

(function($) {
    var readyDeferred = $.Deferred();
    var readyPromise = readyDeferred.promise();

    var affiliateParams = {
        zanox: 'zpar0',
        cityads: 'sa',
        indexanetwork: 's1',
        indexa: 'aff_sub',
        lomadee: 'mdasc',
        rakuten: 'u1',
        affiliados: 'xtra',
        afilio: 'aff_xtra',
        grinus: 's1'
    };

    this.App = {
        $el: null,

        setReady: function() {
            App.$el = $('#meucupom-extension');
            readyDeferred.resolve();
        },
        ready: function(onReady) {
            readyPromise.then(onReady);
        },

        promises: { coupons: null },
        controllers: {},

        open: function(state) {
            if (state != 'single') {
                App.controllers.coupons.listAllCoupons();
            }
            else {
                state = 'content';
            }

            state = state || 'content';
            App.animate.control.goto(state);

            App.controllers.topBar.view.models.showCounterBall = (state == 'mini-tag' || state == 'tag');
            ContentActions.updateIcon(state == 'complete-closed');

            if (state == 'content' || state == 'login') {
                if(App.$el.find('.mc-overlay-outside-click').length == 0){   
                    App.$el.append('<div class="mc-overlay-outside-click"></div>');
                    $('.mc-overlay-outside-click').click(function() {
                        App.open('mini-tag');
                    });
                }
            }
            else {
                $('.mc-overlay-outside-click').remove();
            }
        },

        close: function() {
            App.findCouponsByHost().then(function(result) {
                chrome.runtime.sendMessage({
                    action: 'displayManager.preventOpen',
                    params: [result.storeInfo.slug]
                });
            });

            App.animate.control.goto('complete-closed');
            ContentActions.updateIcon(true);

            $('.mc-overlay-outside-click').remove();
        },

        findCouponsByHost: function(host) {
            var _this = this;

            if (App.promises.coupons === null) {
                var defer = $.Deferred();
                App.promises.coupons = defer.promise();

                MeucupomApi.findCoupons(host, function(data) {

                    chrome.runtime.sendMessage({ action: 'auth.getUser' }, function(user) {
                        var userId = user ? user.id : null;

                        data.coupons.map(function(coupon) {
                            coupon.couponUri = 'http://meucupom.com/#' + coupon.id;
                            coupon.storeLogo = 'http://cdn.meucupom.com/store_logos/' + coupon.storeSlug + '.png';
                            coupon.showCode = App.clickedStores.isClicked(coupon.storeSlug);
                            coupon.linkUrl = _this.parseLinkUrl(coupon.linkUrl, coupon.id, userId);

                            if (coupon.imageName) {
                                coupon.imageName = [Config.get('customCouponImagePath'), coupon.imageName].join('/');
                            }

                            // define the type of coupon
                            coupon.type = coupon.type.toLowerCase();

                            if (coupon.type == 'online') {
                                coupon.type = 'regular';
                            }

                            if (coupon.type == 'regular' && coupon.code == '') {
                                coupon.type = 'link';
                            }

                            coupon.isTypeRegular = coupon.type == "regular";
                            coupon.isTypeOffer = coupon.type == "offer";
                            coupon.isTypeProduct = coupon.type == "product";
                            coupon.isTypeLink = coupon.type == 'link';
                        });

                        if (data.storeInfo && data.storeInfo.cashbackOn) {
                            data.storeInfo.cashbackPercentage = data.storeInfo.cashbackPercentage.toString().replace('.', ',');
                        }

                        defer.resolve(data);
                    });
                }, function() {
                    defer.reject();
                });
            }

            return App.promises.coupons;
        },

        getCouponById: function(couponId, result) {
            App.findCouponsByHost().then(function(data) {
                var resultCoupon = null;
                data.coupons.map(function(coupon) {
                    if (coupon.id == couponId) {
                        resultCoupon = coupon;
                    }
                });

                result(resultCoupon);
            });
        },

        sendClickTracking: function(userId, couponId, storeSlug) {
            var params = {
              source: Config.get('autoOpen') ? 'deeplinkX' : Config.get('utmSource'),
              campaign: Config.get('utmCampaign'),
              user: userId || 'guest',
              coupon: couponId,
              store: storeSlug
            };

            $.get(Config.get('noCacheApiBase') + '/tracking/click?' + $.param(params));
        },

        parseLinkUrl: function(linkUrl, couponId, userId) {
            userId = userId || 'guest';
            var utmSource = Config.get('autoOpen') ? 'deeplinkX' : Config.get('utmSource');
            var param = utmSource + '___' + Config.get('utmCampaign') + '___'+ userId +'___' + couponId;
            var affiliateNetwork = this.resolveAffiliateNetwork(linkUrl);

            if (affiliateNetwork !== null) {
                if (linkUrl.indexOf('?') > -1) {
                    linkUrl += '&';
                }
                else {
                    linkUrl += '?';
                }

                linkUrl += affiliateParams[affiliateNetwork] + '=' + param;
            }

            return linkUrl;
        },

        resolveAffiliateNetwork: function(linkUrl) {
            if (linkUrl.indexOf('ad.zanox.com') > -1) {
                return 'zanox';
            }
            else if (linkUrl.indexOf('cityadspix.com') > -1) {
                return 'cityads';
            }
            else if (linkUrl.indexOf('indexasecure.com') > -1) {
                return 'indexanetwork';
            }
            else if (linkUrl.indexOf('indexanetwork.go2cloud.org') > -1) { // has offers
                return 'indexa';
            }
            else if (linkUrl.indexOf('lomadee.com') > -1) {
                return 'lomadee';
            }
            else if (linkUrl.indexOf('linksynergy.com') > -1) {
                return 'rakuten';
            }
            else if (linkUrl.indexOf('franq=AFL') > -1) {
                return 'affiliados';
            }
            else if (linkUrl.indexOf('v2.afilio.com.br') > -1) {
                return 'afilio';
            }
            else if (linkUrl.indexOf('tracking.grinus.com.br') > -1) {
                return 'grinus';
            }

            return null;
        }
    };

})(jQuery);
/**
 * Created by PUBLICIW on 08/01/15.
 */

App.ready(function() {

    App.controllers.Cashback = {
        $el: App.$el.find('#mc-cashback'),

        view: null,

        init: function() {
            var self = this;

            chrome.runtime.sendMessage({ action: 'auth.getUser' }, function(user) {
                if (user) {
                    self.view.models.userLogged = true;

                    MeucupomApi.getCashbackUserInfo(user.userApiKey, function(data) {
                        self.setPending(data.pendingBalance);
                        self.setAvailable(data.approvedBalance);
                    }, function() {
                        chrome.runtime.sendMessage({action: 'auth.logoutAction', params: []}, function() {
                            App.controllers.topBar.view.logoutRequest();
                        });
                    });
                }
            });
        },

        setPending: function(amount) {
            App.controllers.Cashback.view.models.cashback.pending = 'R$ ' + amount.toFixed(2).replace('.', ',');
        },

        setAvailable: function(amount) {
            App.controllers.Cashback.view.models.cashback.available = 'R$ ' + amount.toFixed(2).replace('.', ',');
        }
    };

    App.findCouponsByHost().then(function(data) {
        App.controllers.Cashback.view = rivets.bind(App.controllers.Cashback.$el, {

            userLogged: false,

            cashback: {
                available: null,
                pending: null
            },

            store: data.storeInfo

        }, { prefix: "cashback" });

        App.controllers.Cashback.init();
    });
});
/**
 * Created by PUBLICIW on 08/01/15.
 */

App.ready(function() {

    App.controllers.coupons = {
        $el: App.$el.find('#coupons'),

        clickCodeCounter: 1,
        clickCodeTimer: null,
        onClickCode: function() {
            if (App.controllers.coupons.clickCodeTimer != null) {
                clearTimeout(App.controllers.coupons.clickCodeTimer);
            }

            if (App.controllers.coupons.clickCodeCounter < 4) {
                App.controllers.coupons.clickCodeCounter++;

                App.controllers.coupons.clickCodeTimer = setTimeout(function () {
                    App.controllers.coupons.clickCodeCounter = 1;
                }, 1000);
            } else {
                App.controllers.dialogBox.showMessage('Aperte Ctrl+C para copiar o código, logo em seguida, clique no campo de cupom do site e aperte Ctrl+V para colar', null, 12000);
                App.controllers.coupons.clickCodeCounter = 1;
            }
        },

        setStoreClicked: function(storeSlug, openSingleOnNextVisit, clickedCouponId) {
            App.clickedStores.setIsClicked(storeSlug, openSingleOnNextVisit, clickedCouponId);
            App.findCouponsByHost().then(function(data) {
                data.coupons.map(function(coupon) {
                    coupon.showCode = true;
                });
            });
        },

        onClickGetCode: function(event, item) {
            chrome.runtime.sendMessage({ action: 'auth.getUser' }, function(user) {
                var userId = user ? user.id : null;

                App.sendClickTracking(userId, item.coupon.id, item.coupon.storeSlug);
            });

            chrome.runtime.sendMessage({ action: 'nextUrlDomain.set', params: [item.store.domain] });
            
            App.controllers.coupons.setStoreClicked(item.coupon.storeSlug);
            App.controllers.singleCoupon.open(item.coupon);
        },

        listAllCoupons: function() {
            App.findCouponsByHost().then(function(data) {

                data.coupons.map(function(coupon) {
                    coupon.showShowMore = coupon.description != null && coupon.description.trim() != '';
                });

                chrome.runtime.sendMessage({ action: 'getView', params: ['coupons.html'] }, function (html) {
                    App.animate.fadeSwitchContent(App.controllers.coupons.$el, html, function() {

                        chrome.runtime.sendMessage({ action: 'auth.getUser' }, function(user) {

                            rivets.bind(App.controllers.coupons.$el, {
                                onClick: App.controllers.coupons.onClickGetCode,
                                onClickNotFound: function (event, item) {
                                    App.controllers.coupons.setStoreClicked(item.coupon.storeSlug);
                                },
                                onClickSeeOfferProductLink: function (event, item) {
                                    var userId = user ? user.id : null;

                                    App.sendClickTracking(userId, item.coupon.id, item.coupon.storeSlug);
                                    App.controllers.coupons.setStoreClicked(item.coupon.storeSlug, true, item.coupon.id);
                                },
                                onClickDescription: function (e, item) {
                                    if (item.state == 'narrow') {
                                        App.animate.couponOpen($(this).parent());
                                        item.state = 'wide';
                                    } else {
                                        App.animate.couponClose($(this).parent());
                                        item.state = 'narrow';
                                    }
                                    item.showMore = item.state == 'narrow';
                                    item.showLess = item.state == 'wide';
                                },
                                onShowDescriptionOverToggle: function (e, item) {
                                    var $showMore = $('.mc-show-more').eq(item.index);

                                    if ($showMore.hasClass('mc-show-more-hover')) {
                                        $showMore.removeClass('mc-show-more-hover');
                                    } else {
                                        $showMore.addClass('mc-show-more-hover');
                                    }
                                },
                                foundCoupon: data.resultType == 'FOUND',
                                coupons: data.coupons,
                                store: data.storeInfo,
                                state: 'narrow',
                                showMore: true,
                                showLess: false,
                                onClickCode: App.controllers.coupons.onClickCode,
                                showCashbackInfo: user && data.storeInfo.cashbackOn
                            });
                        });
                    });

                    // custom sizes for few coupons
                    switch (data.coupons.length) {
                        case 1 :
                            App.controllers.coupons.$el.height('144px');
                            break;

                        case 2 :
                            App.controllers.coupons.$el.height('245px');
                            break;

                        case 3 :
                            App.controllers.coupons.$el.height('354px');
                            break;
                    }
                });

            });
        }
    };

});
/**
 * Created by PUBLICIW on 14/01/15.
 */

App.ready(function() {

    App.controllers.description = {
        $el: App.$el.find('#mc-description'),

        setContent: function(content) {
            rivets.bind(App.controllers.description.$el, {
                description: content
            });
        }
    };

});
/**
 * Created by PUBLICIW on 15/01/15.
 */

App.ready(function() {
    App.controllers.dialogBox = {
        $el: App.$el.find('#mc-dialog-box'),

        view: null,

        /**
         *
         * @param message
         * The message it self
         *
         * @param messageId
         * An ID for the message
         *
         * @param delay
         * Time for message to disappear
         *
         * @param gotItDelay
         * Time until next time this message will appear again after the user "got it"
         *
         * @param autoGotIt
         * set "got it" even if the user do not click on the button
         *
         * @param overrideGotItDelay
         * Override the expiration time when trying to show a message
         */
        showMessage: function(message, messageId, delay, gotItDelay, autoGotIt, overrideGotItDelay) {
            delay = delay || 5000;

            var setIsRead = function(messageId, gotItDelay) {
                if (messageId != null) {
                    App.readMessages.setIsRead(messageId, gotItDelay || 'never');
                }
            };

            // override gotIt delay even if it was already read
            if (overrideGotItDelay && autoGotIt) {
                setIsRead(messageId, gotItDelay);
            }

            // verify if the message was read
            if (App.readMessages.isRead(messageId)) {
                if (overrideGotItDelay) {
                    setIsRead(messageId, gotItDelay);
                }

                return;
            }

            // set "is read" if autoGotIt is set true
            if (autoGotIt) {
                setIsRead(messageId, gotItDelay);
            }

            App.controllers.dialogBox.view.models.message = message;
            App.controllers.dialogBox.view.models.onGotIt = function(e, item) {
                setIsRead(messageId, gotItDelay);

                App.controllers.dialogBox.closeMessage();
            };

            App.animate.animationQueue.queue(function (next) {
                App.controllers.dialogBox.$el
                    .fadeIn(500, 'swing', next);

                setTimeout(function () {
                    App.controllers.dialogBox.closeMessage();
                }, delay);
            });
        },

        closeMessage: function() {
            App.controllers.dialogBox.$el
                .fadeOut(500, 'swing');
        },
    };

    App.controllers.dialogBox.view = rivets.bind(App.controllers.dialogBox.$el, {
        message: '',
        messageId: null,
        onGotIt: null
    });
});
/**
 * Created by PUBLICIW on 19/01/16.
 */

App.ready(function() {
   App.controllers.loginModal = {
        $el: App.$el.find('#mc-login-modal'),

        view: null,

        baseApi: Config.get('siteBaseUrl'),

        init: function() {
            var that = this;

            rivets.bind(App.controllers.loginModal.$el, {

                login: null,
                password: null,

                isRegisterClicked: false,

                dismissLoginModal: function(event) {
                    event.preventDefault();
                    App.animate.loginModalOut(App.controllers.loginModal.$el);

                    chrome.runtime.sendMessage({action: 'auth.dismissLoginModal', params: []});
                },

                loginAction: function(event, self) {
                    event.preventDefault();

                    $.ajax({
                        url: that.baseApi + '/api/auth',
                        method: 'post',
                        dataType: 'json',
                        data: {
                            login: self.login,
                            password: self.password
                        },

                        success: function(data) {
                            chrome.runtime.sendMessage({action: 'auth.loginAction', params: [data.user]} , function() {
                                self.login = null;
                                self.password = null;
                            });
                        },

                        error: function(data) {
                            alert(data.responseJSON.message);
                        }
                    });
                }

            }, {prefix: "login"});
        }
   };

   App.controllers.loginModal.init();
});
/**
 * Created by PUBLICIW on 25/03/15.
 */

(function($) {

    App.controllers.singleCoupon = {
        open: function(coupon) {
            chrome.runtime.sendMessage({ action: 'getView', params: ['single-coupon-opened.html'] }, function (html) {
                App.animate.fadeSwitchContent(App.controllers.coupons.$el, html, function() {

                    rivets.bind(App.controllers.coupons.$el, {
                        onClickListAllCoupons: function() {
                            App.controllers.coupons.listAllCoupons();
                            App.animate.description.close();
                            App.animate.contentState = 'full';
                            App.controllers.coupons.$el.height('471px');
                            App.animate.contentIn();
                        },
                        onToggleDescription: function() {
                            if (App.animate.description.state == 'closed') {
                                App.animate.description.open();
                            } else {
                                App.animate.description.close();
                            }
                        },
                        onClickCode: App.controllers.coupons.onClickCode,
                        coupon: coupon
                    });

                    App.controllers.description.setContent(coupon.description);
                });

                App.controllers.coupons.$el.height('220px');
                App.animate.contentState = 'single';
                App.animate.contentIn();
            });
        }
    }

})(jQuery);
/**
 * Created by PUBLICIW on 08/01/15.
 */

App.ready(function() {

    App.controllers.topBar = {
        $el: App.$el.find('#top-bar, #retractable'),

        view: null,

        onTagMouseOver: function() {
            App.controllers.topBar.$el.find('.mc-tag-piece')
                .addClass('mc-tag-piece-hover');
            App.controllers.topBar.$el.find('.mc-tag-logo-name')
                .addClass('mc-tag-logo-name-hover');
            App.controllers.topBar.$el.find('.mc-tag-logo-img')
                .addClass('mc-tag-logo-img-hover');
        },
        onTagMouseOut: function() {
            App.controllers.topBar.$el.find('.mc-tag-piece')
                .removeClass('mc-tag-piece-hover');
            App.controllers.topBar.$el.find('.mc-tag-logo-name')
                .removeClass('mc-tag-logo-name-hover');
            App.controllers.topBar.$el.find('.mc-tag-logo-img')
                .removeClass('mc-tag-logo-img-hover');
        },

        onMinimize: function() {
            App.open('mini-tag');
            //App.controllers.dialogBox.showMessage('Clique no ícone <span class="mc-img-icon"></span> acima para fechar.', 'click_icon_to_close');
        },

        checkAuth: function() {
            var that = this;

            chrome.runtime.sendMessage({action: 'auth.isUserLogged', params: []}, function (isLogged){
                that.view.models.userLogged = isLogged;

                if (isLogged) {
                    chrome.runtime.sendMessage({ action: 'auth.getUser' }, function(user) {
                        that.view.models.user = user;
                    });
                }
            });
        },

        init: function() {
            var that = this;

            App.controllers.topBar.$el.hover(function() {
                if (App.animate.state == 'mini-tag' || App.animate.state == 'tag') {
                    App.controllers.topBar.onTagMouseOver();
                }
            }, function() {
                App.controllers.topBar.onTagMouseOut();
            });

            App.controllers.topBar.$el.find('.mc-close').click(function() {
                App.close();
            });

            App.findCouponsByHost().then(function(data) {
                App.controllers.topBar.view
                    .models.offersCount = data.couponQty;
            });

            that.checkAuth();
        }
    };

    App.controllers.topBar.view = rivets.bind(App.controllers.topBar.$el, {
        offersCount: 0,
        showCounterBall: true,

        userLogged: null,
        user: null,

        showLoginModal: function(event) {
            event.preventDefault();
            App.animate.loginModalIn()
        },

        togglePlugin: function(event) {
            if (App.animate.state == 'mini-tag' || App.animate.state == 'tag') {
                App.open();
                App.controllers.topBar.onTagMouseOut();
            } else if (App.animate.state != 'complete-closed') {
                App.controllers.topBar.onMinimize();
            }
        },

        logoutRequest: function(event) {
            var that = this;
            if (event) {
                event.preventDefault();
            }

            chrome.runtime.sendMessage({action: 'auth.logoutAction', params: []}, function() {
                that.userLogged = false;
                that.user = null;
                App.open('login');
                App.controllers.topBar.checkAuth();
                App.controllers.Cashback.view.models.userLogged = false;
            });
        }

    }, { prefix: "top-bar" });

    App.controllers.topBar.init();
});
/**
 * Created by PUBLICIW on 07/01/15.
 */

(function($) {
    
    var animationSpeed = 50; /*velocidade da animação de transição de tags, era 300 */

    this.App.animate = {
        animationQueue: $({}),
        state: 'complete-closed',
        contentState: 'full',
        contentHeights: {
            full: function() {
                var height = App.$el.find('.mc-status-panel').height() + App.$el.find('.mc-coupons').height() + App.$el.find('.mc-go-to-meucupom').height() + 70;

                return height.toString() + 'px';
            },
            single: function() { return '268px'; }
        },
        sequence: ["complete-closed", "mini-tag", "tag", "content", "login"],

        control: {
            next: false, // set to App.animate.tagIn after defined
            previous: false,
            goto: function(state) {
                var currentStateIndex = App.animate.sequence.indexOf(App.animate.state);
                var stateIndex = App.animate.sequence.indexOf(state);
                var direction = (currentStateIndex < stateIndex) ? 'forward' : 'backward';

                if (direction === 'forward') {
                    while (App.animate.state !== state) {
                        App.animate.control.next();
                    }
                } else if (direction === 'backward') {
                    while (App.animate.state !== state) {
                        App.animate.control.previous();
                    }
                }
            }
        },

        fadeSwitchContent: function($el, $newContent, onReady) {
            $el.fadeOut(400, function() {
                $el.html($newContent);
                onReady();
                $el.fadeIn();
            });
        },

        miniTagIn: function() {
            App.animate.animationQueue.queue(function(next) {
                App.$el
                    .animate({ right: '-278px' }, animationSpeed, 'swing', next)
                    .find('.mc-tag-logo-name').animate({ left: '200px' }, animationSpeed);
                App.$el.find('.mc-top-bar').css('background-color', 'transparent');
            });

            App.$el.addClass('opened');
            App.animate.state = 'mini-tag';
            App.animate.control.next = App.animate.tagIn;
            App.animate.control.previous = App.animate.miniTagOut;
        },

        miniTagOut: function() {
            App.animate.animationQueue.queue(function(next) {
                App.$el
                    .animate({ right: '-450px' }, animationSpeed, 'swing', next);
            });

            App.$el.removeClass('opened');
            App.animate.state = 'complete-closed';
            App.animate.control.next = App.animate.miniTagIn;
            App.animate.control.previous = false;
        },

        tagIn: function() {
            App.animate.animationQueue.queue(function(next) {
                setTimeout(function() {
                    App.$el.find('.mc-top-bar').css("background-color", "rgb(246, 246, 246)");
                }, animationSpeed/2);

                App.$el.find('.mc-tag-logo-name').animate({ left: '0' }, animationSpeed);
                App.$el.animate({ right: '-265px' }, animationSpeed, 'swing', next);
            });

            App.controllers.topBar.$el.css("pointer-events", "auto");

            App.animate.state = 'tag';
            App.animate.control.next = App.animate.contentIn;
            App.animate.control.previous = App.animate.miniTagIn;
        },

        tagOut: function() {
            App.animate.animationQueue.queue(function(next) {
                App.$el
                    .animate({right: '-278px'}, animationSpeed, 'swing', next)
                    .find('.mc-tag-logo-name').animate({ left: '200px' }, animationSpeed);

                setTimeout(function() {
                    App.$el.find('.mc-top-bar').css('background-color', 'transparent');
                }, animationSpeed/2);
            });

            App.controllers.topBar.$el.css("pointer-events", "none");

            App.animate.state = 'mini-tag';
            App.animate.control.next = App.animate.tagIn;
            App.animate.control.previous = App.animate.miniTagOut;
        },

        contentIn: function() {
            App.animate.animationQueue.queue(function(next) {
                App.$el.animate({ right: '0' }, animationSpeed, 'swing', function() {
                    App.$el.find('#retractable').animate({height: App.animate.contentHeights[App.animate.contentState]()}, animationSpeed, 'swing', next);
                });
            });

            chrome.runtime.sendMessage({action: 'auth.isLoginDismissed', params: []}, function (isLoginDismissed){
                if(!isLoginDismissed) {
                    App.open('login');
                }
            });

            App.animate.state = 'content';
            App.animate.control.next = App.animate.loginModalIn;
            App.animate.control.previous = App.animate.contentOut;
        },

        contentOut: function() {
            App.animate.animationQueue.queue(function(next) {
                App.$el.find('#retractable').animate({height: '0'}, animationSpeed, 'swing', function() {
                    App.$el.animate({ right: '-265px' }, animationSpeed, 'swing', next);
                });
            });

            App.animate.state = 'tag';
            App.animate.control.next = App.animate.contentIn;
            App.animate.control.previous = App.animate.tagOut;
        },

        couponOpen: function($el) {
            App.animate.animationQueue.queue(function(next) {
                var $description = $el.find('.mc-description');
                var originalHeight = $description.height();
                $description.css('height', 'auto');
                var finalHeight = $description.height();
                $description.css('height', originalHeight);

                if (finalHeight > originalHeight) {
                    $el.parent().find('.mc-coupon-head').animate({height: finalHeight + 100}, animationSpeed);
                    $description.animate({height: finalHeight}, animationSpeed);
                    $el.animate({height: finalHeight + 77}, animationSpeed, 'swing', next);
                } else {
                    next();
                }
            });
        },

        couponClose: function($el) {
            App.animate.animationQueue.queue(function(next) {
                $el.parent().find('.mc-coupon-head').animate({height: '100px'}, animationSpeed);
                $el.find('.mc-description').animate({ height: '0' }, animationSpeed);
                $el.animate({height: '80px'}, animationSpeed, 'swing', next);
            });
        },

        loginModalIn: function() {
            App.animate.animationQueue.queue(function(next) {
                App.$el.find('#mc-login-modal').fadeIn(animationSpeed, next);
            });

            App.animate.state = 'login';
            App.animate.control.next = false;
            App.animate.control.previous = App.animate.loginModalOut;

        },

        loginModalOut: function($el) {
            App.animate.animationQueue.queue(function(next) {
                App.$el.find('#mc-login-modal').fadeOut(animationSpeed, next);
            });

            App.animate.state = 'content';
            App.animate.control.next = App.animate.loginModalIn;
            App.animate.control.previous = App.animate.contentOut;

        },

        description: {
            state: 'closed',
            open: function() {
                App.animate.animationQueue.queue(function(next) {
                    App.controllers.description.$el
                        .animate({
                            'height': 'auto',
                            'min-height': '50px'
                        }, animationSpeed, 'swing', next);

                    App.animate.description.state = 'opened';
                });
            },

            close: function() {
                App.animate.animationQueue.queue(function(next) {
                    App.controllers.description.$el
                        .animate({
                            'height': '0',
                            'min-height': '0'
                        }, animationSpeed, 'swing', next);

                    App.animate.description.state = 'closed';
                });
            }
        }
    };

    App.animate.control.next = App.animate.miniTagIn;
    App.ready(function() {
        App.$el.css('height', '0');
    });

})(jQuery);
/**
 * Created by PUBLICIW on 13/01/15.
 */

(function($) {

    var clickedStores = [];
    chrome.runtime.sendMessage({ action: 'clickedStores.getAllClickedStores' }, function(data) {
        clickedStores = data;
    });

    this.App.clickedStores = {
        setIsClicked: function(store, openSingleOnNextVisit, clickedCouponId, expireIn) {
            openSingleOnNextVisit = openSingleOnNextVisit || false;
            expireIn = expireIn || 6;

            chrome.runtime.sendMessage({
                action: 'clickedStores.setIsClicked',
                params: [store, openSingleOnNextVisit, clickedCouponId, expireIn]
            });
            clickedStores.push(store);
        },

        getStore: function(store) {
            var selectedStore = null;

            clickedStores.map(function(clickedStore) {
                if (clickedStore.value == store) {
                    selectedStore = clickedStore;
                }
            });

            return selectedStore;
        },

        isClicked: function(store) {
            return this.getStore(store) != null;
        },

        isOpenSingleOnNextVisit: function(store) {
            if (this.isClicked(store)) {
                return this.getStore(store).openSingleOnNextVisit;
            }

            return false;
        },

        cleanOpenSingleOnNextVisit: function() {
            chrome.runtime.sendMessage({ action: 'clickedStores.cleanOpenSingleOnNextVisit' });
        }
    };

})(jQuery);
/**
 * Created by PUBLICIW on 13/01/15.
 */

(function() {

    var readMessages = [];


    this.App.readMessages = {
        refreshLocalCache: function() {
            chrome.runtime.sendMessage({ action: 'readMessages.getAllReadMessages' }, function(data) {
                readMessages = data;
            });
        },
        setIsRead: function(messageId, expires) {
            chrome.runtime.sendMessage({
                action: 'readMessages.setIsRead',
                params: [messageId, expires]
            });
            App.readMessages.refreshLocalCache();
        },

        isRead: function(messageId) {
            return readMessages.indexOf(messageId) != -1;
        }
    };

    App.readMessages.refreshLocalCache();

})();
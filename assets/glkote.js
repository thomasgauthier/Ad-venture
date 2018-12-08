var Prototype={Version:'1.6.1',Browser:(function(){var ua=navigator.userAgent;var isOpera=Object.prototype.toString.call(window.opera)=='[object Opera]';return{IE:!!window.attachEvent&&!isOpera,Opera:isOpera,WebKit:ua.indexOf('AppleWebKit/')>-1,Gecko:ua.indexOf('Gecko')>-1&&ua.indexOf('KHTML')===-1,MobileSafari:/Apple.*Mobile.*Safari/.test(ua)}})(),BrowserFeatures:{XPath:!!document.evaluate,SelectorsAPI:!!document.querySelector,ElementExtensions:(function(){var constructor=window.Element||window.HTMLElement;return!!(constructor&&constructor.prototype);})(),SpecificElementExtensions:(function(){if(typeof window.HTMLDivElement!=='undefined')
return true;var div=document.createElement('div');var form=document.createElement('form');var isSupported=false;if(div['__proto__']&&(div['__proto__']!==form['__proto__'])){isSupported=true;}
div=form=null;return isSupported;})()},ScriptFragment:'<script[^>]*>([\\S\\s]*?)<\/script>',JSONFilter:/^\/\*-secure-([\s\S]*)\*\/\s*$/,emptyFunction:function(){},K:function(x){return x}};if(Prototype.Browser.MobileSafari)
Prototype.BrowserFeatures.SpecificElementExtensions=false;var Abstract={};var Try={these:function(){var returnValue;for(var i=0,length=arguments.length;i<length;i++){var lambda=arguments[i];try{returnValue=lambda();break;}catch(e){}}
return returnValue;}};var Class=(function(){function subclass(){};function create(){var parent=null,properties=$A(arguments);if(Object.isFunction(properties[0]))
parent=properties.shift();function klass(){this.initialize.apply(this,arguments);}
Object.extend(klass,Class.Methods);klass.superclass=parent;klass.subclasses=[];if(parent){subclass.prototype=parent.prototype;klass.prototype=new subclass;parent.subclasses.push(klass);}
for(var i=0;i<properties.length;i++)
klass.addMethods(properties[i]);if(!klass.prototype.initialize)
klass.prototype.initialize=Prototype.emptyFunction;klass.prototype.constructor=klass;return klass;}
function addMethods(source){var ancestor=this.superclass&&this.superclass.prototype;var properties=Object.keys(source);if(!Object.keys({toString:true}).length){if(source.toString!=Object.prototype.toString)
properties.push("toString");if(source.valueOf!=Object.prototype.valueOf)
properties.push("valueOf");}
for(var i=0,length=properties.length;i<length;i++){var property=properties[i],value=source[property];if(ancestor&&Object.isFunction(value)&&value.argumentNames().first()=="$super"){var method=value;value=(function(m){return function(){return ancestor[m].apply(this,arguments);};})(property).wrap(method);value.valueOf=method.valueOf.bind(method);value.toString=method.toString.bind(method);}
this.prototype[property]=value;}
return this;}
return{create:create,Methods:{addMethods:addMethods}};})();(function(){var _toString=Object.prototype.toString;function extend(destination,source){for(var property in source)
destination[property]=source[property];return destination;}
function inspect(object){try{if(isUndefined(object))return'undefined';if(object===null)return'null';return object.inspect?object.inspect():String(object);}catch(e){if(e instanceof RangeError)return'...';throw e;}}
function toJSON(object){var type=typeof object;switch(type){case'undefined':case'function':case'unknown':return;case'boolean':return object.toString();}
if(object===null)return'null';if(object.toJSON)return object.toJSON();if(isElement(object))return;var results=[];for(var property in object){var value=toJSON(object[property]);if(!isUndefined(value))
results.push(property.toJSON()+': '+value);}
return'{'+results.join(', ')+'}';}
function toQueryString(object){return $H(object).toQueryString();}
function toHTML(object){return object&&object.toHTML?object.toHTML():String.interpret(object);}
function keys(object){var results=[];for(var property in object)
results.push(property);return results;}
function values(object){var results=[];for(var property in object)
results.push(object[property]);return results;}
function clone(object){return extend({},object);}
function isElement(object){return!!(object&&object.nodeType==1);}
function isArray(object){return _toString.call(object)=="[object Array]";}
function isHash(object){return object instanceof Hash;}
function isFunction(object){return typeof object==="function";}
function isString(object){return _toString.call(object)=="[object String]";}
function isNumber(object){return _toString.call(object)=="[object Number]";}
function isUndefined(object){return typeof object==="undefined";}
extend(Object,{extend:extend,inspect:inspect,toJSON:toJSON,toQueryString:toQueryString,toHTML:toHTML,keys:keys,values:values,clone:clone,isElement:isElement,isArray:isArray,isHash:isHash,isFunction:isFunction,isString:isString,isNumber:isNumber,isUndefined:isUndefined});})();Object.extend(Function.prototype,(function(){var slice=Array.prototype.slice;function update(array,args){var arrayLength=array.length,length=args.length;while(length--)array[arrayLength+length]=args[length];return array;}
function merge(array,args){array=slice.call(array,0);return update(array,args);}
function argumentNames(){var names=this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1].replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g,'').replace(/\s+/g,'').split(',');return names.length==1&&!names[0]?[]:names;}
function bind(context){if(arguments.length<2&&Object.isUndefined(arguments[0]))return this;var __method=this,args=slice.call(arguments,1);return function(){var a=merge(args,arguments);return __method.apply(context,a);}}
function bindAsEventListener(context){var __method=this,args=slice.call(arguments,1);return function(event){var a=update([event||window.event],args);return __method.apply(context,a);}}
function curry(){if(!arguments.length)return this;var __method=this,args=slice.call(arguments,0);return function(){var a=merge(args,arguments);return __method.apply(this,a);}}
function delay(timeout){var __method=this,args=slice.call(arguments,1);timeout=timeout*1000
return window.setTimeout(function(){return __method.apply(__method,args);},timeout);}
function defer(){var args=update([0.01],arguments);return this.delay.apply(this,args);}
function wrap(wrapper){var __method=this;return function(){var a=update([__method.bind(this)],arguments);return wrapper.apply(this,a);}}
function methodize(){if(this._methodized)return this._methodized;var __method=this;return this._methodized=function(){var a=update([this],arguments);return __method.apply(null,a);};}
return{argumentNames:argumentNames,bind:bind,bindAsEventListener:bindAsEventListener,curry:curry,delay:delay,defer:defer,wrap:wrap,methodize:methodize}})());Date.prototype.toJSON=function(){return'"'+this.getUTCFullYear()+'-'+
(this.getUTCMonth()+1).toPaddedString(2)+'-'+
this.getUTCDate().toPaddedString(2)+'T'+
this.getUTCHours().toPaddedString(2)+':'+
this.getUTCMinutes().toPaddedString(2)+':'+
this.getUTCSeconds().toPaddedString(2)+'Z"';};RegExp.prototype.match=RegExp.prototype.test;RegExp.escape=function(str){return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g,'\\$1');};var PeriodicalExecuter=Class.create({initialize:function(callback,frequency){this.callback=callback;this.frequency=frequency;this.currentlyExecuting=false;this.registerCallback();},registerCallback:function(){this.timer=setInterval(this.onTimerEvent.bind(this),this.frequency*1000);},execute:function(){this.callback(this);},stop:function(){if(!this.timer)return;clearInterval(this.timer);this.timer=null;},onTimerEvent:function(){if(!this.currentlyExecuting){try{this.currentlyExecuting=true;this.execute();this.currentlyExecuting=false;}catch(e){this.currentlyExecuting=false;throw e;}}}});Object.extend(String,{interpret:function(value){return value==null?'':String(value);},specialChar:{'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','\\':'\\\\'}});Object.extend(String.prototype,(function(){function prepareReplacement(replacement){if(Object.isFunction(replacement))return replacement;var template=new Template(replacement);return function(match){return template.evaluate(match)};}
function gsub(pattern,replacement){var result='',source=this,match;replacement=prepareReplacement(replacement);if(Object.isString(pattern))
pattern=RegExp.escape(pattern);if(!(pattern.length||pattern.source)){replacement=replacement('');return replacement+source.split('').join(replacement)+replacement;}
while(source.length>0){if(match=source.match(pattern)){result+=source.slice(0,match.index);result+=String.interpret(replacement(match));source=source.slice(match.index+match[0].length);}else{result+=source,source='';}}
return result;}
function sub(pattern,replacement,count){replacement=prepareReplacement(replacement);count=Object.isUndefined(count)?1:count;return this.gsub(pattern,function(match){if(--count<0)return match[0];return replacement(match);});}
function scan(pattern,iterator){this.gsub(pattern,iterator);return String(this);}
function truncate(length,truncation){length=length||30;truncation=Object.isUndefined(truncation)?'...':truncation;return this.length>length?this.slice(0,length-truncation.length)+truncation:String(this);}
function strip(){return this.replace(/^\s+/,'').replace(/\s+$/,'');}
function stripTags(){return this.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi,'');}
function stripScripts(){return this.replace(new RegExp(Prototype.ScriptFragment,'img'),'');}
function extractScripts(){var matchAll=new RegExp(Prototype.ScriptFragment,'img');var matchOne=new RegExp(Prototype.ScriptFragment,'im');return(this.match(matchAll)||[]).map(function(scriptTag){return(scriptTag.match(matchOne)||['',''])[1];});}
function evalScripts(){return this.extractScripts().map(function(script){return eval(script)});}
function escapeHTML(){return this.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function unescapeHTML(){return this.stripTags().replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');}
function toQueryParams(separator){var match=this.strip().match(/([^?#]*)(#.*)?$/);if(!match)return{};return match[1].split(separator||'&').inject({},function(hash,pair){if((pair=pair.split('='))[0]){var key=decodeURIComponent(pair.shift());var value=pair.length>1?pair.join('='):pair[0];if(value!=undefined)value=decodeURIComponent(value);if(key in hash){if(!Object.isArray(hash[key]))hash[key]=[hash[key]];hash[key].push(value);}
else hash[key]=value;}
return hash;});}
function toArray(){return this.split('');}
function succ(){return this.slice(0,this.length-1)+
String.fromCharCode(this.charCodeAt(this.length-1)+1);}
function times(count){return count<1?'':new Array(count+1).join(this);}
function camelize(){var parts=this.split('-'),len=parts.length;if(len==1)return parts[0];var camelized=this.charAt(0)=='-'?parts[0].charAt(0).toUpperCase()+parts[0].substring(1):parts[0];for(var i=1;i<len;i++)
camelized+=parts[i].charAt(0).toUpperCase()+parts[i].substring(1);return camelized;}
function capitalize(){return this.charAt(0).toUpperCase()+this.substring(1).toLowerCase();}
function underscore(){return this.replace(/::/g,'/').replace(/([A-Z]+)([A-Z][a-z])/g,'$1_$2').replace(/([a-z\d])([A-Z])/g,'$1_$2').replace(/-/g,'_').toLowerCase();}
function dasherize(){return this.replace(/_/g,'-');}
function inspect(useDoubleQuotes){var escapedString=this.replace(/[\x00-\x1f\\]/g,function(character){if(character in String.specialChar){return String.specialChar[character];}
return'\\u00'+character.charCodeAt().toPaddedString(2,16);});if(useDoubleQuotes)return'"'+escapedString.replace(/"/g,'\\"')+'"';return"'"+escapedString.replace(/'/g,'\\\'')+"'";}
function toJSON(){return this.inspect(true);}
function unfilterJSON(filter){return this.replace(filter||Prototype.JSONFilter,'$1');}
function isJSON(){var str=this;if(str.blank())return false;str=this.replace(/\\./g,'@').replace(/"[^"\\\n\r]*"/g,'');return(/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(str);}
function evalJSON(sanitize){var json=this.unfilterJSON();try{if(!sanitize||json.isJSON())return eval('('+json+')');}catch(e){}
throw new SyntaxError('Badly formed JSON string: '+this.inspect());}
function include(pattern){return this.indexOf(pattern)>-1;}
function startsWith(pattern){return this.indexOf(pattern)===0;}
function endsWith(pattern){var d=this.length-pattern.length;return d>=0&&this.lastIndexOf(pattern)===d;}
function empty(){return this=='';}
function blank(){return/^\s*$/.test(this);}
function interpolate(object,pattern){return new Template(this,pattern).evaluate(object);}
return{gsub:gsub,sub:sub,scan:scan,truncate:truncate,strip:String.prototype.trim?String.prototype.trim:strip,stripTags:stripTags,stripScripts:stripScripts,extractScripts:extractScripts,evalScripts:evalScripts,escapeHTML:escapeHTML,unescapeHTML:unescapeHTML,toQueryParams:toQueryParams,parseQuery:toQueryParams,toArray:toArray,succ:succ,times:times,camelize:camelize,capitalize:capitalize,underscore:underscore,dasherize:dasherize,inspect:inspect,toJSON:toJSON,unfilterJSON:unfilterJSON,isJSON:isJSON,evalJSON:evalJSON,include:include,startsWith:startsWith,endsWith:endsWith,empty:empty,blank:blank,interpolate:interpolate};})());var Template=Class.create({initialize:function(template,pattern){this.template=template.toString();this.pattern=pattern||Template.Pattern;},evaluate:function(object){if(object&&Object.isFunction(object.toTemplateReplacements))
object=object.toTemplateReplacements();return this.template.gsub(this.pattern,function(match){if(object==null)return(match[1]+'');var before=match[1]||'';if(before=='\\')return match[2];var ctx=object,expr=match[3];var pattern=/^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;match=pattern.exec(expr);if(match==null)return before;while(match!=null){var comp=match[1].startsWith('[')?match[2].replace(/\\\\]/g,']'):match[1];ctx=ctx[comp];if(null==ctx||''==match[3])break;expr=expr.substring('['==match[3]?match[1].length:match[0].length);match=pattern.exec(expr);}
return before+String.interpret(ctx);});}});Template.Pattern=/(^|.|\r|\n)(#\{(.*?)\})/;var $break={};var Enumerable=(function(){function each(iterator,context){var index=0;try{this._each(function(value){iterator.call(context,value,index++);});}catch(e){if(e!=$break)throw e;}
return this;}
function eachSlice(number,iterator,context){var index=-number,slices=[],array=this.toArray();if(number<1)return array;while((index+=number)<array.length)
slices.push(array.slice(index,index+number));return slices.collect(iterator,context);}
function all(iterator,context){iterator=iterator||Prototype.K;var result=true;this.each(function(value,index){result=result&&!!iterator.call(context,value,index);if(!result)throw $break;});return result;}
function any(iterator,context){iterator=iterator||Prototype.K;var result=false;this.each(function(value,index){if(result=!!iterator.call(context,value,index))
throw $break;});return result;}
function collect(iterator,context){iterator=iterator||Prototype.K;var results=[];this.each(function(value,index){results.push(iterator.call(context,value,index));});return results;}
function detect(iterator,context){var result;this.each(function(value,index){if(iterator.call(context,value,index)){result=value;throw $break;}});return result;}
function findAll(iterator,context){var results=[];this.each(function(value,index){if(iterator.call(context,value,index))
results.push(value);});return results;}
function grep(filter,iterator,context){iterator=iterator||Prototype.K;var results=[];if(Object.isString(filter))
filter=new RegExp(RegExp.escape(filter));this.each(function(value,index){if(filter.match(value))
results.push(iterator.call(context,value,index));});return results;}
function include(object){if(Object.isFunction(this.indexOf))
if(this.indexOf(object)!=-1)return true;var found=false;this.each(function(value){if(value==object){found=true;throw $break;}});return found;}
function inGroupsOf(number,fillWith){fillWith=Object.isUndefined(fillWith)?null:fillWith;return this.eachSlice(number,function(slice){while(slice.length<number)slice.push(fillWith);return slice;});}
function inject(memo,iterator,context){this.each(function(value,index){memo=iterator.call(context,memo,value,index);});return memo;}
function invoke(method){var args=$A(arguments).slice(1);return this.map(function(value){return value[method].apply(value,args);});}
function max(iterator,context){iterator=iterator||Prototype.K;var result;this.each(function(value,index){value=iterator.call(context,value,index);if(result==null||value>=result)
result=value;});return result;}
function min(iterator,context){iterator=iterator||Prototype.K;var result;this.each(function(value,index){value=iterator.call(context,value,index);if(result==null||value<result)
result=value;});return result;}
function partition(iterator,context){iterator=iterator||Prototype.K;var trues=[],falses=[];this.each(function(value,index){(iterator.call(context,value,index)?trues:falses).push(value);});return[trues,falses];}
function pluck(property){var results=[];this.each(function(value){results.push(value[property]);});return results;}
function reject(iterator,context){var results=[];this.each(function(value,index){if(!iterator.call(context,value,index))
results.push(value);});return results;}
function sortBy(iterator,context){return this.map(function(value,index){return{value:value,criteria:iterator.call(context,value,index)};}).sort(function(left,right){var a=left.criteria,b=right.criteria;return a<b?-1:a>b?1:0;}).pluck('value');}
function toArray(){return this.map();}
function zip(){var iterator=Prototype.K,args=$A(arguments);if(Object.isFunction(args.last()))
iterator=args.pop();var collections=[this].concat(args).map($A);return this.map(function(value,index){return iterator(collections.pluck(index));});}
function size(){return this.toArray().length;}
function inspect(){return'#<Enumerable:'+this.toArray().inspect()+'>';}
return{each:each,eachSlice:eachSlice,all:all,every:all,any:any,some:any,collect:collect,map:collect,detect:detect,findAll:findAll,select:findAll,filter:findAll,grep:grep,include:include,member:include,inGroupsOf:inGroupsOf,inject:inject,invoke:invoke,max:max,min:min,partition:partition,pluck:pluck,reject:reject,sortBy:sortBy,toArray:toArray,entries:toArray,zip:zip,size:size,inspect:inspect,find:detect};})();function $A(iterable){if(!iterable)return[];if('toArray'in Object(iterable))return iterable.toArray();var length=iterable.length||0,results=new Array(length);while(length--)results[length]=iterable[length];return results;}
function $w(string){if(!Object.isString(string))return[];string=string.strip();return string?string.split(/\s+/):[];}
Array.from=$A;(function(){var arrayProto=Array.prototype,slice=arrayProto.slice,_each=arrayProto.forEach;function each(iterator){for(var i=0,length=this.length;i<length;i++)
iterator(this[i]);}
if(!_each)_each=each;function clear(){this.length=0;return this;}
function first(){return this[0];}
function last(){return this[this.length-1];}
function compact(){return this.select(function(value){return value!=null;});}
function flatten(){return this.inject([],function(array,value){if(Object.isArray(value))
return array.concat(value.flatten());array.push(value);return array;});}
function without(){var values=slice.call(arguments,0);return this.select(function(value){return!values.include(value);});}
function reverse(inline){return(inline!==false?this:this.toArray())._reverse();}
function uniq(sorted){return this.inject([],function(array,value,index){if(0==index||(sorted?array.last()!=value:!array.include(value)))
array.push(value);return array;});}
function intersect(array){return this.uniq().findAll(function(item){return array.detect(function(value){return item===value});});}
function clone(){return slice.call(this,0);}
function size(){return this.length;}
function inspect(){return'['+this.map(Object.inspect).join(', ')+']';}
function toJSON(){var results=[];this.each(function(object){var value=Object.toJSON(object);if(!Object.isUndefined(value))results.push(value);});return'['+results.join(', ')+']';}
function indexOf(item,i){i||(i=0);var length=this.length;if(i<0)i=length+i;for(;i<length;i++)
if(this[i]===item)return i;return-1;}
function lastIndexOf(item,i){i=isNaN(i)?this.length:(i<0?this.length+i:i)+1;var n=this.slice(0,i).reverse().indexOf(item);return(n<0)?n:i-n-1;}
function concat(){var array=slice.call(this,0),item;for(var i=0,length=arguments.length;i<length;i++){item=arguments[i];if(Object.isArray(item)&&!('callee'in item)){for(var j=0,arrayLength=item.length;j<arrayLength;j++)
array.push(item[j]);}else{array.push(item);}}
return array;}
Object.extend(arrayProto,Enumerable);if(!arrayProto._reverse)
arrayProto._reverse=arrayProto.reverse;Object.extend(arrayProto,{_each:_each,clear:clear,first:first,last:last,compact:compact,flatten:flatten,without:without,reverse:reverse,uniq:uniq,intersect:intersect,clone:clone,toArray:clone,size:size,inspect:inspect,toJSON:toJSON});var CONCAT_ARGUMENTS_BUGGY=(function(){return[].concat(arguments)[0][0]!==1;})(1,2)
if(CONCAT_ARGUMENTS_BUGGY)arrayProto.concat=concat;if(!arrayProto.indexOf)arrayProto.indexOf=indexOf;if(!arrayProto.lastIndexOf)arrayProto.lastIndexOf=lastIndexOf;})();function $H(object){return new Hash(object);};var Hash=Class.create(Enumerable,(function(){function initialize(object){this._object=Object.isHash(object)?object.toObject():Object.clone(object);}
function _each(iterator){for(var key in this._object){var value=this._object[key],pair=[key,value];pair.key=key;pair.value=value;iterator(pair);}}
function set(key,value){return this._object[key]=value;}
function get(key){if(this._object[key]!==Object.prototype[key])
return this._object[key];}
function unset(key){var value=this._object[key];delete this._object[key];return value;}
function toObject(){return Object.clone(this._object);}
function keys(){return this.pluck('key');}
function values(){return this.pluck('value');}
function index(value){var match=this.detect(function(pair){return pair.value===value;});return match&&match.key;}
function merge(object){return this.clone().update(object);}
function update(object){return new Hash(object).inject(this,function(result,pair){result.set(pair.key,pair.value);return result;});}
function toQueryPair(key,value){if(Object.isUndefined(value))return key;return key+'='+encodeURIComponent(String.interpret(value));}
function toQueryString(){return this.inject([],function(results,pair){var key=encodeURIComponent(pair.key),values=pair.value;if(values&&typeof values=='object'){if(Object.isArray(values))
return results.concat(values.map(toQueryPair.curry(key)));}else results.push(toQueryPair(key,values));return results;}).join('&');}
function inspect(){return'#<Hash:{'+this.map(function(pair){return pair.map(Object.inspect).join(': ');}).join(', ')+'}>';}
function toJSON(){return Object.toJSON(this.toObject());}
function clone(){return new Hash(this);}
return{initialize:initialize,_each:_each,set:set,get:get,unset:unset,toObject:toObject,toTemplateReplacements:toObject,keys:keys,values:values,index:index,merge:merge,update:update,toQueryString:toQueryString,inspect:inspect,toJSON:toJSON,clone:clone};})());Hash.from=$H;Object.extend(Number.prototype,(function(){function toColorPart(){return this.toPaddedString(2,16);}
function succ(){return this+1;}
function times(iterator,context){$R(0,this,true).each(iterator,context);return this;}
function toPaddedString(length,radix){var string=this.toString(radix||10);return'0'.times(length-string.length)+string;}
function toJSON(){return isFinite(this)?this.toString():'null';}
function abs(){return Math.abs(this);}
function round(){return Math.round(this);}
function ceil(){return Math.ceil(this);}
function floor(){return Math.floor(this);}
return{toColorPart:toColorPart,succ:succ,times:times,toPaddedString:toPaddedString,toJSON:toJSON,abs:abs,round:round,ceil:ceil,floor:floor};})());function $R(start,end,exclusive){return new ObjectRange(start,end,exclusive);}
var ObjectRange=Class.create(Enumerable,(function(){function initialize(start,end,exclusive){this.start=start;this.end=end;this.exclusive=exclusive;}
function _each(iterator){var value=this.start;while(this.include(value)){iterator(value);value=value.succ();}}
function include(value){if(value<this.start)
return false;if(this.exclusive)
return value<this.end;return value<=this.end;}
return{initialize:initialize,_each:_each,include:include};})());var Ajax={getTransport:function(){return Try.these(function(){return new XMLHttpRequest()},function(){return new ActiveXObject('Msxml2.XMLHTTP')},function(){return new ActiveXObject('Microsoft.XMLHTTP')})||false;},activeRequestCount:0};Ajax.Responders={responders:[],_each:function(iterator){this.responders._each(iterator);},register:function(responder){if(!this.include(responder))
this.responders.push(responder);},unregister:function(responder){this.responders=this.responders.without(responder);},dispatch:function(callback,request,transport,json){this.each(function(responder){if(Object.isFunction(responder[callback])){try{responder[callback].apply(responder,[request,transport,json]);}catch(e){}}});}};Object.extend(Ajax.Responders,Enumerable);Ajax.Responders.register({onCreate:function(){Ajax.activeRequestCount++},onComplete:function(){Ajax.activeRequestCount--}});Ajax.Base=Class.create({initialize:function(options){this.options={method:'post',asynchronous:true,contentType:'application/x-www-form-urlencoded',encoding:'UTF-8',parameters:'',evalJSON:true,evalJS:true};Object.extend(this.options,options||{});this.options.method=this.options.method.toLowerCase();if(Object.isString(this.options.parameters))
this.options.parameters=this.options.parameters.toQueryParams();else if(Object.isHash(this.options.parameters))
this.options.parameters=this.options.parameters.toObject();}});Ajax.Request=Class.create(Ajax.Base,{_complete:false,initialize:function($super,url,options){$super(options);this.transport=Ajax.getTransport();this.request(url);},request:function(url){this.url=url;this.method=this.options.method;var params=Object.clone(this.options.parameters);if(!['get','post'].include(this.method)){params['_method']=this.method;this.method='post';}
this.parameters=params;if(params=Object.toQueryString(params)){if(this.method=='get')
this.url+=(this.url.include('?')?'&':'?')+params;else if(/Konqueror|Safari|KHTML/.test(navigator.userAgent))
params+='&_=';}
try{var response=new Ajax.Response(this);if(this.options.onCreate)this.options.onCreate(response);Ajax.Responders.dispatch('onCreate',this,response);this.transport.open(this.method.toUpperCase(),this.url,this.options.asynchronous);if(this.options.asynchronous)this.respondToReadyState.bind(this).defer(1);this.transport.onreadystatechange=this.onStateChange.bind(this);this.setRequestHeaders();this.body=this.method=='post'?(this.options.postBody||params):null;this.transport.send(this.body);if(!this.options.asynchronous&&this.transport.overrideMimeType)
this.onStateChange();}
catch(e){this.dispatchException(e);}},onStateChange:function(){var readyState=this.transport.readyState;if(readyState>1&&!((readyState==4)&&this._complete))
this.respondToReadyState(this.transport.readyState);},setRequestHeaders:function(){var headers={'X-Requested-With':'XMLHttpRequest','X-Prototype-Version':Prototype.Version,'Accept':'text/javascript, text/html, application/xml, text/xml, */*'};if(this.method=='post'){headers['Content-type']=this.options.contentType+
(this.options.encoding?'; charset='+this.options.encoding:'');if(this.transport.overrideMimeType&&(navigator.userAgent.match(/Gecko\/(\d{4})/)||[0,2005])[1]<2005)
headers['Connection']='close';}
if(typeof this.options.requestHeaders=='object'){var extras=this.options.requestHeaders;if(Object.isFunction(extras.push))
for(var i=0,length=extras.length;i<length;i+=2)
headers[extras[i]]=extras[i+1];else
$H(extras).each(function(pair){headers[pair.key]=pair.value});}
for(var name in headers)
this.transport.setRequestHeader(name,headers[name]);},success:function(){var status=this.getStatus();return!status||(status>=200&&status<300);},getStatus:function(){try{return this.transport.status||0;}catch(e){return 0}},respondToReadyState:function(readyState){var state=Ajax.Request.Events[readyState],response=new Ajax.Response(this);if(state=='Complete'){try{this._complete=true;(this.options['on'+response.status]||this.options['on'+(this.success()?'Success':'Failure')]||Prototype.emptyFunction)(response,response.headerJSON);}catch(e){this.dispatchException(e);}
var contentType=response.getHeader('Content-type');if(this.options.evalJS=='force'||(this.options.evalJS&&this.isSameOrigin()&&contentType&&contentType.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i)))
this.evalResponse();}
try{(this.options['on'+state]||Prototype.emptyFunction)(response,response.headerJSON);Ajax.Responders.dispatch('on'+state,this,response,response.headerJSON);}catch(e){this.dispatchException(e);}
if(state=='Complete'){this.transport.onreadystatechange=Prototype.emptyFunction;}},isSameOrigin:function(){var m=this.url.match(/^\s*https?:\/\/[^\/]*/);return!m||(m[0]=='#{protocol}//#{domain}#{port}'.interpolate({protocol:location.protocol,domain:document.domain,port:location.port?':'+location.port:''}));},getHeader:function(name){try{return this.transport.getResponseHeader(name)||null;}catch(e){return null;}},evalResponse:function(){try{return eval((this.transport.responseText||'').unfilterJSON());}catch(e){this.dispatchException(e);}},dispatchException:function(exception){(this.options.onException||Prototype.emptyFunction)(this,exception);Ajax.Responders.dispatch('onException',this,exception);}});Ajax.Request.Events=['Uninitialized','Loading','Loaded','Interactive','Complete'];Ajax.Response=Class.create({initialize:function(request){this.request=request;var transport=this.transport=request.transport,readyState=this.readyState=transport.readyState;if((readyState>2&&!Prototype.Browser.IE)||readyState==4){this.status=this.getStatus();this.statusText=this.getStatusText();this.responseText=String.interpret(transport.responseText);this.headerJSON=this._getHeaderJSON();}
if(readyState==4){var xml=transport.responseXML;this.responseXML=Object.isUndefined(xml)?null:xml;this.responseJSON=this._getResponseJSON();}},status:0,statusText:'',getStatus:Ajax.Request.prototype.getStatus,getStatusText:function(){try{return this.transport.statusText||'';}catch(e){return''}},getHeader:Ajax.Request.prototype.getHeader,getAllHeaders:function(){try{return this.getAllResponseHeaders();}catch(e){return null}},getResponseHeader:function(name){return this.transport.getResponseHeader(name);},getAllResponseHeaders:function(){return this.transport.getAllResponseHeaders();},_getHeaderJSON:function(){var json=this.getHeader('X-JSON');if(!json)return null;json=decodeURIComponent(escape(json));try{return json.evalJSON(this.request.options.sanitizeJSON||!this.request.isSameOrigin());}catch(e){this.request.dispatchException(e);}},_getResponseJSON:function(){var options=this.request.options;if(!options.evalJSON||(options.evalJSON!='force'&&!(this.getHeader('Content-type')||'').include('application/json'))||this.responseText.blank())
return null;try{return this.responseText.evalJSON(options.sanitizeJSON||!this.request.isSameOrigin());}catch(e){this.request.dispatchException(e);}}});Ajax.Updater=Class.create(Ajax.Request,{initialize:function($super,container,url,options){this.container={success:(container.success||container),failure:(container.failure||(container.success?null:container))};options=Object.clone(options);var onComplete=options.onComplete;options.onComplete=(function(response,json){this.updateContent(response.responseText);if(Object.isFunction(onComplete))onComplete(response,json);}).bind(this);$super(url,options);},updateContent:function(responseText){var receiver=this.container[this.success()?'success':'failure'],options=this.options;if(!options.evalScripts)responseText=responseText.stripScripts();if(receiver=$(receiver)){if(options.insertion){if(Object.isString(options.insertion)){var insertion={};insertion[options.insertion]=responseText;receiver.insert(insertion);}
else options.insertion(receiver,responseText);}
else receiver.update(responseText);}}});Ajax.PeriodicalUpdater=Class.create(Ajax.Base,{initialize:function($super,container,url,options){$super(options);this.onComplete=this.options.onComplete;this.frequency=(this.options.frequency||2);this.decay=(this.options.decay||1);this.updater={};this.container=container;this.url=url;this.start();},start:function(){this.options.onComplete=this.updateComplete.bind(this);this.onTimerEvent();},stop:function(){this.updater.options.onComplete=undefined;clearTimeout(this.timer);(this.onComplete||Prototype.emptyFunction).apply(this,arguments);},updateComplete:function(response){if(this.options.decay){this.decay=(response.responseText==this.lastText?this.decay*this.options.decay:1);this.lastText=response.responseText;}
this.timer=this.onTimerEvent.bind(this).delay(this.decay*this.frequency);},onTimerEvent:function(){this.updater=new Ajax.Updater(this.container,this.url,this.options);}});function $(element){if(arguments.length>1){for(var i=0,elements=[],length=arguments.length;i<length;i++)
elements.push($(arguments[i]));return elements;}
if(Object.isString(element))
element=document.getElementById(element);return Element.extend(element);}
if(Prototype.BrowserFeatures.XPath){document._getElementsByXPath=function(expression,parentElement){var results=[];var query=document.evaluate(expression,$(parentElement)||document,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);for(var i=0,length=query.snapshotLength;i<length;i++)
results.push(Element.extend(query.snapshotItem(i)));return results;};}
if(!window.Node)var Node={};if(!Node.ELEMENT_NODE){Object.extend(Node,{ELEMENT_NODE:1,ATTRIBUTE_NODE:2,TEXT_NODE:3,CDATA_SECTION_NODE:4,ENTITY_REFERENCE_NODE:5,ENTITY_NODE:6,PROCESSING_INSTRUCTION_NODE:7,COMMENT_NODE:8,DOCUMENT_NODE:9,DOCUMENT_TYPE_NODE:10,DOCUMENT_FRAGMENT_NODE:11,NOTATION_NODE:12});}
(function(global){var SETATTRIBUTE_IGNORES_NAME=(function(){var elForm=document.createElement("form");var elInput=document.createElement("input");var root=document.documentElement;elInput.setAttribute("name","test");elForm.appendChild(elInput);root.appendChild(elForm);var isBuggy=elForm.elements?(typeof elForm.elements.test=="undefined"):null;root.removeChild(elForm);elForm=elInput=null;return isBuggy;})();var element=global.Element;global.Element=function(tagName,attributes){attributes=attributes||{};tagName=tagName.toLowerCase();var cache=Element.cache;if(SETATTRIBUTE_IGNORES_NAME&&attributes.name){tagName='<'+tagName+' name="'+attributes.name+'">';delete attributes.name;return Element.writeAttribute(document.createElement(tagName),attributes);}
if(!cache[tagName])cache[tagName]=Element.extend(document.createElement(tagName));return Element.writeAttribute(cache[tagName].cloneNode(false),attributes);};Object.extend(global.Element,element||{});if(element)global.Element.prototype=element.prototype;})(this);Element.cache={};Element.idCounter=1;Element.Methods={visible:function(element){return $(element).style.display!='none';},toggle:function(element){element=$(element);Element[Element.visible(element)?'hide':'show'](element);return element;},hide:function(element){element=$(element);element.style.display='none';return element;},show:function(element){element=$(element);element.style.display='';return element;},remove:function(element){element=$(element);element.parentNode.removeChild(element);return element;},update:(function(){var SELECT_ELEMENT_INNERHTML_BUGGY=(function(){var el=document.createElement("select"),isBuggy=true;el.innerHTML="<option value=\"test\">test</option>";if(el.options&&el.options[0]){isBuggy=el.options[0].nodeName.toUpperCase()!=="OPTION";}
el=null;return isBuggy;})();var TABLE_ELEMENT_INNERHTML_BUGGY=(function(){try{var el=document.createElement("table");if(el&&el.tBodies){el.innerHTML="<tbody><tr><td>test</td></tr></tbody>";var isBuggy=typeof el.tBodies[0]=="undefined";el=null;return isBuggy;}}catch(e){return true;}})();var SCRIPT_ELEMENT_REJECTS_TEXTNODE_APPENDING=(function(){var s=document.createElement("script"),isBuggy=false;try{s.appendChild(document.createTextNode(""));isBuggy=!s.firstChild||s.firstChild&&s.firstChild.nodeType!==3;}catch(e){isBuggy=true;}
s=null;return isBuggy;})();function update(element,content){element=$(element);if(content&&content.toElement)
content=content.toElement();if(Object.isElement(content))
return element.update().insert(content);content=Object.toHTML(content);var tagName=element.tagName.toUpperCase();if(tagName==='SCRIPT'&&SCRIPT_ELEMENT_REJECTS_TEXTNODE_APPENDING){element.text=content;return element;}
if(SELECT_ELEMENT_INNERHTML_BUGGY||TABLE_ELEMENT_INNERHTML_BUGGY){if(tagName in Element._insertionTranslations.tags){while(element.firstChild){element.removeChild(element.firstChild);}
Element._getContentFromAnonymousElement(tagName,content.stripScripts()).each(function(node){element.appendChild(node)});}
else{element.innerHTML=content.stripScripts();}}
else{element.innerHTML=content.stripScripts();}
content.evalScripts.bind(content).defer();return element;}
return update;})(),replace:function(element,content){element=$(element);if(content&&content.toElement)content=content.toElement();else if(!Object.isElement(content)){content=Object.toHTML(content);var range=element.ownerDocument.createRange();range.selectNode(element);content.evalScripts.bind(content).defer();content=range.createContextualFragment(content.stripScripts());}
element.parentNode.replaceChild(content,element);return element;},insert:function(element,insertions){element=$(element);if(Object.isString(insertions)||Object.isNumber(insertions)||Object.isElement(insertions)||(insertions&&(insertions.toElement||insertions.toHTML)))
insertions={bottom:insertions};var content,insert,tagName,childNodes;for(var position in insertions){content=insertions[position];position=position.toLowerCase();insert=Element._insertionTranslations[position];if(content&&content.toElement)content=content.toElement();if(Object.isElement(content)){insert(element,content);continue;}
content=Object.toHTML(content);tagName=((position=='before'||position=='after')?element.parentNode:element).tagName.toUpperCase();childNodes=Element._getContentFromAnonymousElement(tagName,content.stripScripts());if(position=='top'||position=='after')childNodes.reverse();childNodes.each(insert.curry(element));content.evalScripts.bind(content).defer();}
return element;},wrap:function(element,wrapper,attributes){element=$(element);if(Object.isElement(wrapper))
$(wrapper).writeAttribute(attributes||{});else if(Object.isString(wrapper))wrapper=new Element(wrapper,attributes);else wrapper=new Element('div',wrapper);if(element.parentNode)
element.parentNode.replaceChild(wrapper,element);wrapper.appendChild(element);return wrapper;},inspect:function(element){element=$(element);var result='<'+element.tagName.toLowerCase();$H({'id':'id','className':'class'}).each(function(pair){var property=pair.first(),attribute=pair.last();var value=(element[property]||'').toString();if(value)result+=' '+attribute+'='+value.inspect(true);});return result+'>';},recursivelyCollect:function(element,property){element=$(element);var elements=[];while(element=element[property])
if(element.nodeType==1)
elements.push(Element.extend(element));return elements;},ancestors:function(element){return Element.recursivelyCollect(element,'parentNode');},descendants:function(element){return Element.select(element,"*");},firstDescendant:function(element){element=$(element).firstChild;while(element&&element.nodeType!=1)element=element.nextSibling;return $(element);},immediateDescendants:function(element){if(!(element=$(element).firstChild))return[];while(element&&element.nodeType!=1)element=element.nextSibling;if(element)return[element].concat($(element).nextSiblings());return[];},previousSiblings:function(element){return Element.recursivelyCollect(element,'previousSibling');},nextSiblings:function(element){return Element.recursivelyCollect(element,'nextSibling');},siblings:function(element){element=$(element);return Element.previousSiblings(element).reverse().concat(Element.nextSiblings(element));},match:function(element,selector){if(Object.isString(selector))
selector=new Selector(selector);return selector.match($(element));},up:function(element,expression,index){element=$(element);if(arguments.length==1)return $(element.parentNode);var ancestors=Element.ancestors(element);return Object.isNumber(expression)?ancestors[expression]:Selector.findElement(ancestors,expression,index);},down:function(element,expression,index){element=$(element);if(arguments.length==1)return Element.firstDescendant(element);return Object.isNumber(expression)?Element.descendants(element)[expression]:Element.select(element,expression)[index||0];},previous:function(element,expression,index){element=$(element);if(arguments.length==1)return $(Selector.handlers.previousElementSibling(element));var previousSiblings=Element.previousSiblings(element);return Object.isNumber(expression)?previousSiblings[expression]:Selector.findElement(previousSiblings,expression,index);},next:function(element,expression,index){element=$(element);if(arguments.length==1)return $(Selector.handlers.nextElementSibling(element));var nextSiblings=Element.nextSiblings(element);return Object.isNumber(expression)?nextSiblings[expression]:Selector.findElement(nextSiblings,expression,index);},select:function(element){var args=Array.prototype.slice.call(arguments,1);return Selector.findChildElements(element,args);},adjacent:function(element){var args=Array.prototype.slice.call(arguments,1);return Selector.findChildElements(element.parentNode,args).without(element);},identify:function(element){element=$(element);var id=Element.readAttribute(element,'id');if(id)return id;do{id='anonymous_element_'+Element.idCounter++}while($(id));Element.writeAttribute(element,'id',id);return id;},readAttribute:function(element,name){element=$(element);if(Prototype.Browser.IE){var t=Element._attributeTranslations.read;if(t.values[name])return t.values[name](element,name);if(t.names[name])name=t.names[name];if(name.include(':')){return(!element.attributes||!element.attributes[name])?null:element.attributes[name].value;}}
return element.getAttribute(name);},writeAttribute:function(element,name,value){element=$(element);var attributes={},t=Element._attributeTranslations.write;if(typeof name=='object')attributes=name;else attributes[name]=Object.isUndefined(value)?true:value;for(var attr in attributes){name=t.names[attr]||attr;value=attributes[attr];if(t.values[attr])name=t.values[attr](element,value);if(value===false||value===null)
element.removeAttribute(name);else if(value===true)
element.setAttribute(name,name);else element.setAttribute(name,value);}
return element;},getHeight:function(element){return Element.getDimensions(element).height;},getWidth:function(element){return Element.getDimensions(element).width;},classNames:function(element){return new Element.ClassNames(element);},hasClassName:function(element,className){if(!(element=$(element)))return;var elementClassName=element.className;return(elementClassName.length>0&&(elementClassName==className||new RegExp("(^|\\s)"+className+"(\\s|$)").test(elementClassName)));},addClassName:function(element,className){if(!(element=$(element)))return;if(!Element.hasClassName(element,className))
element.className+=(element.className?' ':'')+className;return element;},removeClassName:function(element,className){if(!(element=$(element)))return;element.className=element.className.replace(new RegExp("(^|\\s+)"+className+"(\\s+|$)"),' ').strip();return element;},toggleClassName:function(element,className){if(!(element=$(element)))return;return Element[Element.hasClassName(element,className)?'removeClassName':'addClassName'](element,className);},cleanWhitespace:function(element){element=$(element);var node=element.firstChild;while(node){var nextNode=node.nextSibling;if(node.nodeType==3&&!/\S/.test(node.nodeValue))
element.removeChild(node);node=nextNode;}
return element;},empty:function(element){return $(element).innerHTML.blank();},descendantOf:function(element,ancestor){element=$(element),ancestor=$(ancestor);if(element.compareDocumentPosition)
return(element.compareDocumentPosition(ancestor)&8)===8;if(ancestor.contains)
return ancestor.contains(element)&&ancestor!==element;while(element=element.parentNode)
if(element==ancestor)return true;return false;},scrollTo:function(element){element=$(element);var pos=Element.cumulativeOffset(element);window.scrollTo(pos[0],pos[1]);return element;},getStyle:function(element,style){element=$(element);style=style=='float'?'cssFloat':style.camelize();var value=element.style[style];if(!value||value=='auto'){var css=document.defaultView.getComputedStyle(element,null);value=css?css[style]:null;}
if(style=='opacity')return value?parseFloat(value):1.0;return value=='auto'?null:value;},getOpacity:function(element){return $(element).getStyle('opacity');},setStyle:function(element,styles){element=$(element);var elementStyle=element.style,match;if(Object.isString(styles)){element.style.cssText+=';'+styles;return styles.include('opacity')?element.setOpacity(styles.match(/opacity:\s*(\d?\.?\d*)/)[1]):element;}
for(var property in styles)
if(property=='opacity')element.setOpacity(styles[property]);else
elementStyle[(property=='float'||property=='cssFloat')?(Object.isUndefined(elementStyle.styleFloat)?'cssFloat':'styleFloat'):property]=styles[property];return element;},setOpacity:function(element,value){element=$(element);element.style.opacity=(value==1||value==='')?'':(value<0.00001)?0:value;return element;},getDimensions:function(element){element=$(element);var display=Element.getStyle(element,'display');if(display!='none'&&display!=null)
return{width:element.offsetWidth,height:element.offsetHeight};var els=element.style;var originalVisibility=els.visibility;var originalPosition=els.position;var originalDisplay=els.display;els.visibility='hidden';if(originalPosition!='fixed')
els.position='absolute';els.display='block';var originalWidth=element.clientWidth;var originalHeight=element.clientHeight;els.display=originalDisplay;els.position=originalPosition;els.visibility=originalVisibility;return{width:originalWidth,height:originalHeight};},makePositioned:function(element){element=$(element);var pos=Element.getStyle(element,'position');if(pos=='static'||!pos){element._madePositioned=true;element.style.position='relative';if(Prototype.Browser.Opera){element.style.top=0;element.style.left=0;}}
return element;},undoPositioned:function(element){element=$(element);if(element._madePositioned){element._madePositioned=undefined;element.style.position=element.style.top=element.style.left=element.style.bottom=element.style.right='';}
return element;},makeClipping:function(element){element=$(element);if(element._overflow)return element;element._overflow=Element.getStyle(element,'overflow')||'auto';if(element._overflow!=='hidden')
element.style.overflow='hidden';return element;},undoClipping:function(element){element=$(element);if(!element._overflow)return element;element.style.overflow=element._overflow=='auto'?'':element._overflow;element._overflow=null;return element;},cumulativeOffset:function(element){var valueT=0,valueL=0;do{valueT+=element.offsetTop||0;valueL+=element.offsetLeft||0;element=element.offsetParent;}while(element);return Element._returnOffset(valueL,valueT);},positionedOffset:function(element){var valueT=0,valueL=0;do{valueT+=element.offsetTop||0;valueL+=element.offsetLeft||0;element=element.offsetParent;if(element){if(element.tagName.toUpperCase()=='BODY')break;var p=Element.getStyle(element,'position');if(p!=='static')break;}}while(element);return Element._returnOffset(valueL,valueT);},absolutize:function(element){element=$(element);if(Element.getStyle(element,'position')=='absolute')return element;var offsets=Element.positionedOffset(element);var top=offsets[1];var left=offsets[0];var width=element.clientWidth;var height=element.clientHeight;element._originalLeft=left-parseFloat(element.style.left||0);element._originalTop=top-parseFloat(element.style.top||0);element._originalWidth=element.style.width;element._originalHeight=element.style.height;element.style.position='absolute';element.style.top=top+'px';element.style.left=left+'px';element.style.width=width+'px';element.style.height=height+'px';return element;},relativize:function(element){element=$(element);if(Element.getStyle(element,'position')=='relative')return element;element.style.position='relative';var top=parseFloat(element.style.top||0)-(element._originalTop||0);var left=parseFloat(element.style.left||0)-(element._originalLeft||0);element.style.top=top+'px';element.style.left=left+'px';element.style.height=element._originalHeight;element.style.width=element._originalWidth;return element;},cumulativeScrollOffset:function(element){var valueT=0,valueL=0;do{valueT+=element.scrollTop||0;valueL+=element.scrollLeft||0;element=element.parentNode;}while(element);return Element._returnOffset(valueL,valueT);},getOffsetParent:function(element){if(element.offsetParent)return $(element.offsetParent);if(element==document.body)return $(element);while((element=element.parentNode)&&element!=document.body)
if(Element.getStyle(element,'position')!='static')
return $(element);return $(document.body);},viewportOffset:function(forElement){var valueT=0,valueL=0;var element=forElement;do{valueT+=element.offsetTop||0;valueL+=element.offsetLeft||0;if(element.offsetParent==document.body&&Element.getStyle(element,'position')=='absolute')break;}while(element=element.offsetParent);element=forElement;do{if(!Prototype.Browser.Opera||(element.tagName&&(element.tagName.toUpperCase()=='BODY'))){valueT-=element.scrollTop||0;valueL-=element.scrollLeft||0;}}while(element=element.parentNode);return Element._returnOffset(valueL,valueT);},clonePosition:function(element,source){var options=Object.extend({setLeft:true,setTop:true,setWidth:true,setHeight:true,offsetTop:0,offsetLeft:0},arguments[2]||{});source=$(source);var p=Element.viewportOffset(source);element=$(element);var delta=[0,0];var parent=null;if(Element.getStyle(element,'position')=='absolute'){parent=Element.getOffsetParent(element);delta=Element.viewportOffset(parent);}
if(parent==document.body){delta[0]-=document.body.offsetLeft;delta[1]-=document.body.offsetTop;}
if(options.setLeft)element.style.left=(p[0]-delta[0]+options.offsetLeft)+'px';if(options.setTop)element.style.top=(p[1]-delta[1]+options.offsetTop)+'px';if(options.setWidth)element.style.width=source.offsetWidth+'px';if(options.setHeight)element.style.height=source.offsetHeight+'px';return element;}};Object.extend(Element.Methods,{getElementsBySelector:Element.Methods.select,childElements:Element.Methods.immediateDescendants});Element._attributeTranslations={write:{names:{className:'class',htmlFor:'for'},values:{}}};if(Prototype.Browser.Opera){Element.Methods.getStyle=Element.Methods.getStyle.wrap(function(proceed,element,style){switch(style){case'left':case'top':case'right':case'bottom':if(proceed(element,'position')==='static')return null;case'height':case'width':if(!Element.visible(element))return null;var dim=parseInt(proceed(element,style),10);if(dim!==element['offset'+style.capitalize()])
return dim+'px';var properties;if(style==='height'){properties=['border-top-width','padding-top','padding-bottom','border-bottom-width'];}
else{properties=['border-left-width','padding-left','padding-right','border-right-width'];}
return properties.inject(dim,function(memo,property){var val=proceed(element,property);return val===null?memo:memo-parseInt(val,10);})+'px';default:return proceed(element,style);}});Element.Methods.readAttribute=Element.Methods.readAttribute.wrap(function(proceed,element,attribute){if(attribute==='title')return element.title;return proceed(element,attribute);});}
else if(Prototype.Browser.IE){Element.Methods.getOffsetParent=Element.Methods.getOffsetParent.wrap(function(proceed,element){element=$(element);try{element.offsetParent}
catch(e){return $(document.body)}
var position=element.getStyle('position');if(position!=='static')return proceed(element);element.setStyle({position:'relative'});var value=proceed(element);element.setStyle({position:position});return value;});$w('positionedOffset viewportOffset').each(function(method){Element.Methods[method]=Element.Methods[method].wrap(function(proceed,element){element=$(element);try{element.offsetParent}
catch(e){return Element._returnOffset(0,0)}
var position=element.getStyle('position');if(position!=='static')return proceed(element);var offsetParent=element.getOffsetParent();if(offsetParent&&offsetParent.getStyle('position')==='fixed')
offsetParent.setStyle({zoom:1});element.setStyle({position:'relative'});var value=proceed(element);element.setStyle({position:position});return value;});});Element.Methods.cumulativeOffset=Element.Methods.cumulativeOffset.wrap(function(proceed,element){try{element.offsetParent}
catch(e){return Element._returnOffset(0,0)}
return proceed(element);});Element.Methods.getStyle=function(element,style){element=$(element);style=(style=='float'||style=='cssFloat')?'styleFloat':style.camelize();var value=element.style[style];if(!value&&element.currentStyle)value=element.currentStyle[style];if(style=='opacity'){if(value=(element.getStyle('filter')||'').match(/alpha\(opacity=(.*)\)/))
if(value[1])return parseFloat(value[1])/100;return 1.0;}
if(value=='auto'){if((style=='width'||style=='height')&&(element.getStyle('display')!='none'))
return element['offset'+style.capitalize()]+'px';return null;}
return value;};Element.Methods.setOpacity=function(element,value){function stripAlpha(filter){return filter.replace(/alpha\([^\)]*\)/gi,'');}
element=$(element);var currentStyle=element.currentStyle;if((currentStyle&&!currentStyle.hasLayout)||(!currentStyle&&element.style.zoom=='normal'))
element.style.zoom=1;var filter=element.getStyle('filter'),style=element.style;if(value==1||value===''){(filter=stripAlpha(filter))?style.filter=filter:style.removeAttribute('filter');return element;}else if(value<0.00001)value=0;style.filter=stripAlpha(filter)+'alpha(opacity='+(value*100)+')';return element;};Element._attributeTranslations=(function(){var classProp='className';var forProp='for';var el=document.createElement('div');el.setAttribute(classProp,'x');if(el.className!=='x'){el.setAttribute('class','x');if(el.className==='x'){classProp='class';}}
el=null;el=document.createElement('label');el.setAttribute(forProp,'x');if(el.htmlFor!=='x'){el.setAttribute('htmlFor','x');if(el.htmlFor==='x'){forProp='htmlFor';}}
el=null;return{read:{names:{'class':classProp,'className':classProp,'for':forProp,'htmlFor':forProp},values:{_getAttr:function(element,attribute){return element.getAttribute(attribute);},_getAttr2:function(element,attribute){return element.getAttribute(attribute,2);},_getAttrNode:function(element,attribute){var node=element.getAttributeNode(attribute);return node?node.value:"";},_getEv:(function(){var el=document.createElement('div');el.onclick=Prototype.emptyFunction;var value=el.getAttribute('onclick');var f;if(String(value).indexOf('{')>-1){f=function(element,attribute){attribute=element.getAttribute(attribute);if(!attribute)return null;attribute=attribute.toString();attribute=attribute.split('{')[1];attribute=attribute.split('}')[0];return attribute.strip();};}
else if(value===''){f=function(element,attribute){attribute=element.getAttribute(attribute);if(!attribute)return null;return attribute.strip();};}
el=null;return f;})(),_flag:function(element,attribute){return $(element).hasAttribute(attribute)?attribute:null;},style:function(element){return element.style.cssText.toLowerCase();},title:function(element){return element.title;}}}}})();Element._attributeTranslations.write={names:Object.extend({cellpadding:'cellPadding',cellspacing:'cellSpacing'},Element._attributeTranslations.read.names),values:{checked:function(element,value){element.checked=!!value;},style:function(element,value){element.style.cssText=value?value:'';}}};Element._attributeTranslations.has={};$w('colSpan rowSpan vAlign dateTime accessKey tabIndex '+'encType maxLength readOnly longDesc frameBorder').each(function(attr){Element._attributeTranslations.write.names[attr.toLowerCase()]=attr;Element._attributeTranslations.has[attr.toLowerCase()]=attr;});(function(v){Object.extend(v,{href:v._getAttr2,src:v._getAttr2,type:v._getAttr,action:v._getAttrNode,disabled:v._flag,checked:v._flag,readonly:v._flag,multiple:v._flag,onload:v._getEv,onunload:v._getEv,onclick:v._getEv,ondblclick:v._getEv,onmousedown:v._getEv,onmouseup:v._getEv,onmouseover:v._getEv,onmousemove:v._getEv,onmouseout:v._getEv,onfocus:v._getEv,onblur:v._getEv,onkeypress:v._getEv,onkeydown:v._getEv,onkeyup:v._getEv,onsubmit:v._getEv,onreset:v._getEv,onselect:v._getEv,onchange:v._getEv});})(Element._attributeTranslations.read.values);if(Prototype.BrowserFeatures.ElementExtensions){(function(){function _descendants(element){var nodes=element.getElementsByTagName('*'),results=[];for(var i=0,node;node=nodes[i];i++)
if(node.tagName!=="!")
results.push(node);return results;}
Element.Methods.down=function(element,expression,index){element=$(element);if(arguments.length==1)return element.firstDescendant();return Object.isNumber(expression)?_descendants(element)[expression]:Element.select(element,expression)[index||0];}})();}}
else if(Prototype.Browser.Gecko&&/rv:1\.8\.0/.test(navigator.userAgent)){Element.Methods.setOpacity=function(element,value){element=$(element);element.style.opacity=(value==1)?0.999999:(value==='')?'':(value<0.00001)?0:value;return element;};}
else if(Prototype.Browser.WebKit){Element.Methods.setOpacity=function(element,value){element=$(element);element.style.opacity=(value==1||value==='')?'':(value<0.00001)?0:value;if(value==1)
if(element.tagName.toUpperCase()=='IMG'&&element.width){element.width++;element.width--;}else try{var n=document.createTextNode(' ');element.appendChild(n);element.removeChild(n);}catch(e){}
return element;};Element.Methods.cumulativeOffset=function(element){var valueT=0,valueL=0;do{valueT+=element.offsetTop||0;valueL+=element.offsetLeft||0;if(element.offsetParent==document.body)
if(Element.getStyle(element,'position')=='absolute')break;element=element.offsetParent;}while(element);return Element._returnOffset(valueL,valueT);};}
if('outerHTML'in document.documentElement){Element.Methods.replace=function(element,content){element=$(element);if(content&&content.toElement)content=content.toElement();if(Object.isElement(content)){element.parentNode.replaceChild(content,element);return element;}
content=Object.toHTML(content);var parent=element.parentNode,tagName=parent.tagName.toUpperCase();if(Element._insertionTranslations.tags[tagName]){var nextSibling=element.next();var fragments=Element._getContentFromAnonymousElement(tagName,content.stripScripts());parent.removeChild(element);if(nextSibling)
fragments.each(function(node){parent.insertBefore(node,nextSibling)});else
fragments.each(function(node){parent.appendChild(node)});}
else element.outerHTML=content.stripScripts();content.evalScripts.bind(content).defer();return element;};}
Element._returnOffset=function(l,t){var result=[l,t];result.left=l;result.top=t;return result;};Element._getContentFromAnonymousElement=function(tagName,html){var div=new Element('div'),t=Element._insertionTranslations.tags[tagName];if(t){div.innerHTML=t[0]+html+t[1];t[2].times(function(){div=div.firstChild});}else div.innerHTML=html;return $A(div.childNodes);};Element._insertionTranslations={before:function(element,node){element.parentNode.insertBefore(node,element);},top:function(element,node){element.insertBefore(node,element.firstChild);},bottom:function(element,node){element.appendChild(node);},after:function(element,node){element.parentNode.insertBefore(node,element.nextSibling);},tags:{TABLE:['<table>','</table>',1],TBODY:['<table><tbody>','</tbody></table>',2],TR:['<table><tbody><tr>','</tr></tbody></table>',3],TD:['<table><tbody><tr><td>','</td></tr></tbody></table>',4],SELECT:['<select>','</select>',1]}};(function(){var tags=Element._insertionTranslations.tags;Object.extend(tags,{THEAD:tags.TBODY,TFOOT:tags.TBODY,TH:tags.TD});})();Element.Methods.Simulated={hasAttribute:function(element,attribute){attribute=Element._attributeTranslations.has[attribute]||attribute;var node=$(element).getAttributeNode(attribute);return!!(node&&node.specified);}};Element.Methods.ByTag={};Object.extend(Element,Element.Methods);(function(div){if(!Prototype.BrowserFeatures.ElementExtensions&&div['__proto__']){window.HTMLElement={};window.HTMLElement.prototype=div['__proto__'];Prototype.BrowserFeatures.ElementExtensions=true;}
div=null;})(document.createElement('div'))
Element.extend=(function(){function checkDeficiency(tagName){if(typeof window.Element!='undefined'){var proto=window.Element.prototype;if(proto){var id='_'+(Math.random()+'').slice(2);var el=document.createElement(tagName);proto[id]='x';var isBuggy=(el[id]!=='x');delete proto[id];el=null;return isBuggy;}}
return false;}
function extendElementWith(element,methods){for(var property in methods){var value=methods[property];if(Object.isFunction(value)&&!(property in element))
element[property]=value.methodize();}}
var HTMLOBJECTELEMENT_PROTOTYPE_BUGGY=checkDeficiency('object');if(Prototype.BrowserFeatures.SpecificElementExtensions){if(HTMLOBJECTELEMENT_PROTOTYPE_BUGGY){return function(element){if(element&&typeof element._extendedByPrototype=='undefined'){var t=element.tagName;if(t&&(/^(?:object|applet|embed)$/i.test(t))){extendElementWith(element,Element.Methods);extendElementWith(element,Element.Methods.Simulated);extendElementWith(element,Element.Methods.ByTag[t.toUpperCase()]);}}
return element;}}
return Prototype.K;}
var Methods={},ByTag=Element.Methods.ByTag;var extend=Object.extend(function(element){if(!element||typeof element._extendedByPrototype!='undefined'||element.nodeType!=1||element==window)return element;var methods=Object.clone(Methods),tagName=element.tagName.toUpperCase();if(ByTag[tagName])Object.extend(methods,ByTag[tagName]);extendElementWith(element,methods);element._extendedByPrototype=Prototype.emptyFunction;return element;},{refresh:function(){if(!Prototype.BrowserFeatures.ElementExtensions){Object.extend(Methods,Element.Methods);Object.extend(Methods,Element.Methods.Simulated);}}});extend.refresh();return extend;})();Element.hasAttribute=function(element,attribute){if(element.hasAttribute)return element.hasAttribute(attribute);return Element.Methods.Simulated.hasAttribute(element,attribute);};Element.addMethods=function(methods){var F=Prototype.BrowserFeatures,T=Element.Methods.ByTag;if(!methods){Object.extend(Form,Form.Methods);Object.extend(Form.Element,Form.Element.Methods);Object.extend(Element.Methods.ByTag,{"FORM":Object.clone(Form.Methods),"INPUT":Object.clone(Form.Element.Methods),"SELECT":Object.clone(Form.Element.Methods),"TEXTAREA":Object.clone(Form.Element.Methods)});}
if(arguments.length==2){var tagName=methods;methods=arguments[1];}
if(!tagName)Object.extend(Element.Methods,methods||{});else{if(Object.isArray(tagName))tagName.each(extend);else extend(tagName);}
function extend(tagName){tagName=tagName.toUpperCase();if(!Element.Methods.ByTag[tagName])
Element.Methods.ByTag[tagName]={};Object.extend(Element.Methods.ByTag[tagName],methods);}
function copy(methods,destination,onlyIfAbsent){onlyIfAbsent=onlyIfAbsent||false;for(var property in methods){var value=methods[property];if(!Object.isFunction(value))continue;if(!onlyIfAbsent||!(property in destination))
destination[property]=value.methodize();}}
function findDOMClass(tagName){var klass;var trans={"OPTGROUP":"OptGroup","TEXTAREA":"TextArea","P":"Paragraph","FIELDSET":"FieldSet","UL":"UList","OL":"OList","DL":"DList","DIR":"Directory","H1":"Heading","H2":"Heading","H3":"Heading","H4":"Heading","H5":"Heading","H6":"Heading","Q":"Quote","INS":"Mod","DEL":"Mod","A":"Anchor","IMG":"Image","CAPTION":"TableCaption","COL":"TableCol","COLGROUP":"TableCol","THEAD":"TableSection","TFOOT":"TableSection","TBODY":"TableSection","TR":"TableRow","TH":"TableCell","TD":"TableCell","FRAMESET":"FrameSet","IFRAME":"IFrame"};if(trans[tagName])klass='HTML'+trans[tagName]+'Element';if(window[klass])return window[klass];klass='HTML'+tagName+'Element';if(window[klass])return window[klass];klass='HTML'+tagName.capitalize()+'Element';if(window[klass])return window[klass];var element=document.createElement(tagName);var proto=element['__proto__']||element.constructor.prototype;element=null;return proto;}
var elementPrototype=window.HTMLElement?HTMLElement.prototype:Element.prototype;if(F.ElementExtensions){copy(Element.Methods,elementPrototype);copy(Element.Methods.Simulated,elementPrototype,true);}
if(F.SpecificElementExtensions){for(var tag in Element.Methods.ByTag){var klass=findDOMClass(tag);if(Object.isUndefined(klass))continue;copy(T[tag],klass.prototype);}}
Object.extend(Element,Element.Methods);delete Element.ByTag;if(Element.extend.refresh)Element.extend.refresh();Element.cache={};};document.viewport={getDimensions:function(){return{width:this.getWidth(),height:this.getHeight()};},getScrollOffsets:function(){return Element._returnOffset(window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft,window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop);}};(function(viewport){var B=Prototype.Browser,doc=document,element,property={};function getRootElement(){if(B.WebKit&&!doc.evaluate)
return document;if(B.Opera&&window.parseFloat(window.opera.version())<9.5)
return document.body;return document.documentElement;}
function define(D){if(!element)element=getRootElement();property[D]='client'+D;viewport['get'+D]=function(){return element[property[D]]};return viewport['get'+D]();}
viewport.getWidth=define.curry('Width');viewport.getHeight=define.curry('Height');})(document.viewport);Element.Storage={UID:1};Element.addMethods({getStorage:function(element){if(!(element=$(element)))return;var uid;if(element===window){uid=0;}else{if(typeof element._prototypeUID==="undefined")
element._prototypeUID=[Element.Storage.UID++];uid=element._prototypeUID[0];}
if(!Element.Storage[uid])
Element.Storage[uid]=$H();return Element.Storage[uid];},store:function(element,key,value){if(!(element=$(element)))return;if(arguments.length===2){Element.getStorage(element).update(key);}else{Element.getStorage(element).set(key,value);}
return element;},retrieve:function(element,key,defaultValue){if(!(element=$(element)))return;var hash=Element.getStorage(element),value=hash.get(key);if(Object.isUndefined(value)){hash.set(key,defaultValue);value=defaultValue;}
return value;},clone:function(element,deep){if(!(element=$(element)))return;var clone=element.cloneNode(deep);clone._prototypeUID=void 0;if(deep){var descendants=Element.select(clone,'*'),i=descendants.length;while(i--){descendants[i]._prototypeUID=void 0;}}
return Element.extend(clone);}});var Selector=Class.create({initialize:function(expression){this.expression=expression.strip();if(this.shouldUseSelectorsAPI()){this.mode='selectorsAPI';}else if(this.shouldUseXPath()){this.mode='xpath';this.compileXPathMatcher();}else{this.mode="normal";this.compileMatcher();}},shouldUseXPath:(function(){var IS_DESCENDANT_SELECTOR_BUGGY=(function(){var isBuggy=false;if(document.evaluate&&window.XPathResult){var el=document.createElement('div');el.innerHTML='<ul><li></li></ul><div><ul><li></li></ul></div>';var xpath=".//*[local-name()='ul' or local-name()='UL']"+"//*[local-name()='li' or local-name()='LI']";var result=document.evaluate(xpath,el,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);isBuggy=(result.snapshotLength!==2);el=null;}
return isBuggy;})();return function(){if(!Prototype.BrowserFeatures.XPath)return false;var e=this.expression;if(Prototype.Browser.WebKit&&(e.include("-of-type")||e.include(":empty")))
return false;if((/(\[[\w-]*?:|:checked)/).test(e))
return false;if(IS_DESCENDANT_SELECTOR_BUGGY)return false;return true;}})(),shouldUseSelectorsAPI:function(){if(!Prototype.BrowserFeatures.SelectorsAPI)return false;if(Selector.CASE_INSENSITIVE_CLASS_NAMES)return false;if(!Selector._div)Selector._div=new Element('div');try{Selector._div.querySelector(this.expression);}catch(e){return false;}
return true;},compileMatcher:function(){var e=this.expression,ps=Selector.patterns,h=Selector.handlers,c=Selector.criteria,le,p,m,len=ps.length,name;if(Selector._cache[e]){this.matcher=Selector._cache[e];return;}
this.matcher=["this.matcher = function(root) {","var r = root, h = Selector.handlers, c = false, n;"];while(e&&le!=e&&(/\S/).test(e)){le=e;for(var i=0;i<len;i++){p=ps[i].re;name=ps[i].name;if(m=e.match(p)){this.matcher.push(Object.isFunction(c[name])?c[name](m):new Template(c[name]).evaluate(m));e=e.replace(m[0],'');break;}}}
this.matcher.push("return h.unique(n);\n}");eval(this.matcher.join('\n'));Selector._cache[this.expression]=this.matcher;},compileXPathMatcher:function(){var e=this.expression,ps=Selector.patterns,x=Selector.xpath,le,m,len=ps.length,name;if(Selector._cache[e]){this.xpath=Selector._cache[e];return;}
this.matcher=['.//*'];while(e&&le!=e&&(/\S/).test(e)){le=e;for(var i=0;i<len;i++){name=ps[i].name;if(m=e.match(ps[i].re)){this.matcher.push(Object.isFunction(x[name])?x[name](m):new Template(x[name]).evaluate(m));e=e.replace(m[0],'');break;}}}
this.xpath=this.matcher.join('');Selector._cache[this.expression]=this.xpath;},findElements:function(root){root=root||document;var e=this.expression,results;switch(this.mode){case'selectorsAPI':if(root!==document){var oldId=root.id,id=$(root).identify();id=id.replace(/([\.:])/g,"\\$1");e="#"+id+" "+e;}
results=$A(root.querySelectorAll(e)).map(Element.extend);root.id=oldId;return results;case'xpath':return document._getElementsByXPath(this.xpath,root);default:return this.matcher(root);}},match:function(element){this.tokens=[];var e=this.expression,ps=Selector.patterns,as=Selector.assertions;var le,p,m,len=ps.length,name;while(e&&le!==e&&(/\S/).test(e)){le=e;for(var i=0;i<len;i++){p=ps[i].re;name=ps[i].name;if(m=e.match(p)){if(as[name]){this.tokens.push([name,Object.clone(m)]);e=e.replace(m[0],'');}else{return this.findElements(document).include(element);}}}}
var match=true,name,matches;for(var i=0,token;token=this.tokens[i];i++){name=token[0],matches=token[1];if(!Selector.assertions[name](element,matches)){match=false;break;}}
return match;},toString:function(){return this.expression;},inspect:function(){return"#<Selector:"+this.expression.inspect()+">";}});if(Prototype.BrowserFeatures.SelectorsAPI&&document.compatMode==='BackCompat'){Selector.CASE_INSENSITIVE_CLASS_NAMES=(function(){var div=document.createElement('div'),span=document.createElement('span');div.id="prototype_test_id";span.className='Test';div.appendChild(span);var isIgnored=(div.querySelector('#prototype_test_id .test')!==null);div=span=null;return isIgnored;})();}
Object.extend(Selector,{_cache:{},xpath:{descendant:"//*",child:"/*",adjacent:"/following-sibling::*[1]",laterSibling:'/following-sibling::*',tagName:function(m){if(m[1]=='*')return'';return"[local-name()='"+m[1].toLowerCase()+"' or local-name()='"+m[1].toUpperCase()+"']";},className:"[contains(concat(' ', @class, ' '), ' #{1} ')]",id:"[@id='#{1}']",attrPresence:function(m){m[1]=m[1].toLowerCase();return new Template("[@#{1}]").evaluate(m);},attr:function(m){m[1]=m[1].toLowerCase();m[3]=m[5]||m[6];return new Template(Selector.xpath.operators[m[2]]).evaluate(m);},pseudo:function(m){var h=Selector.xpath.pseudos[m[1]];if(!h)return'';if(Object.isFunction(h))return h(m);return new Template(Selector.xpath.pseudos[m[1]]).evaluate(m);},operators:{'=':"[@#{1}='#{3}']",'!=':"[@#{1}!='#{3}']",'^=':"[starts-with(@#{1}, '#{3}')]",'$=':"[substring(@#{1}, (string-length(@#{1}) - string-length('#{3}') + 1))='#{3}']",'*=':"[contains(@#{1}, '#{3}')]",'~=':"[contains(concat(' ', @#{1}, ' '), ' #{3} ')]",'|=':"[contains(concat('-', @#{1}, '-'), '-#{3}-')]"},pseudos:{'first-child':'[not(preceding-sibling::*)]','last-child':'[not(following-sibling::*)]','only-child':'[not(preceding-sibling::* or following-sibling::*)]','empty':"[count(*) = 0 and (count(text()) = 0)]",'checked':"[@checked]",'disabled':"[(@disabled) and (@type!='hidden')]",'enabled':"[not(@disabled) and (@type!='hidden')]",'not':function(m){var e=m[6],p=Selector.patterns,x=Selector.xpath,le,v,len=p.length,name;var exclusion=[];while(e&&le!=e&&(/\S/).test(e)){le=e;for(var i=0;i<len;i++){name=p[i].name
if(m=e.match(p[i].re)){v=Object.isFunction(x[name])?x[name](m):new Template(x[name]).evaluate(m);exclusion.push("("+v.substring(1,v.length-1)+")");e=e.replace(m[0],'');break;}}}
return"[not("+exclusion.join(" and ")+")]";},'nth-child':function(m){return Selector.xpath.pseudos.nth("(count(./preceding-sibling::*) + 1) ",m);},'nth-last-child':function(m){return Selector.xpath.pseudos.nth("(count(./following-sibling::*) + 1) ",m);},'nth-of-type':function(m){return Selector.xpath.pseudos.nth("position() ",m);},'nth-last-of-type':function(m){return Selector.xpath.pseudos.nth("(last() + 1 - position()) ",m);},'first-of-type':function(m){m[6]="1";return Selector.xpath.pseudos['nth-of-type'](m);},'last-of-type':function(m){m[6]="1";return Selector.xpath.pseudos['nth-last-of-type'](m);},'only-of-type':function(m){var p=Selector.xpath.pseudos;return p['first-of-type'](m)+p['last-of-type'](m);},nth:function(fragment,m){var mm,formula=m[6],predicate;if(formula=='even')formula='2n+0';if(formula=='odd')formula='2n+1';if(mm=formula.match(/^(\d+)$/))
return'['+fragment+"= "+mm[1]+']';if(mm=formula.match(/^(-?\d*)?n(([+-])(\d+))?/)){if(mm[1]=="-")mm[1]=-1;var a=mm[1]?Number(mm[1]):1;var b=mm[2]?Number(mm[2]):0;predicate="[((#{fragment} - #{b}) mod #{a} = 0) and "+"((#{fragment} - #{b}) div #{a} >= 0)]";return new Template(predicate).evaluate({fragment:fragment,a:a,b:b});}}}},criteria:{tagName:'n = h.tagName(n, r, "#{1}", c);      c = false;',className:'n = h.className(n, r, "#{1}", c);    c = false;',id:'n = h.id(n, r, "#{1}", c);           c = false;',attrPresence:'n = h.attrPresence(n, r, "#{1}", c); c = false;',attr:function(m){m[3]=(m[5]||m[6]);return new Template('n = h.attr(n, r, "#{1}", "#{3}", "#{2}", c); c = false;').evaluate(m);},pseudo:function(m){if(m[6])m[6]=m[6].replace(/"/g,'\\"');return new Template('n = h.pseudo(n, "#{1}", "#{6}", r, c); c = false;').evaluate(m);},descendant:'c = "descendant";',child:'c = "child";',adjacent:'c = "adjacent";',laterSibling:'c = "laterSibling";'},patterns:[{name:'laterSibling',re:/^\s*~\s*/},{name:'child',re:/^\s*>\s*/},{name:'adjacent',re:/^\s*\+\s*/},{name:'descendant',re:/^\s/},{name:'tagName',re:/^\s*(\*|[\w\-]+)(\b|$)?/},{name:'id',re:/^#([\w\-\*]+)(\b|$)/},{name:'className',re:/^\.([\w\-\*]+)(\b|$)/},{name:'pseudo',re:/^:((first|last|nth|nth-last|only)(-child|-of-type)|empty|checked|(en|dis)abled|not)(\((.*?)\))?(\b|$|(?=\s|[:+~>]))/},{name:'attrPresence',re:/^\[((?:[\w-]+:)?[\w-]+)\]/},{name:'attr',re:/\[((?:[\w-]*:)?[\w-]+)\s*(?:([!^$*~|]?=)\s*((['"])([^\4]*?)\4|([^'"][^\]]*?)))?\]/}],assertions:{tagName:function(element,matches){return matches[1].toUpperCase()==element.tagName.toUpperCase();},className:function(element,matches){return Element.hasClassName(element,matches[1]);},id:function(element,matches){return element.id===matches[1];},attrPresence:function(element,matches){return Element.hasAttribute(element,matches[1]);},attr:function(element,matches){var nodeValue=Element.readAttribute(element,matches[1]);return nodeValue&&Selector.operators[matches[2]](nodeValue,matches[5]||matches[6]);}},handlers:{concat:function(a,b){for(var i=0,node;node=b[i];i++)
a.push(node);return a;},mark:function(nodes){var _true=Prototype.emptyFunction;for(var i=0,node;node=nodes[i];i++)
node._countedByPrototype=_true;return nodes;},unmark:(function(){var PROPERTIES_ATTRIBUTES_MAP=(function(){var el=document.createElement('div'),isBuggy=false,propName='_countedByPrototype',value='x'
el[propName]=value;isBuggy=(el.getAttribute(propName)===value);el=null;return isBuggy;})();return PROPERTIES_ATTRIBUTES_MAP?function(nodes){for(var i=0,node;node=nodes[i];i++)
node.removeAttribute('_countedByPrototype');return nodes;}:function(nodes){for(var i=0,node;node=nodes[i];i++)
node._countedByPrototype=void 0;return nodes;}})(),index:function(parentNode,reverse,ofType){parentNode._countedByPrototype=Prototype.emptyFunction;if(reverse){for(var nodes=parentNode.childNodes,i=nodes.length-1,j=1;i>=0;i--){var node=nodes[i];if(node.nodeType==1&&(!ofType||node._countedByPrototype))node.nodeIndex=j++;}}else{for(var i=0,j=1,nodes=parentNode.childNodes;node=nodes[i];i++)
if(node.nodeType==1&&(!ofType||node._countedByPrototype))node.nodeIndex=j++;}},unique:function(nodes){if(nodes.length==0)return nodes;var results=[],n;for(var i=0,l=nodes.length;i<l;i++)
if(typeof(n=nodes[i])._countedByPrototype=='undefined'){n._countedByPrototype=Prototype.emptyFunction;results.push(Element.extend(n));}
return Selector.handlers.unmark(results);},descendant:function(nodes){var h=Selector.handlers;for(var i=0,results=[],node;node=nodes[i];i++)
h.concat(results,node.getElementsByTagName('*'));return results;},child:function(nodes){var h=Selector.handlers;for(var i=0,results=[],node;node=nodes[i];i++){for(var j=0,child;child=node.childNodes[j];j++)
if(child.nodeType==1&&child.tagName!='!')results.push(child);}
return results;},adjacent:function(nodes){for(var i=0,results=[],node;node=nodes[i];i++){var next=this.nextElementSibling(node);if(next)results.push(next);}
return results;},laterSibling:function(nodes){var h=Selector.handlers;for(var i=0,results=[],node;node=nodes[i];i++)
h.concat(results,Element.nextSiblings(node));return results;},nextElementSibling:function(node){while(node=node.nextSibling)
if(node.nodeType==1)return node;return null;},previousElementSibling:function(node){while(node=node.previousSibling)
if(node.nodeType==1)return node;return null;},tagName:function(nodes,root,tagName,combinator){var uTagName=tagName.toUpperCase();var results=[],h=Selector.handlers;if(nodes){if(combinator){if(combinator=="descendant"){for(var i=0,node;node=nodes[i];i++)
h.concat(results,node.getElementsByTagName(tagName));return results;}else nodes=this[combinator](nodes);if(tagName=="*")return nodes;}
for(var i=0,node;node=nodes[i];i++)
if(node.tagName.toUpperCase()===uTagName)results.push(node);return results;}else return root.getElementsByTagName(tagName);},id:function(nodes,root,id,combinator){var targetNode=$(id),h=Selector.handlers;if(root==document){if(!targetNode)return[];if(!nodes)return[targetNode];}else{if(!root.sourceIndex||root.sourceIndex<1){var nodes=root.getElementsByTagName('*');for(var j=0,node;node=nodes[j];j++){if(node.id===id)return[node];}}}
if(nodes){if(combinator){if(combinator=='child'){for(var i=0,node;node=nodes[i];i++)
if(targetNode.parentNode==node)return[targetNode];}else if(combinator=='descendant'){for(var i=0,node;node=nodes[i];i++)
if(Element.descendantOf(targetNode,node))return[targetNode];}else if(combinator=='adjacent'){for(var i=0,node;node=nodes[i];i++)
if(Selector.handlers.previousElementSibling(targetNode)==node)
return[targetNode];}else nodes=h[combinator](nodes);}
for(var i=0,node;node=nodes[i];i++)
if(node==targetNode)return[targetNode];return[];}
return(targetNode&&Element.descendantOf(targetNode,root))?[targetNode]:[];},className:function(nodes,root,className,combinator){if(nodes&&combinator)nodes=this[combinator](nodes);return Selector.handlers.byClassName(nodes,root,className);},byClassName:function(nodes,root,className){if(!nodes)nodes=Selector.handlers.descendant([root]);var needle=' '+className+' ';for(var i=0,results=[],node,nodeClassName;node=nodes[i];i++){nodeClassName=node.className;if(nodeClassName.length==0)continue;if(nodeClassName==className||(' '+nodeClassName+' ').include(needle))
results.push(node);}
return results;},attrPresence:function(nodes,root,attr,combinator){if(!nodes)nodes=root.getElementsByTagName("*");if(nodes&&combinator)nodes=this[combinator](nodes);var results=[];for(var i=0,node;node=nodes[i];i++)
if(Element.hasAttribute(node,attr))results.push(node);return results;},attr:function(nodes,root,attr,value,operator,combinator){if(!nodes)nodes=root.getElementsByTagName("*");if(nodes&&combinator)nodes=this[combinator](nodes);var handler=Selector.operators[operator],results=[];for(var i=0,node;node=nodes[i];i++){var nodeValue=Element.readAttribute(node,attr);if(nodeValue===null)continue;if(handler(nodeValue,value))results.push(node);}
return results;},pseudo:function(nodes,name,value,root,combinator){if(nodes&&combinator)nodes=this[combinator](nodes);if(!nodes)nodes=root.getElementsByTagName("*");return Selector.pseudos[name](nodes,value,root);}},pseudos:{'first-child':function(nodes,value,root){for(var i=0,results=[],node;node=nodes[i];i++){if(Selector.handlers.previousElementSibling(node))continue;results.push(node);}
return results;},'last-child':function(nodes,value,root){for(var i=0,results=[],node;node=nodes[i];i++){if(Selector.handlers.nextElementSibling(node))continue;results.push(node);}
return results;},'only-child':function(nodes,value,root){var h=Selector.handlers;for(var i=0,results=[],node;node=nodes[i];i++)
if(!h.previousElementSibling(node)&&!h.nextElementSibling(node))
results.push(node);return results;},'nth-child':function(nodes,formula,root){return Selector.pseudos.nth(nodes,formula,root);},'nth-last-child':function(nodes,formula,root){return Selector.pseudos.nth(nodes,formula,root,true);},'nth-of-type':function(nodes,formula,root){return Selector.pseudos.nth(nodes,formula,root,false,true);},'nth-last-of-type':function(nodes,formula,root){return Selector.pseudos.nth(nodes,formula,root,true,true);},'first-of-type':function(nodes,formula,root){return Selector.pseudos.nth(nodes,"1",root,false,true);},'last-of-type':function(nodes,formula,root){return Selector.pseudos.nth(nodes,"1",root,true,true);},'only-of-type':function(nodes,formula,root){var p=Selector.pseudos;return p['last-of-type'](p['first-of-type'](nodes,formula,root),formula,root);},getIndices:function(a,b,total){if(a==0)return b>0?[b]:[];return $R(1,total).inject([],function(memo,i){if(0==(i-b)%a&&(i-b)/a>=0)memo.push(i);return memo;});},nth:function(nodes,formula,root,reverse,ofType){if(nodes.length==0)return[];if(formula=='even')formula='2n+0';if(formula=='odd')formula='2n+1';var h=Selector.handlers,results=[],indexed=[],m;h.mark(nodes);for(var i=0,node;node=nodes[i];i++){if(!node.parentNode._countedByPrototype){h.index(node.parentNode,reverse,ofType);indexed.push(node.parentNode);}}
if(formula.match(/^\d+$/)){formula=Number(formula);for(var i=0,node;node=nodes[i];i++)
if(node.nodeIndex==formula)results.push(node);}else if(m=formula.match(/^(-?\d*)?n(([+-])(\d+))?/)){if(m[1]=="-")m[1]=-1;var a=m[1]?Number(m[1]):1;var b=m[2]?Number(m[2]):0;var indices=Selector.pseudos.getIndices(a,b,nodes.length);for(var i=0,node,l=indices.length;node=nodes[i];i++){for(var j=0;j<l;j++)
if(node.nodeIndex==indices[j])results.push(node);}}
h.unmark(nodes);h.unmark(indexed);return results;},'empty':function(nodes,value,root){for(var i=0,results=[],node;node=nodes[i];i++){if(node.tagName=='!'||node.firstChild)continue;results.push(node);}
return results;},'not':function(nodes,selector,root){var h=Selector.handlers,selectorType,m;var exclusions=new Selector(selector).findElements(root);h.mark(exclusions);for(var i=0,results=[],node;node=nodes[i];i++)
if(!node._countedByPrototype)results.push(node);h.unmark(exclusions);return results;},'enabled':function(nodes,value,root){for(var i=0,results=[],node;node=nodes[i];i++)
if(!node.disabled&&(!node.type||node.type!=='hidden'))
results.push(node);return results;},'disabled':function(nodes,value,root){for(var i=0,results=[],node;node=nodes[i];i++)
if(node.disabled)results.push(node);return results;},'checked':function(nodes,value,root){for(var i=0,results=[],node;node=nodes[i];i++)
if(node.checked)results.push(node);return results;}},operators:{'=':function(nv,v){return nv==v;},'!=':function(nv,v){return nv!=v;},'^=':function(nv,v){return nv==v||nv&&nv.startsWith(v);},'$=':function(nv,v){return nv==v||nv&&nv.endsWith(v);},'*=':function(nv,v){return nv==v||nv&&nv.include(v);},'~=':function(nv,v){return(' '+nv+' ').include(' '+v+' ');},'|=':function(nv,v){return('-'+(nv||"").toUpperCase()+'-').include('-'+(v||"").toUpperCase()+'-');}},split:function(expression){var expressions=[];expression.scan(/(([\w#:.~>+()\s-]+|\*|\[.*?\])+)\s*(,|$)/,function(m){expressions.push(m[1].strip());});return expressions;},matchElements:function(elements,expression){var matches=$$(expression),h=Selector.handlers;h.mark(matches);for(var i=0,results=[],element;element=elements[i];i++)
if(element._countedByPrototype)results.push(element);h.unmark(matches);return results;},findElement:function(elements,expression,index){if(Object.isNumber(expression)){index=expression;expression=false;}
return Selector.matchElements(elements,expression||'*')[index||0];},findChildElements:function(element,expressions){expressions=Selector.split(expressions.join(','));var results=[],h=Selector.handlers;for(var i=0,l=expressions.length,selector;i<l;i++){selector=new Selector(expressions[i].strip());h.concat(results,selector.findElements(element));}
return(l>1)?h.unique(results):results;}});if(Prototype.Browser.IE){Object.extend(Selector.handlers,{concat:function(a,b){for(var i=0,node;node=b[i];i++)
if(node.tagName!=="!")a.push(node);return a;}});}
function $$(){return Selector.findChildElements(document,$A(arguments));}
var Form={reset:function(form){form=$(form);form.reset();return form;},serializeElements:function(elements,options){if(typeof options!='object')options={hash:!!options};else if(Object.isUndefined(options.hash))options.hash=true;var key,value,submitted=false,submit=options.submit;var data=elements.inject({},function(result,element){if(!element.disabled&&element.name){key=element.name;value=$(element).getValue();if(value!=null&&element.type!='file'&&(element.type!='submit'||(!submitted&&submit!==false&&(!submit||key==submit)&&(submitted=true)))){if(key in result){if(!Object.isArray(result[key]))result[key]=[result[key]];result[key].push(value);}
else result[key]=value;}}
return result;});return options.hash?data:Object.toQueryString(data);}};Form.Methods={serialize:function(form,options){return Form.serializeElements(Form.getElements(form),options);},getElements:function(form){var elements=$(form).getElementsByTagName('*'),element,arr=[],serializers=Form.Element.Serializers;for(var i=0;element=elements[i];i++){arr.push(element);}
return arr.inject([],function(elements,child){if(serializers[child.tagName.toLowerCase()])
elements.push(Element.extend(child));return elements;})},getInputs:function(form,typeName,name){form=$(form);var inputs=form.getElementsByTagName('input');if(!typeName&&!name)return $A(inputs).map(Element.extend);for(var i=0,matchingInputs=[],length=inputs.length;i<length;i++){var input=inputs[i];if((typeName&&input.type!=typeName)||(name&&input.name!=name))
continue;matchingInputs.push(Element.extend(input));}
return matchingInputs;},disable:function(form){form=$(form);Form.getElements(form).invoke('disable');return form;},enable:function(form){form=$(form);Form.getElements(form).invoke('enable');return form;},findFirstElement:function(form){var elements=$(form).getElements().findAll(function(element){return'hidden'!=element.type&&!element.disabled;});var firstByIndex=elements.findAll(function(element){return element.hasAttribute('tabIndex')&&element.tabIndex>=0;}).sortBy(function(element){return element.tabIndex}).first();return firstByIndex?firstByIndex:elements.find(function(element){return/^(?:input|select|textarea)$/i.test(element.tagName);});},focusFirstElement:function(form){form=$(form);form.findFirstElement().activate();return form;},request:function(form,options){form=$(form),options=Object.clone(options||{});var params=options.parameters,action=form.readAttribute('action')||'';if(action.blank())action=window.location.href;options.parameters=form.serialize(true);if(params){if(Object.isString(params))params=params.toQueryParams();Object.extend(options.parameters,params);}
if(form.hasAttribute('method')&&!options.method)
options.method=form.method;return new Ajax.Request(action,options);}};Form.Element={focus:function(element){$(element).focus();return element;},select:function(element){$(element).select();return element;}};Form.Element.Methods={serialize:function(element){element=$(element);if(!element.disabled&&element.name){var value=element.getValue();if(value!=undefined){var pair={};pair[element.name]=value;return Object.toQueryString(pair);}}
return'';},getValue:function(element){element=$(element);var method=element.tagName.toLowerCase();return Form.Element.Serializers[method](element);},setValue:function(element,value){element=$(element);var method=element.tagName.toLowerCase();Form.Element.Serializers[method](element,value);return element;},clear:function(element){$(element).value='';return element;},present:function(element){return $(element).value!='';},activate:function(element){element=$(element);try{element.focus();if(element.select&&(element.tagName.toLowerCase()!='input'||!(/^(?:button|reset|submit)$/i.test(element.type))))
element.select();}catch(e){}
return element;},disable:function(element){element=$(element);element.disabled=true;return element;},enable:function(element){element=$(element);element.disabled=false;return element;}};var Field=Form.Element;var $F=Form.Element.Methods.getValue;Form.Element.Serializers={input:function(element,value){switch(element.type.toLowerCase()){case'checkbox':case'radio':return Form.Element.Serializers.inputSelector(element,value);default:return Form.Element.Serializers.textarea(element,value);}},inputSelector:function(element,value){if(Object.isUndefined(value))return element.checked?element.value:null;else element.checked=!!value;},textarea:function(element,value){if(Object.isUndefined(value))return element.value;else element.value=value;},select:function(element,value){if(Object.isUndefined(value))
return this[element.type=='select-one'?'selectOne':'selectMany'](element);else{var opt,currentValue,single=!Object.isArray(value);for(var i=0,length=element.length;i<length;i++){opt=element.options[i];currentValue=this.optionValue(opt);if(single){if(currentValue==value){opt.selected=true;return;}}
else opt.selected=value.include(currentValue);}}},selectOne:function(element){var index=element.selectedIndex;return index>=0?this.optionValue(element.options[index]):null;},selectMany:function(element){var values,length=element.length;if(!length)return null;for(var i=0,values=[];i<length;i++){var opt=element.options[i];if(opt.selected)values.push(this.optionValue(opt));}
return values;},optionValue:function(opt){return Element.extend(opt).hasAttribute('value')?opt.value:opt.text;}};Abstract.TimedObserver=Class.create(PeriodicalExecuter,{initialize:function($super,element,frequency,callback){$super(callback,frequency);this.element=$(element);this.lastValue=this.getValue();},execute:function(){var value=this.getValue();if(Object.isString(this.lastValue)&&Object.isString(value)?this.lastValue!=value:String(this.lastValue)!=String(value)){this.callback(this.element,value);this.lastValue=value;}}});Form.Element.Observer=Class.create(Abstract.TimedObserver,{getValue:function(){return Form.Element.getValue(this.element);}});Form.Observer=Class.create(Abstract.TimedObserver,{getValue:function(){return Form.serialize(this.element);}});Abstract.EventObserver=Class.create({initialize:function(element,callback){this.element=$(element);this.callback=callback;this.lastValue=this.getValue();if(this.element.tagName.toLowerCase()=='form')
this.registerFormCallbacks();else
this.registerCallback(this.element);},onElementEvent:function(){var value=this.getValue();if(this.lastValue!=value){this.callback(this.element,value);this.lastValue=value;}},registerFormCallbacks:function(){Form.getElements(this.element).each(this.registerCallback,this);},registerCallback:function(element){if(element.type){switch(element.type.toLowerCase()){case'checkbox':case'radio':Event.observe(element,'click',this.onElementEvent.bind(this));break;default:Event.observe(element,'change',this.onElementEvent.bind(this));break;}}}});Form.Element.EventObserver=Class.create(Abstract.EventObserver,{getValue:function(){return Form.Element.getValue(this.element);}});Form.EventObserver=Class.create(Abstract.EventObserver,{getValue:function(){return Form.serialize(this.element);}});(function(){var Event={KEY_BACKSPACE:8,KEY_TAB:9,KEY_RETURN:13,KEY_ESC:27,KEY_LEFT:37,KEY_UP:38,KEY_RIGHT:39,KEY_DOWN:40,KEY_DELETE:46,KEY_HOME:36,KEY_END:35,KEY_PAGEUP:33,KEY_PAGEDOWN:34,KEY_INSERT:45,cache:{}};var docEl=document.documentElement;var MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED='onmouseenter'in docEl&&'onmouseleave'in docEl;var _isButton;if(Prototype.Browser.IE){var buttonMap={0:1,1:4,2:2};_isButton=function(event,code){return event.button===buttonMap[code];};}else if(Prototype.Browser.WebKit){_isButton=function(event,code){switch(code){case 0:return event.which==1&&!event.metaKey;case 1:return event.which==1&&event.metaKey;default:return false;}};}else{_isButton=function(event,code){return event.which?(event.which===code+1):(event.button===code);};}
function isLeftClick(event){return _isButton(event,0)}
function isMiddleClick(event){return _isButton(event,1)}
function isRightClick(event){return _isButton(event,2)}
function element(event){event=Event.extend(event);var node=event.target,type=event.type,currentTarget=event.currentTarget;if(currentTarget&&currentTarget.tagName){if(type==='load'||type==='error'||(type==='click'&&currentTarget.tagName.toLowerCase()==='input'&&currentTarget.type==='radio'))
node=currentTarget;}
if(node.nodeType==Node.TEXT_NODE)
node=node.parentNode;return Element.extend(node);}
function findElement(event,expression){var element=Event.element(event);if(!expression)return element;var elements=[element].concat(element.ancestors());return Selector.findElement(elements,expression,0);}
function pointer(event){return{x:pointerX(event),y:pointerY(event)};}
function pointerX(event){var docElement=document.documentElement,body=document.body||{scrollLeft:0};return event.pageX||(event.clientX+
(docElement.scrollLeft||body.scrollLeft)-
(docElement.clientLeft||0));}
function pointerY(event){var docElement=document.documentElement,body=document.body||{scrollTop:0};return event.pageY||(event.clientY+
(docElement.scrollTop||body.scrollTop)-
(docElement.clientTop||0));}
function stop(event){Event.extend(event);event.preventDefault();event.stopPropagation();event.stopped=true;}
Event.Methods={isLeftClick:isLeftClick,isMiddleClick:isMiddleClick,isRightClick:isRightClick,element:element,findElement:findElement,pointer:pointer,pointerX:pointerX,pointerY:pointerY,stop:stop};var methods=Object.keys(Event.Methods).inject({},function(m,name){m[name]=Event.Methods[name].methodize();return m;});if(Prototype.Browser.IE){function _relatedTarget(event){var element;switch(event.type){case'mouseover':element=event.fromElement;break;case'mouseout':element=event.toElement;break;default:return null;}
return Element.extend(element);}
Object.extend(methods,{stopPropagation:function(){this.cancelBubble=true},preventDefault:function(){this.returnValue=false},inspect:function(){return'[object Event]'}});Event.extend=function(event,element){if(!event)return false;if(event._extendedByPrototype)return event;event._extendedByPrototype=Prototype.emptyFunction;var pointer=Event.pointer(event);Object.extend(event,{target:event.srcElement||element,relatedTarget:_relatedTarget(event),pageX:pointer.x,pageY:pointer.y});return Object.extend(event,methods);};}else{Event.prototype=window.Event.prototype||document.createEvent('HTMLEvents').__proto__;Object.extend(Event.prototype,methods);Event.extend=Prototype.K;}
function _createResponder(element,eventName,handler){var registry=Element.retrieve(element,'prototype_event_registry');if(Object.isUndefined(registry)){CACHE.push(element);registry=Element.retrieve(element,'prototype_event_registry',$H());}
var respondersForEvent=registry.get(eventName);if(Object.isUndefined(respondersForEvent)){respondersForEvent=[];registry.set(eventName,respondersForEvent);}
if(respondersForEvent.pluck('handler').include(handler))return false;var responder;if(eventName.include(":")){responder=function(event){if(Object.isUndefined(event.eventName))
return false;if(event.eventName!==eventName)
return false;Event.extend(event,element);handler.call(element,event);};}else{if(!MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED&&(eventName==="mouseenter"||eventName==="mouseleave")){if(eventName==="mouseenter"||eventName==="mouseleave"){responder=function(event){Event.extend(event,element);var parent=event.relatedTarget;while(parent&&parent!==element){try{parent=parent.parentNode;}
catch(e){parent=element;}}
if(parent===element)return;handler.call(element,event);};}}else{responder=function(event){Event.extend(event,element);handler.call(element,event);};}}
responder.handler=handler;respondersForEvent.push(responder);return responder;}
function _destroyCache(){for(var i=0,length=CACHE.length;i<length;i++){Event.stopObserving(CACHE[i]);CACHE[i]=null;}}
var CACHE=[];if(Prototype.Browser.IE)
window.attachEvent('onunload',_destroyCache);if(Prototype.Browser.WebKit)
window.addEventListener('unload',Prototype.emptyFunction,false);var _getDOMEventName=Prototype.K;if(!MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED){_getDOMEventName=function(eventName){var translations={mouseenter:"mouseover",mouseleave:"mouseout"};return eventName in translations?translations[eventName]:eventName;};}
function observe(element,eventName,handler){element=$(element);var responder=_createResponder(element,eventName,handler);if(!responder)return element;if(eventName.include(':')){if(element.addEventListener)
element.addEventListener("dataavailable",responder,false);else{element.attachEvent("ondataavailable",responder);element.attachEvent("onfilterchange",responder);}}else{var actualEventName=_getDOMEventName(eventName);if(element.addEventListener)
element.addEventListener(actualEventName,responder,false);else
element.attachEvent("on"+actualEventName,responder);}
return element;}
function stopObserving(element,eventName,handler){element=$(element);var registry=Element.retrieve(element,'prototype_event_registry');if(Object.isUndefined(registry))return element;if(eventName&&!handler){var responders=registry.get(eventName);if(Object.isUndefined(responders))return element;responders.each(function(r){Element.stopObserving(element,eventName,r.handler);});return element;}else if(!eventName){registry.each(function(pair){var eventName=pair.key,responders=pair.value;responders.each(function(r){Element.stopObserving(element,eventName,r.handler);});});return element;}
var responders=registry.get(eventName);if(!responders)return;var responder=responders.find(function(r){return r.handler===handler;});if(!responder)return element;var actualEventName=_getDOMEventName(eventName);if(eventName.include(':')){if(element.removeEventListener)
element.removeEventListener("dataavailable",responder,false);else{element.detachEvent("ondataavailable",responder);element.detachEvent("onfilterchange",responder);}}else{if(element.removeEventListener)
element.removeEventListener(actualEventName,responder,false);else
element.detachEvent('on'+actualEventName,responder);}
registry.set(eventName,responders.without(responder));return element;}
function fire(element,eventName,memo,bubble){element=$(element);if(Object.isUndefined(bubble))
bubble=true;if(element==document&&document.createEvent&&!element.dispatchEvent)
element=document.documentElement;var event;if(document.createEvent){event=document.createEvent('HTMLEvents');event.initEvent('dataavailable',true,true);}else{event=document.createEventObject();event.eventType=bubble?'ondataavailable':'onfilterchange';}
event.eventName=eventName;event.memo=memo||{};if(document.createEvent)
element.dispatchEvent(event);else
element.fireEvent(event.eventType,event);return Event.extend(event);}
Object.extend(Event,Event.Methods);Object.extend(Event,{fire:fire,observe:observe,stopObserving:stopObserving});Element.addMethods({fire:fire,observe:observe,stopObserving:stopObserving});Object.extend(document,{fire:fire.methodize(),observe:observe.methodize(),stopObserving:stopObserving.methodize(),loaded:false});if(window.Event)Object.extend(window.Event,Event);else window.Event=Event;})();(function(){var timer;function fireContentLoadedEvent(){if(document.loaded)return;if(timer)window.clearTimeout(timer);document.loaded=true;document.fire('dom:loaded');}
function checkReadyState(){if(document.readyState==='complete'){document.stopObserving('readystatechange',checkReadyState);fireContentLoadedEvent();}}
function pollDoScroll(){try{document.documentElement.doScroll('left');}
catch(e){timer=pollDoScroll.defer();return;}
fireContentLoadedEvent();}
if(document.addEventListener){document.addEventListener('DOMContentLoaded',fireContentLoadedEvent,false);}else{document.observe('readystatechange',checkReadyState);if(window==top)
timer=pollDoScroll.defer();}
Event.observe(window,'load',fireContentLoadedEvent);})();Element.addMethods();Hash.toQueryString=Object.toQueryString;var Toggle={display:Element.toggle};Element.Methods.childOf=Element.Methods.descendantOf;var Insertion={Before:function(element,content){return Element.insert(element,{before:content});},Top:function(element,content){return Element.insert(element,{top:content});},Bottom:function(element,content){return Element.insert(element,{bottom:content});},After:function(element,content){return Element.insert(element,{after:content});}};var $continue=new Error('"throw $continue" is deprecated, use "return" instead');var Position={includeScrollOffsets:false,prepare:function(){this.deltaX=window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft||0;this.deltaY=window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0;},within:function(element,x,y){if(this.includeScrollOffsets)
return this.withinIncludingScrolloffsets(element,x,y);this.xcomp=x;this.ycomp=y;this.offset=Element.cumulativeOffset(element);return(y>=this.offset[1]&&y<this.offset[1]+element.offsetHeight&&x>=this.offset[0]&&x<this.offset[0]+element.offsetWidth);},withinIncludingScrolloffsets:function(element,x,y){var offsetcache=Element.cumulativeScrollOffset(element);this.xcomp=x+offsetcache[0]-this.deltaX;this.ycomp=y+offsetcache[1]-this.deltaY;this.offset=Element.cumulativeOffset(element);return(this.ycomp>=this.offset[1]&&this.ycomp<this.offset[1]+element.offsetHeight&&this.xcomp>=this.offset[0]&&this.xcomp<this.offset[0]+element.offsetWidth);},overlap:function(mode,element){if(!mode)return 0;if(mode=='vertical')
return((this.offset[1]+element.offsetHeight)-this.ycomp)/element.offsetHeight;if(mode=='horizontal')
return((this.offset[0]+element.offsetWidth)-this.xcomp)/element.offsetWidth;},cumulativeOffset:Element.Methods.cumulativeOffset,positionedOffset:Element.Methods.positionedOffset,absolutize:function(element){Position.prepare();return Element.absolutize(element);},relativize:function(element){Position.prepare();return Element.relativize(element);},realOffset:Element.Methods.cumulativeScrollOffset,offsetParent:Element.Methods.getOffsetParent,page:Element.Methods.viewportOffset,clone:function(source,target,options){options=options||{};return Element.clonePosition(target,source,options);}};if(!document.getElementsByClassName)document.getElementsByClassName=function(instanceMethods){function iter(name){return name.blank()?null:"[contains(concat(' ', @class, ' '), ' "+name+" ')]";}
instanceMethods.getElementsByClassName=Prototype.BrowserFeatures.XPath?function(element,className){className=className.toString().strip();var cond=/\s/.test(className)?$w(className).map(iter).join(''):iter(className);return cond?document._getElementsByXPath('.//*'+cond,element):[];}:function(element,className){className=className.toString().strip();var elements=[],classNames=(/\s/.test(className)?$w(className):null);if(!classNames&&!className)return elements;var nodes=$(element).getElementsByTagName('*');className=' '+className+' ';for(var i=0,child,cn;child=nodes[i];i++){if(child.className&&(cn=' '+child.className+' ')&&(cn.include(className)||(classNames&&classNames.all(function(name){return!name.toString().blank()&&cn.include(' '+name+' ');}))))
elements.push(Element.extend(child));}
return elements;};return function(className,parentElement){return $(parentElement||document.body).getElementsByClassName(className);};}(Element.Methods);Element.ClassNames=Class.create();Element.ClassNames.prototype={initialize:function(element){this.element=$(element);},_each:function(iterator){this.element.className.split(/\s+/).select(function(name){return name.length>0;})._each(iterator);},set:function(className){this.element.className=className;},add:function(classNameToAdd){if(this.include(classNameToAdd))return;this.set($A(this).concat(classNameToAdd).join(' '));},remove:function(classNameToRemove){if(!this.include(classNameToRemove))return;this.set($A(this).without(classNameToRemove).join(' '));},toString:function(){return $A(this).join(' ');}};Object.extend(Element.ClassNames.prototype,Enumerable);GlkOte=function(){var game_interface=null;var windowport_id='windowport';var gameport_id='gameport';var generation=0;var disabled=false;var loading_visible=null;var windowdic=null;var current_metrics=null;var currently_focussed=false;var last_known_focus=0;var last_known_paging=0;var windows_paging_count=0;var resize_timer=null;var retry_timer=null;var is_ie7=false;var perform_paging=true;var detect_external_links=false;var regex_external_links=null;var NBSP="\xa0";var max_buffer_length=200;var terminator_key_names={escape:Event.KEY_ESC,func1:112,func2:113,func3:114,func4:115,func5:116,func6:117,func7:118,func8:119,func9:120,func10:121,func11:122,func12:123};var terminator_key_values={};function glkote_init(iface){if(!iface&&window.Game)
iface=window.Game;if(!iface){glkote_error('No game interface object has been provided.');return;}
if(!iface.accept){glkote_error('The game interface object must have an accept() function.');return;}
game_interface=iface;if(!window.Prototype){glkote_error('The Prototype library has not been loaded.');return;}
var version=Prototype.Version.split('.');if(version.length<2||(version[0]==1&&version[1]<6)){glkote_error('This version of the Prototype library is too old. (Version '+Prototype.Version+' found; 1.6.0 required.)');return;}
for(var val in terminator_key_names){terminator_key_values[terminator_key_names[val]]=val;}
if(Prototype.Browser.MobileSafari){perform_paging=false;}
if(Prototype.Browser.IE){is_ie7=window.XMLHttpRequest!=null;}
windowdic=new Hash();if(iface.windowport)
windowport_id=iface.windowport;if(iface.gameport)
gameport_id=iface.gameport;var el=$(windowport_id);if(!el){glkote_error('Cannot find windowport element #'+windowport_id+' in this document.');return;}
el.update();if(!Prototype.Browser.MobileSafari)
Event.observe(document,'keypress',evhan_doc_keypress);Event.observe(window,'resize',evhan_doc_resize);var res=measure_window();if(Object.isString(res)){glkote_error(res);return;}
current_metrics=res;detect_external_links=iface.detect_external_links;if(detect_external_links){regex_external_links=iface.regex_external_links;if(!regex_external_links){if(detect_external_links=='search'){regex_external_links=RegExp('\\b((?:https?://)(?:[^\\s()<>]+|\\(([^\\s()<>]+|(\\([^\\s()<>]+\\)))*\\))+(?:\\(([^\\s()<>]+|(\\([^\\s()<>]+\\)))*\\)|[^\\s`!()\\[\\]{};:\'".,<>?\u00ab\u00bb\u201c\u201d\u2018\u2019]))','i');}
else{regex_external_links=RegExp('^https?:','i');}}}
send_response('init',null,current_metrics);}
function measure_window(){var metrics={};var el,linesize,winsize,line1size,line2size,spansize;el=$(gameport_id);if(!el)
return'Cannot find gameport element #'+gameport_id+' in this document.';var portsize=el.getDimensions();metrics.width=portsize.width;metrics.height=portsize.height;el=$('layouttest_grid');if(!el)
return'Cannot find layouttest_grid element for window measurement.';winsize=el.getDimensions();spansize=$('layouttest_gridspan').getDimensions();line1size=$('layouttest_gridline').getDimensions();line2size=$('layouttest_gridline2').getDimensions();metrics.gridcharheight=($('layouttest_gridline2').positionedOffset().top
-$('layouttest_gridline').positionedOffset().top);metrics.gridcharwidth=(spansize.width/8);metrics.gridmarginx=winsize.width-spansize.width;metrics.gridmarginy=winsize.height-(line1size.height+line2size.height);el=$('layouttest_buffer');if(!el)
return'Cannot find layouttest_grid element for window measurement.';winsize=el.getDimensions();spansize=$('layouttest_bufferspan').getDimensions();line1size=$('layouttest_bufferline').getDimensions();line2size=$('layouttest_bufferline2').getDimensions();metrics.buffercharheight=($('layouttest_bufferline2').positionedOffset().top
-$('layouttest_bufferline').positionedOffset().top);metrics.buffercharwidth=(spansize.width/8);metrics.buffermarginx=winsize.width-spansize.width;metrics.buffermarginy=winsize.height-(line1size.height+line2size.height);metrics.outspacingx=0;metrics.outspacingy=0;metrics.inspacingx=0;metrics.inspacingy=0;if(game_interface.spacing!=undefined){metrics.outspacingx=game_interface.spacing;metrics.outspacingy=game_interface.spacing;metrics.inspacingx=game_interface.spacing;metrics.inspacingy=game_interface.spacing;}
if(game_interface.outspacing!=undefined){metrics.outspacingx=game_interface.outspacing;metrics.outspacingy=game_interface.outspacing;}
if(game_interface.inspacing!=undefined){metrics.inspacingx=game_interface.inspacing;metrics.inspacingy=game_interface.inspacing;}
if(game_interface.inspacingx!=undefined)
metrics.inspacingx=game_interface.inspacingx;if(game_interface.inspacingy!=undefined)
metrics.inspacingy=game_interface.inspacingy;if(game_interface.outspacingx!=undefined)
metrics.outspacingx=game_interface.outspacingx;if(game_interface.outspacingy!=undefined)
metrics.outspacingy=game_interface.outspacingy;return metrics;}
function glkote_update(arg){hide_loading();if(arg.type=='error'){glkote_error(arg.message);return;}
if(arg.type=='pass'){return;}
if(arg.type=='retry'){if(!retry_timer){glkote_log('Event has timed out; will retry...');show_loading();retry_timer=retry_update.delay(2);}
else{glkote_log('Event has timed out, but a retry is already queued!');}
return;}
if(arg.type!='update'){glkote_log('Ignoring unknown message type '+arg.type+'.');return;}
if(arg.gen==generation){glkote_log('Ignoring repeated generation number: '+generation);return;}
if(arg.gen<generation){glkote_log('Ignoring out-of-order generation number: got '+arg.gen+', currently at '+generation);return;}
generation=arg.gen;if(disabled){windowdic.values().each(function(win){if(win.inputel){win.inputel.disabled=false;}});disabled=false;}
if(arg.input!=null)
accept_inputcancel(arg.input);if(arg.windows!=null)
accept_windowset(arg.windows);if(arg.content!=null)
accept_contentset(arg.content);if(arg.input!=null)
accept_inputset(arg.input);if(arg.specialinput!=null)
accept_specialinput(arg.specialinput);windowdic.values().each(function(win){if(win.type=='buffer'&&win.needscroll){win.needscroll=false;if(!win.needspaging){var frameel=win.frameel;if(!perform_paging){frameel.scrollTop=frameel.scrollHeight;win.needspaging=false;}
else{frameel.scrollTop=win.topunseen-current_metrics.buffercharheight;var frameheight=frameel.getHeight();var realbottom=last_line_top_offset(frameel);var newtopunseen=frameel.scrollTop+frameheight;if(newtopunseen>realbottom)
newtopunseen=realbottom;if(win.topunseen<newtopunseen)
win.topunseen=newtopunseen;if(frameel.scrollTop+frameheight>=frameel.scrollHeight){win.needspaging=false;}
else{win.needspaging=true;}}
var moreel=$('win'+win.id+'_moreprompt');if(!win.needspaging){if(moreel)
moreel.remove();}
else{if(!moreel){moreel=new Element('div',{id:'win'+win.id+'_moreprompt','class':'MorePrompt'});insert_text(moreel,'More');var morex=win.coords.right+20;var morey=win.coords.bottom;moreel.setStyle({bottom:morey+'px',right:morex+'px'});$(windowport_id).insert(moreel);}}}}});readjust_paging_focus(false);disabled=false;if(arg.disable||arg.specialinput){disabled=true;windowdic.values().each(function(win){if(win.inputel){win.inputel.disabled=true;}});}
var newinputwin=0;if(!disabled&&!windows_paging_count){windowdic.values().each(function(win){if(win.input){if(!newinputwin||win.id==last_known_focus)
newinputwin=win.id;}});}
if(newinputwin){var focusfunc=function(){var win=windowdic.get(newinputwin);if(win.inputel){win.inputel.focus();}};focusfunc.defer();}}
function accept_windowset(arg){windowdic.values().each(function(win){win.inplace=false;});arg.map(accept_one_window);var closewins=windowdic.values().reject(function(win){return win.inplace;});closewins.map(close_one_window);}
function accept_one_window(arg){var frameel,win;if(!arg){return;}
win=windowdic.get(arg.id);if(win==null){win={id:arg.id,type:arg.type,rock:arg.rock};windowdic.set(arg.id,win);var typeclass;if(win.type=='grid')
typeclass='GridWindow';if(win.type=='buffer')
typeclass='BufferWindow';var rockclass='WindowRock_'+arg.rock;frameel=new Element('div',{id:'window'+arg.id,'class':'WindowFrame '+typeclass+' '+rockclass});frameel.winid=arg.id;Event.observe(frameel,'mousedown',function(ev){evhan_window_mousedown(ev,frameel);});if(perform_paging&&win.type=='buffer')
frameel.onscroll=function(){evhan_window_scroll(frameel);};win.frameel=frameel;win.gridheight=0;win.gridwidth=0;win.input=null;win.inputel=null;win.terminators={};win.reqhyperlink=false;win.needscroll=false;win.needspaging=false;win.topunseen=0;win.coords={left:null,top:null,right:null,bottom:null};win.history=new Array();win.historypos=0;$(windowport_id).insert(frameel);}
else{frameel=win.frameel;if(win.type!=arg.type)
glkote_error('Window '+arg.id+' was created with type '+win.type+', but now is described as type '+arg.type);}
win.inplace=true;if(win.type=='grid'){var ix;if(arg.gridheight>win.gridheight){for(ix=win.gridheight;ix<arg.gridheight;ix++){var el=new Element('div',{id:'win'+win.id+'_ln'+ix,'class':'GridLine'});el.insert(NBSP);win.frameel.insert(el);}}
if(arg.gridheight<win.gridheight){for(ix=arg.gridheight;ix<win.gridheight;ix++){var el=$('win'+win.id+'_ln'+ix);if(el)
el.remove();}}
win.gridheight=arg.gridheight;win.gridwidth=arg.gridwidth;}
if(win.type=='buffer'){}
var styledic;if(Prototype.Browser.IE){var width=arg.width;var height=arg.height;if(arg.type=='grid'){width-=current_metrics.gridmarginx;height-=current_metrics.gridmarginy;}
if(arg.type=='buffer'){width-=current_metrics.buffermarginx;height-=current_metrics.buffermarginy;}
if(width<0)
width=0;if(height<0)
height=0;styledic={left:arg.left+'px',top:arg.top+'px',width:width+'px',height:height+'px'};win.coords.left=arg.left;win.coords.top=arg.top;win.coords.right=current_metrics.width-(arg.left+arg.width);win.coords.bottom=current_metrics.height-(arg.top+arg.height);}
else{var right=current_metrics.width-(arg.left+arg.width);var bottom=current_metrics.height-(arg.top+arg.height);styledic={left:arg.left+'px',top:arg.top+'px',right:right+'px',bottom:bottom+'px'};win.coords.left=arg.left;win.coords.top=arg.top;win.coords.right=right;win.coords.bottom=bottom;}
frameel.setStyle(styledic);}
function close_one_window(win){win.frameel.remove();windowdic.unset(win.id);win.frameel=null;var moreel=$('win'+win.id+'_moreprompt');if(moreel)
moreel.remove();}
var regex_initial_whitespace=new RegExp('^ ');var regex_final_whitespace=new RegExp(' $');var regex_long_whitespace=new RegExp('  +','g');function func_long_whitespace(match){var len=match.length;return(NBSP.times(len-1))+' ';}
function accept_contentset(arg){arg.map(accept_one_content);}
function accept_one_content(arg){var win=windowdic.get(arg.id);if(win==null){glkote_error('Got content update for window '+arg.id+', which does not exist.');return;}
if(win.input&&win.input.type=='line'){glkote_error('Got content update for window '+arg.id+', which is awaiting line input.');return;}
win.needscroll=true;if(win.type=='grid'){var lines=arg.lines;var ix,sx;for(ix=0;ix<lines.length;ix++){var linearg=lines[ix];var linenum=linearg.line;var content=linearg.content;var lineel=$('win'+win.id+'_ln'+linenum);if(!lineel){glkote_error('Got content for nonexistent line '+linenum+' of window '+arg.id+'.');continue;}
if(!content||!content.length){lineel.update(NBSP);}
else{lineel.update();for(sx=0;sx<content.length;sx++){var rdesc=content[sx];var rstyle,rtext,rlink;if(rdesc.length===undefined){rstyle=rdesc.style;rtext=rdesc.text;rlink=rdesc.hyperlink;}
else{rstyle=rdesc;sx++;rtext=content[sx];rlink=undefined;}
var el=new Element('span',{'class':'Style_'+rstyle});if(rlink==undefined){insert_text_detecting(el,rtext);}
else{var ael=new Element('a',{'href':'#'});insert_text(ael,rtext);ael.onclick=build_evhan_hyperlink(win.id,rlink);el.insert(ael);}
lineel.insert(el);}}}}
if(win.type=='buffer'){var text=arg.text;var ix,sx;if(win.inputel){win.inputel.remove();}
var cursel=$('win'+win.id+'_cursor');if(cursel)
cursel.remove();cursel=null;if(arg.clear){win.frameel.update();win.topunseen=0;}
for(ix=0;ix<text.length;ix++){var textarg=text[ix];var content=textarg.content;var divel=null;if(textarg.append){if(!content||!content.length)
continue;divel=last_child_of(win.frameel);}
if(divel==null){divel=new Element('div',{'class':'BufferLine'})
divel.blankpara=true;divel.endswhite=true;win.frameel.insert(divel);}
if(!content||!content.length){if(divel.blankpara)
divel.update(NBSP);continue;}
if(divel.blankpara){divel.blankpara=false;divel.update();}
for(sx=0;sx<content.length;sx++){var rdesc=content[sx];var rstyle,rtext,rlink;if(rdesc.length===undefined){rstyle=rdesc.style;rtext=rdesc.text;rlink=rdesc.hyperlink;}
else{rstyle=rdesc;sx++;rtext=content[sx];rlink=undefined;}
var el=new Element('span',{'class':'Style_'+rstyle});rtext=rtext.replace(regex_long_whitespace,func_long_whitespace);if(divel.endswhite){rtext=rtext.replace(regex_initial_whitespace,NBSP);}
if(rlink==undefined){insert_text_detecting(el,rtext);}
else{var ael=new Element('a',{'href':'#'});insert_text(ael,rtext);ael.onclick=build_evhan_hyperlink(win.id,rlink);el.insert(ael);}
divel.insert(el);divel.endswhite=regex_final_whitespace.test(rtext);}}
var parals=win.frameel.childNodes;if(parals){var totrim=parals.length-max_buffer_length;if(totrim>0){var ix,obj;win.topunseen-=parals[totrim].offsetTop;if(win.topunseen<0)
win.topunseen=0;for(ix=0;ix<totrim;ix++){obj=parals.item(0);if(obj)
win.frameel.removeChild(obj);}}}
var divel=last_child_of(win.frameel);if(divel){cursel=new Element('span',{id:'win'+win.id+'_cursor','class':'InvisibleCursor'});insert_text(cursel,NBSP);divel.insert(cursel);if(win.inputel){var inputel=win.inputel;var pos=cursel.positionedOffset();var width=win.frameel.getWidth()-(current_metrics.buffermarginx+pos.left+2);if(width<1)
width=1;if(Prototype.Browser.Opera){inputel.setStyle({position:'relative',left:'0px',top:'0px',width:width+'px'});cursel.insert({top:inputel});}
else{inputel.setStyle({position:'absolute',left:'0px',top:'0px',width:width+'px'});cursel.insert(inputel);}}}}}
function accept_inputcancel(arg){var hasinput=new Hash();arg.map(function(argi){if(argi.type)
hasinput.set(argi.id,argi);});windowdic.values().each(function(win){if(win.input){var argi=hasinput.get(win.id);if(argi==null||argi.gen>win.input.gen){win.input=null;if(win.inputel){win.inputel.remove();win.inputel=null;}}}});}
function accept_inputset(arg){var hasinput=new Hash();var hashyperlink=new Hash();arg.map(function(argi){if(argi.type)
hasinput.set(argi.id,argi);if(argi.hyperlink)
hashyperlink.set(argi.id,true);});windowdic.values().each(function(win){win.reqhyperlink=hashyperlink.get(win.id);var argi=hasinput.get(win.id);if(argi==null)
return;win.input=argi;var maxlen=1;if(argi.type=='line')
maxlen=argi.maxlen;var inputel=win.inputel;if(inputel==null){var classes='Input';if(argi.type=='line'){classes+=' LineInput';}
else if(argi.type=='char'){classes+=' CharInput';}
else{glkote_error('Window '+win.id+' has requested unrecognized input type '+argi.type+'.');}
inputel=new Element('input',{id:'win'+win.id+'_input','class':classes,type:'text',maxlength:maxlen});if(Prototype.Browser.MobileSafari)
inputel.writeAttribute('autocapitalize','off');if(argi.type=='line'){inputel.onkeypress=evhan_input_keypress;inputel.onkeydown=evhan_input_keydown;if(argi.initial)
inputel.value=argi.initial;win.terminators={};if(argi.terminators){for(var ix=0;ix<argi.terminators.length;ix++)
win.terminators[argi.terminators[ix]]=true;}}
else if(argi.type=='char'){inputel.onkeypress=evhan_input_char_keypress;inputel.onkeydown=evhan_input_char_keydown;}
var winid=win.id;inputel.onfocus=function(){evhan_input_focus(winid);};inputel.onblur=function(){evhan_input_blur(winid);};inputel.winid=win.id;win.inputel=inputel;win.historypos=win.history.length;win.needscroll=true;}
if(win.type=='grid'){var lineel=$('win'+win.id+'_ln'+argi.ypos);if(!lineel){glkote_error('Window '+win.id+' has requested input at unknown line '+argi.ypos+'.');return;}
var pos=lineel.positionedOffset();var xpos=pos.left+Math.round(argi.xpos*current_metrics.gridcharwidth);var width=Math.round(maxlen*current_metrics.gridcharwidth);var maxwidth=win.frameel.getWidth()-(current_metrics.buffermarginx+xpos+2);if(width>maxwidth)
width=maxwidth;inputel.setStyle({position:'absolute',left:xpos+'px',top:pos.top+'px',width:width+'px'});win.frameel.insert(inputel);}
if(win.type=='buffer'){var cursel=$('win'+win.id+'_cursor');if(!cursel){cursel=new Element('span',{id:'win'+win.id+'_cursor','class':'InvisibleCursor'});insert_text(cursel,NBSP);win.frameel.insert(cursel);}
var pos=cursel.positionedOffset();var width=win.frameel.getWidth()-(current_metrics.buffermarginx+pos.left+2);if(width<1)
width=1;if(Prototype.Browser.Opera){inputel.setStyle({position:'relative',left:'0px',top:'0px',width:width+'px'});cursel.insert({top:inputel});}
else{inputel.setStyle({position:'absolute',left:'0px',top:'0px',width:width+'px'});cursel.insert(inputel);}}});}
function accept_specialinput(arg){if(arg.type=='fileref_prompt'){var replyfunc=function(ref){send_response('specialresponse',null,'fileref_prompt',ref);};try{var writable=(arg.filemode!='read');Dialog.open(writable,arg.filetype,arg.gameid,replyfunc);}
catch(ex){GlkOte.log('Unable to open file dialog: '+ex);replyfunc.defer(null);}}
else{glkote_error('Request for unknown special input type: '+arg.type);}}
function last_line_top_offset(el){var ls=el.childElements();if(ls.length==0)
return 0;return ls[ls.length-1].offsetTop;}
function readjust_paging_focus(canfocus){windows_paging_count=0;var pageable_win=0;if(perform_paging){windowdic.values().each(function(win){if(win.needspaging){windows_paging_count+=1;if(!pageable_win||win.id==last_known_paging)
pageable_win=win.id;}});}
if(windows_paging_count){last_known_paging=pageable_win;}
if(!windows_paging_count&&canfocus){var newinputwin=0;if(!disabled&&!windows_paging_count){windowdic.values().each(function(win){if(win.input){if(!newinputwin||win.id==last_known_focus)
newinputwin=win.id;}});}
if(newinputwin){var win=windowdic.get(newinputwin);if(win.inputel){win.inputel.focus();}}}}
function glkote_get_interface(){return game_interface;}
function glkote_log(msg){if(window.console&&console.log)
console.log(msg);else if(window.opera&&opera.postError)
opera.postError(msg);}
function glkote_error(msg){var el=document.getElementById('errorcontent');remove_children(el);insert_text(el,msg);el=document.getElementById('errorpane');el.style.display='';hide_loading();}
function glkote_extevent(val){send_response('external',null,val);}
function retry_update(){retry_timer=null;glkote_log('Retrying update...');send_response('refresh',null,null);}
function clear_error(){$('errorpane').hide();}
function hide_loading(){if(loading_visible==false)
return;loading_visible=false;var el=document.getElementById('loadingpane');if(el){el.style.display='none';}}
function show_loading(){if(loading_visible==true)
return;loading_visible=true;var el=document.getElementById('loadingpane');if(el){el.style.display='';}}
function insert_text(el,val){var nod=document.createTextNode(val);el.appendChild(nod);}
function remove_children(parent){var obj,ls;ls=parent.childNodes;while(ls.length>0){obj=ls.item(0);parent.removeChild(obj);}}
function last_child_of(obj){var ls=obj.childElements();if(!ls||!ls.length)
return null;return ls[ls.length-1];}
function insert_text_detecting(el,val){if(!detect_external_links){var nod=document.createTextNode(val);el.appendChild(nod);return;}
if(detect_external_links=='match'){if(regex_external_links.test(val)){var ael=new Element('a',{'href':val,'class':'External','target':'_blank'});var nod=document.createTextNode(val);ael.appendChild(nod);el.insert(ael);return;}}
else if(detect_external_links=='search'){while(true){var match=regex_external_links.exec(val);if(!match)
break;if(match.index>0){var prefix=val.substring(0,match.index);var nod=document.createTextNode(prefix);el.appendChild(nod);}
var ael=new Element('a',{'href':match[0],'class':'External','target':'_blank'});var nod=document.createTextNode(match[0]);ael.appendChild(nod);el.insert(ael);val=val.substring(match.index+match[0].length);}
if(!val.length)
return;}
var nod=document.createTextNode(val);el.appendChild(nod);}
function inspect_method(){var keys=Object.keys(this);keys.sort();var els=keys.map(function(key){var val=this[key];if(val==inspect_method)
val='[...]';return key+':'+val;},this);return'{'+els.join(', ')+'}';}
function inspect_deep(res){var keys=Object.keys(res);keys.sort();var els=keys.map(function(key){var val=res[key];if(Object.isString(val))
val="'"+val+"'";else if(!Object.isNumber(val))
val=inspect_deep(val);return key+':'+val;},res);return'{'+els.join(', ')+'}';}
function submit_line_input(win,inputel,termkey){var val=inputel.value;if(val&&val!=win.history.last()){win.history.push(val);if(win.history.length>20){win.history.shift();}}
send_response('line',win,val,termkey);}
function send_response(type,win,val,val2){if(disabled&&type!='specialresponse')
return;var winid=0;if(win)
winid=win.id;var res={type:type,gen:generation};if(type=='line'){res.window=win.id;res.value=val;if(val2)
res.terminator=val2;}
else if(type=='char'){res.window=win.id;res.value=val;}
else if(type=='hyperlink'){res.window=win.id;res.value=val;}
else if(type=='external'){res.value=val;}
else if(type=='specialresponse'){res.response=val;res.value=val2;}
else if(type=='init'||type=='arrange'){res.metrics=val;}
if(!(type=='init'||type=='refresh'||type=='specialresponse')){windowdic.values().each(function(win){var savepartial=(type!='line'&&type!='char')||(win.id!=winid);if(savepartial&&win.input&&win.input.type=='line'&&win.inputel&&win.inputel.value){var partial=res.partial;if(!partial){partial={};res.partial=partial;};partial[win.id]=win.inputel.value;}});}
game_interface.accept(res);}
function evhan_doc_resize(ev){if(resize_timer!=null){window.clearTimeout(resize_timer);resize_timer=null;}
resize_timer=doc_resize_real.delay(0.5);}
function doc_resize_real(){resize_timer=null;if(disabled){resize_timer=doc_resize_real.delay(0.5);return;}
current_metrics=measure_window();send_response('arrange',null,current_metrics);}
function evhan_doc_keypress(ev){if(disabled){return;}
var keycode=0;if(Prototype.Browser.IE){ev=Event.extend(window.event);if(ev)keycode=ev.keyCode;}
else{if(ev)keycode=ev.which;}
if(ev.target.tagName.toUpperCase()=='INPUT'){return;}
if(ev.altKey||ev.metaKey||ev.ctrlKey){return;}
if(Prototype.Browser.Opera){if(!keycode)
return;if(keycode<32&&keycode!=13)
return;}
var win;if(windows_paging_count){win=windowdic.get(last_known_paging);if(win){if(!((keycode>=32&&keycode<=126)||keycode==13)){return;}
ev.preventDefault();var frameel=win.frameel;frameel.scrollTop=win.topunseen-current_metrics.buffercharheight;var frameheight=frameel.getHeight();var realbottom=last_line_top_offset(frameel);var newtopunseen=frameel.scrollTop+frameheight;if(newtopunseen>realbottom)
newtopunseen=realbottom;if(win.topunseen<newtopunseen)
win.topunseen=newtopunseen;if(win.needspaging){if(frameel.scrollTop+frameheight>=frameel.scrollHeight){win.needspaging=false;var moreel=$('win'+win.id+'_moreprompt');if(moreel)
moreel.remove();readjust_paging_focus(true);}}
return;}}
win=windowdic.get(last_known_focus);if(!win)
return;if(!win.inputel)
return;win.inputel.focus();if(win.input.type=='line'){if(keycode==13){submit_line_input(win,win.inputel,null);ev.preventDefault();return;}
if(keycode){if(keycode>=32){var val=String.fromCharCode(keycode);win.inputel.value=win.inputel.value+val;}
ev.preventDefault();return;}}
else{var res=null;if(keycode==13)
res='return';else if(keycode==Event.KEY_BACKSPACE)
res='delete';else if(keycode)
res=String.fromCharCode(keycode);if(res){send_response('char',win,res);}
ev.preventDefault();return;}}
function evhan_window_mousedown(ev,frameel){if(!frameel.winid)
return;var win=windowdic.get(frameel.winid);if(!win)
return;if(win.inputel){last_known_focus=win.id;if(Prototype.Browser.MobileSafari){ev.stop();win.inputel.focus();}}
if(win.needspaging)
last_known_paging=win.id;else if(win.inputel)
last_known_paging=0;}
function evhan_input_char_keydown(ev){var keycode=0;if(!ev){ev=Event.extend(window.event);}
if(ev)keycode=ev.keyCode;if(!keycode)return true;var res=null;switch(keycode){case Event.KEY_LEFT:res='left';break;case Event.KEY_RIGHT:res='right';break;case Event.KEY_UP:res='up';break;case Event.KEY_DOWN:res='down';break;case Event.KEY_BACKSPACE:res='delete';break;case Event.KEY_ESC:res='escape';break;case Event.KEY_TAB:res='tab';break;case Event.KEY_PAGEUP:res='pageup';break;case Event.KEY_PAGEDOWN:res='pagedown';break;case Event.KEY_HOME:res='home';break;case Event.KEY_END:res='end';break;case 112:res='func1';break;case 113:res='func2';break;case 114:res='func3';break;case 115:res='func4';break;case 116:res='func5';break;case 117:res='func6';break;case 118:res='func7';break;case 119:res='func8';break;case 120:res='func9';break;case 121:res='func10';break;case 122:res='func11';break;case 123:res='func12';break;}
if(res){if(!this.winid)
return true;var win=windowdic.get(this.winid);if(!win||!win.input)
return true;send_response('char',win,res);return false;}
return true;}
function evhan_input_char_keypress(ev){var keycode=0;if(!ev){ev=Event.extend(window.event);if(ev)keycode=ev.keyCode;}
else{if(ev)keycode=ev.which;}
if(!keycode)return false;if(keycode==10&&Prototype.Browser.MobileSafari){keycode=13;}
var res;if(keycode==13)
res='return';else
res=String.fromCharCode(keycode);if(!this.winid)
return true;var win=windowdic.get(this.winid);if(!win||!win.input)
return true;send_response('char',win,res);return false;}
function evhan_input_keydown(ev){var keycode=0;if(!ev){ev=Event.extend(window.event);}
if(ev)keycode=ev.keyCode;if(!keycode)return true;if(keycode==Event.KEY_UP||keycode==Event.KEY_DOWN){if(!this.winid)
return true;var win=windowdic.get(this.winid);if(!win||!win.input)
return true;if(keycode==Event.KEY_UP&&win.historypos>0){win.historypos-=1;if(win.historypos<win.history.length)
this.value=win.history[win.historypos];else
this.value='';}
if(keycode==Event.KEY_DOWN&&win.historypos<win.history.length){win.historypos+=1;if(win.historypos<win.history.length)
this.value=win.history[win.historypos];else
this.value='';}
return false;}
else if(terminator_key_values[keycode]){if(!this.winid)
return true;var win=windowdic.get(this.winid);if(!win||!win.input)
return true;if(win.terminators[terminator_key_values[keycode]]){submit_line_input(win,win.inputel,terminator_key_values[keycode]);return false;}}
return true;}
function evhan_input_keypress(ev){var keycode=0;if(!ev){ev=Event.extend(window.event);if(ev)keycode=ev.keyCode;}
else{if(ev)keycode=ev.which;}
if(!keycode)return true;if(keycode==10&&Prototype.Browser.MobileSafari){keycode=13;}
if(keycode==13){if(!this.winid)
return true;var win=windowdic.get(this.winid);if(!win||!win.input)
return true;submit_line_input(win,this,null);return false;}
return true;}
function evhan_input_focus(winid){var win=windowdic.get(winid);if(!win)
return;currently_focussed=true;last_known_focus=winid;last_known_paging=winid;}
function evhan_input_blur(winid){var win=windowdic.get(winid);if(!win)
return;currently_focussed=false;}
function evhan_window_scroll(frameel){if(!frameel.winid)
return;var win=windowdic.get(frameel.winid);if(!win)
return;if(!win.needspaging)
return;var frameheight=frameel.getHeight();var realbottom=last_line_top_offset(frameel);var newtopunseen=frameel.scrollTop+frameheight;if(newtopunseen>realbottom)
newtopunseen=realbottom;if(win.topunseen<newtopunseen)
win.topunseen=newtopunseen;if(frameel.scrollTop+frameheight>=frameel.scrollHeight){win.needspaging=false;var moreel=$('win'+win.id+'_moreprompt');if(moreel)
moreel.remove();readjust_paging_focus(true);return;}}
function build_evhan_hyperlink(winid,linkval){return function(){var win=windowdic.get(winid);if(!win)
return false;if(!win.reqhyperlink)
return false;send_response('hyperlink',win,linkval);return false;};}
return{version:'1.3.1',init:glkote_init,update:glkote_update,extevent:glkote_extevent,getinterface:glkote_get_interface,log:glkote_log,error:glkote_error};}();Dialog=function(){var dialog_el_id='dialog';var is_open=false;var dialog_callback=null;var will_save;var confirming;var editing;var editing_dirent;var cur_usage;var cur_usage_name;var cur_gameid;var cur_filelist;function dialog_open(tosave,usage,gameid,callback){if(is_open)
throw'Dialog: dialog box is already open.';if(localStorage==null)
throw'Dialog: your browser does not support local storage.';dialog_callback=callback;will_save=tosave;confirming=false;editing=false;editing_dirent=null;cur_usage=usage;cur_gameid=gameid;cur_usage_name=label_for_usage(cur_usage);var root_el_id='windowport';var iface=window.Game;if(window.GlkOte)
iface=window.GlkOte.getinterface();if(iface&&iface.windowport)
root_el_id=iface.windowport;var rootel=$(root_el_id);if(!rootel)
throw'Dialog: unable to find root element #'+root_el_id+'.';var screen=$(dialog_el_id+'_screen');if(!screen){screen=new Element('div',{id:dialog_el_id+'_screen'});rootel.insert(screen);}
var frame=$(dialog_el_id+'_frame');if(!frame){frame=new Element('div',{id:dialog_el_id+'_frame'});rootel.insert(frame);}
var dia=$(dialog_el_id);if(dia)
dia.remove();dia=new Element('div',{id:dialog_el_id});var form,el,row;form=new Element('form');form.observe('submit',(will_save?evhan_accept_save_button:evhan_accept_load_button));dia.insert(form);row=new Element('div',{'class':'DiaButtonsFloat'});el=new Element('button',{id:dialog_el_id+'_edit',type:'button'});insert_text(el,'Edit');el.observe('click',evhan_edit_button);row.insert(el);form.insert(row);row=new Element('div',{id:dialog_el_id+'_cap','class':'DiaCaption'});insert_text(row,'XXX');form.insert(row);if(will_save){row=new Element('div',{id:dialog_el_id+'_input','class':'DiaInput'});form.insert(row);el=new Element('input',{id:dialog_el_id+'_infield',type:'text',name:'filename'});row.insert(el);}
row=new Element('div',{id:dialog_el_id+'_body','class':'DiaBody'});form.insert(row);row=new Element('div',{id:dialog_el_id+'_cap2','class':'DiaCaption'});row.hide();form.insert(row);row=new Element('div',{id:dialog_el_id+'_buttonrow','class':'DiaButtons'});{el=new Element('button',{id:dialog_el_id+'_cancel',type:'button'});insert_text(el,'Cancel');el.observe('click',evhan_cancel_button);row.insert(el);el=new Element('button',{id:dialog_el_id+'_delete',type:'button'});insert_text(el,'Delete');el.observe('click',evhan_delete_button);el.hide();row.insert(el);el=new Element('button',{id:dialog_el_id+'_display',type:'button'});insert_text(el,'Display');el.observe('click',evhan_display_button);el.hide();row.insert(el);el=new Element('button',{id:dialog_el_id+'_accept',type:'submit'});insert_text(el,(will_save?'Save':'Load'));el.observe('click',(will_save?evhan_accept_save_button:evhan_accept_load_button));row.insert(el);}
form.insert(row);frame.insert(dia);is_open=true;evhan_storage_changed();var focusfunc;if(will_save){focusfunc=function(){var el=$(dialog_el_id+'_infield');if(el)
el.focus();};}
else{focusfunc=function(){var el=$(dialog_el_id+'_select');if(el)
el.focus();};}
focusfunc.defer();}
function dialog_close(){var dia=$(dialog_el_id);if(dia)
dia.remove();var frame=$(dialog_el_id+'_frame');if(frame)
frame.remove();var screen=$(dialog_el_id+'_screen');if(screen)
screen.remove();is_open=false;dialog_callback=null;cur_filelist=null;editing=false;editing_dirent=null;}
function set_caption(msg,isupper){var elid=(isupper?dialog_el_id+'_cap':dialog_el_id+'_cap2');var el=$(elid);if(!el)
return;if(!msg){el.hide();}
else{remove_children(el);insert_text(el,msg);el.show();}}
function label_for_usage(val){switch(val){case'data':return'data file';case'save':return'save file';case'transcript':return'transcript';case'command':return'command script';default:return'file';}}
function usage_is_textual(val){return(val=='transcript'||val=='command');}
function insert_text(el,val){var nod=document.createTextNode(val);el.appendChild(nod);}
function remove_children(parent){var obj,ls;ls=parent.childNodes;while(ls.length>0){obj=ls.item(0);parent.removeChild(obj);}}
function replace_text(el,val){remove_children(el);insert_text(el,val);}
function evhan_select_change(){if(!is_open)
return false;if(confirming)
return false;var selel=$(dialog_el_id+'_select');if(!selel)
return false;var pos=selel.selectedIndex;if(!cur_filelist||pos<0||pos>=cur_filelist.length)
return false;var file=cur_filelist[pos];var fel=$(dialog_el_id+'_infield');if(!fel)
return false;fel.value=file.dirent.filename;return false;}
function evhan_select_change_editing(){if(!is_open)
return false;if(!editing||editing_dirent)
return false;var selel=$(dialog_el_id+'_select');if(!selel)
return false;var pos=selel.selectedIndex;if(!cur_filelist||pos<0||pos>=cur_filelist.length)
return false;var file=cur_filelist[pos];if(!file.dirent||!file_ref_exists(file.dirent))
return false;butel=$(dialog_el_id+'_delete');butel.disabled=false;butel=$(dialog_el_id+'_display');butel.disabled=!usage_is_textual(file.dirent.usage);}
function evhan_accept_load_button(ev){ev.stop();if(!is_open)
return false;if(editing)
return false;var selel=$(dialog_el_id+'_select');if(!selel)
return false;var pos=selel.selectedIndex;if(!cur_filelist||pos<0||pos>=cur_filelist.length)
return false;var file=cur_filelist[pos];if(!file.dirent||!file_ref_exists(file.dirent))
return false;var callback=dialog_callback;dialog_close();if(callback)
callback(file.dirent);return false;}
function evhan_accept_save_button(ev){ev.stop();if(!is_open)
return false;if(editing)
return false;var fel=$(dialog_el_id+'_infield');if(!fel)
return false;var filename=fel.value;filename=filename.strip();if(!filename)
return false;var dirent=file_construct_ref(filename,cur_usage,cur_gameid);if(file_ref_exists(dirent)&&!confirming){confirming=true;set_caption('You already have a '+cur_usage_name+' "'
+dirent.filename+'". Do you want to replace it?',false);fel.disabled=true;var butel=$(dialog_el_id+'_accept');replace_text(butel,'Replace');return false;}
var callback=dialog_callback;dialog_close();if(callback)
callback(dirent);return false;}
function evhan_edit_button(ev){ev.stop();if(!is_open)
return false;if(!editing){editing=true;editing_dirent=null;if(confirming){confirming=false;set_caption(null,false);var fel=$(dialog_el_id+'_infield');fel.disabled=false;var butel=$(dialog_el_id+'_accept');butel.disabled=false;replace_text(butel,'Save');}
var fel=$(dialog_el_id+'_input');if(fel){fel.hide();}
var butel=$(dialog_el_id+'_edit');replace_text(butel,'Done');butel=$(dialog_el_id+'_delete');butel.show();butel=$(dialog_el_id+'_display');butel.show();butel=$(dialog_el_id+'_accept');butel.hide();evhan_storage_changed();return false;}
else if(!editing_dirent){editing=false;editing_dirent=null;var fel=$(dialog_el_id+'_input');if(fel){fel.show();}
var butel=$(dialog_el_id+'_edit');replace_text(butel,'Edit');butel=$(dialog_el_id+'_delete');butel.hide();butel=$(dialog_el_id+'_display');butel.hide();butel=$(dialog_el_id+'_accept');butel.show();evhan_storage_changed();return false;}
else{editing=true;editing_dirent=null;$(dialog_el_id+'_buttonrow').show();var butel=$(dialog_el_id+'_edit');replace_text(butel,'Done');evhan_storage_changed();return false;}}
function evhan_delete_button(ev){ev.stop();if(!is_open)
return false;if(!editing||editing_dirent)
return false;var selel=$(dialog_el_id+'_select');if(!selel)
return false;var pos=selel.selectedIndex;if(!cur_filelist||pos<0||pos>=cur_filelist.length)
return false;var file=cur_filelist[pos];if(!file.dirent)
return false;file_remove_ref(file.dirent);evhan_storage_changed();return false;}
function evhan_display_button(ev){ev.stop();if(!is_open)
return false;if(!editing||editing_dirent)
return false;var selel=$(dialog_el_id+'_select');if(!selel)
return false;var pos=selel.selectedIndex;if(!cur_filelist||pos<0||pos>=cur_filelist.length)
return false;var file=cur_filelist[pos];if(!file.dirent||!file_ref_exists(file.dirent))
return false;$(dialog_el_id+'_buttonrow').hide();var butel=$(dialog_el_id+'_edit');replace_text(butel,'Close');editing_dirent=file.dirent;evhan_storage_changed();return false;}
function evhan_cancel_button(ev){ev.stop();if(!is_open)
return false;if(confirming){confirming=false;set_caption(null,false);var fel=$(dialog_el_id+'_infield');fel.disabled=false;var butel=$(dialog_el_id+'_accept');butel.disabled=false;replace_text(butel,'Save');return false;}
var callback=dialog_callback;dialog_close();if(callback)
callback(null);return false;}
function evhan_storage_changed(ev){if(!is_open)
return false;var el,bodyel,ls,lastusage;var changedkey=null;if(ev)
changedkey=ev.key;bodyel=$(dialog_el_id+'_body');if(!bodyel)
return false;if(editing&&editing_dirent){if(!file_ref_exists(editing_dirent)){editing_dirent=null;$(dialog_el_id+'_buttonrow').show();var butel=$(dialog_el_id+'_edit');replace_text(butel,'Done');}}
if(editing&&editing_dirent){remove_children(bodyel);var dat=file_read(editing_dirent);dat=String.fromCharCode.apply(this,dat);var textel=new Element('div',{'class':'DiaDisplayText'});var nod=document.createTextNode(dat);textel.appendChild(nod);bodyel.insert(textel);set_caption('Displaying file contents...',true);return false;}
if(editing){ls=files_list(null,cur_gameid);if(cur_gameid!=''){ls=ls.concat(files_list(null,''));}
ls.sort(function(f1,f2){if(f1.dirent.usage!=f2.dirent.usage)
return(f1.dirent.usage<f2.dirent.usage);return f2.modified.getTime()-f1.modified.getTime();});if(ls.length==0){remove_children(bodyel);butel=$(dialog_el_id+'_delete');butel.disabled=true;butel=$(dialog_el_id+'_display');butel.disabled=true;set_caption('You have no stored files. Press Done to continue.',true);return false;}
cur_filelist=[];lastusage='';for(ix=0;ix<ls.length;ix++){file=ls[ix];if(file.dirent.usage!=lastusage){lastusage=file.dirent.usage;cur_filelist.push({label:lastusage});}
cur_filelist.push(file);}
ls=cur_filelist;remove_children(bodyel);var selel=new Element('select',{id:dialog_el_id+'_select',name:'files',size:'5'});var ix,file,datestr;var anyselected=false;for(ix=0;ix<ls.length;ix++){file=ls[ix];if(!file.dirent){el=new Element('option',{name:'f'+ix});el.disabled=true;insert_text(el,'-- '+label_for_usage(file.label)+'s --');selel.insert(el);continue;}
el=new Element('option',{name:'f'+ix});if(!anyselected){anyselected=true;el.selected=true;}
datestr=format_date(file.modified);insert_text(el,file.dirent.filename+' -- '+datestr);selel.insert(el);}
bodyel.insert(selel);selel.onchange=evhan_select_change_editing;evhan_select_change_editing();set_caption('All stored files are now visible. You may delete them, and display files containing text. Press Done when finished.',true);return false;}
ls=files_list(cur_usage,cur_gameid);ls.sort(function(f1,f2){return f2.modified.getTime()-f1.modified.getTime();});cur_filelist=ls;if(ls.length==0){remove_children(bodyel);}
else{remove_children(bodyel);var selel=new Element('select',{id:dialog_el_id+'_select',name:'files',size:'5'});var ix,file,datestr;for(ix=0;ix<ls.length;ix++){file=ls[ix];el=new Element('option',{name:'f'+ix});if(ix==0)
el.selected=true;datestr=format_date(file.modified);insert_text(el,file.dirent.filename+' -- '+datestr);selel.insert(el);}
bodyel.insert(selel);if(will_save)
selel.onchange=evhan_select_change;}
if(will_save){set_caption('Name this '+cur_usage_name+'.',true);el=$(dialog_el_id+'_accept');el.disabled=false;}
else{if(ls.length==0){set_caption('You have no '+cur_usage_name+'s for this game.',true);el=$(dialog_el_id+'_accept');el.disabled=true;}
else{set_caption('Select a '+cur_usage_name+' to load.',true);el=$(dialog_el_id+'_accept');el.disabled=false;}}}
function file_construct_ref(filename,usage,gameid){if(!filename)
filename='';if(!usage)
useage='';if(!gameid)
gameid='';var key=usage+':'+gameid+':'+filename;var ref={dirent:'dirent:'+key,content:'content:'+key,filename:filename,usage:usage,gameid:gameid};return ref;}
function file_decode_ref(dirkey){if(!dirkey.startsWith('dirent:'))
return null;var oldpos=7;var pos=dirkey.indexOf(':',oldpos);if(pos<0)
return null;var usage=dirkey.slice(oldpos,pos);oldpos=pos+1;pos=dirkey.indexOf(':',oldpos);if(pos<0)
return null;var gameid=dirkey.slice(oldpos,pos);oldpos=pos+1;var filename=dirkey.slice(oldpos);var conkey='cont'+dirkey.slice(3);var ref={dirent:dirkey,content:conkey,filename:filename,usage:usage,gameid:gameid};return ref;}
function file_load_dirent(dirent){if(typeof(dirent)!='object'){dirent=file_decode_ref(dirent);if(!dirent)
return null;}
var statstring=localStorage.getItem(dirent.dirent);if(!statstring)
return null;var file={dirent:dirent};var ix,pos,key,val;var ls=statstring.toString().split(',');for(ix=0;ix<ls.length;ix++){val=ls[ix];pos=val.indexOf(':');if(pos<0)
continue;key=val.slice(0,pos);val=val.slice(pos+1);switch(key){case'created':file.created=new Date(Number(val));break;case'modified':file.modified=new Date(Number(val));break;}}
return file;}
function file_ref_exists(ref){var statstring=localStorage.getItem(ref.dirent);if(!statstring)
return false;else
return true;}
function file_remove_ref(ref){localStorage.removeItem(ref.dirent);localStorage.removeItem(ref.content);}
function file_write(dirent,content,israw){var val,ls;var file=file_load_dirent(dirent);if(!file){file={dirent:dirent,created:new Date()};}
file.modified=new Date();if(!israw)
content=encode_array(content);ls=[];if(file.created)
ls.push('created:'+file.created.getTime());if(file.modified)
ls.push('modified:'+file.modified.getTime());val=ls.join(',');localStorage.setItem(file.dirent.dirent,val);localStorage.setItem(file.dirent.content,content);return true;}
function file_read(dirent,israw){var file=file_load_dirent(dirent);if(!file)
return null;var content=localStorage.getItem(dirent.content);if(content==null)
return null;content=content.toString();if(!content){if(israw)
return'';else
return[];}
if(israw)
return content;else
return decode_array(content);}
function file_ref_matches(ref,usage,gameid){if(usage!=null){if(ref.usage!=usage)
return false;}
if(gameid!=null){if(ref.gameid!=gameid)
return false;}
return true;}
function files_list(usage,gameid){var ix;var ls=[];if(!localStorage)
return ls;for(ix=0;ix<localStorage.length;ix++){var key=localStorage.key(ix);if(!key)
continue;var dirent=file_decode_ref(key.toString());if(!dirent)
continue;if(!file_ref_matches(dirent,usage,gameid))
continue;var file=file_load_dirent(dirent);ls.push(file);}
return ls;}
function format_date(date){if(!date)
return'???';var day=(date.getMonth()+1)+'/'+date.getDate();var time=date.getHours()+':'+(date.getMinutes()<10?'0':'')+date.getMinutes();return day+' '+time;}
if(window.JSON){function encode_array(arr){var res=JSON.stringify(arr);var len=res.length;if(res[0]=='"'&&res[len-1]=='"')
res=res.slice(1,len-1);return res;}
function decode_array(val){return JSON.parse(val);}}
else{function encode_array(arr){return'['+arr+']';}
function decode_array(val){return eval(val);}}
var localStorage=null;try{if(window.localStorage!=null){localStorage=window.localStorage;}
else if(window.globalStorage!=null){localStorage=window.globalStorage[location.hostname];}}
catch(ex){}
if(localStorage==null){localStorage={data:{},keys:[],length:0,getItem:function(key){return localStorage.data[key];},setItem:function(key,val){if(localStorage.keys.indexOf(key)<0){localStorage.keys.push(key);localStorage.length=localStorage.keys.length;}
localStorage.data[key]=val;},removeItem:function(key){if(localStorage.keys.indexOf(key)>=0){localStorage.keys=localStorage.keys.without(key);localStorage.length=localStorage.keys.length;delete localStorage.data[key];}},key:function(index){return localStorage.keys[index];},clear:function(){localStorage.data={};localStorage.keys=[];localStorage.length=0;}}}
Event.observe(window,'storage',evhan_storage_changed);return{open:dialog_open,file_construct_ref:file_construct_ref,file_ref_exists:file_ref_exists,file_remove_ref:file_remove_ref,file_write:file_write,file_read:file_read};}();Glk=function(){var VM=null;var has_exited=false;var ui_disabled=false;var ui_specialinput=null;var ui_specialcallback=null;var event_generation=0;var current_partial_inputs=null;var current_partial_outputs=null;function init(vm_options){VM=vm_options.vm;if(window.GiDispa)
GiDispa.set_vm(VM);vm_options.accept=accept_ui_event;GlkOte.init(vm_options);}
function accept_ui_event(obj){var box;if(ui_disabled){qlog("### ui is disabled, ignoring event");return;}
if(obj.gen!=event_generation){GlkOte.log('Input event had wrong generation number: got '+obj.gen+', currently at '+event_generation);return;}
event_generation+=1;current_partial_inputs=obj.partial;switch(obj.type){case'init':content_metrics=obj.metrics;VM.init();break;case'external':if(obj.value=='timer'){handle_timer_input();}
break;case'hyperlink':handle_hyperlink_input(obj.window,obj.value);break;case'char':handle_char_input(obj.window,obj.value);break;case'line':handle_line_input(obj.window,obj.value,obj.terminator);break;case'arrange':content_metrics=obj.metrics;box={left:content_metrics.outspacingx,top:content_metrics.outspacingy,right:content_metrics.width-content_metrics.outspacingx,bottom:content_metrics.height-content_metrics.outspacingy};if(gli_rootwin)
gli_window_rearrange(gli_rootwin,box);handle_arrange_input();break;case'specialresponse':if(obj.response=='fileref_prompt'){gli_fileref_create_by_prompt_callback(obj);}
break;}}
function handle_arrange_input(){if(!gli_selectref)
return;gli_selectref.set_field(0,Const.evtype_Arrange);gli_selectref.set_field(1,null);gli_selectref.set_field(2,0);gli_selectref.set_field(3,0);if(window.GiDispa)
GiDispa.prepare_resume(gli_selectref);gli_selectref=null;VM.resume();}
function handle_timer_input(){if(!gli_selectref)
return;gli_selectref.set_field(0,Const.evtype_Timer);gli_selectref.set_field(1,null);gli_selectref.set_field(2,0);gli_selectref.set_field(3,0);if(window.GiDispa)
GiDispa.prepare_resume(gli_selectref);gli_selectref=null;VM.resume();}
function handle_hyperlink_input(disprock,val){if(!gli_selectref)
return;var win=null;for(win=gli_windowlist;win;win=win.next){if(win.disprock==disprock)
break;}
if(!win||!win.hyperlink_request)
return;gli_selectref.set_field(0,Const.evtype_Hyperlink);gli_selectref.set_field(1,win);gli_selectref.set_field(2,val);gli_selectref.set_field(3,0);win.hyperlink_request=false;if(window.GiDispa)
GiDispa.prepare_resume(gli_selectref);gli_selectref=null;VM.resume();}
function handle_char_input(disprock,input){var charval;if(!gli_selectref)
return;var win=null;for(win=gli_windowlist;win;win=win.next){if(win.disprock==disprock)
break;}
if(!win||!win.char_request)
return;if(input.length==1){charval=input.charCodeAt(0);if(!win.char_request_uni)
charval=charval&0xFF;}
else{charval=KeystrokeNameMap[input];if(!charval)
charval=Const.keycode_Unknown;}
gli_selectref.set_field(0,Const.evtype_CharInput);gli_selectref.set_field(1,win);gli_selectref.set_field(2,charval);gli_selectref.set_field(3,0);win.char_request=false;win.char_request_uni=false;win.input_generation=null;if(window.GiDispa)
GiDispa.prepare_resume(gli_selectref);gli_selectref=null;VM.resume();}
function handle_line_input(disprock,input,termkey){var ix;if(!gli_selectref)
return;var win=null;for(win=gli_windowlist;win;win=win.next){if(win.disprock==disprock)
break;}
if(!win||!win.line_request)
return;if(input.length>win.linebuf.length)
input=input.slice(0,win.linebuf.length);if(win.request_echo_line_input){ix=win.style;gli_set_style(win.str,Const.style_Input);gli_window_put_string(win,input);if(win.echostr)
glk_put_jstring_stream(win.echostr,input);gli_set_style(win.str,ix);gli_window_put_string(win,"\n");if(win.echostr)
glk_put_jstring_stream(win.echostr,"\n");}
for(ix=0;ix<input.length;ix++)
win.linebuf[ix]=input.charCodeAt(ix);var termcode=0;if(termkey&&KeystrokeNameMap[termkey])
termcode=KeystrokeNameMap[termkey];gli_selectref.set_field(0,Const.evtype_LineInput);gli_selectref.set_field(1,win);gli_selectref.set_field(2,input.length);gli_selectref.set_field(3,termcode);if(window.GiDispa)
GiDispa.unretain_array(win.linebuf);win.line_request=false;win.line_request_uni=false;win.request_echo_line_input=null;win.input_generation=null;win.linebuf=null;if(window.GiDispa)
GiDispa.prepare_resume(gli_selectref);gli_selectref=null;VM.resume();}
function update(){var dataobj={type:'update',gen:event_generation};var winarray=null;var contentarray=null;var inputarray=null;var win,obj,robj,useobj,lineobj,ls,val,ix,cx;var initial,lastpos,laststyle,lasthyperlink;if(geometry_changed){geometry_changed=false;winarray=[];for(win=gli_windowlist;win;win=win.next){if(win.type==Const.wintype_Pair)
continue;obj={id:win.disprock,rock:win.rock};winarray.push(obj);switch(win.type){case Const.wintype_TextBuffer:obj.type='buffer';break;case Const.wintype_TextGrid:obj.type='grid';obj.gridwidth=win.gridwidth;obj.gridheight=win.gridheight;break;}
obj.left=win.bbox.left;obj.top=win.bbox.top;obj.width=win.bbox.right-win.bbox.left;obj.height=win.bbox.bottom-win.bbox.top;}}
for(win=gli_windowlist;win;win=win.next){useobj=false;obj={id:win.disprock};if(contentarray==null)
contentarray=[];switch(win.type){case Const.wintype_TextBuffer:gli_window_buffer_deaccumulate(win);if(win.content.length){obj.text=win.content.slice(0);win.content.length=0;useobj=true;}
if(win.clearcontent){obj.clear=true;win.clearcontent=false;useobj=true;if(!obj.text){obj.text=[];}}
break;case Const.wintype_TextGrid:if(win.gridwidth==0||win.gridheight==0)
break;obj.lines=[];for(ix=0;ix<win.gridheight;ix++){lineobj=win.lines[ix];if(!lineobj.dirty)
continue;lineobj.dirty=false;ls=[];lastpos=0;for(cx=0;cx<win.gridwidth;){laststyle=lineobj.styles[cx];lasthyperlink=lineobj.hyperlinks[cx];for(;cx<win.gridwidth&&lineobj.styles[cx]==laststyle&&lineobj.hyperlinks[cx]==lasthyperlink;cx++){}
if(lastpos<cx){if(!lasthyperlink){ls.push(StyleNameMap[laststyle]);ls.push(lineobj.chars.slice(lastpos,cx).join(''));}
else{robj={style:StyleNameMap[laststyle],text:lineobj.chars.slice(lastpos,cx).join(''),hyperlink:lasthyperlink};ls.push(robj);}
lastpos=cx;}}
obj.lines.push({line:ix,content:ls});}
useobj=obj.lines.length;break;}
if(useobj)
contentarray.push(obj);}
inputarray=[];for(win=gli_windowlist;win;win=win.next){obj=null;if(win.char_request){obj={id:win.disprock,type:'char',gen:win.input_generation};if(win.type==Const.wintype_TextGrid){if(gli_window_grid_canonicalize(win)){obj.xpos=win.gridwidth;obj.ypos=win.gridheight-1;}
else{obj.xpos=win.cursorx;obj.ypos=win.cursory;}}}
if(win.line_request){initial='';if(current_partial_outputs){val=current_partial_outputs[win.disprock];if(val)
initial=val;}
obj={id:win.disprock,type:'line',gen:win.input_generation,maxlen:win.linebuf.length,initial:initial};if(win.line_input_terminators.length){obj.terminators=win.line_input_terminators;}
if(win.type==Const.wintype_TextGrid){if(gli_window_grid_canonicalize(win)){obj.xpos=win.gridwidth;obj.ypos=win.gridheight-1;}
else{obj.xpos=win.cursorx;obj.ypos=win.cursory;}}}
if(win.hyperlink_request){if(!obj)
obj={id:win.disprock};obj.hyperlink=true;}
if(obj)
inputarray.push(obj);}
dataobj.windows=winarray;dataobj.content=contentarray;dataobj.input=inputarray;if(ui_specialinput){dataobj.specialinput=ui_specialinput;}
if(ui_disabled){dataobj.disable=true;}
current_partial_outputs=null;GlkOte.update(dataobj);}
function fatal_error(msg){has_exited=true;ui_disabled=true;GlkOte.error(msg);var dataobj={type:'update',gen:event_generation,disable:true};dataobj.input=[];GlkOte.update(dataobj);}
var Const={gestalt_Version:0,gestalt_CharInput:1,gestalt_LineInput:2,gestalt_CharOutput:3,gestalt_CharOutput_CannotPrint:0,gestalt_CharOutput_ApproxPrint:1,gestalt_CharOutput_ExactPrint:2,gestalt_MouseInput:4,gestalt_Timer:5,gestalt_Graphics:6,gestalt_DrawImage:7,gestalt_Sound:8,gestalt_SoundVolume:9,gestalt_SoundNotify:10,gestalt_Hyperlinks:11,gestalt_HyperlinkInput:12,gestalt_SoundMusic:13,gestalt_GraphicsTransparency:14,gestalt_Unicode:15,gestalt_UnicodeNorm:16,gestalt_LineInputEcho:17,gestalt_LineTerminators:18,gestalt_LineTerminatorKey:19,gestalt_DateTime:20,gestalt_Sound2:21,gestalt_ResourceStream:22,keycode_Unknown:0xffffffff,keycode_Left:0xfffffffe,keycode_Right:0xfffffffd,keycode_Up:0xfffffffc,keycode_Down:0xfffffffb,keycode_Return:0xfffffffa,keycode_Delete:0xfffffff9,keycode_Escape:0xfffffff8,keycode_Tab:0xfffffff7,keycode_PageUp:0xfffffff6,keycode_PageDown:0xfffffff5,keycode_Home:0xfffffff4,keycode_End:0xfffffff3,keycode_Func1:0xffffffef,keycode_Func2:0xffffffee,keycode_Func3:0xffffffed,keycode_Func4:0xffffffec,keycode_Func5:0xffffffeb,keycode_Func6:0xffffffea,keycode_Func7:0xffffffe9,keycode_Func8:0xffffffe8,keycode_Func9:0xffffffe7,keycode_Func10:0xffffffe6,keycode_Func11:0xffffffe5,keycode_Func12:0xffffffe4,keycode_MAXVAL:28,evtype_None:0,evtype_Timer:1,evtype_CharInput:2,evtype_LineInput:3,evtype_MouseInput:4,evtype_Arrange:5,evtype_Redraw:6,evtype_SoundNotify:7,evtype_Hyperlink:8,evtype_VolumeNotify:9,style_Normal:0,style_Emphasized:1,style_Preformatted:2,style_Header:3,style_Subheader:4,style_Alert:5,style_Note:6,style_BlockQuote:7,style_Input:8,style_User1:9,style_User2:10,style_NUMSTYLES:11,wintype_AllTypes:0,wintype_Pair:1,wintype_Blank:2,wintype_TextBuffer:3,wintype_TextGrid:4,wintype_Graphics:5,winmethod_Left:0x00,winmethod_Right:0x01,winmethod_Above:0x02,winmethod_Below:0x03,winmethod_DirMask:0x0f,winmethod_Fixed:0x10,winmethod_Proportional:0x20,winmethod_DivisionMask:0xf0,winmethod_Border:0x000,winmethod_NoBorder:0x100,winmethod_BorderMask:0x100,fileusage_Data:0x00,fileusage_SavedGame:0x01,fileusage_Transcript:0x02,fileusage_InputRecord:0x03,fileusage_TypeMask:0x0f,fileusage_TextMode:0x100,fileusage_BinaryMode:0x000,filemode_Write:0x01,filemode_Read:0x02,filemode_ReadWrite:0x03,filemode_WriteAppend:0x05,seekmode_Start:0,seekmode_Current:1,seekmode_End:2,stylehint_Indentation:0,stylehint_ParaIndentation:1,stylehint_Justification:2,stylehint_Size:3,stylehint_Weight:4,stylehint_Oblique:5,stylehint_Proportional:6,stylehint_TextColor:7,stylehint_BackColor:8,stylehint_ReverseColor:9,stylehint_NUMHINTS:10,stylehint_just_LeftFlush:0,stylehint_just_LeftRight:1,stylehint_just_Centered:2,stylehint_just_RightFlush:3};var KeystrokeNameMap={left:Const.keycode_Left,right:Const.keycode_Right,up:Const.keycode_Up,down:Const.keycode_Down,'return':Const.keycode_Return,'delete':Const.keycode_Delete,escape:Const.keycode_Escape,tab:Const.keycode_Tab,pageup:Const.keycode_PageUp,pagedown:Const.keycode_PageDown,home:Const.keycode_Home,end:Const.keycode_End,func1:Const.keycode_Func1,func2:Const.keycode_Func2,func3:Const.keycode_Func3,func4:Const.keycode_Func4,func5:Const.keycode_Func5,func6:Const.keycode_Func6,func7:Const.keycode_Func7,func8:Const.keycode_Func8,func9:Const.keycode_Func9,func10:Const.keycode_Func10,func11:Const.keycode_Func11,func12:Const.keycode_Func12};var KeystrokeValueMap=null;var StyleNameMap={0:'normal',1:'emphasized',2:'preformatted',3:'header',4:'subheader',5:'alert',6:'note',7:'blockquote',8:'input',9:'user1',10:'user2'};var FileTypeMap={0:'data',1:'save',2:'transcript',3:'command'};var unicode_upper_table={181:924,223:[83,83],255:376,305:73,329:[700,78],383:83,405:502,414:544,447:503,454:452,457:455,460:458,477:398,496:[74,780],499:497,595:385,596:390,598:393,599:394,601:399,603:400,608:403,611:404,616:407,617:406,623:412,626:413,629:415,640:422,643:425,648:430,650:433,651:434,658:439,837:921,912:[921,776,769],940:902,941:904,942:905,943:906,944:[933,776,769],962:931,972:908,973:910,974:911,976:914,977:920,981:934,982:928,1008:922,1010:1017,1013:917,1415:[1333,1362],7830:[72,817],7831:[84,776],7832:[87,778],7833:[89,778],7834:[65,702],7835:7776,8016:[933,787],8018:[933,787,768],8020:[933,787,769],8022:[933,787,834],8048:8122,8049:8123,8050:8136,8051:8137,8052:8138,8053:8139,8054:8154,8055:8155,8056:8184,8057:8185,8058:8170,8059:8171,8060:8186,8061:8187,8064:[7944,921],8065:[7945,921],8066:[7946,921],8067:[7947,921],8068:[7948,921],8069:[7949,921],8070:[7950,921],8071:[7951,921],8072:[7944,921],8073:[7945,921],8074:[7946,921],8075:[7947,921],8076:[7948,921],8077:[7949,921],8078:[7950,921],8079:[7951,921],8080:[7976,921],8081:[7977,921],8082:[7978,921],8083:[7979,921],8084:[7980,921],8085:[7981,921],8086:[7982,921],8087:[7983,921],8088:[7976,921],8089:[7977,921],8090:[7978,921],8091:[7979,921],8092:[7980,921],8093:[7981,921],8094:[7982,921],8095:[7983,921],8096:[8040,921],8097:[8041,921],8098:[8042,921],8099:[8043,921],8100:[8044,921],8101:[8045,921],8102:[8046,921],8103:[8047,921],8104:[8040,921],8105:[8041,921],8106:[8042,921],8107:[8043,921],8108:[8044,921],8109:[8045,921],8110:[8046,921],8111:[8047,921],8114:[8122,921],8115:[913,921],8116:[902,921],8118:[913,834],8119:[913,834,921],8124:[913,921],8126:921,8130:[8138,921],8131:[919,921],8132:[905,921],8134:[919,834],8135:[919,834,921],8140:[919,921],8146:[921,776,768],8147:[921,776,769],8150:[921,834],8151:[921,776,834],8162:[933,776,768],8163:[933,776,769],8164:[929,787],8165:8172,8166:[933,834],8167:[933,776,834],8178:[8186,921],8179:[937,921],8180:[911,921],8182:[937,834],8183:[937,834,921],8188:[937,921],64256:[70,70],64257:[70,73],64258:[70,76],64259:[70,70,73],64260:[70,70,76],64261:[83,84],64262:[83,84],64275:[1348,1350],64276:[1348,1333],64277:[1348,1339],64278:[1358,1350],64279:[1348,1341]};(function(){var ls,ix,val;var map=unicode_upper_table;ls=[7936,7937,7938,7939,7940,7941,7942,7943,7952,7953,7954,7955,7956,7957,7968,7969,7970,7971,7972,7973,7974,7975,7984,7985,7986,7987,7988,7989,7990,7991,8000,8001,8002,8003,8004,8005,8017,8019,8021,8023,8032,8033,8034,8035,8036,8037,8038,8039,8112,8113,8144,8145,8160,8161,];for(ix=0;ix<54;ix++){val=ls[ix];map[val]=val+8;}
for(val=257;val<=303;val+=2){map[val]=val-1;}
for(val=331;val<=375;val+=2){map[val]=val-1;}
for(val=505;val<=543;val+=2){map[val]=val-1;}
for(val=1121;val<=1153;val+=2){map[val]=val-1;}
for(val=1163;val<=1215;val+=2){map[val]=val-1;}
for(val=1233;val<=1269;val+=2){map[val]=val-1;}
for(val=7681;val<=7829;val+=2){map[val]=val-1;}
for(val=7841;val<=7929;val+=2){map[val]=val-1;}
ls=[307,309,311,314,316,318,320,322,324,326,328,378,380,382,387,389,392,396,402,409,417,419,421,424,429,432,436,438,441,445,453,456,459,462,464,466,468,470,472,474,476,479,481,483,485,487,489,491,493,495,498,501,547,549,551,553,555,557,559,561,563,985,987,989,991,993,995,997,999,1001,1003,1005,1007,1016,1019,1218,1220,1222,1224,1226,1228,1230,1273,1281,1283,1285,1287,1289,1291,1293,1295,];for(ix=0;ix<91;ix++){val=ls[ix];map[val]=val-1;}
for(val=8560;val<=8575;val+=1){map[val]=val-16;}
for(val=9424;val<=9449;val+=1){map[val]=val-26;}
for(val=97;val<=122;val+=1){map[val]=val-32;}
for(val=224;val<=246;val+=1){map[val]=val-32;}
for(val=945;val<=961;val+=1){map[val]=val-32;}
for(val=1072;val<=1103;val+=1){map[val]=val-32;}
for(val=65345;val<=65370;val+=1){map[val]=val-32;}
ls=[248,249,250,251,252,253,254,963,964,965,966,967,968,969,970,971,];for(ix=0;ix<16;ix++){val=ls[ix];map[val]=val-32;}
for(val=66600;val<=66639;val+=1){map[val]=val-40;}
for(val=1377;val<=1414;val+=1){map[val]=val-48;}
for(val=1104;val<=1119;val+=1){map[val]=val-80;}
map[1009]=929;})();var unicode_lower_table={304:[105,775],376:255,385:595,390:596,393:598,394:599,398:477,399:601,400:603,403:608,404:611,406:617,407:616,412:623,413:626,415:629,422:640,425:643,430:648,433:650,434:651,439:658,452:454,455:457,458:460,497:499,502:405,503:447,544:414,902:940,904:941,905:942,906:943,908:972,910:973,911:974,1012:952,1017:1010,8122:8048,8123:8049,8124:8115,8136:8050,8137:8051,8138:8052,8139:8053,8140:8131,8154:8054,8155:8055,8170:8058,8171:8059,8172:8165,8184:8056,8185:8057,8186:8060,8187:8061,8188:8179,8486:969,8490:107,8491:229};(function(){var ls,ix,val;var map=unicode_lower_table;for(val=1024;val<=1039;val+=1){map[val]=val+80;}
for(val=1329;val<=1366;val+=1){map[val]=val+48;}
for(val=66560;val<=66599;val+=1){map[val]=val+40;}
for(val=65;val<=90;val+=1){map[val]=val+32;}
for(val=192;val<=214;val+=1){map[val]=val+32;}
for(val=913;val<=929;val+=1){map[val]=val+32;}
for(val=1040;val<=1071;val+=1){map[val]=val+32;}
for(val=65313;val<=65338;val+=1){map[val]=val+32;}
ls=[216,217,218,219,220,221,222,931,932,933,934,935,936,937,938,939,];for(ix=0;ix<16;ix++){val=ls[ix];map[val]=val+32;}
for(val=9398;val<=9423;val+=1){map[val]=val+26;}
for(val=8544;val<=8559;val+=1){map[val]=val+16;}
for(val=256;val<=302;val+=2){map[val]=val+1;}
for(val=330;val<=374;val+=2){map[val]=val+1;}
for(val=504;val<=542;val+=2){map[val]=val+1;}
for(val=1120;val<=1152;val+=2){map[val]=val+1;}
for(val=1162;val<=1214;val+=2){map[val]=val+1;}
for(val=1232;val<=1268;val+=2){map[val]=val+1;}
for(val=7680;val<=7828;val+=2){map[val]=val+1;}
for(val=7840;val<=7928;val+=2){map[val]=val+1;}
ls=[306,308,310,313,315,317,319,321,323,325,327,377,379,381,386,388,391,395,401,408,416,418,420,423,428,431,435,437,440,444,453,456,459,461,463,465,467,469,471,473,475,478,480,482,484,486,488,490,492,494,498,500,546,548,550,552,554,556,558,560,562,984,986,988,990,992,994,996,998,1000,1002,1004,1006,1015,1018,1217,1219,1221,1223,1225,1227,1229,1272,1280,1282,1284,1286,1288,1290,1292,1294,];for(ix=0;ix<91;ix++){val=ls[ix];map[val]=val+1;}
ls=[7944,7945,7946,7947,7948,7949,7950,7951,7960,7961,7962,7963,7964,7965,7976,7977,7978,7979,7980,7981,7982,7983,7992,7993,7994,7995,7996,7997,7998,7999,8008,8009,8010,8011,8012,8013,8025,8027,8029,8031,8040,8041,8042,8043,8044,8045,8046,8047,8072,8073,8074,8075,8076,8077,8078,8079,8088,8089,8090,8091,8092,8093,8094,8095,8104,8105,8106,8107,8108,8109,8110,8111,8120,8121,8152,8153,8168,8169,];for(ix=0;ix<78;ix++){val=ls[ix];map[val]=val-8;}})();var unicode_title_table={223:[83,115],452:453,453:453,454:453,455:456,456:456,457:456,458:459,459:459,460:459,497:498,498:498,499:498,1415:[1333,1410],8114:[8122,837],8115:8124,8116:[902,837],8119:[913,834,837],8124:8124,8130:[8138,837],8131:8140,8132:[905,837],8135:[919,834,837],8140:8140,8178:[8186,837],8179:8188,8180:[911,837],8183:[937,834,837],8188:8188,64256:[70,102],64257:[70,105],64258:[70,108],64259:[70,102,105],64260:[70,102,108],64261:[83,116],64262:[83,116],64275:[1348,1398],64276:[1348,1381],64277:[1348,1387],64278:[1358,1398],64279:[1348,1389]};(function(){var ls,ix,val;var map=unicode_title_table;ls=[8072,8073,8074,8075,8076,8077,8078,8079,8072,8073,8074,8075,8076,8077,8078,8079,8088,8089,8090,8091,8092,8093,8094,8095,8088,8089,8090,8091,8092,8093,8094,8095,8104,8105,8106,8107,8108,8109,8110,8111,8104,8105,8106,8107,8108,8109,8110,8111,];for(ix=0;ix<48;ix++){val=ls[ix];map[ix+8064]=val;}})();var unicode_decomp_table={192:[65,768],193:[65,769],194:[65,770],195:[65,771],196:[65,776],197:[65,778],199:[67,807],200:[69,768],201:[69,769],202:[69,770],203:[69,776],204:[73,768],205:[73,769],206:[73,770],207:[73,776],209:[78,771],210:[79,768],211:[79,769],212:[79,770],213:[79,771],214:[79,776],217:[85,768],218:[85,769],219:[85,770],220:[85,776],221:[89,769],224:[97,768],225:[97,769],226:[97,770],227:[97,771],228:[97,776],229:[97,778],231:[99,807],232:[101,768],233:[101,769],234:[101,770],235:[101,776],236:[105,768],237:[105,769],238:[105,770],239:[105,776],241:[110,771],242:[111,768],243:[111,769],244:[111,770],245:[111,771],246:[111,776],249:[117,768],250:[117,769],251:[117,770],252:[117,776],253:[121,769],296:[73,771],297:[105,771],298:[73,772],299:[105,772],300:[73,774],301:[105,774],302:[73,808],303:[105,808],304:[73,775],308:[74,770],309:[106,770],310:[75,807],311:[107,807],313:[76,769],314:[108,769],315:[76,807],316:[108,807],317:[76,780],318:[108,780],323:[78,769],324:[110,769],325:[78,807],326:[110,807],327:[78,780],328:[110,780],332:[79,772],333:[111,772],334:[79,774],335:[111,774],336:[79,779],337:[111,779],416:[79,795],417:[111,795],431:[85,795],432:[117,795],478:[65,776,772],479:[97,776,772],480:[65,775,772],481:[97,775,772],482:[198,772],483:[230,772],486:[71,780],487:[103,780],488:[75,780],489:[107,780],490:[79,808],491:[111,808],492:[79,808,772],493:[111,808,772],494:[439,780],495:[658,780],496:[106,780],500:[71,769],501:[103,769],542:[72,780],543:[104,780],550:[65,775],551:[97,775],552:[69,807],553:[101,807],554:[79,776,772],555:[111,776,772],556:[79,771,772],557:[111,771,772],558:[79,775],559:[111,775],560:[79,775,772],561:[111,775,772],562:[89,772],563:[121,772],832:768,833:769,835:787,836:[776,769],884:697,894:59,901:[168,769],902:[913,769],903:183,904:[917,769],905:[919,769],906:[921,769],908:[927,769],910:[933,769],911:[937,769],912:[953,776,769],938:[921,776],939:[933,776],940:[945,769],941:[949,769],942:[951,769],943:[953,769],944:[965,776,769],970:[953,776],971:[965,776],972:[959,769],973:[965,769],974:[969,769],979:[978,769],980:[978,776],1024:[1045,768],1025:[1045,776],1027:[1043,769],1031:[1030,776],1036:[1050,769],1037:[1048,768],1038:[1059,774],1049:[1048,774],1081:[1080,774],1104:[1077,768],1105:[1077,776],1107:[1075,769],1111:[1110,776],1116:[1082,769],1117:[1080,768],1118:[1091,774],1142:[1140,783],1143:[1141,783],1217:[1046,774],1218:[1078,774],1232:[1040,774],1233:[1072,774],1234:[1040,776],1235:[1072,776],1238:[1045,774],1239:[1077,774],1242:[1240,776],1243:[1241,776],1244:[1046,776],1245:[1078,776],1246:[1047,776],1247:[1079,776],1250:[1048,772],1251:[1080,772],1252:[1048,776],1253:[1080,776],1254:[1054,776],1255:[1086,776],1258:[1256,776],1259:[1257,776],1260:[1069,776],1261:[1101,776],1262:[1059,772],1263:[1091,772],1264:[1059,776],1265:[1091,776],1266:[1059,779],1267:[1091,779],1268:[1063,776],1269:[1095,776],1272:[1067,776],1273:[1099,776],1570:[1575,1619],1571:[1575,1620],1572:[1608,1620],1573:[1575,1621],1574:[1610,1620],1728:[1749,1620],1730:[1729,1620],1747:[1746,1620],2345:[2344,2364],2353:[2352,2364],2356:[2355,2364],2392:[2325,2364],2393:[2326,2364],2394:[2327,2364],2395:[2332,2364],2396:[2337,2364],2397:[2338,2364],2398:[2347,2364],2399:[2351,2364],2507:[2503,2494],2508:[2503,2519],2524:[2465,2492],2525:[2466,2492],2527:[2479,2492],2611:[2610,2620],2614:[2616,2620],2649:[2582,2620],2650:[2583,2620],2651:[2588,2620],2654:[2603,2620],2888:[2887,2902],2891:[2887,2878],2892:[2887,2903],2908:[2849,2876],2909:[2850,2876],2964:[2962,3031],3018:[3014,3006],3019:[3015,3006],3020:[3014,3031],3144:[3142,3158],3264:[3263,3285],3271:[3270,3285],3272:[3270,3286],3274:[3270,3266],3275:[3270,3266,3285],3402:[3398,3390],3403:[3399,3390],3404:[3398,3415],3546:[3545,3530],3548:[3545,3535],3549:[3545,3535,3530],3550:[3545,3551],3907:[3906,4023],3917:[3916,4023],3922:[3921,4023],3927:[3926,4023],3932:[3931,4023],3945:[3904,4021],3955:[3953,3954],3957:[3953,3956],3958:[4018,3968],3960:[4019,3968],3969:[3953,3968],3987:[3986,4023],3997:[3996,4023],4002:[4001,4023],4007:[4006,4023],4012:[4011,4023],4025:[3984,4021],4134:[4133,4142],7835:[383,775],7960:[917,787],7961:[917,788],7962:[917,787,768],7963:[917,788,768],7964:[917,787,769],7965:[917,788,769],8008:[927,787],8009:[927,788],8010:[927,787,768],8011:[927,788,768],8012:[927,787,769],8013:[927,788,769],8016:[965,787],8017:[965,788],8018:[965,787,768],8019:[965,788,768],8020:[965,787,769],8021:[965,788,769],8022:[965,787,834],8023:[965,788,834],8025:[933,788],8027:[933,788,768],8029:[933,788,769],8118:[945,834],8119:[945,834,837],8120:[913,774],8121:[913,772],8122:[913,768],8123:[913,769],8124:[913,837],8126:953,8129:[168,834],8130:[951,768,837],8131:[951,837],8132:[951,769,837],8134:[951,834],8135:[951,834,837],8136:[917,768],8137:[917,769],8138:[919,768],8139:[919,769],8140:[919,837],8141:[8127,768],8142:[8127,769],8143:[8127,834],8144:[953,774],8145:[953,772],8146:[953,776,768],8147:[953,776,769],8150:[953,834],8151:[953,776,834],8152:[921,774],8153:[921,772],8154:[921,768],8155:[921,769],8178:[969,768,837],8179:[969,837],8180:[969,769,837],8182:[969,834],8183:[969,834,837],8184:[927,768],8185:[927,769],8186:[937,768],8187:[937,769],8188:[937,837],8189:180,8192:8194,8193:8195,8486:937,8490:75,8491:[65,778],8602:[8592,824],8603:[8594,824],8622:[8596,824],8653:[8656,824],8654:[8660,824],8655:[8658,824],8708:[8707,824],8713:[8712,824],8716:[8715,824],8740:[8739,824],8742:[8741,824],8769:[8764,824],8772:[8771,824],8775:[8773,824],8777:[8776,824],8800:[61,824],8802:[8801,824],8813:[8781,824],8814:[60,824],8815:[62,824],8816:[8804,824],8817:[8805,824],8820:[8818,824],8821:[8819,824],8824:[8822,824],8825:[8823,824],8832:[8826,824],8833:[8827,824],8836:[8834,824],8837:[8835,824],8840:[8838,824],8841:[8839,824],8876:[8866,824],8877:[8872,824],8878:[8873,824],8879:[8875,824],8928:[8828,824],8929:[8829,824],8930:[8849,824],8931:[8850,824],8938:[8882,824],8939:[8883,824],8940:[8884,824],8941:[8885,824],9001:12296,9002:12297,10972:[10973,824],12364:[12363,12441],12366:[12365,12441],12368:[12367,12441],12370:[12369,12441],12372:[12371,12441],12374:[12373,12441],12376:[12375,12441],12378:[12377,12441],12380:[12379,12441],12382:[12381,12441],12384:[12383,12441],12386:[12385,12441],12389:[12388,12441],12391:[12390,12441],12393:[12392,12441],12400:[12399,12441],12401:[12399,12442],12403:[12402,12441],12404:[12402,12442],12406:[12405,12441],12407:[12405,12442],12409:[12408,12441],12410:[12408,12442],12412:[12411,12441],12413:[12411,12442],12436:[12358,12441],12446:[12445,12441],12460:[12459,12441],12462:[12461,12441],12464:[12463,12441],12466:[12465,12441],12468:[12467,12441],12470:[12469,12441],12472:[12471,12441],12474:[12473,12441],12476:[12475,12441],12478:[12477,12441],12480:[12479,12441],12482:[12481,12441],12485:[12484,12441],12487:[12486,12441],12489:[12488,12441],12496:[12495,12441],12497:[12495,12442],12499:[12498,12441],12500:[12498,12442],12502:[12501,12441],12503:[12501,12442],12505:[12504,12441],12506:[12504,12442],12508:[12507,12441],12509:[12507,12442],12532:[12454,12441],12535:[12527,12441],12536:[12528,12441],12537:[12529,12441],12538:[12530,12441],12542:[12541,12441],64016:22618,64018:26228,64021:20958,64022:29482,64023:30410,64024:31036,64025:31070,64026:31077,64027:31119,64028:38742,64029:31934,64030:32701,64032:34322,64034:35576,64037:36920,64038:37117,64042:39151,64043:39164,64044:39208,64045:40372,64285:[1497,1460],64287:[1522,1463],64298:[1513,1473],64299:[1513,1474],64300:[1513,1468,1473],64301:[1513,1468,1474],64302:[1488,1463],64303:[1488,1464],64304:[1488,1468],64305:[1489,1468],64306:[1490,1468],64307:[1491,1468],64308:[1492,1468],64309:[1493,1468],64310:[1494,1468],64312:[1496,1468],64313:[1497,1468],64314:[1498,1468],64315:[1499,1468],64316:[1500,1468],64318:[1502,1468],64320:[1504,1468],64321:[1505,1468],64323:[1507,1468],64324:[1508,1468],64326:[1510,1468],64327:[1511,1468],64328:[1512,1468],64329:[1513,1468],64330:[1514,1468],64331:[1493,1465],64332:[1489,1471],64333:[1499,1471],64334:[1508,1471],119134:[119127,119141],119135:[119128,119141],119136:[119128,119141,119150],119137:[119128,119141,119151],119138:[119128,119141,119152],119139:[119128,119141,119153],119140:[119128,119141,119154],119227:[119225,119141],119228:[119226,119141],119229:[119225,119141,119150],119230:[119226,119141,119150],119231:[119225,119141,119151],119232:[119226,119141,119151]};(function(){var ls,ix,val;var map=unicode_decomp_table;ls=[[121,776],[65,772],[97,772],[65,774],[97,774],[65,808],[97,808],[67,769],[99,769],[67,770],[99,770],[67,775],[99,775],[67,780],[99,780],[68,780],[100,780],];for(ix=0;ix<17;ix++){val=ls[ix];map[ix+255]=val;}
ls=[[69,772],[101,772],[69,774],[101,774],[69,775],[101,775],[69,808],[101,808],[69,780],[101,780],[71,770],[103,770],[71,774],[103,774],[71,775],[103,775],[71,807],[103,807],[72,770],[104,770],];for(ix=0;ix<20;ix++){val=ls[ix];map[ix+274]=val;}
ls=[[82,769],[114,769],[82,807],[114,807],[82,780],[114,780],[83,769],[115,769],[83,770],[115,770],[83,807],[115,807],[83,780],[115,780],[84,807],[116,807],[84,780],[116,780],];for(ix=0;ix<18;ix++){val=ls[ix];map[ix+340]=val;}
ls=[[85,771],[117,771],[85,772],[117,772],[85,774],[117,774],[85,778],[117,778],[85,779],[117,779],[85,808],[117,808],[87,770],[119,770],[89,770],[121,770],[89,776],[90,769],[122,769],[90,775],[122,775],[90,780],[122,780],];for(ix=0;ix<23;ix++){val=ls[ix];map[ix+360]=val;}
ls=[[65,780],[97,780],[73,780],[105,780],[79,780],[111,780],[85,780],[117,780],[85,776,772],[117,776,772],[85,776,769],[117,776,769],[85,776,780],[117,776,780],[85,776,768],[117,776,768],];for(ix=0;ix<16;ix++){val=ls[ix];map[ix+461]=val;}
ls=[[78,768],[110,768],[65,778,769],[97,778,769],[198,769],[230,769],[216,769],[248,769],[65,783],[97,783],[65,785],[97,785],[69,783],[101,783],[69,785],[101,785],[73,783],[105,783],[73,785],[105,785],[79,783],[111,783],[79,785],[111,785],[82,783],[114,783],[82,785],[114,785],[85,783],[117,783],[85,785],[117,785],[83,806],[115,806],[84,806],[116,806],];for(ix=0;ix<36;ix++){val=ls[ix];map[ix+504]=val;}
ls=[[65,805],[97,805],[66,775],[98,775],[66,803],[98,803],[66,817],[98,817],[67,807,769],[99,807,769],[68,775],[100,775],[68,803],[100,803],[68,817],[100,817],[68,807],[100,807],[68,813],[100,813],[69,772,768],[101,772,768],[69,772,769],[101,772,769],[69,813],[101,813],[69,816],[101,816],[69,807,774],[101,807,774],[70,775],[102,775],[71,772],[103,772],[72,775],[104,775],[72,803],[104,803],[72,776],[104,776],[72,807],[104,807],[72,814],[104,814],[73,816],[105,816],[73,776,769],[105,776,769],[75,769],[107,769],[75,803],[107,803],[75,817],[107,817],[76,803],[108,803],[76,803,772],[108,803,772],[76,817],[108,817],[76,813],[108,813],[77,769],[109,769],[77,775],[109,775],[77,803],[109,803],[78,775],[110,775],[78,803],[110,803],[78,817],[110,817],[78,813],[110,813],[79,771,769],[111,771,769],[79,771,776],[111,771,776],[79,772,768],[111,772,768],[79,772,769],[111,772,769],[80,769],[112,769],[80,775],[112,775],[82,775],[114,775],[82,803],[114,803],[82,803,772],[114,803,772],[82,817],[114,817],[83,775],[115,775],[83,803],[115,803],[83,769,775],[115,769,775],[83,780,775],[115,780,775],[83,803,775],[115,803,775],[84,775],[116,775],[84,803],[116,803],[84,817],[116,817],[84,813],[116,813],[85,804],[117,804],[85,816],[117,816],[85,813],[117,813],[85,771,769],[117,771,769],[85,772,776],[117,772,776],[86,771],[118,771],[86,803],[118,803],[87,768],[119,768],[87,769],[119,769],[87,776],[119,776],[87,775],[119,775],[87,803],[119,803],[88,775],[120,775],[88,776],[120,776],[89,775],[121,775],[90,770],[122,770],[90,803],[122,803],[90,817],[122,817],[104,817],[116,776],[119,778],[121,778],];for(ix=0;ix<154;ix++){val=ls[ix];map[ix+7680]=val;}
ls=[[65,803],[97,803],[65,777],[97,777],[65,770,769],[97,770,769],[65,770,768],[97,770,768],[65,770,777],[97,770,777],[65,770,771],[97,770,771],[65,803,770],[97,803,770],[65,774,769],[97,774,769],[65,774,768],[97,774,768],[65,774,777],[97,774,777],[65,774,771],[97,774,771],[65,803,774],[97,803,774],[69,803],[101,803],[69,777],[101,777],[69,771],[101,771],[69,770,769],[101,770,769],[69,770,768],[101,770,768],[69,770,777],[101,770,777],[69,770,771],[101,770,771],[69,803,770],[101,803,770],[73,777],[105,777],[73,803],[105,803],[79,803],[111,803],[79,777],[111,777],[79,770,769],[111,770,769],[79,770,768],[111,770,768],[79,770,777],[111,770,777],[79,770,771],[111,770,771],[79,803,770],[111,803,770],[79,795,769],[111,795,769],[79,795,768],[111,795,768],[79,795,777],[111,795,777],[79,795,771],[111,795,771],[79,795,803],[111,795,803],[85,803],[117,803],[85,777],[117,777],[85,795,769],[117,795,769],[85,795,768],[117,795,768],[85,795,777],[117,795,777],[85,795,771],[117,795,771],[85,795,803],[117,795,803],[89,768],[121,768],[89,803],[121,803],[89,777],[121,777],[89,771],[121,771],];for(ix=0;ix<90;ix++){val=ls[ix];map[ix+7840]=val;}
ls=[[945,787],[945,788],[945,787,768],[945,788,768],[945,787,769],[945,788,769],[945,787,834],[945,788,834],[913,787],[913,788],[913,787,768],[913,788,768],[913,787,769],[913,788,769],[913,787,834],[913,788,834],[949,787],[949,788],[949,787,768],[949,788,768],[949,787,769],[949,788,769],];for(ix=0;ix<22;ix++){val=ls[ix];map[ix+7936]=val;}
ls=[[951,787],[951,788],[951,787,768],[951,788,768],[951,787,769],[951,788,769],[951,787,834],[951,788,834],[919,787],[919,788],[919,787,768],[919,788,768],[919,787,769],[919,788,769],[919,787,834],[919,788,834],[953,787],[953,788],[953,787,768],[953,788,768],[953,787,769],[953,788,769],[953,787,834],[953,788,834],[921,787],[921,788],[921,787,768],[921,788,768],[921,787,769],[921,788,769],[921,787,834],[921,788,834],[959,787],[959,788],[959,787,768],[959,788,768],[959,787,769],[959,788,769],];for(ix=0;ix<38;ix++){val=ls[ix];map[ix+7968]=val;}
ls=[[933,788,834],[969,787],[969,788],[969,787,768],[969,788,768],[969,787,769],[969,788,769],[969,787,834],[969,788,834],[937,787],[937,788],[937,787,768],[937,788,768],[937,787,769],[937,788,769],[937,787,834],[937,788,834],[945,768],[945,769],[949,768],[949,769],[951,768],[951,769],[953,768],[953,769],[959,768],[959,769],[965,768],[965,769],[969,768],[969,769],];for(ix=0;ix<31;ix++){val=ls[ix];map[ix+8031]=val;}
ls=[[945,787,837],[945,788,837],[945,787,768,837],[945,788,768,837],[945,787,769,837],[945,788,769,837],[945,787,834,837],[945,788,834,837],[913,787,837],[913,788,837],[913,787,768,837],[913,788,768,837],[913,787,769,837],[913,788,769,837],[913,787,834,837],[913,788,834,837],[951,787,837],[951,788,837],[951,787,768,837],[951,788,768,837],[951,787,769,837],[951,788,769,837],[951,787,834,837],[951,788,834,837],[919,787,837],[919,788,837],[919,787,768,837],[919,788,768,837],[919,787,769,837],[919,788,769,837],[919,787,834,837],[919,788,834,837],[969,787,837],[969,788,837],[969,787,768,837],[969,788,768,837],[969,787,769,837],[969,788,769,837],[969,787,834,837],[969,788,834,837],[937,787,837],[937,788,837],[937,787,768,837],[937,788,768,837],[937,787,769,837],[937,788,769,837],[937,787,834,837],[937,788,834,837],[945,774],[945,772],[945,768,837],[945,837],[945,769,837],];for(ix=0;ix<53;ix++){val=ls[ix];map[ix+8064]=val;}
ls=[[8190,768],[8190,769],[8190,834],[965,774],[965,772],[965,776,768],[965,776,769],[961,787],[961,788],[965,834],[965,776,834],[933,774],[933,772],[933,768],[933,769],[929,788],[168,768],[168,769],96,];for(ix=0;ix<19;ix++){val=ls[ix];map[ix+8157]=val;}
ls=[35912,26356,36554,36040,28369,20018,21477,40860,40860,22865,37329,21895,22856,25078,30313,32645,34367,34746,35064,37007,27138,27931,28889,29662,33853,37226,39409,20098,21365,27396,29211,34349,40478,23888,28651,34253,35172,25289,33240,34847,24266,26391,28010,29436,37070,20358,20919,21214,25796,27347,29200,30439,32769,34310,34396,36335,38706,39791,40442,30860,31103,32160,33737,37636,40575,35542,22751,24324,31840,32894,29282,30922,36034,38647,22744,23650,27155,28122,28431,32047,32311,38475,21202,32907,20956,20940,31260,32190,33777,38517,35712,25295,27138,35582,20025,23527,24594,29575,30064,21271,30971,20415,24489,19981,27852,25976,32034,21443,22622,30465,33865,35498,27578,36784,27784,25342,33509,25504,30053,20142,20841,20937,26753,31975,33391,35538,37327,21237,21570,22899,24300,26053,28670,31018,38317,39530,40599,40654,21147,26310,27511,36706,24180,24976,25088,25754,28451,29001,29833,31178,32244,32879,36646,34030,36899,37706,21015,21155,21693,28872,35010,35498,24265,24565,25467,27566,31806,29557,20196,22265,23527,23994,24604,29618,29801,32666,32838,37428,38646,38728,38936,20363,31150,37300,38584,24801,20102,20698,23534,23615,26009,27138,29134,30274,34044,36988,40845,26248,38446,21129,26491,26611,27969,28316,29705,30041,30827,32016,39006,20845,25134,38520,20523,23833,28138,36650,24459,24900,26647,29575,38534,21033,21519,23653,26131,26446,26792,27877,29702,30178,32633,35023,35041,37324,38626,21311,28346,21533,29136,29848,34298,38563,40023,40607,26519,28107,33256,31435,31520,31890,29376,28825,35672,20160,33590,21050,20999,24230,25299,31958,23429,27934,26292,36667,34892,38477,35211,24275,20800,21952,];for(ix=0;ix<270;ix++){val=ls[ix];map[ix+63744]=val;}
ls=[20398,20711,20813,21193,21220,21329,21917,22022,22120,22592,22696,23652,23662,24724,24936,24974,25074,25935,26082,26257,26757,28023,28186,28450,29038,29227,29730,30865,31038,31049,31048,31056,31062,31069,31117,31118,31296,31361,31680,32244,32265,32321,32626,32773,33261,33401,33401,33879,35088,35222,35585,35641,36051,36104,36790,36920,38627,38911,38971,];for(ix=0;ix<59;ix++){val=ls[ix];map[ix+64048]=val;}
ls=[20029,20024,20033,131362,20320,20398,20411,20482,20602,20633,20711,20687,13470,132666,20813,20820,20836,20855,132380,13497,20839,20877,132427,20887,20900,20172,20908,20917,168415,20981,20995,13535,21051,21062,21106,21111,13589,21191,21193,21220,21242,21253,21254,21271,21321,21329,21338,21363,21373,21375,21375,21375,133676,28784,21450,21471,133987,21483,21489,21510,21662,21560,21576,21608,21666,21750,21776,21843,21859,21892,21892,21913,21931,21939,21954,22294,22022,22295,22097,22132,20999,22766,22478,22516,22541,22411,22578,22577,22700,136420,22770,22775,22790,22810,22818,22882,136872,136938,23020,23067,23079,23000,23142,14062,14076,23304,23358,23358,137672,23491,23512,23527,23539,138008,23551,23558,24403,23586,14209,23648,23662,23744,23693,138724,23875,138726,23918,23915,23932,24033,24034,14383,24061,24104,24125,24169,14434,139651,14460,24240,24243,24246,24266,172946,24318,140081,140081,33281,24354,24354,14535,144056,156122,24418,24427,14563,24474,24525,24535,24569,24705,14650,14620,24724,141012,24775,24904,24908,24910,24908,24954,24974,25010,24996,25007,25054,25074,25078,25104,25115,25181,25265,25300,25424,142092,25405,25340,25448,25475,25572,142321,25634,25541,25513,14894,25705,25726,25757,25719,14956,25935,25964,143370,26083,26360,26185,15129,26257,15112,15076,20882,20885,26368,26268,32941,17369,26391,26395,26401,26462,26451,144323,15177,26618,26501,26706,26757,144493,26766,26655,26900,15261,26946,27043,27114,27304,145059,27355,15384,27425,145575,27476,15438,27506,27551,27578,27579,146061,138507,146170,27726,146620,27839,27853,27751,27926,27966,28023,27969,28009,28024,28037,146718,27956,28207,28270,15667,28363,28359,147153,28153,28526,147294,147342,28614,28729,28702,28699,15766,28746,28797,28791,28845,132389,28997,148067,29084,148395,29224,29237,29264,149000,29312,29333,149301,149524,29562,29579,16044,29605,16056,16056,29767,29788,29809,29829,29898,16155,29988,150582,30014,150674,30064,139679,30224,151457,151480,151620,16380,16392,30452,151795,151794,151833,151859,30494,30495,30495,30538,16441,30603,16454,16534,152605,30798,30860,30924,16611,153126,31062,153242,153285,31119,31211,16687,31296,31306,31311,153980,154279,154279,31470,16898,154539,31686,31689,16935,154752,31954,17056,31976,31971,32000,155526,32099,17153,32199,32258,32325,17204,156200,156231,17241,156377,32634,156478,32661,32762,32773,156890,156963,32864,157096,32880,144223,17365,32946,33027,17419,33086,23221,157607,157621,144275,144284,33281,33284,36766,17515,33425,33419,33437,21171,33457,33459,33469,33510,158524,33509,33565,33635,33709,33571,33725,33767,33879,33619,33738,33740,33756,158774,159083,158933,17707,34033,34035,34070,160714,34148,159532,17757,17761,159665,159954,17771,34384,34396,34407,34409,34473,34440,34574,34530,34681,34600,34667,34694,17879,34785,34817,17913,34912,34915,161383,35031,35038,17973,35066,13499,161966,162150,18110,18119,35488,35565,35722,35925,162984,36011,36033,36123,36215,163631,133124,36299,36284,36336,133342,36564,36664,165330,165357,37012,37105,37137,165678,37147,37432,37591,37592,37500,37881,37909,166906,38283,18837,38327,167287,18918,38595,23986,38691,168261,168474,19054,19062,38880,168970,19122,169110,38923,38923,38953,169398,39138,19251,39209,39335,39362,39422,19406,170800,39698,40000,40189,19662,19693,40295,172238,19704,172293,172558,172689,40635,19798,40697,40702,40709,40719,40726,40763,173568,];for(ix=0;ix<542;ix++){val=ls[ix];map[ix+194560]=val;}})();var unicode_combin_table={768:230,769:230,770:230,771:230,772:230,773:230,774:230,775:230,776:230,777:230,778:230,779:230,780:230,781:230,782:230,783:230,784:230,785:230,786:230,787:230,788:230,789:232,790:220,791:220,792:220,793:220,794:232,795:216,796:220,797:220,798:220,799:220,800:220,801:202,802:202,803:220,804:220,805:220,806:220,807:202,808:202,809:220,810:220,811:220,812:220,813:220,814:220,815:220,816:220,817:220,818:220,819:220,820:1,821:1,822:1,823:1,824:1,825:220,826:220,827:220,828:220,829:230,830:230,831:230,832:230,833:230,834:230,835:230,836:230,837:240,838:230,839:220,840:220,841:220,842:230,843:230,844:230,845:220,846:220,848:230,849:230,850:230,851:220,852:220,853:220,854:220,855:230,861:234,862:234,863:233,864:234,865:234,866:233,867:230,868:230,869:230,870:230,871:230,872:230,873:230,874:230,875:230,876:230,877:230,878:230,879:230,1155:230,1156:230,1157:230,1158:230,1425:220,1426:230,1427:230,1428:230,1429:230,1430:220,1431:230,1432:230,1433:230,1434:222,1435:220,1436:230,1437:230,1438:230,1439:230,1440:230,1441:230,1443:220,1444:220,1445:220,1446:220,1447:220,1448:230,1449:230,1450:220,1451:230,1452:230,1453:222,1454:228,1455:230,1456:10,1457:11,1458:12,1459:13,1460:14,1461:15,1462:16,1463:17,1464:18,1465:19,1467:20,1468:21,1469:22,1471:23,1473:24,1474:25,1476:230,1552:230,1553:230,1554:230,1555:230,1556:230,1557:230,1611:27,1612:28,1613:29,1614:30,1615:31,1616:32,1617:33,1618:34,1619:230,1620:230,1621:220,1622:220,1623:230,1624:230,1648:35,1750:230,1751:230,1752:230,1753:230,1754:230,1755:230,1756:230,1759:230,1760:230,1761:230,1762:230,1763:220,1764:230,1767:230,1768:230,1770:220,1771:230,1772:230,1773:220,1809:36,1840:230,1841:220,1842:230,1843:230,1844:220,1845:230,1846:230,1847:220,1848:220,1849:220,1850:230,1851:220,1852:220,1853:230,1854:220,1855:230,1856:230,1857:230,1858:220,1859:230,1860:220,1861:230,1862:220,1863:230,1864:220,1865:230,1866:230,2364:7,2381:9,2385:230,2386:220,2387:230,2388:230,2492:7,2509:9,2620:7,2637:9,2748:7,2765:9,2876:7,2893:9,3021:9,3149:9,3157:84,3158:91,3260:7,3277:9,3405:9,3530:9,3640:103,3641:103,3642:9,3656:107,3657:107,3658:107,3659:107,3768:118,3769:118,3784:122,3785:122,3786:122,3787:122,3864:220,3865:220,3893:220,3895:220,3897:216,3953:129,3954:130,3956:132,3962:130,3963:130,3964:130,3965:130,3968:130,3970:230,3971:230,3972:9,3974:230,3975:230,4038:220,4151:7,4153:9,5908:9,5940:9,6098:9,6109:230,6313:228,6457:222,6458:230,6459:220,8400:230,8401:230,8402:1,8403:1,8404:230,8405:230,8406:230,8407:230,8408:1,8409:1,8410:1,8411:230,8412:230,8417:230,8421:1,8422:1,8423:230,8424:220,8425:230,8426:1,12330:218,12331:228,12332:232,12333:222,12334:224,12335:224,12441:8,12442:8,64286:26,65056:230,65057:230,65058:230,65059:230,119141:216,119142:216,119143:1,119144:1,119145:1,119149:226,119150:216,119151:216,119152:216,119153:216,119154:216,119163:220,119164:220,119165:220,119166:220,119167:220,119168:220,119169:220,119170:220,119173:230,119174:230,119175:230,119176:230,119177:230,119178:220,119179:220,119210:230,119211:230,119212:230,119213:230};var unicode_compo_table={60:{824:8814},61:{824:8800},62:{824:8815},65:{768:192,769:193,770:194,771:195,772:256,774:258,775:550,776:196,777:7842,778:197,780:461,783:512,785:514,803:7840,805:7680,808:260},66:{775:7682,803:7684,817:7686},67:{769:262,770:264,775:266,780:268,807:199},68:{775:7690,780:270,803:7692,807:7696,813:7698,817:7694},69:{768:200,769:201,770:202,771:7868,772:274,774:276,775:278,776:203,777:7866,780:282,783:516,785:518,803:7864,807:552,808:280,813:7704,816:7706},70:{775:7710},71:{769:500,770:284,772:7712,774:286,775:288,780:486,807:290},72:{770:292,775:7714,776:7718,780:542,803:7716,807:7720,814:7722},73:{768:204,769:205,770:206,771:296,772:298,774:300,775:304,776:207,777:7880,780:463,783:520,785:522,803:7882,808:302,816:7724},74:{770:308},75:{769:7728,780:488,803:7730,807:310,817:7732},76:{769:313,780:317,803:7734,807:315,813:7740,817:7738},77:{769:7742,775:7744,803:7746},78:{768:504,769:323,771:209,775:7748,780:327,803:7750,807:325,813:7754,817:7752},79:{768:210,769:211,770:212,771:213,772:332,774:334,775:558,776:214,777:7886,779:336,780:465,783:524,785:526,795:416,803:7884,808:490},80:{769:7764,775:7766},82:{769:340,775:7768,780:344,783:528,785:530,803:7770,807:342,817:7774},83:{769:346,770:348,775:7776,780:352,803:7778,806:536,807:350},84:{775:7786,780:356,803:7788,806:538,807:354,813:7792,817:7790},85:{768:217,769:218,770:219,771:360,772:362,774:364,776:220,777:7910,778:366,779:368,780:467,783:532,785:534,795:431,803:7908,804:7794,808:370,813:7798,816:7796},86:{771:7804,803:7806},87:{768:7808,769:7810,770:372,775:7814,776:7812,803:7816},88:{775:7818,776:7820},89:{768:7922,769:221,770:374,771:7928,772:562,775:7822,776:376,777:7926,803:7924},90:{769:377,770:7824,775:379,780:381,803:7826,817:7828},97:{768:224,769:225,770:226,771:227,772:257,774:259,775:551,776:228,777:7843,778:229,780:462,783:513,785:515,803:7841,805:7681,808:261},98:{775:7683,803:7685,817:7687},99:{769:263,770:265,775:267,780:269,807:231},100:{775:7691,780:271,803:7693,807:7697,813:7699,817:7695},101:{768:232,769:233,770:234,771:7869,772:275,774:277,775:279,776:235,777:7867,780:283,783:517,785:519,803:7865,807:553,808:281,813:7705,816:7707},102:{775:7711},103:{769:501,770:285,772:7713,774:287,775:289,780:487,807:291},104:{770:293,775:7715,776:7719,780:543,803:7717,807:7721,814:7723,817:7830},105:{768:236,769:237,770:238,771:297,772:299,774:301,776:239,777:7881,780:464,783:521,785:523,803:7883,808:303,816:7725},106:{770:309,780:496},107:{769:7729,780:489,803:7731,807:311,817:7733},108:{769:314,780:318,803:7735,807:316,813:7741,817:7739},109:{769:7743,775:7745,803:7747},110:{768:505,769:324,771:241,775:7749,780:328,803:7751,807:326,813:7755,817:7753},111:{768:242,769:243,770:244,771:245,772:333,774:335,775:559,776:246,777:7887,779:337,780:466,783:525,785:527,795:417,803:7885,808:491},112:{769:7765,775:7767},114:{769:341,775:7769,780:345,783:529,785:531,803:7771,807:343,817:7775},115:{769:347,770:349,775:7777,780:353,803:7779,806:537,807:351},116:{775:7787,776:7831,780:357,803:7789,806:539,807:355,813:7793,817:7791},117:{768:249,769:250,770:251,771:361,772:363,774:365,776:252,777:7911,778:367,779:369,780:468,783:533,785:535,795:432,803:7909,804:7795,808:371,813:7799,816:7797},118:{771:7805,803:7807},119:{768:7809,769:7811,770:373,775:7815,776:7813,778:7832,803:7817},120:{775:7819,776:7821},121:{768:7923,769:253,770:375,771:7929,772:563,775:7823,776:255,777:7927,778:7833,803:7925},122:{769:378,770:7825,775:380,780:382,803:7827,817:7829},168:{768:8173,769:901,834:8129},194:{768:7846,769:7844,771:7850,777:7848},196:{772:478},197:{769:506},198:{769:508,772:482},199:{769:7688},202:{768:7872,769:7870,771:7876,777:7874},207:{769:7726},212:{768:7890,769:7888,771:7894,777:7892},213:{769:7756,772:556,776:7758},214:{772:554},216:{769:510},220:{768:475,769:471,772:469,780:473},226:{768:7847,769:7845,771:7851,777:7849},228:{772:479},229:{769:507},230:{769:509,772:483},231:{769:7689},234:{768:7873,769:7871,771:7877,777:7875},239:{769:7727},244:{768:7891,769:7889,771:7895,777:7893},245:{769:7757,772:557,776:7759},246:{772:555},248:{769:511},252:{768:476,769:472,772:470,780:474},258:{768:7856,769:7854,771:7860,777:7858},259:{768:7857,769:7855,771:7861,777:7859},274:{768:7700,769:7702},275:{768:7701,769:7703},332:{768:7760,769:7762},333:{768:7761,769:7763},346:{775:7780},347:{775:7781},352:{775:7782},353:{775:7783},360:{769:7800},361:{769:7801},362:{776:7802},363:{776:7803},383:{775:7835},416:{768:7900,769:7898,771:7904,777:7902,803:7906},417:{768:7901,769:7899,771:7905,777:7903,803:7907},431:{768:7914,769:7912,771:7918,777:7916,803:7920},432:{768:7915,769:7913,771:7919,777:7917,803:7921},439:{780:494},490:{772:492},491:{772:493},550:{772:480},551:{772:481},552:{774:7708},553:{774:7709},558:{772:560},559:{772:561},658:{780:495},776:{769:836},913:{768:8122,769:902,772:8121,774:8120,787:7944,788:7945,837:8124},917:{768:8136,769:904,787:7960,788:7961},919:{768:8138,769:905,787:7976,788:7977,837:8140},921:{768:8154,769:906,772:8153,774:8152,776:938,787:7992,788:7993},927:{768:8184,769:908,787:8008,788:8009},929:{788:8172},933:{768:8170,769:910,772:8169,774:8168,776:939,788:8025},937:{768:8186,769:911,787:8040,788:8041,837:8188},940:{837:8116},942:{837:8132},945:{768:8048,769:940,772:8113,774:8112,787:7936,788:7937,834:8118,837:8115},949:{768:8050,769:941,787:7952,788:7953},951:{768:8052,769:942,787:7968,788:7969,834:8134,837:8131},953:{768:8054,769:943,772:8145,774:8144,776:970,787:7984,788:7985,834:8150},959:{768:8056,769:972,787:8000,788:8001},961:{787:8164,788:8165},965:{768:8058,769:973,772:8161,774:8160,776:971,787:8016,788:8017,834:8166},969:{768:8060,769:974,787:8032,788:8033,834:8182,837:8179},970:{768:8146,769:912,834:8151},971:{768:8162,769:944,834:8167},974:{837:8180},978:{769:979,776:980},1030:{776:1031},1040:{774:1232,776:1234},1043:{769:1027},1045:{768:1024,774:1238,776:1025},1046:{774:1217,776:1244},1047:{776:1246},1048:{768:1037,772:1250,774:1049,776:1252},1050:{769:1036},1054:{776:1254},1059:{772:1262,774:1038,776:1264,779:1266},1063:{776:1268},1067:{776:1272},1069:{776:1260},1072:{774:1233,776:1235},1075:{769:1107},1077:{768:1104,774:1239,776:1105},1078:{774:1218,776:1245},1079:{776:1247},1080:{768:1117,772:1251,774:1081,776:1253},1082:{769:1116},1086:{776:1255},1091:{772:1263,774:1118,776:1265,779:1267},1095:{776:1269},1099:{776:1273},1101:{776:1261},1110:{776:1111},1140:{783:1142},1141:{783:1143},1240:{776:1242},1241:{776:1243},1256:{776:1258},1257:{776:1259},1488:{1463:64302,1464:64303,1468:64304},1489:{1468:64305,1471:64332},1490:{1468:64306},1491:{1468:64307},1492:{1468:64308},1493:{1465:64331,1468:64309},1494:{1468:64310},1496:{1468:64312},1497:{1460:64285,1468:64313},1498:{1468:64314},1499:{1468:64315,1471:64333},1500:{1468:64316},1502:{1468:64318},1504:{1468:64320},1505:{1468:64321},1507:{1468:64323},1508:{1468:64324,1471:64334},1510:{1468:64326},1511:{1468:64327},1512:{1468:64328},1513:{1468:64329,1473:64298,1474:64299},1514:{1468:64330},1522:{1463:64287},1575:{1619:1570,1620:1571,1621:1573},1608:{1620:1572},1610:{1620:1574},1729:{1620:1730},1746:{1620:1747},1749:{1620:1728},2325:{2364:2392},2326:{2364:2393},2327:{2364:2394},2332:{2364:2395},2337:{2364:2396},2338:{2364:2397},2344:{2364:2345},2347:{2364:2398},2351:{2364:2399},2352:{2364:2353},2355:{2364:2356},2465:{2492:2524},2466:{2492:2525},2479:{2492:2527},2503:{2494:2507,2519:2508},2582:{2620:2649},2583:{2620:2650},2588:{2620:2651},2603:{2620:2654},2610:{2620:2611},2616:{2620:2614},2849:{2876:2908},2850:{2876:2909},2887:{2878:2891,2902:2888,2903:2892},2962:{3031:2964},3014:{3006:3018,3031:3020},3015:{3006:3019},3142:{3158:3144},3263:{3285:3264},3270:{3266:3274,3285:3271,3286:3272},3274:{3285:3275},3398:{3390:3402,3415:3404},3399:{3390:3403},3545:{3530:3546,3535:3548,3551:3550},3548:{3530:3549},3904:{4021:3945},3906:{4023:3907},3916:{4023:3917},3921:{4023:3922},3926:{4023:3927},3931:{4023:3932},3953:{3954:3955,3956:3957,3968:3969},3984:{4021:4025},3986:{4023:3987},3996:{4023:3997},4001:{4023:4002},4006:{4023:4007},4011:{4023:4012},4018:{3968:3958},4019:{3968:3960},4133:{4142:4134},7734:{772:7736},7735:{772:7737},7770:{772:7772},7771:{772:7773},7778:{775:7784},7779:{775:7785},7840:{770:7852,774:7862},7841:{770:7853,774:7863},7864:{770:7878},7865:{770:7879},7884:{770:7896},7885:{770:7897},7936:{768:7938,769:7940,834:7942,837:8064},7937:{768:7939,769:7941,834:7943,837:8065},7938:{837:8066},7939:{837:8067},7940:{837:8068},7941:{837:8069},7942:{837:8070},7943:{837:8071},7944:{768:7946,769:7948,834:7950,837:8072},7945:{768:7947,769:7949,834:7951,837:8073},7946:{837:8074},7947:{837:8075},7948:{837:8076},7949:{837:8077},7950:{837:8078},7951:{837:8079},7952:{768:7954,769:7956},7953:{768:7955,769:7957},7960:{768:7962,769:7964},7961:{768:7963,769:7965},7968:{768:7970,769:7972,834:7974,837:8080},7969:{768:7971,769:7973,834:7975,837:8081},7970:{837:8082},7971:{837:8083},7972:{837:8084},7973:{837:8085},7974:{837:8086},7975:{837:8087},7976:{768:7978,769:7980,834:7982,837:8088},7977:{768:7979,769:7981,834:7983,837:8089},7978:{837:8090},7979:{837:8091},7980:{837:8092},7981:{837:8093},7982:{837:8094},7983:{837:8095},7984:{768:7986,769:7988,834:7990},7985:{768:7987,769:7989,834:7991},7992:{768:7994,769:7996,834:7998},7993:{768:7995,769:7997,834:7999},8000:{768:8002,769:8004},8001:{768:8003,769:8005},8008:{768:8010,769:8012},8009:{768:8011,769:8013},8016:{768:8018,769:8020,834:8022},8017:{768:8019,769:8021,834:8023},8025:{768:8027,769:8029,834:8031},8032:{768:8034,769:8036,834:8038,837:8096},8033:{768:8035,769:8037,834:8039,837:8097},8034:{837:8098},8035:{837:8099},8036:{837:8100},8037:{837:8101},8038:{837:8102},8039:{837:8103},8040:{768:8042,769:8044,834:8046,837:8104},8041:{768:8043,769:8045,834:8047,837:8105},8042:{837:8106},8043:{837:8107},8044:{837:8108},8045:{837:8109},8046:{837:8110},8047:{837:8111},8048:{837:8114},8052:{837:8130},8060:{837:8178},8118:{837:8119},8127:{768:8141,769:8142,834:8143},8134:{837:8135},8182:{837:8183},8190:{768:8157,769:8158,834:8159},8592:{824:8602},8594:{824:8603},8596:{824:8622},8656:{824:8653},8658:{824:8655},8660:{824:8654},8707:{824:8708},8712:{824:8713},8715:{824:8716},8739:{824:8740},8741:{824:8742},8764:{824:8769},8771:{824:8772},8773:{824:8775},8776:{824:8777},8781:{824:8813},8801:{824:8802},8804:{824:8816},8805:{824:8817},8818:{824:8820},8819:{824:8821},8822:{824:8824},8823:{824:8825},8826:{824:8832},8827:{824:8833},8828:{824:8928},8829:{824:8929},8834:{824:8836},8835:{824:8837},8838:{824:8840},8839:{824:8841},8849:{824:8930},8850:{824:8931},8866:{824:8876},8872:{824:8877},8873:{824:8878},8875:{824:8879},8882:{824:8938},8883:{824:8939},8884:{824:8940},8885:{824:8941},10973:{824:10972},12358:{12441:12436},12363:{12441:12364},12365:{12441:12366},12367:{12441:12368},12369:{12441:12370},12371:{12441:12372},12373:{12441:12374},12375:{12441:12376},12377:{12441:12378},12379:{12441:12380},12381:{12441:12382},12383:{12441:12384},12385:{12441:12386},12388:{12441:12389},12390:{12441:12391},12392:{12441:12393},12399:{12441:12400,12442:12401},12402:{12441:12403,12442:12404},12405:{12441:12406,12442:12407},12408:{12441:12409,12442:12410},12411:{12441:12412,12442:12413},12445:{12441:12446},12454:{12441:12532},12459:{12441:12460},12461:{12441:12462},12463:{12441:12464},12465:{12441:12466},12467:{12441:12468},12469:{12441:12470},12471:{12441:12472},12473:{12441:12474},12475:{12441:12476},12477:{12441:12478},12479:{12441:12480},12481:{12441:12482},12484:{12441:12485},12486:{12441:12487},12488:{12441:12489},12495:{12441:12496,12442:12497},12498:{12441:12499,12442:12500},12501:{12441:12502,12442:12503},12504:{12441:12505,12442:12506},12507:{12441:12508,12442:12509},12527:{12441:12535},12528:{12441:12536},12529:{12441:12537},12530:{12441:12538},12541:{12441:12542},64329:{1473:64300,1474:64301},119127:{119141:119134},119128:{119141:119135},119135:{119150:119136,119151:119137,119152:119138,119153:119139,119154:119140},119225:{119141:119227},119226:{119141:119228},119227:{119150:119229,119151:119231},119228:{119150:119230,119151:119232}};function CharToString(val){if(val<0x10000){return String.fromCharCode(val);}
else{val-=0x10000;return String.fromCharCode(0xD800+(val>>10),0xDC00+(val&0x3FF));}}
function TrimArrayToBytes(arr){var ix,newarr;var len=arr.length;for(ix=0;ix<len;ix++){if(arr[ix]<0||arr[ix]>=0x100)
break;}
if(ix==len){return arr;}
newarr=Array(len);for(ix=0;ix<len;ix++){newarr[ix]=(arr[ix]&0xFF);}
return newarr;}
function ByteArrayToString(arr){var ix,newarr;var len=arr.length;if(len==0)
return'';for(ix=0;ix<len;ix++){if(arr[ix]<0||arr[ix]>=0x100)
break;}
if(ix==len){return String.fromCharCode.apply(this,arr);}
newarr=Array(len);for(ix=0;ix<len;ix++){newarr[ix]=String.fromCharCode(arr[ix]&0xFF);}
return newarr.join('');}
function UniArrayToString(arr){var ix,val,newarr;var len=arr.length;if(len==0)
return'';for(ix=0;ix<len;ix++){if(arr[ix]>=0x10000)
break;}
if(ix==len){return String.fromCharCode.apply(this,arr);}
newarr=Array(len);for(ix=0;ix<len;ix++){val=arr[ix];if(val<0x10000){newarr[ix]=String.fromCharCode(val);}
else{val-=0x10000;newarr[ix]=String.fromCharCode(0xD800+(val>>10),0xDC00+(val&0x3FF));}}
return newarr.join('');}
function qlog(msg){if(window.console&&console.log)
console.log(msg);else if(window.opera&&opera.postError)
opera.postError(msg);}
function RefBox(){this.value=undefined;this.set_value=function(val){this.value=val;}
this.get_value=function(){return this.value;}}
function RefStruct(numels){this.fields=[];this.push_field=function(val){this.fields.push(val);}
this.set_field=function(pos,val){this.fields[pos]=val;}
this.get_field=function(pos){return this.fields[pos];}
this.get_fields=function(){return this.fields;}}
var DidNotReturn={dummy:'Glk call has not yet returned'};function call_may_not_return(id){if(id==0x001||id==0x0C0||id==0x062)
return true;else
return false;}
var strtype_File=1;var strtype_Window=2;var strtype_Memory=3;var strtype_Resource=4;var gli_windowlist=null;var gli_rootwin=null;var geometry_changed=true;var content_metrics=null;var gli_streamlist=null;var gli_filereflist=null;var gli_schannellist=null;var gli_currentstr=null;var gli_selectref=null;var gli_api_display_rocks=1;var gli_timer_interval=null;var gli_timer_id=null;var gli_timer_started=null;function gli_new_window(type,rock){var win={};win.type=type;win.rock=rock;win.disprock=undefined;win.parent=null;win.str=gli_stream_open_window(win);win.echostr=null;win.style=Const.style_Normal;win.hyperlink=0;win.input_generation=null;win.linebuf=null;win.char_request=false;win.line_request=false;win.char_request_uni=false;win.line_request_uni=false;win.hyperlink_request=false;win.echo_line_input=true;win.line_input_terminators=[];win.request_echo_line_input=null;win.prev=null;win.next=gli_windowlist;gli_windowlist=win;if(win.next)
win.next.prev=win;if(window.GiDispa)
GiDispa.class_register('window',win);else
win.disprock=gli_api_display_rocks++;geometry_changed=true;return win;}
function gli_delete_window(win){var prev,next;if(window.GiDispa)
GiDispa.class_unregister('window',win);geometry_changed=true;win.echostr=null;if(win.str){gli_delete_stream(win.str);win.str=null;}
prev=win.prev;next=win.next;win.prev=null;win.next=null;if(prev)
prev.next=next;else
gli_windowlist=next;if(next)
next.prev=prev;win.parent=null;win.rock=null;win.disprock=null;}
function gli_windows_unechostream(str){var win;for(win=gli_windowlist;win;win=win.next){if(win.echostr===str)
win.echostr=null;}}
function gli_window_put_string(win,val){var ix,ch;switch(win.type){case Const.wintype_TextBuffer:if(win.style!=win.accumstyle||win.hyperlink!=win.accumhyperlink)
gli_window_buffer_deaccumulate(win);win.accum.push(val);break;case Const.wintype_TextGrid:for(ix=0;ix<val.length;ix++){ch=val.charAt(ix);if(win.cursorx<0)
win.cursorx=0;else if(win.cursorx>=win.gridwidth){win.cursorx=0;win.cursory++;}
if(win.cursory<0)
win.cursory=0;else if(win.cursory>=win.gridheight)
break;if(ch=="\n"){win.cursory++;win.cursorx=0;continue;}
lineobj=win.lines[win.cursory];lineobj.dirty=true;lineobj.chars[win.cursorx]=ch;lineobj.styles[win.cursorx]=win.style;lineobj.hyperlinks[win.cursorx]=win.hyperlink;win.cursorx++;}
break;}}
function gli_window_grid_canonicalize(win){if(win.cursorx<0)
win.cursorx=0;else if(win.cursorx>=win.gridwidth){win.cursorx=0;win.cursory++;}
if(win.cursory<0)
win.cursory=0;else if(win.cursory>=win.gridheight)
return true;return false;}
function gli_window_buffer_deaccumulate(win){var conta=win.content;var stylename=StyleNameMap[win.accumstyle];var text,ls,ix,obj,arr;if(win.accum.length){text=win.accum.join('');ls=text.split('\n');for(ix=0;ix<ls.length;ix++){arr=undefined;if(ix==0){if(ls[ix]){if(conta.length==0){arr=[];conta.push({content:arr,append:true});}
else{obj=conta[conta.length-1];if(!obj.content){arr=[];obj.content=arr;}
else{arr=obj.content;}}}}
else{if(ls[ix]){arr=[];conta.push({content:arr});}
else{conta.push({});}}
if(arr!==undefined){if(!win.accumhyperlink){arr.push(stylename);arr.push(ls[ix]);}
else{arr.push({style:stylename,text:ls[ix],hyperlink:win.accumhyperlink});}}}}
win.accum.length=0;win.accumstyle=win.style;win.accumhyperlink=win.hyperlink;}
function gli_window_close(win,recurse){var wx;for(wx=win.parent;wx;wx=wx.parent){if(wx.type==Const.wintype_Pair){if(wx.pair_key===win){wx.pair_key=null;wx.pair_keydamage=true;}}}
if(window.GiDispa&&win.linebuf){GiDispa.unretain_array(win.linebuf);win.linebuf=null;}
switch(win.type){case Const.wintype_Pair:if(recurse){if(win.child1)
gli_window_close(win.child1,true);if(win.child2)
gli_window_close(win.child2,true);}
win.child1=null;win.child2=null;win.pair_key=null;break;case Const.wintype_TextBuffer:win.accum=null;win.content=null;break;case Const.wintype_TextGrid:win.lines=null;break;}
gli_delete_window(win);}
function gli_window_rearrange(win,box){var width,height,oldwidth,oldheight;var min,max,diff,splitwid,ix,cx,lineobj;var box1,box2,ch1,ch2;geometry_changed=true;win.bbox=box;switch(win.type){case Const.wintype_TextGrid:width=box.right-box.left;height=box.bottom-box.top;oldheight=win.gridheight;win.gridwidth=Math.max(0,Math.floor((width-content_metrics.gridmarginx)/content_metrics.gridcharwidth));win.gridheight=Math.max(0,Math.floor((height-content_metrics.gridmarginy)/content_metrics.gridcharheight));if(oldheight>win.gridheight){win.lines.length=win.gridheight;}
else if(oldheight<win.gridheight){for(ix=oldheight;ix<win.gridheight;ix++){win.lines[ix]={chars:[],styles:[],hyperlinks:[],dirty:true};}}
for(ix=0;ix<win.gridheight;ix++){lineobj=win.lines[ix];oldwidth=lineobj.chars.length;if(oldwidth>win.gridwidth){lineobj.dirty=true;lineobj.chars.length=win.gridwidth;lineobj.styles.length=win.gridwidth;lineobj.hyperlinks.length=win.gridwidth;}
else if(oldwidth<win.gridwidth){lineobj.dirty=true;for(cx=oldwidth;cx<win.gridwidth;cx++){lineobj.chars[cx]=' ';lineobj.styles[cx]=Const.style_Normal;lineobj.hyperlinks[cx]=0;}}}
break;case Const.wintype_Pair:if(win.pair_vertical){min=win.bbox.left;max=win.bbox.right;splitwid=content_metrics.inspacingx;}
else{min=win.bbox.top;max=win.bbox.bottom;splitwid=content_metrics.inspacingy;}
if(!win.pair_hasborder)
splitwid=0;diff=max-min;if(win.pair_division==Const.winmethod_Proportional){split=Math.floor((diff*win.pair_size)/100);}
else if(win.pair_division==Const.winmethod_Fixed){split=0;if(win.pair_key&&win.pair_key.type==Const.wintype_TextBuffer){if(!win.pair_vertical)
split=(win.pair_size*content_metrics.buffercharheight+content_metrics.buffermarginy);else
split=(win.pair_size*content_metrics.buffercharwidth+content_metrics.buffermarginx);}
if(win.pair_key&&win.pair_key.type==Const.wintype_TextGrid){if(!win.pair_vertical)
split=(win.pair_size*content_metrics.gridcharheight+content_metrics.gridmarginy);else
split=(win.pair_size*content_metrics.gridcharwidth+content_metrics.gridmarginx);}
split=Math.ceil(split);}
else{split=Math.floor(diff/2);}
if(!win.pair_backward){split=max-split-splitwid;}
else{split=min+split;}
if(min>=max){split=min;}
else{split=Math.min(Math.max(split,min),max-splitwid);}
win.pair_splitpos=split;win.pair_splitwidth=splitwid;if(win.pair_vertical){box1={left:win.bbox.left,right:win.pair_splitpos,top:win.bbox.top,bottom:win.bbox.bottom};box2={left:box1.right+win.pair_splitwidth,right:win.bbox.right,top:win.bbox.top,bottom:win.bbox.bottom};}
else{box1={top:win.bbox.top,bottom:win.pair_splitpos,left:win.bbox.left,right:win.bbox.right};box2={top:box1.bottom+win.pair_splitwidth,bottom:win.bbox.bottom,left:win.bbox.left,right:win.bbox.right};}
if(!win.pair_backward){ch1=win.child1;ch2=win.child2;}
else{ch1=win.child2;ch2=win.child1;}
gli_window_rearrange(ch1,box1);gli_window_rearrange(ch2,box2);break;}}
function gli_new_stream(type,readable,writable,rock){var str={};str.type=type;str.rock=rock;str.disprock=undefined;str.unicode=false;str.ref=null;str.win=null;str.file=null;str.buf=null;str.bufpos=0;str.buflen=0;str.bufeof=0;str.timer_id=null;str.flush_func=null;str.readcount=0;str.writecount=0;str.readable=readable;str.writable=writable;str.prev=null;str.next=gli_streamlist;gli_streamlist=str;if(str.next)
str.next.prev=str;if(window.GiDispa)
GiDispa.class_register('stream',str);return str;}
function gli_delete_stream(str){var prev,next;if(str===gli_currentstr){gli_currentstr=null;}
gli_windows_unechostream(str);if(str.type==strtype_Memory){if(window.GiDispa)
GiDispa.unretain_array(str.buf);}
if(window.GiDispa)
GiDispa.class_unregister('stream',str);prev=str.prev;next=str.next;str.prev=null;str.next=null;if(prev)
prev.next=next;else
gli_streamlist=next;if(next)
next.prev=prev;str.buf=null;str.readable=false;str.writable=false;str.ref=null;str.win=null;str.file=null;str.rock=null;str.disprock=null;}
function gli_stream_open_window(win){var str;str=gli_new_stream(strtype_Window,false,true,0);str.unicode=true;str.win=win;return str;}
function gli_stream_dirty_file(str){if(str.timer_id===null){if(str.flush_func===null){str.flush_func=function(){gli_stream_flush_file(str);};}
str.timer_id=setTimeout(str.flush_func,10000);}}
function gli_stream_flush_file(str){str.timer_id=null;Dialog.file_write(str.ref,str.buf);}
function gli_new_fileref(filename,usage,rock,ref){var fref={};fref.filename=filename;fref.rock=rock;fref.disprock=undefined;fref.textmode=((usage&Const.fileusage_TextMode)!=0);fref.filetype=(usage&Const.fileusage_TypeMask);fref.filetypename=FileTypeMap[fref.filetype];if(!fref.filetypename){fref.filetypename='xxx';}
if(!ref){var gameid='';if(fref.filetype==Const.fileusage_SavedGame)
gameid=VM.get_signature();ref=Dialog.file_construct_ref(fref.filename,fref.filetypename,gameid);}
fref.ref=ref;fref.prev=null;fref.next=gli_filereflist;gli_filereflist=fref;if(fref.next)
fref.next.prev=fref;if(window.GiDispa)
GiDispa.class_register('fileref',fref);return fref;}
function gli_delete_fileref(fref){var prev,next;if(window.GiDispa)
GiDispa.class_unregister('fileref',fref);prev=fref.prev;next=fref.next;fref.prev=null;fref.next=null;if(prev)
prev.next=next;else
gli_filereflist=next;if(next)
next.prev=prev;fref.filename=null;fref.ref=null;fref.rock=null;fref.disprock=null;}
function gli_put_char(str,ch){if(!str||!str.writable)
throw('gli_put_char: invalid stream');if(!str.unicode)
ch=ch&0xFF;str.writecount+=1;switch(str.type){case strtype_File:gli_stream_dirty_file(str);case strtype_Memory:if(str.bufpos<str.buflen){str.buf[str.bufpos]=ch;str.bufpos+=1;if(str.bufpos>str.bufeof)
str.bufeof=str.bufpos;}
break;case strtype_Window:if(str.win.line_request)
throw('gli_put_char: window has pending line request');gli_window_put_string(str.win,CharToString(ch));if(str.win.echostr)
gli_put_char(str.win.echostr,ch);break;}}
function gli_put_array(str,arr,allbytes){var ix,len,val;if(!str||!str.writable)
throw('gli_put_array: invalid stream');if(!str.unicode&&!allbytes){arr=TrimArrayToBytes(arr);allbytes=true;}
str.writecount+=arr.length;switch(str.type){case strtype_File:gli_stream_dirty_file(str);case strtype_Memory:len=arr.length;if(len>str.buflen-str.bufpos)
len=str.buflen-str.bufpos;for(ix=0;ix<len;ix++)
str.buf[str.bufpos+ix]=arr[ix];str.bufpos+=len;if(str.bufpos>str.bufeof)
str.bufeof=str.bufpos;break;case strtype_Window:if(str.win.line_request)
throw('gli_put_array: window has pending line request');if(allbytes)
val=String.fromCharCode.apply(this,arr);else
val=UniArrayToString(arr);gli_window_put_string(str.win,val);if(str.win.echostr)
gli_put_array(str.win.echostr,arr,allbytes);break;}}
function gli_get_char(str,want_unicode){var ch;if(!str||!str.readable)
return-1;switch(str.type){case strtype_Resource:if(str.unicode){if(str.isbinary){if(str.bufpos>=str.bufeof)
return-1;ch=str.buf[str.bufpos];str.bufpos++;if(str.bufpos>=str.bufeof)
return-1;ch=(ch<<8)|(str.buf[str.bufpos]&0xFF);str.bufpos++;if(str.bufpos>=str.bufeof)
return-1;ch=(ch<<8)|(str.buf[str.bufpos]&0xFF);str.bufpos++;if(str.bufpos>=str.bufeof)
return-1;ch=(ch<<8)|(str.buf[str.bufpos]&0xFF);str.bufpos++;}
else{var val0,val1,val2,val3;if(str.bufpos>=str.bufeof)
return-1;val0=str.buf[str.bufpos];str.bufpos++;if(val0<0x80){ch=val0;}
else{if(str.bufpos>=str.bufeof)
return-1;val1=str.buf[str.bufpos];str.bufpos++;if((val1&0xC0)!=0x80)
return-1;if((val0&0xE0)==0xC0){ch=(val0&0x1F)<<6;ch|=(val1&0x3F);}
else{if(str.bufpos>=str.bufeof)
return-1;val2=str.buf[str.bufpos];str.bufpos++;if((val2&0xC0)!=0x80)
return-1;if((val0&0xF0)==0xE0){ch=(((val0&0xF)<<12)&0x0000F000);ch|=(((val1&0x3F)<<6)&0x00000FC0);ch|=(((val2&0x3F))&0x0000003F);}
else if((val0&0xF0)==0xF0){if(str.bufpos>=str.bufeof)
return-1;val3=str.buf[str.bufpos];str.bufpos++;if((val3&0xC0)!=0x80)
return-1;ch=(((val0&0x7)<<18)&0x1C0000);ch|=(((val1&0x3F)<<12)&0x03F000);ch|=(((val2&0x3F)<<6)&0x000FC0);ch|=(((val3&0x3F))&0x00003F);}
else{return-1;}}}}
str.readcount++;ch>>>=0;if(!want_unicode&&ch>=0x100)
return 63;return ch;}
case strtype_File:case strtype_Memory:if(str.bufpos<str.bufeof){ch=str.buf[str.bufpos];str.bufpos++;str.readcount++;if(!want_unicode&&ch>=0x100)
return 63;return ch;}
else{return-1;}
default:return-1;}}
function gli_get_line(str,buf,want_unicode){if(!str||!str.readable)
return 0;var len=buf.length;var gotnewline;switch(str.type){case strtype_Resource:if(str.unicode){if(len==0)
return 0;len-=1;gotnewline=false;for(lx=0;lx<len&&!gotnewline;lx++){ch=gli_get_char(str,want_unicode);if(ch==-1)
break;buf[lx]=ch;gotnewline=(ch==10);}
return lx;}
case strtype_File:case strtype_Memory:if(len==0)
return 0;len-=1;if(str.bufpos>=str.bufeof){len=0;}
else{if(str.bufpos+len>str.bufeof){len=str.bufeof-str.bufpos;}}
gotnewline=false;if(!want_unicode){for(lx=0;lx<len&&!gotnewline;lx++){ch=str.buf[str.bufpos++];if(!want_unicode&&ch>=0x100)
ch=63;buf[lx]=ch;gotnewline=(ch==10);}}
else{for(lx=0;lx<len&&!gotnewline;lx++){ch=str.buf[str.bufpos++];buf[lx]=ch;gotnewline=(ch==10);}}
str.readcount+=lx;return lx;default:return 0;}}
function gli_get_buffer(str,buf,want_unicode){if(!str||!str.readable)
return 0;var len=buf.length;var lx,ch;switch(str.type){case strtype_Resource:if(str.unicode){for(lx=0;lx<len;lx++){ch=gli_get_char(str,want_unicode);if(ch==-1)
break;buf[lx]=ch;}
return lx;}
case strtype_File:case strtype_Memory:if(str.bufpos>=str.bufeof){len=0;}
else{if(str.bufpos+len>str.bufeof){len=str.bufeof-str.bufpos;}}
if(!want_unicode){for(lx=0;lx<len;lx++){ch=str.buf[str.bufpos++];if(!want_unicode&&ch>=0x100)
ch=63;buf[lx]=ch;}}
else{for(lx=0;lx<len;lx++){buf[lx]=str.buf[str.bufpos++];}}
str.readcount+=len;return len;default:return 0;}}
function gli_stream_fill_result(str,result){if(!result)
return;result.set_field(0,str.readcount);result.set_field(1,str.writecount);}
function glk_put_jstring(val,allbytes){glk_put_jstring_stream(gli_currentstr,val,allbytes);}
function glk_put_jstring_stream(str,val,allbytes){var ix,len;if(!str||!str.writable)
throw('glk_put_jstring: invalid stream');str.writecount+=val.length;switch(str.type){case strtype_File:gli_stream_dirty_file(str);case strtype_Memory:len=val.length;if(len>str.buflen-str.bufpos)
len=str.buflen-str.bufpos;if(str.unicode||allbytes){for(ix=0;ix<len;ix++)
str.buf[str.bufpos+ix]=val.charCodeAt(ix);}
else{for(ix=0;ix<len;ix++)
str.buf[str.bufpos+ix]=val.charCodeAt(ix)&0xFF;}
str.bufpos+=len;if(str.bufpos>str.bufeof)
str.bufeof=str.bufpos;break;case strtype_Window:if(str.win.line_request)
throw('glk_put_jstring: window has pending line request');gli_window_put_string(str.win,val);if(str.win.echostr)
glk_put_jstring_stream(str.win.echostr,val,allbytes);break;}}
function gli_set_style(str,val){if(!str||!str.writable)
throw('gli_set_style: invalid stream');if(val>=Const.style_NUMSTYLES)
val=0;if(str.type==strtype_Window){str.win.style=val;if(str.win.echostr)
gli_set_style(str.win.echostr,val);}}
function gli_set_hyperlink(str,val){if(!str||!str.writable)
throw('gli_set_hyperlink: invalid stream');if(str.type==strtype_Window){str.win.hyperlink=val;if(str.win.echostr)
gli_set_hyperlink(str.win.echostr,val);}}
function gli_timer_callback(){if(ui_disabled){if(has_exited){GlkOte.log("### dropping timer event...");gli_timer_id=null;return;}
else{GlkOte.log("### procrastinating timer event...");gli_timer_id=setTimeout(gli_timer_callback,500);return;}}
gli_timer_id=setTimeout(gli_timer_callback,gli_timer_interval);gli_timer_started=Date.now();GlkOte.extevent('timer');}
function glk_exit(){has_exited=true;ui_disabled=true;gli_selectref=null;return DidNotReturn;}
function glk_tick(){}
function glk_gestalt(sel,val){return glk_gestalt_ext(sel,val,null);}
function glk_gestalt_ext(sel,val,arr){switch(sel){case 0:return 0x00000704;case 1:if(val<=Const.keycode_Left&&val>=Const.keycode_End)
return 1;if(val>=0x100000000-Const.keycode_MAXVAL)
return 0;if(val>0x10FFFF)
return 0;if((val>=0&&val<32)||(val>=127&&val<160))
return 0;return 1;case 2:if(val>0x10FFFF)
return 0;if((val>=0&&val<32)||(val>=127&&val<160))
return 0;return 1;case 3:if((val>0x10FFFF)||(val>=0&&val<32)||(val>=127&&val<160)){if(arr)
arr[0]=1;return 0;}
if(arr)
arr[0]=1;return 2;case 4:return 0;case 5:return 1;case 6:return 0;case 7:return 0;case 8:return 0;case 9:return 0;case 10:return 0;case 11:return 1;case 12:if(val==3||val==4)
return 1;else
return 0;case 13:return 0;case 14:return 0;case 15:return 1;case 16:return 1;case 17:return 1;case 18:return 1;case 19:if(val==Const.keycode_Escape)
return 1;if(val>=Const.keycode_Func12&&val<=Const.keycode_Func1)
return 1;return 0;case 20:return 1;case 21:return 0;case 22:return 1;}
return 0;}
function glk_window_iterate(win,rockref){if(!win)
win=gli_windowlist;else
win=win.next;if(win){if(rockref)
rockref.set_value(win.rock);return win;}
if(rockref)
rockref.set_value(0);return null;}
function glk_window_get_rock(win){if(!win)
throw('glk_window_get_rock: invalid window');return win.rock;}
function glk_window_get_root(){return gli_rootwin;}
function glk_window_open(splitwin,method,size,wintype,rock){var oldparent,box,val;var pairwin,newwin;if(!gli_rootwin){if(splitwin)
throw('glk_window_open: splitwin must be null for first window');oldparent=null;box={left:content_metrics.outspacingx,top:content_metrics.outspacingy,right:content_metrics.width-content_metrics.outspacingx,bottom:content_metrics.height-content_metrics.outspacingy};}
else{if(!splitwin)
throw('glk_window_open: splitwin must not be null');val=(method&Const.winmethod_DivisionMask);if(val!=Const.winmethod_Fixed&&val!=Const.winmethod_Proportional)
throw('glk_window_open: invalid method (not fixed or proportional)');val=(method&Const.winmethod_DirMask);if(val!=Const.winmethod_Above&&val!=Const.winmethod_Below&&val!=Const.winmethod_Left&&val!=Const.winmethod_Right)
throw('glk_window_open: invalid method (bad direction)');box=splitwin.bbox;oldparent=splitwin.parent;if(oldparent&&oldparent.type!=Const.wintype_Pair)
throw('glk_window_open: parent window is not Pair');}
newwin=gli_new_window(wintype,rock);switch(newwin.type){case Const.wintype_TextBuffer:newwin.accum=[];newwin.accumstyle=null;newwin.accumhyperlink=0;newwin.content=[];newwin.clearcontent=false;break;case Const.wintype_TextGrid:newwin.gridwidth=0;newwin.gridheight=0;newwin.lines=[];newwin.cursorx=0;newwin.cursory=0;break;case Const.wintype_Blank:break;case Const.wintype_Pair:throw('glk_window_open: cannot open pair window directly')
default:gli_delete_window(newwin);return null;}
if(!splitwin){gli_rootwin=newwin;gli_window_rearrange(newwin,box);}
else{pairwin=gli_new_window(Const.wintype_Pair,0);pairwin.pair_dir=method&Const.winmethod_DirMask;pairwin.pair_division=method&Const.winmethod_DivisionMask;pairwin.pair_key=newwin;pairwin.pair_keydamage=false;pairwin.pair_size=size;pairwin.pair_hasborder=((method&Const.winmethod_BorderMask)==Const.winmethod_Border);pairwin.pair_vertical=(pairwin.pair_dir==Const.winmethod_Left||pairwin.pair_dir==Const.winmethod_Right);pairwin.pair_backward=(pairwin.pair_dir==Const.winmethod_Left||pairwin.pair_dir==Const.winmethod_Above);pairwin.child1=splitwin;pairwin.child2=newwin;splitwin.parent=pairwin;newwin.parent=pairwin;pairwin.parent=oldparent;if(oldparent){if(oldparent.child1==splitwin)
oldparent.child1=pairwin;else
oldparent.child2=pairwin;}
else{gli_rootwin=pairwin;}
gli_window_rearrange(pairwin,box);}
return newwin;}
function glk_window_close(win,statsref){if(!win)
throw('glk_window_close: invalid window');if(win===gli_rootwin||!win.parent){gli_rootwin=null;gli_stream_fill_result(win.str,statsref);gli_window_close(win,true);}
else{var pairwin,grandparwin,sibwin,box,wx,keydamage_flag;pairwin=win.parent;if(win===pairwin.child1)
sibwin=pairwin.child2;else if(win===pairwin.child2)
sibwin=pairwin.child1;else
throw('glk_window_close: window tree is corrupted');box=pairwin.bbox;grandparwin=pairwin.parent;if(!grandparwin){gli_rootwin=sibwin;sibwin.parent=null;}
else{if(grandparwin.child1===pairwin)
grandparwin.child1=sibwin;else
grandparwin.child2=sibwin;sibwin.parent=grandparwin;}
gli_stream_fill_result(win.str,statsref);gli_window_close(win,true);if(win===pairwin.child1){pairwin.child1=null;}
else if(win===pairwin.child2){pairwin.child2=null;}
gli_window_close(pairwin,false);keydamage_flag=false;for(wx=sibwin;wx;wx=wx.parent){if(wx.type==Const.wintype_Pair){if(wx.pair_keydamage){keydamage_flag=true;wx.pair_keydamage=false;}}}
if(keydamage_flag){box=content_box;gli_window_rearrange(gli_rootwin,box);}
else{gli_window_rearrange(sibwin,box);}}}
function glk_window_get_size(win,widthref,heightref){if(!win)
throw('glk_window_get_size: invalid window');var wid=0;var hgt=0;var boxwidth,boxheight;switch(win.type){case Const.wintype_TextGrid:boxwidth=win.bbox.right-win.bbox.left;boxheight=win.bbox.bottom-win.bbox.top;wid=Math.max(0,Math.floor((boxwidth-content_metrics.gridmarginx)/content_metrics.gridcharwidth));hgt=Math.max(0,Math.floor((boxheight-content_metrics.gridmarginy)/content_metrics.gridcharheight));break;case Const.wintype_TextBuffer:boxwidth=win.bbox.right-win.bbox.left;boxheight=win.bbox.bottom-win.bbox.top;wid=Math.max(0,Math.floor((boxwidth-content_metrics.buffermarginx)/content_metrics.buffercharwidth));hgt=Math.max(0,Math.floor((boxheight-content_metrics.buffermarginy)/content_metrics.buffercharheight));break;}
if(widthref)
widthref.set_value(wid);if(heightref)
heightref.set_value(hgt);}
function glk_window_set_arrangement(win,method,size,keywin){var wx,newdir,newvertical,newbackward;if(!win)
throw('glk_window_set_arrangement: invalid window');if(win.type!=Const.wintype_Pair)
throw('glk_window_set_arrangement: not a pair window');if(keywin){if(keywin.type==Const.wintype_Pair)
throw('glk_window_set_arrangement: keywin cannot be a pair window');for(wx=keywin;wx;wx=wx.parent){if(wx==win)
break;}
if(!wx)
throw('glk_window_set_arrangement: keywin must be a descendant');}
newdir=method&Const.winmethod_DirMask;newvertical=(newdir==Const.winmethod_Left||newdir==Const.winmethod_Right);newbackward=(newdir==Const.winmethod_Left||newdir==Const.winmethod_Above);if(!keywin)
keywin=win.pair_key;if(newvertical&&!win.pair_vertical)
throw('glk_window_set_arrangement: split must stay horizontal');if(!newvertical&&win.pair_vertical)
throw('glk_window_set_arrangement: split must stay vertical');if(keywin&&keywin.type==Const.wintype_Blank&&(method&Const.winmethod_DivisionMask)==Const.winmethod_Fixed)
throw('glk_window_set_arrangement: a blank window cannot have a fixed size');if((newbackward&&!win.pair_backward)||(!newbackward&&win.pair_backward)){wx=win.child1;win.child1=win.child2;win.child2=wx;}
win.pair_dir=newdir;win.pair_division=(method&Const.winmethod_DivisionMask);win.pair_key=keywin;win.pair_size=size;win.pair_hasborder=((method&Const.winmethod_BorderMask)==Const.winmethod_Border);win.pair_vertical=(win.pair_dir==Const.winmethod_Left||win.pair_dir==Const.winmethod_Right);win.pair_backward=(win.pair_dir==Const.winmethod_Left||win.pair_dir==Const.winmethod_Above);gli_window_rearrange(win,win.bbox);}
function glk_window_get_arrangement(win,methodref,sizeref,keywinref){if(!win)
throw('glk_window_get_arrangement: invalid window');if(win.type!=Const.wintype_Pair)
throw('glk_window_get_arrangement: not a pair window');if(sizeref)
sizeref.set_value(win.pair_size);if(keywinref)
keywinref.set_value(win.pair_key);if(methodref)
methodref.set_value(win.pair_dir|win.pair_division|(win.pair_hasborder?Const.winmethod_Border:Const.winmethod_NoBorder));}
function glk_window_get_type(win){if(!win)
throw('glk_window_get_type: invalid window');return win.type;}
function glk_window_get_parent(win){if(!win)
throw('glk_window_get_parent: invalid window');return win.parent;}
function glk_window_clear(win){var ix,cx,lineobj;if(!win)
throw('glk_window_clear: invalid window');if(win.line_request){throw('glk_window_clear: window has pending line request');}
switch(win.type){case Const.wintype_TextBuffer:win.accum.length=0;win.accumstyle=null;win.accumhyperlink=0;win.content.length=0;win.clearcontent=true;break;case Const.wintype_TextGrid:win.cursorx=0;win.cursory=0;for(ix=0;ix<win.gridheight;ix++){lineobj=win.lines[ix];lineobj.dirty=true;for(cx=0;cx<win.gridwidth;cx++){lineobj.chars[cx]=' ';lineobj.styles[cx]=Const.style_Normal;lineobj.hyperlinks[cx]=0;}}
break;}}
function glk_window_move_cursor(win,xpos,ypos){if(!win)
throw('glk_window_move_cursor: invalid window');if(win.type==Const.wintype_TextGrid){win.cursorx=xpos;win.cursory=ypos;}
else{throw('glk_window_move_cursor: not a grid window');}}
function glk_window_get_stream(win){if(!win)
throw('glk_window_get_stream: invalid window');return win.str;}
function glk_window_set_echo_stream(win,str){if(!win)
throw('glk_window_set_echo_stream: invalid window');win.echostr=str;}
function glk_window_get_echo_stream(win){if(!win)
throw('glk_window_get_echo_stream: invalid window');return win.echostr;}
function glk_set_window(win){if(!win)
gli_currentstr=null;else
gli_currentstr=win.str;}
function glk_window_get_sibling(win){var parent,sib;if(!win)
throw('glk_window_get_sibling: invalid window');parent=win.parent;if(!parent)
return null;if(win===parent.child1)
return parent.child2;else if(win===parent.child2)
return parent.child1;else
throw('glk_window_get_sibling: window tree is corrupted');}
function glk_stream_iterate(str,rockref){if(!str)
str=gli_streamlist;else
str=str.next;if(str){if(rockref)
rockref.set_value(str.rock);return str;}
if(rockref)
rockref.set_value(0);return null;}
function glk_stream_get_rock(str){if(!str)
throw('glk_stream_get_rock: invalid stream');return str.rock;}
function glk_stream_open_file(fref,fmode,rock){if(!fref)
throw('glk_stream_open_file: invalid fileref');var str;if(fmode!=Const.filemode_Read&&fmode!=Const.filemode_Write&&fmode!=Const.filemode_ReadWrite&&fmode!=Const.filemode_WriteAppend)
throw('glk_stream_open_file: illegal filemode');if(fmode==Const.filemode_Read&&!Dialog.file_ref_exists(fref.ref))
throw('glk_stream_open_file: file not found for reading: '+fref.ref.filename);var content=null;if(fmode!=Const.filemode_Write){content=Dialog.file_read(fref.ref);}
if(content==null){content=[];if(fmode!=Const.filemode_Read){Dialog.file_write(fref.ref,'',true);}}
if(content.length==null)
throw('glk_stream_open_file: data read had no length');str=gli_new_stream(strtype_File,(fmode!=Const.filemode_Write),(fmode!=Const.filemode_Read),rock);str.unicode=false;str.ref=fref.ref;str.buf=content;str.buflen=0xFFFFFFFF;if(fmode==Const.filemode_Write)
str.bufeof=0;else
str.bufeof=content.length;if(fmode==Const.filemode_WriteAppend)
str.bufpos=str.bufeof;else
str.bufpos=0;return str;}
function glk_stream_open_memory(buf,fmode,rock){var str;if(fmode!=Const.filemode_Read&&fmode!=Const.filemode_Write&&fmode!=Const.filemode_ReadWrite)
throw('glk_stream_open_memory: illegal filemode');str=gli_new_stream(strtype_Memory,(fmode!=Const.filemode_Write),(fmode!=Const.filemode_Read),rock);str.unicode=false;if(buf){str.buf=buf;str.buflen=buf.length;str.bufpos=0;if(fmode==Const.filemode_Write)
str.bufeof=0;else
str.bufeof=str.buflen;if(window.GiDispa)
GiDispa.retain_array(buf);}
return str;}
function glk_stream_open_resource(filenum,rock){var str;var el=GiLoad.find_data_chunk(filenum);if(!el)
return null;var buf=el.data;var isbinary=(el.type=='BINA');str=gli_new_stream(strtype_Resource,true,false,rock);str.unicode=false;str.isbinary=isbinary;if(buf){str.buf=buf;str.buflen=buf.length;str.bufpos=0;str.bufeof=str.buflen;}
return str;}
function glk_stream_open_resource_uni(filenum,rock){var str;var el=GiLoad.find_data_chunk(filenum);if(!el)
return null;var buf=el.data;var isbinary=(el.type=='BINA');str=gli_new_stream(strtype_Resource,true,false,rock);str.unicode=true;str.isbinary=isbinary;if(buf){str.buf=buf;str.buflen=buf.length;str.bufpos=0;str.bufeof=str.buflen;}
return str;}
function glk_stream_close(str,result){if(!str)
throw('glk_stream_close: invalid stream');if(str.type==strtype_Window)
throw('glk_stream_close: cannot close window stream');if(str.type==strtype_File&&str.writable){if(!(str.timer_id===null)){clearTimeout(str.timer_id);str.timer_id=null;}
Dialog.file_write(str.ref,str.buf);}
gli_stream_fill_result(str,result);gli_delete_stream(str);}
function glk_stream_set_position(str,pos,seekmode){if(!str)
throw('glk_stream_set_position: invalid stream');switch(str.type){case strtype_File:case strtype_Resource:case strtype_Memory:if(seekmode==Const.seekmode_Current){pos=str.bufpos+pos;}
else if(seekmode==Const.seekmode_End){pos=str.bufeof+pos;}
else{}
if(pos<0)
pos=0;if(pos>str.bufeof)
pos=str.bufeof;str.bufpos=pos;}}
function glk_stream_get_position(str){if(!str)
throw('glk_stream_get_position: invalid stream');switch(str.type){case strtype_File:case strtype_Resource:case strtype_Memory:return str.bufpos;default:return 0;}}
function glk_stream_set_current(str){gli_currentstr=str;}
function glk_stream_get_current(){return gli_currentstr;}
function glk_fileref_create_temp(usage,rock){var timestamp=new Date().getTime();var filename="_temp_"+timestamp+"_"+Math.random();filename=filename.replace('.','');fref=gli_new_fileref(filename,usage,rock,null);return fref;}
function glk_fileref_create_by_name(usage,filename,rock){fref=gli_new_fileref(filename,usage,rock,null);return fref;}
function glk_fileref_create_by_prompt(usage,fmode,rock){var modename;var filetype=(usage&Const.fileusage_TypeMask);var filetypename=FileTypeMap[filetype];if(!filetypename){filetypename='xxx';}
switch(fmode){case Const.filemode_Write:modename='write';break;case Const.filemode_ReadWrite:modename='readwrite';break;case Const.filemode_WriteAppend:modename='writeappend';break;case Const.filemode_Read:default:modename='read';break;}
var special={type:'fileref_prompt',filetype:filetypename,filemode:modename};var callback={usage:usage,rock:rock};if(filetype==Const.fileusage_SavedGame)
special.gameid=VM.get_signature();ui_specialinput=special;ui_specialcallback=callback;gli_selectref=null;return DidNotReturn;}
function gli_fileref_create_by_prompt_callback(obj){var ref=obj.value;var usage=ui_specialcallback.usage;var rock=ui_specialcallback.rock;var fref=null;if(ref){fref=gli_new_fileref(ref.filename,usage,rock,ref);}
ui_specialinput=null;ui_specialcallback=null;if(window.GiDispa)
GiDispa.prepare_resume(fref);VM.resume();}
function glk_fileref_destroy(fref){if(!fref)
throw('glk_fileref_destroy: invalid fileref');gli_delete_fileref(fref);}
function glk_fileref_iterate(fref,rockref){if(!fref)
fref=gli_filereflist;else
fref=fref.next;if(fref){if(rockref)
rockref.set_value(fref.rock);return fref;}
if(rockref)
rockref.set_value(0);return null;}
function glk_fileref_get_rock(fref){if(!fref)
throw('glk_fileref_get_rock: invalid fileref');return fref.rock;}
function glk_fileref_delete_file(fref){if(!fref)
throw('glk_fileref_delete_file: invalid fileref');Dialog.file_remove_ref(fref.ref);}
function glk_fileref_does_file_exist(fref){if(!fref)
throw('glk_fileref_does_file_exist: invalid fileref');if(Dialog.file_ref_exists(fref.ref))
return 1;else
return 0;}
function glk_fileref_create_from_fileref(usage,oldfref,rock){if(!oldfref)
throw('glk_fileref_create_from_fileref: invalid fileref');var fref=gli_new_fileref(oldfref.filename,usage,rock,null);return fref;}
function glk_put_char(ch){gli_put_char(gli_currentstr,ch&0xFF);}
function glk_put_char_stream(str,ch){gli_put_char(str,ch&0xFF);}
function glk_put_string(val){glk_put_jstring_stream(gli_currentstr,val,true);}
function glk_put_string_stream(str,val){glk_put_jstring_stream(str,val,true);}
function glk_put_buffer(arr){arr=TrimArrayToBytes(arr);gli_put_array(gli_currentstr,arr,true);}
function glk_put_buffer_stream(str,arr){arr=TrimArrayToBytes(arr);gli_put_array(str,arr,true);}
function glk_set_style(val){gli_set_style(gli_currentstr,val);}
function glk_set_style_stream(str,val){gli_set_style(str,val);}
function glk_get_char_stream(str){if(!str)
throw('glk_get_char_stream: invalid stream');return gli_get_char(str,false);}
function glk_get_line_stream(str,buf){if(!str)
throw('glk_get_line_stream: invalid stream');return gli_get_line(str,buf,false);}
function glk_get_buffer_stream(str,buf){if(!str)
throw('glk_get_buffer_stream: invalid stream');return gli_get_buffer(str,buf,false);}
function glk_char_to_lower(val){if(val>=0x41&&val<=0x5A)
return val+0x20;if(val>=0xC0&&val<=0xDE&&val!=0xD7)
return val+0x20;return val;}
function glk_char_to_upper(val){if(val>=0x61&&val<=0x7A)
return val-0x20;if(val>=0xE0&&val<=0xFE&&val!=0xF7)
return val-0x20;return val;}
function glk_stylehint_set(wintype,styl,hint,value){}
function glk_stylehint_clear(wintype,styl,hint){}
function glk_style_distinguish(win,styl1,styl2){return 0;}
function glk_style_measure(win,styl,hint,resultref){if(resultref)
resultref.set_value(0);return 0;}
function glk_select(eventref){gli_selectref=eventref;return DidNotReturn;}
function glk_select_poll(eventref){eventref.set_field(0,Const.evtype_None);eventref.set_field(1,null);eventref.set_field(2,0);eventref.set_field(3,0);if(gli_timer_interval&&!(gli_timer_id===null)){var now=Date.now();if(now-gli_timer_started>gli_timer_interval){clearTimeout(gli_timer_id);gli_timer_id=setTimeout(gli_timer_callback,gli_timer_interval);gli_timer_started=Date.now();eventref.set_field(0,Const.evtype_Timer);}}}
function glk_request_line_event(win,buf,initlen){if(!win)
throw('glk_request_line_event: invalid window');if(win.char_request||win.line_request)
throw('glk_request_line_event: window already has keyboard request');if(win.type==Const.wintype_TextBuffer||win.type==Const.wintype_TextGrid){if(initlen){var ls=buf.slice(0,initlen);if(!current_partial_outputs)
current_partial_outputs={};current_partial_outputs[win.disprock]=ByteArrayToString(ls);}
win.line_request=true;win.line_request_uni=false;if(win.type==Const.wintype_TextBuffer)
win.request_echo_line_input=win.echo_line_input;else
win.request_echo_line_input=true;win.input_generation=event_generation;win.linebuf=buf;if(window.GiDispa)
GiDispa.retain_array(buf);}
else{throw('glk_request_line_event: window does not support keyboard input');}}
function glk_cancel_line_event(win,eventref){if(!win)
throw('glk_cancel_line_event: invalid window');if(!win.line_request){if(eventref){eventref.set_field(0,Const.evtype_None);eventref.set_field(1,null);eventref.set_field(2,0);eventref.set_field(3,0);}
return;}
var input="";var ix,val;if(current_partial_inputs){val=current_partial_inputs[win.disprock];if(val)
input=val;}
if(input.length>win.linebuf.length)
input=input.slice(0,win.linebuf.length);if(win.request_echo_line_input){ix=win.style;gli_set_style(win.str,Const.style_Input);gli_window_put_string(win,input);if(win.echostr)
glk_put_jstring_stream(win.echostr,input);gli_set_style(win.str,ix);gli_window_put_string(win,"\n");if(win.echostr)
glk_put_jstring_stream(win.echostr,"\n");}
for(ix=0;ix<input.length;ix++)
win.linebuf[ix]=input.charCodeAt(ix);if(eventref){eventref.set_field(0,Const.evtype_LineInput);eventref.set_field(1,win);eventref.set_field(2,input.length);eventref.set_field(3,0);}
if(window.GiDispa)
GiDispa.unretain_array(win.linebuf);win.line_request=false;win.line_request_uni=false;win.request_echo_line_input=null;win.input_generation=null;win.linebuf=null;}
function glk_request_char_event(win){if(!win)
throw('glk_request_char_event: invalid window');if(win.char_request||win.line_request)
throw('glk_request_char_event: window already has keyboard request');if(win.type==Const.wintype_TextBuffer||win.type==Const.wintype_TextGrid){win.char_request=true;win.char_request_uni=false;win.input_generation=event_generation;}
else{throw('glk_request_char_event: window does not support keyboard input');}}
function glk_cancel_char_event(win){if(!win)
throw('glk_cancel_char_event: invalid window');win.char_request=false;win.char_request_uni=false;}
function glk_set_echo_line_event(win,val){if(!win)
throw('glk_set_echo_line_event: invalid window');win.echo_line_input=(val!=0);}
function glk_set_terminators_line_event(win,arr){if(!win)
throw('glk_set_terminators_line_event: invalid window');if(KeystrokeValueMap===null){KeystrokeValueMap={};for(var val in KeystrokeNameMap){KeystrokeValueMap[KeystrokeNameMap[val]]=val;}}
var res=[];if(arr){for(var ix=0;ix<arr.length;ix++){var val=KeystrokeValueMap[arr[ix]];if(val)
res.push(val);}}
win.line_input_terminators=res;}
function glk_request_mouse_event(win){if(!win)
throw('glk_request_mouse_event: invalid window');}
function glk_cancel_mouse_event(win){if(!win)
throw('glk_cancel_mouse_event: invalid window');}
function glk_request_timer_events(msec){if(!(gli_timer_id===null)){clearTimeout(gli_timer_id);gli_timer_id=null;gli_timer_started=null;}
if(!msec){gli_timer_interval=null;}
else{gli_timer_interval=msec;gli_timer_id=setTimeout(gli_timer_callback,gli_timer_interval);gli_timer_started=Date.now();}}
function glk_image_get_info(imgid,widthref,heightref){if(widthref)
widthref.set_value(0);if(heightref)
heightref.set_value(0);return 0;}
function glk_image_draw(win,imgid,val1,val2){if(!win)
throw('glk_image_draw: invalid window');return 0;}
function glk_image_draw_scaled(win,imgid,val1,val2,width,height){if(!win)
throw('glk_image_draw_scaled: invalid window');return 0;}
function glk_window_flow_break(win){if(!win)
throw('glk_window_flow_break: invalid window');}
function glk_window_erase_rect(win,left,top,width,height){if(!win)
throw('glk_window_erase_rect: invalid window');}
function glk_window_fill_rect(win,color,left,top,width,height){if(!win)
throw('glk_window_fill_rect: invalid window');}
function glk_window_set_background_color(win,color){if(!win)
throw('glk_window_set_background_color: invalid window');}
function glk_schannel_iterate(schan,rockref){if(!schan)
schan=gli_schannellist;else
schan=schan.next;if(schan){if(rockref)
rockref.set_value(schan.rock);return schan;}
if(rockref)
rockref.set_value(0);return null;}
function glk_schannel_get_rock(schan){if(!schan)
throw('glk_schannel_get_rock: invalid schannel');return schan.rock;}
function glk_schannel_create(rock){return null;}
function glk_schannel_destroy(schan){throw('glk_schannel_destroy: invalid schannel');}
function glk_schannel_play(schan,sndid){throw('glk_schannel_play: invalid schannel');}
function glk_schannel_play_ext(schan,sndid,repeats,notify){throw('glk_schannel_play_ext: invalid schannel');}
function glk_schannel_stop(schan){throw('glk_schannel_stop: invalid schannel');}
function glk_schannel_set_volume(schan,vol){throw('glk_schannel_set_volume: invalid schannel');}
function glk_sound_load_hint(sndid,flag){}
function glk_schannel_create_ext(rock,vol){return null;}
function glk_schannel_play_multi(schans,sndids,notify){throw('glk_schannel_play_multi: invalid schannel');}
function glk_schannel_pause(schan){throw('glk_schannel_pause: invalid schannel');}
function glk_schannel_unpause(schan){throw('glk_schannel_unpause: invalid schannel');}
function glk_schannel_set_volume_ext(schan,vol,duration,notify){throw('glk_schannel_set_volume_ext: invalid schannel');}
function glk_set_hyperlink(val){gli_set_hyperlink(gli_currentstr,val);}
function glk_set_hyperlink_stream(str,val){gli_set_hyperlink(str,val);}
function glk_request_hyperlink_event(win){if(!win)
throw('glk_request_hyperlink_event: invalid window');if(win.type==Const.wintype_TextBuffer||win.type==Const.wintype_TextGrid){win.hyperlink_request=true;}}
function glk_cancel_hyperlink_event(win){if(!win)
throw('glk_cancel_hyperlink_event: invalid window');if(win.type==Const.wintype_TextBuffer||win.type==Const.wintype_TextGrid){win.hyperlink_request=false;}}
function glk_buffer_to_lower_case_uni(arr,numchars){var ix,jx,pos,val,origval;var arrlen=arr.length;var src=arr.slice(0,numchars);if(arrlen<numchars)
throw('buffer_to_lower_case_uni: numchars exceeds array length');pos=0;for(ix=0;ix<numchars;ix++){origval=src[ix];val=unicode_lower_table[origval];if(val===undefined){arr[pos]=origval;pos++;}
else if(!(val instanceof Array)){arr[pos]=val;pos++;}
else{for(jx=0;jx<val.length;jx++){arr[pos]=val[jx];pos++;}}}
arr.length=arrlen;return pos;}
function glk_buffer_to_upper_case_uni(arr,numchars){var ix,jx,pos,val,origval;var arrlen=arr.length;var src=arr.slice(0,numchars);if(arrlen<numchars)
throw('buffer_to_upper_case_uni: numchars exceeds array length');pos=0;for(ix=0;ix<numchars;ix++){origval=src[ix];val=unicode_upper_table[origval];if(val===undefined){arr[pos]=origval;pos++;}
else if(!(val instanceof Array)){arr[pos]=val;pos++;}
else{for(jx=0;jx<val.length;jx++){arr[pos]=val[jx];pos++;}}}
arr.length=arrlen;return pos;}
function glk_buffer_to_title_case_uni(arr,numchars,lowerrest){var ix,jx,pos,val,origval;var arrlen=arr.length;var src=arr.slice(0,numchars);if(arrlen<numchars)
throw('buffer_to_title_case_uni: numchars exceeds array length');pos=0;if(numchars==0)
return 0;ix=0;{origval=src[ix];val=unicode_title_table[origval];if(val===undefined){val=unicode_upper_table[origval];}
if(val===undefined){arr[pos]=origval;pos++;}
else if(!(val instanceof Array)){arr[pos]=val;pos++;}
else{for(jx=0;jx<val.length;jx++){arr[pos]=val[jx];pos++;}}}
if(!lowerrest){for(ix=1;ix<numchars;ix++){origval=src[ix];arr[pos]=origval;pos++;}}
else{for(ix=1;ix<numchars;ix++){origval=src[ix];val=unicode_lower_table[origval];if(val===undefined){arr[pos]=origval;pos++;}
else if(!(val instanceof Array)){arr[pos]=val;pos++;}
else{for(jx=0;jx<val.length;jx++){arr[pos]=val[jx];pos++;}}}}
arr.length=arrlen;return pos;}
function gli_buffer_canon_decompose_uni(arr,numchars){var src=arr.slice(0,numchars);var pos,ix,jx,origval,val;var grpstart,grpend,kx,tmp;pos=0;for(ix=0;ix<numchars;ix++){origval=src[ix];val=unicode_decomp_table[origval];if(val===undefined){arr[pos]=origval;pos++;}
else if(!(val instanceof Array)){arr[pos]=val;pos++;}
else{for(jx=0;jx<val.length;jx++){arr[pos]=val[jx];pos++;}}}
ix=0;while(ix<pos){if(!unicode_combin_table[arr[ix]]){ix++;continue;}
if(ix>=pos)
break;grpstart=ix;while(ix<pos&&unicode_combin_table[arr[ix]])
ix++;grpend=ix;if(grpend-grpstart>=2){for(jx=grpend-1;jx>grpstart;jx--){for(kx=grpstart;kx<jx;kx++){if(unicode_combin_table[arr[kx]]>unicode_combin_table[arr[kx+1]]){tmp=arr[kx];arr[kx]=arr[kx+1];arr[kx+1]=tmp;}}}}}
return pos;}
function gli_buffer_canon_compose_uni(arr,numchars){var ix,jx,curch,newch,curclass,newclass,map,pos;if(numchars==0)
return 0;pos=0;curch=arr[0];curclass=unicode_combin_table[curch];if(curclass)
curclass=999;ix=1;jx=ix;while(true){if(jx>=numchars){arr[pos]=curch;pos=ix;break;}
newch=arr[jx];newclass=unicode_combin_table[newch];map=unicode_compo_table[curch];if(map!==undefined&&map[newch]!==undefined&&(!curclass||(newclass&&curclass<newclass))){curch=map[newch];arr[pos]=curch;}
else{if(!newclass){pos=ix;curch=newch;}
curclass=newclass;arr[ix]=newch;ix++;}
jx++;}
return pos;}
function glk_buffer_canon_decompose_uni(arr,numchars){var arrlen=arr.length;var len;len=gli_buffer_canon_decompose_uni(arr,numchars);arr.length=arrlen;return len;}
function glk_buffer_canon_normalize_uni(arr,numchars){var arrlen=arr.length;var len;len=gli_buffer_canon_decompose_uni(arr,numchars);len=gli_buffer_canon_compose_uni(arr,len);arr.length=arrlen;return len;}
function glk_put_char_uni(ch){gli_put_char(gli_currentstr,ch);}
function glk_put_string_uni(val){glk_put_jstring_stream(gli_currentstr,val,false);}
function glk_put_buffer_uni(arr){gli_put_array(gli_currentstr,arr,false);}
function glk_put_char_stream_uni(str,ch){gli_put_char(str,ch);}
function glk_put_string_stream_uni(str,val){glk_put_jstring_stream(str,val,false);}
function glk_put_buffer_stream_uni(str,arr){gli_put_array(str,arr,false);}
function glk_get_char_stream_uni(str){if(!str)
throw('glk_get_char_stream_uni: invalid stream');return gli_get_char(str,true);}
function glk_get_buffer_stream_uni(str,buf){if(!str)
throw('glk_get_buffer_stream_uni: invalid stream');return gli_get_buffer(str,buf,true);}
function glk_get_line_stream_uni(str,buf){if(!str)
throw('glk_get_line_stream_uni: invalid stream');return gli_get_line(str,buf,true);}
function glk_stream_open_file_uni(fref,fmode,rock){if(!fref)
throw('glk_stream_open_file_uni: invalid fileref');var str;if(fmode!=Const.filemode_Read&&fmode!=Const.filemode_Write&&fmode!=Const.filemode_ReadWrite&&fmode!=Const.filemode_WriteAppend)
throw('glk_stream_open_file_uni: illegal filemode');if(fmode==Const.filemode_Read&&!Dialog.file_ref_exists(fref.ref))
throw('glk_stream_open_file_uni: file not found for reading: '+fref.ref.filename);var content=null;if(fmode!=Const.filemode_Write){content=Dialog.file_read(fref.ref);}
if(content==null){content=[];if(fmode!=Const.filemode_Read){Dialog.file_write(fref.ref,'',true);}}
str=gli_new_stream(strtype_File,(fmode!=Const.filemode_Write),(fmode!=Const.filemode_Read),rock);str.unicode=true;str.ref=fref.ref;str.buf=content;str.buflen=0xFFFFFFFF;if(fmode==Const.filemode_Write)
str.bufeof=0;else
str.bufeof=content.length;if(fmode==Const.filemode_WriteAppend)
str.bufpos=str.bufeof;else
str.bufpos=0;return str;}
function glk_stream_open_memory_uni(buf,fmode,rock){var str;if(fmode!=Const.filemode_Read&&fmode!=Const.filemode_Write&&fmode!=Const.filemode_ReadWrite)
throw('glk_stream_open_memory: illegal filemode');str=gli_new_stream(strtype_Memory,(fmode!=Const.filemode_Write),(fmode!=Const.filemode_Read),rock);str.unicode=true;if(buf){str.buf=buf;str.buflen=buf.length;str.bufpos=0;if(fmode==Const.filemode_Write)
str.bufeof=0;else
str.bufeof=str.buflen;if(window.GiDispa)
GiDispa.retain_array(buf);}
return str;}
function glk_request_char_event_uni(win){if(!win)
throw('glk_request_char_event: invalid window');if(win.char_request||win.line_request)
throw('glk_request_char_event: window already has keyboard request');if(win.type==Const.wintype_TextBuffer||win.type==Const.wintype_TextGrid){win.char_request=true;win.char_request_uni=true;win.input_generation=event_generation;}
else{throw('glk_request_char_event: window does not support keyboard input');}}
function glk_request_line_event_uni(win,buf,initlen){if(!win)
throw('glk_request_line_event: invalid window');if(win.char_request||win.line_request)
throw('glk_request_line_event: window already has keyboard request');if(win.type==Const.wintype_TextBuffer||win.type==Const.wintype_TextGrid){if(initlen){var ls=buf.slice(0,initlen);if(!current_partial_outputs)
current_partial_outputs={};current_partial_outputs[win.disprock]=UniArrayToString(ls);}
win.line_request=true;win.line_request_uni=true;if(win.type==Const.wintype_TextBuffer)
win.request_echo_line_input=win.echo_line_input;else
win.request_echo_line_input=true;win.input_generation=event_generation;win.linebuf=buf;if(window.GiDispa)
GiDispa.retain_array(buf);}
else{throw('glk_request_line_event: window does not support keyboard input');}}
function glk_current_time(timevalref){var now=new Date().getTime();var usec;timevalref.set_field(0,Math.floor(now/4294967296000));timevalref.set_field(1,Math.floor(now/1000)>>>0);usec=Math.floor((now%1000)*1000);if(usec<0)
usec=1000000+usec;timevalref.set_field(2,usec);}
function glk_current_simple_time(factor){var now=new Date().getTime();return Math.floor(now/(factor*1000));}
function glk_time_to_date_utc(timevalref,dateref){var now=timevalref.get_field(0)*4294967296000+timevalref.get_field(1)*1000+timevalref.get_field(2)/1000;var obj=new Date(now);dateref.set_field(0,obj.getUTCFullYear())
dateref.set_field(1,1+obj.getUTCMonth())
dateref.set_field(2,obj.getUTCDate())
dateref.set_field(3,obj.getUTCDay())
dateref.set_field(4,obj.getUTCHours())
dateref.set_field(5,obj.getUTCMinutes())
dateref.set_field(6,obj.getUTCSeconds())
dateref.set_field(7,1000*obj.getUTCMilliseconds())}
function glk_time_to_date_local(timevalref,dateref){var now=timevalref.get_field(0)*4294967296000+timevalref.get_field(1)*1000+timevalref.get_field(2)/1000;var obj=new Date(now);dateref.set_field(0,obj.getFullYear())
dateref.set_field(1,1+obj.getMonth())
dateref.set_field(2,obj.getDate())
dateref.set_field(3,obj.getDay())
dateref.set_field(4,obj.getHours())
dateref.set_field(5,obj.getMinutes())
dateref.set_field(6,obj.getSeconds())
dateref.set_field(7,1000*obj.getMilliseconds())}
function glk_simple_time_to_date_utc(time,factor,dateref){var now=time*(1000*factor);var obj=new Date(now);dateref.set_field(0,obj.getUTCFullYear())
dateref.set_field(1,1+obj.getUTCMonth())
dateref.set_field(2,obj.getUTCDate())
dateref.set_field(3,obj.getUTCDay())
dateref.set_field(4,obj.getUTCHours())
dateref.set_field(5,obj.getUTCMinutes())
dateref.set_field(6,obj.getUTCSeconds())
dateref.set_field(7,1000*obj.getUTCMilliseconds())}
function glk_simple_time_to_date_local(time,factor,dateref){var now=time*(1000*factor);var obj=new Date(now);dateref.set_field(0,obj.getFullYear())
dateref.set_field(1,1+obj.getMonth())
dateref.set_field(2,obj.getDate())
dateref.set_field(3,obj.getDay())
dateref.set_field(4,obj.getHours())
dateref.set_field(5,obj.getMinutes())
dateref.set_field(6,obj.getSeconds())
dateref.set_field(7,1000*obj.getMilliseconds())}
function glk_date_to_time_utc(dateref,timevalref){var obj=new Date(0);obj.setUTCFullYear(dateref.get_field(0));obj.setUTCMonth(dateref.get_field(1)-1);obj.setUTCDate(dateref.get_field(2));obj.setUTCHours(dateref.get_field(4));obj.setUTCMinutes(dateref.get_field(5));obj.setUTCSeconds(dateref.get_field(6));obj.setUTCMilliseconds(dateref.get_field(7)/1000);var now=obj.getTime();var usec;timevalref.set_field(0,Math.floor(now/4294967296000));timevalref.set_field(1,Math.floor(now/1000)>>>0);usec=Math.floor((now%1000)*1000);if(usec<0)
usec=1000000+usec;timevalref.set_field(2,usec);}
function glk_date_to_time_local(dateref,timevalref){var obj=new Date(dateref.get_field(0),dateref.get_field(1)-1,dateref.get_field(2),dateref.get_field(4),dateref.get_field(5),dateref.get_field(6),dateref.get_field(7)/1000);var now=obj.getTime();var usec;timevalref.set_field(0,Math.floor(now/4294967296000));timevalref.set_field(1,Math.floor(now/1000)>>>0);usec=Math.floor((now%1000)*1000);if(usec<0)
usec=1000000+usec;timevalref.set_field(2,usec);}
function glk_date_to_simple_time_utc(dateref,factor){var obj=new Date(0);obj.setUTCFullYear(dateref.get_field(0));obj.setUTCMonth(dateref.get_field(1)-1);obj.setUTCDate(dateref.get_field(2));obj.setUTCHours(dateref.get_field(4));obj.setUTCMinutes(dateref.get_field(5));obj.setUTCSeconds(dateref.get_field(6));obj.setUTCMilliseconds(dateref.get_field(7)/1000);var now=obj.getTime();return Math.floor(now/(factor*1000));}
function glk_date_to_simple_time_local(dateref,factor){var obj=new Date(dateref.get_field(0),dateref.get_field(1)-1,dateref.get_field(2),dateref.get_field(4),dateref.get_field(5),dateref.get_field(6),dateref.get_field(7)/1000);var now=obj.getTime();return Math.floor(now/(factor*1000));}
return{version:'1.3.1',init:init,update:update,fatal_error:fatal_error,byte_array_to_string:ByteArrayToString,uni_array_to_string:UniArrayToString,Const:Const,RefBox:RefBox,RefStruct:RefStruct,DidNotReturn:DidNotReturn,call_may_not_return:call_may_not_return,glk_put_jstring:glk_put_jstring,glk_put_jstring_stream:glk_put_jstring_stream,glk_exit:glk_exit,glk_tick:glk_tick,glk_gestalt:glk_gestalt,glk_gestalt_ext:glk_gestalt_ext,glk_window_iterate:glk_window_iterate,glk_window_get_rock:glk_window_get_rock,glk_window_get_root:glk_window_get_root,glk_window_open:glk_window_open,glk_window_close:glk_window_close,glk_window_get_size:glk_window_get_size,glk_window_set_arrangement:glk_window_set_arrangement,glk_window_get_arrangement:glk_window_get_arrangement,glk_window_get_type:glk_window_get_type,glk_window_get_parent:glk_window_get_parent,glk_window_clear:glk_window_clear,glk_window_move_cursor:glk_window_move_cursor,glk_window_get_stream:glk_window_get_stream,glk_window_set_echo_stream:glk_window_set_echo_stream,glk_window_get_echo_stream:glk_window_get_echo_stream,glk_set_window:glk_set_window,glk_window_get_sibling:glk_window_get_sibling,glk_stream_iterate:glk_stream_iterate,glk_stream_get_rock:glk_stream_get_rock,glk_stream_open_file:glk_stream_open_file,glk_stream_open_memory:glk_stream_open_memory,glk_stream_close:glk_stream_close,glk_stream_set_position:glk_stream_set_position,glk_stream_get_position:glk_stream_get_position,glk_stream_set_current:glk_stream_set_current,glk_stream_get_current:glk_stream_get_current,glk_fileref_create_temp:glk_fileref_create_temp,glk_fileref_create_by_name:glk_fileref_create_by_name,glk_fileref_create_by_prompt:glk_fileref_create_by_prompt,glk_fileref_destroy:glk_fileref_destroy,glk_fileref_iterate:glk_fileref_iterate,glk_fileref_get_rock:glk_fileref_get_rock,glk_fileref_delete_file:glk_fileref_delete_file,glk_fileref_does_file_exist:glk_fileref_does_file_exist,glk_fileref_create_from_fileref:glk_fileref_create_from_fileref,glk_put_char:glk_put_char,glk_put_char_stream:glk_put_char_stream,glk_put_string:glk_put_string,glk_put_string_stream:glk_put_string_stream,glk_put_buffer:glk_put_buffer,glk_put_buffer_stream:glk_put_buffer_stream,glk_set_style:glk_set_style,glk_set_style_stream:glk_set_style_stream,glk_get_char_stream:glk_get_char_stream,glk_get_line_stream:glk_get_line_stream,glk_get_buffer_stream:glk_get_buffer_stream,glk_char_to_lower:glk_char_to_lower,glk_char_to_upper:glk_char_to_upper,glk_stylehint_set:glk_stylehint_set,glk_stylehint_clear:glk_stylehint_clear,glk_style_distinguish:glk_style_distinguish,glk_style_measure:glk_style_measure,glk_select:glk_select,glk_select_poll:glk_select_poll,glk_request_line_event:glk_request_line_event,glk_cancel_line_event:glk_cancel_line_event,glk_request_char_event:glk_request_char_event,glk_cancel_char_event:glk_cancel_char_event,glk_request_mouse_event:glk_request_mouse_event,glk_cancel_mouse_event:glk_cancel_mouse_event,glk_request_timer_events:glk_request_timer_events,glk_image_get_info:glk_image_get_info,glk_image_draw:glk_image_draw,glk_image_draw_scaled:glk_image_draw_scaled,glk_window_flow_break:glk_window_flow_break,glk_window_erase_rect:glk_window_erase_rect,glk_window_fill_rect:glk_window_fill_rect,glk_window_set_background_color:glk_window_set_background_color,glk_schannel_iterate:glk_schannel_iterate,glk_schannel_get_rock:glk_schannel_get_rock,glk_schannel_create:glk_schannel_create,glk_schannel_destroy:glk_schannel_destroy,glk_schannel_play:glk_schannel_play,glk_schannel_play_ext:glk_schannel_play_ext,glk_schannel_stop:glk_schannel_stop,glk_schannel_set_volume:glk_schannel_set_volume,glk_schannel_create_ext:glk_schannel_create_ext,glk_schannel_play_multi:glk_schannel_play_multi,glk_schannel_pause:glk_schannel_pause,glk_schannel_unpause:glk_schannel_unpause,glk_schannel_set_volume_ext:glk_schannel_set_volume_ext,glk_sound_load_hint:glk_sound_load_hint,glk_set_hyperlink:glk_set_hyperlink,glk_set_hyperlink_stream:glk_set_hyperlink_stream,glk_request_hyperlink_event:glk_request_hyperlink_event,glk_cancel_hyperlink_event:glk_cancel_hyperlink_event,glk_buffer_to_lower_case_uni:glk_buffer_to_lower_case_uni,glk_buffer_to_upper_case_uni:glk_buffer_to_upper_case_uni,glk_buffer_to_title_case_uni:glk_buffer_to_title_case_uni,glk_buffer_canon_decompose_uni:glk_buffer_canon_decompose_uni,glk_buffer_canon_normalize_uni:glk_buffer_canon_normalize_uni,glk_put_char_uni:glk_put_char_uni,glk_put_string_uni:glk_put_string_uni,glk_put_buffer_uni:glk_put_buffer_uni,glk_put_char_stream_uni:glk_put_char_stream_uni,glk_put_string_stream_uni:glk_put_string_stream_uni,glk_put_buffer_stream_uni:glk_put_buffer_stream_uni,glk_get_char_stream_uni:glk_get_char_stream_uni,glk_get_buffer_stream_uni:glk_get_buffer_stream_uni,glk_get_line_stream_uni:glk_get_line_stream_uni,glk_stream_open_file_uni:glk_stream_open_file_uni,glk_stream_open_memory_uni:glk_stream_open_memory_uni,glk_request_char_event_uni:glk_request_char_event_uni,glk_request_line_event_uni:glk_request_line_event_uni,glk_set_echo_line_event:glk_set_echo_line_event,glk_set_terminators_line_event:glk_set_terminators_line_event,glk_current_time:glk_current_time,glk_current_simple_time:glk_current_simple_time,glk_time_to_date_utc:glk_time_to_date_utc,glk_time_to_date_local:glk_time_to_date_local,glk_simple_time_to_date_utc:glk_simple_time_to_date_utc,glk_simple_time_to_date_local:glk_simple_time_to_date_local,glk_date_to_time_utc:glk_date_to_time_utc,glk_date_to_time_local:glk_date_to_time_local,glk_date_to_simple_time_utc:glk_date_to_simple_time_utc,glk_date_to_simple_time_local:glk_date_to_simple_time_local,glk_stream_open_resource:glk_stream_open_resource,glk_stream_open_resource_uni:glk_stream_open_resource_uni};}();

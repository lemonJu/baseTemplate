! function(window, undefined) {
    //var isPush = '__proto__' in {};
    //入口
    var template = function(filename, content, options) {
        if(!filename || typeof content !== "object") return;
        template.data = content;
        options && setConfig(options);
        return typeof filename == "string" ? compile(filename, content)(content) : renderFile(filename, content)
    };

    template.version = "0.0.1";

    var defaults = template.defaults = {
        openTag: '<%',
        closeTag: '%>',
        outTag: '='
    };

    var each = function(src, callback) {
        for (var i in src) callback.call(src[i], i, src[i])
    };

    var setConfig = template.setConfig = function(vals) {
        for (var v in vals) {
            defaults[v] = vals[v];
        }
    };

    var cacheStore = template.cache = {};

    var renderFile = function(filename, data) {
        var fn = cacheStore[filename] || get(filename);
        //缓存
        if (!cacheStore[filename]) cacheStore[filename] = fn;
        return data ? fn(data) : fn
    };

    var get = function(filename) {
        if (template.cache[filename]) {
            return template.cache[filename]
        } else {
            var elem = document.getElementById(filename);
            var val = (elem.innerHTML || elem.value).replace(/^\s*|\s*$/g, '');
            return compile(val, {
                filename: filename
            })
        }
    }

    var compile = template.compile = function(source) {
        source = source.replace(/\s*\r?\n\s*/g, "");
        return compiler(source)
    }

    

    var compiler = function(source) {
        var $ot = "var $out='';";
        for (var s in template.data) {
            $ot += "var " + s + "= data." + s + ";"
        }
        each(source.split(defaults.openTag), function(key, value) {
            var code = value.split(defaults.closeTag);
            var $0 = code[0];
            var $1 = code[1];
            $ot += parseCode($0);
            $ot += parseHtml($1)
        });

        function parseHtml(html) {
            if (html && html !== "") return "$out+=\"" + html + "\";";
            else return ""
        }

        function parseCode(code) {
            if (code && code.indexOf(defaults.outTag) == 0) {
                return "$out+=" + code.substring(1) + ";"
            } else {
                return code
            }
        }
        return new Function("data", $ot + "return $out")
    }

    window.template = template

}(window);

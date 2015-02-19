! function(global, undefined) {
    
    var isOldrower = !-[1,];
    /**
     * IE8-tostring bug
     * issue #1
     * https://github.com/lemonJu/baseTemplate/issues/1
     */
    var strBuffer = function(str) {
        var __str = [str];
        this.append = function(str) {
            __str.push(str);
            return this
        }
        this.getString = function() {
            return __str.join("")
        }
    }

    var label = 0, //已经分配的label
        curLabel; //当前node的label

    /**
     * part = $oper
     */
    var $oper = {}
    $oper.id = "";
    $oper.setData = function(data) {
        template.render($oper.id, data)
    }

    /**
     * part = util
     */
    var util = {};
    util._j = function(type) {
        return function(element) {
            return Object.prototype.toString.call(element) === "[object " + type + "]"
        }
    }
    util.isString = util._j("String");
    util.isArray = util._j("Array");
    util.isFunction = util._j("Function");
    util.getLabel = function(node) {
        var nodeLabel = node.getAttribute("bslb");
        if (!nodeLabel) {
            nodeLabel = "bl" + label++;
            node.setAttribute("bslb", nodeLabel);
        }
        return nodeLabel
    }
    util.isObject = util._j("Object");
    util.each = function(src, callback) {
        var i;
        for (i in src) callback(i, src[i])
    };
    util.byId = function(id) {
        return document.getElementById(id)
    };

    /**
     * part = template
     */
    var template = {};

    template.version = "0.0.1";
    template.cache = {};
    template.config = {
        openTag: '<%',
        closeTag: '%>',
        outTag: '='
    }

    template.render = function(node, data, options) {
        if (util.isFunction(data)) {
            $oper.id = node;
            return data.call($oper, $oper);
        }
        if (!node && !node.nodeType && !util.isString(node)) return
        if (options) setConfig(options)
        if (util.isString(node)) node = util.byId(node)

        curLabel = util.getLabel(node);
        return node.innerHTML = get(node.innerHTML, data)
    }

    /**
     * part = functions
     */

    function setConfig(vals) {
        util.each(vals, function(key, value) {
            template.config[key] = value
        })
    }

    function get(html, data) {
        var result, cache = template.cache;
        if (!cache[curLabel]) {

            cache[curLabel] = compiler(html, data)
        }
        if (!data) return cache[curLabel]
        return cache[curLabel](data)
    }

    function compiler(html, data) {
        var $ot = "var $out='';";
        var d, $0, $1, code;
        var oTag = template.config.openTag,
            otTag = template.config.outTag,
            cTag = template.config.closeTag;

        //except spaces
        html = html.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s*\r?\n\s*/g, "");

        if (isOldrower) {
            buffer = new strBuffer($ot);
            for (d in data) {
                buffer.append("var ").append(d).append("= data.").append(d).append(";")
            }
            util.each(html.split(oTag), function(key, value) {
                code = value.split(cTag);
                $0 = code[0];
                $1 = code[1];
                buffer.append(parseCode($0)).append("$out+=\"").append(parseHtml($1)).append("\";");
            })
            $ot = buffer.getString()
        } else {
            for (d in data) {
                $ot += "var " + d + "= data." + d + ";"
            }
            util.each(html.split(oTag), function(key, value) {
                code = value.split(cTag);
                $0 = code[0];
                $1 = code[1];
                $ot += parseCode($0);
                $ot += "$out+=\"" + parseHtml($1) + "\";"
            })
        }

        function parseHtml(html) {
            if (html && html !== "") return html;
            else return ""
        }

        function parseCode(code) {
            if (code && code.indexOf(otTag) == 0) {
                return "$out+=" + code.substring(1) + ";"
            } else {
                return code
            }
        }

        return new Function("data", $ot + " return $out")
    }

    //添加cmd的支持
    if (typeof define === "function" && define.cmd) {
        define(function(require, exports, module) {
            module.exports = template
        });
    }
    //添加amd的支持
    if (typeof define === "function" && define.amd) {
        define("jquery", [], function() {
            return template
        });
    }
    global.template = template

}(this)

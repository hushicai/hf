/**
 * @file jsonp
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var curry = require('../lang/curry');
        var Promise = require('../promise/index');
        var getGuid = require('../lang/getGuid');

        var resolvers = {};
        var rejecters = {};

        var timers = {};

        function timing(scriptId, timeout) {
            // 30秒
            timeout = timeout || 30000;

            var message = "请求超时";

            timers[scriptId] = setTimeout(curry(fail, scriptId, message), timeout);
        }

        /**
         * 发送jsonp请求
         * 
         * @inner
         */
        function load(url, scriptId, options) {
            // 开始倒计时
            timing(options.timeout);

            var script = document.createElement('script');

            script.charset = options.charset || 'utf-8';
            script.id = scriptId;
            script.async = 'async';

            var data = options.data;
            var params = [];
            for (var key in data) {
                params.push(key + '=' + encodeURIComponent(data[key]));
            }

            url += '?' + params.join('&');
            script.src = url;

            var ele = document.getElementsByTagName('head')[0];
            if (ele) {
                ele.appendChild(script);
            }
            else {
                ele = document.getElementsByTagName('script')[0];
                ele.parentNode.insertBefore(script, ele);
            }
        }

        function getCallbackNameFromScriptId(scriptId) {
            return '_cb_' + scriptId;
        }

        /**
         * 清理
         * 
         * @inner
         */
        function cleanup(scriptId) {
            try {
                var ele = document.getElementById(scriptId);
                if (ele) {
                    ele.parentNode.removeChild(ele);
                }
                var name = getCallbackNameFromScriptId(scriptId);
                delete window[name];
                delete resolvers[scriptId];
                delete rejecters[scriptId];

                var timer = timers[scriptId];
                if (timer) {
                    clearTimeout(timer);
                    delete timers[scriptId];
                }
            }
            catch (e) {} // jshint ignore: line
        }

        /**
         * 请求失败
         * 
         * @inner
         */
        function fail(scriptId, reason) {
            var reject = rejecters[scriptId];

            reject && reject(reason);

            cleanup(scriptId);
        }

        /**
         * 成功回调
         * 
         * @inner
         */
        function success(scriptId, data) {
            var resolve = resolvers[scriptId];

            resolve && resolve(data);

            cleanup(scriptId);
        }

        /**
         * 生成全局回调函数
         * 
         * @inner
         */
        function createCallback(scriptId) {
            var name = getCallbackNameFromScriptId(scriptId);

            window[name] = curry(success, scriptId);

            return name;
        }

        function jsonp(options) {
            options = options || {};

            return new Promise(function(resolve, reject) {
                var url = options.url;
                var scriptId = getGuid('jsonp');
                var callbackName = createCallback(scriptId);

                options.data = options.data || {};
                options.data.callback = callbackName;

                load(url, scriptId, options);

                resolvers[scriptId] = resolve;
                rejecters[scriptId] = reject;
            });
        }

        return jsonp;
    }
);

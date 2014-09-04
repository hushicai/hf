/**
 * @file KeyframeEffect
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        var inherit = require('../lang/inherit');
        var extend = require('../lang/extend');
        var helper = require('./helper');
        var AnimationEffect = require('./AnimationEffect');
        var style = require('../css/style');

        // 用以转换用户的输入
        // 输入: `{opacity: 1}`
        // 输出：`{offset: null, properties: {opacity: 1}}`
        function FrameInternal(options) {
            this.offset = options.offset === undefined ? null : options.offset;
            delete options.offset;

            this.properties = {};
            // 找出有效的css属性
            for (var key in options) {
                var property = style.getCssProperty(key);

                if (property) {
                    this.properties[property] = options[property];
                }
            }
        }

        // 每个属性的keyframe
        function Keyframe(options) {
            this.property = options.property;
            this.value = options.value;
            this.offset = options.offset === undefined ? null : options.offset;
        }

        // 规范化输入
        // 设置frame offset
        function distributedFrames(frames) {
            frames = frames || [];
            // 转换为FrameInternal
            for (var i = 0, len = frames.length; i < len; i++) {
                frames[i] = new FrameInternal(frames[i]);
            }
            var length = frames.length;
            var count = 0;
            // 删除不合理offset
            for (var i = 0; i < length; i++) {
                var offset = frames[i].offset;
                if (helper.isDefinedAndNotNull(offset)) {
                    if (offset >= 0) {
                        break;
                    }
                    else {
                        count = i;
                    }
                }
            }
            frames.splice(0, count);

            length = frames.length;
            count = 0;
            for (var i = length - 1; i >= 0; i--) {
                var offset = frames[i].offset;
                if (helper.isDefinedAndNotNull(offset)) {
                    if (offset <= 1) {
                        break;
                    } 
                    else {
                        count = length - i;
                    }
                }
            }
            frames.splice(length - count, count);

            // Distribute offsets.
            length = frames.length;
            if (length > 1 && !(frames[0].offset)) {
                frames[0].offset = 0;
            }
            if (length > 0 && !(frames[length - 1].offset)) {
                frames[length - 1].offset = 1;
            }
            var lastOffsetIndex = 0;
            var nextOffsetIndex = 0;
            for (var i = 1; i < frames.length - 1; i++) {
                var keyframe = frames[i];
                if (helper.isDefinedAndNotNull(keyframe.offset)) {
                    lastOffsetIndex = i;
                    continue;
                }
                if (i > nextOffsetIndex) {
                    nextOffsetIndex = i;
                    while (helper.isDefinedAndNotNull(frames[nextOffsetIndex].offset)) {
                        nextOffsetIndex++;
                    }
                }
                var lastOffset = frames[lastOffsetIndex].offset;
                var nextOffset = frames[nextOffsetIndex].offset;
                var unspecifiedKeyframes = nextOffsetIndex - lastOffsetIndex - 1;
                var localIndex = i - lastOffsetIndex;
                frames[i].offset = lastOffset + (nextOffset - lastOffset) * localIndex / (unspecifiedKeyframes + 1);
            }

            return frames;
        }

        // 输入：
        // ```javascript
        // [
        //     {opacity: 1},
        //     {opacity: 0.5}
        // ]
        // ```
        function KeyframeEffect(target, frames) {
            AnimationEffect.call(this);

            this._keyframesDictionary = {};
            this.target = target;
            this.setFrames(frames);
        }

        KeyframeEffect.prototype = {
            constructor: KeyframeEffect,
            setFrames: function(frames) {
                frames = distributedFrames(frames);

                var keyframesDictionary = this._keyframesDictionary;
                for (var i = 0, len = frames.length; i < len; i++) {
                    var frame = frames[i];
                    var properties = frame.properties;
                    for (var property in properties) {
                        keyframesDictionary[property] = keyframesDictionary[property] || [];
                        keyframesDictionary[property].push(
                            new Keyframe({
                                property: property,
                                value: properties[property],
                                offset: frame.offset
                            })
                        );
                    }
                }

                return this;
            },

            sample: function(percent) {
                for (var property in this._keyframesDictionary) {
                    this.sampleForProperty(this._keyframesDictionary[property], percent);
                }
            },

            sampleForProperty: function(keyframes, percent) {
                var startKeyframeIndex;
                var length = keyframes.length;

                for (var i = length - 1; i >= 0; i--) {
                    if (keyframes[i].offset <= percent) {
                        startKeyframeIndex = i;
                        break;
                    }
                }

                var startKeyframe = keyframes[startKeyframeIndex];
                var endKeyframe = keyframes[startKeyframeIndex + 1];

                var nowValue;

                if (startKeyframe.offset === percent) {
                    nowValue = startKeyframe.value;
                }
                else if (endKeyframe.offset === percent) {
                    nowValue = endKeyframe.value;
                }
                else {
                    var distance = endKeyframe.value - startKeyframe.value;
                    var delta = distance * percent;

                    nowValue = startKeyframe.value + delta;
                }

                style.css(this.target, startKeyframe.property, nowValue);
            }
        };

        inherit(KeyframeEffect, AnimationEffect);

        return KeyframeEffect;
    }
);

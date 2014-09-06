/**
 * @file 缓动函数
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function(require) {
        return {
            linear: function(value) {
                return value;
            },
            easeInQuad: function(value) {
                return Math.pow(value, 2);
            },

            easeOutQuad: function(value) {
                return -(Math.pow((value-1), 2) -1);
            },

            easeInOutQuad: function(value) {
                if ((value/=0.5) < 1)  {
                    return 0.5*Math.pow(value,2);
                }
                return -0.5 * ((value-=2)*value - 2);
            },

            easeInCubic: function(value) {
                return Math.pow(value, 3);
            },

            easeOutCubic: function(value) {
                return (Math.pow((value-1), 3) +1);
            },

            easeInOutCubic: function(value) {
                if ((value/=0.5) < 1) {
                    return 0.5*Math.pow(value,3);
                } 
                return 0.5 * (Math.pow((value-2),3) + 2);
            },

            easeInQuart: function(value) {
                return Math.pow(value, 4);
            },

            easeOutQuart: function(value) {
                return -(Math.pow((value-1), 4) -1);
            },

            easeInOutQuart: function(value) {
                if ((value/=0.5) < 1) {
                    return 0.5*Math.pow(value,4);
                }
                return -0.5 * ((value-=2)*Math.pow(value,3) - 2);
            },

            easeInQuint: function(value) {
                return Math.pow(value, 5);
            },

            easeOutQuint: function(value) {
                return (Math.pow((value-1), 5) +1);
            },

            easeInOutQuint: function(value) {
                if ((value/=0.5) < 1) {
                    return 0.5*Math.pow(value,5);
                }
                return 0.5 * (Math.pow((value-2),5) + 2);
            },

            easeInSine: function(value) {
                return -Math.cos(value * (Math.PI/2)) + 1;
            },

            easeOutSine: function(value) {
                return Math.sin(value * (Math.PI/2));
            },

            easeInOutSine: function(value) {
                return (-0.5 * (Math.cos(Math.PI*value) -1));
            },

            easeInExpo: function(value) {
                return (value===0) ? 0 : Math.pow(2, 10 * (value - 1));
            },

            easeOutExpo: function(value) {
                return (value===1) ? 1 : -Math.pow(2, -10 * value) + 1;
            },

            easeInOutExpo: function(value) {
                if(value===0) {
                    return 0;
                }
                if(value === 1) {
                    return 1;
                } 
                if((value/=0.5) < 1) {
                    return 0.5 * Math.pow(2,10 * (value-1));
                }
                return 0.5 * (-Math.pow(2, -10 * --value) + 2);
            },

            easeInCirc: function(value) {
                return -(Math.sqrt(1 - (value*value)) - 1);
            },

            easeOutCirc: function(value) {
                return Math.sqrt(1 - Math.pow((value-1), 2));
            },

            easeInOutCirc: function(value) {
                if((value/=0.5) < 1) {
                    return -0.5 * (Math.sqrt(1 - value*value) - 1);
                }
                return 0.5 * (Math.sqrt(1 - (value-=2)*value) + 1);
            },

            easeOutBounce: function(value) {
                if ((value) < (1/2.75)) {
                    return (7.5625*value*value);
                } 
                else if (value < (2/2.75)) {
                    return (7.5625*(value-=(1.5/2.75))*value + 0.75);
                } 
                else if (value < (2.5/2.75)) {
                    return (7.5625*(value-=(2.25/2.75))*value + 0.9375);
                } 
                else {
                    return (7.5625*(value-=(2.625/2.75))*value + 0.984375);
                }
            },

            easeInBack: function(value) {
                var s = 1.70158;
                return (value)*value*((s+1)*value - s);
            },

            easeOutBack: function(value) {
                var s = 1.70158;
                return (value=value-1)*value*((s+1)*value + s) + 1;
            },

            easeInOutBack: function(value) {
                var s = 1.70158;
                if((value/=0.5) < 1) {
                    return 0.5*(value*value*(((s*=(1.525))+1)*value -s));
                }
                return 0.5*((value-=2)*value*(((s*=(1.525))+1)*value +s) +2);
            },

            elastic: function(value) {
                return -1 * Math.pow(4,-8*value) * Math.sin((value*6-1)*(2*Math.PI)/2) + 1;
            },

            swingFromTo: function(value) {
                var s = 1.70158;
                return ((value/=0.5) < 1) ? 0.5*(value*value*(((s*=(1.525))+1)*value - s)) :
                0.5*((value-=2)*value*(((s*=(1.525))+1)*value + s) + 2);
            },

            swingFrom: function(value) {
                var s = 1.70158;
                return value*value*((s+1)*value - s);
            },

            swingTo: function(value) {
                var s = 1.70158;
                return (value-=1)*value*((s+1)*value + s) + 1;
            },

            bounce: function(value) {
                if (value < (1/2.75)) {
                    return (7.5625*value*value);
                } else if (value < (2/2.75)) {
                    return (7.5625*(value-=(1.5/2.75))*value + 0.75);
                } else if (value < (2.5/2.75)) {
                    return (7.5625*(value-=(2.25/2.75))*value + 0.9375);
                } else {
                    return (7.5625*(value-=(2.625/2.75))*value + 0.984375);
                }
            },

            bouncePast: function(value) {
                if (value < (1/2.75)) {
                    return (7.5625*value*value);
                } else if (value < (2/2.75)) {
                    return 2 - (7.5625*(value-=(1.5/2.75))*value + 0.75);
                } else if (value < (2.5/2.75)) {
                    return 2 - (7.5625*(value-=(2.25/2.75))*value + 0.9375);
                } else {
                    return 2 - (7.5625*(value-=(2.625/2.75))*value + 0.984375);
                }
            },

            easeFromTo: function(value) {
                if ((value/=0.5) < 1) {
                    return 0.5*Math.pow(value,4);
                }
                return -0.5 * ((value-=2)*Math.pow(value,3) - 2);
            },

            easeFrom: function(value) {
                return Math.pow(value,4);
            },

            easeTo: function(value) {
                return Math.pow(value,0.25);
            }
        };
    }
);

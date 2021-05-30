!function ($) {
    let Scroll = function (ele, option) {
        let self = this;
        self.option = $.extend({}, self.defaultOption, option);
        self.ele = ele.data("web-doc-scroll-instance", self);
        self.eleWra = ele.children().eq(0);
        self.bar = $('<div class="web-doc-scroll-bar vertical"/>');
        self.barSize = 0;
        self.moveRatio = 1;
        self.maxPosition = 0;
        self.activePosition = self.option.top;
        self.size = {
            eleHeight: undefined,
            eleWraHeight: undefined,
            eleWraOriginHeight: undefined,
            scale: undefined
        };
        self.state = {
            moving: false,
            bar: false
        };
        self.init();
    };

    Scroll.prototype = {
        init: function () {
            let self = this;
            self.resize();
            self.moveToBar(self.option.top);
            self.ele.onMousewheel(function (status, event) {
                if (!event.ctrlKey && self.state.bar) {
                    self.moveBar(status ? -30 : 30);
                    return false;
                }
            });
            let barClick = false;
            self.bar.on("mousedown", function (event) {
                if (event.button === 0) {
                    barClick = true;
                    self.bar.addClass("click");
                }
            });
            let beforeY;
            $(window.document).on({
                "mousemove": function (event) {
                    if (barClick && self.state.bar) {
                        let y = event.clientY;
                        if (beforeY !== undefined) {
                            self.moveBar(y - beforeY);
                        }
                        beforeY = y;
                    }
                },
                "mouseup": function (event) {
                    if (event.button === 0) {
                        barClick = false;
                        beforeY = undefined;
                        self.bar.removeClass("click");
                    }
                }
            });
            $(window).on("resize", function () {
                self.resize();
            });
            self.ele.append(self.bar).addClass("web-doc-scroll-container");
        },
        resize: function (scale) {
            let self = this;
            let beforeEleHeight = self.size.eleHeight;
            let firstScale = false;
            if (typeof scale === "number") {
                firstScale = true;
            } else {
                scale = self.eleWra.data("scale") || 1;
            }
            let eleWraHeight = self.eleWra.innerHeight();
            self.size = {
                eleHeight: self.ele.innerHeight() - self.option.top - self.option.bottom,
                eleWraHeight: eleWraHeight * scale,
                eleWraOriginHeight: eleWraHeight,
                scale: scale
            };
            self.calcBarSize();
            if (self.size.eleWraHeight > self.size.eleHeight) {
                if (beforeEleHeight !== undefined) {
                    let initTop = 0;
                    if (firstScale) {
                        initTop = (self.size.eleWraHeight - eleWraHeight) / 2 / self.moveRatio;
                    }
                    self.moveToBar(self.option.top + initTop + (self.activePosition - self.option.top) / (beforeEleHeight / self.size.eleHeight));
                }
            } else {
                self.moveToBar();
            }
        },
        calcBarSize: function () {
            let self = this, size;
            if (self.option.barSize > 0) {
                size = self.option.barSize;
            } else {
                size = Math.ceil(self.size.eleHeight / self.size.eleWraHeight * self.size.eleHeight);
            }
            self.bar.css("height", size + "px");
            if (size >= self.size.eleHeight) {
                self.bar.hide();
                self.state.bar = false;
            } else {
                self.bar.show();
                self.state.bar = true;
            }
            self.maxPosition = self.size.eleHeight + self.option.bottom - size;
            self.barSize = size;
            self.moveRatio = (self.size.eleWraHeight - self.size.eleHeight) / (self.size.eleHeight - size);
        },
        moveBar: function (size) {
            let self = this;
            self.moveToBar(self.activePosition + size);
        },
        moveToBar: function (size) {
            let self = this;
            size = size || 0;
            let beforePosition = self.activePosition;
            self.activePosition = Math.min(size < self.option.top ? self.option.top : size, self.maxPosition < 0 ? self.option.top : self.maxPosition);
            self.bar.css("top", self.activePosition + "px");
            self.moveToContainer();
            self.option.onScroll.apply(self, [self.activePosition, beforePosition]);
        },
        moveToContainer: function (translateY) {
            let self = this;
            let scale = self.eleWra.data("scale") || 1;
            if (translateY === undefined) {
                translateY = -(self.activePosition - self.option.top) * self.moveRatio;
                translateY += (self.size.eleWraHeight - self.size.eleWraOriginHeight) / 2;
            }
            translateY += "px";
            self.eleWra.css("transform", "translateY(" + translateY + ") scale(" + scale + ")").data("translateY", translateY);
        },
        defaultOption: {
            top: 0,
            bottom: 0,
            barSize: 130,
            onScroll: function (activePosition, beforePosition) {

            }
        }
    };

    $.fn.extend({
        webDocScroll: function () {
            let params = Arrays.clone(arguments);
            let firstParam = params.shift();
            if (typeof firstParam === "string") {
                let instance = this.data("web-doc-scroll-instance");
                if (instance) {
                    let method = instance[firstParam];
                    if ($.isFunction(method)) {
                        return method.apply(instance, params);
                    }
                }
            } else {
                return new Scroll(this, firstParam);
            }
        }
    });
}(jQuery);
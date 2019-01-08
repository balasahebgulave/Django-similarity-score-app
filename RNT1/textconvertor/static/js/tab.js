/**
|------------------------------------------|
| MelonHTML5 - Royal Tab                   |
|------------------------------------------|
| @author:  Lee Le (lee@melonhtml5.com)    |
| @version: 1.01 (17 Match 2013)           |
| @website: www.melonhtml5.com             |
|------------------------------------------|
*/

var docCookies = {
    getItem: function (c) {
        return !c || !this.hasItem(c) ? null : unescape(document.cookie.replace(RegExp("(?:^|.*;\\s*)" + escape(c).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"))
    },
    setItem: function (c, a, b, d, f, g) {
        if (c && !/^(?:expires|max\-age|path|domain|secure)$/i.test(c)) {
            var e = "";
            if (b) switch (b.constructor) {
                case Number:
                    e = Infinity === b ? "; expires=Tue, 19 Jan 2038 03:14:07 GMT" : "; max-age=" + b;
                    break;
                case String:
                    e = "; expires=" + b;
                    break;
                case Date:
                    e = "; expires=" + b.toGMTString()
            }
            document.cookie =
                escape(c) + "=" + escape(a) + e + (f ? "; domain=" + f : "") + (d ? "; path=" + d : "") + (g ? "; secure" : "")
        }
    },
    removeItem: function (c, a) {
        c && this.hasItem(c) && (document.cookie = escape(c) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (a ? "; path=" + a : ""))
    },
    hasItem: function (c) {
        return RegExp("(?:^|;\\s*)" + escape(c).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=").test(document.cookie)
    }
},
    Royal_Tab_Data = {
        current_element: null,
        global_events_attached: !1,
        objects: []
    };

function Royal_Tab(c) {
    var a = this;
    $(document.body);
    this._element = c;
    this._api = new Royal_Tab_Api(a._element);
    this._tabs = a._element.children("div.tabs");
    this._views = a._element.children("div.views");
    this._menu = a._element.children("div.tabs").children("ul");
    this._view_items = this._view_scroller = this._dropdown_menu_items = this._dropdown_menu = this._menu_items = this._menu_scroller = this._sliding_menu_right = this._sliding_menu_left = null;
    this._active_menu = this._menu_scroller_wdith = this._menu_width = 0;
    this._sliding_speed =
        100;
    this._animation_speed = 300;
    this._options = {
        position: "top",
        alignment: "left",
        keyboard: !1,
        mouse: !1,
        animation: null,
        cookie: null
    };
    this._build = function () {
        a._element.data("constructor", a);
        a._options.keyboard = a._element.data("keyboard") ? !0 : !1;
        a._options.mouse = a._element.data("mouse") ? !0 : !1;
        a._options.position = a._element.data("position") ? a._element.data("position") : a._options.position;
        a._options.alignment = a._element.data("alignment") ? a._element.data("alignment") : a._options.alignment;
        a._options.animation =
            a._element.data("animation") ? a._element.data("animation") : a._options.animation;
        a._options.cookie = a._element.data("cookie") ? a._element.data("cookie") : a._options.cookie;
        a._element.addClass(a._options.position + " " + a._options.alignment + " " + a._options.animation);
        a._element.data("options", a._options);
        var b = a._menu.children("li"),
            d = a._views.children("div");
        "bottom" === a._options.position && a._tabs.insertAfter(a._views);
        a._sliding_menu_left = $("<a>").attr("href", "#").html("<span></span>").addClass("sliding_menu left").appendTo(a._tabs);
        a._sliding_menu_right = $("<a>").attr("href", "#").html("<span></span>").addClass("sliding_menu right").appendTo(a._tabs);
        a._menu_scroller = $("<div>").addClass("scroller").append(a._menu).appendTo(a._tabs);
        a._buildDropdownMenuItems(b, !0);
        a._view_scroller = $("<div>").addClass("scroller").append(d).appendTo(a._views);
        d.each(function () {
            $("<div>").append($(this)).appendTo(a._view_scroller)
        });
        a._cacheItems();
        a._active_menu = a._menu_items.filter(".active:first").index();
        a._options.cookie && docCookies.getItem(a._options.cookie) &&
            (a._active_menu = parseInt(docCookies.getItem(a._options.cookie)));
        a._tabs.click(a.Events._menuClick);
        a._dropdown_menu.click(a.Events._dropdownMenuClick);
        a._sliding_menu_left.click(a.Events._slidingMenuClick);
        a._sliding_menu_right.click(a.Events._slidingMenuClick);
        a._element.mouseenter(a.Events._mouseEnter).mouseleave(a.Events._mouseLeave);
        a._element.bind("mousewheel DOMMouseScroll", a.Events._mouseWheel);
        !0 !== Royal_Tab_Data.global_events_attached && ($(document).click(a.Events._documentClick).keydown(a.Events._documentKeyDown),
            $(window).resize(a.Events._windowResize), Royal_Tab_Data.global_events_attached = !0)
    };
    this._buildDropdownMenuItems = function (b, d) {
        var f = "";
        b.each(function () {
            var a = "";
            $(this).hasClass("disabled") ? a = ' class="disabled"' : $(this).hasClass("active") && (a = ' class="active"');
            f += "<li" + a + ">" + $(this).text() + "</li>"
        });
        d ? a._dropdown_menu = $("<a>").attr("href", "#").addClass("dropdown_menu").html("<span></span><ul>" + f + "</ul>").appendTo(a._tabs) : a._dropdown_menu.html("<span></span><ul>" + f + "</ul>");
        a._dropdown_menu_items = a._dropdown_menu.find("li")
    };
    this._cacheItems = function () {
        a._view_items = a._view_scroller.children("div");
        a._menu_items = a._menu.children("li");
        a._dropdown_menu_items = a._dropdown_menu.find("li")
    };
    this._toggleDropdown = function () {
        a._dropdown_menu.children("ul").toggleClass("open");
        a._dropdown_menu.toggleClass("open")
    };
    this._closeDropdown = function () {
        a._dropdown_menu.children("ul").removeClass("open");
        a._dropdown_menu.removeClass("open")
    };
    this._getMenuIndex = function (b) {
        0 >= b ? b = a._menu_items.not(".disabled").first().index() :
            b > a._menu_items.length - 1 && (b = a._menu_items.not(".disabled").last().index());
        return b
    };
    this._openMenu = function (b, d) {
        if (!0 !== a._element.data("animating")) {
            b = a._getMenuIndex(b);
            var f = a._view_items.eq(b);
            a._menu_items.filter(".active").removeClass("active");
            a._menu_items.eq(b).addClass("active");
            var c = function () {
                a._view_items.filter(".active").removeClass("active");
                f.addClass("active")
            };
            if (!0 === d) c();
            else if ("blind" === a._options.animation) {
                a._element.data("animating", !0);
                f.addClass("measuring");
                var e =
                    f.outerHeight();
                f.removeClass("measuring");
                a._views.animate({
                    height: e + "px"
                }, a._animation_speed, function () {
                    a._views.removeAttr("style");
                    a._element.data("animating", !1)
                });
                c()
            } else "slide" === a._options.animation ? (a._element.data("animating", !0), a._view_scroller.addClass("animating"), e = "-100%", a._active_menu > b && (a._view_scroller.css("margin-left", "-100%"), e = "0%"), f.show(), a._view_scroller.animate({
                "margin-left": e
            }, a._animation_speed, function () {
                a._view_scroller.removeAttr("style").removeClass("animating");
                f.removeAttr("style");
                c();
                a._element.data("animating", !1)
            })) : c();
            a._active_menu = b;
            null !== a._options.cookie && docCookies.setItem(a._options.cookie, b);
            a._dropdown_menu_items.filter(".active").removeClass("active");
            a._dropdown_menu_items.eq(b).addClass("active");
            a._closeDropdown();
            a._element.hasClass("sliding") && a._slideToMenu(b);
            var h = a._view_items.eq(b).children("div");
            h.data("url") && (h.data("content") ? h.html(h.data("content")) : $.ajax({
                url: h.data("url"),
                cache: !1,
                type: "POST",
                data: {},
                beforeSend: function () {
                    h.addClass("loading")
                },
                complete: function () {
                    h.removeClass("loading")
                },
                error: function () { },
                success: function (a) {
                    h.html(a);
                    h.data("content", a)
                }
            }))
        }
    };
    this._slideToMenu = function (b) {
        var d = !1,
            c = a._menu_items.eq(b),
            g = c.data("left"),
            e = c.data("right"),
            h = c.data("width"),
            j = a._getMenuPosition();
        e || (e = a._menu_width - g - h, c.data("right", e));
        g < -1 * j ? d = -1 * g : e < a._menu_width - a._menu_scroller_width - -1 * j && (e = a._menu_items.eq(b).data("right"), d = -1 * (a._menu_width - a._menu_scroller_width - e) + 1);
        !1 !== d && a._menu.animate({
            "margin-left": d + "px"
        }, a._animation_speed,
            a._checkSlidingMenu)
    };
    this._slideLeft = function () {
        var b = a._getMenuPosition(),
            b = b - a._sliding_speed,
            b = Math.max(b, -1 * a._getMaxScrolWidth());
        a._menu.animate({
            "margin-left": b + "px"
        }, a._animation_speed, a._checkSlidingMenu)
    };
    this._slideRight = function () {
        var b = a._getMenuPosition(),
            b = b + a._sliding_speed,
            b = Math.min(b, 0);
        a._menu.animate({
            "margin-left": b + "px"
        }, a._animation_speed, a._checkSlidingMenu)
    };
    this._setMenuWidth = function () {
        a._menu_width = 0;
        a._menu_items.each(function () {
            var b = $(this).outerWidth();
            $(this).data("left",
                a._menu_width);
            $(this).data("width", b);
            a._menu_width += b
        })
    };
    this._getMenuPosition = function () {
        return parseInt(a._menu.css("margin-left"), 10)
    };
    this._getMaxScrolWidth = function () {
        return a._menu_width - a._menu_scroller_width - 1
    };
    this._checkSlidingMenu = function () {
        if (a._element.hasClass("sliding")) {
            var b = a._getMenuPosition();
            if (0 <= b) a._sliding_menu_left.removeClass("disabled"), a._sliding_menu_right.addClass("disabled");
            else {
                a._sliding_menu_right.removeClass("disabled");
                var d = a._getMaxScrolWidth(); -1 * b < d ? a._sliding_menu_left.removeClass("disabled") :
                    a._sliding_menu_left.addClass("disabled")
            }
        }
    };
    this._setSize = function () {
        !0 === a._element.data("reset_menu_width") && a._setMenuWidth();
        if (a._menu_width > a._tabs.outerWidth() - a._dropdown_menu.width() - 2) {
            a._element.addClass("sliding");
            a._sliding_menu_left.removeClass("disabled");
            a._sliding_menu_right.addClass("disabled");
            var b = !0
        } else a._element.removeClass("sliding"), a._menu.removeAttr("style"), b = !1;
        a._menu_scroller_width = a._menu_scroller.width();
        if (b) {
            var b = a._getMenuPosition(),
                d = a._getMaxScrolWidth(); -1 * b > d && a._menu.css("margin-left", -1 * d)
        }
    };
    this.Events = {
        _windowResize: function () {
            $(".royal_tab").each(function () {
                $(this).data("constructor")._setSize()
            })
        },
        _documentClick: function () {
            a._api._closeAll()
        },
        _documentKeyDown: function (b) {
            if (null !== Royal_Tab_Data.current_element && !0 === Royal_Tab_Data.current_element.data("options").keyboard) switch (parseInt(b.which, 10)) {
                case 37:
                case 38:
                    b.preventDefault();
                    a._api.prev();
                    break;
                case 39:
                case 40:
                    b.preventDefault(), a._api.next()
            }
        },
        _mouseWheel: function (b) {
            null !== Royal_Tab_Data.current_element &&
                !0 === Royal_Tab_Data.current_element.data("options").mouse && (b.preventDefault(), "up" === (0 > b.originalEvent.wheelDelta || 0 < b.originalEvent.detail ? "down" : "up") ? a._api.prev() : a._api.next())
        },
        _dropdownMenuClick: function (b) {
            a._toggleDropdown(b)
        },
        _slidingMenuClick: function (b) {
            a._element.hasClass("sliding") && ($(this).hasClass("left") ? a._slideLeft(b) : a._slideRight(b))
        },
        _menuClick: function (b) {
            b.stopPropagation();
            b.preventDefault();
            b = $(b.target);
            !b.hasClass("active") && !b.hasClass("disabled") && "li" === b.prop("tagName").toLowerCase() &&
                a._openMenu(b.index())
        },
        _mouseEnter: function () {
            Royal_Tab_Data.current_element = $(this)
        },
        _mouseLeave: function () {
            Royal_Tab_Data.current_element = null
        }
    };
    Royal_Tab_Data.current_element = a._element;
    a._build();
    a._openMenu(a._active_menu, !0);
    a._setMenuWidth();
    a._setSize();
    a._checkSlidingMenu();
    a._element.addClass("loaded")
}

function Royal_Tab_Api(c) {
    var a = this,
        b = c.data("constructor");
    this._getMenuItem = function (a) {
        return b._menu_items.eq(a)
    };
    this._getDropdownMenuItem = function (a) {
        return b._dropdown_menu_items.eq(a)
    };
    this._getViewItem = function (a) {
        return b._view_items.eq(a)
    };
    this._closeAll = function () {
        $(".royal_tab a.dropdown_menu ul").removeClass("open");
        $(".royal_tab a.dropdown_menu").removeClass("open")
    };
    this.prev = function () {
        "undefined" === typeof c && (c = Royal_Tab_Data.current_element);
        for (var a = c.find("ul:first").children(),
                b = a.filter(".active").index() ; 0 < b;) {
            b--;
            var g = a.eq(b);
            if (!g.hasClass("disabled")) {
                g.click();
                break
            }
        }
    };
    this.next = function () {
        "undefined" === typeof c && (c = Royal_Tab_Data.current_element);
        for (var a = c.find("ul:first").children(), b = a.filter(".active").index() ; b < a.length - 1;) {
            b++;
            var g = a.eq(b);
            if (!g.hasClass("disabled")) {
                g.click();
                break
            }
        }
    };
    this.open = function (a) {
        b._openMenu(a, !0)
    };
    this.add = function (d, f, g, e, h) {
        g = $("<li>").text(g);
        e = h ? $("<div>").html('<div data-url="' + e + '"></div>') : $("<div>").html("<div>" + e + "</div>");
        0 === d ? (g.prependTo(c.children(".tabs").children(".scroller").children("ul")), e.prependTo(c.children(".views").children(".scroller"))) : (g.insertBefore(a._getMenuItem(d)), e.insertBefore(a._getViewItem(d)));
        b._cacheItems();
        c.data("reset_menu_width", !0);
        b._setSize();
        c.data("reset_menu_width", !1);
        !0 === f && a.open(d);
        b._buildDropdownMenuItems(b._menu_items, !1)
    };
    this.remove = function (d) {
        if (!0 !== c.data("animating") && !(1 >= b._menu_items.length)) {
            var f = a._getMenuItem(d);
            d = a._getViewItem(d);
            if (f.hasClass("active")) {
                var g =
                    f.siblings().not(".disabled").first().index();
                a.open(g)
            }
            f.remove();
            d.remove();
            b._cacheItems();
            b._buildDropdownMenuItems(b._menu_items, !1);
            c.data("reset_menu_width", !0);
            b._setSize();
            c.data("reset_menu_width", !1)
        }
    };
    this.toggle = function (b) {
        a._getMenuItem(b).hasClass("disabled") ? a.enable(b) : a.disable(b)
    };
    this.enable = function (b) {
        a._getMenuItem(b).removeClass("disabled");
        a._getDropdownMenuItem(b).removeClass("disabled")
    };
    this.disable = function (b) {
        var c = a._getMenuItem(b);
        b = a._getDropdownMenuItem(b);
        c.addClass("disabled");
        b.addClass("disabled");
        c.hasClass("active") && (c = c.siblings().not(".disabled").first().index(), a.open(c))
    };
    this.slideLeft = function () {
        c.hasClass("sliding") && c.find(".sliding_menu.left").click()
    };
    this.slideRight = function () {
        c.hasClass("sliding") && c.find(".sliding_menu.right").click()
    }
}
$(document).ready(function () {
    $(".royal_tab").each(function () {
        var c = new Royal_Tab($(this));
        Royal_Tab_Data.objects.push(c)
    })
});
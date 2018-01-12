// colResizable 1.6 - a jQuery plugin by Alvaro Prieto Lauroba http://www.bacubacu.com/colresizable/
!function (t) {
  var e, i = t(document), r = t("head"), o = null, s = {}, d = 0, n = "id", a = "px", l = "JColResizer", c = "JCLRFlex", f = parseInt, h = Math, p = navigator.userAgent.indexOf("Trident/4.0") > 0;
  try {
    e = sessionStorage
  } catch (g) {
  }
  r.append("<style type='text/css'>  .JColResizer{table-layout:fixed;} .JColResizer > tbody > tr > td, .JColResizer > tbody > tr > th{overflow:hidden}  .JCLRgrips{ height:0px; position:relative;} .JCLRgrip{margin-left:-5px; position:absolute; z-index:5; } .JCLRgrip .JColResizer{position:absolute;background-color:red;filter:alpha(opacity=1);opacity:0;width:10px;height:100%;cursor: col-resize;top:0px} .JCLRLastGrip{position:absolute; width:1px; } .JCLRgripDrag{ border-left:1px dotted black;	} .JCLRFlex{width:auto!important;} .JCLRgrip.JCLRdisabledGrip .JColResizer{cursor:default; display:none;}</style>");
  var u = function (e, i) {
    var o = t(e);
    if (o.opt = i, o.mode = i.resizeMode, o.dc = o.opt.disabledColumns, o.opt.disable)return w(o);
    var a = o.id = o.attr(n) || l + d++;
    o.p = o.opt.postbackSafe, !o.is("table") || s[a] && !o.opt.partialRefresh || ("col-resize" !== o.opt.hoverCursor && r.append("<style type='text/css'>.JCLRgrip .JColResizer:hover{cursor:" + o.opt.hoverCursor + "!important}</style>"), o.addClass(l).attr(n, a).before('<div class="JCLRgrips"/>'), o.g = [], o.c = [], o.w = o.width(), o.gc = o.prev(), o.f = o.opt.fixed, i.marginLeft && o.gc.css("marginLeft", i.marginLeft), i.marginRight && o.gc.css("marginRight", i.marginRight), o.cs = f(p ? e.cellSpacing || e.currentStyle.borderSpacing : o.css("border-spacing")) || 2, o.b = f(p ? e.border || e.currentStyle.borderLeftWidth : o.css("border-left-width")) || 1, s[a] = o, v(o))
  }, w = function (t) {
    var e = t.attr(n), t = s[e];
    t && t.is("table") && (t.removeClass(l + " " + c).gc.remove(), delete s[e])
  }, v = function (i) {
    var r = i.find(">thead>tr:first>th,>thead>tr:first>td");
    r.length || (r = i.find(">tbody>tr:first>th,>tr:first>th,>tbody>tr:first>td, >tr:first>td")), r = r.filter(":visible"), i.cg = i.find("col"), i.ln = r.length, i.p && e && e[i.id] && m(i, r), r.each(function (e) {
      var r = t(this), o = -1 != i.dc.indexOf(e), s = t(i.gc.append('<div class="JCLRgrip"></div>')[0].lastChild);
      s.append(o ? "" : i.opt.gripInnerHtml).append('<div class="' + l + '"></div>'), e == i.ln - 1 && (s.addClass("JCLRLastGrip"), i.f && s.html("")), s.bind("touchstart mousedown", J), o ? s.addClass("JCLRdisabledGrip") : s.removeClass("JCLRdisabledGrip").bind("touchstart mousedown", J), s.t = i, s.i = e, s.c = r, r.w = r.width(), i.g.push(s), i.c.push(r), r.width(r.w).removeAttr("width"), s.data(l, {
        i: e,
        t: i.attr(n),
        last: e == i.ln - 1
      })
    }), i.cg.removeAttr("width"), i.find("td, th").not(r).not("table th, table td").each(function () {
      t(this).removeAttr("width")
    }), i.f || i.removeAttr("width").addClass(c), C(i)
  }, m = function (t, i) {
    var r, o, s = 0, d = 0, n = [];
    if (i) {
      if (t.cg.removeAttr("width"), t.opt.flush)return void(e[t.id] = "");
      for (r = e[t.id].split(";"), o = r[t.ln + 1], !t.f && o && (t.width(o *= 1), t.opt.overflow && (t.css("min-width", o + a), t.w = o)); d < t.ln; d++)n.push(100 * r[d] / r[t.ln] + "%"), i.eq(d).css("width", n[d]);
      for (d = 0; d < t.ln; d++)t.cg.eq(d).css("width", n[d])
    } else {
      for (e[t.id] = ""; d < t.c.length; d++)r = t.c[d].width(), e[t.id] += r + ";", s += r;
      e[t.id] += s, t.f || (e[t.id] += ";" + t.width())
    }
  }, C = function (t) {
    t.gc.width(t.w);
    for (var e = 0; e < t.ln; e++) {
      var i = t.c[e];
      t.g[e].css({
        left: i.offset().left - t.offset().left + i.outerWidth(!1) + t.cs / 2 + a,
        height: t.opt.headerOnly ? t.c[0].outerHeight(!1) : t.outerHeight(!1)
      })
    }
  }, b = function (t, e, i) {
    var r = o.x - o.l, s = t.c[e], d = t.c[e + 1], n = s.w + r, l = d.w - r;
    s.width(n + a), t.cg.eq(e).width(n + a), t.f ? (d.width(l + a), t.cg.eq(e + 1).width(l + a)) : t.opt.overflow && t.css("min-width", t.w + r), i && (s.w = n, d.w = t.f ? l : d.w)
  }, R = function (e) {
    var i = t.map(e.c, function (t) {
      return t.width()
    });
    e.width(e.w = e.width()).removeClass(c), t.each(e.c, function (t, e) {
      e.width(i[t]).w = i[t]
    }), e.addClass(c)
  }, x = function (t) {
    if (o) {
      var e = o.t, i = t.originalEvent.touches, r = i ? i[0].pageX : t.pageX, s = r - o.ox + o.l, d = e.opt.minWidth, n = o.i, l = 1.5 * e.cs + d + e.b, c = n == e.ln - 1, f = n ? e.g[n - 1].position().left + e.cs + d : l, p = e.f ? n == e.ln - 1 ? e.w - l : e.g[n + 1].position().left - e.cs - d : 1 / 0;
      if (s = h.max(f, h.min(p, s)), o.x = s, o.css("left", s + a), c) {
        var g = e.c[o.i];
        o.w = g.w + s - o.l
      }
      if (e.opt.liveDrag) {
        c ? (g.width(o.w), !e.f && e.opt.overflow ? e.css("min-width", e.w + s - o.l) : e.w = e.width()) : b(e, n), C(e);
        var u = e.opt.onDrag;
        u && (t.currentTarget = e[0], u(t))
      }
      return !1
    }
  }, y = function (r) {
    if (i.unbind("touchend." + l + " mouseup." + l).unbind("touchmove." + l + " mousemove." + l), t("head :last-child").remove(), o) {
      if (o.removeClass(o.t.opt.draggingClass), o.x - o.l != 0) {
        var s = o.t, d = s.opt.onResize, n = o.i, a = n == s.ln - 1, c = s.g[n].c;
        a ? (c.width(o.w), c.w = o.w) : b(s, n, !0), s.f || R(s), C(s), d && (r.currentTarget = s[0], d(r)), s.p && e && m(s)
      }
      o = null
    }
  }, J = function (e) {
    var d = t(this).data(l), n = s[d.t], a = n.g[d.i], c = e.originalEvent.touches;
    if (a.ox = c ? c[0].pageX : e.pageX, a.l = a.position().left, a.x = a.l, i.bind("touchmove." + l + " mousemove." + l, x).bind("touchend." + l + " mouseup." + l, y), r.append("<style type='text/css'>*{cursor:" + n.opt.dragCursor + "!important}</style>"), a.addClass(n.opt.draggingClass), o = a, n.c[d.i].l)for (var f, h = 0; h < n.ln; h++)f = n.c[h], f.l = !1, f.w = f.width();
    return !1
  }, L = function () {
    for (var t in s)if (s.hasOwnProperty(t)) {
      t = s[t];
      var i, r = 0;
      if (t.removeClass(l), t.f) {
        for (t.w = t.width(), i = 0; i < t.ln; i++)r += t.c[i].w;
        for (i = 0; i < t.ln; i++)t.c[i].css("width", h.round(1e3 * t.c[i].w / r) / 10 + "%").l = !0
      } else R(t), "flex" == t.mode && t.p && e && m(t);
      C(t.addClass(l))
    }
  };
  t(window).bind("resize." + l, L), t.fn.extend({
    colResizable: function (e) {
      var i = {
        resizeMode: "fit",
        draggingClass: "JCLRgripDrag",
        gripInnerHtml: "",
        liveDrag: !1,
        minWidth: 15,
        headerOnly: !1,
        hoverCursor: "col-resize",
        dragCursor: "col-resize",
        postbackSafe: !1,
        flush: !1,
        marginLeft: null,
        marginRight: null,
        disable: !1,
        partialRefresh: !1,
        disabledColumns: [],
        onDrag: null,
        onResize: null
      }, e = t.extend(i, e);
      switch (e.fixed = !0, e.overflow = !1, e.resizeMode) {
        case"flex":
          e.fixed = !1;
          break;
        case"overflow":
          e.fixed = !1, e.overflow = !0
      }
      return this.each(function () {
        u(this, e)
      })
    }
  })
}(jQuery);

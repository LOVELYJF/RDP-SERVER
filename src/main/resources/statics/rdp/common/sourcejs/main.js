var hot, selectedCell, tempStyle, tempTableData, uuid = "",
    tableInitFlag = !1,
    TableData = {
        mergeCells: [],
        colWidths: [],
        rowHeights: [],
        rowCategory: {},
        overlapping: [],
        toolbar: "top",
        page: 10,
        pageorder: 1,
        maxR: 0,
        maxC: 0,
        skinType: 0,
        uuid: "",
        reportStyle: "D",
        reportDescription: "",
        reportVersion: "1.0",
        reportMemo: "",
        mainUuid: ""
    };
function initRowType(e, t) {
    var a = $(".ht_clone_left .wtHolder table.htCore tbody tr"),
        o = function(e, t) {
            a.eq(e).find("th a.rowtype").remove(),
                a.eq(e).find("th").append('<a class="rowtype rowtype_' + t + '"></a>')
        };
    null != e && void 0 !== e && "" != e ? o(e, t) : $.each(TableData.row,
        function(e, t) {
            o(e, t.rowCategory)
        })
}
function init() {
    $.fn.zTree.init($("#fillReports"), settingForFillReport, zNodesForFillReport),
        $.fn.zTree.init($("#dataSets"), settingForSets, zNodesForSets),
        $.fn.zTree.init($("#dataParms"), settingForParms, zNodesForParms);
    $.fn.zTree.init($("#dataExpertree"), dataExprSetting, dataExprZNodes);
    $("#czz input").click(function() {
        filld(" " + $(this).val() + " ")
    })
}
function initColWidthAndHeight() {
    for (var e = hot.Methods.countCols() - 1, t = [], a = 0; a <= e; a++) t.push(hot.Methods.getColWidth(a));
    TableData.colWidths = t;
    var o = hot.Methods.countRows() - 1,
        l = [];
    for (a = 0; a <= o; a++) l.push(hot.Methods.getRowHeight(a));
    TableData.rowHeights = l
}
function getTabelData(e) {
    e || hot.Methods.deselectCell();
    var t = 0,
        a = 0,
        o = 1,
        l = 1;
    0 < hot.Methods.countRows() && (o = hot.Methods.countRows() - 1),
    0 < hot.Methods.countCols() && (l = hot.Methods.countCols() - 1);
    try {
        for (var r = hot.Methods.getSourceData(0, 0, o, l), n = 0; n < r.length; n++) for (var s = 0; s < r[n].length; s++) r[n][s] && (t = t < n ? n: t, a = a < s ? s: a)
    } catch(e) {
        console.error(e)
    }
    TableData.mergeCells = getMergeCells(TableData);
    var i = TableData.mergeCells;
    for (n = 0; n < i.length; n++) {
        t = (c = (u = i[n]).row + u.rowspan - 1) < t ? t: c,
            a = (d = u.col + u.colspan - 1) < a ? a: d
    }
    TableData.maxR = t,
        TableData.maxC = a,
        TableData.skinType = $("#skinType").val(),
        TableData.row = [];
    for (n = 0; n <= TableData.maxR; n++) {
        var c = {
            col: []
        };
        for (s = 0; s <= TableData.maxC; s++) {
            var d, h = hot.Methods.getCellMeta(n, s),
                f = h.value; (d = {}).value = f,
                d.width = hot.Methods.getColWidth(s),
                d.colwidth = getTDWidth(n, s, i),
                d.height = hot.Methods.getRowHeight(n),
                d.col = h.col,
                d.row = h.row,
                d.exptext = h.exptext,
                d.ds = h.ds,
                d.frameid = h.frameid,
                d.link = h.link,
                d.columnType = h.columnType,
                d.columnName = h.columnName,
                d.dic = h.dic,
                d.image = h.image,
                d.bgimage = h.bgimage,
                d.overlapping = h.overlapping,
                d.warnings = h.warnings,
                d.barCode = h.barCode,
                d.fill = h.fill,
                d.style = $.extend(!0, {
                        font_family: "SimSun"
                    },
                    h.style),
            d.style.font_family && "null" != d.style.font_family || (d.style.font_family = "SimSun"),
            d.style.font_size && "null" != d.style.font_size || (d.style.font_size = "12px"),
                d.className = h.className,
                c.col.push(d),
                TableData.colWidths[s] = hot.Methods.getColWidth(s),
                TableData.rowHeights[n] = hot.Methods.getRowHeight(n)
        }
        var g = hot.Methods.getCellMeta(n, 0);
        c.rowCategory = g.rowCategory ? g.rowCategory: "reporthead",
            TableData.row.push(c)
    }
    for (n = 0; n < i.length; n++) {
        var u = i[n];
        TableData.row[u.row].rowspan = u.rowspan,
            TableData.row[u.row].col[u.col].rowspan = u.rowspan,
            TableData.row[u.row].col[u.col].colspan = u.colspan
    }
    var p = $.fn.zTree.getZTreeObj("fillReports"),
        m = p.transformTozTreeNodes(p.getNodes()),
        b = $.fn.zTree.getZTreeObj("dataSets"),
        v = b.transformTozTreeNodes(b.getNodes()),
        C = $.fn.zTree.getZTreeObj("dataParms"),
        y = C.transformTozTreeNodes(C.getNodes());
    return TableData.fillReports = getFillReportNodesVal(m),
        TableData.dataSets = getDataSetsNodesVal(v),
        TableData.dataParms = getDataParmsNodesVal(y),
        TableData.reportDescription = $("#reportTitleInput").val(),
        TableData.custom = panel.getPanelVal(),
        tempTableData = $.extend(!0, {},
            TableData),
        TableData.queryArea = panel.getEncodeVal(),
        tempTableData
}
function tb_modif() {
    getTabelData(),
        uuid && "null" != uuid ? (tempTableData = $.extend(!0, {},
            TableData), $.rdp.ajax({
            url: "../../rdp/saveReport",
            data: {
                report: Base64Util.encode64(JSON.stringify(tempTableData)),
                uuid: uuid
            },
            type: "post",
            success: function(e) {
                layer.msg(e.msg)
            }
        })) : layer.prompt({
                title: "请输入报表名称"
            },
            function(l, e, t) {
                null != l && "" != l && layer.prompt({
                        value: l,
                        title: "请输入简要的描述"
                    },
                    function(e, t, a) {
                        if (null != e && "" != e) {
                            var o = guid();
                            uuid = o,
                                TableData.uuid = o,
                                TableData.mainUuid = o,
                                TableData.reportDescription = l,
                                TableData.reportMemo = e,
                                TableData.reportVersion = "1.0",
                                TableData.reportStyle = "D",
                                TableData.fileName = o + ".xml",
                                tempTableData = $.extend(!0, {},
                                    TableData),
                                $.rdp.ajax({
                                    url: "../../rdp/saveReport",
                                    data: {
                                        report: Base64Util.encode64(JSON.stringify(tempTableData)),
                                        uuid: uuid
                                    },
                                    type: "post",
                                    success: function(e) {
                                        layer.msg(e.msg);
                                        history.pushState({},
                                            l, "../rdp/rdpDesign.html?uuid=" + uuid),
                                            $("#reportTitle").html(l),
                                            $("#reportTitleInput").val(l),
                                            panel.pboxInit(TableData.dataParms),
                                            panel.init(TableData.queryArea)
                                    }
                                })
                        }
                        layer.close(t)
                    }),
                    layer.close(e)
            })
}
function tb_save() {
    getTabelData(),
        layer.prompt({
                title: "请输入报表名称"
            },
            function(l, e, t) {
                null != l && "" != l && layer.prompt({
                        value: l,
                        title: "请输入简要的描述"
                    },
                    function(e, t, a) {
                        if (null != e && "" != e) {
                            var o = guid();
                            uuid = o,
                                TableData.uuid = o,
                                TableData.mainUuid = o,
                                TableData.reportDescription = l,
                                TableData.reportMemo = e,
                                TableData.reportVersion = "1.0",
                                TableData.reportStyle = "D",
                                TableData.fileName = o + ".xml",
                                tempTableData = $.extend(!0, {},
                                    TableData),
                                $.rdp.ajax({
                                    url: "../../rdp/saveReport",
                                    data: {
                                        report: Base64Util.encode64(JSON.stringify(tempTableData)),
                                        uuid: uuid
                                    },
                                    type: "post",
                                    success: function(e) {
                                        layer.msg(e.msg);
                                        history.pushState({},
                                            l, "../rdp/rdpDesign.html?uuid=" + uuid),
                                            $("#reportTitle").html(l),
                                            $("#reportTitleInput").val(l)
                                    }
                                })
                        }
                        layer.close(t)
                    }),
                    layer.close(e)
            })
}
function tb_view() {
    window.open("../../rdppage/designShow", "_designShow", "left=0,top=0,width=" + (screen.availWidth - 10) + ",height=" + (screen.availHeight - 50) + ",toolbar=no, menubar=no, scrollbars=no, resizable=yes,location=no, status=no")
}
function tb_upload() {
    layer.msg("导入"),
        $("#uploadCells").click()
}
function tb_paste() {}
function tb_copy() {}
function tb_cut() {}
function tb_fontfamily() {}
function tb_merge() {
    selectedCell = hot.Methods.getSelected(),
        hot.Methods.mergeSelection()
}
function tb_split() {
    selectedCell = hot.Methods.getSelected(),
        hot.Methods.unmergeSelection()
}
function tb_wrap() {
    var e = getRange(hot.Methods.getSelected());
    if (e) {
        hot.Methods.deselectCell();
        for (var t = e,
                 a = t[0]; a <= t[2]; a++) for (var o = t[1]; o <= t[3]; o++) {
            var l = hot.Methods.getCellMeta(a, o).style || {},
                r = hot.Methods.getCell(a, o);
            l.white_space && "normal" == l.white_space ? (delete l.white_space, $(r).css("white-space", ""), $(".toolbars .group .tag-btn.wrap-btn").removeClass("on")) : (l.white_space = "normal", $(r).css("white_space", "normal"), $(".toolbars .group .tag-btn.wrap-btn").addClass("on")),
                hot.Methods.setCellMeta(a, o, "style", l)
        }
        hot.Methods.selectCell(t[0], t[1], t[2], t[3])
    }
}
function tb_category(e) {
    var t = hot.Methods.getSelectedRange();
    if (t) for (var a = t[0], o = a.from, l = a.to, r = o.row < l.row ? o.row: l.row, n = o.row > l.row ? o.row: l.row, s = r; s <= n; s++) console.log(e.value),
        hot.Methods.setCellMeta(s, 0, "rowCategory", e.value),
        initRowType(s, e.value)
}
function tb_toolbarpos(e) {
    TableData.toolbar = e.value
}
function tb_frame() {}
function tb_exp() {}
function tb_width(e) {
    var t = hot.Methods.getSelected();
    t && (hot.Methods.disablePlugin(), TableData.colWidths[t[0][1]] = Number(e), tb_updateSettings(), hot.Methods.enablePlugin())
}
function tb_height(e) {
    var t = hot.Methods.getSelected();
    t && (hot.Methods.disablePlugin(), TableData.rowHeights[t[0][0]] = Number(e), tb_updateSettings(), hot.Methods.enablePlugin())
}
function tb_updateSettings() {
    var e = getMergeCells(TableData);
    TableData.mergeCells = [],
        hot.Methods.updateSettings({
            rowHeights: TableData.rowHeights,
            colWidths: TableData.colWidths,
            mergeCells: e
        }),
        hot.Methods.render()
}
function tb_orientation(e) {
    TableData.pageorder = $(e).val()
}
function tb_paging(e) {
    TableData.page = $(e).val()
}
function tb_cellval(e) {
    var t = hot.Methods.getSelected();
    t && hot.Methods.setDataAtCell(t[0][0], t[0][1], e)
}
function tb_parmdic() {}
function getRange(e) {
    var t = hot.Methods.getSelected();
    if (0 < e.length && t) {
        var a = e[0],
            o = t[0];
        if (a[0] != o[0] || a[1] != o[1]) return null;
        var l, r, n, s, i = [];
        return l = a[0] < a[2] ? a[0] : a[2],
            n = a[0] > a[2] ? a[0] : a[2],
            r = a[1] < a[3] ? a[1] : a[3],
            s = a[1] > a[3] ? a[1] : a[3],
            i.push(l),
            i.push(r),
            i.push(n),
            i.push(s),
            i
    }
    return null
}
function setCellval(e) {
    $("#cellval").val(e)
}
function getBgColor(e) {
    $("#bgColor").spectrum("set", e)
}
function getFontColor(e) {
    $("#fontColor").spectrum("set", e)
}
function setBgColor(e) {
    var t = getRange(selectedCell);
    if (t) {
        var a, o, l, r, n = t;
        a = n[0] < n[2] ? n[0] : n[2],
            l = n[0] > n[2] ? n[0] : n[2],
            o = n[1] < n[3] ? n[1] : n[3],
            r = n[1] > n[3] ? n[1] : n[3];
        for (var s = a; s <= l; s++) for (var i = o; i <= r; i++) {
            var c = hot.Methods.getCellMeta(s, i).style || {};
            c.background_color = e,
                hot.Methods.setCellMeta(s, i, "style", c);
            var d = hot.Methods.getCell(s, i);
            $(d).css("background-color", e)
        }
        cPush("setBgColor")
    }
}
function setFontColor(e) {
    var t = getRange(selectedCell);
    if (t) {
        for (var a = t,
                 o = a[0]; o <= a[2]; o++) for (var l = a[1]; l <= a[3]; l++) {
            var r = hot.Methods.getCellMeta(o, l).style || {};
            r.color = e,
                hot.Methods.setCellMeta(o, l, "style", r);
            var n = hot.Methods.getCell(o, l);
            $(n).css("color", e)
        }
        cPush("setFontColor")
    }
}
function hotbeforeRenderer(e, t, a, o, l, r) {
    var n = r.style || {};
    r.className = "",
        $.each(n,
            function(e, t) {
                switch (e = e.replace(/_/g, "-")) {
                    case "vertical-align":
                        "middle" == t ? r.className += " htMiddle": "top" == t ? r.className += " htTop": "bottom" == t && (r.className += " htBottom");
                        break;
                    case "text-align":
                        "center" == t ? r.className += " htCenter": "left" == t ? r.className += " htLeft": "right" == t && (r.className += " htRight")
                }
            })
}
function serMaxRC(e, t) {
    TableData.maxR = e > TableData.maxR ? e: TableData.maxR,
        TableData.maxC = t > TableData.maxC ? t: TableData.maxC
}
function hotafterRenderer(a, o, l, e, t, r) {
    var n = r.style || {},
        s = r.fill || {};
    $.each(n,
        function(e, t) {
            switch (serMaxRC(o, l), e = e.replace(/_/g, "-")) {
                case "vertical-align":
                case "text-align":
                    break;
                case "font-style":
                    "italic" == t && $(a).addClass("italic");
                    break;
                case "font-weight":
                    "700" == t && $(a).addClass("bold");
                    break;
                case "text-decoration":
                    -1 < $.inArray("underline", n.text_decoration) && $(a).addClass("underline"),
                    -1 < $.inArray("strike", n.text_decoration) && $(a).addClass("strike"),
                    -1 < $.inArray("underline", n.text_decoration) && -1 < $.inArray("strike", n.text_decoration) && $(a).addClass("strike-underline");
                    break;
                default:
                    $(a).css(e, t)
            }
        }),
        $.each(s,
            function(e, t) {
                "ctType" == e && "" != t && (serMaxRC(o, l), $(a).addClass("fillclass"))
            });
    var i = r.overlapping;
    i && i.base64 && (serMaxRC(o, l), a.style.backgroundImage = 'url("' + i.base64 + '")', a.style.backgroundRepeat = "no-repeat");
    var c = r.bgimage;
    c && (serMaxRC(o, l), a.style.backgroundImage = 'url("' + c + '")', a.style.backgroundRepeat = "no-repeat")
}
function hotafterColumnResize(e, t, a) {
    $.each(TableData.overlapping,
        function(a, e) {
            e && $.each(e,
                function(e, t) {
                    t && createLine(null, a, e)
                })
        })
}
function hotafterRowResize(e, t, a) {
    $.each(TableData.overlapping,
        function(a, e) {
            e && $.each(e,
                function(e, t) {
                    t && createLine(null, a, e)
                })
        })
}
function hotafterSelection(e, t, a, o, l, r) {
    var n = hot.Methods.getCellMeta(e, t);
    n.exptext ? (setCellval(n.exptext), $("#exptext").val(n.exptext.replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&"))) : (setCellval(n.value), $("#exptext").val(""));
    var s = n.style || {},
        i = (n.className || "").split(" ");
    $(".toolbars .group .tag-btn").removeClass("on");
    for (var c = 0; c < i.length; c++) $(".btn-" + i[c]).addClass("on");
    $("#fontfamily").val(""),
        $("#fontsize").val("12px").trigger("change"),
        $.each(s,
            function(e, t) {
                switch (e = e.replace(/_/g, "-")) {
                    case "vertical-align":
                    case "text-align":
                        break;
                    case "font-family":
                        $("#fontfamily").val(t);
                        break;
                    case "white-space":
                        "normal" == t && $(".toolbars .group .tag-btn.wrap-btn").addClass("on");
                        break;
                    case "font-size":
                        $("#fontsize").val(t).trigger("change");
                        break;
                    case "font-style":
                        "italic" == t && $(".toolbars .group .tag-btn.btn-italic").addClass("on");
                        break;
                    case "font-weight":
                        "700" == t && $(".toolbars .group .tag-btn.btn-bold").addClass("on");
                        break;
                    case "text-decoration":
                        -1 < $.inArray("underline", s.text_decoration) && $(".toolbars .group .tag-btn.btn-underline").addClass("on"),
                        -1 < $.inArray("strike", s.text_decoration) && $(".toolbars .group .tag-btn.btn-strike").addClass("on");
                        break;
                    case "background-color":
                        getBgColor(t);
                        break;
                    case "color":
                        getFontColor(t)
                }
            });
    var d = hot.Methods.getColWidth(t);
    $("#cell-width").val(d);
    var h = hot.Methods.getRowHeight(e);
    $("#cell-height").val(h);
    hot.Methods.getCell(e, t, !0);
    var f = hot.Methods.getCellMeta(e, 0);
    $("#category").val(f.rowCategory),
        $("#parmdic").val(n.dic)
}
function contextMenuCallback(e, t) {
    switch (e) {
        case "alignment:left":
            setAlignmentH("htLeft");
            break;
        case "alignment:center":
            setAlignmentH("htCenter");
            break;
        case "alignment:right":
            setAlignmentH("htRight");
            break;
        case "alignment:top":
            setAlignmentV("htTop");
            break;
        case "alignment:middle":
            setAlignmentV("htMiddle");
            break;
        case "alignment:bottom":
            setAlignmentV("htBottom");
            break;
        case "hot:subreport":
            addSubReport();
            break;
        case "hot:removesubreport":
            removeReport();
            break;
        case "hot:link":
            addLink();
            break;
        case "hot:removelink":
            removeLink();
            break;
        case "hot:removeDataDic":
            removeDataDic();
            break;
        case "copyStyle":
            copyStyle();
            break;
        case "pasteStyle":
            pasteStyle();
            break;
        case "hot:overlapping":
            setOverlapping();
            break;
        case "hot:importimage":
            importImage();
            break;
        case "hot:clearimage":
            clearImage();
            break;
        case "hot:addImage":
            addImage();
            break;
        case "hot:clearoverlapping":
            clearoverlapping()
    }
}
function dataType(e) {
    return null === e ? "Null": void 0 === e ? "Undefined": Object.prototype.toString.call(e).slice(8, -1)
}
function dealObjectValue(e) {
    var t = {};
    if (null == e || "" === e) return t;
    for (var a in e)"Object" === dataType(e[a]) ? t[a] = dealObjectValue(e[a]) : null !== e[a] && void 0 !== e[a] && "" !== e[a] && (t[a] = e[a]);
    return t
}
function loadData(e) {
    if (!e) return console.info("数据为空"),
        !1;
    e = dealObjectValue(e),
        (TableData = $.extend(!0, TableData, e)).row = e.row,
        e.mergeCells && 0 != e.mergeCells.length ? TableData.mergeCells = e.mergeCells: TableData.mergeCells = [],
        $("#reportTitle").html(TableData.reportDescription),
        $("#reportTitleInput").val(TableData.reportDescription);
    for (var t = e.row,
             a = [], o = 0; o < t.length; o++) {
        a[o] || (a[o] = []);
        for (var l = 0; l < t[o].col.length; l++) a[o][l] = t[o].col[l].value
    }
    0 == a.length && (a[0] = [""]),
        hot.Methods.loadData(a);
    for (o = 0; o < t.length; o++) {
        for (l = 0; l < t[o].col.length; l++) {
            var r = $.extend(!0, {},
                t[o].col[l]);
            hot.Methods.setCellMetaObject(o, l, r);
            var n = r.image;
            n && cellCreateImage(n, o, l)
        }
        hot.Methods.setCellMeta(o, 0, "rowCategory", t[o].rowCategory)
    }
    hot.Methods.render(),
        tb_updateSettings(),
        $("#orientation").val(TableData.pageorder),
        $("#paging").val(TableData.page),
        $("#toolbarpos").val(TableData.toolbar),
        $("#skinType").val(TableData.skinType),
    e.fillReports && 0 < e.fillReports.length && $.fn.zTree.init($("#fillReports"), settingForFillReport, setFillReportNodesVal(e.fillReports)),
    e.dataSets && 0 < e.dataSets.length && $.fn.zTree.init($("#dataSets"), settingForSets, setDataSetsNodesVal(e.dataSets)),
    e.dataParms && 0 < e.dataParms.length && $.fn.zTree.init($("#dataParms"), settingForParms, setDataParmsNodesVal(e.dataParms)),
        initRowType(),
        panel.pboxInit(TableData.dataParms),
        panel.init(TableData.queryArea)
}
function loadCellData(e) {
    if (!e) return console.info("数据为空"),
        !1;
    TableData = $.extend(!0, TableData, e),
        $("#reportTitle").html(TableData.reportDescription),
        $("#reportTitleInput").val(TableData.reportDescription),
        hot.Methods.disablePlugin();
    for (var t = e.row,
             a = [], o = 0; o < t.length; o++) {
        a[o] || (a[o] = []);
        for (var l = 0; l < t[o].col.length; l++) a[o][l] = t[o].col[l].value
    }
    var r = getMergeCells(e);
    TableData.mergeCells = [],
        hot.Methods.loadData(a),
        hot.Methods.updateSettings({
            colWidths: e.colWidths,
            rowHeights: e.rowHeights,
            mergeCells: r
        });
    for (o = 0; o < t.length; o++) {
        for (l = 0; l < t[o].col.length; l++) {
            var n = $.extend(!0, {},
                t[o].col[l]);
            hot.Methods.setCellMetaObject(o, l, n)
        }
        hot.Methods.setCellMeta(o, 0, "rowCategory", t[o].rowCategory)
    }
    hot.Methods.enablePlugin(),
        hot.Methods.render()
}
function mergeCells(e, t, a) {
    var o = TableData.mergeCells;
    if (t) o.push(a);
    else {
        for (var l = [], r = 0; r < o.length; r++) {
            var n = o[r];
            e.from.row == n.row && e.from.col == n.col && e.to.row == n.row + n.rowspan - 1 && e.to.col == n.col + n.colspan - 1 && l.push(r)
        }
        for (var s = l.length - 1; 0 <= s; s--) o.splice(l[s], 1)
    }
    cPush("mergeCells")
}
function getMergeCells(e) {
    var t = [],
        a = e.mergeCells;
    if (a) for (var o = 0; o < a.length; o++) 0 <= a[o].row && 0 <= a[o].col && (1 < a[o].colspan || 1 < a[o].rowspan) && t.push(a[o]);
    return t
}
function setFontFamily(e) {
    var t = e.value,
        a = hot.Methods.getSelected();
    if (a) {
        for (var o = a[0], l = o[0]; l <= o[2]; l++) for (var r = o[1]; r <= o[3]; r++) {
            var n = hot.Methods.getCellMeta(l, r).style || {},
                s = hot.Methods.getCell(l, r);
            n.font_family = t,
                $(s).css("font-family", t),
                hot.Methods.setCellMeta(l, r, "style", n)
        }
        cPush("setFontFamily")
    }
}
function setFontSize(e) {
    var t = e,
        a = hot.Methods.getSelected();
    if (a) {
        for (var o = a[0], l = o[0]; l <= o[2]; l++) for (var r = o[1]; r <= o[3]; r++) {
            var n = hot.Methods.getCellMeta(l, r).style || {},
                s = hot.Methods.getCell(l, r);
            n.font_size = t,
                $(s).css("font-size", t),
                hot.Methods.setCellMeta(l, r, "style", n)
        }
        cPush("setFontSize")
    }
}
function setFontStyle(e) {
    var t = hot.Methods.getSelected();
    if (t) {
        for (var a = t[0], o = a[0]; o <= a[2]; o++) for (var l = a[1]; l <= a[3]; l++) {
            var r = hot.Methods.getCellMeta(o, l).style || {},
                n = hot.Methods.getCell(o, l);
            if ("italic" == e) r.font_style && "italic" == r.font_style ? (r.font_style = "normal", $(n).removeClass("italic"), $(".toolbars .group .tag-btn.btn-italic").removeClass("on")) : (r.font_style = "italic", $(n).addClass("italic"), $(".toolbars .group .tag-btn.btn-italic").addClass("on"));
            else if ("700" == e) r.font_weight && "700" == r.font_weight ? (r.font_weight = "normal", $(n).removeClass("bold"), $(".toolbars .group .tag-btn.btn-bold").removeClass("on")) : (r.font_weight = "700", $(n).addClass("bold"), $(".toolbars .group .tag-btn.btn-bold").addClass("on"));
            else if ("underline" == e) {
                if (r.text_decoration && -1 < $.inArray("underline", r.text_decoration)) {
                    var s = $.inArray("underline", r.text_decoration);
                    r.text_decoration.splice(s, 1),
                        $(n).removeClass("underline"),
                        $(".toolbars .group .tag-btn.btn-underline").removeClass("on")
                } else r.text_decoration || (r.text_decoration = []),
                    r.text_decoration.push("underline"),
                    $(n).addClass("underline"),
                    $(".toolbars .group .tag-btn.btn-underline").addClass("on"); - 1 < $.inArray("underline", r.text_decoration) && -1 < $.inArray("strike", r.text_decoration) ? $(n).addClass("strike-underline") : $(n).removeClass("strike-underline")
            } else if ("strike" == e) {
                if (r.text_decoration && -1 < $.inArray("strike", r.text_decoration)) {
                    s = $.inArray("strike", r.text_decoration);
                    r.text_decoration.splice(s, 1),
                        $(n).removeClass("strike"),
                        $(".toolbars .group .tag-btn.btn-strike").removeClass("on")
                } else r.text_decoration || (r.text_decoration = []),
                    r.text_decoration.push("strike"),
                    $(n).addClass("strike"),
                    $(".toolbars .group .tag-btn.btn-strike").addClass("on"); - 1 < $.inArray("underline", r.text_decoration) && -1 < $.inArray("strike", r.text_decoration) ? $(n).addClass("strike-underline") : $(n).removeClass("strike-underline")
            }
            hot.Methods.setCellMeta(o, l, "style", r)
        }
        cPush("setFontStyle")
    }
}
function setAlignmentV(e) {
    $(".btn-av").removeClass("on"),
        $(".btn-" + e).addClass("on");
    var t = hot.Methods.getSelected();
    if (t) {
        for (var a = getRange(t), o = a[0]; o <= a[2]; o++) for (var l = a[1]; l <= a[3]; l++) {
            var r = hot.Methods.getCellMeta(o, l),
                n = r.className || "",
                s = hot.Methods.getCell(o, l),
                i = r.style || {};
            switch ($(s).removeClass("htTop").removeClass("htMiddle").removeClass("htBottom"), n = n.replace(/htTop|htMiddle|htBottom/, ""), e) {
                case "htTop":
                    n += " htTop",
                        $(s).addClass("htTop"),
                        i.vertical_align = "top";
                    break;
                case "htMiddle":
                    n += " htMiddle",
                        $(s).addClass("htMiddle"),
                        i.vertical_align = "middle";
                    break;
                case "htBottom":
                    n += " htBottom",
                        $(s).addClass("htBottom"),
                        i.vertical_align = "bottom"
            }
            hot.Methods.setCellMeta(o, l, "className", n),
                hot.Methods.setCellMeta(o, l, "style", i)
        }
        cPush("setAlignmentV")
    }
}
function setAlignmentH(e) {
    $(".btn-ah").removeClass("on"),
        $(".btn-" + e).addClass("on");
    var t = hot.Methods.getSelected();
    if (t) {
        for (var a = getRange(t), o = a[0]; o <= a[2]; o++) for (var l = a[1]; l <= a[3]; l++) {
            var r = hot.Methods.getCellMeta(o, l),
                n = r.className || "",
                s = r.style || {},
                i = hot.Methods.getCell(o, l);
            switch ($(i).removeClass("htLeft").removeClass("htCenter").removeClass("htRight"), n = n.replace(/htLeft|htCenter|htRight/, ""), e) {
                case "htLeft":
                    n += " htLeft",
                        $(i).addClass("htLeft"),
                        s.text_align = "left";
                    break;
                case "htCenter":
                    n += " htCenter",
                        $(i).addClass("htCenter"),
                        s.text_align = "center";
                    break;
                case "htRight":
                    n += " htRight",
                        $(i).addClass("htRight"),
                        s.text_align = "right"
            }
            hot.Methods.setCellMeta(o, l, "className", n),
                hot.Methods.setCellMeta(o, l, "style", s)
        }
        cPush("setAlignmentH")
    }
}
function getDomAllVals(e) {
    for (var t = e.getElementsByTagName("INPUT"), a = e.getElementsByTagName("TEXTAREA"), o = e.getElementsByTagName("SELECT"), l = {},
             r = 0; r < t.length; r++) t[r].name && ("checkbox" == t[r].type ? l[t[r].name] = t[r].checked: l[t[r].name] = t[r].value);
    for (r = 0; r < a.length; r++) a[r].name && (l[a[r].name] = a[r].value);
    for (r = 0; r < o.length; r++) o[r].name && (l[o[r].name] = o[r].value);
    if (0 < $("#columu_cell tr").length) {
        var n = [];
        $("#columu_cell tr").each(function(e, t) {
            var a = {};
            a.name = $(this).find('td[name="column"]').text() + "<--" + $(this).find('td[name="cell"]').text(),
                a.primary = $(this).find('input[name="primary"]').is(":checked") ? "1": "0",
                a.foreign = $(this).find('input[name="foreign"]').is(":checked") ? "1": "0",
                a.column = $(this).find('td[name="column"]').text(),
                a.cell = $(this).find('td[name="cell"]').text(),
                a.remark = $(this).find('td[name="remark"]').text(),
                n.push(a)
        }),
            l.fields = n
    }
    return l
}
function setDomAllVals(a, e) {
    for (var t = a.getElementsByTagName("INPUT"), o = a.getElementsByTagName("TEXTAREA"), l = a.getElementsByTagName("SELECT"), r = 0; r < t.length; r++) t[r].name && ("checkbox" == t[r].type ? t[r].checked = !1 : t[r].value = "");
    for (r = 0; r < o.length; r++) o[r].name && (o[r].value = "");
    for (r = 0; r < l.length; r++) l[r].name && (l[r].value = "");
    e && ($.each(e,
        function(e, t) {
            "checkbox" == $(a).find("[name=" + e + "]").attr("type") ? $(a).find("[name=" + e + "]")[0].checked = t: ($(a).find("[name=" + e + "]").val(t), "dataSourceName" == e || "tbName" == e || "btnType" == e ? $(a).find("[name=" + e + "]").val(t).change() : $(a).find("[name=" + e + "]").val(t))
        }), e.fields && ($.each(e.fields,
        function(e, t) {
            $("#columu_cell").append('<tr name="' + t.column + '" align="center"><td><input type="checkbox" name="primary"' + ("1" == t.primary ? ' checked="checked"': "") + '></td><td><input type="checkbox" name="foreign"' + ("1" == t.foreign ? ' checked="checked"': "") + '></td><td name="column">' + t.column + '</td><td name="cell">' + t.cell + '</td><td name="remark">' + t.remark + "</td></tr>")
        }), bindFillReport()))
}
function setBorder(e) {
    var t = hot.Methods.getSelected();
    if (t) {
        var a = getRange(t);
        switch (e) {
            case "borderLeft":
                for (var o = a[0]; o <= a[2]; o++) { (n = hot.Methods.getCellMeta(o, a[1]).style || {}).border_left = "1px solid rgb(0,0,0)",
                    hot.Methods.setCellMeta(o, a[1], "style", n);
                    var l = hot.Methods.getCell(o, a[1]);
                    $(l).css("border-left", "1px solid rgb(0,0,0)")
                }
                break;
            case "borderRight":
                for (o = a[0]; o <= a[2]; o++) { (n = hot.Methods.getCellMeta(o, a[3]).style || {}).border_right = "1px solid rgb(0,0,0)",
                    hot.Methods.setCellMeta(o, a[3], "style", n);
                    l = hot.Methods.getCell(o, a[3]);
                    $(l).css("border-right", "1px solid rgb(0,0,0)")
                }
                break;
            case "borderTop":
                for (o = a[1]; o <= a[3]; o++) { (n = hot.Methods.getCellMeta(a[0], o).style || {}).border_top = "1px solid rgb(0,0,0)",
                    hot.Methods.setCellMeta(a[0], o, "style", n);
                    l = hot.Methods.getCell(a[0], o);
                    $(l).css("border-top", "1px solid rgb(0,0,0)")
                }
                break;
            case "borderBottom":
                for (o = a[1]; o <= a[3]; o++) { (n = hot.Methods.getCellMeta(a[2], o).style || {}).border_bottom = "1px solid rgb(0,0,0)",
                    hot.Methods.setCellMeta(a[2], o, "style", n);
                    l = hot.Methods.getCell(a[2], o);
                    $(l).css("border-bottom", "1px solid rgb(0,0,0)")
                }
                break;
            case "borderOut":
                setBorder("borderLeft"),
                    setBorder("borderRight"),
                    setBorder("borderTop"),
                    setBorder("borderBottom");
                break;
            case "borderIn":
                setBorder("borderAll");
                break;
            case "borderAll":
                for (o = a[0]; o <= a[2]; o++) for (var r = a[1]; r <= a[3]; r++) { (n = hot.Methods.getCellMeta(o, r).style || {}).border_top = "1px solid rgb(0,0,0)",
                    n.border_bottom = "1px solid rgb(0,0,0)",
                    n.border_left = "1px solid rgb(0,0,0)",
                    n.border_right = "1px solid rgb(0,0,0)",
                    hot.Methods.setCellMeta(o, r, "style", n);
                    l = hot.Methods.getCell(o, r);
                    $(l).css({
                        "border-top": "1px solid rgb(0,0,0)",
                        "border-bottom": "1px solid rgb(0,0,0)",
                        "border-left": "1px solid rgb(0,0,0)",
                        "border-right": "1px solid rgb(0,0,0)"
                    })
                }
                break;
            case "borderNode":
                for (o = a[0]; o <= a[2]; o++) for (r = a[1]; r <= a[3]; r++) {
                    var n;
                    delete(n = hot.Methods.getCellMeta(o, r).style || {}).border_top,
                        delete n.border_bottom,
                        delete n.border_left,
                        delete n.border_right,
                        hot.Methods.setCellMeta(o, r, "style", n);
                    l = hot.Methods.getCell(o, r);
                    $(l).css({
                        "border-top": "",
                        "border-bottom": "",
                        "border-left": "",
                        "border-right": ""
                    })
                }
        }
    }
}
function copyStyle() {
    var e = hot.Methods.getSelected();
    if (e) {
        var t = e[0],
            a = hot.Methods.getCellMeta(t[0], t[1]);
        tempStyle = a.style
    }
}
function pasteStyle() {
    var e = hot.Methods.getSelected();
    if (e) for (var t = e[0], a = t[0]; a <= t[2]; a++) for (var o = t[1]; o <= t[3]; o++) hot.Methods.setCellMeta(a, o, "style", tempStyle);
    hot.Methods.render()
}
function getFillReportNodesVal(e) {
    var a = [],
        t = e[0].children;
    return t && $.each(t,
        function(e, t) {
            var o = {};
            o.name = t.name,
                o.btnType = t.btnType,
                o.actionurl = t.actionurl,
                o.dataSourceName = t.dataSourceName,
                o.dbMode = t.dbMode,
                o.tbName = t.tbName,
                o.fields = [],
            t.fields && "actionurl" != t.btnType && $.each(t.fields,
                function(e, t) {
                    var a = {};
                    a.primary = t.primary,
                        a.foreign = t.foreign,
                        a.column = t.column,
                        a.cell = t.cell,
                        a.remark = t.remark,
                        o.fields.push(a)
                }),
                a.push(o)
        }),
        a
}
function setFillReportNodesVal(e) {
    var a = {
        name: "填报配置列表",
        open: !0,
        children: []
    };
    return $.each(e,
        function(e, t) {
            var o = {
                children: []
            };
            o.name = t.name,
                o.btnType = t.btnType,
                o.actionurl = t.actionurl,
                o.dataSourceName = t.dataSourceName,
                o.dbMode = t.dbMode,
                o.tbName = t.tbName,
                o.fields = [],
            t.fields && "actionurl" != t.btnType && $.each(t.fields,
                function(e, t) {
                    var a = {};
                    a.name = t.column + "<--" + t.cell,
                        a.primary = t.primary,
                        a.foreign = t.foreign,
                        a.column = t.column,
                        a.cell = t.cell,
                        a.remark = t.remark,
                        o.fields.push(a),
                        o.children.push(a)
                }),
                a.children.push(o)
        }),
        a
}
function getDataSetsNodesVal(e) {
    var a = [],
        t = e[0].children;
    return t && $.each(t,
        function(e, t) {
            var l = {};
            l.dic = t.dic,
                l.isvalid = t.isvalid,
                l.dataSourceName = t.dataSourceName,
                l.dataSetName = t.dataSetName,
                l.dataSetType = t.dataSetType,
                l.commandText = t.commandText,
                l.keyName = t.keyName,
                l.optCode = t.optCode,
                l.optName = t.optName,
                l.path = t.path,
                l.method = t.method,
                l.cate = t.cate,
                l.node = t.node,
                l.hostName = t.hostName,
                l.pageType = t.pageType,
                l.pageParam = t.pageParam,
                l.pageSizeParam = t.pageSizeParam,
                l.recordName = t.recordName,
                $.each(t.children,
                    function(e, t) {
                        if ("field" == t.type) {
                            var a = t.children;
                            l.field = [],
                                $.each(a,
                                    function(e, t) {
                                        var a = {};
                                        a.columnComments = t.columnComments,
                                            a.columnName = t.columnName,
                                            a.columnType = t.columnType,
                                            a.isauto = t.isauto,
                                            l.field.push(a)
                                    })
                        } else if ("parms" == t.type) {
                            var o = t.children;
                            l.parms = [],
                                $.each(o,
                                    function(e, t) {
                                        var a = {};
                                        a.parmName = t.parmName,
                                            a.parmCName = t.parmCName,
                                            l.parms.push(a)
                                    })
                        }
                    }),
                a.push(l)
        }),
        a
}
function setDataSetsNodesVal(e) {
    var r = {
        name: "数据集列表",
        children: []
    };
    return $.each(e,
        function(e, t) {
            var a = {
                children: []
            };
            a.name = t.dataSetName,
                a.dic = t.dic,
                a.isvalid = t.isvalid,
                a.dataSourceName = t.dataSourceName,
                a.dataSetName = t.dataSetName,
                a.dataSetType = t.dataSetType,
                a.commandText = t.commandText,
                a.keyName = t.keyName,
                a.optCode = t.optCode,
                a.optName = t.optName,
                a.path = t.path,
                a.method = t.method,
                a.cate = t.cate,
                a.node = t.node,
                a.hostName = t.hostName,
                a.pageType = t.pageType,
                a.pageParam = t.pageParam,
                a.pageSizeParam = t.pageSizeParam,
                a.recordName = t.recordName;
            var o = {
                    type: "field",
                    name: "字段",
                    children: []
                },
                l = {
                    type: "parms",
                    name: "参数",
                    children: []
                };
            $.each(t.field,
                function(e, t) {
                    var a = {};
                    a.columnComments = t.columnComments,
                        a.columnName = t.columnName,
                        a.columnType = t.columnType,
                        a.isauto = t.isauto,
                        a.name = t.columnComments ? t.columnComments: t.columnName,
                        o.children.push(a)
                }),
                $.each(t.parms,
                    function(e, t) {
                        var a = {};
                        a.parmName = t.parmName,
                            a.parmCName = t.parmCName,
                            a.name = t.parmCName ? t.parmCName: t.parmName,
                            l.children.push(a)
                    }),
                a.children.push(o),
                a.children.push(l),
                r.children.push(a)
        }),
        r
}
function getDataParmsNodesVal(e) {
    var o = [],
        t = e[0].children;
    return t && 0 < t.length && $.each(t,
        function(e, t) {
            var a = {};
            a.dbType = t.dbType,
                a.parmCName = t.parmCName,
                a.parmName = t.parmName,
                a.parmType = t.parmType,
                a.parmvl = t.parmvl,
                a.isnull = t.isnull,
                a.showType = t.showType,
                a.format = t.format,
                a.isnull = t.isnull,
                a.selRange = t.selRange,
                a.parmEvent = t.parmEvent,
                a.position = t.position,
                a.mustInput = t.mustInput,
                a.readonly = t.readonly,
                a.labelAlign = t.labelAlign,
                a.fieldAlign = t.fieldAlign,
                a.labelStyle = t.labelStyle,
                a.fieldStyle = t.fieldStyle,
                a.width = t.width,
                a.widthL = t.widthL,
                a.widthR = t.widthR,
                a.height = t.height,
                a.fontSize = t.fontSize,
                a.fieldSize = t.fieldSize,
                a.verticalAlign = t.verticalAlign,
                a.maxLength = t.maxLength,
                t.puuid ? a.puuid = t.puuid: a.puuid = getPuuid("parm"),
                a.custom = t.custom,
                o.push(a)
        }),
        o
}
function getPuuid(e) {
    for (var t = 0; t < 5; t++) e = e + "-" + (65536 * (1 + Math.random()) | 0).toString(16).substring(1);
    return e
}
function setDataParmsNodesVal(e) {
    var o = {
        name: "参数列表",
        children: []
    };
    return $.each(e,
        function(e, t) {
            var a = {};
            a.dbType = t.dbType,
                a.parmCName = t.parmCName,
                a.parmName = t.parmName,
                a.parmType = t.parmType,
                a.parmvl = t.parmvl,
                a.isnull = t.isnull,
                a.format = t.format,
                a.showType = t.showType,
                a.name = t.parmCName ? t.parmCName: t.parmName,
                a.isnull = t.isnull,
                a.selRange = t.selRange,
                a.parmEvent = t.parmEvent,
                a.position = t.position,
                a.mustInput = t.mustInput,
                a.readonly = t.readonly,
                a.labelAlign = t.labelAlign,
                a.fieldAlign = t.fieldAlign,
                a.labelStyle = t.labelStyle,
                a.fieldStyle = t.fieldStyle,
                a.width = t.width,
                a.widthL = t.widthL,
                a.widthR = t.widthR,
                a.height = t.height,
                a.fontSize = t.fontSize,
                a.fieldSize = t.fieldSize,
                a.verticalAlign = t.verticalAlign,
                a.maxLength = t.maxLength,
                a.puuid = t.puuid,
                a.custom = t.custom,
                o.children.push(a)
        }),
        o
}
function getTableDataByUUID(e) {
    $.rdp.ajax({
        url: "../../rdp/selectReport",
        data: {
            uuid: e
        },
        type: "post",
        success: function(e) {
            0 == e.code ? (loadData(e.json), tableInitFlag = !0, cPush("getTableDataByUUID")) : layer.msg(e.msg)
        }
    })
}
function pasteSetValue(e) {
    for (var t = 0; t < e.length; t++) hot.Methods.setCellMeta(e[t][0], e[t][1], "value", e[t][3])
}
function hotafterCreateRow(e, t, a) {
    if ("auto" != a) {
        for (var o = getMergeCells(TableData), l = 0; l < o.length; l++) o[l].row >= e && (o[l].row += t);
        TableData.rowHeights.splice(e, 0, 23),
            tb_updateSettings()
    }
}
function hotafterCreateCol(e, t, a) {
    if ("auto" != a) {
        for (var o = getMergeCells(TableData), l = 0; l < o.length; l++) o[l].col >= e && (o[l].col += t);
        TableData.colWidths.splice(e, 0, 100),
            tb_updateSettings()
    }
}
function hotafterRemoveRow(e, t) {
    for (var a = getTabelData(), o = a.mergeCells, l = {},
             r = [], n = 0; n < o.length; n++) if (o[n].row < e && o[n].row + o[n].rowspan < e + t) o[n].rowspan = e - o[n].row,
        l[o[n].col] = !0;
    else if (o[n].row <= e && o[n].row + o[n].rowspan >= e + t) o[n].rowspan -= t,
        l[o[n].col] = !0;
    else if (o[n].row >= e && o[n].row + o[n].rowspan <= e + t) r.push(n),
        l[o[n].col] = !0;
    else if (o[n].row > e && e + t - 1 > o[n].row) {
        var s = o[n].row + o[n].rowspan - 1,
            i = e + t - 1;
        o[n].rowspan = s - i,
            o[n].row = s - t - o[n].rowspan + 1,
            l[o[n].col] = !0
    } else if (o[n].row > e && o[n].row < e + t && e + t <= o[n].row + o[n].rowspan) {
        s = o[n].row + o[n].rowspan - 1,
            i = e + t - 1;
        o[n].rowspan = s - i,
            o[n].row = s - t - o[n].rowspan + 1,
            l[o[n].col] = !0
    } else l[o[n].col] && (o[n].row -= t);
    for (n = r.length - 1; 0 <= n; n--) o.splice(r[n], 1);
    var c = a.row;
    c.length >= e && c.splice(e, t);
    var d = a.rowHeights;
    d.length >= e && d.splice(e, t),
        loadData(a)
}
function hotafterRemoveCol(e, t) {
    for (var a = getTabelData(), o = a.mergeCells, l = {},
             r = [], n = 0; n < o.length; n++) if (o[n].col < e && o[n].col + o[n].colspan < e + t) o[n].colspan = e - o[n].col,
        l[o[n].col] = !0;
    else if (o[n].col <= e && o[n].col + o[n].colspan >= e + t) o[n].colspan -= t,
        l[o[n].col] = !0;
    else if (o[n].col >= e && o[n].col + o[n].colspan <= e + t) r.push(n),
        l[o[n].col] = !0;
    else if (o[n].col > e && e + t - 1 > o[n].col) {
        var s = o[n].col + o[n].colspan - 1,
            i = e + t - 1;
        o[n].colspan = s - i,
            o[n].col = s - t - o[n].colspan + 1,
            l[o[n].col] = !0
    } else if (o[n].col > e && o[n].col < e + t && e + t <= o[n].col + o[n].colspan) {
        s = o[n].col + o[n].colspan - 1,
            i = e + t - 1;
        o[n].colspan = s - i,
            o[n].col = s - t - o[n].colspan + 1,
            l[o[n].col] = !0
    } else l[o[n].col] && (o[n].col -= t);
    for (n = r.length - 1; 0 <= n; n--) o.splice(r[n], 1);
    var c = a.row;
    for (n = 0; n < c.length; n++) {
        var d = c[n].col;
        d.length >= e && d.splice(e, t)
    }
    var h = a.colWidths;
    h.length >= e && h.splice(e, t),
        loadData(a)
}
function getQueryString(e) {
    var t = new RegExp("(^|&)" + e + "=([^&]*)(&|$)", "i"),
        a = window.location.search.substr(1).match(t);
    return null != a ? unescape(a[2]) : null
}
function getTDWidth(a, o, e) {
    var l, t = 0;
    if ($.each(e,
        function(e, t) {
            t.row == a && t.col == o && (l = t)
        }), l) for (var r = 0; r < l.colspan; r++) t += hot.Methods.getColWidth(o + r);
    else t = hot.Methods.getColWidth(o);
    return t
}
function S4() {
    return (65536 * (1 + Math.random()) | 0).toString(16).substring(1)
}
function guid() {
    return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4()
}
function guide_line(e) {
    var t = $(e).val(),
        a = $(e).find("option:selected").text();
    if ($(".wtSpreader .guide_line").remove(), null != t && "" != t && null != t) {
        var o = $(".htCore").height(),
            l = $(".htCore").offset().top,
            r = $('<line class="guide_line ' + t + '_guide" title="' + a + '"></line>');
        r.css({
            height: o,
            top: l
        }),
            $(".wtSpreader").append(r)
    }
}
function loadToolsBar() {
    $(".toolbars").mCustomScrollbar({
        theme: "3d-dark",
        axis: "x",
        autoHideScrollbar: !0,
        scrollButtons: {
            enable: !0
        },
        advanced: {
            updateOnBrowserResize: !0,
            autoExpandHorizontalScroll: !0
        }
    }),
        $(window).resize(function() {
            $(".toolbars").mCustomScrollbar("update")
        });
    var e = document.documentElement.clientWidth;
    $(".toolbars .group .bar_shrink").each(function(e, t) {
        var a = $(t),
            o = a.parents(".group").width();
        a.css({
            left: o - 20 + "px"
        })
    }),
        $(".toolbars .group .bar_shrink").bind("click",
            function() {
                var e = $(this),
                    t = e.parents(".group");
                if (t.hasClass("group_hidden")) {
                    t.removeClass("group_hidden");
                    var a = e.parents(".group").width();
                    e.css({
                        left: a - 20 + "px"
                    })
                } else t.addClass("group_hidden"),
                    e.removeAttr("style");
                initBarWidth()
            }),
    e < 1500 && $(".toolbars .group .bar_shrink").click()
}
function initBarWidth(e) {
    var o = 0;
    $(".toolbars .group").each(function(e, t) {
        var a = $(t).width();
        o += a
    }),
        o += 10,
        $(".customScrollbar").css({
            "min-width": o + "px",
            width: o + "px"
        }),
        $(".toolbars").mCustomScrollbar("update")
}
function initSkin() {
    $.ajax({
        url: "../../rdp/customSkinList",
        cache: !1,
        type: "post",
        success: function(e) {
            $.each(e.list,
                function(e, t) {
                    $("#skinType").append('<option value="' + t + '">' + t + "</option>")
                })
        }
    })
}
function skinCustomShow() {
    layer.open({
        type: 2,
        area: ["960px", "600px"],
        title: "自定义皮肤设置",
        content: "skin.html",
        cancel: function() {},
        success: function(e, t) {},
        end: function() {},
        btn: ["保存", "取消"],
        yes: function(e, t) {
            var a = $(t).find("iframe")[0].contentWindow,
                o = a.curSkin,
                l = JSON.stringify(a.curJsonObj);
            $.ajax({
                url: "../../rdp/saveCustomSkin",
                cache: !1,
                data: {
                    fileName: o,
                    content: l
                },
                type: "post",
                success: function(e) {
                    alert("成功")
                }
            })
        },
        btn2: function(e, t) {
            layer.close(e)
        }
    })
}
$(function() { (hot = new Hot).init(),
    initColWidthAndHeight(),
    initSkin(),
    $("#cellval").bind("keyup",
        function() {
            tb_cellval($(this).val())
        }),
    $("#cell-width").bind("input",
        function() {
            tb_width($(this).val())
        }),
    $("#cell-height").bind("input",
        function() {
            tb_height($(this).val())
        }),
    $("#bgColor").spectrum({
        showInput: !0,
        allowEmpty: !0,
        showAlpha: !0,
        showPalette: !0,
        togglePaletteOnly: !0,
        hideAfterPaletteSelect: !0,
        showSelectionPalette: !0,
        cancelText: "取消",
        chooseText: "确认",
        togglePaletteMoreText: "更多",
        togglePaletteLessText: "简略",
        palette: [["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"], ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"], ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"], ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"], ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"], ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"], ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"], ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]],
        change: function(e) {
            setBgColor(e ? e.toRgbaString() : ""),
                selectedCell = []
        },
        show: function(e) {
            selectedCell = hot.Methods.getSelected()
        },
        move: function(e) {}
    }),
    $("#fontColor").spectrum({
        showInput: !0,
        allowEmpty: !0,
        showAlpha: !1,
        showPalette: !0,
        togglePaletteOnly: !0,
        hideAfterPaletteSelect: !0,
        showSelectionPalette: !0,
        cancelText: "取消",
        chooseText: "确认",
        togglePaletteMoreText: "更多",
        togglePaletteLessText: "简略",
        palette: [["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"], ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"], ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"], ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"], ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"], ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"], ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"], ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]],
        change: function(e) {
            setFontColor(e ? e.toRgbString() : ""),
                selectedCell = []
        },
        show: function(e) {
            selectedCell = hot.Methods.getSelected()
        },
        move: function(e) {}
    }),
    $(".rows-btn").bind("click",
        function() {
            $(".select-div").hide();
            var e = $(this).outerHeight(!0) + $(this).offset().top,
                t = $(this).offset().left;
            return $(".select-ctrl-rows").css({
                top: e + "px",
                left: t + "px"
            }),
                $(".select-ctrl-rows").show(),
                !1
        }),
    $(".select-ctrl-rows li").bind("click",
        function() {
            var e = hot.Methods.getSelected();
            e && ("insertRowAbove" == $(this).data("ctrl") ? hot.Methods.alert("insert_row", e[0][0]) : "insertRowBelow" == $(this).data("ctrl") ? hot.Methods.alert("insert_row", e[0][0] + 1) : "delRow" == $(this).data("ctrl") && hot.Methods.alert("remove_row", e[0][0], e[0][2] - e[0][0] + 1))
        }),
    $(".cols-btn").bind("click",
        function() {
            $(".select-div").hide();
            var e = $(this).outerHeight(!0) + $(this).offset().top,
                t = $(this).offset().left;
            return $(".select-ctrl-cols").css({
                top: e + "px",
                left: t + "px"
            }),
                $(".select-ctrl-cols").show(),
                !1
        }),
    $(".select-ctrl-cols li").bind("click",
        function() {
            var e = hot.Methods.getSelected();
            e && ("insertColLeft" == $(this).data("ctrl") ? hot.Methods.alert("insert_col", e[0][1]) : "insertColRight" == $(this).data("ctrl") ? hot.Methods.alert("insert_col", e[0][1] + 1) : "delCol" == $(this).data("ctrl") && hot.Methods.alert("remove_col", e[0][1], e[0][3] - e[0][1] + 1))
        }),
    $(".select-ctrl-border li").bind("click",
        function() {
            setBorder($(this).data("ctrl"))
        }),
    $(document.body).bind("click",
        function(e) {
            $(".select-div").hide(),
                $(".showsql").remove(),
            0 == $(e.target).parents(".dataExpr").length && $(".select-current").removeClass("select-current")
        }),
    $(".foot-switch").bind("click",
        function() {
            var e = $(".tb-foot").hasClass("tb-foot_left");
            $(".tb-foot").hasClass("on") ? ($(".tb-foot").removeClass("on"), e || $(".tb-center").removeClass("on")) : ($(".tb-foot").addClass("on"), e || $(".tb-center").addClass("on")),
                setTimeout(function() {
                        hot.Methods.render()
                    },
                    400)
        }),
    $(".box ul li").bind("click",
        function() {
            $(this).addClass("on").siblings().removeClass("on"),
                $(".box .ct").eq($(".box ul li").index(this)).addClass("on").siblings().removeClass("on"),
            $(".tb-foot").hasClass("on") || ($(".tb-foot").addClass("on"), $(".tb-center").addClass("on")),
                setTimeout(function() {
                        hot.Methods.render()
                    },
                    400)
        }),
    init(),
    (uuid = getQueryString("uuid")) && "" != uuid && "null" != uuid ? getTableDataByUUID(uuid) : cPush("init"),
    $("#fontsize").select2({
        tags: !0
    }),
    $("#fontsize").on("select2:select",
        function(e) {
            setFontSize(e.params.data.id)
        }),
    $("#tdchangeColor").spectrum({
        showInput: !0,
        allowEmpty: !0,
        showAlpha: !0,
        showPalette: !0,
        togglePaletteOnly: !0,
        hideAfterPaletteSelect: !0,
        showSelectionPalette: !0,
        cancelText: "取消",
        chooseText: "确认",
        togglePaletteMoreText: "更多",
        togglePaletteLessText: "简略",
        palette: [["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"], ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"], ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"], ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"], ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"], ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"], ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"], ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]],
        change: function(e) {
            $("#tdchangeColor").parents(".attrspan").find("input").val(e ? e.toRgbString() : ""),
                e ? ($("#tdchangeColor").css("background-color", e.toRgbString()), $("#tdchangeColor").css("background-image", "")) : ($("#tdchangeColor").css("background-color", ""), $("#tdchangeColor").css("background-image", "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==)"))
        },
        show: function(e) {
            var t = $(".layui-layer").css("z-index");
            $("#tdchangeColor").spectrum("container").css("z-index", t + 1)
        },
        move: function(e) {}
    }),
    $("#tdchangeBgColor").spectrum({
        showInput: !0,
        allowEmpty: !0,
        showAlpha: !0,
        showPalette: !0,
        togglePaletteOnly: !0,
        hideAfterPaletteSelect: !0,
        showSelectionPalette: !0,
        cancelText: "取消",
        chooseText: "确认",
        togglePaletteMoreText: "更多",
        togglePaletteLessText: "简略",
        palette: [["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"], ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"], ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"], ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"], ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"], ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"], ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"], ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]],
        change: function(e) {
            $("#tdchangeBgColor").parents(".attrspan").find("input").val(e ? e.toRgbaString() : ""),
                e ? ($("#tdchangeBgColor").css("background-color", e.toRgbaString()), $("#tdchangeBgColor").css("background-image", "")) : ($("#tdchangeBgColor").css("background-color", ""), $("#tdchangeBgColor").css("background-image", "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==)"))
        },
        show: function(e) {
            var t = $(".layui-layer").css("z-index");
            $("#tdchangeBgColor").spectrum("container").css("z-index", t + 1)
        },
        move: function(e) {}
    }),
    $(".table-warning .dataExprAttrAdd").bind("click",
        function() {
            warningTree.addLevel_1("condition_tree")
        }),
    $(".table-warning .dataExprAttrSymbol").bind("click",
        function() {
            null == $.fn.zTree.getZTreeObj("condition_tree") ? warningTree.addLevel_1("condition_tree") : 0 < warningTree.selectedNode().length ? warningTree.add("condition_tree") : layer.msg("未选中的条件项！")
        }),
    $(".table-warning .dataExprAttrUpdate").bind("click",
        function() {
            null != $.fn.zTree.getZTreeObj("condition_tree") ? warningTree.update("condition_tree") : layer.msg("未发发现可删除条件项！")
        }),
    $(".table-warning .dataExprAttrDel").bind("click",
        function() {
            null != $.fn.zTree.getZTreeObj("condition_tree") ? warningTree.del("condition_tree") : layer.msg("未发发现可删除条件项！")
        }),
    loadToolsBar(),
    $("#reportTitle").bind("click",
        function() {
            $("#reportTitleInput").attr("type", "text"),
                $(this).hide()
        }),
    $("#reportTitleInput").bind("blur",
        function() {
            TableData.reportDescription = $(this).val(),
                $("#reportTitle").html($(this).val()),
                $("#reportTitle").show(),
                $("#reportTitleInput").attr("type", "hidden")
        })
}),
    window.addEventListener("load",
        function(e) {
            console.log("All resources finished loading!")
        });
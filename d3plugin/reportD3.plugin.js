var Xcharts = (function () {
    var charts = {};
    /**
     * 显示提示
     * @param flag
     * @param event
     * @param dom
     * @param data
     * @returns {boolean}
     */
    function showTip(flag, event, dom, data) {

        var tip = document.getElementById('JS_d3_tip');

        if (!tip) {
            tip = document.createElement('div');
            tip.id = 'JS_d3_tip';
            tip.setAttribute('class', 'zy-d3-tip');
        }

        if (!flag) {
            tip.style.display = 'none';
            return false;
        }

        var info = '';
        if (data) {
            info = !!(data.text) ? info + data.text : '';
            info = !!(data.value) ? info + '：' + data.value : info;
        } else {
            info = !!(dom.attr('data-text')) ? info + dom.attr('data-text') : '';
            info = !!(dom.attr('data-value')) ? info + '：' + dom.attr('data-value') : info;
        }


        if (info) {
            tip.innerHTML = info;
            document.body.appendChild(tip);
        } else {
            return false;
        }

        var x = event.pageX || event.layerX;
        var y = event.pageY || event.layerY;
        var width = tip.clientWidth;
        var height = tip.clientHeight;

        var w = document.body.clientWidth;
        var h = document.body.clientHeight;

        var left = (x + width + 14) >= w ? x - width - 14 : x;
        var top = (y + height) >= h ? y - height : y;

        if (flag) {
            tip.style.left = (left + 14).toString() + 'px';
            tip.style.top = (top).toString() + 'px';
            tip.style.display = 'block';
        } else {
            tip.style.display = 'none';
        }

    }

    /**
     * 获得容器元素高宽
     * @param dom
     * @returns {{width: number, height: number}}
     */
    function getDomArea(dom) {
        var element,
            w = 100,
            h = 100;
        if (dom) {
            element = document.getElementById(dom);
            w = element.clientWidth;
            h = element.clientHeight;
        } else {
            throw new Error('缺少必要的绘图容器!');
        }
        return {
            width: w,
            height: h
        }
    }

    /**
     * 绘制圆环图
     * @param config
     */
    charts.ring = function (config) {
        var defaults = {
            container: '',
            data: 0.47, // 原始数据集
            layout: {
                xtag: '风险分值降低', // x轴显示文本
                ytag: '-47%' // y轴显示文本
            }
        };

        var settings = extend(defaults, config);

        var area = getDomArea(settings.container);

        var width = area.width,
            height = area.height,
            radius = Math.min(width, height) / 2,
            armRadius = radius / 10;

        var svg = d3.select('#' + settings.container)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        var pi = Math.PI, //π
            tau = pi * 2;

        var fields = [{
            radius: 0.6 * radius
        }];

        function percentage() {
            return (-(settings.data) * 100) + "%";

        }
        var dataParseInt = Math.abs(parseInt(percentage()))

        var arcArm = d3.arc()
            .startAngle(function (d) {
                return 0; //圆弧起始点
            })
            .endAngle(function (d) {
                return (tau) * (1 - settings.data); //圆弧结束点 tau是2π
            })
            .innerRadius(function (d) {
                return d.radius - armRadius; //内圆
            })
            .outerRadius(function (d) {
                return d.radius + armRadius; //外圆
            })
            .cornerRadius(armRadius); // 头尾border-radius

        var field = svg.append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
            .selectAll(".field")
            .data(fields)
            .enter().append("g")
            .attr("fill", "#5584ff")
            .attr("class", "field");

        var fieldArm = field.append("path")
            .attr("class", "field-arm")
            .attr("transform", "rotate(0)") //180
            .attr("d", function (d) {
                return arcArm(d) +
                    "M0," + (d.radius);
            });

        // tag
        if (settings.layout.ytag) {
            svg.append('text')
                .attr('class', 'zy-x-text')
                .attr('dx', (width / 2))
                .attr('dy', (height / 2 + 10))
                .text(percentage())
                .attr('fill', '#5584ff')
                .attr('font-size', '30px')
                .attr('text-anchor', 'middle');
        }

        if (settings.layout.xtag) {
            svg.append('text')
                .attr('class', 'zy-x-text')
                .attr('dx', (width / 2))
                .attr('dy', (height - 30))
                .text('风险分值降低' + ' ' + dataParseInt + '%')
                .attr('fill', '#8393ad')
                .attr('text-anchor', 'middle');
        }
    }

    /**
     * 绘制线段图，至少两条数据
     * @param config
     */
    charts.segmentTwo = function (config) {
        var defaults = {
            container: '',
            color: ['#37a4dd', '#fe8e07'], // 线条颜色
            text: ['2016年管道风险评分', '2017年管道风险评分'], // 线段名称
            xAxis: { // x轴
                data: [0, 2600], // x轴数据
                ticks: 10, // x轴刻度数
                index: [], // x轴索引
                render: '', // 渲染回调函数
                show: true, // 是否显示(默认true)
                orient: 'bottom', // x轴方向(默认bottom)
                sort: 'asc' // 刻度排序(默认上升asc)
            },
            yAxis: { // y轴
                data: [0, 100],
                ticks: 10,
                index: [],
                render: '',
                show: true,
                orient: 'left',
                sort: 'asc'
            },
            data: [
                [
                    [
                        [10, 20],
                        [1000, 20]
                    ],
                    [
                        [1000, 20],
                        [1000, 30]
                    ],
                    [
                        [1000, 30],
                        [2000, 30]
                    ]
                ],
                [
                    [
                        [10, 50],
                        [1000, 50]
                    ],
                    [
                        [1000, 50],
                        [1000, 90]
                    ],
                    [
                        [1000, 90],
                        [2500, 90]
                    ]
                ]
            ], // 原始数据集
            layout: {
                xtag: '绝对距离', // x轴显示文本
                ytag: '评分分值', // y轴显示文本
                tagColor: '#5c5c5c', //xY轴文本颜色
                margin: {
                    left: 60,
                    right: 50,
                    top: 50,
                    bottom: 50
                }, // 距容器边距
                xgrid: true, // x轴网格
                ygrid: true, // y轴网格
                gridColor: '#f0f0f0', // 网格颜色
                gridWidth: '1px', // 网格粗细
                lineRender: 'crispEdges', // 网格线条清晰度
                axisColor: '#f0f0f0', // 坐标轴颜色
                axisFontColor: '#5c5c5c', // 坐标轴字体颜色
                axisFontSize: '12px', // 坐标轴字体大小
                lineWidth: '1.5px', // 线段宽度
                lineEdges: 'default' // 线段清晰度
            }, // 区间背景
            pointText: {
                show: false, // 节点文字是否显示(默认false不显示)
                render: '', // 渲染回调函数
                circle: true, // 节点圆圈是否显示(默认false不显示)
                startShow: true, // 显示折线开始节点圆圈(默认false不显示)
                stopShow: false // 显示折线结束节点圆圈(默认false不显示)
            },
            legend: {
                data: [
                    ['2016年管道风险评分', '#37a4dd'],
                    ['2017年管道风险评分', '#fe8e07']
                ], //标签数据
                width: 170, //标签长度
                location: 0 //标签所在x方向位置
            }
        };

        var settings = extend(defaults, config);

        var area = getDomArea(settings.container);

        var width = area.width,
            height = area.height;

        if (settings.data.length === 0) {
            d3.select('#' + settings.container).html(viewCon.emptyInfo);
            return false;
        }
        // d3
        var svg = d3.select('#' + settings.container)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        // tag
        if (settings.layout.ytag) {
            svg.append('g')
                .attr('class', 'zy-x-tag')
                .attr('transform', 'translate(30, 30)')
                .append('text')
                .text(settings.layout.ytag)
                .attr('fill', settings.layout.tagColor);
        }
        if (settings.layout.xtag) {
            svg.append('g')
                .attr('class', 'zy-y-tag')
                .attr('transform', 'translate(' + (width / 2.2) + ', ' + (height - 10) + ')')
                .append('text')
                .text(settings.layout.xtag)
                .attr('fill', settings.layout.tagColor);
        }

        // legend
        if (settings.legend.data.length) {
            var lengendTw;
            if (settings.legend.location != 0) {
                lengendTw = settings.legend.location;
            } else {
                lengendTw = width / 1.8;
            }
            var legend = svg.append('g')
                .attr('class', 'zy-line-legend')
                .attr('transform', 'translate(' + lengendTw + ', ' + (settings.layout.margin.top - 20) + ')')
                .selectAll('g')
                .data(settings.legend.data)
                .enter()
                .append('g');

            legend.append('rect')
                .attr('width', 12)
                .attr('height', 2)
                .attr('fill', function (d) {
                    return d[1];
                })
                .attr('x', function (d, i) {
                    return i * settings.legend.width;
                })
                .attr('y', -7);

            legend.append('text')
                .text(function (d) {
                    return d[0];
                })
                .attr('fill', viewCon.axisTagColor)
                .attr('x', function (d, i) {
                    return i * settings.legend.width + 20;
                });
        }

        var g = svg.append('g')
            .attr('transform', 'translate(' + settings.layout.margin.left + ', ' + settings.layout.margin.top + ')');


        // xScale
        var s_width = width - settings.layout.margin.left - settings.layout.margin.right;
        var s_height = height - settings.layout.margin.top - settings.layout.margin.bottom;
        var xScale;
        if (settings.xAxis.sort === 'asc') {
            xScale = d3.scaleLinear()
                .domain([d3.min(settings.xAxis.data), d3.max(defaults.xAxis.data)])
                .range([0, width - settings.layout.margin.left - settings.layout.margin.right])
                .nice();
        } else if (settings.xAxis.sort === 'desc') {
            xScale = d3.scaleLinear()
                .domain([d3.min(settings.xAxis.data), d3.max(settings.xAxis.data)])
                .range([width - settings.layout.margin.left - settings.layout.margin.right, 0])
                .nice();
        }

        // yScale
        var yScale;
        if (settings.yAxis.sort === 'asc') {
            yScale = d3.scaleLinear()
                .domain([d3.min(settings.yAxis.data), d3.max(settings.yAxis.data)])
                .range([height - settings.layout.margin.top - settings.layout.margin.bottom, 0])
                .nice();
        } else if (settings.yAxis.sort === 'desc') {
            yScale = d3.scaleLinear()
                .domain([d3.max(settings.yAxis.data), d3.min(settings.yAxis.data)])
                .range([height - settings.layout.margin.top - settings.layout.margin.bottom, 0])
                .nice();
        }

        // xAxis
        var xAxis;
        if (settings.xAxis.orient === 'bottom') {
            if (settings.xAxis.ticks === Infinity) {
                xAxis = d3.axisBottom(xScale);
            } else {
                xAxis = d3.axisBottom(xScale)
                    .ticks(settings.xAxis.ticks);
            }
        } else if (settings.xAxis.orient === 'top') {
            if (settings.xAxis.ticks === Infinity) {
                xAxis = d3.axisTop(xScale)
            } else {
                xAxis = d3.axisTop(xScale)
                    .ticks(settings.xAxis.ticks);
            }
        }

        // yAxis
        var yAxis;
        if (settings.yAxis.orient === 'left') {
            if (settings.yAxis.ticks === Infinity) {
                yAxis = d3.axisLeft(yScale);
            } else {
                yAxis = d3.axisLeft(yScale)
                    .ticks(settings.yAxis.ticks);
            }
        } else if (settings.yAxis.orient === 'right') {
            if (settings.yAxis.ticks === Infinity) {
                yAxis = d3.axisRight(yScale);
            } else {
                yAxis = d3.axisRight(yScale)
                    .ticks(settings.yAxis.ticks);
            }
        }

        // xGrid
        var xGrid;
        if (settings.xAxis.orient === 'bottom') {
            if (settings.xAxis.ticks === Infinity) {
                xGrid = d3.axisBottom(xScale)
                    .tickSize([height - settings.layout.margin.top - settings.layout.margin.bottom]);
            } else {
                xGrid = d3.axisBottom(xScale)
                    .tickSize([height - settings.layout.margin.top - settings.layout.margin.bottom])
                    .ticks(settings.xAxis.ticks);
            }
        } else if (settings.xAxis.orient === 'top') {
            if (settings.xAxis.ticks === Infinity) {
                xGrid = d3.axisTop(xScale)
                    .tickSize([height - settings.layout.margin.top - settings.layout.margin.bottom]);
            } else {
                xGrid = d3.axisTop(xScale)
                    .tickSize([height - settings.layout.margin.top - settings.layout.margin.bottom])
                    .ticks(settings.xAxis.ticks);
            }
        }

        // yGrid
        var yGrid;
        if (settings.yAxis.orient === 'left') {
            if (settings.yAxis.ticks === Infinity) {
                yGrid = d3.axisRight(yScale)
                    .tickSize([width - settings.layout.margin.left - settings.layout.margin.right]);
            } else {
                yGrid = d3.axisRight(yScale)
                    .tickSize([width - settings.layout.margin.left - settings.layout.margin.right])
                    .ticks(settings.yAxis.ticks);
            }
        } else if (settings.yAxis.orient === 'right') {
            if (settings.yAxis.ticks === Infinity) {
                yGrid = d3.axisLeft(yScale)
                    .tickSize([width - settings.layout.margin.left - settings.layout.margin.right]);
            } else {
                yGrid = d3.axisLeft(yScale)
                    .tickSize([width - settings.layout.margin.left - settings.layout.margin.right])
                    .ticks(settings.yAxis.ticks);
            }
        }

        /*--------- 添加xy轴 网格 - start ---------*/
        if (settings.layout.xgrid) {
            var x_xg = 0,
                y_xg = 0;
            if (settings.xAxis.orient === 'bottom') {
                x_xg = settings.layout.margin.left;
                y_xg = settings.layout.margin.top;
            } else if (settings.xAxis.orient === 'top') {
                x_xg = settings.layout.margin.left;
                y_xg = height - settings.layout.margin.top;
            }
            var xgrid = g.append('g')
                .attr('class', 'zy-x-grid')
                //.attr('transform', 'translate(' + x_xg + ',' + y_xg + ')')
                .call(xGrid);

            xgrid.selectAll('text')
                .text('');

            xgrid.selectAll('line')
                .attr('stroke', settings.layout.gridColor)
            //.attr('shape-rendering', settings.layout.lineRender);

            xgrid.selectAll('path')
            //.attr('stroke', settings.layout.gridColor)
            //.attr('shape-rendering', settings.layout.lineRender);
        }

        if (settings.layout.ygrid) {
            var x_yg = 0,
                y_yg = 0;
            if (settings.yAxis.orient === 'left') {
                x_yg = settings.layout.margin.left;
                y_yg = settings.layout.margin.top;
            } else if (settings.yAxis.orient === 'right') {
                x_yg = width - settings.layout.margin.left;
                y_yg = settings.layout.margin.top;
            }
            var ygrid = g.append('g')
                .attr('class', 'zy-y-grid')
                //.attr('transform', 'translate(' + x_yg + ',' + y_yg + ')')
                .call(yGrid);

            ygrid.selectAll('text')
                .text('');

            ygrid.selectAll('line')
                .attr('stroke', settings.layout.gridColor)
                .attr('shape-rendering', settings.layout.lineRender);

            ygrid.selectAll('path')
                .attr('stroke', settings.layout.gridColor)
                .attr('shape-rendering', settings.layout.lineRender);
        }
        /*--------- 添加xy轴 网格 - end ---------*/

        /*--------- 添加xy轴 - start ---------*/
        if (settings.xAxis.show) {
            var x_xa = 0,
                y_xa = 0;
            if (settings.xAxis.orient === 'bottom') {
                x_xa = 0;
                y_xa = height - settings.layout.margin.bottom - settings.layout.margin.top;
            } else if (settings.xAxis.orient === 'top') {
                x_xa = 0;
                y_xa = settings.layout.margin.top;
            }
            var xaxis = g.append('g')
                .attr('class', 'zy-x-axis')
                .attr('transform', 'translate(' + x_xa + ',' + y_xa + ')')
                .call(xAxis);

            xaxis.selectAll('text')
                .text(function (d) {
                    if (settings.xAxis.render instanceof Function) {
                        return settings.xAxis.render(d);
                    } else {
                        return d;
                    }
                })
                .attr('font-size', settings.layout.axisFontSize)
                .attr('fill', settings.layout.axisFontColor);

            xaxis.selectAll('line')
                .attr('stroke', settings.layout.axisColor)
                .attr('shape-rendering', settings.layout.lineRender);

            xaxis.selectAll('path')
                .attr('stroke', settings.layout.axisColor)
                .attr('shape-rendering', settings.layout.lineRender);

        }

        if (settings.yAxis.show) {
            /*var x_ya = 0, y_ya = 0;
            if (settings.yAxis.orient === 'left') {
                x_ya = settings.layout.margin.left;
                y_ya = 0;
            } else if (settings.yAxis.orient === 'right') {
                x_ya = width - settings.layout.margin.left;
                y_ya = 0;
            }*/
            var yaxis = g.append('g')
                .attr('class', 'zy-y-axis')
                //.attr('transform', 'translate(' + x_ya + ',' + y_ya + ')')
                .call(yAxis);

            yaxis.selectAll('text')
                .text(function (d) {
                    if (defaults.yAxis.render instanceof Function) {
                        return defaults.yAxis.render(d);
                    } else {
                        return d;
                    }
                })
                .attr('font-size', settings.layout.axisFontSize)
                .attr('fill', settings.layout.axisFontColor);

            yaxis.selectAll('line')
                .attr('stroke', settings.layout.axisColor)
                .attr('shape-rendering', settings.layout.lineRender);

            yaxis.selectAll('path')
                .attr('stroke', settings.layout.axisColor)
                .attr('shape-rendering', settings.layout.lineRender);
        }
        /*--------- 添加xy轴 - end ---------*/

        /*--------- 添加折线 - start ---------*/
        var line = d3.line()
            .x(function (d) {
                return xScale(d[0]);
            })
            .y(function (d) {
                return yScale(d[1]);
            });

        function returnText(str, arr) {
            if (arr[0][0] == arr[1][0]) {
                return "";
            } else {
                return str + '(' + arr[0][0] + '~' + arr[1][0] + 'm)';
            }
        }

        function returnValue(arr) {
            if (arr[0][0] == arr[1][0]) {
                return "";
            } else {
                return arr[0][1];
            }
        }
        // 多条
        if (settings.data.length > 0) {
            for (var h = 0; h < settings.data.length; h++) {
                if (settings.data[h].length > 0) {
                    for (var i = 0, len = settings.data[h].length; i < len; i++) {
                        g.append('path')
                            .attr('class', 'zy-line-path')
                            //.attr('transform', 'translate(' + settings.layout.margin.left + ',' + settings.layout.margin.top + ')')
                            .attr('d', line(settings.data[h][i]))
                            .attr('stroke', settings.color[h])
                            .attr('fill', 'none')
                            .attr('data', settings.data[h][i])
                            .attr('data-text', returnText(settings.text[h], settings.data[h][i]))
                            .attr('data-value', returnValue(settings.data[h][i]))
                            .attr('stroke-width', settings.layout.lineWidth)
                            .attr('shape-rendering', settings.layout.lineEdges)
                            .on('mousemove', function () {
                                if (d3.select(this).attr('data-value')) {
                                    d3.select(this)
                                        .attr('stroke-width', 4);
                                    showTip(true, d3.event, d3.select(this));
                                }
                            })
                            .on('mouseout', function () {
                                if (d3.select(this).attr('data-value')) {
                                    d3.select(this)
                                        .attr('stroke-width', settings.layout.lineWidth);
                                    showTip(false);
                                }
                            });
                    }
                }
            }
        }
        /*--------- 添加折线 - end ---------*/

        /*--------- 添加圆圈 - start ---------*/
        if (settings.data.length > 0) {
            for (var k = 0; k < settings.data.length; k++) {
                if (settings.pointText.circle) {
                    // 单组
                    if (settings.data[k].length > 0) {
                        for (var j = 0, len_j = settings.data[k].length; j < len_j; j++) {
                            g.append('g')
                                .attr('class', 'zy-circle-all')
                                .selectAll('circle')
                                .data(settings.data[k][j])
                                .enter()
                                .append('circle')
                                .attr('class', 'zy-circle')
                                .attr('data', settings.data[k][j])
                                .attr('cx', line.x())
                                .attr('cy', line.y())
                                .attr('r', 3)
                                .attr('stroke', settings.color[k])
                                .attr('fill', '#ffffff')
                                .attr('stroke-width', '1.5px');
                        }
                    }
                }
            }
        }
        /*--------- 添加圆圈 - end ---------*/

        var zoom = d3.zoom()
            .scaleExtent([1, 32])
            .translateExtent([
                [0, 0],
                [s_width, s_height]
            ])
            .extent([
                [0, 0],
                [s_width, s_height]
            ])
            .on("zoom", zoomed);


        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", s_width)
            .attr("height", s_height);

        svg.call(zoom).transition()
            .duration(150);

        function zoomed() {
            var t = d3.event.transform,
                xt = t.rescaleX(xScale);
            var lineT = d3.line()
                .x(function (d) {
                    return xt(d[0]);
                })
                .y(function (d) {
                    return yScale(d[1]);
                });
            g.selectAll(".zy-line-path").attr("d", function () {
                var x = d3.select(this)
                    .attr('data');
                x = x.split(',');
                var arr = [
                    [parseFloat(x[0]), parseFloat(x[1])],
                    [parseFloat(x[2]), parseFloat(x[3])]
                ];
                var val = lineT(arr);
                return val;
            });
            g.selectAll(".zy-circle").attr("cx", function (d) {
                return xt(d[0]);
            });
            var xaxi = g.select(".zy-x-axis").call(xAxis.scale(xt));
            xaxi.selectAll('line')
                .attr('stroke', settings.layout.axisColor)
                .attr('shape-rendering', settings.layout.lineRender);

            var xgrid1 = g.select(".zy-x-grid").call(xGrid.scale(xt));


            xgrid1.selectAll('text')
                .text('');

            xgrid1.selectAll('line')
                .attr('stroke', settings.layout.gridColor)
                .attr('shape-rendering', settings.layout.lineRender);

            xgrid1.selectAll('path')
                .attr('stroke', settings.layout.gridColor)
                .attr('shape-rendering', settings.layout.lineRender);
        }
    };

    /**
     * 绘制线段图，至少两条数据且数据之下有一条或者多条数据,可展示对应id等参数
     * @param config
     */
    charts.segmentMore = function (config) {
        var defaults = {
            container: '',
            color: ['#37a4dd', '#fe8e07'], // 线条颜色
            text: ['2016年管道风险评分', '2017年管道风险评分'], // 线段名称
            xAxis: { // x轴
                data: [0, 2600], // x轴数据
                ticks: 10, // x轴刻度数
                index: [], // x轴索引
                render: '', // 渲染回调函数
                show: true, // 是否显示(默认true)
                orient: 'bottom', // x轴方向(默认bottom)
                sort: 'asc' // 刻度排序(默认上升asc)
            },
            yAxis: { // y轴
                data: [0, 100],
                ticks: 10,
                index: [],
                render: '',
                show: true,
                orient: 'left',
                sort: 'asc'
            },
            data: [
                [
                    [
                        [10, 20],
                        [1000, 20]
                    ],
                    [
                        [1000, 20],
                        [1000, 30]
                    ],
                    [
                        [1000, 30],
                        [2000, 30]
                    ]
                ],
                [
                    [
                        [10, 50],
                        [1000, 50]
                    ],
                    [
                        [1000, 50],
                        [1000, 90]
                    ],
                    [
                        [1000, 90],
                        [2500, 90]
                    ]
                ]
            ], // 原始数据集
            layout: {
                xtag: '绝对距离', // x轴显示文本
                ytag: '评分分值', // y轴显示文本
                tagColor: '#5c5c5c', //xY轴文本颜色
                margin: {
                    left: 60,
                    right: 50,
                    top: 50,
                    bottom: 50
                }, // 距容器边距
                xgrid: true, // x轴网格
                ygrid: true, // y轴网格
                gridColor: '#f0f0f0', // 网格颜色
                gridWidth: '1px', // 网格粗细
                lineRender: 'crispEdges', // 网格线条清晰度
                axisColor: '#f0f0f0', // 坐标轴颜色
                axisFontColor: '#5c5c5c', // 坐标轴字体颜色
                axisFontSize: '12px', // 坐标轴字体大小
                lineWidth: '1.5px', // 线段宽度
                lineEdges: 'default' // 线段清晰度
            }, // 区间背景
            pointText: {
                show: false, // 节点文字是否显示(默认false不显示)
                render: '', // 渲染回调函数
                circle: true, // 节点圆圈是否显示(默认false不显示)
                startShow: true, // 显示折线开始节点圆圈(默认false不显示)
                stopShow: false // 显示折线结束节点圆圈(默认false不显示)
            },
            legend: {
                data: [
                    ['2016年管道风险评分', '#37a4dd'],
                    ['2017年管道风险评分', '#fe8e07']
                ], //标签数据
                width: 170, //标签长度
                location: 0 //标签所在x方向位置
            }
        };

        var settings = extend(defaults, config);

        var area = getDomArea(settings.container);

        var width = area.width,
            height = area.height;

        if (settings.data.length === 0) {
            d3.select('#' + settings.container).html(viewCon.emptyInfo);
            return false;
        }
        // d3
        var svg = d3.select('#' + settings.container)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        // tag
        if (settings.layout.ytag) {
            svg.append('g')
                .attr('class', 'zy-x-tag')
                .attr('transform', 'translate(30, 30)')
                .append('text')
                .text(settings.layout.ytag)
                .attr('fill', settings.layout.tagColor);
        }
        if (settings.layout.xtag) {
            svg.append('g')
                .attr('class', 'zy-y-tag')
                .attr('transform', 'translate(' + (width / 2.2) + ', ' + (height - 10) + ')')
                .append('text')
                .text(settings.layout.xtag)
                .attr('fill', settings.layout.tagColor);
        }

        // legend
        if (settings.legend.data.length) {
            var lengendTw;
            if (settings.legend.location != 0) {
                lengendTw = settings.legend.location;
            } else {
                lengendTw = width / 1.8;
            }
            var legend = svg.append('g')
                .attr('class', 'zy-line-legend')
                .attr('transform', 'translate(' + lengendTw + ', ' + (settings.layout.margin.top -
                    20) + ')')
                .selectAll('g')
                .data(settings.legend.data)
                .enter()
                .append('g');

            legend.append('rect')
                .attr('width', 12)
                .attr('height', 2)
                .attr('fill', function (d) {
                    return d[1];
                })
                .attr('x', function (d, i) {
                    return i * settings.legend.width;
                })
                .attr('y', -7);

            legend.append('text')
                .text(function (d) {
                    return d[0];
                })
                .attr('fill', viewCon.axisTagColor)
                .attr('x', function (d, i) {
                    return i * settings.legend.width + 20;
                });
        }

        var g = svg.append('g')
            .attr('transform', 'translate(' + settings.layout.margin.left + ', ' + settings.layout
                .margin
                .top + ')');


        // xScale
        var s_width = width - settings.layout.margin.left - settings.layout.margin.right;
        var s_height = height - settings.layout.margin.top - settings.layout.margin.bottom;
        var xScale;
        if (settings.xAxis.sort === 'asc') {
            xScale = d3.scaleLinear()
                .domain([d3.min(settings.xAxis.data), d3.max(defaults.xAxis.data)])
                .range([0, width - settings.layout.margin.left - settings.layout.margin.right])
                .nice();
        } else if (settings.xAxis.sort === 'desc') {
            xScale = d3.scaleLinear()
                .domain([d3.min(settings.xAxis.data), d3.max(settings.xAxis.data)])
                .range([width - settings.layout.margin.left - settings.layout.margin.right, 0])
                .nice();
        }

        // yScale
        var yScale;
        if (settings.yAxis.sort === 'asc') {
            yScale = d3.scaleLinear()
                .domain([d3.min(settings.yAxis.data), d3.max(settings.yAxis.data)])
                .range([height - settings.layout.margin.top - settings.layout.margin.bottom, 0])
                .nice();
        } else if (settings.yAxis.sort === 'desc') {
            yScale = d3.scaleLinear()
                .domain([d3.max(settings.yAxis.data), d3.min(settings.yAxis.data)])
                .range([height - settings.layout.margin.top - settings.layout.margin.bottom, 0])
                .nice();
        }

        // xAxis
        var xAxis;
        if (settings.xAxis.orient === 'bottom') {
            if (settings.xAxis.ticks === Infinity) {
                xAxis = d3.axisBottom(xScale);
            } else {
                xAxis = d3.axisBottom(xScale)
                    .ticks(settings.xAxis.ticks);
            }
        } else if (settings.xAxis.orient === 'top') {
            if (settings.xAxis.ticks === Infinity) {
                xAxis = d3.axisTop(xScale)
            } else {
                xAxis = d3.axisTop(xScale)
                    .ticks(settings.xAxis.ticks);
            }
        }

        // yAxis
        var yAxis;
        if (settings.yAxis.orient === 'left') {
            if (settings.yAxis.ticks === Infinity) {
                yAxis = d3.axisLeft(yScale);
            } else {
                yAxis = d3.axisLeft(yScale)
                    .ticks(settings.yAxis.ticks);
            }
        } else if (settings.yAxis.orient === 'right') {
            if (settings.yAxis.ticks === Infinity) {
                yAxis = d3.axisRight(yScale);
            } else {
                yAxis = d3.axisRight(yScale)
                    .ticks(settings.yAxis.ticks);
            }
        }

        // xGrid
        var xGrid;
        if (settings.xAxis.orient === 'bottom') {
            if (settings.xAxis.ticks === Infinity) {
                xGrid = d3.axisBottom(xScale)
                    .tickSize([height - settings.layout.margin.top - settings.layout.margin.bottom]);
            } else {
                xGrid = d3.axisBottom(xScale)
                    .tickSize([height - settings.layout.margin.top - settings.layout.margin.bottom])
                    .ticks(settings.xAxis.ticks);
            }
        } else if (settings.xAxis.orient === 'top') {
            if (settings.xAxis.ticks === Infinity) {
                xGrid = d3.axisTop(xScale)
                    .tickSize([height - settings.layout.margin.top - settings.layout.margin.bottom]);
            } else {
                xGrid = d3.axisTop(xScale)
                    .tickSize([height - settings.layout.margin.top - settings.layout.margin.bottom])
                    .ticks(settings.xAxis.ticks);
            }
        }

        // yGrid
        var yGrid;
        if (settings.yAxis.orient === 'left') {
            if (settings.yAxis.ticks === Infinity) {
                yGrid = d3.axisRight(yScale)
                    .tickSize([width - settings.layout.margin.left - settings.layout.margin.right]);
            } else {
                yGrid = d3.axisRight(yScale)
                    .tickSize([width - settings.layout.margin.left - settings.layout.margin.right])
                    .ticks(settings.yAxis.ticks);
            }
        } else if (settings.yAxis.orient === 'right') {
            if (settings.yAxis.ticks === Infinity) {
                yGrid = d3.axisLeft(yScale)
                    .tickSize([width - settings.layout.margin.left - settings.layout.margin.right]);
            } else {
                yGrid = d3.axisLeft(yScale)
                    .tickSize([width - settings.layout.margin.left - settings.layout.margin.right])
                    .ticks(settings.yAxis.ticks);
            }
        }

        /*--------- 添加xy轴 网格 - start ---------*/
        if (settings.layout.xgrid) {
            var x_xg = 0,
                y_xg = 0;
            if (settings.xAxis.orient === 'bottom') {
                x_xg = settings.layout.margin.left;
                y_xg = settings.layout.margin.top;
            } else if (settings.xAxis.orient === 'top') {
                x_xg = settings.layout.margin.left;
                y_xg = height - settings.layout.margin.top;
            }
            var xgrid = g.append('g')
                .attr('class', 'zy-x-grid')
                //.attr('transform', 'translate(' + x_xg + ',' + y_xg + ')')
                .call(xGrid);

            xgrid.selectAll('text')
                .text('');

            xgrid.selectAll('line')
                .attr('stroke', settings.layout.gridColor)
            //.attr('shape-rendering', settings.layout.lineRender);

            xgrid.selectAll('path')
            //.attr('stroke', settings.layout.gridColor)
            //.attr('shape-rendering', settings.layout.lineRender);
        }

        if (settings.layout.ygrid) {
            var x_yg = 0,
                y_yg = 0;
            if (settings.yAxis.orient === 'left') {
                x_yg = settings.layout.margin.left;
                y_yg = settings.layout.margin.top;
            } else if (settings.yAxis.orient === 'right') {
                x_yg = width - settings.layout.margin.left;
                y_yg = settings.layout.margin.top;
            }
            var ygrid = g.append('g')
                .attr('class', 'zy-y-grid')
                //.attr('transform', 'translate(' + x_yg + ',' + y_yg + ')')
                .call(yGrid);

            ygrid.selectAll('text')
                .text('');

            ygrid.selectAll('line')
                .attr('stroke', settings.layout.gridColor)
                .attr('shape-rendering', settings.layout.lineRender);

            ygrid.selectAll('path')
                .attr('stroke', settings.layout.gridColor)
                .attr('shape-rendering', settings.layout.lineRender);
        }
        /*--------- 添加xy轴 网格 - end ---------*/

        /*--------- 添加xy轴 - start ---------*/
        if (settings.xAxis.show) {
            var x_xa = 0,
                y_xa = 0;
            if (settings.xAxis.orient === 'bottom') {
                x_xa = 0;
                y_xa = height - settings.layout.margin.bottom - settings.layout.margin.top;
            } else if (settings.xAxis.orient === 'top') {
                x_xa = 0;
                y_xa = settings.layout.margin.top;
            }
            var xaxis = g.append('g')
                .attr('class', 'zy-x-axis')
                .attr('transform', 'translate(' + x_xa + ',' + y_xa + ')')
                .call(xAxis);

            xaxis.selectAll('text')
                .text(function (d) {
                    if (settings.xAxis.render instanceof Function) {
                        return settings.xAxis.render(d);
                    } else {
                        return d;
                    }
                })
                .attr('font-size', settings.layout.axisFontSize)
                .attr('fill', settings.layout.axisFontColor);

            xaxis.selectAll('line')
                .attr('stroke', settings.layout.axisColor)
                .attr('shape-rendering', settings.layout.lineRender);

            xaxis.selectAll('path')
                .attr('stroke', settings.layout.axisColor)
                .attr('shape-rendering', settings.layout.lineRender);

        }

        if (settings.yAxis.show) {
            /*var x_ya = 0, y_ya = 0;
             if (settings.yAxis.orient === 'left') {
             x_ya = settings.layout.margin.left;
             y_ya = 0;
             } else if (settings.yAxis.orient === 'right') {
             x_ya = width - settings.layout.margin.left;
             y_ya = 0;
             }*/
            var yaxis = g.append('g')
                .attr('class', 'zy-y-axis')
                //.attr('transform', 'translate(' + x_ya + ',' + y_ya + ')')
                .call(yAxis);

            yaxis.selectAll('text')
                .text(function (d) {
                    if (defaults.yAxis.render instanceof Function) {
                        return defaults.yAxis.render(d);
                    } else {
                        return d;
                    }
                })
                .attr('font-size', settings.layout.axisFontSize)
                .attr('fill', settings.layout.axisFontColor);

            yaxis.selectAll('line')
                .attr('stroke', settings.layout.axisColor)
                .attr('shape-rendering', settings.layout.lineRender);

            yaxis.selectAll('path')
                .attr('stroke', settings.layout.axisColor)
                .attr('shape-rendering', settings.layout.lineRender);
        }
        /*--------- 添加xy轴 - end ---------*/

        /*--------- 添加折线 - start ---------*/
        var line = d3.line()
            .x(function (d) {
                return xScale(d[0]);
            })
            .y(function (d) {
                return yScale(d[1]);
            });

        function returnText(str, arr, col) {
            if (!col) {
                col = ''
            }
            if (arr[0][0] == arr[1][0]) {
                return "";
            } else {
                return str + '-' + col + '(' + arr[0][0] + '~' + arr[1][0] + 'm)';
            }
        }

        function returnValue(arr) {
            if (arr[0][0] == arr[1][0]) {
                return "";
            } else {
                return arr[0][1];
            }
        }
        // 多条
        if (settings.data.length > 0) {
            var sData = settings.data;
            for (var k = 0; k < sData.length; k++) {
                if (sData[k].length > 0) {
                    for (var i = 0, len = sData[k].length; i < len; i++) {
                        for (var j = 0; j < sData[k][i][0].length; j++) {
                            g.append('path')
                                .attr('class', 'zy-line-path')
                                //.attr('transform', 'translate(' + settings.layout.margin.left + ',' + settings.layout.margin.top + ')')
                                .attr('d', line(sData[k][i][0][j]))
                                .attr('stroke', settings.color[k])
                                .attr('fill', 'none')
                                .attr('data', sData[k][i][0][j])
                                .attr('data-text', returnText(settings.text[k], sData[k][i][0][j], sData[k][i][1][0]))
                                .attr('data-value', returnValue(sData[k][i][0][j]))
                                .attr('stroke-width', settings.layout.lineWidth)
                                .attr('shape-rendering', settings.layout.lineEdges)
                                .on('mousemove', function () {
                                    if (d3.select(this).attr('data-value')) {
                                        d3.select(this)
                                            .attr('stroke-width', 4);
                                        showTip(true, d3.event, d3.select(this));
                                    }
                                })
                                .on('mouseout', function () {
                                    if (d3.select(this).attr('data-value')) {
                                        d3.select(this)
                                            .attr('stroke-width', settings.layout.lineWidth);
                                        showTip(false);
                                    }
                                });
                        }
                    }
                }
            }
        }
        /*--------- 添加折线 - end ---------*/

        /*--------- 添加圆圈 - start ---------*/

        if (settings.data.length > 0) {
            var sData = settings.data;
            if (settings.pointText.circle) {
                for (var k = 0; k < sData.length; k++) {
                    if (sData[k].length > 0) {
                        for (var i = 0, len = sData[k].length; i < len; i++) {
                            for (var j = 0; j < sData[k][i][0].length; j++) {
                                g.append('g')
                                    .attr('class', 'zy-circle-all')
                                    .selectAll('circle')
                                    .data(sData[k][i][0][j])
                                    .enter()
                                    .append('circle')
                                    .attr('class', 'zy-circle')
                                    .attr('data', sData[k][i][0][j])
                                    .attr('cx', line.x())
                                    .attr('cy', line.y())
                                    .attr('r', 3)
                                    .attr('stroke', settings.color[k])
                                    .attr('fill', '#ffffff')
                                    .attr('stroke-width', '1.5px');
                            }
                        }
                    }
                }
            }
        }

        /*--------- 添加圆圈 - end ---------*/

        var zoom = d3.zoom()
            .scaleExtent([1, 32])
            .translateExtent([
                [0, 0],
                [s_width, s_height]
            ])
            .extent([
                [0, 0],
                [s_width, s_height]
            ])
            .on("zoom", zoomed);


        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", s_width)
            .attr("height", s_height);

        svg.call(zoom).transition()
            .duration(150);

        function zoomed() {
            var t = d3.event.transform,
                xt = t.rescaleX(xScale);
            var lineT = d3.line()
                .x(function (d) {
                    return xt(d[0]);
                })
                .y(function (d) {
                    return yScale(d[1]);
                });
            g.selectAll(".zy-line-path").attr("d", function () {
                var x = d3.select(this)
                    .attr('data');
                x = x.split(',');
                var arr = [
                    [parseFloat(x[0]), parseFloat(x[1])],
                    [parseFloat(x[2]), parseFloat(x[3])]
                ];
                var val = lineT(arr);
                return val;
            });
            g.selectAll(".zy-circle").attr("cx", function (d) {
                return xt(d[0]);
            });
            var xaxi = g.select(".zy-x-axis").call(xAxis.scale(xt));
            xaxi.selectAll('line')
                .attr('stroke', settings.layout.axisColor)
                .attr('shape-rendering', settings.layout.lineRender);

            var xgrid1 = g.select(".zy-x-grid").call(xGrid.scale(xt));


            xgrid1.selectAll('text')
                .text('');

            xgrid1.selectAll('line')
                .attr('stroke', settings.layout.gridColor)
                .attr('shape-rendering', settings.layout.lineRender);

            xgrid1.selectAll('path')
                .attr('stroke', settings.layout.gridColor)
                .attr('shape-rendering', settings.layout.lineRender);
        }
    };
    
    return charts;
})();
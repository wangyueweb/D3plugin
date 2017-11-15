function extend(defaults, options, flag) {
    if (flag || (chkObject(defaults) && chkObject(options))) {
        for (var k in options) {
            if (defaults.hasOwnProperty(k)) {
                if (chkObject(defaults[k]) && chkObject(options[k])) {
                    extend(defaults[k], options[k], true);
                } else {
                    defaults[k] = options[k];
                }
            }
        }
    }
    return defaults;
}

function chkObject(obj) {
    return (Object.prototype.toString.call(obj) === '[object Object]');
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
        w = 900;
        h = 900;
    } else {
        throw new Error('缺少必要的绘图容器!');
    }
    return {
        width: w,
        height: h
    }
}

var viewCon = {

    axisTxtColor: '#8393ad', // 坐标轴文字颜色
    axisTickColor: '#182037', // 坐标轴刻度颜色
    axisFontSize: '12px', // 坐标轴刻度文字大小

    gridLineColor: '#8393ad', // 网格线条颜色
    yGridLineWidth: 26, // y轴网格线条宽度
    yGridLineColor: '#364161', // y轴网格线条宽度

    axisTagColor: '#8393ad', // 坐标轴标签文本颜色

    dotColor: '#4a69b9', // 散点默认颜色
    dotSize: 4, // 散点大小
    lineColor: '#4067c4', // 折线默认颜色
    barColor: '#3d64ff', // 柱状默认颜色

    axisTickSize: 4, // 刻度长度
    legendDotSize: 5, // 图例点状大小

    emptyInfo: '<div class="zy-charts-empty">暂无数据~</div>'

};
/**
 * Created by phy on 2017/12/12.
 * 整合项目database,此项目产生2个全局变量
 * DL(大脸)为一般JS工具集合,源生js，零依赖
 * DLBase为系统项目提供适用于自身需求的公共方法
 * 修改此文件需谨慎!
 * */

var DL = {
    //**************************** 字符串 - start ****************************/
    //去除空格  type 1-所有空格  2-前后空格  3-前空格 4-后空格
    //trim('  1235asd',1)
    //result：1235asd
    trim: function (str, type) {
        switch (type) {
            case 1:
                return str.replace(/\s+/g, "");
            case 2:
                return str.replace(/(^\s*)|(\s*$)/g, "");
            case 3:
                return str.replace(/(^\s*)/g, "");
            case 4:
                return str.replace(/(\s*$)/g, "");
            default:
                return str;
        }
    },

    /*type
     1:首字母大写
     2：首页母小写
     3：大小写转换
     4：全部大写
     5：全部小写
     * */
    //changeCase('asdasd',1)
    //result：Asdasd
    changeCase: function (str, type) {
        // 大小写转换方法
        function ToggleCase(str) {
            var itemText = ""
            str.split("").forEach(
                function (item) {
                    console.log(item)
                    if (/^([a-z]+)/.test(item)) {
                        itemText += item.toUpperCase();
                    } else if (/^([A-Z]+)/.test(item)) {
                        itemText += item.toLowerCase();
                    } else {
                        itemText += item;
                    }
                });
            return itemText;
        }
        switch (type) {
            case 1:
                return str.replace(/\b\w+\b/g, function (word) {
                    return word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase();
                })
            case 2:
                return str.replace(/\b\w+\b/g, function (word) {
                    return word.substring(0, 1).toLowerCase() + word.substring(1).toUpperCase();
                });
            case 3:
                return ToggleCase(str);
            case 4:
                return str.toUpperCase();
            case 5:
                return str.toLowerCase();
            default:
                return str;
        }
        return ToggleCase(str)
    },

    //字符串循环复制
    //repeatStr(str->字符串, count->次数)
    //repeatStr('123',3)
    //"result：123123123"
    repeatStr: function (str, count) {
        var text = '';
        for (var i = 0; i < count; i++) {
            text += str;
        }
        return text;
    },

    //字符串替换(字符串,要替换的字符或者正则表达式（不要写g）,替换成什么)
    //DL.replaceAll('这里是上海，中国第三大城市，广东省省会，简称穗，','上海','广州')
    //result："这里是广州，中国第三大城市，广东省省会，简称穗，"
    replaceAll: function (str, AFindText, ARepText) {
        raRegExp = new RegExp(AFindText, "g");
        return str.replace(raRegExp, ARepText);
    },

    //字符替换*
    //replaceStr(字符串,字符格式, 替换方式,替换的字符（默认*）)
    replaceStr: function (str, regArr, type, ARepText) {
        var regtext = '',
            Reg = null,
            replaceText = ARepText || '*';
        //replaceStr('18819322663',[3,5,3],0)
        //result：188*****663
        //repeatStr是在上面定义过的（字符串循环复制），大家注意哦
        if (regArr.length === 3 && type === 0) {
            regtext = '(\\w{' + regArr[0] + '})\\w{' + regArr[1] + '}(\\w{' + regArr[2] + '})'
            Reg = new RegExp(regtext);
            var replaceCount = this.repeatStr(replaceText, regArr[1]);
            return str.replace(Reg, '$1' + replaceCount + '$2')
        }
        //replaceStr('asdasdasdaa',[3,5,3],1)
        //result：***asdas***
        else if (regArr.length === 3 && type === 1) {
            regtext = '\\w{' + regArr[0] + '}(\\w{' + regArr[1] + '})\\w{' + regArr[2] + '}'
            Reg = new RegExp(regtext);
            var replaceCount1 = this.repeatStr(replaceText, regArr[0]);
            var replaceCount2 = this.repeatStr(replaceText, regArr[2]);
            return str.replace(Reg, replaceCount1 + '$1' + replaceCount2)
        }
        //replaceStr('1asd88465asdwqe3',[5],0)
        //result：*****8465asdwqe3
        else if (regArr.length === 1 && type === 0) {
            regtext = '(^\\w{' + regArr[0] + '})'
            Reg = new RegExp(regtext);
            var replaceCount = this.repeatStr(replaceText, regArr[0]);
            return str.replace(Reg, replaceCount)
        }
        //replaceStr('1asd88465asdwqe3',[5],1,'+')
        //result："1asd88465as+++++"
        else if (regArr.length === 1 && type === 1) {
            regtext = '(\\w{' + regArr[0] + '}$)'
            Reg = new RegExp(regtext);
            var replaceCount = this.repeatStr(replaceText, regArr[0]);
            return str.replace(Reg, replaceCount)
        }
    },

    //检测字符串
    //checkType('165226226326','phone')
    //result：false
    //大家可以根据需要扩展
    checkType: function (str, type) {
        switch (type) {
            case 'email':
                return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
            case 'phone':
                return /^1[3|4|5|7|8][0-9]{9}$/.test(str);
            case 'tel':
                return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str);
            case 'number':
                return /^[0-9]$/.test(str);
            case 'english':
                return /^[a-zA-Z]+$/.test(str);
            case 'text':
                return /^\w+$/.test(str);
            case 'chinese':
                return /^[\u4E00-\u9FA5]+$/.test(str);
            case 'lower':
                return /^[a-z]+$/.test(str);
            case 'upper':
                return /^[A-Z]+$/.test(str);
            default:
                return true;
        }
    },

    //检测密码强度
    //checkPwd('12asdASAD')
    //result：3(强度等级为3)
    checkPwd: function (str) {
        var nowLv = 0;
        if (str.length < 6) {
            return nowLv
        }
        if (/[0-9]/.test(str)) {
            nowLv++
        }
        if (/[a-z]/.test(str)) {
            nowLv++
        }
        if (/[A-Z]/.test(str)) {
            nowLv++
        }
        if (/[\.|-|_]/.test(str)) {
            nowLv++
        }
        return nowLv;
    },

    //**************************** 字符串 - end ****************************/

    //**************************** 数组 -  start ****************************/

    //数组去重
    removeRepeatArray: function (arr) {
        return arr.filter(function (item, index, self) {
            return self.indexOf(item) === index;
        });
        //es6
        //return Array.from(new Set(arr))
    },

    //数组顺序打乱
    upsetArr: function (arr) {
        return arr.sort(function () {
            return Math.random() - 0.5
        });
    },

    //数组最大值
    //这一块的封装，主要是针对数字类型的数组
    maxArr: function (arr) {
        return Math.max.apply(null, arr);
    },

    //数组最小值
    minArr: function (arr) {
        return Math.min.apply(null, arr);
    },

    //这一块的封装，主要是针对数字类型的数组
    //数组求和
    sumArr: function (arr) {
        return arr.reduce(function (pre, cur) {
            return pre + cur
        })
    },

    //数组平均值,小数点可能会有很多位，这里不做处理，处理了使用就不灵活了！
    covArr: function (arr) {
        return this.sumArr(arr) / arr.length;
    },

    //从数组中随机获取元素
    randomOne: function (arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },

    //回数组（字符串）一个元素出现的次数
    //getEleCount('asd56+asdasdwqe','a')
    //result：3
    //getEleCount([1,2,3,4,5,66,77,22,55,22],22)
    //result：2
    getEleCount: function (obj, ele) {
        var num = 0;
        for (var i = 0, len = obj.length; i < len; i++) {
            if (ele === obj[i]) {
                num++;
            }
        }
        return num;
    },

    //返回数组（字符串）出现最多的几次元素和出现次数
    //arr, rank->长度，默认为数组长度，ranktype，排序方式，默认降序
    //返回值：el->元素，count->次数
    //getCount([1,2,3,1,2,5,2,4,1,2,6,2,1,3,2])
    //result：[{"el":"2","count":6},{"el":"1","count":4},{"el":"3","count":2},{"el":"4","count":1},{"el":"5","count":1},{"el":"6","count":1}]
    //默认情况，返回所有元素出现的次数
    //getCount([1,2,3,1,2,5,2,4,1,2,6,2,1,3,2],3)
    //传参（rank=3），只返回出现次数排序前三的
    //result：[{"el":"2","count":6},{"el":"1","count":4},{"el":"3","count":2}]
    //getCount([1,2,3,1,2,5,2,4,1,2,6,2,1,3,2],null,1)
    //传参（ranktype=1,rank=null），升序返回所有元素出现次数
    //result：[{"el":"6","count":1},{"el":"5","count":1},{"el":"4","count":1},{"el":"3","count":2},{"el":"1","count":4},{"el":"2","count":6}]
    //getCount([1,2,3,1,2,5,2,4,1,2,6,2,1,3,2],3,1)
    //传参（rank=3，ranktype=1），只返回出现次数排序（升序）前三的
    //result：[{"el":"6","count":1},{"el":"5","count":1},{"el":"4","count":1}]
    getCount: function (arr, rank, ranktype) {
        var obj = {},
            k, arr1 = []
        //记录每一元素出现的次数
        for (var i = 0, len = arr.length; i < len; i++) {
            k = arr[i];
            if (obj[k]) {
                obj[k]++;
            } else {
                obj[k] = 1;
            }
        }
        //保存结果{el-'元素'，count-出现次数}
        for (var o in obj) {
            arr1.push({el: o, count: obj[o]});
        }
        //排序（降序）
        arr1.sort(function (n1, n2) {
            return n2.count - n1.count
        });
        //如果ranktype为1，则为升序，反转数组
        if (ranktype === 1) {
            arr1 = arr1.reverse();
        }
        var rank1 = rank || arr1.length;
        return arr1.slice(0, rank1);
    },

    //得到n1-n2下标的数组
    //getArrayNum([0,1,2,3,4,5,6,7,8,9],5,9)
    //result：[5, 6, 7, 8, 9]
    //getArrayNum([0,1,2,3,4,5,6,7,8,9],2) 不传第二个参数,默认返回从n1到数组结束的元素
    //result：[2, 3, 4, 5, 6, 7, 8, 9]
    getArrayNum: function (arr, n1, n2) {
        if(n1 < n2){
            return arr.slice(n1, n2);
        } else {
            return '起始数值下标必须小于结束数值下标'
        }
    },

    //筛选数组
    //删除值为'val'的数组元素
    //removeArrayForValue(['test','test1','test2','test','aaa'],'test','%')
    //result：["aaa"]   带有'test'的都删除
    //removeArrayForValue(['test','test1','test2','test','aaa'],'test')
    //result：["test1", "test2", "aaa"]  //数组元素的值全等于'test'才被删除
    removeArrayForValue: function (arr, val, type) {
        return arr.filter(function (item) {
            console.log(item.indexOf(val))
            return type ? item.indexOf(val) === -1 : item !== val
        })
    },

    //获取对象数组某些项
    //var arr=[{a:1,b:2,c:9},{a:2,b:3,c:5},{a:5,b:9},{a:4,b:2,c:5},{a:4,b:5,c:7}]
    //getOptionArray(arr,'a,c')
    //result：[{a:1,c:9},{a:2,c:5},{a:5,c:underfind},{a:4,c:5},{a:4,c:7}]
    //getOptionArray(arr,'b',1)
    //result：[2, 3, 9, 2, 5]
    getOptionArray: function (arr, keys) {
        var newArr = []
        if (!keys) {
            return arr
        }
        var _keys = keys.split(','), newArrOne = {};
        //是否只是需要获取某一项的值
        if (_keys.length === 1) {
            for (var i = 0, len = arr.length; i < len; i++) {
                newArr.push(arr[i][keys])
            }
            return newArr;
        }
        for (var i = 0, len = arr.length; i < len; i++) {
            newArrOne = {};
            for (var j = 0, len1 = _keys.length; j < len1; j++) {
                newArrOne[_keys[j]] = arr[i][_keys[j]]
            }
            newArr.push(newArrOne);
        }
        return newArr
    },

    //排除数组某些项
    //var arr=[{a:1,b:2,c:9},{a:2,b:3,c:5},{a:5,b:9},{a:4,b:2,c:5},{a:4,b:5,c:7}]
    //filterOptionArray(arr,'a')
    //result：[{b:2,c:9},{b:3,c:5},{b:9},{b:2,c:5},{b:5,c:7}]
    //filterOptionArray(arr,'a,c')
    //result：[{b:2},{b:3},{b:9},{b:2},{b:5}]
    filterOptionArray: function (arr, keys) {
        var newArr = []
        var _keys = keys.split(','), newArrOne = {};
        for (var i = 0, len = arr.length; i < len; i++) {
            newArrOne = {};
            for (var key in arr[i]) {
                //如果key不存在排除keys里面,添加数据
                if (_keys.indexOf(key) === -1) {
                    newArrOne[key] = arr[i][key];
                }
            }
            newArr.push(newArrOne);
        }
        return newArr
    },

    //对象数组的排序
    //var arr=[{a:1,b:2,c:9},{a:2,b:3,c:5},{a:5,b:9},{a:4,b:2,c:5},{a:4,b:5,c:7}]
    //ecDo.arraySort(arr,'a,b')a是第一排序条件，b是第二排序条件
    //result：[{"a":1,"b":2,"c":9},{"a":2,"b":3,"c":5},{"a":4,"b":2,"c":5},{"a":4,"b":5,"c":7},{"a":5,"b":9}]
    arraySort: function (arr, sortText) {
        if (!sortText) {
            return arr
        }
        var _sortText = sortText.split(',').reverse(), _arr = arr.slice(0);
        for (var i = 0, len = _sortText.length; i < len; i++) {
            _arr.sort(function (n1, n2) {
                console.log(n1)
                return n1[_sortText[i]] - n2[_sortText[i]]
            })
        }
        return _arr;
    },
    //**************************** 数组 -  end ****************************/
    
}

var DLBase = function () {
    /** 返回此基本对象 **/
    var base = {};

    /** 当前项目公共变量 - start **/

    // 导出pdf或doc
    base.pdf_doc = function () {
        var bool = false;
        bool = window.pdf_doc === 'true' ? true : false;
        return bool;
    }();
    
    /** 当前项目公共变量 - end **/


    /** ################################################### **/
    /** ----------------- 通用方法 start -----------------  **/
    /** ################################################### **/

    // ******************************* 参数 start **********************************
    /**
     * 判断一个参数是否为空值
     * @param s 字符串
     * @returns {boolean}
     */
    function notEmpty(s) {
        return s !== undefined && s !== null && s !== '' && s !== ' ';
    }

    // 导出公共方法
    base.notEmpty = notEmpty;
    return base
}();
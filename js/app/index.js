/**
 *  kouchao 创建于 2017/7/15
 */
var c = $("#myCanvas")[0]
    , cxt = c.getContext("2d")

    , beginX = 10
    , beginY = 10

    , map = []

    , role = 0
    , element = ''
    , eid = ''


    , startNode, engNode, row, col

    , spendList = {
    r1: 400,
    r2: 400,

    r3: 3,
    r4: 3,

    r5: 1,
    r6: 1,
    r7: 1,
    r8: 1,

    r9: 2,
    r10: 2,
    r11: 2000,
    r12: 200
}, unit = {
    width: 0,
    height: 0
}

$('.ele').click(function () {
    role = $(this).data('role');
    element = $(this)[0].src;
    eid = $(this).data('eid');
});

$('canvas').click(paint);

$('.initGrid').click(initGrid);


/**
 * 根据src生成img
 * @param {String} src 图片路径
 * @return {Image} img 图片对象
 */
function createImg(src) {
    var img = new Image();
    img.src = src;
    return img;
}

/**
 * 节点对象
 * @param {Number} width 宽
 * @param {Number} height 高
 * @param {Number} x x坐标
 * @param {Number} y y坐标
 * @param {Number} startX 开始点x坐标
 * @param {Number} startY 开始点x坐标
 * @param {String} role 节点角色
 * @param {String} element 角色对应的图片，是一个uri
 */
function node(width, height, x, y, startX, startY, role, element) {
    // 元素宽高
    this.width = width;
    this.height = height;
    //权重
    this.spend = 10;
    //	元素坐标
    this.x = x;
    this.y = y;
    // 开始与结束位置
    this.startX = startX;
    this.startY = startY;
    this.endX = startX + this.width;
    this.endY = startY + this.height;
    // 角色
    this.role = role;
    // 角色对应的图片
    this.element = element;
    // 节点id
    this.id = x * 10 + y;
    // 元素id
    this.eid = '';
    // 文字
    this.text = '';
}

// 设置并绘制网格
function initGrid() {
    var width = unit.width = parseFloat($('#width').val())
        , height = unit.height = parseFloat($('#height').val());
    col = parseFloat($('#col').val());
    row = parseFloat($('#row').val());
    // 设置画布宽高
    c.width = width * col + beginX * 2;
    c.height = height * row + beginY * 2;

    buildGrid(width, height);
    $('#doc-modal-1').modal('close');
}

/**
 * 绘制map上一个点击的节点
 * @param {event} event 点击事件
 */
function paint(event) {

    clearMap();

    var offsetX = event.offsetX;
    var offsetY = event.offsetY;


    var x = parseInt(offsetX / unit.width)
    var y = parseInt(offsetY / unit.height)

    if (offsetX > map[i][j].startX && offsetX < map[i][j].endX && offsetY > map[i][j].startY && offsetY < map[i][j].endY) {


        if (role == 'startP') {
            map[x][y].isStart = true;
            startNode = map[x][y];
        } else if (role == 'endP') {
            map[x][y].isEnd = true;
            engNode = map[x][y];
        } else {

            map[x][y].spend = spendList[eid] || 10;
            map[x][y].role = role;
            map[x][y].element = element;
            map[x][y].eid = eid;
        }

        if (eid == 'p5' || eid == 'p6' || eid == 'p7' || eid == 'p8') {
            map[x][y].text = prompt("请输入车位编号", "")
        }

    }

    buildMap();

    console.log(map)
}

/**
 * 画网格
 * @param {Number} w 宽
 * @return {Number} h 高
 */
function buildGrid(w, h) {
    var arr = [];
    // 行
    for (var r = 0; r < row; r++) {
        arr[r] = new Array();
        // 列
        for (var l = 0; l < col; l++) {
            startX = beginX + (r) * w;
            startY = beginY + (l) * h;

            x_zuobiao = startX + 20;
            y_zuobiao = startY + 20;

            arr[r].push(new node(w, h, r, l, startX, startY, 0, '', ''))

            cxt.strokeRect(startX, startY, w, h);
            // cxt.fillText('('+r+','+l+')空地',x_zuobiao,y_zuobiao);
        }
    }
    map = clone(arr);
}


// 生成地图
function buildMap() {

    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[i].length; j++) {

            var textX = map[i][j].startX + map[i][j].width / 2;
            var textY = map[i][j].startY + map[i][j].height / 2;


            if (map[i][j].element != '') {
                cxt.drawImage(createImg(map[i][j].element), map[i][j].startX, map[i][j].startY, map[i][j].width, map[i][j].height);
            } else {
                cxt.fillStyle = '#000';
                cxt.strokeRect(map[i][j].startX, map[i][j].startY, map[i][j].width, map[i][j].height);
            }

            if (map[i][j].isStart) {
                cxt.beginPath();
                cxt.arc(textX, textY, map[i][j].width / 4, 0, Math.PI * 2, true);
                cxt.closePath();
                cxt.fillStyle = '#5eb95e';
                cxt.fill();

            } else if (map[i][j].isEnd) {
                cxt.beginPath();
                cxt.arc(textX, textY, map[i][j].width / 4, 0, Math.PI * 2, true);
                cxt.closePath();
                cxt.fillStyle = '#5eb95e';
                cxt.fill();

            } else {
                if (map[i][j].element != '') {
                    cxt.drawImage(createImg(map[i][j].element), map[i][j].startX, map[i][j].startY, map[i][j].width, map[i][j].height);
                } else {
                    cxt.fillStyle = '#000';
                    cxt.strokeRect(map[i][j].startX, map[i][j].startY, map[i][j].width, map[i][j].height);
                }
            }


        }

    }
    buildText();

}

// 绘制文字
function buildText() {
    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[i].length; j++) {

            var textX = map[i][j].startX + map[i][j].width / 2;
            var textY = map[i][j].startY + map[i][j].height / 2;

            if (map[i][j].isStart) {
                cxt.beginPath();
                cxt.arc(textX, textY, map[i][j].width / 4, 0, Math.PI * 2, true);
                cxt.closePath();
                cxt.fillStyle = '#5eb95e';
                cxt.fill();
                cxt.textAlign = "center";
                cxt.font = "20px Arial";
                cxt.textBaseline = "middle";
                cxt.fillStyle = '#fff';
                cxt.fillText('起', textX, textY);
            } else if (map[i][j].isEnd) {
                cxt.beginPath();
                cxt.arc(textX, textY, map[i][j].width / 4, 0, Math.PI * 2, true);
                cxt.closePath();
                cxt.fillStyle = '#5eb95e';
                cxt.fill();
                cxt.textAlign = "center";
                cxt.font = "20px Arial";
                cxt.textBaseline = "middle";
                cxt.fillStyle = '#fff';
                cxt.fillText('终', textX, textY);
            }

            cxt.textAlign = "center";
            cxt.font = "30px Arial";
            cxt.textBaseline = "middle";
            cxt.fillStyle = '#fff';
            if (map[i][j].eid == 'p6') {
                cxt.fillText(map[i][j].text, map[i][j].endX, textY);
            }
            if (map[i][j].eid == 'p8') {
                cxt.fillText(map[i][j].text, map[i][j].startX, textY);
            }
            if (map[i][j].eid == 'p5') {

                for (var k = 0; k < map[i][j].text.length; k++) {
                    cxt.fillText(map[i][j].text[k], textX, map[i][j].startY - map[i][j].height + (map[i][j].height - (map[i][j].text.length * 30 / 2)) + 30 * k + 15);
                }

            }
            if (map[i][j].eid == 'p7') {
                for (var k = 0; k < map[i][j].text.length; k++) {
                    cxt.fillText(map[i][j].text[k], textX, map[i][j].startY + (map[i][j].height - (map[i][j].text.length * 30 / 2)) + 30 * k + 15);
                }
            }


        }

    }
}

// 清空map
function clearMap() {
    c.height = c.height;
}

/**
 * 复制object
 * @param {Object} object 要复制的对象
 * @return {Object} 复制一份
 */
function clone(object) {
    return JSON.parse(JSON.stringify(object))
}


function test() {
    begin()
}


//开始
function begin() {
    if (startNode && engNode) {
        var path = findway(map, startNode, engNode);
        console.log(path);
        if (!path) alert('无路可走');
        else {
            cxt.beginPath();
            cxt.moveTo(startNode.startX + startNode.width / 2, startNode.startY + startNode.height / 2);
            for (var i = 0; i < path.length; i++) {
                cxt.lineTo(path[i].startX + path[i].width / 2, path[i].startY + path[i].height / 2);
                // console.log(path[i])
            }
            cxt.lineWidth = 5;
            cxt.strokeStyle = "#5eb95e";
            cxt.stroke();

            buildArrow(path)

        }
    } else {
        alert('未设置起点和终点')
    }


}

/**
 * 画箭头
 * @param {Array} arr path路径
 */
function buildArrow(arr) {
    for (var i = 0; i < arr.length - 1; i++) {

        var isLeftToRight = false
            , isRightToLeft = false
            , isTopToBottom = false
            , isBottomToTop = false


        // if (i == 0) {
        //     if (arr[i].y == arr[i + 1].y) {
        //         if (arr[i].x < arr[i + 1].x) {
        //             isLeftToRight = true
        //         } else {
        //             isRightToLeft = true
        //         }
        //     } else {
        //         if (arr[i].y < arr[i + 1].y) {
        //             isTopToBottom = true
        //         } else {
        //             isBottomToTop = true
        //         }
        //     }
        // } else

        if (i % 2 == 1) {
            if (arr[i].y == arr[i + 1].y && arr[i].y == arr[i - 1].y) {
                if (arr[i].x < arr[i + 1].x) {
                    isLeftToRight = true
                } else {
                    isRightToLeft = true
                }
            } else if (arr[i].x == arr[i + 1].x && arr[i].x == arr[i - 1].x) {
                if (arr[i].y < arr[i + 1].y) {
                    isTopToBottom = true
                } else {
                    isBottomToTop = true
                }
            }


            if (isLeftToRight) {

                var p1 = {
                        x: arr[i].startX + arr[i].width / 3,
                        y: arr[i].startY + arr[i].height / 3
                    },
                    p2 = {
                        x: arr[i].startX + arr[i].width / 1.5,
                        y: arr[i].startY + arr[i].height / 2
                    },
                    p3 = {
                        x: arr[i].startX + arr[i].width / 3,
                        y: arr[i].startY + arr[i].height / 1.5
                    };
            }

            if (isRightToLeft) {

                var p1 = {
                        x: arr[i].startX + arr[i].width / 1.5,
                        y: arr[i].startY + arr[i].height / 3
                    },
                    p2 = {
                        x: arr[i].startX + arr[i].width / 3,
                        y: arr[i].startY + arr[i].height / 2
                    },
                    p3 = {
                        x: arr[i].startX + arr[i].width / 1.5,
                        y: arr[i].startY + arr[i].height / 1.5
                    };
            }

            if (isTopToBottom) {
                var p1 = {
                        x: arr[i].startX + arr[i].width / 3,
                        y: arr[i].startY + arr[i].height / 3
                    },
                    p2 = {
                        x: arr[i].startX + arr[i].width / 2,
                        y: arr[i].startY + arr[i].height / 1.5
                    },
                    p3 = {
                        x: arr[i].startX + arr[i].width / 1.5,
                        y: arr[i].startY + arr[i].height / 3
                    };
            }

            if (isBottomToTop) {
                var p1 = {
                        x: arr[i].startX + arr[i].width / 3,
                        y: arr[i].startY + arr[i].height / 1.5
                    },
                    p2 = {
                        x: arr[i].startX + arr[i].width / 2,
                        y: arr[i].startY + arr[i].height / 3
                    },
                    p3 = {
                        x: arr[i].startX + arr[i].width / 1.5,
                        y: arr[i].startY + arr[i].height / 1.5
                    };
            }

            if (p1 && p2 && p3) createArrow(p1, p2, p3);
        }

    }
}

/**
 * 生成箭头
 * @param {Object} p1 {x: n, y: n}
 * @param {Object} p2 {x: n, y: n}
 * @param {Object} p3 {x: n, y: n}
 */
function createArrow(p1, p2, p3) {
    cxt.beginPath();
    cxt.moveTo(p1.x, p1.y);
    cxt.lineTo(p2.x, p2.y);
    cxt.lineTo(p3.x, p3.y);
    cxt.lineWidth = 5;
    cxt.strokeStyle = "#5eb95e";
    cxt.stroke();
}


/**
 * 查找周围的点
 * @param {Array} points 地图
 * @param {Node} current 当前的店
 * @return {Array} rounds 周围的点
 */
function getRounds(points, current) {
    var u = null;//上
    var l = null;//左
    var d = null;//下
    var r = null;//右
    var rounds = [];
    // 上
    if (current.x - 1 >= 0) {
        u = points[current.x - 1][current.y];
        rounds.push(u);
    }
    // 左
    if (current.y - 1 >= 0) {
        l = points[current.x][current.y - 1];
        rounds.push(l);
    }
    // 下
    if (current.x + 1 < points.length) {
        d = points[current.x + 1][current.y];
        rounds.push(d);
    }
    // 右
    if (current.y + 1 < points[0].length) {
        r = points[current.x][current.y + 1];
        rounds.push(r);
    }
    return rounds;
}

/**
 * 监测是否在列表中
 * @param {Array} list 关闭或开启列表
 * @param {Node} current 当前节点
 * @return {Boolean} true: 存在 false: 不存在
 */
function inList(list, current) {
    for (var i = 0, len = list.length; i < len; i++) {
        if ((current.x == list[i].x && current.y == list[i].y) || (current == list[i]))
            return true;
    }
    return false;
}

/**
 * 寻找路径（astar算法）
 * @param {Array} points 地图
 * @param {Node} start 起点
 * @param {Node} end 终点
 * @return {Array || Boolean} 有路径返回路径数组，没有则返回false
 */
function findway(points, start, end) {
    var opens = [];  // 存放可检索的方块(开启列表)
    var closes = [];  // 存放已检索的方块（关闭列表）
    var cur = null;  // 当前指针
    var bFind = true;  // 是否检索
    // 设置开始点的F、G为0并放入opens列表（F=G+H）
    start.F = 0;
    start.G = 0;
    start.H = 0;
    // 将起点压入closes数组，并设置cur指向起始点
    closes.push(start);
    cur = start;
    // 如果起始点紧邻结束点则不计算路径直接将起始点和结束点压入closes数组
    if (Math.abs(start.x - end.x) + Math.abs(start.y - end.y) == 1) {
        end.P = start;
        closes.push(end);
        bFind = false;
    }
    // 计算路径
    while (cur && bFind) {
        //如果当前元素cur不在closes列表中，则将其压入closes列表中
        if (!inList(closes, cur))
            closes.push(cur);
        // 然后获取当前点四周点
        var rounds = getRounds(points, cur);
        // 当四周点不在opens数组中并且可移动，设置G、H、F和父级P，并压入opens数组
        for (var i = 0; i < rounds.length; i++) {
            if (!rounds[i].role || inList(closes, rounds[i]) || inList(opens, rounds[i]))
                continue;
            else if (!inList(opens, rounds[i]) && rounds[i].role) {


                rounds[i].G = cur.G + 10 * rounds[i].spend;//不算斜的，只算横竖，设每格距离为spend

                console.log({
                    a: rounds[i].spend
                })

                rounds[i].H = Math.abs(rounds[i].y - end.y) + Math.abs(rounds[i].x - end.x);
                rounds[i].F = rounds[i].G + rounds[i].H;
                rounds[i].P = cur;//cur为.P的父指针
                opens.push(rounds[i]);
            }
        }
        // 如果获取完四周点后opens列表为空，则代表无路可走，此时退出循环
        if (!opens.length) {
            cur = null;
            opens = [];
            closes = [];
            break;
        }
        // 按照F值由小到大将opens数组排序
        opens.sort(function (a, b) {
            return a.F - b.F;
        });
        // 取出opens数组中F值最小的元素，即opens数组中的第一个元素
        var oMinF = opens[0];
        var aMinF = [];  // 存放opens数组中F值最小的元素集合
        // 循环opens数组，查找F值和cur的F值一样的元素，并压入aMinF数组。即找出和最小F值相同的元素有多少
        for (var i = 0; i < opens.length; i++) {
            if (opens[i].F == oMinF.F)
                aMinF.push(opens[i]);
        }
        // 如果最小F值有多个元素
        if (aMinF.length > 1) {
            // 计算元素与cur的曼哈顿距离
            for (var i = 0; i < aMinF.length; i++) {
                aMinF[i].D = Math.abs(aMinF[i].x - cur.x) + Math.abs(aMinF[i].y - cur.y);
            }
            // 将aMinF按照D曼哈顿距离由小到大排序（按照数值的大小对数字进行排序）
            aMinF.sort(function (a, b) {
                return a.D - b.D;
            });
            oMinF = aMinF[0];
        }
        // 将cur指向D值最小的元素
        cur = oMinF;
        // 将cur压入closes数组
        if (!inList(closes, cur))
            closes.push(cur);
        // 将cur从opens数组中删除
        for (var i = 0; i < opens.length; i++) {
            if (opens[i] == cur) {
                opens.splice(i, 1);//将第i个值删除
                break;
            }
        }
        // 找到最后一点，并将结束点压入closes数组
        if (cur.H == 1) {
            end.P = cur;
            closes.push(end);
            cur = null;
        }
    }
    if (closes.length) {
        // 从结尾开始往前找
        var dotCur = closes[closes.length - 1];
        var path = [];  // 存放最终路径
        // var i = 0;
        while (dotCur) {
            path.unshift(dotCur);  // 将当前点压入path数组的头部
            dotCur = dotCur.P;  // 设置当前点指向父级
            if (!dotCur.P) {
                dotCur = null;
            }
        }
        return path;
    }
    else {
        return false;
    }
}
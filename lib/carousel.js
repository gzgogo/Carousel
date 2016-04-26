function Node(data) {
    this.data = data;
    this.prev = null;
    this.next = null;
    this.index = -1;
}

//双向循环列表
function LinkList() {
    var _nodes = [];
    this.head = null;
    this.last = null;

    if (typeof this.append !== "function") {
        LinkList.prototype.append = function (node) {
            if (this.head == null) {
                this.head = node;
                this.last = this.head;
            }
            else {
                this.head.prev = node;
                this.last.next = node;

                node.prev = this.last;
                node.next = this.head;

                this.last = node;
            }

            node.index = _nodes.length; //务必在push前设置node.index
            _nodes.push(node);
        }
    }
}

//单向循环列表
function SingleList() {
    var _nodes = [];
    this.head = null;
    this.last = null;

    if (typeof this.append !== "function") {
        SingleList.prototype.append = function (node) {
            if (this.head == null) {
                this.head = node;
                this.last = this.head;
            }
            else {
                this.last.next = node;
                node.prev = this.last;
                this.last = node;
            }

            node.index = _nodes.length; //务必在push前设置node.index
            _nodes.push(node);
        }
    }
}

function CreateCarousel(containerClass, itemClass, loop) {

    var _carousel = {};

    var _itemChangedHandler = null;

    var _container = document.querySelector("." + containerClass);
    var _items = document.querySelectorAll("." + itemClass);

    var list = loop ? new LinkList() : new SingleList();
    for(var i = 0; i < _items.length; i++) {
        list.append(new Node(_items[i]));
    }

    var _current = list.head;

    var _normalZIndex = _current.data.style.zIndex;
    var _activeZIndex = _normalZIndex + 1;

    var _pageWidth = _current.data.offsetWidth; //页面宽度

    positionItems();
    zindexNodes(_current, _activeZIndex);

    // console.log(_items[0]);
    // console.log("window.innerWidth:" + window.innerWidth);

    function transformItem(item, translate) {
        item.style.webkitTransform = "translate3d("+translate+"px,0,0)";
    };

    function zindexNodes(node, zindex) {
        if (node.prev)
            zindexElement(node.prev.data, zindex);

        if (node.next)
            zindexElement(node.next.data, zindex);

        zindexElement(node.data, zindex);
    };

    function zindexElement(item, zindex) {
        item.style.zIndex = zindex;
    };

    function moveItems(translate) {
        //页面向左滑动
        if(translate > 0) {
            if (_current.prev !== null) {
                transformItem(_current.prev.data, -_pageWidth + translate);
                transformItem(_current.data, translate);
            }
        }
        //页面向右滑动
        else {
            if (_current.next !== null) {
                transformItem(_current.next.data, _pageWidth + translate);
                transformItem(_current.data, translate);
            }
        }
    };

    function moveTo(next) {
        if (next !== null) {
            var prev = _current;
            _current = next;

            zindexNodes(prev, _normalZIndex);
            zindexNodes(_current, _activeZIndex);

            positionItems();

            if(typeof _itemChangedHandler === "function") {
                _itemChangedHandler(prev.index, _current.index);
            }
        }
    }

    function positionItems() {
        if (_current.prev) {
            transformItem(_current.prev.data, -_pageWidth);
        }

        if (_current.next) {
            transformItem(_current.next.data, _pageWidth);
        }

        transformItem(_current.data, 0);
    };

    _carousel.bindTouchEvent = function () {

        var startX,startY;
        var direction = "left"; //滑动的方向
        var isMove = false;     //是否发生左右滑动
        var startT = 0;         //记录手指按下去的时间
        var translate = 0;

        /*手指按下时*/
        _container.addEventListener("touchstart", function(e) {
            // e.preventDefault();//取消此行代码的注释会在该元素内阻止页面纵向滚动
            var touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            // initialPos = _currentPosition;   //本次滑动前的初始位置
            _container.style.webkitTransition = ""; //取消动画效果
            startT = new Date().getTime(); //记录手指按下的开始时间
            isMove = false;
        }.bind(this),false);

        /*手指在屏幕上滑动，页面跟随手指移动*/
        _container.addEventListener("touchmove", function(e) {
            // e.preventDefault();//取消此行代码的注释会在该元素内阻止页面纵向滚动
            var touch = e.touches[0];
            var deltaX = touch.clientX - startX;
            var deltaY = touch.clientY - startY;
            //如果X方向上的位移大于Y方向，则认为是左右滑动
            if (Math.abs(deltaX) > Math.abs(deltaY)){
                translate = deltaX > _pageWidth ? _pageWidth : deltaX;
                translate = deltaX < -_pageWidth ? -_pageWidth : deltaX;

                moveItems(translate);

                isMove = true;

                //判断手指滑动的方向，手指滑动的方向与页面滑动的方向是相反的
                direction = deltaX > 0 ? "right" : "left";
            }
        }.bind(this),false);

        /*手指离开屏幕时，计算最终需要停留在哪一页*/
        _container.addEventListener("touchend",function(e) {
            // e.preventDefault();//取消此行代码的注释会在该元素内阻止页面纵向滚动
            //计算手指在屏幕上停留的时间
            var deltaT = new Date().getTime() - startT;
            if (isMove) { //发生了左右滑动
                //使用动画过渡让页面滑动到最终的位置
                _container.style.webkitTransition = "0.3s ease -webkit-transform";
                //如果停留时间小于300ms,则认为是快速滑动，无论滑动距离是多少，都停留到下一页
                if(deltaT < 300){
                    translate = direction == 'left' ? -_pageWidth : _pageWidth;
                }else {
                    //如果滑动距离小于屏幕的50%，则退回到上一页
                    if (Math.abs(translate) / _pageWidth < 0.5){
                        translate = 0;
                    }else{
                        //如果滑动距离大于屏幕的50%，则滑动到下一页
                        translate = direction == 'left'? -_pageWidth : _pageWidth;
                    }
                }

                //执行滑动
                moveItems(translate);

                if (Math.abs(translate) > 0) {
                    var next = direction == 'left' ? _current.next : _current.prev;
                    moveTo(next);
                }
            }
        }.bind(this),false);

        return _carousel;
    };

    _carousel.prev = function () {
        if (_current.prev !== null) {
            //使用动画过渡让页面滑动到最终的位置
            _container.style.webkitTransition = "0.3s ease -webkit-transform";

            //执行滑动
            moveItems(_pageWidth);
            moveTo(_current.prev);
        }
    };

    _carousel.next = function () {
        if (_current.next !== null) {
            _container.style.webkitTransition = "0.3s ease -webkit-transform";

            //执行滑动
            moveItems(-_pageWidth);
            moveTo(_current.next);
        }
    };

    _carousel.setItemChangedHandler = function (itemChangedHandler) {
        _itemChangedHandler = itemChangedHandler;
        return _carousel;
    };

    return _carousel;
}



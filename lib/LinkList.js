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
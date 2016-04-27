# H5触屏版轮播组件

可作为触屏的图片轮播器，tab组件等。

## 使用方法

#### 1. 引入carousel.js文件
```
<script src="lib/carousel.js"></script>
```
  
#### 2. html结构
```
<div class="carousel" ontouchstart="" >
    <div class="item" style="background: #3b76c0" >
      <h3 >item-1</h3>
    </div>
    <div class="item" style="background: #58c03b;">
      <h3>item-2</h3>
    </div>
    <div class="item" style="background: #c03b25;">
      <h3>item-3</h3>
    </div>
    <div class="item" style="background: #e0a718;">
      <h3>item-4</h3>
    </div>
    <div class="item" style="background: #c03eac;">
      <h3>item-5</h3>
    </div>
  </div>
```

#### 3. 定义样式
```
.carousel{
  height: 50%;
  position: relative;
  overflow: hidden;
}

.item {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
```
  
>利用绝对定位将子元素依次重叠在父元素内。
  
#### 4. 调用脚本
```
CreateCarousel("carousel", "item", true).bindTouchEvent().setItemChangedHandler(onPageChanged);
```

>carousel为父元素的类名，item为子元素的类名，注意必须使用类名且类名前没有点“.”

#### 5. 原理
  1. 假设子元素`.item`的`width`为375px，使用绝对定位将所有子元素放在父元素内
  2. 将父元素`.carousel`的`width`设置为375px，与子元素`.item`宽度相同
  3. 为父元素`.carousel`添加触摸事件：`touchstart`, `touchmove`, `touchend`
  4. 手指按下时，保存初始位置（`clientX`）
  5. 手指滑动时，通过滑动距离判断滑动的方向：
    1. 手指向左滑动，则同时移动当前元素和当前元素右边的元素
    2. 手指向右滑动，则同时移动当前元素和当前元素左边的元素
  6. 手指抬起时，通过滑动距离判断是否切换到下一页
    1. 移动距离未超过子元素宽度的50%，将当前页面回滚到初始位置，不切换当前元素。
    2. 移动距离超过子元素宽度的50%，切换当前元素为下一个元素。
    3. 将当前元素的`transform`属性设置为`translate3d(0px, 0px, 0px)`，并将`z-index`属性+1
    4. 将下一个子元素的`transform`属性设置为`translate3d(375px, 0px, 0px)`，并将`z-index`属性+1
    5. 将上一个子元素的`transform`属性设置为`translate3d(-375px, 0px, 0px)`，并将`z-index`属性+1
    6. 将其他所有子元素的`z-index`属性设置为默认值
  7. 第一个子元素的上一个元素是最后一个元素，最后一个元素的下一个元素是第一个元素，该步骤通过循环链表实现。

>移动时设置的是子元素.item的transform属性，而不是父元素`.carousel`

#### 6. 方法介绍

##### `CreateCarousel(containerClass, itemClass, loop)`
创建轮播组件，该方法会返回一个对象，假设命名为`carousel`，后面介绍的方法都是该对象的成员方法。 

`containerClass`: 父元素的类名 
`itemClass`: 子元素的类名 
`loop`: 是否循环播放 

##### `bindTouchEvent`
绑定触摸事件，使元素可以跟随手指滑动，`carousel`的成员方法

##### `prev`
滑动到上一元素，`carousel`的成员方法

##### `next`
滑动到下一元素，`carousel`的成员方法

##### `setItemChangedHandler(itemChangedHandler)`
设置元素切换后的回调，该回调函数接收两个参数：`pervIndex`, `curIndex` 
`pervIndex`: 之前显示元素的索引 
`curIndex`:  当前显示元素的索引 
  
#### 7. 参考Demo的注意事项
将父级元素`.carousel`的`width`设置为子元素`.item`的宽度*子元素的个数，并将子元素横向依次排列，然后为父元素绑定`touchstart，touchmove，touchend`三个事件，通过计算`pageX`属性(既触摸点在整个父元素的上的位置)来移动`.carousel`元素，`.carousel`元素的移动通过`translate3d`实现，之所以使用3d变换，是为了充分利用GPU以提高性能。在实现的过程中，有两点需要特别注意：
  1. 不能在`touchstart，touchmove，touchend`三个事件的事件处理程序内调用`e.preventDefault()`，否则`.carousel`元素会阻止页面的纵向滚动。
  2. 必须为`.carousel`元素的父元素`.carousel-wrapper`设置`overflow: hidden`属性，并设置其`width`为子元素`.item`的`width`，否则整个页面会横向滚动。

## 参考
[H5单页面手势滑屏切换原理](http://www.cnblogs.com/onepixel/p/5300445.html?hmsr=toutiao.io&utm_medium=toutiao.io&utm_source=toutiao.io)

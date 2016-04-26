# H5触屏版tab组件

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
  
>使用绝对定位，使子元素依次重叠在父元素内。
  
#### 4. 调用脚本
```
CreateCarousel("carousel", "item").bindTouchEvent().setItemChangedHandler(onPageChanged);
```
  
>carousel为父元素的类名，item为子元素的类名，注意必须使用类名且类名前没有点“.”
  
#### 5. 原理
将父级元素`.carousel`的`width`设置为子元素`.item`的宽度*子元素的个数，并将子元素横向依次排列，然后为父元素绑定`touchstart，touchmove，touchend`三个事件，通过计算`pageX`属性(既触摸点在整个父元素的上的位置)来移动`.carousel`元素，`.carousel`元素的移动通过`translate3d`实现，之所以使用3d变换，是为了充分利用GPU以提高性能。在实现的过程中，有两点需要特别注意：
  1. 不能在`touchstart，touchmove，touchend`三个事件的事件处理程序内调用`e.preventDefault()`，否则`.carousel`元素会阻止页面的纵向滚动。
  2. 必须为`.carousel`元素的父元素`.carousel-wrapper`设置`overflow: hidden`属性，并设置其`width`为子元素`.item`的`width`，否则整个页面会横向滚动。
  
#### 6. 循环播放
  1. 假设子元素`.item`的`width`为375px，使用绝对定位将所有子元素放在父元素内
  2. 将父元素`.carousel`的`width`设置为375px，与子元素`.item`宽度相同
  3. 手指在子元素`.item`上滑动时，通过`transform`属性移动`.item`的移动变换，而不是父元素`.carousel`
  4. 将当前显示的子元素的`transform`属性设置为`translate3d(0px, 0px, 0px)`，并设置`z-index=10`
  5. 将下一个子元素的`transform`属性设置为`translate3d(375px, 0px, 0px)`，并设置`z-index=10`
  6. 将上一个子元素的`transform`属性设置为`translate3d(-375px, 0px, 0px)`，并设置`z-index=10`
  7. 将其他所有子元素的`transform`属性设置为`translate3d(0px, 0px, 0px)`，并设置`z-index=9`
  8. 第一个子元素的上一个元素是最后一个元素，最后一个元素的下一个元素是第一个元素

## 参考
[H5单页面手势滑屏切换原理](http://www.cnblogs.com/onepixel/p/5300445.html?hmsr=toutiao.io&utm_medium=toutiao.io&utm_source=toutiao.io)

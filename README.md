# H5触屏版tab组件

可作为触屏的图片轮播器，tab组件等。

## 使用方法

1. 引入carousel.js文件
  ```
  <script src="lib/carousel.js"></script>
  ```

2. 定义样式
  ```
  .container{
    width: 500%; 
    height: 50%;
    display: -webkit-box; //注意此处需要使用box布局
    overflow: hidden;
    -webkit-transform: translate3d(0,0,0);
    backface-visibility: hidden;
    position: relative;
  }
  .item{
    -webkit-box-flex: 1; //注意此处需要使用box布局
    width: 0;
  }
  ```
  
  >父元素的宽度=子元素个数*页面宽度，如父元素包含5个子元素用于切换，则父元素的宽度需设置为500%
  >父元素的overflow属性需要设置为hidden
  
3. 调用脚本
  ```
  Carousel("container", "item").bindTouchEvent().setItemChangedHandler(onPageChanged);
  ```
  
  >container为父元素的类名，item为子元素的类名，注明类名前没有点“.”

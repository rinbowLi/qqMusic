## 项目的地址
源码地址：[[https://github.com/1165973875/qqMusic](https://github.com/1165973875/qqMusic)
]([https://github.com/1165973875/qqMusic](https://github.com/1165973875/qqMusic))觉得有帮助的点个star吧(*^__^*) 嘻嘻。

##技术栈
- vue
- vue-router
- vuex
- vue-cli3
- axios
- better-scroll
- scss
- iconfont

##插件
- vant ui
- vue-lazyload   图片懒加载插件
- vuex-persistedstate   vuex持久化插件
- fast-click 解决移动端点击300ms延迟问题

##项目截图

###首页
![首页截图](https://upload-images.jianshu.io/upload_images/11883450-10be1da1021426a6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
首页没什么好说的，就是一个歌单列表和热门mv列表,用了better-scroll插件，移动端滑动体验更好一些。

###排行页面
![排行截图](https://upload-images.jianshu.io/upload_images/11883450-54a7e19ba1ee8193.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
emmmm,排行页面也是没什么好说的，几个排行榜列表的展示。

###我喜欢页面
![我喜欢页面截图1](https://upload-images.jianshu.io/upload_images/11883450-1c718a262d587a6c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![我喜欢页面截图2](https://upload-images.jianshu.io/upload_images/11883450-b7429f286487c0cd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
这里分为喜欢的歌曲和歌单两个tabs。点击可以直接播放或者进入对应歌单。

###播放器页面
![播放器截图](https://upload-images.jianshu.io/upload_images/11883450-138c3f8db42348d4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
这里的最上面歌的标题做了动画处理，，中间的播放按钮也做了旋转，用的css3的animate。比较坑爹的是进度条，audio的timeupdate时间会实时触发，然后通过audio的currentTime属性/duration得到百分比，传给进度条组件，然后拖动进度条时会触发percentChange事件，然后获取当前百分比算出currentTime赋值即可。

###MV播放页面
![mv](https://upload-images.jianshu.io/upload_images/11883450-335c7fb2d7fb120b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
emmmm也没啥好说的，就是一些样式堆叠。

###搜索页面截图
![搜索页面截图1](https://upload-images.jianshu.io/upload_images/11883450-d4b5f5ad1adc5bb9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
保存了最近的搜索记录，保存在vuex。
![i搜索页面截图2](https://upload-images.jianshu.io/upload_images/11883450-273fc390c588984a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
搜索结果做了上拉加载，这里better-scroll有莫名其妙的问题，加了节流函数还是有点问题。。不过整体还好。




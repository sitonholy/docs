<template>
  <div class="index-bigimg" style="display: none"></div>
</template>
<script>
// 两个变量分别是背景元素的 class、生成的箭头 class
const banner = "banner";
const banner_arrow = "banner-arrow";
export default {
  data() {
    return {
      // 下面都是配置的默认值，建议在 themeConfig 进行配置，它们将覆盖这些属性值
      navColor: 1,
      switchNavColor: false,
      bgTimeColor: false,
      bgTimeColorArray: [
        "transparent", // 透明
        "rgba(255, 148, 48, .2)",
        "rgba(0, 0, 0, .3)",
        "rgba(0, 0, 0, .5)",
      ],
      descFade: false,
      desc: [],
      descFadeInTime: 200,
      descFadeOutTime: 100,
      descNextTime: 800,
      descFontSize: "1.4rem",
      bubble: false,
      bubblePosition: 0,
      bubbleNum: 200,
      fadeInInterval: "", // 淡入定时器
      fadeOutInterval: "", // 淡出定时器
    };
  },
  mounted() {
    const arrow = document.getElementById(banner_arrow);
    arrow && arrow.parentNode.removeChild(arrow);
    let a = document.createElement("a");
    a.id = banner_arrow;
    a.className = banner_arrow;
    document.getElementsByClassName(banner)[0].append(a);
    let targetA = document.getElementById(banner_arrow);
    targetA.addEventListener("click", (e) => {
      // 添加点击事件
      this.scrollFn();
    });

    // 初始化配置
    this.initConfig();

    // 初始化组件功能
    if (this.bgTimeColor) {
      this.bgTimeColorAndTip();
    }
    setTimeout(() => {
      this.noBgBlur();
    }, 100);

    this.blurText();
    this.watchScroll();

    if (this.descFade) {
      this.textFadeInAndOut();
    }
    if (this.bubble) {
      let canvas = document.createElement("canvas");
      canvas.id = "canvas";
      canvas.style.top = this.bubblePosition + "%";
      document.getElementsByClassName(banner)[0].append(canvas);
      this.canvasBubble();
    }
  },
  watch: {
    $route(to, from) {
      // 点击下一页后，往下滑动，移出大图
      if (to.path == "/" && Object.keys(this.$route.query).length > 0) {
        setTimeout(() => {
          this.clickArrow();
        }, 200);
      }
    },
  },
  methods: {
    // 初始化配置
    initConfig() {
      if (
        this.$themeConfig.indexImg &&
        Object.keys(this.$themeConfig.indexImg).length > 0
      ) {
        this.navColor =
          this.$themeConfig.indexImg.navColor == undefined
            ? this.navColor
            : this.$themeConfig.indexImg.navColor;
        this.switchNavColor =
          this.$themeConfig.indexImg.switchNavColor == undefined
            ? this.switchNavColor
            : this.$themeConfig.indexImg.switchNavColor;
        this.bgTimeColor =
          this.$themeConfig.indexImg.bgTimeColor == undefined
            ? this.bgTimeColor
            : this.$themeConfig.indexImg.bgTimeColor;
        this.bgTimeColorArray =
          this.$themeConfig.indexImg.bgTimeColorArray == undefined
            ? this.bgTimeColorArray
            : this.$themeConfig.indexImg.bgTimeColorArray;
        this.descFade =
          this.$themeConfig.indexImg.descFade == undefined
            ? this.descFade
            : this.$themeConfig.indexImg.descFade;
        this.desc =
          this.$themeConfig.indexImg.desc == undefined
            ? this.desc
            : this.$themeConfig.indexImg.desc;
        this.descFontSize =
          this.$themeConfig.indexImg.descFontSize == undefined
            ? this.descFontSize
            : this.$themeConfig.indexImg.descFontSize;
        this.descFadeInTime =
          this.$themeConfig.indexImg.descFadeInTime == undefined
            ? this.descFadeInTime
            : this.$themeConfig.indexImg.descFadeInTime;
        this.descNextTime =
          this.$themeConfig.indexImg.descNextTime == undefined
            ? this.descNextTime
            : this.$themeConfig.indexImg.descNextTime;
        this.bubble =
          this.$themeConfig.indexImg.bubble == undefined
            ? this.bubble
            : this.$themeConfig.indexImg.bubble;
        this.bubblePosition =
          this.$themeConfig.indexImg.bubblePosition == undefined
            ? this.bubblePosition
            : this.$themeConfig.indexImg.bubblePosition;
        this.bubbleNum =
          this.$themeConfig.indexImg.bubbleNum == undefined
            ? this.bubbleNum
            : this.$themeConfig.indexImg.bubbleNum;
      }
    },
    // 点击箭头向下滑动
    scrollFn() {
      const windowH = document.getElementsByClassName(banner)[0].clientHeight; // 获取窗口高度
      window.scrollTo({
        top: windowH,
        behavior: "smooth", // 平滑滚动
      });
    },
    // 触发下拉按钮
    clickArrow() {
      const arrow = document.getElementById("banner-arrow");
      arrow.click();
    },
    // 监听页面滚动的回调
    watchScroll() {
      const windowH = document.getElementsByClassName(banner)[0].clientHeight; // 获取窗口高度
      window.onscroll = () => {
        if (document.documentElement.scrollTop < windowH) {
          this.blurText(this.navColor);
          this.noBgBlur();
        } else {
          if (this.switchNavColor && this.navColor == 1) {
            this.blurText(2);
          } else if (this.switchNavColor && this.navColor == 2) {
            this.blurText(1);
          }
          this.bgBlur();
        }
      };
    },
    // 导航栏恢复原主题样式
    bgBlur() {
      let navbar = document.getElementsByClassName("navbar")[0];
      navbar.className = "navbar blur";
    },
    // 导航栏透明
    noBgBlur() {
      let navbar = document.getElementsByClassName("navbar")[0];
      navbar.className = "navbar navbar1 blur";
    },
    // 导航栏的字体颜色
    blurText(navColor = this.navColor) {
      let title = document.getElementsByClassName("site-name")[0];
      let search = document.getElementsByClassName("search-box")[0];
      let nav = document.getElementsByClassName("nav-links")[0];
      if (navColor == 1) {
        title.className = "site-name can-hide";
        nav.className = "nav-links can-hide";
        search.className = "search-box";
      } else if (navColor == 2) {
        title.className = "site-name site-name1 can-hide";
        nav.className = "nav-links nav-links1 can-hide";
        search.className = "search-box search-box1";
      }
    },
    // 背景色随时间变化，时间提示框内容随时间变化
    bgTimeColorAndTip() {
      let hours = new Date().getHours();
      let minutes = new Date().getMinutes();
      let seconds = new Date().getSeconds();
      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      let div = document.createElement("div");
      div.className = "banner-color";
      if (hours >= 6 && hours < 11) {
        div.style.backgroundColor = this.bgTimeColorArray[0];
        addTip(
          `早上好呀~~，现在是 ${hours}:${minutes}:${seconds}，吃早餐了吗？😊🤭`,
          "info",
          50,
          4000
        );
      } else if (hours >= 12 && hours <= 16) {
        div.style.backgroundColor = this.bgTimeColorArray[0];
        addTip(
          `下午好呀~~，现在是 ${hours}:${minutes}:${seconds}，繁忙的下午也要适当休息哦🥤🏀~~`,
          "info",
          50,
          4000
        );
      } else if (hours >= 16 && hours <= 19) {
        div.style.backgroundColor = this.bgTimeColorArray[1];
        addTip(
          `到黄昏了~~，现在是 ${hours}:${minutes}:${seconds}，该准备吃饭啦🥗🍖~~`,
          "info",
          50,
          4000
        );
      } else if (hours >= 19 && hours < 24) {
        div.style.backgroundColor = this.bgTimeColorArray[2];
        addTip(
          `晚上好呀~~，现在是 ${hours}:${minutes}:${seconds}，该准备洗漱睡觉啦🥱😪~~`,
          "info",
          50,
          4000
        );
      } else if (hours >= 0 && hours < 6) {
        div.style.backgroundColor = this.bgTimeColorArray[3];
        addTip(
          `别再熬夜了~~，现在是 ${hours}:${minutes}:${seconds}，早点睡吧，让我们一起欣赏早上的太阳~~😇🛏`,
          "info",
          50,
          4000
        );
      }
      document.getElementsByClassName(banner)[0].parentNode.append(div);
    },
    // 字体淡入淡出
    textFadeInAndOut(
      desc = this.desc, // 文字描述
      descFontSize = this.descFontSize, // 字体大小
      descFadeInTime = this.descFadeInTime, // 淡入时间
      descFadeOutTime = this.descFadeOutTime, // 淡出时间
      descNextTime = this.descNextTime // 下一个描述出现时间
    ) {
      let descElement = document.getElementsByClassName("description")[0];

      if (descElement) {
        // 非首页不触发
        descElement.style.fontSize = descFontSize;
        var span = document.createElement("span"); // 创建 | 的元素
        span.className = "typed";
        span.innerHTML = "|";
        var index = 0; // 为 desc 的长度服务
        var length = 0; // 为数组服务
        var description = descElement.innerText; // 先取默认值
        descElement.innerText = ""; // 清空 desc
        descElement.appendChild(document.createElement("span")); // 创建 desc 所在的新元素
        span && descElement.appendChild(span); // 添加 | 的元素
        // 初始化迭代
        this.fadeInInterval = setInterval(() => {
          fadeIn();
        }, descFadeInTime);
      } else {
        let hero = document.getElementsByClassName("hero")[0];
        descElement = document.createElement("p");
        descElement && (descElement.className = "description");
        descElement && hero.appendChild(descElement);
      }
      // 淡入回调
      let fadeIn = () => {
        if (descElement) {
          span.style.animation = "none"; // 淡入时，| 光标不允许闪烁
          if (desc instanceof Array && desc.length > 0) {
            // 如果是 themeConfig 传来的数组
            description = desc[length];
          }
          descElement.firstChild.innerText = description.substring(0, index++);
          if (index > description.length) {
            clearInterval(this.fadeInInterval);
            span.style.animation = "typedBlink 1s infinite"; // 淡入结束，| 光标允许闪烁
            setTimeout(() => {
              this.fadeOutInterval = setInterval(() => {
                fadeOut();
              }, descFadeOutTime);
            }, descNextTime);
          }
        }
      };
      // 淡出回调
      let fadeOut = () => {
        if (index >= 0) {
          span.style.animation = "none"; // 淡出时，| 光标不允许闪烁
          descElement.firstChild.innerText = description.substring(0, index--);
        } else {
          clearInterval(this.fadeOutInterval);
          span.style.animation = "typedBlink 1s infinite"; // 淡出结束，| 光标允许闪烁
          setTimeout(() => {
            length++;
            if (length >= desc.length) {
              length = 0; // desc 展示完，重新开始计数
            }
            this.fadeInInterval = setInterval(() => {
              fadeIn();
            }, descFadeInTime);
          }, descNextTime);
        }
      };
    },
    // 气泡效果
    canvasBubble(bubbleNum = this.bubbleNum) {
      var canvas = document.getElementById("canvas");
      var cxt = canvas.getContext("2d");
      function Dot() {
        this.alive = true;
        this.x = Math.round(Math.random() * canvas.width);
        this.y = Math.round(Math.random() * canvas.height);
        this.diameter = Math.random() * 10.8;
        this.ColorData = {
          Red: Math.round(Math.random() * 255),
          Green: Math.round(Math.random() * 255),
          Blue: Math.round(Math.random() * 255),
        };
        this.alpha = 0.5;
        this.color =
          "rgba(" +
          this.ColorData.Red +
          ", " +
          this.ColorData.Green +
          "," +
          this.ColorData.Blue +
          "," +
          this.alpha +
          ")";
        this.velocity = {
          x: Math.round(Math.random() < 0.5 ? -1 : 1) * Math.random() * 0.7,
          y: Math.round(Math.random() < 0.5 ? -1 : 1) * Math.random() * 0.7,
        };
      }
      Dot.prototype = {
        Draw: function () {
          cxt.fillStyle = this.color;
          cxt.beginPath();
          cxt.arc(this.x, this.y, this.diameter, 0, Math.PI * 2, false);
          cxt.fill();
        },
        Update: function () {
          if (this.alpha < 0.8) {
            this.alpha += 0.01;
            this.color =
              "rgba(" +
              this.ColorData.Red +
              ", " +
              this.ColorData.Green +
              "," +
              this.ColorData.Blue +
              "," +
              this.alpha +
              ")";
          }
          this.x += this.velocity.x;
          this.y += this.velocity.y;
          if (
            this.x > canvas.width + 5 ||
            this.x < 0 - 5 ||
            this.y > canvas.height + 5 ||
            this.y < 0 - 5
          ) {
            this.alive = false;
          }
        },
      };
      var Event = {
        rArray: [],
        Init: function () {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          for (var x = 0; x < bubbleNum; x++) {
            this.rArray.push(new Dot());
          }
          this.Update();
        },
        Draw: function () {
          cxt.clearRect(0, 0, canvas.width, canvas.height);
          this.rArray.forEach(function (dot) {
            dot.Draw();
          });
        },
        Update: function () {
          if (Event.rArray.length < bubbleNum) {
            for (var x = Event.rArray.length; x < bubbleNum; x++) {
              Event.rArray.push(new Dot());
            }
          }
          Event.rArray.forEach(function (dot) {
            dot.Update();
          });
          Event.rArray = Event.rArray.filter(function (dot) {
            return dot.alive;
          });
          Event.Draw();
          requestAnimationFrame(Event.Update);
        },
      };
      window.onresize = function () {
        Event.rArray = [];
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      Event.Init();
    },
  },
  // 防止重写编译时，导致定时器叠加问题
  beforeMount() {
    clearInterval(this.fadeInInterval);
    clearInterval(this.fadeOutInterval);
  },
  beforeDestroy() {
    clearInterval(this.fadeInInterval);
    clearInterval(this.fadeOutInterval);
  },
};
/**
 * 添加消息提示
 * content：内容
 * type：弹窗类型（tip、success、warning、danger）
 * startHeight：第一个弹窗的高度，默认 50
 * dieTime：弹窗消失时间（毫秒），默认 3000 毫秒
 *
 * 在 head 里添加图标 link 地址：https://at.alicdn.com/t/font_3114978_qe0b39no76.css
 */
function addTip(content, type, startHeight = 50, dieTime = 3000) {
  var tip = document.querySelectorAll(".global-tip");
  var time = new Date().getTime();
  // 获取最后消息提示元素的高度
  var top = tip.length == 0 ? 0 : tip[tip.length - 1].getAttribute("data-top");
  // 如果产生两个以上的消息提示，则出现在上一个提示的下面，即高度添加，否则默认 50
  var lastTop =
    parseInt(top) +
    (tip.length != 0 ? tip[tip.length - 1].offsetHeight + 17 : startHeight);

  let div = document.createElement("div");
  div.className = `global-tip tip-${type} ${time}`;
  div.style.top = parseInt(top) + "px";
  div.setAttribute("data-top", lastTop);
  if (type == "info" || type == 1) {
    div.innerHTML = `<i class="iconfont icon-info icon"></i><p class="tip-info-content">${content}</p>`;
  } else if (type == "success" || type == 2) {
    div.innerHTML = `<i class="iconfont icon-dagouyouquan icon"></i><p class="tip-success-content">${content}</p>`;
  } else if (type == "danger" || type == 3) {
    div.innerHTML = `<i class="iconfont icon-cuowu icon"></i><p class="tip-danger-content">${content}</p>`;
  } else if (type == "warning" || type == 4) {
    div.innerHTML = `<i class="iconfont icon-gantanhao icon"></i><p class="tip-warning-content">${content}</p>`;
  }
  document.body.appendChild(div);

  let timeTip = document.getElementsByClassName(time)[0];
  setTimeout(() => {
    timeTip.style.top = parseInt(lastTop) + "px";
    timeTip.style.opacity = "1";
  }, 10);

  // 消息提示 dieTime 秒后隐藏并被删除
  setTimeout(() => {
    timeTip.style.top = "0px";
    timeTip.style.opacity = "0";

    // 下面的所有元素回到各自曾经的出发点
    var allTipElement = nextAllTipElement(timeTip);
    for (let i = 0; i < allTipElement.length; i++) {
      var next = allTipElement[i];
      var top =
        parseInt(next.getAttribute("data-top")) - next.offsetHeight - 17;
      next.setAttribute("data-top", top);
      next.style.top = top + "px";
    }
    setTimeout(() => {
      timeTip.remove();
    }, 500);
  }, dieTime);
}
/**
 * 获取后面的兄弟元素
 */
function nextAllTipElement(elem) {
  var r = [];
  var n = elem;
  for (; n; n = n.nextSibling) {
    if (n.nodeType === 1 && n !== elem) {
      r.push(n);
    }
  }
  return r;
}
</script>

<style>
/* 图片大小 */
.vdoing-index-class .home-wrapper .banner {
  margin-top: 0 !important;
  height: 100vh;
  background-attachment: fixed !important;
}

/* 图片中间的签名和标题位置 */
.banner-conent {
  margin-top: 23vh !important;
}

/* 下面是配合 js 用的 class 样式 */
.vdoing-index-class .navbar1 {
  /* background-color: transparent; */
  box-shadow: none;
  backdrop-filter: none;
}

.vdoing-index-class .nav-links1>.nav-item>a,
/* 没有二级导航的一级导航 */
.vdoing-index-class .nav-links1>a,
/* GitHub */
.vdoing-index-class .nav-links1 .dropdown-title a:hover,
/* 鼠标悬停 */
.vdoing-index-class .nav-links1 .title,
/* 不能跳转的一级导航 */
.vdoing-index-class .nav-links1 .dropdown-title>.link-title,
/* 能跳转的一级导航 */
.vdoing-index-class .site-name1

/* 左侧的名字 */ {
  color: #fff !important;
}

/* 页脚的颜色 */
.vdoing-index-class .footer {
  color: #fff;
}

.vdoing-index-class .search-box1 input {
  border-color: #fff;
  color: #fff;
}

/* 下面是箭头相关的样式 */
.banner-arrow {
  display: block;
  margin: 12rem auto 0;
  bottom: 45px;
  width: 20px;
  height: 20px;
  font-size: 34px;
  text-align: center;
  animation: bounce-in 5s 3s infinite;
  position: absolute;
  left: 50%;
  bottom: 15%;
  margin-left: -10px;
  cursor: pointer;
  z-index: 999;
}

@-webkit-keyframes bounce-in {
  0% {
    transform: translateY(0);
  }

  20% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-20px);
  }

  80% {
    transform: translateY(0);
  }

  to {
    transform: translateY(0);
  }
}

.banner-arrow::before {
  content: "";
  width: 20px;
  height: 20px;
  display: block;
  border-right: 3px solid #fff;
  border-top: 3px solid #fff;
  transform: rotate(135deg);
  position: absolute;
  bottom: 10px;
}

.banner-arrow::after {
  content: "";
  width: 20px;
  height: 20px;
  display: block;
  border-right: 3px solid #fff;
  border-top: 3px solid #fff;
  transform: rotate(135deg);
}

/* 描述淡入淡出元素 */
.description {
  display: inline-block;
}

.typed {
  opacity: 1;
}

/* 随时间变化的背景色元素 */
.vdoing-index-class .banner-color {
  width: 100%;
  min-height: 450px;
  overflow: hidden;
  margin-top: 0;
  height: 100vh;
  position: absolute;
  top: 0;
}

/* 气泡效果的画布元素 */
#canvas {
  position: absolute;
  top: 0;
}

/* 切换第二页，继续打开 banner */
.hide-banner {
  display: block !important;
}

/* 提示框元素 */
.global-tip {
  position: fixed;
  display: flex;
  top: -10px;
  left: 50%;
  opacity: 0;
  min-width: 320px;
  transform: translateX(-50%);
  transition: opacity 0.3s linear, top 0.4s, transform 0.4s;
  z-index: 99999;
  padding: 15px 15px 15px 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  grid-row: 1;
  line-height: 17px;
}

.global-tip p {
  line-height: 17px;
  margin: 0;
  font-size: 14px;
}

.icon {
  margin-right: 10px;
  line-height: 17px;
}

.tip-success {
  color: #67c23a;
  background-color: #f0f9eb;
  border-color: #e1f3d8;
}

.tip-success .tip-success-content {
  color: #67c23a;
}

.tip-danger {
  color: #f56c6c;
  background-color: #fef0f0;
  border-color: #fde2e2;
}

.tip-danger .tip-danger-content {
  color: #f56c6c;
}

.tip-info {
  background-color: #edf2fc;
  border-color: #ebeef5;
}

.tip-info .tip-info-content {
  color: #909399;
}

.tip-warning {
  color: #e6a23c;
  background-color: #fdf6ec;
  border-color: #faecd8;
}

.tip-warning .tip-warning-content {
  margin: 0;
  color: #e6a23c;
  line-height: 21px;
  font-size: 14px;
}

@keyframes typedBlink {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>

/*重置html fontsize*/

export  function resetHtml () {
    let ratio = window.outerWidth / 414;
    document.documentElement.style.fontSize = ratio * 100 + "px";
    document.body.style.fontSize = ".16rem";
};

 //节流
 export function throttle(func, delay) {
    let timer = null;
    return function() {
      let context = this;
      let args = arguments;
      if (!timer) {
        timer = setTimeout(function() {
          func.apply(context, args);
          timer = null;
        }, delay);
      }
    };
  }
  //防抖
  export function debounce(func, delay) {
    let timer = null;
    return function(...args) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }


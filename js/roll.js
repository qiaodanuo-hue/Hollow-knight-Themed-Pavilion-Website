// JavaScript Document
        //实现滚动效果
        const container = document.querySelector('.container')
        const lis = document.querySelectorAll('.controls li') 
        var viewHeight = null //声明页面高度
 
        var index = 0; //当前索引
        var flag = true; //节流开关
        document.addEventListener('mousewheel', function (e) {
            e = e || window.event
            console.log(e);
            // 获取整屏的高度
            viewHeight = document.body.clientHeight;
            if (flag) {  //节流阀
                flag = false
                if (e.wheelDelta > 0) {
                    index--
                    if (index < 0) {
                        index = 0
                    }
                } else {
                    index++;
                    if (index > lis.length - 1) {
                        index = lis.length - 1
                    }
                }
                container.style.top = -index * viewHeight + 'px'
                changeColor(index)
                setTimeout(function () {
                    flag = true
                }, 500)
            }
 
        })
		//改变小li颜色
        function changeColor(index) {
            for (var j = 0; j < lis.length; j++) {
                lis[j].className = ''
            }
            lis[index].className = 'active'
        }
		//绑定点击事件
        for (let i = 0; i < lis.length; i++) {
            lis[i].onclick = function () {
                viewHeight = document.body.clientHeight
                index = i
                changeColor(index)
                container.style.top = -index * viewHeight + 'px'
            }
        }

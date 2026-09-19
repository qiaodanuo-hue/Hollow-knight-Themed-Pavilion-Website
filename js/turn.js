// JavaScript Document
        var carousel = document.querySelector(".carousel");
        // 获取图片列表ul
        var olist = document.getElementById("list");
        var liArr = document.querySelectorAll("#list li");
    
        // 获取定位数组
        var location_list = document.querySelectorAll('#location_list>li');

        // 向左按钮
        var leftbtn = document.querySelector('.leftbtn');
        // 向右按钮
        var rightbtn = document.querySelector('.rightbtn');
        // 当前图片定位
        var currentPosition = 0;

        // 定义全局定时器
        var timer = null;
        // 使用islock变量，保证过渡效果完成后再执行获取下一张的动作
        var islock = false;

        function move(){
            // 定义一个定时器，每隔2s模拟点击右键的动作
            timer = setInterval(function(){
                rightbtn.click();
            },2000);
        }
        // 页面加载后自动执行move函数
        move();

        // 下一张
        rightbtn.onclick = function(){
            // 如果当前过渡效果还未执行完，先不执行获取下一张的动作
            if(islock){return;}
            // 上锁，保证过渡效果完成
            islock = true;
            // 设置当前图片透明度为 0，透明
            liArr[currentPosition].style.opacity = 0;
            location_list[currentPosition].className = "none";
            if(currentPosition == 4){
                currentPosition = -1;
            }
            // 设置下一张透明度为 1，不透明
            liArr[currentPosition+1].style.opacity = 1;
            location_list[currentPosition+1].className = "active";
            currentPosition++;
            // 1s的过渡效果完成后，解锁，可以执行获取下一张的动作
            setTimeout(function(){
                islock = false;
            },1000)
        };

        // 上一张
        leftbtn.onclick = function(){
            if(islock){return;}
            islock = true;
            liArr[currentPosition].style.opacity = 0;
            location_list[currentPosition].className = "none";
            if(currentPosition == 0){
                currentPosition = 5;
            }
            // 设置上一张透明度为 1，不透明
            liArr[currentPosition-1].style.opacity = 1;
            location_list[currentPosition-1].className = "active";
            currentPosition--;

            setTimeout(function(){
                islock = false;
            },1000)
        };


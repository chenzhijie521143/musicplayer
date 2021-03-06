;(function(doc, win, undefined) {
    "use strict";

    var start = {  //记录开始的触点
            x: 0,
            y: 0
        },
        delta = {  //记录滑动距离
            x: 0,
            y: 0
        },
        startTime = 0, //开始时间
		curTime=0,     //从开始到现在的事件
        longTime = 200,//200ms触发长按事件
		longCurTime=1000, //1000ms 手指不移开即可触发 通过定时器往上加
        target,
        minDelta = 50,//最小滑动距离
		timer=null;

    //创建事件对象
    function createEvent(type) {
        var event;

        try {
            event = new Event(type);
        } catch (e) {
            event = doc.createEvent("Events");
            event.initEvent(type, true, true);
        }

        return event;
    }
    
	//触发事件
    function fireEvent(type, target) {
        var event = createEvent(type);

        target.dispatchEvent(event);
    }

    
	//触摸时触发的函数
    function onTouchStart(event) {
		
        var touch = event.touches[0];

        //判断默认行为是否可以被禁用
		if (event.cancelable) {
			// 判断默认行为是否已经被禁用
			if (!event.defaultPrevented) {
				event.preventDefault();
			}
		}
		

        target = event.target;
        
		//获取开始的触点
        start.x = touch.pageX;
        start.y = touch.pageY;

        delta.x = 0;
        delta.y = 0;
        
		//当前触摸时的时间
        startTime =new Date();
        
		//持续触摸不动400ms 则生成longCurTap事件
		timer=setInterval(function(){
		  curTime+=10;
		  if(curTime==longCurTime){
		    fireEvent("longCurTap", target);    
		  }
		  //console.log(curTime);
		},1);
    }
    
	//滑动时触发的函数
    function onTouchMove(event) {
        var touch = event.touches[0];
        
		//计算滑动的距离
        delta.x = touch.pageX - start.x;
        delta.y = touch.pageY - start.y;
        
		
    }
    
	//移开时触发的函数
    function onTouchEnd(event) {
		
		//手指移开后先清除定时器（服务于longCurTap）
		clearInterval(timer);
        curTime=0;

		//获取自上次触摸以来发生了什么改变的touch对象的数组
        var touch = event.changedTouches[0],
            deltaTime =new Date() - startTime,
			

			//返回滑动距离的绝对值
            deltaX = Math.abs(delta.x),
            deltaY = Math.abs(delta.y);
			//console.log(deltaTime);
		

        //判断位置是否发生改变
        if (touch.pageX === start.x && touch.pageY === start.y) {
            
			//判断触摸时间是否小于200ms
            if (deltaTime < longTime) {
                fireEvent("tap", target);//触摸事件
				//console.log(deltaTime);
            } else if(deltaTime > longTime && deltaTime < longCurTime/2){
                fireEvent("longTap", target);//长按事件
            }
        }
        
		//判断滑动距离是否超过30
        if (deltaX > minDelta || deltaY > minDelta) {
            
			//比较 x,y 滑动边的长度来判断方向
            if (deltaX > deltaY) {
                if (delta.x > 0) {
                    fireEvent("swipeRight", target);
                } else {
                    fireEvent("swipeLeft", target);
                }
            } else {
                if (delta.y > 0) {
                    fireEvent("swipeDown", target);
                } else {
                    fireEvent("swipeUp", target);
                }
            }
        }
    }

	//监听三个触摸事件
    doc.addEventListener("touchstart", onTouchStart);
    doc.addEventListener("touchmove", onTouchMove);
    doc.addEventListener("touchend", onTouchEnd);

}(document, window));

   // json 
   //startMove(obj,{attr1:iTarget,attr2:iTarget2},fn)

 function startMove(obj,json,fn){
    //先清除定时器
   clearInterval(obj.timer);

	//添加定时器

   obj.timer=setInterval(function(){
	  //声明标杆变量
	  var flag=true;
      
	  //循环遍历json
	  for(var attr in json){

	  //获取当前属性值
	  var ics=0;
	  if(attr=='opacity'){
	    ics=Math.round(parseFloat(getStyle(obj,attr))*100);
	  }else{
	    ics=parseInt(getStyle(obj,attr));
	  }

	   //计算速度
      var speed=(json[attr]-ics)/8;
	      speed=speed>0? Math.ceil(speed):Math.floor(speed);

	  //判断不是所有值都达到目标值，继续运动
	  if(ics!==json[attr]){
          flag=false;
	   }
	    if(attr=='opacity'){
		   obj.style.filter='alpha(opacity='+(ics+speed)+')'
		   obj.style.opacity=(ics+speed)/100;
		 }else{
		   obj.style[attr]=ics+speed+'px';
		 }
	 } 
     
	 //判断所以值都达到了目标值，清除定时器，并且执行回调函数
     if(flag){
	     clearInterval(obj.timer);
		 if(fn){
		   fn();
		 }
	  }
	},30)
}
  //获取样式的函数
 function getStyle(obj,attr){
    if(obj.currentStyle){
	   return obj.currentStyle[attr];
	}else{
	   return getComputedStyle(obj,null)[attr];
	}
   
   }
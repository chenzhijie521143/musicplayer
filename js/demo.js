
     var audio=document.getElementById('audio');
	 var text=document.getElementById('text');
	 var lrc=document.getElementById('lrc');
	 var lrc_box=document.getElementById('move_box');
	 var oP=lrc_box.getElementsByTagName("p");
	 var oBtn=document.getElementById('btn');
	 var oImg_btn=oBtn.getElementsByTagName('img')[0];
	 var progress=document.getElementById('progerss');
	 var control=document.getElementById('control');
	 var head_img=document.getElementById('head_img');
	 var prev=document.getElementById('prev');
	 var next=document.getElementById('next');
	 var end_time=document.getElementById('end_time');
         var page=document.getElementById('page');
	 var page0=document.getElementById('page0');
	 var mark=document.getElementById('mark');
	 var menu=document.getElementsByClassName('menu')[0];
	 var list=menu.getElementsByTagName('li');
	 var search=document.getElementById('search');
	 var search_text=document.getElementById('search_text');
	 var oName=document.getElementById('name');
	 var nav=document.getElementsByClassName('nav')[0];
	 var nav_list=nav.getElementsByTagName('li');
	 var back_icon=document.getElementsByClassName('back_icon')[0];
	 var bar_mark=document.getElementById('bar_mark');
	 var voice_btn=document.getElementById('voice_btn');
	 var bar=document.getElementById('pros');
	 var bar2=document.getElementById('bar');
	 var con_bar=document.getElementById('con_bar');
	 var bottom=document.getElementById('bottom');
	 var bar_flag=true;
	 var num=0;
	 var flag=true;
	 var timer=null;
	 var arr1=[];//存歌手
	 var arr2=[];//存歌名
     
 
	 //兼容写法
     var move='ontouchmove' in document?'touchmove':'mousemove';
     var down='ontouchstart' in document?'touchstart':'mousedown';
     var up='ontouchend' in document?'touchend':'mouseup';
	 var click='ontouchend' in document? 'tap':'click';
   
    //初始化音量 
	 audio.volume=0.5;
	 //音量按钮
	 addHandler(voice_btn,click,function(){
	   if(bar_flag){
	      bar2.style.display='block';
		  bar_flag=!bar_flag;
	   }else{
	      bar2.style.display='none';
		  bar_flag=!bar_flag;
	   }
	 },{ passive: false });
 
	//控制音量 这里的计算要考虑每层div的offsetTop
	addHandler(con_bar,down,controlV,{ passive: false });
    
	//控制音量
    function controlV(ev){
      addHandler(bar2,move,volumFllow,{ passive: false });
        addHandler(bar2,up,function(){
	        removeHandler(bar2,move,volumFllow);
	   });
    }
    //音量跟随
    function volumFllow(ev){
	  ev = 'ontouchmove' in document ? ev.touches[0] : ev;
	  var cTop=ev.pageY-bottom.offsetTop-voice_btn.offsetTop+bar2.offsetHeight+10;
	  //console.log(cTop);
	  if(cTop<0){
		 cTop=0;
	  }else if(cTop>=bar2.offsetHeight-con_bar.offsetHeight){
		 cTop=bar2.offsetHeight-con_bar.offsetHeight;
	  }
	  var cBottom=bar2.offsetHeight-con_bar.offsetHeight-cTop;
	  
	  //设置小滑块的滚动
	  con_bar.style.bottom=cBottom+'px';
	  bar_mark.style.height=bar2.offsetHeight-cBottom+'px';
	  
	  var scale=(bar2.offsetHeight-con_bar.offsetTop-6)/(bar2.offsetHeight-6);
	  audio.volume=scale*1;
	  //console.log(audio.volume);
   }
  
   //获取新歌榜单
   getlistMusic(1);

   //根据选择获取榜单
   for(var i=0;i<nav_list.length;i++){
      nav_list[i].onclick=function(){
		for(var i=0;i<nav_list.length;i++){
		   nav_list[i].className='';
		}
		this.className='active';
	    switch(this.innerHTML){
		    case '新歌榜':
               getlistMusic(1);
			 break;

			case '热歌榜':
			   getlistMusic(2);
			 break;

			case'摇滚乐':
               getlistMusic(11);
			 break;

			case'爵士':
               getlistMusic(12);
			 break;
               
			case'流行':
               getlistMusic(16);
			 break;
		}
	  }
   }
    
   //通过不同的type获取歌曲榜单
   function getlistMusic(type){
     var script=document.createElement('script');
     script.src='tingapi.ting.baidu.com/v1/restserver/ting?format=json&callback=hanlderList&from=webapp_music&method=baidu.ting.billboard.billList&type='+type+'&size=10&offset=0';
     document.body.insertBefore(script,document.body.firstChild);
   }

  //将歌曲列表放到content中
   function hanlderList(d){
	   var music_name=document.getElementsByClassName('music_name');
	   var player=document.getElementsByClassName('player');
       //list.innerHTML='歌名:'+d.song_list[0].title+',歌手:'+d.song_list[0].artist_name;

	   for(var i=0;i<d.song_list.length;i++){
           arr1[i]=d.song_list[i].artist_name;
	   }
	   for(var i=0;i<d.song_list.length;i++){
           arr2[i]=d.song_list[i].title;
	   }
	   //console.log(arr1);
	   for(var i=0;i<player.length;i++){
           player[i].innerHTML=arr1[i];
	   }  

	   for(var i=0;i<music_name.length;i++){
           music_name[i].innerHTML=arr2[i];
	   }
   }

   //搜索框获取焦点
   search_text.onfocus=function(){
     if(this.value='请输入歌曲'){
	     this.value='';
	 }
   }
   
   //搜索歌曲 
   search.onclick=function(){
	 var name=search_text.value;
     getMusic(name);
   };

  //搜索歌曲
  function getMusic(name){
     oName.innerHTML=name;
	 var script=document.createElement('script');
     script.src='tingapi.ting.baidu.com/v1/restserver/ting?format=json&callback=hanlder&from=webapp_music&method=baidu.ting.search.catalogSug&query='+name;//通过歌曲名搜索 返回id
     document.body.insertBefore(script,document.body.firstChild);
	 page0.style.webkitTransition="-webkit-transform 500ms linear";
	 page0.style.webkitTransform='translate(-170px,0px) rotateY(90deg)';

     page.style.webkitTransition="-webkit-transform 500ms linear";
	 page.style.webkitTransform='translate(0px,0px) rotateY(0deg)';
  }
  
  //获取歌词
  function getLrc(id){
    var script=document.createElement('script');
    script.src='tingapi.ting.baidu.com/v1/restserver/ting?callback=hanlderLrc&format=json&&from=webapp_music&method=baidu.ting.song.lry&songid='+id;//返回hash值
    document.body.insertBefore(script,document.body.firstChild);
  }

  //将歌词放到滚动框
  function hanlderLrc(d){
    lrc_box.innerHTML=parseLrc(d.lrcContent);
	//console.log(d.lrcContent);
  }

  //通过hash值获取歌曲地址
  function hanlderSrc(d1){
     var value=d1.bitrate.file_link;
	 var audio=document.getElementById('audio');
	 audio.setAttribute('src',value);
	    audio.play();
		flag=!flag;
		head_img.className='head_img rotate';
        oImg_btn.src='images/play.png';
  }

  //通过id搜索hash值
  function hanlder(d){
	   var id=d.song[0].songid;
	   //alert(d.song[0].songname);
	   var script=document.createElement('script');
       script.src='tingapi.ting.baidu.com/v1/restserver/ting?format=json&callback=hanlderSrc&from=webapp_music&method=baidu.ting.song.play&songid='+id;//返回hash值
       document.body.insertBefore(script,document.body.firstChild);
	   getLrc(id);//将id传给获取歌词的函数
  }

  //播放各个榜单列表
  for(var i=0;i<list.length;i++){
	list[i].onclick=function(){
	  for(var i=0;i<list.length;i++){
		var music_name=list[i].getElementsByClassName('music_name')[0];
		var img=list[i].getElementsByClassName('Img')[0].getElementsByTagName('img')[0]; 
		img.setAttribute('src','images/pause.jpg');
	  }
	  var music_name=this.getElementsByClassName('music_name')[0];
	  var img=this.getElementsByClassName('Img')[0].getElementsByTagName('img')[0]; 
	  var name=music_name.innerHTML;
	  img.setAttribute('src','images/play.jpg');
	  //console.log(img.getAttribute('src'));
	  getMusic(name);
	}
  }

    //滑屏触发事件 右滑屏
    addHandler(page,'swipeRight',function(){
         //document.body.transform=500+'px';
	    // console.log(0);
		 this.style.webkitTransition="-webkit-transform 500ms ease";
		 this.style.webkitTransform='translate(170px,0px) rotateY(90deg)';

		 page0.style.webkitTransition="-webkit-transform 500ms ease";
		 page0.style.webkitTransform='translate(0px,0px) rotateY(0deg)';
	});

	 //左滑屏
	 addHandler(mark,'swipeLeft',function(){
         console.log(0);
		 page0.style.webkitTransition="-webkit-transform 500ms ease";
		 page0.style.webkitTransform='translate(-170px,0px) rotateY(90deg)';

		 page.style.webkitTransition="-webkit-transform 500ms ease";
		 page.style.webkitTransform='translate(0px,0px) rotateY(0deg)';
	});
   
	 //返回首页
	 addHandler(back_icon,click,function(){
	     page.style.webkitTransition="-webkit-transform 500ms ease";
		 page.style.webkitTransform='translate(170px,0px) rotateY(90deg)';
		 page0.style.webkitTransition="-webkit-transform 500ms ease";
		 page0.style.webkitTransform='translate(0px,0px) rotateY(0deg)';
	 });

     //切换歌曲
     addHandler(next,click,nextM,{ passive: false });
	 addHandler(prev,click,prevM,{ passive: false });

     //歌曲循环 上一首
     function prevM(){
	     for(var i=0;i<arr2.length;i++){
		   if(oName.innerHTML==arr2[i]){
		        var the_index=i-1;
			  if(the_index<0){
			    the_index=arr2.length-1;
			  }
		   }
		 }
		 getMusic(arr2[the_index]);
	 }

	 //歌曲循环 下一首
	 function nextM(){
		 for(var i=0;i<arr2.length;i++){
		   if(oName.innerHTML==arr2[i]){
		         var the_index=i+1;
			  if(the_index>arr2.length-1){
			     the_index=0;
			  }
		   }
		 }
		 getMusic(arr2[the_index]);
	 }
     
	 //解析歌词，将时间和歌词分开
	 function parseLrc(t_lrc){
	     var lrc=t_lrc.split(']'); 
		  
		 var html="";
		 for(var i=0;i<lrc.length;i++){
			 var arr=lrc[i].split('[');	
			 //console.log(arr);
			 if(arr[1]){
				 var time=arr[1].split('.');
				 var timer=time[0].split(':');
				 var second=timer[0]*60+timer[1]*1;
				 html+="<p id="+second+">"+arr[0]+"</p>";	
			 } 
		 }
		 return html;
	 }
	 
   //播放停止歌曲
   addHandler(oImg_btn,click,function(ev){
	 ev=ev||window.event;
     if(flag){
	    audio.play();
		flag=!flag;
		head_img.className='head_img rotate';
        oImg_btn.src='images/play.png';
	 }else{
	    audio.pause();
		flag=!flag;
		head_img.className='head_img';
		 oImg_btn.src='images/pause.png';
	 }
	 ev.stopPropagation();
   },{ passive: false });
   
   
   //监听down事件
   addHandler(control,down,moveScroll,{ passive: false });
   
   //拖动滚动条
   function moveScroll(ev){
     audio.pause(); 
	 addHandler(progress,move,lrcFollow,{ passive: false });
	 
	 addHandler(progress,up,function(){
	   //根据加载条按钮位置确认播放位置（时间）
	    var scales=control.offsetLeft/progress.offsetWidth;
		//console.log(scales);
		audio.currentTime=audio.duration*scales;
		audio.play();
		removeHandler(progress,move,lrcFollow);
		//removeHandler(control,down,moveScroll);
     },{ passive: false });
   }
   
   //歌词滚动条跟随
   function lrcFollow(ev){
	    ev = 'ontouchmove' in document ? ev.touches[0] : ev;
	    var cleft=ev.pageX-progress.offsetLeft;
	    
		if(cleft<=0){
		   cleft=0;
		}else if(cleft+control.offsetWidth/2>=progress.offsetWidth){
		   cleft=progress.offsetWidth-control.offsetWidth/2;
		}
		control.style.left=cleft+"px";
		pros.style.width=cleft+"px";
		var scales=control.offsetLeft/progress.offsetWidth;
       // lrc_box.style.top=-parseInt(scales*(lrc_box.offsetHeight-lrc.offsetHeight))+'px';	
	 }

   //监听播放位置的改变
   addHandler(audio,"timeupdate",function(){
       var curT=parseInt(this.currentTime);//返回播放的当前位置
	   var scale=this.currentTime/this.duration;//计算播放比例
	   var curP=document.getElementById(curT);//获取当前对应的歌词
	   var end=this.ended;
	   //console.log(curT);
	   //console.log(this.currentTime);
	   //保存当前时间和总时间
	   var cur=curT;
	   var dur=parseInt(this.duration);

	    //输出总时间
	   minute2=parseInt(dur/60);
	   if(dur%60<10){
	     end_time.innerHTML=""+minute2+":0"+dur%60+"";
	   }else{
	     end_time.innerHTML=""+minute2+":"+dur%60+"";
	   }
       
	   //输出当前时间
	   minute1=parseInt(cur/60);
	   if(cur%60<10){
	     begin_time.innerHTML=""+minute1+":0"+cur%60+"";
	   }else{
	     begin_time.innerHTML=""+minute1+":"+cur%60+"";
	   }
	   
	  
	   //进度加载
       bar.style.width=progress.offsetWidth*scale+'px';
	   control.style.left=progress.offsetWidth*scale-5+'px';
	  
	   if(end==true){
		  //clearInterval(timer);
	      head_img.className='head_img';
		  var timer=setTimeout('nextM()',2000); //两秒钟后切换歌曲
	   }
	   
	   //移动歌词
	   if(curP){
		  for(var i=0;i<oP.length;i++){
		    oP[i].style.cssText="color:#ccc;font-size:0.4rem;";
		  } 
	      curP.style.cssText='color:#32d5d6;font-size:0.5rem;';
		  //alert(oP[0].style.color);
          

		  //根据歌词颜色移动歌词
		  for(var i=0;i<oP.length;i++){
		     if(oP[i].style.color=='rgb(50, 213, 214)'){
			    num=i;
				//console.log(num);
			 }
		  }
		  if(oP[num].id==curT){
		     lrc_box.style.top=-0.6*(num-2)+"rem";
			 num++;
		  }
	   }
   });

  //事件处理程序
  function addHandler(element,type,hanlder){
    if(element.addEventListener){
	   element.addEventListener(type,hanlder,false);
	}else if(element.attachEvent){
	   element.attachEvent("on"+type,hanlder);
	}else{
	   element["on"+type]=hanlder;
	}
  }

   //移出事件处理程序
  function removeHandler(element,type,handler){
	 if(element.removeEventListener){
		  element.removeEventListener(type,handler,false);
		
	 }else if(element.detachEvent){
		  element.detachEvent("on"+type,handler);
	 }else{
		  element["on"+type]=null;
	 }
	   
	} 


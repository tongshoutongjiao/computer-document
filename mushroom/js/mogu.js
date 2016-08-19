/**
 * Created by Administrator on 2016/8/15.
 */
(function(){
    function rotate(){
        /*轮播图*/
        /*1.获取所有要操作的元素*/
        var oBox=document.getElementById("box");
        var oSlide=document.getElementById("slide");
        var oAI=oSlide.getElementsByTagName("a");
        var oImg=oSlide.getElementsByTagName("img");
        var oDot=document.getElementById("dot");
        var oA1=document.getElementById('btnL');
        var oA2=document.getElementById('btnR');
        var oLi=oDot.getElementsByTagName("li");
        var data=null;
        var autoTimer=null;
        var interval=1000;
        var step=0;

//获取并解析数据
        getData();
        function getData(){
            var xml=new XMLHttpRequest;
            xml.open('get','json/data.txt?='+Math.random(),false);
            xml.onreadystatechange=function(){
                if(xml.readyState===4&&/^2\d{2}$/.test(xml.status)){
                    data=utils.jsonParse(xml.responseText)
                }
            };
            xml.send();

        }
        /* console.log(data);
         */
//绑定数据
        bind();
        function bind(){
            var str1='';
            var str2='';
            for(var i=0;i<data.length;i++){
                str1+='<a><img realImg="'+data[i].imgSrc+'"/></a>';
                str2+=i===0?'<li class="dotM""></li>':'<li></li>';
            }
            //给str1再多拼接一个div索引为0的那一项
            str1+='<a><img realImg="'+data[0].imgSrc+'"/></a>';
            oSlide.innerHTML=str1;
            oDot.innerHTML=str2;
            //改变oSlide的宽度
            /*console.log(oBox.offsetWidth);*/
            oSlide.style.width=oAI.length*oBox.offsetWidth+'px';


        }
        //3.lazyImg 图片延时加载
        setTimeout(lazyImg,500);
        function lazyImg(){
            for(var i=0;i<oImg.length;i++){
                (function(index){
                    var tmpImg=new Image;
                    tmpImg.src=oImg[index].getAttribute("realImg");
                    tmpImg.onload=function(){
                        oImg[index].src=this.src;
                        tmpImg=null;
                    };
                    tmpImg.onerror=function(){
                        tmpImg=null;
                    }

                })(i)
            }
        }
        //4.图片自动轮播
        clearInterval(autoTimer);
        autoTimer=setInterval(autoMove,interval);
        function autoMove(){
            if(step>=oAI.length-1){
                step=0;
                utils.css(oSlide,'left',0);
            }
            step++;
            /* console.log(step);*/
            zhufengAnimate(oSlide,{left:-step*oImg[0].offsetWidth},500);
            bannerTip();
        }
        //5.焦点自动轮播
        function bannerTip(){
            /* console.log(step);*/
            var tmpStep=step>=oLi.length?0:step;
            for(var i=0;i<oLi.length;i++){
                i===tmpStep?utils.addClass(oLi[i],'dotM'):utils.removeClass(oLi[i],'dotM');
            }
        }

        //6.移入移除
        oBox.onmouseover=function(){
            clearInterval(autoTimer);
            oA1.style.display=oA2.style.display='block';
        };
        oBox.onmouseout=function(){
            autoTimer=setInterval(autoMove,interval);
            oA1.style.display=oA2.style.display='none';
        };
        //7.点击焦点手动切换
        handleChange();
        function handleChange(){
            for(var i=0;i<oLi.length;i++){
                oLi[i].index=i;
                oLi[i].onclick=function(){
                    step=this.index;
                    zhufengAnimate(oSlide,{left:-step*oImg[0].offsetWidth},0);
                    bannerTip();
                }

            }
        }
        //8.点击左右按钮切换
        oA2.onclick=autoMove;
        oA1.onclick=function(){
            if(step<=0){
                step=oLi.length;
                utils.css(oSlide,'left',-step*oImg[0].offsetWidth);
            }
            step--;
            zhufengAnimate(oSlide,{left:-step*oImg[0].offsetWidth},500);
            bannerTip();
        }
    }
    function backtoTop(){
        var oBack=document.getElementById('backTo');
        var oHead=document.getElementById('head-wrapper');
        var oLetgo=document.getElementById('lets-rock');
        window.onscroll=computedDisplay;
        function computedDisplay(){
            if(utils.win('scrollTop')>utils.getCss(oHead,'height')){
                oBack.style.display='block';
            }else{
                oBack.style.display='none';
            }
            if(utils.win('scrollTop')>utils.win('clientHeight')){
                oLetgo.style.display='block';
            }else{
                oLetgo.style.display='none';
            }

            oBack.onclick=function(){
                //点击按钮的时候，立即隐藏； 可是，当按钮被点击的时候，就会触发滚轮事件，及if 显示 else隐藏都会被触发；这样就跟让按钮隐藏冲突；解决办法：window.onscroll=null;
                this.style.display='none';
                window.onscroll=null;
                //对公式的计算 step=target/duration*interval;
                var target=utils.win('scrollTop');
                var duration=100;
                var interval=10;
                var step=target/duration*interval;
                //开启一个定时器，每次获取最新的距离-step，再重新设置新位置
                var timer=setInterval(function(){
                    //每次获取最新的距离
                    var curTop=utils.win('scrollTop');
                    if(curTop<=utils.win('clientHeight')){
                        //当定时器结束的时候，恢复滚轮事件及里面的条件判断
                        window.onscroll=computedDisplay;
                    }
                    if(curTop<=0){
                        clearInterval(timer);
                        //当定时器结束的时候，恢复滚轮事件及里面的条件判断
                        window.onscroll=computedDisplay;
                        return;
                    }

                    //每次让最新的距离-step；然后重新赋值
                    curTop-=step;
                    //当我们求到最新的距离，把他赋值给scrollTop
                    utils.win('scrollTop',curTop);
                },interval)
            }

        }

    }
    function countDown(){
        var oH=document.getElementById('hour'),
            oM=document.getElementById('min'),
            oS=document.getElementById('sec');
        oH.innerHTML=formatTime();
        var timer=setInterval(function(){
            oH.innerHTML=formatTime();
        },1000);
        // console.log(formatTime());
        function formatTime(){
            var curtime=new Date(),
                curSpan=curtime.getTime();
            var tarTime=new Date("2016/08/18 12:59:59"),
                tarSpan=tarTime.getTime();
            var differTime=tarSpan-curSpan;
            var h=Math.floor(differTime/(1000*60*60)),
                spanH=differTime-h*(1000*60*60);
            var min=Math.floor(spanH/(1000*60)),
                spanMin=spanH -min*(1000*60);
            var sec=Math.floor(spanMin/1000);
            //console.log(oH);
            var h1=oH.innerHTML=zero(h),
                m1=oM.innerHTML=zero(min),
                s1=oS.innerHTML=zero(sec);
            return h1;
        }
        function zero(val){
            return val<10?'0'+val:val;
        }

    }
    function logIn(){
        var oLogIn=document.getElementById('logIn');
        oLogIn.onclick=function(){
            window.open("mogureg.html")
        }
    }
    function init(){
        rotate();
        backtoTop();
        countDown();
        logIn();
    }
   init();
})();
/**
 * Created by Administrator on 2016/8/15.
 */
(function(){
    function rotate(){
        /*�ֲ�ͼ*/
        /*1.��ȡ����Ҫ������Ԫ��*/
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

//��ȡ����������
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
//������
        bind();
        function bind(){
            var str1='';
            var str2='';
            for(var i=0;i<data.length;i++){
                str1+='<a><img realImg="'+data[i].imgSrc+'"/></a>';
                str2+=i===0?'<li class="dotM""></li>':'<li></li>';
            }
            //��str1�ٶ�ƴ��һ��div����Ϊ0����һ��
            str1+='<a><img realImg="'+data[0].imgSrc+'"/></a>';
            oSlide.innerHTML=str1;
            oDot.innerHTML=str2;
            //�ı�oSlide�Ŀ��
            /*console.log(oBox.offsetWidth);*/
            oSlide.style.width=oAI.length*oBox.offsetWidth+'px';


        }
        //3.lazyImg ͼƬ��ʱ����
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
        //4.ͼƬ�Զ��ֲ�
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
        //5.�����Զ��ֲ�
        function bannerTip(){
            /* console.log(step);*/
            var tmpStep=step>=oLi.length?0:step;
            for(var i=0;i<oLi.length;i++){
                i===tmpStep?utils.addClass(oLi[i],'dotM'):utils.removeClass(oLi[i],'dotM');
            }
        }

        //6.�����Ƴ�
        oBox.onmouseover=function(){
            clearInterval(autoTimer);
            oA1.style.display=oA2.style.display='block';
        };
        oBox.onmouseout=function(){
            autoTimer=setInterval(autoMove,interval);
            oA1.style.display=oA2.style.display='none';
        };
        //7.��������ֶ��л�
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
        //8.������Ұ�ť�л�
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
                //�����ť��ʱ���������أ� ���ǣ�����ť�������ʱ�򣬾ͻᴥ�������¼�����if ��ʾ else���ض��ᱻ�����������͸��ð�ť���س�ͻ������취��window.onscroll=null;
                this.style.display='none';
                window.onscroll=null;
                //�Թ�ʽ�ļ��� step=target/duration*interval;
                var target=utils.win('scrollTop');
                var duration=100;
                var interval=10;
                var step=target/duration*interval;
                //����һ����ʱ����ÿ�λ�ȡ���µľ���-step��������������λ��
                var timer=setInterval(function(){
                    //ÿ�λ�ȡ���µľ���
                    var curTop=utils.win('scrollTop');
                    if(curTop<=utils.win('clientHeight')){
                        //����ʱ��������ʱ�򣬻ָ������¼�������������ж�
                        window.onscroll=computedDisplay;
                    }
                    if(curTop<=0){
                        clearInterval(timer);
                        //����ʱ��������ʱ�򣬻ָ������¼�������������ж�
                        window.onscroll=computedDisplay;
                        return;
                    }

                    //ÿ�������µľ���-step��Ȼ�����¸�ֵ
                    curTop-=step;
                    //�����������µľ��룬������ֵ��scrollTop
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
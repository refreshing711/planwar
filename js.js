
function PlaneWar(box){
	this.box = box;
	this.btns = box.getElementsByTagName("button");
	this.divs = box.children;
	this.sky = document.getElementById("sky");
	this.myPlane = document.getElementById("myPlane");
	
	// 开始游戏
	this.btns[0].onclick = this.play.bind(this);
	
}

PlaneWar.prototype = {
	play : function(){
		this.divs[1].style.display = "none";
		// 天空运动
		setInterval(this.skyMove.bind(this), 10);
		// 鼠标控制我方的飞机
		this.control();
		// 我方飞机发射炮弹
		this.bullet();
		// 创建敌方飞机
		this.foe();
	},
	skyMove : function(){
		var n = this.sky.offsetTop;
		n++;
		if( n==0 ){
			n= -568;
		}
		this.sky.style.top = n+"px";
	},
	control : function(){
		var that = this;
		this.box.onmousemove = function(e){
			var x = e.clientX-this.offsetLeft;
			var y = e.clientY-this.offsetTop;
			x-=33;
			y-=40;
			that.myPlane.style.left = x+"px";
			that.myPlane.style.top = y+"px";
			

		};
			
	},
	FoeBoom : function (myPlane){
		var foes = document.getElementsByClassName("foe")
		var len = foes.length;
		for( var i=0; i<len; i++ ){
			// 当炮弹与敌方飞机有接触时
			var foe = foes[i];
			if( this.Peng( myPlane, foe ) && foe.die!=1 ){
				// 血量减少
				var el = foe.querySelector(".HP>div")
				el.style.width = '0px';			
				foe.querySelector("img").src = "images/"+foe.fj2;
				foe.die = 1;
				score.innerHTML = Number(score.innerHTML)+1;
				// 敌方飞机删除
				setTimeout(function(foe){
					clearInterval(foe.timer);
					this.divs[0].removeChild(foe);
				}.bind(this,foe), 500);				
			}
		}
	},
	bullet : function(){
		var that = this;
		this.box.oncontextmenu = function(){
			return false;
		}
		this.box.onmousedown = function(e){
			if( e.button == 0 ){
				cre();
			}
			if( e.button == 2 ){
				creline();
			}
			
			function creline(){
				for( var i=0; i<320; i+=20 ){
					cre(i);
				}
			}
			
			function cre(x){
				// 创建炮弹
				var img = document.createElement("img");
				img.src = "images/bullet我的飞机炮弹6_14.png";
				img.className = "bullet";
				that.divs[0].appendChild(img);
				if( x==undefined ){
					img.style.left = that.myPlane.offsetLeft+31+'px';
				}else{
					img.style.left = x+'px';
				}
				img.style.top = that.myPlane.offsetTop-14+'px';
				// 炮弹向前飞
				function move(){
					var n = img.offsetTop;
					n-=24;				
					img.style.top = n+'px';
					// 如果碰到了敌方飞机
					Boom(img);
					// 如果溢出了舞台
					if( n <= -14 ){
						clearInterval(img.timer);
						if( img.die !=1 ){
							that.divs[0].removeChild(img);
						}
					}
				}
				
				img.timer = setInterval(move, 50);
			}
			return false;
		}
		
		function Boom(bullet){
			var foes = document.getElementsByClassName("foe")
			var len = foes.length;
			for( var i=0; i<len; i++ ){
				// 当炮弹与敌方飞机有接触时
				var foe = foes[i];
				if( that.Peng( bullet, foe ) && bullet.die!=1 && foe.die!=1 ){
					foe.querySelector("img").src = "images/"+foe.fj1;
					bullet.die = 1;
					// 清除定时器
					clearInterval(bullet.timer);
					// 我方炮弹要销毁
					that.divs[0].removeChild(bullet);
					// 血量减少
					var el = foe.querySelector(".HP>div")
					var n = el.offsetWidth;
					n-=20;
					if(n<0)n=0;
					el.style.width = n+'px';
					if( n<=0 ){
						foe.querySelector("img").src = "images/"+foe.fj2;
						foe.die = 1;
						score.innerHTML = Number(score.innerHTML)+1;
						// 敌方飞机删除
						setTimeout(function(foe){
							clearInterval(foe.timer);
							that.divs[0].removeChild(foe);
						}.bind(this,foe), 500);
					}
					
				}
			}
		}		
	},	
	Peng : function Peng( bullet, foe ){
		var bl = bullet.offsetLeft;
		var bw = bullet.offsetWidth;
		var bt = bullet.offsetTop;
		var bh = bullet.offsetHeight;
		var fl = foe.offsetLeft;
		var fw = foe.offsetWidth;
		var ft = foe.offsetTop;
		var fh = foe.offsetHeight;
		if( bl+bw>fl-10 && bl<fl+fw-10 && bt+bh>ft-10 && bt<ft+fh-10 ){
			return true;
		}else{
			return false;
		}
	},
	foe : function(){
		var that = this;
		// 敌机属性
		var foeAttr = {
			"foe1" : [
				"foe小飞机34_24.png",
				'foe小飞机挨打34_24.png',
				'foe小飞机爆炸34_24.gif',
				34,24,30,
				[4]
			],
			"foe2" : [
				"中飞机46_60.png",
				'中飞机挨打46_64.png',
				'中飞机爆炸46_60.gif',
				46,60,50,
				[2]
			],
			"foe3" : [
				"大飞机110_164.png",
				'大飞机挨打110_170.png',
				'大飞机爆炸110_169.gif',
				110,164,100,
				[1]
			]
		}
		// 创建敌方飞机
		function createFoe(){
			var div = document.createElement("div");
			that.divs[0].appendChild(div);
			div.className = "foe";
			// 随机生成敌方飞机
			var arr = [1,2,3,1,2,1,2,1,1,1];			
			var foe = foeAttr["foe"+arr[parseInt(Math.random()*arr.length)]];
			div.style.width = foe[3]+'px';
			div.style.height = foe[4]+'px';
			div.style.left = parseInt(Math.random()*(320-foe[3]))+'px';
			div.style.top = '-'+foe[4]+'px';
			div.fj1 = foe[1];	// 被击中时的图片
			div.fj2 = foe[2];   // 被击毁时的图片
			var img = document.createElement("img");
			img.src = "images/"+foe[0];
			div.appendChild(img);
			var HP = document.createElement("div");// 总血量
			div.appendChild(HP);
			HP.style.width = foe[5]+'px';
			HP.className = "HP";
			var HPvalue = document.createElement("div"); // 当前血量
			HP.appendChild(HPvalue);
			HPvalue.style.width = foe[5]+'px';
			
			
			// 飞行
			function move(){
				var n = div.offsetTop;
				n+=  foe[6][parseInt(Math.random()*foe[6].length)];
				div.style.top = n+'px';
				if( n > 568 && div.die==1 ){
					clearInterval(div.timer);
					that.divs[0].removeChild(div);
				}
				
				// 如果我方飞机与敌方飞机发生接触
				that.FoeBoom(that.myPlane);
				
				
			}
			div.timer = setInterval(move, 100);
		}
		
		//createFoe()
		// 自动创建敌方飞机
		setInterval( createFoe, 1500 );
	}
}

new PlaneWar(box);






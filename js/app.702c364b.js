(function(e){function n(n){for(var a,o,s=n[0],u=n[1],c=n[2],d=0,f=[];d<s.length;d++)o=s[d],Object.prototype.hasOwnProperty.call(r,o)&&r[o]&&f.push(r[o][0]),r[o]=0;for(a in u)Object.prototype.hasOwnProperty.call(u,a)&&(e[a]=u[a]);l&&l(n);while(f.length)f.shift()();return i.push.apply(i,c||[]),t()}function t(){for(var e,n=0;n<i.length;n++){for(var t=i[n],a=!0,s=1;s<t.length;s++){var u=t[s];0!==r[u]&&(a=!1)}a&&(i.splice(n--,1),e=o(o.s=t[0]))}return e}var a={},r={app:0},i=[];function o(n){if(a[n])return a[n].exports;var t=a[n]={i:n,l:!1,exports:{}};return e[n].call(t.exports,t,t.exports,o),t.l=!0,t.exports}o.m=e,o.c=a,o.d=function(e,n,t){o.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},o.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,n){if(1&n&&(e=o(e)),8&n)return e;if(4&n&&"object"===typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(o.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var a in e)o.d(t,a,function(n){return e[n]}.bind(null,a));return t},o.n=function(e){var n=e&&e.__esModule?function(){return e["default"]}:function(){return e};return o.d(n,"a",n),n},o.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},o.p="";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],u=s.push.bind(s);s.push=n,s=s.slice();for(var c=0;c<s.length;c++)n(s[c]);var l=u;i.push([0,"chunk-vendors"]),t()})({0:function(e,n,t){e.exports=t("56d7")},"034f":function(e,n,t){"use strict";var a=t("85ec"),r=t.n(a);r.a},"0ecc":function(e,n,t){"use strict";var a=t("5be5"),r=t.n(a);r.a},"56d7":function(e,n,t){"use strict";t.r(n);t("e260"),t("e6cf"),t("cca6"),t("a79d");var a=t("2b0e"),r=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{attrs:{id:"app"}},["mainmenu"==e.screen?t("MainMenu"):"game"==e.screen?t("Game"):"shop"==e.screen?t("Shop"):"lose"==e.screen?t("Lose"):t("div",[e._v(" Странно, но вы недолжны этого видеть! :( ")])],1)},i=[],o=t("5530"),s=t("2f62"),u=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{staticClass:"mainmenu"},[t("div",{staticClass:"mainmenu-content"},[t("h2",[e._v("Главное меню")]),t("div",{staticClass:"btn",on:{click:e.startNewGame}},[e._v("Начать новую игру")]),e._m(0)])])},c=[function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",[t("p",[e._v(" Пираты орки напали на корабль с людьми и захватили их. Выжили не все, а тех кто выжил захватили в плен. Герой игры был одним из захваченных в плен. Его имя Джор Джаррус. Захваченных посадили в тюрьму и по одному отправляли в местные подземелья для расчистки их от гоблинов, живущих там и охраняющих множество ценных вещей. Сами орки только надежно охраняли выход из пещеры, чтобы у жертв был только один выход – продвигаться в глубь пещер. ")]),t("p",[e._v("Цель: спасти экипаж корабля.")])])}],l={name:"MainMenu",methods:Object(o["a"])({},s["a"].mapMutations(["startNewGame"]))},d=l,f=t("2877"),p=Object(f["a"])(d,u,c,!1,null,null,null),m=p.exports,h=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{staticClass:"game"},[t("div",{staticClass:"game-content"},[t("PlayerShortInfo"),t("GameDisplay"),t("EnemyShortInfo"),t("div",{staticClass:"btn",on:{click:e.openMainMenu}},[e._v("Главное меню")]),t("div",{staticClass:"btn",on:{click:e.openShopScreen}},[e._v("Магазин")])],1)])},y=[],v=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{staticClass:"player-short-info"},[t("div",{staticClass:"player-stats"},[t("u",[e._v("Ваши статы:")]),t("BeingBaseInfo",{attrs:{being:e.player}})],1),t("p",[e._v("Золото: "+e._s(e.player.gold)+"$ ")])])},b=[],_=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",[t("p",[e._v(" Здоровье: "+e._s(e.being.hp)+" / "+e._s(e.being.maxHp)+" | Урон: "+e._s(e.being.ad)+" "),e.being.bonusAd?[e._v("+ "+e._s(e.being.bonusAd)+" = "+e._s(e.being.ad+e.being.bonusAd))]:e._e()],2)])},g=[],w={name:"BeignBaseInfo",props:["being"]},M=w,S=Object(f["a"])(M,_,g,!1,null,null,null),x=S.exports,O={name:"PlayerShortInfo",computed:Object(o["a"])({},s["a"].mapState(["player"])),components:{BeingBaseInfo:x}},j=O,I=(t("0ecc"),Object(f["a"])(j,v,b,!1,null,"693dd4fd",null)),P=I.exports,E=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{staticClass:"enemy-short-info"},[e.enemy?[t("p",[e._v("Информация о враге:")]),t("BeingBaseInfo",{attrs:{being:e.enemy}})]:[t("p",[e._v("Вы не кого не атаковали в последнее время.")])]],2)},C=[],k={name:"EnemyShortInfo",computed:Object(o["a"])({},s["a"].mapGetters({enemy:"getCurrentEnemy"})),components:{BeingBaseInfo:x}},A=k,B=Object(f["a"])(A,E,C,!1,null,null,null),N=B.exports,K=function(){var e=this,n=e.$createElement,a=e._self._c||n;return a("div",{staticClass:"game-display"},[a("img",{directives:[{name:"show",rawName:"v-show",value:!1,expression:"false"}],attrs:{id:"dcss-tiles",src:t("abf1")}})])},$=[],z=t("b85c"),G=t("deb7"),L=t("1266"),T=t.n(L),D={Period:new T.a(0,0),KeyH:new T.a(-1,0),KeyL:new T.a(1,0),KeyK:new T.a(0,-1),KeyJ:new T.a(0,1),KeyY:new T.a(-1,-1),KeyU:new T.a(1,-1),KeyB:new T.a(-1,1),KeyN:new T.a(1,1),Numpad5:new T.a(0,0),Numpad4:new T.a(-1,0),Numpad6:new T.a(1,0),Numpad8:new T.a(0,-1),Numpad2:new T.a(0,1),Numpad7:new T.a(-1,-1),Numpad9:new T.a(1,-1),Numpad1:new T.a(-1,1),Numpad3:new T.a(1,1),ArrowLeft:new T.a(-1,0),ArrowRight:new T.a(1,0),ArrowUp:new T.a(0,-1),ArrowDown:new T.a(0,1)},H={width:20,height:20},q={directionByKeyCode:D,defaultSize:H},R=new G["a"]({width:q.defaultSize.width,height:q.defaultSize.height,fontSize:14,forceSquareRatio:!0,layout:"tile",bg:"transparent",tileWidth:32,tileHeight:32,tileMap:{"@":[128,64],g:[96,64],".":[0,448]}}),U={name:"game-display",template:"#game-display",methods:Object(o["a"])({},s["a"].mapMutations(["movePlayer","attack","tryAddRandomEnemy","turnAi","openLoseScreen"]),{draw:function(e){var n=this.playerPosition;if(R.clear(),!e||"floor"==e)for(var t=0;t<this.defaultSize.height;t++)for(var a=0;a<this.defaultSize.width;a++)R.draw(a,t,".");if(!e||"beings"==e){R.draw(n.x,n.y,"@");var r,i=Object(z["a"])(this.enemies);try{for(i.s();!(r=i.n()).done;){var o=r.value;R.draw(o.x,o.y,o.ch)}}catch(s){i.e(s)}finally{i.f()}}},handleKeyboardEvnets:function(e){var n=q.directionByKeyCode[e.code];if(n)if(n.isZero())this.update();else{var t=n.clone().add(this.playerPosition),a=this.getEnemyInThisPosition(t);a?(this.attack({defenderId:a.id}),this.update()):this.isMovablePosition(t)&&(this.movePlayer(n),this.update())}},update:function(){Math.random()<.1&&this.tryAddRandomEnemy(),this.turnAi(),this.isPlayerAlive||this.openLoseScreen(),this.$forceUpdate()}}),computed:Object(o["a"])({},s["a"].mapState(["enemies","defaultSize"]),{},s["a"].mapGetters(["playerPosition","isMovablePosition","getEnemyInThisPosition","isPlayerAlive"])),mounted:function(){var e=this;this.$el.appendChild(R.getContainer());var n=document.querySelector("#dcss-tiles");R.setOptions({tileSet:n}),n.onload=function(){e.draw("floor"),setTimeout((function(){e.draw("beings")}),100)},this.draw(),document.addEventListener("keydown",this.handleKeyboardEvnets)},beforeDestroy:function(){document.removeEventListener("keydown",this.handleKeyboardEvnets)},updated:function(){this.draw()}},J=U,W=Object(f["a"])(J,K,$,!1,null,null,null),Y=W.exports,Z={name:"MainMenu",methods:Object(o["a"])({},s["a"].mapMutations(["openMainMenu"]),{},s["a"].mapMutations(["openShopScreen"])),components:{PlayerShortInfo:P,EnemyShortInfo:N,GameDisplay:Y}},F=Z,Q=Object(f["a"])(F,h,y,!1,null,null,null),V=Q.exports,X=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{staticClass:"shop"},[t("div",{staticClass:"shop-content"},[t("h2",[e._v("Магазин")]),t("PlayerShortInfo"),t("hr"),e._l(e.items,(function(n,a){return t("div",{key:n.id},[a?t("hr"):e._e(),t("b",[e._v(e._s(n.name))]),n.required?t("div",[e._v(" Состовляющие: "),e._l(n.required,(function(n,a){return t("span",{key:a},[a?[e._v(",")]:e._e(),e._v(" "+e._s(e.getItemNameById(n))+" ")],2)}))],2):e._e(),t("p",[e._v("Цена: "+e._s(n.cost))]),t("p",[t("i",[e._v(e._s(n.desc))])]),t("u",[e._v("Пассивные эффекты:")]),e._l(n.passives,(function(n,a){return t("p",{key:a},["flat-bonus-ad"==n.name?[t("b",[e._v("+"+e._s(n.value))]),e._v(" бонусного урона ")]:e._e()],2)})),t("button",{on:{click:function(t){return e.tryBuyItem(n)}}},[e._v("Купить предмет")])],2)})),t("p"),t("hr"),t("div",{staticClass:"btn",on:{click:e.openGameScreen}},[e._v("Вернуться в игру")])],2)])},ee=[],ne={name:"Shop",methods:Object(o["a"])({},s["a"].mapMutations(["openGameScreen","buyItem"]),{tryBuyItem:function(e){e.cost<=this.player.gold&&this.buyItem({itemId:e.id})}}),computed:Object(o["a"])({},s["a"].mapState(["items","player"]),{},s["a"].mapGetters(["getItemNameById"])),components:{PlayerShortInfo:P}},te=ne,ae=Object(f["a"])(te,X,ee,!1,null,null,null),re=ae.exports,ie=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{staticClass:"lose"},[t("div",{staticClass:"lose-content"},[t("h2",[e._v("Вы проиграли :(")]),t("div",{staticClass:"btn",on:{click:e.openMainMenu}},[e._v("Главное меню")])])])},oe=[],se={name:"Lose",methods:Object(o["a"])({},s["a"].mapMutations(["openMainMenu"]))},ue=se,ce=Object(f["a"])(ue,ie,oe,!1,null,null,null),le=ce.exports,de={name:"App",components:{MainMenu:m,Game:V,Shop:re,Lose:le},computed:Object(o["a"])({},s["a"].mapState(["screen"]))},fe=de,pe=(t("034f"),Object(f["a"])(fe,r,i,!1,null,null,null)),me=pe.exports,he=t("8c4f");a["a"].use(he["a"]);var ye=[],ve=new he["a"]({mode:"history",base:"",routes:ye}),be=ve,_e=(t("4de4"),t("7db0"),t("45fc"),t("b0c0"),t("a15b"),t("d3b7"),t("25f0"),0),ge=0;function we(){var e=Date.now(),n=e.toString(36);e==_e?(ge+=Math.floor(100*Math.random())+1,n+="-"+ge.toString(36)):ge=0,_e=e;for(var t=[],a=0;a<n.length;a++)Math.random()<.5?t.push(n[a].toLowerCase()):t.push(n[a].toUpperCase());return t.join("")}var Me=we,Se=[{id:"item-knife",name:"Нож",desc:"Незначительно увеличивает урон",cost:130,passives:[{name:"flat-bonus-ad",value:10}]},{id:"item-sword",name:"Меч",desc:"Увеличивает урон",cost:290,required:["item-knife","item-knife"],passives:[{name:"flat-bonus-ad",value:40}]}];function xe(){return{player:{x:15,y:15,hp:550,maxHp:550,ad:75,bonusAd:0,gold:500,inventory:[]},currentEnemy:null,enemies:[{id:Me(),x:10,y:10,ch:"g",hp:400,maxHp:400,ad:45,bonusAd:0}]}}a["a"].use(s["a"]);var Oe=new s["a"].Store({state:Object(o["a"])({screen:"mainmenu",defaultSize:q.defaultSize,items:Se},xe()),mutations:{startNewGame:function(e){e.screen="game",Object.assign(e,xe())},openMainMenu:function(e){e.screen="mainmenu"},openLoseScreen:function(e){e.screen="lose"},openGameScreen:function(e){e.screen="game"},openShopScreen:function(e){e.screen="shop"},movePlayer:function(e,n){e.player.x+=n.x,e.player.y+=n.y},buyItem:function(e,n){var t=n.itemId,a=e.items.find((function(e){return e.id==t}));e.player.gold-=a.cost,e.player.inventory.push(t),this.commit("applyInventory")},applyInventory:function(e){var n=e.player;n.bonusAd=0;var t,a=Object(z["a"])(n.inventory);try{var r=function(){var a,r=t.value,i=e.items.find((function(e){return e.id==r})),o=Object(z["a"])(i.passives);try{for(o.s();!(a=o.n()).done;){var s=a.value;"flat-bonus-ad"==s.name&&(n.bonusAd+=s.value)}}catch(u){o.e(u)}finally{o.f()}};for(a.s();!(t=a.n()).done;)r()}catch(i){a.e(i)}finally{a.f()}},tryAddRandomEnemy:function(e){var n=Math.floor(Math.random()*e.defaultSize.width),t=Math.floor(Math.random()*e.defaultSize.height);if(this.getters.isMovablePosition({x:n,y:t})){var a=300+Math.floor(200*Math.random());e.enemies.push({id:Me(),x:n,y:t,ch:"g",hp:a,maxHp:a,ad:25+Math.floor(50*Math.random()),bonusAd:0})}},attack:function(e,n){var t=n.attackerId,a=n.defenderId,r=t&&e.enemies.find((function(e){return e.id==t}))||e.player,i=a&&e.enemies.find((function(e){return e.id==a}))||e.player;i&&(i.id&&(e.currentEnemy=i),i.hp-=r.ad+r.bonusAd,i.hp<=0&&(e.enemies=e.enemies.filter((function(e){return e.hp>0})),i.id&&(e.currentEnemy=null)))},turnAi:function(e){var n,t=e.player,a=Object(z["a"])(e.enemies);try{for(a.s();!(n=a.n()).done;){var r=n.value;if(Math.max(Math.abs(t.x-r.x),Math.abs(t.y-r.y))<=1)this.commit("attack",{attackerId:r.id});else if(Math.random()<.8){var i=new T.a([1,-1][Math.floor(2*Math.random())],[1,-1][Math.floor(2*Math.random())]),o=i.clone().add(r);this.getters.isMovablePosition(o)&&(r.x+=i.x,r.y+=i.y)}}}catch(s){a.e(s)}finally{a.f()}}},getters:{isMovablePosition:function(e){return function(n){return n.x>=0&&n.x<e.defaultSize.width&&n.y>=0&&n.y<e.defaultSize.height&&!e.enemies.some((function(e){return e.x==n.x&&e.y==n.y}))&&!(n.x==e.player.x&&n.y==e.player.y)}},getEnemyInThisPosition:function(e){return function(n){return e.enemies.find((function(e){return e.x==n.x&&e.y==n.y}))}},playerPosition:function(e){return new T.a(e.player.x,e.player.y)},isPlayerAlive:function(e){return e.player.hp>0},getCurrentEnemy:function(e){return e.currentEnemy},getItemNameById:function(e){return function(n){var t=e.items.find((function(e){return e.id==n}));return t&&t.name}}}});a["a"].config.productionTip=!1,new a["a"]({router:be,store:Oe,render:function(e){return e(me)}}).$mount("#app")},"5be5":function(e,n,t){},"85ec":function(e,n,t){},abf1:function(e,n,t){e.exports=t.p+"img/DungeonCrawl_ProjectUtumnoTileset.d289e8af.png"}});
//# sourceMappingURL=app.702c364b.js.map
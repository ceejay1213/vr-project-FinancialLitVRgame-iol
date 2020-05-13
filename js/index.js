//<<<<<<<//CUSTOM COMPONENTS//>>>>>>>//

//superhands component
AFRAME.registerComponent("capture-mouse", {
    init: function() {
        this.eventRepeater = this.eventRepeater.bind(this);
        this.el.sceneEl.addEventListener(
        "loaded",
        () => {
            this.el.sceneEl.canvas.addEventListener("mousedown",this.eventRepeater);
            this.el.sceneEl.canvas.addEventListener("mouseup",this.eventRepeater);
            this.el.sceneEl.canvas.addEventListener("touchstart",this.eventRepeater);
            this.el.sceneEl.canvas.addEventListener("touchmove",this.eventRepeater);
            this.el.sceneEl.canvas.addEventListener("touchend",this.eventRepeater);
        },{ once: true });
    },
    eventRepeater: function(evt) {
        if (evt.type.startsWith("touch")) {
            evt.preventDefault();
            // avoid repeating touchmove because it interferes with look-controls
            if (evt.type === "touchmove") {
                return;
            }
        }
        this.el.emit(evt.type, evt.detail);
    }
});

AFRAME.registerComponent("event_dragdrop2", {
    play: function() {
        this.el.addEventListener("click", function(evt) {
             game.checkIfCorrect(evt);
        });
    }
});

//gaze controls
AFRAME.registerComponent("stop-animation", {
    play: function() {
        this.el.addEventListener("mousedown", 
        function(e) {
            try{
                e.toElement.removeAttribute('static-body');
                e.toElement.setAttribute('dynamic-body','shape:auto');
                //code that causes an error
            }catch(errorr){
                //console.log("index.js error mousedown event")
            }
            // color randomizer credit: http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript#comment6801353_5365036
        });
        this.el.addEventListener("mouseup", 
            function(e) {
                try{
                    e.toElement.removeAttribute('dynamic-body');
                    e.toElement.setAttribute('static-body','shape:auto');
                    //code that causes an error
                }catch(errorr){
                    //console.log("index.js error mouseup event")
                }
        });
    }
});

//sounds click and swap
AFRAME.registerComponent("selectedornot", {
    init: function() {
        this.el.addEventListener("click", 
        function(e){
            let sounds={
                entityPickUp:$$('gameStartPickUp').components.sound,
                entitySwap:$$('gameStartSwap').components.sound
            }
            let cursorText=$$('cursorText');

            //console.log(e)
            if(selected.entity=="en" ){
                sounds.entityPickUp.playSound();

                //save entity animations and positions 
                selected.entity=e.target;
                selected.posx=roundToThousandths(e.target.components.position.data.x);
                selected.posy=roundToThousandths(e.target.components.position.data.y);
                selected.posz=roundToThousandths(e.target.components.position.data.z);
                selected.position=appendXYZwithSpaces(selected.posx,selected.posy,selected.posz)
                selected.animation=e.target.getAttribute('animation');
                selected.rotation=e.target.getAttribute('animation_rotate');

                //remove rotation
                selected.entity.removeAttribute('animation_rotate');
                cursorText.setAttribute('text',`value: ${selected.entity.id}`);


                
                //set look-at attribute
                selected.entity.setAttribute('look-at','#cam');
                game.deleteGif('deleteGif');
            }
            if(selected.entity!=e.target){
                sounds.entitySwap.playSound();

                //revert back to original position
                selected.entity.setAttribute('animation_rotate',selected.rotation);
                selected.entity.setAttribute('position',selected.position);
                selected.entity.setAttribute('animation',selected.animation);
                console.log(String(e.target.getAttribute('animation')));
                //remove look-at
                selected.entity.removeAttribute('look-at');
 
                //save new entity
                selected.entity=e.target;
                selected.posx=roundToThousandths(e.target.components.position.data.x);
                selected.posy=roundToThousandths(e.target.components.position.data.y);
                selected.posz=roundToThousandths(e.target.components.position.data.z);
                selected.position=appendXYZwithSpaces(selected.posx,selected.posy,selected.posz)
                selected.animation=e.target.getAttribute('animation');

                //remove rotation
                selected.entity.removeAttribute('animation_rotate');
                cursorText.setAttribute('text',`value: ${selected.entity.id}`);

                //set look-at attribute
                selected.entity.setAttribute('look-at','#cam');
                game.deleteGif('deleteGif');
            }

            // color randomizer credit: http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript#comment6801353_5365036
        });
    }
});

AFRAME.registerComponent("selectedornot2", {
    init: function() {
        let obj;
        this.el.addEventListener("click", 
        function(e){
            console.log(e)
            selected.entity=e.target
            // color randomizer credit: http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript#comment6801353_5365036
        });
    }
});

AFRAME.registerComponent("emitgrab", {
    init: function() {
        let obj;
        this.el.addEventListener("mousedown", e => {
        e.toElement.removeAttribute('static-body');
        e.toElement.setAttribute('dynamic-body','shape:auto');
        // color randomizer credit: http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript#comment6801353_5365036
        console.log(e)
        console.log(e.toElement.className)
        });
        this.el.addEventListener("mouseup", e => {
        e.toElement.removeAttribute('dynamic-body');
        e.toElement.setAttribute('static-body','shape:auto');
        // color randomizer credit: http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript#comment6801353_5365036
        console.log(e)
        });
    }
});

//previously known as is-sound-loaded
AFRAME.registerComponent('game-start-initiator', {
    init: function () {

        this.el.addEventListener('sound-loaded',function(){
            console.log("Game Starting...")
            game.mainMenu();
        })
    }
  });


AFRAME.registerComponent('startclicked', {
    init: function () {
        this.el.addEventListener('click',
        function(evt){
            let sounds={
                buttonPop:$$('startMenuPop').components.sound,
            }
            sounds.buttonPop.playSound();
            deleteRestartMenu();
            game.startGame();
            game.removeentity(this,false);
            
        })
    }
});

AFRAME.registerComponent('returntomainmenu', {
    init: function () {
        this.el.addEventListener('click',
        function(evt){
            let sounds={
                buttonPop:$$('startMenuPop').components.sound,
            }
            sounds.buttonPop.playSound();

            deleteRestartMenu();
            game.mainMenu();
            
        })
    }
});

AFRAME.registerComponent('raycaster-listen', {
    dependencies: ['raycaster'],
    tick: function () {
        timer=Date.now();
        let difference=timer-prevtime;
        if(difference>10){
            prevtime=Date.now();
        }
        game.getRayIntersection();
        this.el.addEventListener('raycaster-intersected', 
        function(evt){
          //  console.log("fuesddddddddddddd");
         //   console.log(evt.detail);
          //  console.log(evt.detail.getIntersection(this.el));
        });
    }
});

AFRAME.registerComponent('audiohandler', {
    init:function() {
    let playing = false;
    let audio = this.el.components.sound;
    this.el.setAttribute("src", "https://upload.wikimedia.org/wikipedia/commons/b/bd/Bizet_-_Carmen_-_Toreador_Song_%28French%2C_Musopen%29.ogg");

    this.el.addEventListener('click', () => {
        if(!playing) {
            audio.playSound();
        } else {
            audio.stopSound();
        }
        playing = !playing;
        });
    }
});

let $   = (queryString)=> document.querySelector(queryString);
let $$  = (id)=> document.getElementById(id);
let $$$ = (classname) => document.getElementsByClassName(classname);
let selected={ 
    entity:"en",
    position:"en",
    posx:"en",
    posy:"en",
    posz:"en",
    animation:"en",
    rotation:"en"
};


let timer=Date.now();
let prevtime=Date.now();
let appendXYZwithSpaces = (x,y,z) =>{
    return String(x)+' '+String(y)+' '+String(z)
}
let roundToThousandths=(val)=>{
    return Math.floor(val*1000)/1000
}

let deleteAll=()=>{
    let elements = $$$('deletable');
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }
}

let activateFadeIn=()=>{
    let fadeBox=$$('fadeBox');
    fadeBox.setAttribute('animation__fade','autoplay:true; dur:2000;loop:0; to:1.000; from:0.499;');
}

let activateFadeOut=()=>{
    let fadeBox=$$('fadeBox');
    fadeBox.setAttribute('animation__fade','autoplay:true; dur:2001;loop:0;from:1.000; to:0.499; ');
}

let deleteMainMenu=()=>{
    let elements = $$$('startmenu');
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
    }
    console.log("Menu Loaded")
}

let deleteRestartMenu=()=>{
    let restartMenu=$$$('restartmenu');
    while(restartMenu.length > 0){
        game.removeentity(restartMenu[0],false);
    }
}


function Game(){
    let score=0,run,lose,win,totalItems;
    let session={
        score:0,
        health:3,
        totalItems:0
    }
    this.mainMenu=function(evt){
        let startbgm=$$('startMenuBGM');
        startbgm.components.sound.playSound();
        loadMenu();
    }

    this.startGame=function(){
        session.score=0;
        session.health=3;
        session.totalItems=0;
        selected={ 
            entity:"en",
            position:"en",
            posx:"en",
            posy:"en",
            posz:"en",
            animation:"en",
            rotation:"en"
        };
        //sound components
        let sounds={
            startMenuBackground:$$('startMenuBGM').components.sound,
            gameplayBackground:$$('gameStartBGM').components.sound,
        }
        sounds.startMenuBackground.stopSound();

        activateFadeIn();

        setTimeout(function(){
            deleteMainMenu();
            loadUI();
            loadScene();
            createentityHard();
            activateFadeOut();
        },3000)
        
        setTimeout(function(){
            sounds.gameplayBackground.playSound();
        },6000);

        //load THings
        
    }

    this.checkIfCorrect=function(evt){
        let scoreDISPLAY=$$("scoreValue");
        let gifBox= new document.createElement('a-entity');
        let cursorText=$$('cursorText');
        cursorText.setAttribute('text',`value: ---`);

        let check={
            entityClassNeeds:selected.entity.className.includes("needs"),
            bucketClassNeeds:evt.target.className.includes("needbucket"),
            entityClassWants:selected.entity.className.includes("wants"),
            bucketClassWants:evt.target.className.includes("wantbucket"),
        }

        //sound components
        let sounds={
            playCorrect:$$('gameStartCorrect'),
            playWrong:$$('gameStartWrong')
        }

        if(check.entityClassNeeds && check.bucketClassNeeds || check.entityClassWants && check.bucketClassWants){
            //correct
            session.score+=1;
            scoreDISPLAY.setAttribute('value',String(session.score));

            //render correct gif
            gifBox.setAttribute('id','ctGif');
            //gifBox.setAttribute('mixin','renderCorrectGif');
            gifBox.setAttribute('material','src:#correctGif; transparent:true;');
            gifBox.setAttribute('geometry','primitive:box; height:1;width:1;depth:0.01');
            gifBox.setAttribute('mixin','alphaTrue');
            gifBox.setAttribute('scale','1.5 1.5 0');
            gifBox.setAttribute('position','0.034 1.923 -5.080');
            gifBox.setAttribute('class','deleteGif');
            gifBox.setAttribute('animation','property:material.opacity;from:1; to:0; dur:1750;easing:linear');
            $('a-scene').appendChild(gifBox);
            sounds.playCorrect.components.sound.playSound();
        }
        else if(check.entityClassNeeds && check.bucketClassWants ||  check.entityClassWants && check.bucketClassNeeds){
            damaged();
            //wrong
            sounds.playWrong.components.sound.playSound();
            //scoreDISPLAY.setAttribute('value','wrong');

            //render wrong gif
            gifBox.setAttribute('id','ctGif');
            //gifBox.setAttribute('mixin','renderCorrectGif');
            gifBox.setAttribute('material','src:#wrongGif; transparent:true;');
            gifBox.setAttribute('geometry','primitive:box; height:1;width:1;depth:0.01');
            gifBox.setAttribute('mixin','alphaTrue');
            gifBox.setAttribute('scale','1.5 1.5 0');
            gifBox.setAttribute('position','0.034 1.923 -5.080');
            gifBox.setAttribute('class','deleteGif');
            gifBox.setAttribute('animation','property:material.opacity;from:1.0; to:0; dur:2000;easing:linear');
            $('a-scene').appendChild(gifBox);
        }

        this.removeentity(evt,true);
    }
    this.deleteGif=function(className){
        /*setTimeout(()=>{
            let elements = $$$(className);
                while(elements.length > 0){
                elements[0].parentNode.removeChild(elements[0]);
                }
        },5000);*/
        let elements = $$$(className);
        try {
            while(elements.length > 0){
                elements[0].parentNode.removeChild(elements[0]);
            }            
        } catch (error) {
            
        }

    }

    this.removeentity=(evt,cond)=>{
        if(cond){
            selected.entity.parentNode.removeChild(selected.entity);
            selected.entity="en"
            selected.position="en"
            selected.animation="en"
            session.totalItems-=1;
            if(session.totalItems<1&&session.health>=1){
                gameOver(true);
            }
            else if(session.health<1){
                gameOver(false);
            }

        }else{
            evt.parentNode.removeChild(evt);
            //evt.detail.
        }

    }

    this.getRayIntersection=function(){
        let cursorito=$$('cursorito');
        let intersection={
            x:0,
            y:0,
            z:0
        }
        if(cursorito.components.raycaster.intersections[0]!=="undefined"&&selected.entity!="en"){
            try {
                let x=roundToThousandths(cursorito.components.raycaster.intersections[0].point.x);
                let y=roundToThousandths(cursorito.components.raycaster.intersections[0].point.y)+2;
                let z=roundToThousandths(cursorito.components.raycaster.intersections[0].point.z);

                intersection.x=x;
                intersection.y=y;
                intersection.z=z;
                
                //console.log(`finalZ=${intersection.z}`)
//              console.log(cursorito.components.raycaster);

                selected.entity.setAttribute("position",appendXYZwithSpaces(intersection.x,intersection.y,intersection.z));
                selected.entity.removeAttribute("animation");

            } catch (error) {
                
            }
        }
        
    }
  

    
    //entity Creation
    let createentityHard=function(){
        let models=[
            'FirstAidKit',
            'Banana',
            'Book',
            'Bulb',
            'Corn',
            'Eggplant',
            'Fish',
            'House',
            'Meat',
            'Pants',
            'Pencil',
            'Shirt',
            'Strawberry',
            'Water',
            'Watermelon',
            'Phone',

            'Ball',
            'iPhone',
            'Burger',
            'Candy',
            'Chocoloate',
            'Coke',
            'GameConsole',
            'MountainDew',
            'Doll',
            'Icecream',
            'Lollipop',
            'Pizza',
            'Popsicle',
            'Ring',
            'GoldWatch',
        ]
        
        let items={
            value:0
        }
        models=arrayShuffle(models);

        let objectIndex={value:0}; //for getting position values
        let ypos=2;
        
        for (i = 0; i < 20; i++) {
            if(objectIndex.value>40){
                objectIndex.value=0;
                ypos+=3.5;
            }
            console.log(models[i]);
            items.value+=1;
            session.totalItems+=1;

            let entity = new document.createElement('a-entity');
            $('a-scene').appendChild(entity);
            let entityClass=$$(models[i]).className; //getMixinID
            setEntityClass(entity,entityClass);
            setEntityAnimationPosition(entity,objectIndex.value,ypos);
            setEntityMixins(entity,i,models);
            setEntityExtraProperties(entity);
            entity.setAttribute('id',`-${models[i]}-`)
            //navigate through positionObjectArray
            objectIndex.value+=2;
            
        }
        
    }

    let setEntityClass = (entity,entityClass) => {
        //console.log($$(models[i]).className);
        if(entityClass.includes('needs')){
            entity.setAttribute('class','needs clickable deletable');
        }else{
            entity.setAttribute('class','wants clickable deletable');
        }
    }
    
    let setEntityAnimationPosition =(entity,j,y) => {
        let positions={//for later use in animations
            x1:6.8,   z1:-6.5, 
            x2:10,    z2:-4.8, 
            x3:11.5,  z3:-2.3,
            x4:12,    z4:0.120, 
            x5:12,    z5:2.5, 
            x6:11,    z6:4.9, 
            x7:10,    z7:7, 
            x8:8.5,   z8:9, 
            x9:6.5,   z9:11, 
           x10:3.5,   z10:12,
           x11:-6.8,  z11:-6.5, 
           x12:-10,   z12:-4.8, 
           x13:-11.5, z13:-2.3, 
           x14:-12,   z14:0.120, 
           x15:-12,   z15:2.5, 
           x16:-11,   z16:4.9, 
           x17:-10,   z17:7, 
           x18:-8.5,  z18:9,
           x19:-6.5,  z19:11, 
           x20:-3.5,  z20:12

       }
        let objectKeys=Object.values(positions);//getarray of Values

        let x=objectKeys[j];
        let z=objectKeys[j+1];


        let finalpos=appendXYZwithSpaces(x,y,z);

        if(i%2==0){
            let animposy=y-0.300;
            let posplacement=appendXYZwithSpaces(x,y,z);
            let posanim=appendXYZwithSpaces(x,animposy,z);
            entity.setAttribute('position', posplacement);
            entity.setAttribute('animation','property: position; to: '+posanim+'; dur:2000; dir:alternate; easing: easeInOutCubic; loop:true')
        }else{
          //  entity come from below
            let animposy=y;
                y=y-0.300;
            let posplacement=appendXYZwithSpaces(x,y,z);
            let posanim=appendXYZwithSpaces(x,animposy,z);                  
            entity.setAttribute('position', posplacement);
            entity.setAttribute('animation','property: position; to: '+posanim+'; dur:2000; dir:alternate; easing: easeInOutCubic; loop:true')
        }
        entity.setAttribute('animation__rotate','property: rotation; from: 0 0 0; to: 0 360 0; dur:10000; dir:alternate; easing: linear; loop:true')
        //entity.setAttribute('animation__scale','property: scale; to: 0.01 0.01 0.01; dir:alternate; dur:500; easing: linear; loop:true')
   
    }
    
    let setEntityMixins = (entity,i,models) => {
        entity.setAttribute('mixin',models[i]+' interactibfull alphaTrue');
    }

    let setEntityExtraProperties = (entity) => {
        //entity.setAttribute('stop-animation','');
        entity.setAttribute('selectedornot','');
    }
    


    let damaged=function(){
        let heartElement=$$('heart'+String(session.health));
        heartElement.parentNode.removeChild(heartElement);
        session.health-=1;
        
    }

    let gameOver=function(isWin){
        let sounds={
            fail:$$("gameOverFail").components.sound,
            win:$$("gameOverWin").components.sound,
            gameplayBackground:$$('gameStartBGM').components.sound
        }
        deleteAll();
        let restartBox=new document.createElement('a-entity');
        let mainmenuBox=new document.createElement('a-entity');

        let triviaBox=new document.createElement('a-entity');
        let scoreBox=new document.createElement('a-entity');
        let topSign=new document.createElement('a-entity');
        let topText=new document.createElement('a-text');
        let trivias=$$$("trivia");
        let rand=Math.floor(Math.random()*19);
        sounds.gameplayBackground.stopSound();

        if(isWin){
            sounds.win.playSound();
            topSign.setAttribute('material','src:#veryGood; transparent:true;');
        }else{
            sounds.fail.playSound();
            topSign.setAttribute('material','src:#gameOver; transparent:true;');
            topText.setAttribute('id','topText');
            topText.setAttribute('class','restartmenu');
            topText.setAttribute('mixin','font alphaTrue textAlphaTrue');
            topText.setAttribute('text','align:center; value: Oh no! It seems that you have placed some items into the wrong container...; width:8; wrapCount:80');
            topText.setAttribute('position','0 2.8 -3.500');
            topText.setAttribute('id','topText');
            $('a-scene').appendChild(topText);
        }

        topSign.setAttribute('id','gameOverState');
        topSign.setAttribute('class','restartmenu');
        topSign.setAttribute('geometry','primitive:box; height:1;width:1;depth:0.01');
        topSign.setAttribute('mixin','alphaTrue textAlphaTrue');
        topSign.setAttribute('scale','2 2 0');
        topSign.setAttribute('position','0.034 2.6 -2.500');
        $('a-scene').appendChild(topSign);

        restartBox.setAttribute('id','restartBox');
        restartBox.setAttribute('class','clickable restartmenu');
        restartBox.setAttribute('mixin',`font alphaTrue textAlphaTrue`);
        restartBox.setAttribute('text','align:center; color:brown; value:TryAgain; width:5; zOffset:0.155; lineHeight:0; baseline:bottom;');
        restartBox.setAttribute('position','0 0.600 -3.5');
        restartBox.setAttribute('geometry','primitive:box; width:2; height:0.5; depth:0.3');
        restartBox.setAttribute('material','src:#le');
        restartBox.setAttribute('startclicked','');
        $('a-scene').appendChild(restartBox);

        mainmenuBox.setAttribute('id','mainmenu');   
        mainmenuBox.setAttribute('class','clickable restartmenu');
        mainmenuBox.setAttribute('mixin',`font alphaTrue textAlphaTrue`);
        mainmenuBox.setAttribute('text','align:center; color:brown; value:MainMenu; width:5; zOffset:0.155; lineHeight:0; baseline:bottom;');
        mainmenuBox.setAttribute('position','0 0 -3.5');
        mainmenuBox.setAttribute('geometry','primitive:box; width:2; height:0.5; depth:0.3');
        mainmenuBox.setAttribute('material','src:#le');
        mainmenuBox.setAttribute('returntomainmenu','');
        $('a-scene').appendChild(mainmenuBox);

        triviaBox.setAttribute('id','triviaBox');
        triviaBox.setAttribute('class','restartmenu');
        triviaBox.setAttribute('mixin',`fontTrivia ${trivias[rand].id} alphaTrue textAlphaTrue`);
        triviaBox.setAttribute('text','align:center; color:black; width:2.800; yOffset:40; zOffset:0.155; lineHeight:60');
        triviaBox.setAttribute('position','-1.5 1.803 -3.5');
        triviaBox.setAttribute('geometry','primitive:box; width:3.000; height:1.520; depth:0.300');
        triviaBox.setAttribute('material','src:#le');
        $('a-scene').appendChild(triviaBox);

        scoreBox.setAttribute('id','scoreBoxEndScreen');
        scoreBox.setAttribute('class','restartmenu');
        scoreBox.setAttribute('mixin','font alphaTrue textAlphaTrue');
        scoreBox.setAttribute('text','align:center; value:TotalScore: '+session.score+'; color:black; width:5.000; yOffset:40; zOffset:0.155; lineHeight:100');
        scoreBox.setAttribute('position','1.5 1.803 -3.5');
        scoreBox.setAttribute('geometry','primitive:box; width:3.000; height:1.520; depth:0.300');
        scoreBox.setAttribute('material','src:#le');
        $('a-scene').appendChild(scoreBox);

    }


    let arrayShuffle=function(array){
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
      
        return array;
    }

    //LOAD STUFF
    let loadUI=function(){
        //SCORE
        let scoreText = new document.createElement('a-text');
        let scoreValue = new document.createElement('a-text');
        let scoreBox = new document.createElement('a-box');
        //HEALTH
        let heartX=1.15;
        let heartY=-0.245;
        let heartZ=0.608;
        let healthBox = new document.createElement('a-box');
        let healthText= new document.createElement('a-text');
        //SCORE
        
        scoreBox.setAttribute('id','scoreBox');
        scoreBox.setAttribute('class','ui clickable deletable');
        scoreBox.setAttribute('color','#C19A6B');
        scoreBox.setAttribute('depth','0.3');
        scoreBox.setAttribute('height','1.5');
        scoreBox.setAttribute('width','7.5');
        scoreBox.setAttribute('scale','0.5 0.7 1');
        scoreBox.setAttribute('src','assets/image/hardwood2_diffuse.jpg');
        scoreBox.setAttribute('position','5.192 7 -11');
        $('a-scene').appendChild(scoreBox);
        scoreText.setAttribute('id','scoreText');
        scoreText.setAttribute('class','ui clickable deletable');
        scoreText.setAttribute('width','25');
        scoreText.setAttribute('value','SCORE: ');
        scoreText.setAttribute('color','black');
        scoreText.setAttribute('shader','msdf');
        scoreText.setAttribute('mixin','font');
        scoreText.setAttribute('position','-3.606 0.355 0.153');
        $$('scoreBox').appendChild(scoreText);
        scoreValue.setAttribute('id','scoreValue');
        scoreValue.setAttribute('class','ui clickable deletable');
        scoreValue.setAttribute('value','0');
        scoreValue.setAttribute('width','25');
        scoreValue.setAttribute('shader','msdf');
        scoreValue.setAttribute('mixin','font');
        scoreValue.setAttribute('color','white');
        scoreValue.setAttribute('position','1.723 0.355 0.153');
        $$('scoreBox').appendChild(scoreValue);

        //HEALTH 1.5 5.890 -2.170
        healthBox.setAttribute('class','ui clickable deletable');
        healthBox.setAttribute('id','healthBox');
        healthBox.setAttribute('depth','0.3');
        healthBox.setAttribute('width','7.5');
        healthBox.setAttribute('height','1.5');
        healthBox.setAttribute('scale','.5 .7 1');
        healthBox.setAttribute('color','#C19A6B');
        healthBox.setAttribute('src','assets/image/hardwood2_diffuse.jpg');
        healthBox.setAttribute('position','-5.2 7 -11');
        $('a-scene').appendChild(healthBox);
        for(i=1;i<=3;i++){
            let healthHeart = new document.createElement('a-entity');
            let finalpos=appendXYZwithSpaces(heartX,heartY,heartZ);
            healthHeart.setAttribute('position',finalpos);
            healthHeart.setAttribute('mixin','heart heartAnimate');
            healthHeart.setAttribute('id','heart'+String(i));
            healthHeart.setAttribute('class','ui clickable deletable');
            $$('healthBox').appendChild(healthHeart);
            heartX+=1.15;
        }
        healthText.setAttribute('class','ui clickable deletable');
        healthText.setAttribute('id','healthText');
        healthText.setAttribute('value','HEALTH');
        healthText.setAttribute('color','black');
        healthText.setAttribute('width','25');
        healthText.setAttribute('shader','msdf');
        healthText.setAttribute('mixin','font');
        healthText.setAttribute('position','-3.628 0.355 0.157');
        $$('healthBox').appendChild(healthText);
    }

    let loadScene=function(){
        let ground = new document.createElement('a-entity');
        //let sky = new document.createElement('a-sky');
        let needBucket = new document.createElement('a-entity');
        let wantBucket = new document.createElement('a-obj-model');
        let needsWantsSign = new document.createElement('a-entity');
        let gifBox= new document.createElement('a-entity');
        
        //buckets
        needBucket.setAttribute('id','needbucket');
        needBucket.setAttribute('class','needbucket deletable');
        needBucket.setAttribute('event_dragdrop2','');
        needBucket.setAttribute('droppable','');
        needBucket.setAttribute('static-body','');
        needBucket.setAttribute('collision-filter','collisionForces: false');
        needBucket.setAttribute('material','src:#nb; transparent:true; shader:gif');
        needBucket.setAttribute('geometry','primitive:box; height:1;width:1;depth:0.01');
        needBucket.setAttribute('mixin','alphaTrue');
        needBucket.setAttribute('scale','5 5 0');
        needBucket.setAttribute('position','-3.8 1 -10');
        $('a-scene').appendChild(needBucket);
        wantBucket.setAttribute('id','wantbucket');
        wantBucket.setAttribute('class','wantbucket deletable');
        wantBucket.setAttribute('event_dragdrop2','');
        wantBucket.setAttribute('droppable','');
        wantBucket.setAttribute('static-body','');
        wantBucket.setAttribute('collision-filter','collisionForces: false');
        wantBucket.setAttribute('material','src:#wb; transparent:true; shader:gif');
        wantBucket.setAttribute('geometry','primitive:box; height:1;width:1;depth:0.01');
        wantBucket.setAttribute('mixin','alphaTrue');
        wantBucket.setAttribute('scale','5 5 0');
        wantBucket.setAttribute('position','3.8 1 -10');
        $('a-scene').appendChild(wantBucket);
        
        //needswants sign
        needsWantsSign.setAttribute('id','NaWSign');
        needsWantsSign.setAttribute('class','deletable');
        needsWantsSign.setAttribute('material','src:#needsAndWantsSign; transparent:true; shader:gif');
        needsWantsSign.setAttribute('geometry','primitive:box; height:1;width:1;depth:0.01');
        needsWantsSign.setAttribute('mixin','alphaTrue');
        needsWantsSign.setAttribute('scale','2.5 2.5 0');
        needsWantsSign.setAttribute('position','0.034 0 -6.000');
        $('a-scene').appendChild(needsWantsSign);
    }

    let loadMenu=function(){
        console.log("Menu Loaded");
        let logo=document.createElement('a-image');
        let menuText=document.createElement('a-text');
        let startButton=document.createElement('a-entity');

        logo.setAttribute('class','startmenu');
        logo.setAttribute('id','IOL-logo');
        logo.setAttribute('material','src:#logo; transparent:true');
        logo.setAttribute('mixin','alphaTrue');
        logo.setAttribute('position','-0.033 -1.6 -6.524');
        logo.setAttribute('scale','1.5 1.5 0');

        menuText.setAttribute('class','startmenu');
        menuText.setAttribute('id','menuText');
        menuText.setAttribute('mixin','font alphaTrue textAlphaTrue');
        menuText.setAttribute('position','0.000 1.382 -5.000');
        menuText.setAttribute('scale','2.610 1.750 1.920');
        menuText.setAttribute('text','shader:msdf; value:Needs & Wants\n A Virtual Reality Game\n\n\nPresented by:; color:white; align:center');

        startButton.setAttribute('class','startmenu');
        startButton.setAttribute('id','startButton');
        startButton.setAttribute('geometry','primitive:box; width:3, height:0.65; depth:0.3')
        startButton.setAttribute('material','src:#le')
        startButton.setAttribute('mixin','font alphaTrue textAlphaTrue')
        startButton.setAttribute('position','0 0.948 -5')
        startButton.setAttribute('sound','src:assets/sounds/BG/Pop Echo.wav; volume:5; on:click;')
        startButton.setAttribute('startclicked','')
        startButton.setAttribute('text','zOffset:0.155; align:center; color:brown; value:START\n; width:12; baseline:bottom;')
        $('a-scene').appendChild(logo);
        $('a-scene').appendChild(menuText);
        $('a-scene').appendChild(startButton);

        
    }
    
}


const  game= new Game();


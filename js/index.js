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
                deleteByClass('deleteGif');
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
                deleteByClass('deleteGif');
            }

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
            deleteByClass('restartmenu');
            game.startGame();
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
            deleteByClass("restartmenu")
            game.mainMenu();
            
        })
    }
});

AFRAME.registerComponent('raycaster-listen', {
    dependencies: ['raycaster'],
    tick: function () {
        game.getRayIntersection();
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

let appendXYZwithSpaces = (x,y,z) =>{
    return String(x)+' '+String(y)+' '+String(z)
}

let roundToThousandths=(val)=>{
    return Math.floor(val*1000)/1000
}

let activateFadeIn=()=>{
    let fadeBox=$$('fadeBox');
    fadeBox.setAttribute('animation__fade','autoplay:true; dur:2000;loop:0; to:1.000; from:0.499;');
}

let activateFadeOut=()=>{
    let fadeBox=$$('fadeBox');
    fadeBox.setAttribute('animation__fade','autoplay:true; dur:2001;loop:0;from:1.000; to:0.499; ');
}

let deleteByClass = (classToBeDeleted) =>{
    let elements = $$$(classToBeDeleted);
        while(elements.length>0){
            elements[0].parentNode.removeChild(elements[0]);
        }
}

let deleteByID = (idToBeDeleted) =>{
    console.log(`${typeof idToBeDeleted}   ${idToBeDeleted}`);
    let deleteThis=$$(idToBeDeleted);
    deleteThis.parentNode.removeChild(deleteThis);
}



function createAnyEntity(entity, attributeAndValues){
    let attributes = Object.keys(attributeAndValues)
    let values = Object.values(attributeAndValues)

    for (let i=0; i < attributes.length; i++) {
        entity.setAttribute(attributes[i],values[i]);
    }
    $('a-scene').appendChild(entity);

}

function createEntityInsideEntity(parentEntity, entityToAdd,attributeAndValues){
    let attributes = Object.keys(attributeAndValues)
    let values = Object.values(attributeAndValues)

    for (let i=0; i < attributes.length; i++) {
        entityToAdd.setAttribute(attributes[i],values[i]);
    }
    $$(parentEntity).appendChild(entityToAdd);

}


function Game(){
    let score=0,run,lose,win,totalItems;
    let session={
        money:10000,
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
        session.money=10000;
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
            deleteByClass('startmenu');
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

        //object used for checking
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
            healthReducedBy1();
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

    this.removeentity=(evt,cond)=>{
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
    }

    this.getRayIntersection=function(){
        let mouseCursor=$$('mouseCursor');
        let intersection={
            x:0,
            y:0,
            z:0
        }
        if(mouseCursor.components.raycaster.intersections[0]!=="undefined"&&selected.entity!="en"){
            try {
                let x=roundToThousandths(mouseCursor.components.raycaster.intersections[0].point.x);
                let y=roundToThousandths(mouseCursor.components.raycaster.intersections[0].point.y)+2;
                let z=roundToThousandths(mouseCursor.components.raycaster.intersections[0].point.z);

                intersection.x=x;
                intersection.y=y;
                intersection.z=z;
                
                //console.log(`finalZ=${intersection.z}`)
//              console.log(mouseCursor.components.raycaster);

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
    


    let healthReducedBy1=function(){
        deleteByID("heart"+String(session.health));
        session.health-=1;
    }

    let gameOver=function(isWin){
        let storeAttributesAndValues;
        let sounds={
            fail:$$("gameOverFail").components.sound,
            win:$$("gameOverWin").components.sound,
            gameplayBackground:$$('gameStartBGM').components.sound
        }
        //delete objects when game is over
        deleteByClass('deletable');

        //display gameOver screen
        let restartButton=new document.createElement('a-entity');
        let mainMenuButton=new document.createElement('a-entity');

        let triviaBox=new document.createElement('a-entity');
        let finalScoreBox=new document.createElement('a-entity');
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
            storeAttributesAndValues={
                class:"restartmenu",
                id:"topText",
                mixin:"font alphaTrue textAlphaTrue",
                position:"0 2.8 -3.500",
                text:"align:center; value: Oh no! It seems that you have placed some items into the wrong container...; width:8; wrapCount:80"
            }
            createAnyEntity(topText,storeAttributesAndValues);
        }

        //Sign at the top of screen
        storeAttributesAndValues={
            class:"restartmenu",
            id:"gameOverState",
            geometry:"primitive:box; height:1;width:1;depth:0.01",
            mixin:"alphaTrue textAlphaTrue",
            position:"0.034 2.6 -2.500",
            scale:"2 2 0"
        }
        createAnyEntity(topSign,storeAttributesAndValues);

        //restart button
        storeAttributesAndValues={
            class:"clickable restartmenu",
            id:"restartbutton",
            geometry:"primitive:box; width:2; height:0.5; depth:0.3",
            material:"src:#le",
            mixin:"font alphaTrue textAlphaTrue",
            position:"0 0.600 -3.5",
            startclicked:"",
            text:"align:center; color:brown; value:TryAgain; width:5; zOffset:0.155; lineHeight:0; baseline:bottom;"
        }
        createAnyEntity(restartButton,storeAttributesAndValues);

        //return to main menu button
        storeAttributesAndValues={
            class:"clickable restartmenu",
            id:"mainmenubutton",
            geometry:"primitive:box; width:2; height:0.5; depth:0.3",
            material:"src:#le",
            mixin:"font alphaTrue textAlphaTrue",
            position:"0 0 -3.5",
            returntomainmenu:"",
            text:"align:center; color:brown; value:MainMenu; width:5; zOffset:0.155; lineHeight:0; baseline:bottom;"
        }
        createAnyEntity(mainMenuButton,storeAttributesAndValues);

        //trivia box
        storeAttributesAndValues={
            class:"restartmenu",
            id:"triviaBox",
            geometry:"primitive:box; width:3.000; height:1.520; depth:0.300",
            material:"src:#le",
            mixin:`fontTrivia ${trivias[rand].id} alphaTrue textAlphaTrue`,
            position:"-1.5 1.803 -3.5",
            text:"align:center; color:black; width:2.800; yOffset:40; zOffset:0.155; lineHeight:60"
        }
        createAnyEntity(triviaBox,storeAttributesAndValues);

        //score box
        storeAttributesAndValues={
            class:"restartmenu",
            id:"finalScoreBox",
            geometry:"primitive:box; width:3.000; height:1.520; depth:0.300",
            material:"src:#le",
            mixin:`font alphaTrue textAlphaTrue`,
            position:"1.5 1.803 -3.5",
            text:`align:center; value:TotalScore: ${session.score}; color:black; width:5.000; yOffset:40; zOffset:0.155; lineHeight:100`
        }
        createAnyEntity(finalScoreBox,storeAttributesAndValues);
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
        let storeAttributesAndValues;

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
        //SCORE BOX
        storeAttributesAndValues={
            class:"ui clickable deletable",
            id:"scoreBox",
            geometry:"width:7.500; height:1.5; depth:0.3",
            mixin:"alphaTrue",
            material:"src:assets/image/hardwood2_diffuse.jpg; color:#C19A6B; ",
            position:"5.192 7 -11",
            scale:"0.5 0.7 1",
        }
        createAnyEntity(scoreBox,storeAttributesAndValues);
            //put score text inside score box
            storeAttributesAndValues={
                class:"ui clickable deletable",
                id:"scoreText",
                mixin:'font textAlphaTrue',
                position:"-3.606 0.355 0.153",
                text:"width:25; value: SCORE; color: black;"
            }
            createEntityInsideEntity('scoreBox',scoreText,storeAttributesAndValues);
            //put score value inside score box
            storeAttributesAndValues={
                class:"ui clickable deletable",
                id:"scoreValue",
                mixin:'font textAlphaTrue',
                position:"1.723 0.355 0.153",
                text:"width:25; value: 0; color: white;"
            }
            createEntityInsideEntity('scoreBox',scoreValue,storeAttributesAndValues);


        //HEALTH BOX
        storeAttributesAndValues={
            class:"ui clickable deletable",
            id:"healthBox",
            geometry:"width:7.500; height:1.5; depth:0.3",
            material:"src:assets/image/hardwood2_diffuse.jpg; color:#C19A6B; ",
            position:"-5.2 7 -11",
            scale:"0.5 0.7 1",
        }
        createAnyEntity(healthBox,storeAttributesAndValues);
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
        storeAttributesAndValues={
            class:"ui clickable deletable",
            id:"healthText",
            mixin:'font textAlphaTrue',
            position:"-3.628 0.355 0.157",
            text:"value:HEALTH; color:black; width:25;  position: -3.628 0.355 0.157"
        }
        createEntityInsideEntity('healthBox',healthText,storeAttributesAndValues);
    }

    let loadScene=function(){
        let needBucket = new document.createElement('a-entity');
        let wantBucket = new document.createElement('a-obj-model');
        let needsWantsSign = new document.createElement('a-entity');
        let storeAttributesAndValues;
        
        //create Needs Bucket
        storeAttributesAndValues={
            class:"needbucket deletable",
            id:"needbucket",
            event_dragdrop2:"",
            droppable:"",
            "static-body":"",
            "collision-filter":"collisionForces:false",
            material:"src:#nb; transparent:true; shader:gif",
            geometry:"primitive:box; height:1;width:1;depth:0.01",
            mixin:"alphaTrue",
            position:"-3.8 1 -10",
            scale:"5 5 0"
        }
        createAnyEntity(needBucket,storeAttributesAndValues);  

        //create Wants Bucket
        storeAttributesAndValues={
            class:"wantbucket deletable",
            id:"wantbucket",
            event_dragdrop2:"",
            droppable:"",
            "static-body":"",
            "collision-filter":"collisionForces:false",
            material:"src:#wb; transparent:true; shader:gif",
            geometry:"primitive:box; height:1;width:1;depth:0.01",
            mixin:"alphaTrue",
            position:"3.8 1 -10",
            scale:"5 5 0"
        }
        createAnyEntity(wantBucket,storeAttributesAndValues);  
       
        //create needs and wants sign
        storeAttributesAndValues={
            class:"deletable",
            id:"NaWSign",
            material:"src:#needsAndWantsSign; transparent:true; shader:gif",
            geometry:"primitive:box; height:1;width:1;depth:0.01",
            mixin:"alphaTrue",
            position:"0.034 0 -6.000",
            scale:"2.5 2.5 0"
        }
        createAnyEntity(needsWantsSign,storeAttributesAndValues);  
    }

    let loadMenu=function(){
        console.log("Menu Loaded");
        let logo=document.createElement('a-image');
        let menuText=document.createElement('a-text');
        let startButton=document.createElement('a-entity');
        let storeAttributesAndValues;

        //create menu logo
        storeAttributesAndValues={
            class:"startmenu",
            id:"IOL-logo",
            material:"src:#logo; transparent:true",
            mixin:"alphaTrue",
            position:"-0.033 -1.6 -6.524",
            scale:"1.5 1.5 0"
        }
        createAnyEntity(logo,storeAttributesAndValues);
        
        //create menu text
        storeAttributesAndValues={
            class:"startmenu",
            id:"menuText",
            mixin:"font alphaTrue textAlphaTrue",
            position:"0.000 1.382 -5.000",
            scale:"2.610 1.750 1.920",
            text:"value:Needs & Wants\n A Virtual Reality Game\n\n\nPresented by:; color:white; align:center"
        }
        createAnyEntity(menuText,storeAttributesAndValues);            
        
        //create start button
        storeAttributesAndValues={
            class:"startmenu",
            id:"startbutton",
            geometry:"primitive:box; width:3, height:0.65; depth:0.3",
            material:"src:#le",
            mixin:"font alphaTrue textAlphaTrue",
            position:"0 0.948 -5",
            sound:"src:assets/sounds/BG/Pop Echo.wav; volume:5; on:click;",
            startclicked:"",
            text:"zOffset:0.155; align:center; color:brown; value:START\n; width:12; baseline:bottom;"
        }
        createAnyEntity(startButton,storeAttributesAndValues);            

        $('a-scene').appendChild(logo);
    }
    
}

const  game= new Game();


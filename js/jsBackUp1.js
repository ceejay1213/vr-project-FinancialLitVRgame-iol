//color randomizer
$ = (queryString)=> document.querySelector(queryString);
let ready =false;
let removeme=false;
let clickedEntity;
let clicked=false;

function Game(){
    let score=0,run,health=3,lose,win,totalItems;
    
    this.startGame=function(){
        loadUI();
        loadScene();
        loadMenu();
        this.createentityHard();
    }

    this.colorrandomizer=(evt)=>{
        evt.detail.dropped.setAttribute(
            "material",
            "color",
            "#" + ((Math.random() * 0xffffff) << 0).toString(16)
        );
        evt.detail.dropped.emit('grabbed','')
        // color randomizer credit: http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript#comment6801353_5365036
    }

    this.checkIfCorrect=function(evt){
        let scoreDISPLAY=document.getElementById("scoreValue");
        let entityClassNeeds=evt.detail.dropped.className=="needs";
        let bucketClassNeeds=evt.target.className=="needbucket";
        let entityClassWants=evt.detail.dropped.className=="wants";
        let bucketClassWants=evt.target.className=="wantbucket";

        if(entityClassNeeds && bucketClassNeeds || entityClassWants && bucketClassWants){
            //correct
            score+=1;
            scoreDISPLAY.setAttribute('value',String(score));
        }
        else if(entityClassNeeds && bucketClassWants ||  entityClassWants && bucketClassNeeds){
            damaged();
            scoreDISPLAY.setAttribute('value','wrong');
        //alert('wrong');
        }
    }

    this.removeentity=(evt,cond)=>{
        if(cond){
            evt.detail.dropped.parentNode.removeChild(evt.detail.dropped);
        }else{
            evt.parentNode.removeChild(evt);
            //evt.detail.
        }
    }

    this.hoverupdown=(evt)=>{
        let obj;
        evt.el.addEventListener("mousedown", 
            function(e) {
                e.toElement.removeAttribute('static-body');
                e.toElement.setAttribute('dynamic-body','shape:auto');
                // color randomizer credit: http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript#comment6801353_5365036
                console.log(e)
                console.log(e.toElement.className)
            }
        );
        evt.el.addEventListener("mouseup", 
            function(e) {
                e.toElement.removeAttribute('dynamic-body');
                e.toElement.setAttribute('static-body','shape:auto');
                // color randomizer credit: http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript#comment6801353_5365036
                console.log(escape)
            }
        );
    }
  
    


    this.createentityHard=function(){
        let models=[
            'strawberryneeds',
            'watersneeds',
            'banananeeds',
            'phoneneeds',
            'pillsneeds',
            'cornneeds',
            'eggplantneeds',
            'lightbulbneeds',
            'shoesneeds',

            'burgerwants',
            'jacketwants',
            'ringwants',
            'icecreamwants',
            'carwants',
            'pearlnecklaceneeds',
            'sodawants',
            'pizzawants',
        ]
        let j=0; //for getting position values
        setTimeout(function(){
            for (i = 0; i < 17; i++) {
                
                let entity = new document.createElement('a-entity');
                document.querySelector('a-scene').appendChild(entity);
                
                entity.setAttribute('mixin',models[i]+' interactibfull');
                setEntityClass(entity,i,models);
                setEntityAnimationPosition(entity,j);
                setEntityMixins(entity,i,models);
                setEntityExtraProperties(entity);
                //navigate through positionObjectArray
                j+=3;
              
            }
        },5000);
        
    }

    let setEntityClass = (entity,i,models) => {
        if(models[i].includes('needs')){
            entity.setAttribute('class','needs')
        }else{
            entity.setAttribute('class','wants')
        }
    }
    
    let setEntityAnimationPosition =(entity,j) => {
        let positions={//for later use in animations
            x1:6.8,   y1:1,  z1:-6.5, 
            x2:10,    y2:1,  z2:-4.8, 
            x3:11.5,  y3:1,  z3:-2.3,
            x4:12,    y4:1,  z4:0.120, 
            x5:12,    y5:1,  z5:2.5, 
            x6:11,    y6:1,  z6:4.9, 
            x7:10,    y7:1,  z7:7, 
            x8:8.5,   y8:1,  z8:9, 
            x9:6.5,   y9:1,  z9:11, 
           x10:3.5,   y10:1, z10:12,
           x11:-6.8,  y11:1, z11:-6.5, 
           x12:-10,   y12:1, z12:-4.8, 
           x13:-11.5, y13:1, z13:-2.3, 
           x14:-12,   y14:1, z14:0.120, 
           x15:-12,   y15:1, z15:2.5, 
           x16:-11,   y16:1, z16:4.9, 
           x17:-10,   y17:1, z17:7, 
           x18:-8.5,  y18:1, z18:9,
           x19:-6.5,  y19:1, z19:11, 
           x20:-3.5,  y20:1, z20:12,

       }
        let objectKeys=Object.values(positions);//getarray of Values

        let x=objectKeys[j];
        let y=objectKeys[j+1];
        let z=objectKeys[j+2];

        let finalpos=appendXYZwithSpaces(x,y,z);

        j+=3;
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
    }
    
    let setEntityMixins = (entity,i,models) => {
        entity.setAttribute('mixin',models[i]+' interactibfull');
    }

    let setEntityExtraProperties = (entity) => {
        entity.setAttribute('stop-animation','');
        entity.setAttribute('removeme','');
    }
    



    let appendXYZwithSpaces = (x,y,z) =>{
        return String(x)+' '+String(y)+' '+String(z)
    }
    
    let damaged=function(){
        //$('a-scene').appendChild(scoreText);
        let heartElement=document.getElementById('heart'+String(health));
        heartElement.parentNode.removeChild(heartElement);
        health-=1;
        if(health<1){
            removeme=true;
        }
    }

    let gameOver=function(){
        //show results
    }




    let loadUI=function(){
        //SCORE
        let scoreText = new document.createElement('a-text');
        let scoreValue = new document.createElement('a-text');
        let scoreBox = new document.createElement('a-box');
        //HEALTH
        let heartX=-6.05;
        let heartY=7.05;
        let heartZ=-10.607;
        let healthBox = new document.createElement('a-box');
        let healthText= new document.createElement('a-text');
        //SCORE
        scoreText.setAttribute('id','scoreText');
        scoreText.setAttribute('class','ui');
        scoreText.setAttribute('value','SCORE: ');
        scoreText.setAttribute('scale','3 3 3');
        scoreText.setAttribute('position','3 7.1 -10.809');
        $('a-scene').appendChild(scoreText);
        scoreValue.setAttribute('id','scoreValue');
        scoreValue.setAttribute('class','ui');
        scoreValue.setAttribute('value','0');
        healthText.setAttribute('scale','1 1.5 1');
        scoreValue.setAttribute('width','15');
        scoreValue.setAttribute('color','white');
        scoreValue.setAttribute('position','7 7.1 -10.809');
        $('a-scene').appendChild(scoreValue);
        scoreBox.setAttribute('id','scoreBox');
        scoreBox.setAttribute('class','ui');
        scoreBox.setAttribute('color','#C19A6B');
        scoreBox.setAttribute('depth','0.1');
        scoreBox.setAttribute('height','0.5');
        scoreBox.setAttribute('width','2.5');
        scoreBox.setAttribute('scale','3 3 3');
        scoreBox.setAttribute('src','assets/image/wood.jpeg');
        scoreBox.setAttribute('position','6 7 -11');
        $('a-scene').appendChild(scoreBox);

        //HEALTH
        healthBox.setAttribute('class','ui');
        healthBox.setAttribute('depth','0.1');
        healthBox.setAttribute('width','2');
        healthBox.setAttribute('height','0.5');
        healthBox.setAttribute('scale','3 3 3');
        healthBox.setAttribute('color','#C19A6B');
        healthBox.setAttribute('src','assets/image/wood.jpeg');
        healthBox.setAttribute('position','-6 7 -11');
        $('a-scene').appendChild(healthBox);
        for(i=1;i<=3;i++){
            let healthHeart = new document.createElement('a-entity');
            let finalpos=appendXYZwithSpaces(heartX,heartY,heartZ);
            healthHeart.setAttribute('position',finalpos);
            healthHeart.setAttribute('mixin','heart heartAnimate');
            healthHeart.setAttribute('id','heart'+String(i));
            healthHeart.setAttribute('class','ui');
            $('a-scene').appendChild(healthHeart);
            heartX+=1.2;
        }
        healthText.setAttribute('class','ui');
        healthText.setAttribute('id','healthText');
        healthText.setAttribute('value','HEALTH');
        healthText.setAttribute('width','12');
        healthText.setAttribute('scale','1 1.5 1');
        healthText.setAttribute('position','-8.979 7.1 -10.809');
        $('a-scene').appendChild(healthText);
    }

    let loadScene=function(){
        let ground = new document.createElement('a-entity');
        let sky = new document.createElement('a-sky');
        let needBucket = new document.createElement('a-obj-model');
        let wantBucket = new document.createElement('a-obj-model');
        let signCylinder = new document.createElement('a-cylinder');
        let signBox = new document.createElement('a-box');
        let signText = new document.createElement('a-text');

        //ground
        ground.setAttribute('id','ground');
        ground.setAttribute('type','background');
        ground.setAttribute('geometry','primitive: cylinder; radius: 30; height: 0.1');
        ground.setAttribute('position','0 0 0');
        ground.setAttribute('material','shader: flat; color: #424949');
        ground.setAttribute('static-body','');
        ground.setAttribute('cursor','fuse:false')
        $('a-scene').appendChild(ground);

        //sky
        sky.setAttribute('src','#skyTexture');
        sky.setAttribute('theta-length','90');
        sky.setAttribute('radius','30');
        $('a-scene').appendChild(sky);
        
        //buckets
        needBucket.setAttribute('id','needbucket');
        needBucket.setAttribute('class','needbucket');
        needBucket.setAttribute('collision-filter','collisionForces: false');
        needBucket.setAttribute('event_dragdrop','');
        needBucket.setAttribute('droppable','');
        needBucket.setAttribute('static-body','');
        needBucket.setAttribute('src','#bucket-obj');
        needBucket.setAttribute('mtl','#bucket-mtl');
        needBucket.setAttribute('scale','1 0.5 -2');
        needBucket.setAttribute('position','-2.5 0.650 -10');
        $('a-scene').appendChild(needBucket);
        wantBucket.setAttribute('id','wantbucket');
        wantBucket.setAttribute('class','wantbucket');
        wantBucket.setAttribute('collision-filter','collisionForces: false');
        wantBucket.setAttribute('event_dragdrop','');
        wantBucket.setAttribute('droppable','');
        wantBucket.setAttribute('static-body','');
        wantBucket.setAttribute('src','#bucket-obj');
        wantBucket.setAttribute('mtl','#bucket-mtl');
        wantBucket.setAttribute('scale','1 0.5 -2');
        wantBucket.setAttribute('position','2.5 0.600 -10');
        $('a-scene').appendChild(wantBucket);
        
        //needswants sign
        signCylinder.setAttribute('position','0.034 0.500 -6.000');
        signCylinder.setAttribute('rotation','0 0 0');
        signCylinder.setAttribute('depth','0.1');
        signCylinder.setAttribute('height','1');
        signCylinder.setAttribute('radius','0.1');
        signCylinder.setAttribute('color','#C19A6B');
        $('a-scene').appendChild(signCylinder);
        signBox.setAttribute('color','#C19A6B');
        signBox.setAttribute('position','0.110 0.500 -6.000');
        signBox.setAttribute('depth','0.1');
        signBox.setAttribute('height','0.5');
        signBox.setAttribute('width','2');
        signBox.setAttribute('scale','1.490 1.000 1.000');
        $('a-scene').appendChild(signBox);
        signText.setAttribute('value','NEEDS        WANTS');
        signText.setAttribute('position','-1.093 0.500 -5.921');
        signText.setAttribute('width','6');
        signText.setAttribute('color','black');
        $('a-scene').appendChild(signText);
    }

    let loadMenu=function(){
        console.log("Menu Loaded")
    }

    /*
    this.damaged=function(){
        subtract health
    }

    this.gameover(){
        if(health==0){
            delete entity show gameover screen
        }
    }

    this.renderUI(){
    }

    this.renerMenu(){
    }
    */
}

const  game= new Game();
/*setTimeout(function(){
    game.startGame();
},5000)*/
//game.createentityHard();

AFRAME.registerComponent("color-randomizer", {
    play:function(){     
        this.el.addEventListener("drag-drop", evt => {
            game.colorrandomizer(evt)
        })
    }
});
// forward mouse and touch events to the super-hands entity

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

AFRAME.registerComponent("event_dragdrop", {
    play: function() {
        this.el.addEventListener("drag-drop", function(evt) {
            console.log(evt)
             game.checkIfCorrect(evt);
             game.removeentity(evt,true);
        });
    }
});

AFRAME.registerComponent("stop-animation", {
    play: function() {
         game.hoverupdown(this);
    }
});

AFRAME.registerComponent("selectedornot", {
    init: function() {
        let obj;
        this.el.addEventListener("mousedown", e => {
            e.toElement.removeAttribute('static-body');
            e.toElement.setAttribute('dynamic-body','shape:auto');
            // color randomizer credit: http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript#comment6801353_5365036
            console.log(e)
            console.log(e.toElement.className);
        });
        this.el.addEventListener("mouseup", e => {
            e.toElement.removeAttribute('dynamic-body');
            e.toElement.setAttribute('static-body','shape:auto');
            // color randomizer credit: http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript#comment6801353_5365036
            console.log(e);
        });
    }
});

//gaze controls
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

AFRAME.registerComponent('sceneloaded', {
    init: function () {
        if(!ready){
            ready=true;
            //game.startGame();
        }
        /*this.el.addEventListener('body-loaded',function(){
            console.log("Game Starting...")
            game.startGame();
        })*/

        /*
        schema: {type: 'string'},
        init: function () {
        if(!ready){
            ready=true;
            game.startGame();
            var stringToLog = this.data;
            stringToLog
            console.log(stringToLog);
        }
        */
    }
  });

AFRAME.registerComponent('startclicked', {
init: function () {
    this.el.addEventListener('click',
        function(evt){
            console.log(this)
            game.startGame();
            game.removeentity(this,false)
    });
    /*this.el.addEventListener('body-loaded',function(){
        console.log("Game Starting...")
        game.startGame();
    })*/
}
});

AFRAME.registerComponent('removeme', {
    tick: function () {
        console.log(this)
        if(removeme)
            game.removeentity(this,false)
        /*this.el.addEventListener('body-loaded',function(){
            console.log("Game Starting...")
            game.startGame();
        })*/
    }
    });

/* removing Elements by Classname
function removeElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}
*/

/* remove By class or as a whole
function removeElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}
*/

//gaze controls
/*
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
*/

//function for start

//function for

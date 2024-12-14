// setup
window.onload = function () {
    let config = {
        renderer: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 },
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    let game = new Phaser.Game(config);
    window.focus();
}

// tästä alkaa tapahtumat pelin aikana

// lataa peliss� k�ytett�v�t grafiikat
function preload() {

        this.load.image('background', './assets/background.png');
    	this.load.image('lintu', './assets/lintu.png');
        this.load.image('putki', './assets/putki.png');
        this.load.image('maa', './assets/maa.png');

    }

let lintu;
let cursors;
let topColumns;
let bottomColumns;
let road;
let roads;

let hasLanded = false;
let hasBumped = false;
let isGameStarted = false;
let isGameEnded = false;

let viesti;
let pisteTeksti;
let Pisteet = 0;

function create() {

        cursors = this.input.keyboard.createCursorKeys();
        const background = this.add.image(0, 0, 'background').setOrigin(0, 0);

        // tehdään array jossa 1000 satunnaisia numeroita joista saataisiin putkien korkeus
        const numerot = [];
        for(let i = 0; i < 100; i++){
            numerot.push(Phaser.Math.Between(-150,50));
        }
        // luodaan putki esteitä 1000
   	    topColumns = this.physics.add.group({
    		key: 'putki',
            immovable: true,
            allowGravity: false,
    		repeat: numerot.length,
            // jos saisin jotenkin valittua satunnaisen luvun numerot listasta saataisiin putkille vaihtelevat korkeudet, nyt niillä kaikilla on sama korkeus
    		setXY: { x: 400, y: numerot[0], stepX: 300, }
    	});
    	bottomColumns = this.physics.add.group({
    		key: 'putki',
            immovable: true,
            allowGravity: false,
    		repeat: numerot.length,
    		setXY: { x: 400, y: numerot[0] + 650, stepX: 300, },
        });
        
        // luodaan kentälle pohja
        roads = this.physics.add.staticGroup();
        road = roads.create(400, 568, 'maa').setScale(2).refreshBody();
        // luodaan lintu
        lintu = this.physics.add.sprite(100, 250, 'lintu').setScale(0.15);
        lintu.setBounce(0.2);
        lintu.setCollideWorldBounds(true);
        // linnun törmäykset maahan ja putkiin jotka lopettavat pelin
        this.physics.add.overlap(lintu, road, () => hasLanded = true, null, this);
        this.physics.add.collider(lintu, road);
      
        this.physics.add.overlap(lintu, topColumns, ()=>hasBumped=true,null, this);
        this.physics.add.overlap(lintu, bottomColumns, ()=>hasBumped=true,null, this);
        this.physics.add.collider(lintu, topColumns);
        this.physics.add.collider(lintu, bottomColumns);

        // ohjeet ja pisteet
        viesti = this.add.text(0, 0, 'Ohjeet: Paina välilyöntiä aloittaaksesi pelin', { fontFamily: '"Comic Sans MS", Times, serif', fontSize: "20px", color: "white", backgroundColor: "black" });
        Phaser.Display.Align.In.BottomCenter(viesti, background, -10, 80);
        pisteTeksti = this.add.text(0, 0, 'Pisteet: ' + Pisteet, { fontFamily: '"Comic Sans MS", Times, serif', fontSize: "20px", color: "white", backgroundColor: "black" });
        Phaser.Display.Align.In.BottomCenter(pisteTeksti, background, 0, 50);
    
    }
        
    
function update() {
    // peli alkaa kun painetaan välilyöntiä
    if (cursors.space.isDown && !isGameStarted) {
        isGameStarted = true;
        viesti.text = 'Ohjeet: Ohjaa linnun lentoa välilyönnillä';
    }
    // lintu on alussa paikoillaan
    if(!isGameStarted) {
        lintu.setVelocityY(0);
        lintu.setVelocityX(0);
    }
    // lintu alkaa putota kun peli alkaa
    if (cursors.space.isDown && !hasLanded && !hasBumped) {
        lintu.setVelocityY(-150);
    }
    // este putket liikkuvat kun peli on käynnissä
    if (isGameStarted && !hasLanded && !hasBumped) {
        topColumns.setVelocityX(-100);
        bottomColumns.setVelocityX(-100);
    }
    // peli loppuu kun lintu osuu johonkin
    else {
        topColumns.setVelocityX(0);
        bottomColumns.setVelocityX(-0);
        isGameEnded = true;
        viesti.text = 'Peli loppu. Päivitä sivu aloittaaksesi uudestaan';
    }

    // jos lintu on menny ohi esteestä lisätään piste
    if (isGameStarted && isGameEnded){
        bottomColumns.getChildren().forEach(function(putki){
           if (putki.x > 99 && putki.x < 101 ){
            Pisteet = Pisteet + 1;
            pisteTeksti.text = 'Pisteet: ' + Pisteet;
           } 
        }, this)
    }

}


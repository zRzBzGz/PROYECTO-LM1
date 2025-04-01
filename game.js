/* global Phaser */

const config = {
  type: Phaser.AUTO,
  width: 500,
  height: 500,
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: { 
      gravity: { y: 400 }, // Corregido
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

new Phaser.Game(config);

function preload() {
  this.load.image('background', './oak_woods_v1.0/background/background_layer_1.png');

  this.load.spritesheet(
    'suelo',
    './LEGACY/Assets/Hive.png',
    { frameWidth: 80, frameHeight: 64 }
  );

  this.load.spritesheet(
    'hero',
    './oak_woods_v1.0/character/char_blue.png',
    { frameWidth: 56, frameHeight: 56 }
  );
}

function create() {
  // Fondo
  this.add.image(0, 0, 'background')
    .setOrigin(0, 0)
    .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

  // Grupo de suelo con colisión
  this.floor = this.physics.add.staticGroup();

  for (let i = 0; i < 7; i++) {
    this.floor.create(i * 80, 500, 'suelo')
      .setOrigin(0, 1)
      .setScale(1);
  }

  // Agrega el personaje con físicas
  this.hero = this.physics.add.sprite(100, 350, 'hero')
    .setOrigin(0, 1)
    .setScale(1.5);

  // Colisión entre el héroe y el suelo
  this.physics.add.collider(this.hero, this.floor);

  // Crear animaciones
  this.anims.create({
    key: 'hero-walk',
    frames: this.anims.generateFrameNumbers('hero', { start: 17, end: 23 }),
    frameRate: 18,
    repeat: -1
  });

  this.anims.create({
    key: 'hero-idle',
    frames: [{ key: 'hero', frame: 0 }]
  });

  this.anims.create({
    key: 'hero-jump',
    frames: this.anims.generateFrameNumbers('hero', { start: 24, end: 37 }),
    frameRate: 11,
    repeat: 0
  });

  // Controles del teclado
  this.keys = this.input.keyboard.createCursorKeys();

  // Configurar la cámara para seguir al héroe
  this.cameras.main.startFollow(this.hero, true, 0.1, 0.1);  // Suaviza el movimiento de la cámara
  this.cameras.main.setBounds(0, 0, 2000, 500);  // Establece los límites de la cámara
}

function update() {
  let isOnGround = this.hero.body.blocked.down;

  // Movimiento lateral
  if (this.keys.left.isDown) {
    this.hero.setVelocityX(-160);
    // Solo cambiar la animación a caminar si está en el suelo
    if (isOnGround) {
      this.hero.anims.play('hero-walk', true);
    }
    this.hero.setFlipX(true); // Voltear el sprite hacia la izquierda
  } else if (this.keys.right.isDown) {
    this.hero.setVelocityX(160);
    // Solo cambiar la animación a caminar si está en el suelo
    if (isOnGround) {
      this.hero.anims.play('hero-walk', true);
    }
    this.hero.setFlipX(false); // Mantener orientación normal
  } else {
    this.hero.setVelocityX(0);
    if (isOnGround) {
      this.hero.anims.play('hero-idle', true);
    }
  }

  // Salto
  if (this.keys.up.isDown && isOnGround) {
    this.hero.setVelocityY(-300); // Ajusta la fuerza del salto
    this.hero.anims.play('hero-jump', true);
  }

  // Si está en el aire pero no presiona salto, mantener animación de salto
  if (!isOnGround) {
    // Mantener animación de salto si no la está reproduciendo
    if (!this.hero.anims.isPlaying || this.hero.anims.currentAnim.key !== 'hero-jump') {
      this.hero.anims.play('hero-jump', true);
    }
  }
}

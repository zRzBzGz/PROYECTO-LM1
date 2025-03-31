/* global Phaser */

const config = {
  type: Phaser.AUTO,
  width: 500,
  height: 500,
  parent: 'game',
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

  // Agrega los bloques de suelo en una sola línea
  for (let i = 0; i < 7; i++) {
    this.add.sprite(i * 80, 500, 'suelo')
      .setOrigin(0, 1)
      .setScale(1);
  }

  // Agrega el personaje
  this.hero = this.add.sprite(100, 450, 'hero')
    .setOrigin(0, 1)
    .setScale(1);

  // Crear animaciones
  this.anims.create({
    key: 'hero-walk',
    frames: this.anims.generateFrameNumbers('hero', { start: 17, end: 23 }),
    frameRate: 10,
    repeat: -1
  });

  // Controles del teclado
  this.keys = this.input.keyboard.createCursorKeys();
}

function update() {
  if (this.keys.left.isDown) {
    this.hero.x -= 2;
    this.hero.anims.play('hero-walk', true);
    this.hero.setFlipX(true); // Voltear el sprite hacia la izquierda
  } else if (this.keys.right.isDown) {
    this.hero.x += 2;
    this.hero.anims.play('hero-walk', true);
    this.hero.setFlipX(false); // Mantener orientación normal
  } else {
    this.hero.anims.stop();
  }
}

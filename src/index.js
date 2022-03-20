// Babel polyfill
import 'core-js/stable';
import 'regenerator-runtime/runtime'

import React from 'react';
import ReactDOM from 'react-dom';

import Controls from './Controls';

const CARD_WIDTH = 512;
const CARD_HEIGHT = 375;

class CardCreator {
  constructor(master, category, title = 'No title', detail = 'No details') {
    this.master = master;
    this.canvas = document.createElement('canvas');
    this.canvas.style.display = 'block';
    this.canvas.width = CARD_WIDTH;
    this.canvas.height = CARD_HEIGHT;
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);
    this.category = category;
    this.title = title;
    this.detail = detail;
  }

  redraw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Draw background
    if (this.master.background) {
      this.ctx.drawImage(this.master.background, 0, 0);
    } else {
      this.ctx.fillStyle = 'red';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Draw category
    this.ctx.fillStyle = this.master.categoryStyle.fillStyle;
    this.ctx.font = `${this.master.categoryStyle.fontSize} ${this.master.categoryStyle.font}`;
    let metrics = this.ctx.measureText(this.category);
    let top = this.master.categoryStyle.y - Math.abs(metrics.fontBoundingBoxAscent);
    let bottom = this.master.categoryStyle.y + Math.abs(metrics.fontBoundingBoxDescent);
    let width = metrics.width;
    if (top < 0) {
      console.log('Top above card top');
    }
    if (bottom > this.canvas.height) {
      console.log('Bottom below card bottom');
    }
    if (this.master.categoryStyle.x < 0) {
      console.log('Left outside card bounds');
    }
    if (this.master.categoryStyle.y + width > this.canvas.width) {
      console.log('Right outside card bounds');
    }
    this.ctx.fillText(this.category, this.master.categoryStyle.x, this.master.categoryStyle.y);

    // Draw title
    this.ctx.fillStyle = this.master.titleStyle.fillStyle;
    this.ctx.font = `${this.master.titleStyle.fontSize} ${this.master.titleStyle.font}`;
    metrics = this.ctx.measureText(this.title);
    top = this.master.titleStyle.y - Math.abs(metrics.fontBoundingBoxAscent);
    bottom = this.master.titleStyle.y + Math.abs(metrics.fontBoundingBoxDescent);
    width = metrics.width;
    if (top < 0) {
      console.log('Top above card top');
    }
    if (bottom > this.canvas.height) {
      console.log('Bottom below card bottom');
    }
    if (this.master.titleStyle.x < 0) {
      console.log('Left outside card bounds');
    }
    if (this.master.titleStyle.y + width > this.canvas.width) {
      console.log('Right outside card bounds');
    }
    this.ctx.fillText(this.title, this.master.titleStyle.x, this.master.titleStyle.y);

    // Draw detail
    this.ctx.fillStyle = this.master.detailStyle.fillStyle;
    this.ctx.font = `${this.master.detailStyle.fontSize} ${this.master.detailStyle.font}`;
    metrics = this.ctx.measureText(this.detail);
    top = this.master.detailStyle.y - Math.abs(metrics.fontBoundingBoxAscent);
    bottom = this.master.detailStyle.y + Math.abs(metrics.fontBoundingBoxDescent);
    width = metrics.width;
    if (top < 0) {
      console.log('Top above card top');
    }
    if (bottom > this.canvas.height) {
      console.log('Bottom below card bottom');
    }
    if (this.master.detailStyle.x < 0) {
      console.log('Left outside card bounds');
    }
    if (this.master.detailStyle.y + width > this.canvas.width) {
      console.log('Right outside card bounds');
    }
    this.ctx.fillText(this.detail, this.master.detailStyle.x, this.master.detailStyle.y);
  }

  async toPNG() {
    return new Promise((resolve, reject) => {
      this.canvas.toBlob(async (blob) => {
        try {
          const bytes = await blob.arrayBuffer();
          resolve(bytes);
        } catch (e) {
          reject(e);
        }
      });
    });
  }
}

class MasterCreator {
  constructor() {
    this.categoryStyle = {
      fillStyle: 'black',
      font: 'serif',
      fontSize: '110px',
      x: 39,
      y: 83,
    };
    this.titleStyle = {
      fillStyle: 'black',
      font: 'serif',
      fontSize: '30px',
      x: 130,
      y: 150,
    };
    this.detailStyle = {
      fillStyle: 'black',
      font: 'serif',
      fontSize: '25px',
      x: 130,
      y: 227,
    };
    this.cards = [];
    for (let i = 0; i < 19; i++) {
      this.cards.push(new CardCreator(this, 'Relationship'));
    }
    for (let i = 0; i < 13; i++) {
      this.cards.push(new CardCreator(this, 'Need'));
    }
    for (let i = 0; i < 9; i++) {
      this.cards.push(new CardCreator(this, 'Location'));
    }
    for (let i = 0; i < 9; i++) {
      this.cards.push(new CardCreator(this, 'Object'));
    }
  }

  setBackground(background) {
    this.background = background;
    this.redraw();
  }

  setCategoryX(x) {
    this.categoryStyle.x = x;
    this.redraw();
  }

  setCategoryY(y) {
    this.categoryStyle.y = y;
    this.redraw();
  }

  setCategoryFontSize(size) {
    this.categoryStyle.fontSize = size;
    this.redraw();
  }

  async setCategoryFont(font) {
    this.categoryStyle.font = font;
    return new Promise((resolve) => {
      // Unfortunately this takes "a while" to load and doesn't really
      // tell us when it's done, so the font won't update until some
      // time later.
      setTimeout(() => {
        this.categoryStyle.x += 1;
        this.cards[0].redraw();
      }, 1000);
      setTimeout(() => {
        this.categoryStyle.x -= 1;
        this.redraw();
        resolve();
      }, 2000);
    });
  }

  setTitleX(x) {
    this.titleStyle.x = x;
    this.redraw();
  }

  setTitleY(y) {
    this.titleStyle.y = y;
    this.redraw();
  }

  setTitleFontSize(size) {
    this.titleStyle.fontSize = size;
    this.redraw();
  }

  async setTitleFont(font) {
    this.titleStyle.font = font;
    return new Promise((resolve) => {
      // Unfortunately this takes "a while" to load and doesn't really
      // tell us when it's done, so the font won't update until some
      // time later.
      setTimeout(() => {
        this.titleStyle.x += 1;
        this.cards[0].redraw();
      }, 1000);
      setTimeout(() => {
        this.titleStyle.x -= 1;
        this.redraw();
        resolve();
      }, 2000);
    });
  }

  setDetailX(x) {
    this.detailStyle.x = x;
    this.redraw();
  }

  setDetailY(y) {
    this.detailStyle.y = y;
    this.redraw();
  }

  setDetailFontSize(size) {
    this.detailStyle.fontSize = size;
    this.redraw();
  }

  async setDetailFont(font) {
    this.detailStyle.font = font;
    return new Promise((resolve) => {
      // Unfortunately this takes "a while" to load and doesn't really
      // tell us when it's done, so the font won't update until some
      // time later.
      setTimeout(() => {
        this.detailStyle.x += 1;
        this.cards[0].redraw();
      }, 1000);
      setTimeout(() => {
        this.detailStyle.x -= 1;
        this.redraw();
        resolve();
      }, 2000);
    });
  }

  redraw() {
    this.cards.forEach((card) => card.redraw());
  }

  toPNGArray() {
    return this.cards.map((card) => card.toPNG());
  }
}

function main() {
  const master = new MasterCreator();
  const controls = document.createElement('div');
  document.body.appendChild(controls);
  ReactDOM.render(<Controls creator={master} />, controls);
  master.redraw();
}

main();
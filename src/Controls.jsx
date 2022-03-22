import React, { useRef } from 'react';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

import FileInput from './FileInput';
import FontPicker from './FontPicker';

export const CARD_WIDTH = 512;
export const CARD_HEIGHT = 375;

export default function Controls({ creator }) {
  const lastCategoryFontRef = useRef(null);
  const lastTitleFontRef = useRef(null);
  const lastDetailFontRef = useRef(null);

  const onBackgroundChange = async (e) => {
    try {
      if (e.target.files.length !== 1) {
        alert('Please provide a single file!');
        return;
      }
      const file = e.target.files[0];
      const background = await createImageBitmap(file);
      creator.setBackground(background);
    } catch (e) {
      console.error(e);
    }
  };

  const onMarginChange = (e) => {
    creator.setMargin(Number(e.target.value));
  }

  const onCategoryXChange = (e) => {
    creator.setCategoryX(Number(e.target.value));
  };

  const onCategoryYChange = (e) => {
    creator.setCategoryY(Number(e.target.value));
  };

  const onCategoryFontSizeChange = (e) => {
    creator.setCategoryFontSize(`${Number(e.target.value)}px`);
  }

  const onCategoryFontChange = async (fontUrl) => {
    try {
      const existingFont = document.getElementById('category-font');
      if (existingFont) {
        existingFont.remove();
      }
      const style = document.createElement('style');
      style.id = 'category-font';
      style.appendChild(document.createTextNode(`
        @font-face {
          font-family: Category;
          src: url('${fontUrl}');
        }
      `));
      document.head.appendChild(style);
      await creator.setCategoryFont('Category');
    } catch (e) {
      console.error(e);
    }
  }

  const onTitleXChange = (e) => {
    creator.setTitleX(Number(e.target.value));
  };

  const onTitleYChange = (e) => {
    creator.setTitleY(Number(e.target.value));
  };

  const onTitleFontSizeChange = (e) => {
    creator.setTitleFontSize(`${Number(e.target.value)}px`);
  }

  const onTitleFontChange = async (fontUrl) => {
    try {
      const existingFont = document.getElementById('title-font');
      if (existingFont) {
        existingFont.remove();
      }
      const style = document.createElement('style');
      style.id = 'title-font';
      style.appendChild(document.createTextNode(`
        @font-face {
          font-family: Title;
          src: url('${fontUrl}');
        }
      `));
      document.head.appendChild(style);
      await creator.setTitleFont('Title');
    } catch (e) {
      console.error(e);
    }
  }

  const onDetailXChange = (e) => {
    creator.setDetailX(Number(e.target.value));
  };

  const onDetailYChange = (e) => {
    creator.setDetailY(Number(e.target.value));
  };

  const onDetailFontSizeChange = (e) => {
    creator.setDetailFontSize(`${Number(e.target.value)}px`);
  }

  const onDetailFontChange = async (fontUrl) => {
    try {
      const existingFont = document.getElementById('detail-font');
      if (existingFont) {
        existingFont.remove();
      }
      const style = document.createElement('style');
      style.id = 'detail-font';
      style.appendChild(document.createTextNode(`
        @font-face {
          font-family: Detail;
          src: url('${fontUrl}');
        }
      `));
      document.head.appendChild(style);
      await creator.setDetailFont('Detail');
    } catch (e) {
      console.error(e);
    }
  }

  const onLoadFile = async (e) => {
    try {
      if (e.target.files.length !== 1) {
        alert('Please provide a single file!');
        return;
      }
      const file = e.target.files[0];
      const text = await file.text();
      const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
      creator.loadLines(lines);
    } catch (e) {
      console.error(e);
    }
  }

  const onGenerate = async () => {
    const cardBytes = await creator.toPNGArray();
    const zip = new JSZip();
    cardBytes.forEach((bytes, index) => {
      zip.file(`test${index}.png`, bytes, { binary: true });
    });
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'test.zip');
  }

  return (
    <div style={{ position: 'fixed', right: 0, top: 0, width: '30vw', height: '100vh' }}>
      <span>Card size: {CARD_WIDTH} x {CARD_HEIGHT}</span><br />
      <label>
        <span>Background: </span>
        <FileInput accept=".png,.jpg,.jpeg" onInput={onBackgroundChange}>Select image</FileInput>
      </label>
      <br />
      <label>
        <span>Margin: </span>
        <input type="number" defaultValue={0} onChange={onMarginChange} />
      </label>
      <hr />
      <div>
        <span>Category Position</span><br />
        <input type="number" defaultValue={creator.categoryStyle.x} onChange={onCategoryXChange} />
        <input type="number" defaultValue={creator.categoryStyle.y} onChange={onCategoryYChange} />
      </div>
      <div>
        <span>Category Font</span><br />
        <input type="number" defaultValue={parseInt(creator.categoryStyle.fontSize)} onChange={onCategoryFontSizeChange} />
        <FontPicker onSelectFont={onCategoryFontChange}/>
      </div>
      <hr />
      <div>
        <span>Title Position</span><br />
        <input type="number" defaultValue={creator.titleStyle.x} onChange={onTitleXChange} />
        <input type="number" defaultValue={creator.titleStyle.y} onChange={onTitleYChange} />
      </div>
      <div>
        <span>Title Font</span><br />
        <input type="number" defaultValue={parseInt(creator.titleStyle.fontSize)} onChange={onTitleFontSizeChange} />
        <FontPicker onSelectFont={onTitleFontChange}/>
      </div>
      <hr />
      <div>
        <span>Detail Position</span><br />
        <input type="number" defaultValue={creator.detailStyle.x} onChange={onDetailXChange} />
        <input type="number" defaultValue={creator.detailStyle.y} onChange={onDetailYChange} />
      </div>
      <div>
        <span>Detail Font</span><br />
        <input type="number" defaultValue={parseInt(creator.detailStyle.fontSize)} onChange={onDetailFontSizeChange} />
        <FontPicker onSelectFont={onDetailFontChange}/>
      </div>
      <hr />
      <FileInput accept=".txt" onInput={onLoadFile}>Load text</FileInput>
      <button onClick={onGenerate}>Save Images</button>
    </div>
  )
}
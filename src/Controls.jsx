import React, { useRef, useState } from 'react';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

import FileInput from './FileInput';
import FontPicker from './FontPicker';

export const CARD_WIDTH = 512;
export const CARD_HEIGHT = 375;

export default function Controls({ creator }) {
  const [margin, setMargin] = useState(creator.margin);
  const [categoryX, setCategoryX] = useState(creator.categoryStyle.x);
  const [categoryY, setCategoryY] = useState(creator.categoryStyle.y);
  const [categoryFontSize, setCategoryFontSize] = useState(parseInt(creator.categoryStyle.fontSize));
  const [titleX, setTitleX] = useState(creator.titleStyle.x);
  const [titleY, setTitleY] = useState(creator.titleStyle.y);
  const [titleFontSize, setTitleFontSize] = useState(parseInt(creator.titleStyle.fontSize));
  const [detailX, setDetailX] = useState(creator.detailStyle.x);
  const [detailY, setDetailY] = useState(creator.detailStyle.y);
  const [detailFontSize, setDetailFontSize] = useState(parseInt(creator.detailStyle.fontSize));

  const [categoryFontName, setCategoryFontName] = useState('');
  const [titleFontName, setTitleFontName] = useState('');
  const [detailFontName, setDetailFontName] = useState('');
  const categoryFontUrl = useRef(null);
  const titleFontUrl = useRef(null);
  const detailFontUrl = useRef(null);

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
    const value = Number(e.target.value);
    creator.setMargin(value);
    setMargin(value);
  }

  const onCategoryXChange = (e) => {
    const value = Number(e.target.value);
    creator.setCategoryX(value);
    setCategoryX(value);
  };

  const onCategoryYChange = (e) => {
    const value = Number(e.target.value);
    creator.setCategoryY(value);
    setCategoryY(value);
  };

  const onCategoryFontSizeChange = (e) => {
    const value = Number(e.target.value);
    creator.setCategoryFontSize(`${value}px`);
    setCategoryFontSize(value);
  }

  const onCategoryFontChange = async (fontUrl, name) => {
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
      categoryFontUrl.current = fontUrl;
      setCategoryFontName(name);
      document.head.appendChild(style);
      await creator.setCategoryFont('Category');
    } catch (e) {
      console.error(e);
    }
  }

  const onTitleXChange = (e) => {
    const value = Number(e.target.value);
    creator.setTitleX(value);
    setTitleX(value);
  };

  const onTitleYChange = (e) => {
    const value = Number(e.target.value);
    creator.setTitleY(value);
    setTitleY(value);
  };

  const onTitleFontSizeChange = (e) => {
    const value = Number(e.target.value);
    creator.setTitleFontSize(`${value}px`);
    setTitleFontSize(value);
  }

  const onTitleFontChange = async (fontUrl, name) => {
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
      titleFontUrl.current = fontUrl;
      setTitleFontName(name);
      document.head.appendChild(style);
      await creator.setTitleFont('Title');
    } catch (e) {
      console.error(e);
    }
  }

  const onDetailXChange = (e) => {
    const value = Number(e.target.value);
    creator.setDetailX(value);
    setDetailX(value);
  };

  const onDetailYChange = (e) => {
    const value = Number(e.target.value);
    creator.setDetailY(value);
    setDetailY(value);
  };

  const onDetailFontSizeChange = (e) => {
    const value = Number(e.target.value);
    creator.setDetailFontSize(`${value}px`);
    setDetailFontSize(value);
  }

  const onDetailFontChange = async (fontUrl, name) => {
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
      detailFontUrl.current = fontUrl;
      setDetailFontName(name);
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

  const onSaveText = () => {
    const cardText = creator.getLines();
    const content = new Blob([cardText], {type: 'text/plain;charset=utf-8'});
    saveAs(content, 'fiasco-cards.txt');
  }

  const onLoadSettings = async (e) => {
    try {
      if (e.target.files.length !== 1) {
        alert('Please provide a single file!');
        return;
      }
      const file = e.target.files[0];
      const settings = JSON.parse(await file.text());
      if (settings.background) {
        const blob = await (await fetch(settings.background)).blob();
        creator.background = await createImageBitmap(blob);
      }
      if (settings.margin) {
        creator.margin = settings.margin;
      } else {
        creator.margin = 0;
      }
      if (settings.categoryStyle) {
        if (settings.categoryStyle.fillStyle) {
          creator.categoryStyle.fillStyle = settings.categoryStyle.fillStyle;
        } else {
          creator.categoryStyle.fillStyle = 'black';
        }
        creator.categoryStyle.font = 'serif';
        if (settings.categoryStyle.font === 'Category') {
          if (settings.categoryStyle.fontUrl) {
            await onCategoryFontChange(settings.categoryStyle.fontUrl);
          }
          if (settings.categoryStyle.fontName) {
            setCategoryFontName(settings.categoryStyle.fontName);
          }
        }
        if (settings.categoryStyle.fontSize) {
          creator.categoryStyle.fontSize = settings.categoryStyle.fontSize;
        } else {
          creator.categoryStyle.fontSize = '110px';
        }
        setCategoryFontSize(parseInt(creator.categoryStyle.fontSize));
        if (settings.categoryStyle.x) {
          creator.categoryStyle.x = settings.categoryStyle.x;
        } else {
          creator.categoryStyle.x = 39;
        }
        setCategoryX(creator.categoryStyle.x);
        if (settings.categoryStyle.y) {
          creator.categoryStyle.y = settings.categoryStyle.y;
        } else {
          creator.categoryStyle.y = 83;
        }
        setCategoryY(creator.categoryStyle.y);
      }
      if (settings.titleStyle) {
        if (settings.titleStyle.fillStyle) {
          creator.titleStyle.fillStyle = settings.titleStyle.fillStyle;
        } else {
          creator.titleStyle.fillStyle = 'black';
        }
        creator.titleStyle.font = 'serif';
        if (settings.titleStyle.font === 'Title') {
          if (settings.titleStyle.fontUrl) {
            await onTitleFontChange(settings.titleStyle.fontUrl);
          }
          if (settings.titleStyle.fontName) {
            setTitleFontName(settings.titleStyle.fontName);
          }
        }
        if (settings.titleStyle.fontSize) {
          creator.titleStyle.fontSize = settings.titleStyle.fontSize;
        } else {
          creator.titleStyle.fontSize = '30px';
        }
        setTitleFontSize(parseInt(creator.titleStyle.fontSize));
        if (settings.titleStyle.x) {
          creator.titleStyle.x = settings.titleStyle.x;
        } else {
          creator.titleStyle.x = 148;
        }
        setTitleX(creator.titleStyle.x);
        if (settings.titleStyle.y) {
          creator.titleStyle.y = settings.titleStyle.y;
        } else {
          creator.titleStyle.y = 181;
        }
        setTitleY(creator.titleStyle.y);
      }
      if (settings.detailStyle) {
        if (settings.detailStyle.fillStyle) {
          creator.detailStyle.fillStyle = settings.detailStyle.fillStyle;
        } else {
          creator.detailStyle.fillStyle = 'black';
        }
        creator.detailStyle.font = 'serif';
        if (settings.detailStyle.font === 'Detail') {
          if (settings.detailStyle.fontUrl) {
            await onDetailFontChange(settings.detailStyle.fontUrl);
          }
          if (settings.detailStyle.fontName) {
            setDetailFontName(settings.detailStyle.fontName);
          }
        }
        if (settings.detailStyle.fontSize) {
          creator.detailStyle.fontSize = settings.detailStyle.fontSize;
        } else {
          creator.detailStyle.fontSize = '25px';
        }
        setDetailFontSize(parseInt(creator.detailStyle.fontSize));
        if (settings.detailStyle.x) {
          creator.detailStyle.x = settings.detailStyle.x;
        } else {
          creator.detailStyle.x = 147;
        }
        setDetailX(creator.detailStyle.x);
        if (settings.detailStyle.y) {
          creator.detailStyle.y = settings.detailStyle.y;
        } else {
          creator.detailStyle.y = 263;
        }
        setDetailY(creator.detailStyle.y);
      }
      creator.redraw();
    } catch (e) {
      console.error(e);
    }
  }

  const onSaveSettings = async () => {
    const getFontUrl = async (fontUrl) => {
      if (fontUrl.startsWith('blob:')) {
        // Save it somehow
        const response = await fetch(fontUrl);
        const blob = await response.blob();
        const fontData = await new Promise((resolve, reject) => {
          try {
            const reader = new FileReader();
            reader.addEventListener('loadend', () => resolve(reader.result));
            reader.readAsDataURL(blob);
          } catch (e) {
            reject(e);
          }
        });
        return fontData;
      }
      return fontUrl;
    };

    const settings = {
      margin: creator.margin,
      categoryStyle: { ...creator.categoryStyle },
      titleStyle: { ...creator.titleStyle },
      detailStyle: { ...creator.detailStyle },
    }
    if (settings.categoryStyle.font === 'Category') {
      settings.categoryStyle.fontUrl = await getFontUrl(categoryFontUrl.current);
      settings.categoryStyle.fontName = categoryFontName;
    }
    if (settings.titleStyle.font === 'Title') {
      settings.titleStyle.fontUrl = await getFontUrl(titleFontUrl.current);
      settings.titleStyle.fontName = titleFontName;
    }
    if (settings.detailStyle.font === 'Detail') {
      settings.detailStyle.fontUrl = await getFontUrl(detailFontUrl.current);
      settings.detailStyle.fontName = detailFontName;
    }
    if (creator.background) {
      const canvas = document.createElement('canvas');
      canvas.width = CARD_WIDTH;
      canvas.height = CARD_HEIGHT;
      canvas.getContext('2d').drawImage(creator.background, 0, 0);
      settings.background = canvas.toDataURL();
    }
    const content = new Blob([JSON.stringify(settings)], {type: 'application/json;charset=utf-8'});
    saveAs(content, 'fiasco-settings.json');
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
        <input type="number" value={margin} onChange={onMarginChange} />
      </label>
      <hr />
      <div>
        <span>Category Position</span><br />
        <input type="number" value={categoryX} onChange={onCategoryXChange} />
        <input type="number" value={categoryY} onChange={onCategoryYChange} />
      </div>
      <div>
        <span>Category Font</span><br />
        <input type="number" value={categoryFontSize} onChange={onCategoryFontSizeChange} />
        <FontPicker name={categoryFontName} onSelectFont={onCategoryFontChange}/>
      </div>
      <hr />
      <div>
        <span>Title Position</span><br />
        <input type="number" value={titleX} onChange={onTitleXChange} />
        <input type="number" value={titleY} onChange={onTitleYChange} />
      </div>
      <div>
        <span>Title Font</span><br />
        <input type="number" value={titleFontSize} onChange={onTitleFontSizeChange} />
        <FontPicker name={titleFontName} onSelectFont={onTitleFontChange}/>
      </div>
      <hr />
      <div>
        <span>Detail Position</span><br />
        <input type="number" value={detailX} onChange={onDetailXChange} />
        <input type="number" value={detailY} onChange={onDetailYChange} />
      </div>
      <div>
        <span>Detail Font</span><br />
        <input type="number" value={detailFontSize} onChange={onDetailFontSizeChange} />
        <FontPicker name={detailFontName} onSelectFont={onDetailFontChange}/>
      </div>
      <hr />
      <FileInput accept=".txt" onInput={onLoadFile}>Load text</FileInput>
      <button onClick={onSaveText}>Save text</button>
      <br/>
      <FileInput accept=".json" onInput={onLoadSettings}>Load settings</FileInput>
      <button onClick={onSaveSettings}>Save settings</button>
      <br />
      <button onClick={onGenerate}>Save Images</button>
    </div>
  )
}
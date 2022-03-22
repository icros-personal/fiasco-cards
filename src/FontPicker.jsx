import React, { useEffect, useRef, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import styled from 'styled-components';

const API_KEY = process.env.GOOGLE_API_KEY;

class FontManager {
  static initPromise;
  static async init() {
    if (!FontManager.initPromise) {
      FontManager.initPromise = new Promise(async (resolve, reject) => {
        try {
          const response = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEY}&sort=popularity`);
          FontManager.fontList = (await response.json()).items;
          FontManager.used = new Set();
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    }

    return FontManager.initPromise;
  }

  static useFont(newFont) {
    let style = document.getElementById('google-fonts-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'google-fonts-style';
      document.head.appendChild(style);
    }
    FontManager.used.add(newFont);
    let newText = '';
    FontManager.used.forEach((fontFamily) => {
      const font = FontManager.fontList.find(f => f.family === fontFamily);
      if (font) {
        newText += `
          @font-face {
            font-family: ${font.family};
            src: url('${font.files.regular.replace('http:', 'https:')}');
          }
        `;
      }
    });
    if (style.firstChild) {
      style.removeChild(style.firstChild);
    }
    style.appendChild(document.createTextNode(newText));
  }

  static stopUsingFont(newFont) {
    FontManager.used.delete(newFont);
  }
}

export default function FontPicker({ name, onSelectFont }) {
  const [fontListReady, setFontListReady] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const fileInputRef = useRef(null);
  const lastFontRef = useRef(null);

  useEffect(async () => {
    await FontManager.init();
    setFontListReady(true);
  }, []);

  const onSelectCustomFont = async (e) => {
    try {
      if (e.target.files.length !== 1) {
        alert('Please provide a single file!');
        return;
      }
      const file = e.target.files[0];
      if (lastFontRef.current) {
        URL.revokeObjectURL(lastFontRef.current);
      }
      const fontUrl = URL.createObjectURL(file);
      lastFontRef.current = fontUrl;
      onSelectFont(fontUrl, file.name);
    } catch (e) {
      console.error(e);
    }
  }

  if (!fontListReady) {
    return <div>Loading fonts...</div>;
  } else {
    return (
      <div>
        <input style={{ display: 'none' }} ref={fileInputRef} type="file" accept=".ttf,.otf,.woff,.woff2,.eot" onInput={onSelectCustomFont} />
        <button onClick={() => setExpanded(!expanded)}>{name || 'Select font'}</button>
        {expanded && (
          <>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onClick={() => setExpanded(false)} />
            <List style={{ position: 'absolute', background: 'white', border: '1px solid black' }} height={300} itemCount={1 + FontManager.fontList.length} itemSize={35} width={300}>
              {({ index, style }) => {
                return <MountingFontRow onClick={() => {
                  if (index === 0) {
                    fileInputRef.current.click();
                  } else {
                    if (lastFontRef.current) {
                      URL.revokeObjectURL(lastFontRef.current);
                    }
                    const chosen = FontManager.fontList[index - 1];
                    onSelectFont(chosen.files.regular.replace('http:', 'https:'), chosen.family);
                  }
                  setExpanded(false);
                }} style={style}>{index > 0 ? FontManager.fontList[index - 1].family : 'Custom'}</MountingFontRow>
              }}
            </List>
          </>
        )}
      </div>
    );
  }
}

function MountingFontRow({ style, onClick, children }) {
  useEffect(() => {
    if (children !== 'Custom') {
      FontManager.useFont(children);
    }
    return () => {
      FontManager.stopUsingFont(children);
    }
  }, []);
  return <FontRow style={{ ...style, fontFamily: children }} onClick={onClick}>{children}</FontRow>
}

const FontRow = styled.div`
  display: flex;
  align-items: center;

  &:hover {
    background: #33aaff;
  }
`;
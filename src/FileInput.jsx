import React, { useRef } from 'react';

export function FileInput({ children, accept, onInput }) {
  const inputRef = useRef(null);
  return (
    <>
      <input style={{display: 'none'}} ref={inputRef} type="file" accept={accept} onInput={onInput}></input>
      <button onClick={() => inputRef.current.click()}>{children}</button>
    </>
  );
}
import React, { useRef } from 'react';
import styled from 'styled-components';

export default function ColourInput({value, onChange}) {
  const colourRef = useRef(null);

  return (
    <>
      <input ref={colourRef} type="color" style={{visibility: 'hidden', position: 'absolute'}} value={value} onInput={onChange} />
      <StyledButton value={value} onClick={() => colourRef.current.click()} />
    </>
  )
}

const StyledButton = styled.button`
  vertical-align: middle;
  margin-left: 4px;
  width: 18px;
  height: 18px;
  appearance: none;
  padding: 0;
  border: 1px solid black;
  background-color: ${props => props.value};

  &:hover {
    border: 2px solid black;
  }
`;
import * as React from 'react';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
// import App from "/App";
// import CustomNode from './custom-node';
import { JsonEditor } from "json-crack/src/containers/Editor/JsonEditor";

// import './MyReactComponent.scss';

export interface IMyComponentProps {
  // counter: number;
  // onClick?: () => void;
}


export const JSONCrackWrappableComponent: FunctionComponent<IMyComponentProps> = (props: IMyComponentProps) => {

  // const nodeTypes = {
  //   custom: CustomNode,
  // };

  const minimapStyle = {
    height: 120,
  };


  return (
    <JsonEditor/>
  );
}

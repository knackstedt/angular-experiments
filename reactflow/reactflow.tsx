import * as React from 'react';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'reactflow';

import { nodes as initialNodes, edges as initialEdges } from './initial-elements';
// import CustomNode from './custom-node';

// import './MyReactComponent.scss';

export interface IMyComponentProps {
  // counter: number;
  // onClick?: () => void;
}

export const ReactFlowWrappableComponent: FunctionComponent<IMyComponentProps> = (props: IMyComponentProps) => {

  // const nodeTypes = {
  //   custom: CustomNode,
  // };

  const minimapStyle = {
    height: 120,
  };

  const onInit = (reactFlowInstance) => console.log('flow loaded:', reactFlowInstance);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes as any);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges as any);
    const onConnect = React.useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

    // we are using a bit of a shortcut here to adjust the edge type
    // this could also be done with a custom edge for example
    const edgesWithUpdatedTypes = edges.map((edge) => {
      // if (edge.sourceHandle) {
      //   // @ts-ignore
      //   const edgeType = nodes.find((node) => node.type === 'custom').data.selects[edge.sourceHandle];
      //   edge.type = edgeType;
      // }

      return edge;
    });


  return (
    <ReactFlow
      nodes={nodes}
      edges={edgesWithUpdatedTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={onInit}
      fitView
      attributionPosition="top-right"
      // nodeTypes={nodeTypes}
    >
      <MiniMap style={minimapStyle} zoomable pannable />
      <Controls />
      <Background color="#aaa" gap={16} />
    </ReactFlow>
  );
}

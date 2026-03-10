// ui.js
import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { ApiNode, ConditionNode, NoteNode, TransformNode, TimerNode } from './nodes/customNodes';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  api: ApiNode,
  condition: ConditionNode,
  note: NoteNode,
  transform: TransformNode,
  timer: TimerNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  onReconnect: state.onReconnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Track whether an edge update drag actually completed successfully.
  // Without this guard, dropping on empty canvas fires onEdgeUpdate and
  // removes the edge via updateEdge (which returns [] when target is invalid).
  const edgeUpdateSuccessful = useRef(true);

  const {
    nodes, edges, getNodeID, addNode,
    onNodesChange, onEdgesChange, onConnect, onReconnect,
  } = useStore(selector, shallow);

  const getInitNodeData = (nodeID, type) => ({ id: nodeID, nodeType: type });

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    if (event?.dataTransfer?.getData('application/reactflow')) {
      const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
      const type = appData?.nodeType;
      if (!type) return;
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const nodeID = getNodeID(type);
      addNode({ id: nodeID, type, position, data: getInitNodeData(nodeID, type) });
    }
  }, [reactFlowInstance]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // ── ReactFlow v11 edge reconnection API ──────────────────────────────────
  // Step 1: user starts dragging an edge endpoint — assume failure until proven otherwise
  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  // Step 2: user drops onto a valid handle — update the edge
  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    edgeUpdateSuccessful.current = true;
    onReconnect(oldEdge, newConnection);
  }, [onReconnect]);

  // Step 3: drag ended — if it never landed on a handle, remove the dangling edge
  const onEdgeUpdateEnd = useCallback((_, edge) => {
    if (!edgeUpdateSuccessful.current) {
      onEdgesChange([{ id: edge.id, type: 'remove' }]);
    }
    edgeUpdateSuccessful.current = true;
  }, [onEdgesChange]);

  return (
    <div ref={reactFlowWrapper} style={{ width: '100%', height: 'calc(100vh - 140px)' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeUpdateStart={onEdgeUpdateStart}
        onEdgeUpdate={onEdgeUpdate}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
        onNodesDelete={() => {}}
        onEdgesDelete={() => {}}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        connectionLineType='smoothstep'
        edgeUpdaterRadius={10}
        deleteKeyCode={['Delete', 'Backspace']}
        style={{ background: '#0d1117' }}
      >
        <Background color="#1e2a3a" gap={gridSize} variant="dots" />
        <Controls
          style={{
            background: '#1e2235',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px',
          }}
        />
        <MiniMap
          style={{
            background: '#1e2235',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px',
          }}
          nodeColor={() => '#6366f1'}
        />
      </ReactFlow>
    </div>
  );
};




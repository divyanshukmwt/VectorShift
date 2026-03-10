// inputNode.js
import { useState } from 'react';
import { BaseNode, NodeLabel, NodeInput, NodeSelect, NodeRow } from './BaseNode';

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data?.inputType || 'Text');

  return (
    <BaseNode
      id={id}
      title="Input"
      icon="⬇️"
      accentColor="#22d3ee"
      outputs={[{ id: 'value', label: 'value' }]}
    >
      <NodeRow>
        <NodeLabel>Name</NodeLabel>
        <NodeInput value={currName} onChange={e => setCurrName(e.target.value)} placeholder="input_name" />
      </NodeRow>
      <NodeRow style={{ marginBottom: 0 }}>
        <NodeLabel>Type</NodeLabel>
        <NodeSelect
          value={inputType}
          onChange={e => setInputType(e.target.value)}
          options={[{ value: 'Text', label: 'Text' }, { value: 'File', label: 'File' }]}
        />
      </NodeRow>
    </BaseNode>
  );
};

// outputNode.js
import { useState } from 'react';
import { BaseNode, NodeLabel, NodeInput, NodeSelect, NodeRow } from './BaseNode';

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data?.outputType || 'Text');

  return (
    <BaseNode
      id={id}
      title="Output"
      icon="⬆️"
      accentColor="#f472b6"
      inputs={[{ id: 'value', label: 'value' }]}
    >
      <NodeRow>
        <NodeLabel>Name</NodeLabel>
        <NodeInput value={currName} onChange={e => setCurrName(e.target.value)} placeholder="output_name" />
      </NodeRow>
      <NodeRow style={{ marginBottom: 0 }}>
        <NodeLabel>Type</NodeLabel>
        <NodeSelect
          value={outputType}
          onChange={e => setOutputType(e.target.value)}
          options={[{ value: 'Text', label: 'Text' }, { value: 'Image', label: 'Image' }]}
        />
      </NodeRow>
    </BaseNode>
  );
};

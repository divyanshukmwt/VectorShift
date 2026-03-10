// llmNode.js
import { BaseNode } from './BaseNode';
import { Brain } from 'lucide-react';

// helper to center icon
const IconWrap = ({ children }) => (
  <span
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    {children}
  </span>
);

export const LLMNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      title="LLM"
      icon={
        <IconWrap>
          <Brain size={18} color="#a78bfa" />
        </IconWrap>
      }
      accentColor="#a78bfa"
      inputs={[
        { id: 'system', label: 'system', style: { top: '33%' } },
        { id: 'prompt', label: 'prompt', style: { top: '67%' } },
      ]}
      outputs={[{ id: 'response', label: 'response' }]}
      minWidth={200}
    >
      <div
        style={{
          fontSize: '11px',
          color: 'rgba(255,255,255,0.45)',
          padding: '6px 0 2px',
          lineHeight: 1.6,
        }}
      >
        Large Language Model node.<br />
        Connect a system prompt and user prompt to generate a response.
      </div>
    </BaseNode>
  );
};
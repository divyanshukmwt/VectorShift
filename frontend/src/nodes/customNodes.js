// customNodes.js — 5 new node types built with the BaseNode abstraction

import { useState } from 'react';
import { BaseNode, NodeLabel, NodeInput, NodeSelect, NodeTextarea, NodeRow } from './BaseNode';

// ─── 1. API Request Node ──────────────────────────────────────────────────────
export const ApiNode = ({ id, data }) => {
  const [url, setUrl] = useState(data?.url || 'https://api.example.com');
  const [method, setMethod] = useState(data?.method || 'GET');

  return (
    <BaseNode
      id={id}
      title="API Request"
      icon="🌐"
      accentColor="#34d399"
      inputs={[{ id: 'body', label: 'body' }, { id: 'headers', label: 'headers' }]}
      outputs={[{ id: 'response', label: 'response' }, { id: 'status', label: 'status' }]}
    >
      <NodeRow>
        <NodeLabel>Method</NodeLabel>
        <NodeSelect
          value={method}
          onChange={e => setMethod(e.target.value)}
          options={['GET', 'POST', 'PUT', 'DELETE', 'PATCH']}
        />
      </NodeRow>
      <NodeRow style={{ marginBottom: 0 }}>
        <NodeLabel>URL</NodeLabel>
        <NodeInput value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />
      </NodeRow>
    </BaseNode>
  );
};

// ─── 2. Conditional / If-Else Node ───────────────────────────────────────────
export const ConditionNode = ({ id, data }) => {
  const [condition, setCondition] = useState(data?.condition || 'value > 0');

  return (
    <BaseNode
      id={id}
      title="Condition"
      icon="🔀"
      accentColor="#fbbf24"
      inputs={[{ id: 'value', label: 'value' }]}
      outputs={[
        { id: 'true', label: 'true', style: { top: '35%' } },
        { id: 'false', label: 'false', style: { top: '65%' } },
      ]}
    >
      <NodeRow style={{ marginBottom: 0 }}>
        <NodeLabel>Expression</NodeLabel>
        <NodeInput
          value={condition}
          onChange={e => setCondition(e.target.value)}
          placeholder="e.g. value > 0"
        />
      </NodeRow>
    </BaseNode>
  );
};

// ─── 3. Note / Comment Node ───────────────────────────────────────────────────
export const NoteNode = ({ id, data }) => {
  const [note, setNote] = useState(data?.note || 'Add a note...');

  return (
    <BaseNode
      id={id}
      title="Note"
      icon="🗒️"
      accentColor="#94a3b8"
      inputs={[]}
      outputs={[]}
      minWidth={200}
    >
      <NodeTextarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Add a comment or note..."
        style={{ minHeight: '60px', color: 'rgba(255,255,255,0.6)' }}
      />
    </BaseNode>
  );
};

// ─── 4. Data Transform Node ───────────────────────────────────────────────────
export const TransformNode = ({ id, data }) => {
  const [operation, setOperation] = useState(data?.operation || 'JSON Parse');
  const [field, setField] = useState(data?.field || '');

  return (
    <BaseNode
      id={id}
      title="Transform"
      icon="⚡"
      accentColor="#e879f9"
      inputs={[{ id: 'input', label: 'input' }]}
      outputs={[{ id: 'output', label: 'output' }]}
    >
      <NodeRow>
        <NodeLabel>Operation</NodeLabel>
        <NodeSelect
          value={operation}
          onChange={e => setOperation(e.target.value)}
          options={['JSON Parse', 'JSON Stringify', 'Uppercase', 'Lowercase', 'Trim', 'Split', 'Join']}
        />
      </NodeRow>
      <NodeRow style={{ marginBottom: 0 }}>
        <NodeLabel>Field (optional)</NodeLabel>
        <NodeInput value={field} onChange={e => setField(e.target.value)} placeholder="data.field" />
      </NodeRow>
    </BaseNode>
  );
};

// ─── 5. Timer / Delay Node ────────────────────────────────────────────────────
export const TimerNode = ({ id, data }) => {
  const [delay, setDelay] = useState(data?.delay || '1000');
  const [unit, setUnit] = useState(data?.unit || 'ms');

  return (
    <BaseNode
      id={id}
      title="Timer"
      icon="⏱️"
      accentColor="#f87171"
      inputs={[{ id: 'trigger', label: 'trigger' }]}
      outputs={[{ id: 'output', label: 'output' }]}
      minWidth={200}
    >
      <NodeRow>
        <NodeLabel>Delay</NodeLabel>
        <NodeInput
          value={delay}
          onChange={e => setDelay(e.target.value)}
          placeholder="1000"
          type="number"
        />
      </NodeRow>
      <NodeRow style={{ marginBottom: 0 }}>
        <NodeLabel>Unit</NodeLabel>
        <NodeSelect
          value={unit}
          onChange={e => setUnit(e.target.value)}
          options={['ms', 'sec', 'min']}
        />
      </NodeRow>
    </BaseNode>
  );
};

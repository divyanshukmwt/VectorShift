// toolbar.js
import { useState } from 'react';
import { DraggableNode } from './draggableNode';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const NODES = [
  // Core nodes
  { type: 'customInput', label: 'Input', icon: '⬇️', color: '#22d3ee', group: 'Core' },
  { type: 'customOutput', label: 'Output', icon: '⬆️', color: '#f472b6', group: 'Core' },
  { type: 'llm', label: 'LLM', icon: '🧠', color: '#a78bfa', group: 'Core' },
  { type: 'text', label: 'Text', icon: '📝', color: '#fb923c', group: 'Core' },
  // Custom nodes
  { type: 'api', label: 'API', icon: '🌐', color: '#34d399', group: 'Logic' },
  { type: 'condition', label: 'Condition', icon: '🔀', color: '#fbbf24', group: 'Logic' },
  { type: 'transform', label: 'Transform', icon: '⚡', color: '#e879f9', group: 'Logic' },
  { type: 'timer', label: 'Timer', icon: '⏱️', color: '#f87171', group: 'Logic' },
  { type: 'note', label: 'Note', icon: '🗒️', color: '#94a3b8', group: 'Util' },
];

const groups = ['Core', 'Logic', 'Util'];

const selector = (state) => ({ nodes: state.nodes, clearAll: state.clearAll });

export const PipelineToolbar = () => {
  const [confirmClear, setConfirmClear] = useState(false);
  const { nodes, clearAll } = useStore(selector, shallow);

  const handleClear = () => {
    if (nodes.length === 0) return;
    if (confirmClear) {
      clearAll();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(180deg, #161929 0%, #0f1422 100%)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      fontFamily: "'DM Sans', 'Inter', sans-serif",
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '8px' }}>
        <div style={{
          width: 32, height: 32,
          background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
          borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px',
          boxShadow: '0 0 12px rgba(99,102,241,0.4)',
        }}>⚡</div>
        <span style={{
          fontSize: '14px', fontWeight: 700, color: '#e2e8f0',
          letterSpacing: '-0.02em',
        }}>VectorShift</span>
      </div>

      <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.08)' }} />

      {/* Node groups */}
      {groups.map(group => (
        <div key={group} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '10px', color: 'rgba(255,255,255,0.3)',
            fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
            marginRight: '2px',
          }}>{group}</span>
          {NODES.filter(n => n.group === group).map(node => (
            <DraggableNode
              key={node.type}
              type={node.type}
              label={node.label}
              icon={node.icon}
              color={node.color}
            />
          ))}
        </div>
      ))}

      {/* Spacer pushes Clear All to the right */}
      <div style={{ flex: 1 }} />

      {/* Clear All button — top right */}
      <button
        onClick={handleClear}
        disabled={nodes.length === 0}
        style={{
          padding: '8px 16px',
          background: confirmClear ? 'rgba(248,113,113,0.15)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${confirmClear ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '8px',
          color: confirmClear ? '#f87171' : nodes.length === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.5)',
          fontSize: '12px',
          fontWeight: 500,
          cursor: nodes.length === 0 ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          fontFamily: 'inherit',
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
        onMouseEnter={e => {
          if (nodes.length > 0 && !confirmClear) {
            e.currentTarget.style.borderColor = 'rgba(248,113,113,0.4)';
            e.currentTarget.style.color = '#f87171';
            e.currentTarget.style.background = 'rgba(248,113,113,0.08)';
          }
        }}
        onMouseLeave={e => {
          if (!confirmClear) {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.color = nodes.length === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.5)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
          }
        }}
      >
        <span>{confirmClear ? '⚠️' : '🗑'}</span>
        <span>{confirmClear ? 'Confirm Clear?' : 'Clear All'}</span>
      </button>
    </div>
  );
};


// toolbar.js
import { useState } from 'react';
import { DraggableNode } from './draggableNode';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

import {
  ArrowDownCircle,
  ArrowUpCircle,
  Brain,
  FileText,
  Globe,
  GitBranch,
  Zap,
  Timer,
  StickyNote,
  Trash2,
  AlertTriangle
} from "lucide-react";

// helper to center icons
const IconWrap = ({ children }) => (
  <span style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }}>
    {children}
  </span>
);

const NODES = [
  // Core nodes
  { type: 'customInput', label: 'Input', icon: <IconWrap><ArrowDownCircle size={18} /></IconWrap>, color: '#22d3ee', group: 'Core' },
  { type: 'customOutput', label: 'Output', icon: <IconWrap><ArrowUpCircle size={18} /></IconWrap>, color: '#f472b6', group: 'Core' },
  { type: 'llm', label: 'LLM', icon: <IconWrap><Brain size={18} /></IconWrap>, color: '#a78bfa', group: 'Core' },
  { type: 'text', label: 'Text', icon: <IconWrap><FileText size={18} /></IconWrap>, color: '#fb923c', group: 'Core' },

  // Custom nodes
  { type: 'api', label: 'API', icon: <IconWrap><Globe size={18} /></IconWrap>, color: '#34d399', group: 'Logic' },
  { type: 'condition', label: 'Condition', icon: <IconWrap><GitBranch size={18} /></IconWrap>, color: '#fbbf24', group: 'Logic' },
  { type: 'transform', label: 'Transform', icon: <IconWrap><Zap size={18} /></IconWrap>, color: '#e879f9', group: 'Logic' },
  { type: 'timer', label: 'Timer', icon: <IconWrap><Timer size={18} /></IconWrap>, color: '#f87171', group: 'Logic' },
  { type: 'note', label: 'Note', icon: <IconWrap><StickyNote size={18} /></IconWrap>, color: '#94a3b8', group: 'Util' },
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
          width: 32,
          height: 32,
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.04)'
        }}>
          <img
            src="https://framerusercontent.com/images/PUVFaa9JKxr86MtwPIPVKLjAY.png?width=50&height=50"
            alt="VectorShift"
            style={{
              width: '30px',
              height: '30px',
              objectFit: 'contain'
            }}
          />
        </div>

        <span style={{
          fontSize: '14px',
          fontWeight: 700,
          color: '#e2e8f0',
          letterSpacing: '-0.02em',
        }}>
          VectorShift
        </span>
      </div>

      <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.08)' }} />

      {/* Node groups */}
      {groups.map(group => (
        <div key={group} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '10px',
            color: 'rgba(255,255,255,0.3)',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginRight: '2px',
          }}>
            {group}
          </span>

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

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Clear All button */}
      <button
        onClick={handleClear}
        disabled={nodes.length === 0}
        style={{
          padding: '8px 16px',
          background: confirmClear ? 'rgba(248,113,113,0.15)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${confirmClear ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '8px',
          color: confirmClear
            ? '#f87171'
            : nodes.length === 0
            ? 'rgba(255,255,255,0.2)'
            : 'rgba(255,255,255,0.5)',
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
      >
        {confirmClear
          ? <AlertTriangle size={14} />
          : <Trash2 size={14} />
        }

        <span>
          {confirmClear ? 'Confirm Clear?' : 'Clear All'}
        </span>
      </button>

    </div>
  );
};
// textNode.js — Part 3: dynamic sizing + variable handle detection
import { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { NodeLabel } from './BaseNode';
import { useStore } from '../store';

// Extract valid JS variable names from {{ varName }} patterns
const extractVariables = (text) => {
  const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
  const vars = new Set();
  let match;
  while ((match = regex.exec(text)) !== null) {
    vars.add(match[1]);
  }
  return Array.from(vars);
};

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);
  const textareaRef = useRef(null);
  const deleteNode = useStore((state) => state.deleteNode);

  useEffect(() => {
    setVariables(extractVariables(currText));
  }, [currText]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [currText]);

  const minWidth = 220;
  const extraWidth = Math.max(0, currText.length - 30) * 2;
  const nodeWidth = Math.min(minWidth + extraWidth, 480);

  return (
    <div
      style={{
        minWidth: nodeWidth,
        background: 'linear-gradient(145deg, #1e2235 0%, #161929 100%)',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.08)',
        borderLeft: '3px solid #fb923c',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
        fontFamily: "'DM Sans', 'Inter', sans-serif",
        overflow: 'visible',
        position: 'relative',
        transition: 'min-width 0.15s ease',
      }}
    >
      {/* Top glow */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, #fb923c88, transparent)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '10px 14px 8px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <span style={{ fontSize: '16px' }}>📝</span>
        <span style={{
          fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em',
          color: '#e2e8f0', textTransform: 'uppercase', flex: 1,
        }}>Text</span>
        <button
          onClick={(e) => { e.stopPropagation(); deleteNode(id); }}
          title="Delete node"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '2px 4px', borderRadius: '4px',
            color: 'rgba(255,255,255,0.25)', fontSize: '13px', lineHeight: 1,
            display: 'flex', alignItems: 'center', transition: 'color 0.15s, background 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.12)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.25)'; e.currentTarget.style.background = 'none'; }}
        >🗑</button>
      </div>

      {/* Body */}
      <div style={{ padding: '10px 14px 12px' }}>
        <NodeLabel>Content</NodeLabel>
        <textarea
          ref={textareaRef}
          value={currText}
          onChange={e => setCurrText(e.target.value)}
          placeholder="Enter text... use {{variable}} to create inputs"
          rows={2}
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '6px',
            padding: '6px 8px',
            fontSize: '12px',
            color: '#e2e8f0',
            outline: 'none',
            resize: 'none',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            lineHeight: 1.5,
            overflow: 'hidden',
            minHeight: '48px',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(251,146,60,0.6)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
        />
        {variables.length > 0 && (
          <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {variables.map(v => (
              <span key={v} style={{
                fontSize: '10px',
                background: 'rgba(251,146,60,0.15)',
                border: '1px solid rgba(251,146,60,0.3)',
                color: '#fb923c',
                borderRadius: '4px',
                padding: '2px 6px',
              }}>{'{{' + v + '}}'}</span>
            ))}
          </div>
        )}
      </div>

      {/* Dynamic variable input handles */}
      {variables.map((varName, i) => (
        <div key={varName}>
          <Handle
            type="target"
            position={Position.Left}
            id={`${id}-${varName}`}
            style={{
              width: 10, height: 10,
              background: '#fb923c',
              border: '2px solid #1e2235',
              top: variables.length === 1
                ? '50%'
                : `${20 + (i / (variables.length - 1)) * 60}%`,
            }}
          />
          <div style={{
            position: 'absolute',
            left: -8,
            top: variables.length === 1
              ? 'calc(50% - 18px)'
              : `calc(${20 + (i / (variables.length - 1)) * 60}% - 18px)`,
            transform: 'translateX(-100%)',
            fontSize: '9px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            color: '#fb923c',
            background: 'rgba(13,17,23,0.85)',
            border: '1px solid rgba(251,146,60,0.25)',
            borderRadius: '4px',
            padding: '2px 5px',
            pointerEvents: 'none',
            userSelect: 'none',
            whiteSpace: 'nowrap',
            textTransform: 'uppercase',
          }}>{varName}</div>
        </div>
      ))}

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        style={{
          width: 10, height: 10,
          background: '#fb923c',
          border: '2px solid #1e2235',
        }}
      />
    </div>
  );
};

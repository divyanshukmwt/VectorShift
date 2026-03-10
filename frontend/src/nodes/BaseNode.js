// BaseNode.js — Core abstraction for all pipeline nodes
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

/**
 * BaseNode provides a unified, styled wrapper for all node types.
 *
 * Props:
 *   id         — node id (from ReactFlow)
 *   title      — display name shown in the header
 *   icon       — emoji or text icon shown beside title
 *   accentColor — CSS color for the left border accent
 *   inputs     — array of { id, label, style? } for left-side handles
 *   outputs    — array of { id, label, style? } for right-side handles
 *   children   — body content (fields, selects, etc.)
 *   minWidth   — optional min width (default 220)
 *   style      — extra styles for outer wrapper
 */
export const BaseNode = ({
  id,
  title,
  icon = '⚙️',
  accentColor = '#6366f1',
  inputs = [],
  outputs = [],
  children,
  minWidth = 220,
  style = {},
}) => {
  const deleteNode = useStore((state) => state.deleteNode);

  return (
    <div
      className="base-node"
      style={{
        minWidth,
        background: 'linear-gradient(145deg, #1e2235 0%, #161929 100%)',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.08)',
        borderLeft: `3px solid ${accentColor}`,
        boxShadow: `0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)`,
        fontFamily: "'DM Sans', 'Inter', sans-serif",
        overflow: 'visible',
        position: 'relative',
        ...style,
      }}
    >
      {/* Glow accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: `linear-gradient(90deg, ${accentColor}88, transparent)`,
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '10px 14px 8px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <span style={{ fontSize: '16px' }}>{icon}</span>
        <span style={{
          fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em',
          color: '#e2e8f0', textTransform: 'uppercase', flex: 1,
        }}>{title}</span>

        {/* Feature 4: Delete button */}
        <button
          onClick={(e) => { e.stopPropagation(); deleteNode(id); }}
          title="Delete node"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px 4px',
            borderRadius: '4px',
            color: 'rgba(255,255,255,0.25)',
            fontSize: '13px',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            transition: 'color 0.15s, background 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#f87171';
            e.currentTarget.style.background = 'rgba(248,113,113,0.12)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.25)';
            e.currentTarget.style.background = 'none';
          }}
        >
          🗑
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '10px 14px 12px' }}>
        {children}
      </div>

      {/* Input handles (left) */}
      {inputs.map((handle, i) => {
        const topVal = handle.style?.top ?? `${((i + 1) / (inputs.length + 1)) * 100}%`;
        return (
          <div key={handle.id}>
            <Handle
              type="target"
              position={Position.Left}
              id={`${id}-${handle.id}`}
              style={{
                width: 10, height: 10,
                background: accentColor,
                border: '2px solid #1e2235',
                top: topVal,
                ...handle.style,
              }}
            />
            {handle.label && (
              <div style={{
                position: 'absolute',
                left: -8,
                top: `calc(${topVal} - 18px)`,
                transform: 'translateX(-100%)',
                fontSize: '9px',
                fontWeight: 600,
                letterSpacing: '0.04em',
                color: accentColor,
                background: 'rgba(13,17,23,0.85)',
                border: `1px solid ${accentColor}44`,
                borderRadius: '4px',
                padding: '2px 5px',
                pointerEvents: 'none',
                userSelect: 'none',
                whiteSpace: 'nowrap',
                textTransform: 'uppercase',
              }}>{handle.label}</div>
            )}
          </div>
        );
      })}

      {/* Output handles (right) */}
      {outputs.map((handle, i) => {
        const topVal = handle.style?.top ?? `${((i + 1) / (outputs.length + 1)) * 100}%`;
        return (
          <div key={handle.id}>
            <Handle
              type="source"
              position={Position.Right}
              id={`${id}-${handle.id}`}
              style={{
                width: 10, height: 10,
                background: accentColor,
                border: '2px solid #1e2235',
                top: topVal,
                ...handle.style,
              }}
            />
            {handle.label && (
              <div style={{
                position: 'absolute',
                right: -8,
                top: `calc(${topVal} - 18px)`,
                transform: 'translateX(100%)',
                fontSize: '9px',
                fontWeight: 600,
                letterSpacing: '0.04em',
                color: accentColor,
                background: 'rgba(13,17,23,0.85)',
                border: `1px solid ${accentColor}44`,
                borderRadius: '4px',
                padding: '2px 5px',
                pointerEvents: 'none',
                userSelect: 'none',
                whiteSpace: 'nowrap',
                textTransform: 'uppercase',
                textAlign: 'right',
              }}>{handle.label}</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─── Reusable field components ───────────────────────────────────────────────

export const NodeLabel = ({ children }) => (
  <div style={{
    fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px',
  }}>{children}</div>
);

export const NodeInput = ({ value, onChange, placeholder, type = 'text', style = {} }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    style={{
      width: '100%',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '6px',
      padding: '5px 8px',
      fontSize: '12px',
      color: '#e2e8f0',
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'border-color 0.2s',
      ...style,
    }}
    onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
  />
);

export const NodeSelect = ({ value, onChange, options = [] }) => (
  <select
    value={value}
    onChange={onChange}
    style={{
      width: '100%',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '6px',
      padding: '5px 8px',
      fontSize: '12px',
      color: '#e2e8f0',
      outline: 'none',
      boxSizing: 'border-box',
      cursor: 'pointer',
      appearance: 'none',
    }}
  >
    {options.map(opt => (
      <option key={opt.value ?? opt} value={opt.value ?? opt} style={{ background: '#1e2235' }}>
        {opt.label ?? opt}
      </option>
    ))}
  </select>
);

export const NodeTextarea = ({ value, onChange, placeholder, style = {} }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
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
      transition: 'border-color 0.2s',
      ...style,
    }}
    onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
  />
);

export const NodeRow = ({ children, style = {} }) => (
  <div style={{ marginBottom: '8px', ...style }}>{children}</div>
);

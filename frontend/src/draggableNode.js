// draggableNode.js
export const DraggableNode = ({ type, label, icon = '⚙️', color = '#6366f1' }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={type}
      onDragStart={(event) => onDragStart(event, type)}
      style={{
        cursor: 'grab',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '8px',
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${color}33`,
        borderLeft: `3px solid ${color}`,
        transition: 'all 0.15s ease',
        userSelect: 'none',
        fontFamily: "'DM Sans', 'Inter', sans-serif",
      }}
      draggable
      onMouseEnter={e => {
        e.currentTarget.style.background = `${color}15`;
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <span style={{ fontSize: '14px' }}>{icon}</span>
      <span style={{ fontSize: '12px', fontWeight: 500, color: '#cbd5e1' }}>{label}</span>
    </div>
  );
};

  
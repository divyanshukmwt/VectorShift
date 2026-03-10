// submit.js — Part 4: Backend integration
import { useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({ nodes: state.nodes, edges: state.edges, clearAll: state.clearAll });

export const SubmitButton = () => {
  const { nodes, edges, clearAll } = useStore(selector, shallow);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Bottom bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: '56px',
        background: 'linear-gradient(180deg, #0f1422 0%, #0a0e1a 100%)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '16px',
        fontFamily: "'DM Sans', 'Inter', sans-serif",
        zIndex: 100,
      }}>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
          {nodes.length} nodes · {edges.length} edges
        </span>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: '9px 28px',
            background: loading
              ? 'rgba(99,102,241,0.4)'
              : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.02em',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 0 20px rgba(99,102,241,0.4)',
            transition: 'all 0.2s ease',
            fontFamily: 'inherit',
          }}
        >
          {loading ? '⏳ Analyzing...' : '⚡ Run Analysis'}
        </button>
      </div>

      {/* Result Modal */}
      {(result || error) && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => { setResult(null); setError(null); }}
        >
          <div
            style={{
              background: 'linear-gradient(145deg, #1e2235 0%, #161929 100%)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '32px',
              minWidth: '340px',
              maxWidth: '480px',
              boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
              fontFamily: "'DM Sans', 'Inter', sans-serif",
            }}
            onClick={e => e.stopPropagation()}
          >
            {error ? (
              <>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚠️</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#f87171', marginBottom: '8px' }}>
                  Connection Error
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>
                  {error}. Make sure the backend is running on port 8000.
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>
                  {result.is_dag ? '✅' : '🔄'}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#e2e8f0', marginBottom: '20px' }}>
                  Pipeline Analysis
                </div>

                {/* Stats grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div style={{
                    background: 'rgba(99,102,241,0.1)',
                    border: '1px solid rgba(99,102,241,0.2)',
                    borderRadius: '10px', padding: '14px',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#818cf8' }}>
                      {result.num_nodes}
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                      Nodes
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(167,139,250,0.1)',
                    border: '1px solid rgba(167,139,250,0.2)',
                    borderRadius: '10px', padding: '14px',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: '#a78bfa' }}>
                      {result.num_edges}
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                      Edges
                    </div>
                  </div>
                </div>

                {/* DAG status */}
                <div style={{
                  background: result.is_dag ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
                  border: `1px solid ${result.is_dag ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'}`,
                  borderRadius: '10px',
                  padding: '12px 16px',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  marginBottom: '20px',
                }}>
                  <span style={{ fontSize: '18px' }}>{result.is_dag ? '✅' : '❌'}</span>
                  <div>
                    <div style={{
                      fontSize: '13px', fontWeight: 600,
                      color: result.is_dag ? '#34d399' : '#f87171',
                    }}>
                      {result.is_dag ? 'Valid DAG' : 'Not a DAG'}
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                      {result.is_dag
                        ? 'Pipeline has no cycles — ready to execute'
                        : 'Cycles detected — check for loops'}
                    </div>
                  </div>
                </div>
              </>
            )}

            <button
              onClick={() => { setResult(null); setError(null); }}
              style={{
                width: '100%', padding: '10px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#e2e8f0', fontSize: '13px', fontWeight: 500,
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.06)'}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};


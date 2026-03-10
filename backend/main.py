from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Any, Dict

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Pipeline(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]


def is_dag(nodes: list, edges: list) -> bool:
    """Check if the graph formed by nodes and edges is a Directed Acyclic Graph."""
    node_ids = {node["id"] for node in nodes}
    
    # Build adjacency list
    adj: Dict[str, List[str]] = {nid: [] for nid in node_ids}
    for edge in edges:
        src = edge.get("source")
        tgt = edge.get("target")
        if src in adj:
            adj[src].append(tgt)

    # DFS-based cycle detection
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {nid: WHITE for nid in node_ids}

    def dfs(node):
        color[node] = GRAY
        for neighbor in adj.get(node, []):
            if neighbor not in color:
                continue
            if color[neighbor] == GRAY:
                return False  # cycle found
            if color[neighbor] == WHITE:
                if not dfs(neighbor):
                    return False
        color[node] = BLACK
        return True

    for nid in node_ids:
        if color[nid] == WHITE:
            if not dfs(nid):
                return False
    return True


@app.get("/")
def read_root():
    return {"Ping": "Pong"}


@app.post("/pipelines/parse")
def parse_pipeline(pipeline: Pipeline):
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    dag = is_dag(pipeline.nodes, pipeline.edges)
    return {"num_nodes": num_nodes, "num_edges": num_edges, "is_dag": dag}


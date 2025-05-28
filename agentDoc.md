# CodeBolt Agent Module Documentation

## Installation

```javascript
const codebolt = require('@codebolt/codeboltjs').default;
```

## Basic Usage

```javascript
await codebolt.waitForConnection();
const localAgents = await codebolt.agent.getAgentsList("local");
const agent = await codebolt.agent.findAgent("dataProcessing");
```

## API Reference

### getAgentsList(type = Agents.DOWNLOADED)

```javascript
const downloadedAgents = await codebolt.agent.getAgentsList();
const localAgents = await codebolt.agent.getAgentsList("local");
const allAgents = await codebolt.agent.getAgentsList("all");
```

### getAgentsDetail(agentList = [])

```javascript
const agentDetails = await codebolt.agent.getAgentsDetail(["agent-id-1", "agent-id-2"]);
const allAgentDetails = await codebolt.agent.getAgentsDetail([]);
```

### findAgent(task, maxResult = 1, agents = [], agentLocation = AgentLocation.ALL, getFrom = FilterUsing.USE_VECTOR_DB)

```javascript
const agent = await codebolt.agent.findAgent("dataProcessing");
const agents = await codebolt.agent.findAgent("imageProcessing", 3, [], "local_only", "use_ai");
```

### startAgent(agentId, task)

```javascript
const result = await codebolt.agent.startAgent("agent-id-123", "Process the uploaded data");
```

## Enums

```javascript
// AgentLocation
AgentLocation.ALL = 'all'
AgentLocation.LOCAL_ONLY = 'local_only'
AgentLocation.REMOTE_ONLY = 'remote_only'

// Agents
Agents.LOCAL = 'local'
Agents.ALL = 'all'
Agents.DOWNLOADED = 'downloaded'

// FilterUsing
FilterUsing.USE_AI = 'use_ai'
FilterUsing.USE_VECTOR_DB = 'use_vector_db'
FilterUsing.USE_BOTH = 'use_both'
```

## Examples

```javascript
const codebolt = require('@codebolt/codeboltjs').default;

// Basic usage
await codebolt.waitForConnection();
const localAgents = await codebolt.agent.getAgentsList("local");
const webAgent = await codebolt.agent.findAgent("web development");

// Advanced search with AI filtering
const aiAgents = await codebolt.agent.findAgent(
  "natural language processing", 
  5, 
  [], 
  "all", 
  "use_ai"
);

// Complete workflow
const agents = await codebolt.agent.findAgent("data analysis", 3);
if (agents?.agents?.length > 0) {
  const selectedAgent = agents.agents[0];
  const details = await codebolt.agent.getAgentsDetail([selectedAgent.id]);
  const result = await codebolt.agent.startAgent(selectedAgent.id, "Analyze Q4 data");
}
```

## Error Handling

```javascript
// Timeout wrapper
const withTimeout = (promise, timeoutMs = 10000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
};

// Usage with error handling
try {
  await codebolt.waitForConnection();
  await new Promise(resolve => setTimeout(resolve, 2000)); // Stabilization delay
  
  const agents = await withTimeout(
    codebolt.agent.getAgentsList("local"),
    15000
  );
  
  if (agents?.agents) {
    console.log(`Found ${agents.agents.length} agents`);
  } else {
    console.log("No agents found");
  }
} catch (error) {
  console.error("Error:", error.message);
}
```

## WebSocket Messages

```json
// Request
{
  "type": "agentEvent",
  "action": "listAgents|findAgent|startAgent|agentsDetail",
  "agentType": "local|all|downloaded",
  "task": "task description",
  "maxResult": 1,
  "location": "all|local_only|remote_only",
  "getFrom": "use_ai|use_vector_db|use_both"
}

// Response Types
// listAgentsResponse - getAgentsList, getAgentsDetail
// findAgentByTaskResponse - findAgent  
// taskCompletionResponse - startAgent
``` 
import { Agent, run } from '@openai/agents';
import { specialists } from '../agents/specialists.mjs';
const model='gpt-5.6-sol';
const router=new Agent({name:'VALÉRIO AI Manager',model,instructions:`You are the central VALÉRIO AI Manager. Understand the user's goal, decide which specialist(s) should handle it, and delegate work. Prefer one specialist for simple tasks and a small ordered chain for cross-functional tasks. Developer actions that change GitHub require explicit user intent. Return a clear execution summary with owner, status, next step and blockers.`,handoffs:Object.values(specialists)});
export async function executeCommand(input){const result=await run(router,input);return {output:result.finalOutput,agent:result.lastAgent?.name??'VALÉRIO AI Manager'};}

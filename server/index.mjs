import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { executeCommand } from './orchestration/manager.mjs';
const app=express();app.use(cors());app.use(express.json({limit:'2mb'}));
app.get('/health',(_,res)=>res.json({ok:true,service:'valerio-ai-server'}));
app.post('/api/command',async(req,res)=>{try{if(!req.body?.message)return res.status(400).json({error:'message is required'});const result=await executeCommand(req.body.message);res.json(result)}catch(e){console.error(e);res.status(500).json({error:'AI command failed'})}});
app.listen(process.env.PORT||8787,()=>console.log('VALÉRIO AI server listening'));

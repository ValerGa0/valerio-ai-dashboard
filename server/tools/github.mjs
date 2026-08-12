import { tool } from '@openai/agents';
import { z } from 'zod';
import { getRepoFile, upsertRepoFile } from '../lib/github.mjs';
export const githubReadFile=tool({name:'github_read_file',description:'Read a text file from the configured VALÉRIO GitHub repository.',parameters:z.object({path:z.string(),ref:z.string().optional()}),async execute({path,ref}){return await getRepoFile(path,ref);}});
export const githubWriteFile=tool({name:'github_write_file',description:'Create or update a text file in the configured VALÉRIO GitHub repository. Use only when the user has requested a concrete code/content change.',parameters:z.object({path:z.string(),content:z.string(),message:z.string(),sha:z.string().optional()}),async execute({path,content,message,sha}){const r=await upsertRepoFile(path,content,message,sha);return {success:true,commit:r.data.commit.sha,path};}});

import { Octokit } from '@octokit/rest';
const token=process.env.GITHUB_TOKEN;
const owner=process.env.GITHUB_OWNER;
const repo=process.env.GITHUB_REPO;
const api=token?new Octokit({auth:token}):null;
export async function getRepoFile(path,ref){
  if(!api) throw new Error('GITHUB_TOKEN is not configured');
  const r=await api.repos.getContent({owner,repo,path,ref});
  if(Array.isArray(r.data)||r.data.type!=='file') throw new Error('Path is not a file');
  return Buffer.from(r.data.content,'base64').toString('utf8');
}
export async function upsertRepoFile(path,content,message,sha){
  if(!api) throw new Error('GITHUB_TOKEN is not configured');
  const params={owner,repo,path,message,content:Buffer.from(content).toString('base64')};
  if(sha) params.sha=sha;
  return api.repos.createOrUpdateFileContents(params);
}

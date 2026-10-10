import express, { Request, Response } from 'express';
import cors from 'cors';
import { db, queryRawAll, queryRawGet } from './db/database.js';
import { seedDatabase } from './db/seed.js';
import { calculateMatch, compareMatches, Candidate, Job, MatchResult } from './matching/engine.js';
import { runSqlDetective } from './sql-detective/run.js';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

app.use(cors());
app.use(express.json());

// Initialize / ensure DB is seeded upon launch
try {
  const candidateCount = queryRawGet<{ count: number }>('SELECT count(*) as count FROM candidates');
  if (!candidateCount || candidateCount.count === 0) {
    console.log('[Startup] Seeding database with initial candidates and jobs...');
    seedDatabase();
  }
} catch {
  console.log('[Startup] Table not found, seeding database...');
  seedDatabase();
}

/**
 * Health check
 */
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'RecruiterBot API', timestamp: new Date().toISOString() });
});

/**
 * POST /api/seed (or /seed) - Re-ingest initial dataset
 */
const handleSeed = (_req: Request, res: Response) => {
  try {
    seedDatabase();
    res.json({ message: 'Database successfully seeded with seed candidates and jobs.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to seed database', details: String(error) });
  }
};
app.post('/api/seed', handleSeed);
app.post('/seed', handleSeed);

/**
 * GET /api/jobs (or /jobs) - List all jobs
 */
const handleGetJobs = (_req: Request, res: Response) => {
  try {
    const jobs = queryRawAll<Job>('SELECT * FROM jobs ORDER BY id ASC');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs', details: String(error) });
  }
};
app.get('/api/jobs', handleGetJobs);
app.get('/jobs', handleGetJobs);

/**
 * GET /api/jobs/:id (or /jobs/:id) - Get single job
 */
const handleGetJobById = (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const job = queryRawGet<Job>('SELECT * FROM jobs WHERE id = ?', [id]);
    if (!job) {
      return res.status(404).json({ error: `Job with ID ${req.params.id} not found.` });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch job', details: String(error) });
  }
};
app.get('/api/jobs/:id', handleGetJobById);
app.get('/jobs/:id', handleGetJobById);

/**
 * GET /api/jobs/:id/matches (or /jobs/:id/matches)
 * Ranked candidates for a job with score and short reason
 */
const handleGetJobMatches = (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const job = queryRawGet<Job>('SELECT * FROM jobs WHERE id = ?', [id]);
    if (!job) {
      return res.status(404).json({ error: `Job with ID ${req.params.id} not found.` });
    }

    const candidates = queryRawAll<Candidate>('SELECT * FROM candidates');
    const matches: MatchResult[] = candidates
      .map(candidate => calculateMatch(candidate, job))
      .sort(compareMatches);

    res.json({
      job: {
        id: job.id,
        title: job.title,
        required_skills: job.required_skills,
        min_experience: job.min_experience,
        culture_keywords: job.culture_keywords,
        tagline: job.tagline,
      },
      matchCount: matches.length,
      matches,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to compute job matches', details: String(error) });
  }
};
app.get('/api/jobs/:id/matches', handleGetJobMatches);
app.get('/jobs/:id/matches', handleGetJobMatches);

/**
 * GET /api/candidates (or /candidates) - List all candidates
 */
const handleGetCandidates = (_req: Request, res: Response) => {
  try {
    const candidates = queryRawAll<Candidate>('SELECT * FROM candidates ORDER BY id ASC');
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch candidates', details: String(error) });
  }
};
app.get('/api/candidates', handleGetCandidates);
app.get('/candidates', handleGetCandidates);

/**
 * GET /api/candidates/:id (or /candidates/:id) - Get single candidate
 */
const handleGetCandidateById = (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const candidate = queryRawGet<Candidate>('SELECT * FROM candidates WHERE id = ?', [id]);
    if (!candidate) {
      return res.status(404).json({ error: `Candidate with ID ${req.params.id} not found.` });
    }
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch candidate', details: String(error) });
  }
};
app.get('/api/candidates/:id', handleGetCandidateById);
app.get('/candidates/:id', handleGetCandidateById);

/**
 * GET /api/candidates/:id/matches (or /candidates/:id/matches)
 * Ranked jobs for a candidate (reverse direction)
 */
const handleGetCandidateMatches = (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const candidate = queryRawGet<Candidate>('SELECT * FROM candidates WHERE id = ?', [id]);
    if (!candidate) {
      return res.status(404).json({ error: `Candidate with ID ${req.params.id} not found.` });
    }

    const jobs = queryRawAll<Job>('SELECT * FROM jobs');
    const matches: MatchResult[] = jobs
      .map(job => calculateMatch(candidate, job))
      .sort(compareMatches);

    res.json({
      candidate: {
        id: candidate.id,
        name: candidate.name,
        skills: candidate.skills,
        experience_years: candidate.experience_years,
        availability: candidate.availability,
        traits: candidate.traits,
        quirk: candidate.quirk,
      },
      matchCount: matches.length,
      matches,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to compute candidate matches', details: String(error) });
  }
};
app.get('/api/candidates/:id/matches', handleGetCandidateMatches);
app.get('/candidates/:id/matches', handleGetCandidateMatches);

/**
 * GET /api/sql-detective/run (or /sql-detective/run) - Run Part 2 SQL challenge
 */
const handleSqlDetectiveRun = (_req: Request, res: Response) => {
  try {
    const results = runSqlDetective();
    res.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      results,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to run SQL Detective queries', details: String(error) });
  }
};
app.get('/api/sql-detective/run', handleSqlDetectiveRun);
app.get('/sql-detective/run', handleSqlDetectiveRun);

// Start server
app.listen(PORT, () => {
  console.log(`[RecruiterBot] Server running at http://localhost:${PORT}`);
  console.log(`[RecruiterBot] Available endpoints:`);
  console.log(`  - GET  /jobs`);
  console.log(`  - GET  /jobs/:id/matches`);
  console.log(`  - GET  /candidates`);
  console.log(`  - GET  /candidates/:id/matches`);
  console.log(`  - POST /seed`);
  console.log(`  - GET  /sql-detective/run`);
});

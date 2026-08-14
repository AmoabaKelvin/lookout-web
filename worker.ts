// Wraps the OpenNext-generated worker to run the cron from vercel.json.
// The schedule is dispatched to its Next.js route through the
// WORKER_SELF_REFERENCE service binding with the Vercel-style bearer auth.
// @ts-ignore - generated at build time, has no type declarations
import handler from './.open-next/worker.js';

export default {
  fetch: handler.fetch,
  async scheduled(_controller: { cron: string }, env: Record<string, any>) {
    const res = await env.WORKER_SELF_REFERENCE.fetch(
      'https://lookout.kelvinamoaba.com/api/cron/evaluate',
      { headers: { authorization: `Bearer ${env.CRON_SECRET}` } }
    );
    if (!res.ok) {
      throw new Error(`cron evaluate failed: ${res.status} ${await res.text()}`);
    }
  },
};

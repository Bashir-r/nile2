import 'dotenv/config';
import path from 'node:path';
import { getDb, type DbClient } from '../server/db/client.ts';
import { ensureEssentialSeed } from '../server/db/essentialSeed.ts';
import { crawlAndGenerateSitemap, generateSitemapXml } from '../server/services/sitemapGenerator.ts';
import fs from 'node:fs';

async function main() {
  const distDir = path.resolve(process.cwd(), 'dist');
  const publicDir = path.resolve(process.cwd(), 'public');
  const outDirs = fs.existsSync(distDir) ? [distDir, publicDir] : [publicDir];

  let db: DbClient | null = null;
  try {
    db = await getDb();
    await ensureEssentialSeed(db);
    const result = await crawlAndGenerateSitemap(db, { outDirs });
    console.log(
      `[SITEMAP] Crawled database and wrote ${result.urlCount} URLs to ${result.writtenPaths.join(', ')}`
    );
  } catch (err) {
    // Allow static build step to complete cleanly in CI environments without DB connectivity
    const fallbackXml = generateSitemapXml({
      baseUrl: process.env.APP_URL || 'https://nilelink.lb',
      products: [],
      sellers: [],
      campaigns: [],
    });
    const written: string[] = [];
    for (const dir of outDirs) {
      fs.mkdirSync(dir, { recursive: true });
      const file = path.join(dir, 'sitemap.xml');
      fs.writeFileSync(file, fallbackXml, 'utf8');
      written.push(file);
    }
    console.warn(
      `[SITEMAP] Database unavailable during build (${(err as Error).message}); wrote core static sitemap to ${written.join(', ')}`
    );
  } finally {
    if (db) {
      await db.close().catch(() => {});
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[SITEMAP] Failed:', err);
    process.exit(1);
  });

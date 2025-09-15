import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the project root directory (where package.json is located)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

export class GlobalCache {
  private readonly cacheDir: string;
  private readonly sectionsDir: string;
  private readonly searchIndexDir: string;
  private readonly metadataDir: string;
  private readonly cacheInfoPath: string;

  constructor() {
    this.cacheDir = path.join(projectRoot, 'cache');
    this.sectionsDir = path.join(this.cacheDir, 'sections');
    this.searchIndexDir = path.join(this.cacheDir, 'search-index');
    this.metadataDir = path.join(this.cacheDir, 'metadata');
    this.cacheInfoPath = path.join(this.cacheDir, 'cache-info.json');
  }

  async ensureCacheDirectories(): Promise<void> {
    await fs.mkdir(this.sectionsDir, { recursive: true });
    await fs.mkdir(this.searchIndexDir, { recursive: true });
    await fs.mkdir(this.metadataDir, { recursive: true });
  }

  async getCacheInfo(): Promise<{ lastUpdated?: string; version?: string } | null> {
    try {
      const data = await fs.readFile(this.cacheInfoPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }

  async updateCacheInfo(info: { lastUpdated: string; version: string }): Promise<void> {
    await fs.writeFile(this.cacheInfoPath, JSON.stringify(info, null, 2), 'utf8');
  }

  async isCachePopulated(): Promise<boolean> {
    const cachedFiles = await this.getAllCachedFiles();
    return cachedFiles.length > 0;
  }

  async getCachedFile(filename: string): Promise<string | null> {
    try {
      const filePath = path.join(this.sectionsDir, filename);
      return await fs.readFile(filePath, 'utf8');
    } catch (error) {
      return null;
    }
  }

  async getAllCachedFiles(): Promise<string[]> {
    try {
      return await fs.readdir(this.sectionsDir);
    } catch (error) {
      return [];
    }
  }

  async getCachedSearchIndex(): Promise<string | null> {
    try {
      return await fs.readFile(path.join(this.searchIndexDir, 'keywords.md'), 'utf8');
    } catch (error) {
      return null;
    }
  }

  get cachePath(): string {
    return this.cacheDir;
  }

  get sectionPath(): string {
    return this.sectionsDir;
  }

  get searchIndexPath(): string {
    return this.searchIndexDir;
  }

  get metadataPath(): string {
    return this.metadataDir;
  }
}
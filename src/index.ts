// src/index.ts

import { resolve, join } from 'path';
import { readFileSync, readdirSync, statSync } from 'fs';
import type { Plugin } from 'vite';

export interface LLMSPluginOptions {
  /**
   * Directory containing llms.txt and markdown files
   * @default 'llms'
   */
  llmsDir?: string;
}

/**
 * Plugin to serve markdown files alongside your routes
 * following the llms.txt specification (https://llmstxt.org)
 */
export default function llmsRoutingPlugin(options: LLMSPluginOptions = {}): Plugin {
  const llmsDir = options.llmsDir || 'llms';
  let markdownRoutes: string[] = [];

  return {
    name: 'vite-llms-routing',
    
    configureServer(server) {
      // Handle .md route requests and llms.txt in dev mode
      server.middlewares.use(async (req, res, next) => {
        // Handle llms.txt request in root
        if (req.url === '/llms.txt') {
          const llmsTxtPath = resolve(process.cwd(), llmsDir, 'llms.txt');
          try {
            const content = readFileSync(llmsTxtPath, 'utf-8');
            res.setHeader('Content-Type', 'text/markdown');
            res.end(content);
            return;
          } catch (e) {
            next();
          }
        }
        
        // Handle .md routes
        if (req.url?.endsWith('.md')) {
          const markdownPath = resolve(process.cwd(), llmsDir, req.url.slice(1));
          try {
            const content = readFileSync(markdownPath, 'utf-8');
            res.setHeader('Content-Type', 'text/markdown');
            res.end(content);
            return;
          } catch (e) {
            next();
          }
        }
        next();
      });

      // Log available markdown routes on server start
      const files = getAllMarkdownFiles(resolve(process.cwd(), llmsDir));
      markdownRoutes = files.map(file => {
        const route = file.replace(resolve(process.cwd(), llmsDir), '').replace(/\\/g, '/');
        return route;
      });
      
      console.log('\nLLMS Plugin: Available markdown routes:');
      console.log('  /llms.txt');
      markdownRoutes.forEach(route => {
        console.log(`  ${route}`);
      });
    },

    async writeBundle() {
      try {
        // Copy llms.txt to build output root
        const llmsTxtPath = resolve(process.cwd(), llmsDir, 'llms.txt');
        this.emitFile({
          type: 'asset',
          fileName: 'llms.txt',
          source: readFileSync(llmsTxtPath, 'utf-8')
        });
        
        // Copy all markdown files preserving directory structure
        const markdownFiles = getAllMarkdownFiles(resolve(process.cwd(), llmsDir));
        markdownRoutes = [];

        for (const file of markdownFiles) {
          const relativePath = file.replace(resolve(process.cwd(), llmsDir), '').replace(/\\/g, '/');
          markdownRoutes.push(relativePath);
          
          this.emitFile({
            type: 'asset',
            fileName: relativePath.slice(1),
            source: readFileSync(file, 'utf-8')
          });
        }

        // Log build output information
        console.log('\nLLMS Plugin: Build complete');
        console.log('Copied files:');
        console.log('  /llms.txt');
        markdownRoutes.forEach(route => {
          console.log(`  ${route}`);
        });

      } catch (error) {
        console.error('LLMS Plugin: Error during build:', error);
      }
    }
  };
}

/**
 * Recursively find all markdown files in a directory
 * @param {string} dir - Directory to search
 * @returns {string[]} Array of absolute file paths
 */
function getAllMarkdownFiles(dir: string): string[] {
  let results: string[] = [];
  try {
    const files = readdirSync(dir);

    for (const file of files) {
      const filePath = join(dir, file);
      const stat = statSync(filePath);

      if (stat.isDirectory()) {
        results = results.concat(getAllMarkdownFiles(filePath));
      } else if (file.endsWith('.md')) {
        results.push(filePath);
      }
    }
  } catch (error) {
    console.error('LLMS Plugin: Error reading directory:', error);
  }

  return results;
}
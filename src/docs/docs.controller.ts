import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('docs')
export class DocsController {
  @Get()
  async getDocs(@Res() res: Response) {
    try {
      // Read the README.md file
      const readmePath = path.join(process.cwd(), 'README.md');
      const markdownContent = fs.readFileSync(readmePath, 'utf8');

      // Convert markdown to HTML using dynamic import
      const { marked } = await import('marked');
      const htmlContent = marked(markdownContent);

      // Create a styled HTML page
      const styledHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dialogua API Documentation</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        h2 {
            color: #34495e;
            margin-top: 30px;
            border-bottom: 2px solid #ecf0f1;
            padding-bottom: 8px;
        }
        h3 {
            color: #2980b9;
            margin-top: 25px;
        }
        h4 {
            color: #27ae60;
            margin-top: 20px;
        }
        code {
            background-color: #f1f2f6;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.9em;
        }
        pre {
            background-color: #2f3640;
            color: #f5f6fa;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 15px 0;
        }
        pre code {
            background: none;
            padding: 0;
            color: inherit;
        }
        blockquote {
            border-left: 4px solid #3498db;
            margin: 20px 0;
            padding: 10px 20px;
            background-color: #ecf0f1;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #3498db;
            color: white;
        }
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        .endpoint {
            background-color: #e8f5e8;
            border-left: 4px solid #27ae60;
            padding: 15px;
            margin: 15px 0;
            border-radius: 4px;
        }
        .method-get {
            color: #27ae60;
            font-weight: bold;
        }
        .method-post {
            color: #e74c3c;
            font-weight: bold;
        }
        .method-patch {
            color: #f39c12;
            font-weight: bold;
        }
        .method-delete {
            color: #c0392b;
            font-weight: bold;
        }
        a {
            color: #3498db;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        .toc {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .toc ul {
            margin: 0;
            padding-left: 20px;
        }
        .toc li {
            margin: 5px 0;
        }
        .badge {
            display: inline-block;
            padding: 3px 8px;
            font-size: 0.8em;
            font-weight: bold;
            border-radius: 12px;
            color: white;
            margin-right: 8px;
        }
        .badge-get { background-color: #27ae60; }
        .badge-post { background-color: #e74c3c; }
        .badge-patch { background-color: #f39c12; }
        .badge-delete { background-color: #c0392b; }
        .back-to-top {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #3498db;
            color: white;
            padding: 10px 15px;
            border-radius: 50px;
            text-decoration: none;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: background-color 0.3s;
        }
        .back-to-top:hover {
            background-color: #2980b9;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        ${htmlContent}
    </div>
    <a href="#" class="back-to-top">↑ Top</a>
    
    <script>
        // Add method badges to endpoints
        document.addEventListener('DOMContentLoaded', function() {
            const headings = document.querySelectorAll('h3, h4');
            headings.forEach(heading => {
                const text = heading.textContent;
                if (text.includes('GET ')) {
                    heading.innerHTML = text.replace('GET ', '<span class="badge badge-get">GET</span>');
                } else if (text.includes('POST ')) {
                    heading.innerHTML = text.replace('POST ', '<span class="badge badge-post">POST</span>');
                } else if (text.includes('PATCH ')) {
                    heading.innerHTML = text.replace('PATCH ', '<span class="badge badge-patch">PATCH</span>');
                } else if (text.includes('DELETE ')) {
                    heading.innerHTML = text.replace('DELETE ', '<span class="badge badge-delete">DELETE</span>');
                }
            });
            
            // Smooth scrolling for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        });
    </script>
</body>
</html>`;

      res.setHeader('Content-Type', 'text/html');
      res.send(styledHtml);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to load documentation',
        message: error.message,
      });
    }
  }
}
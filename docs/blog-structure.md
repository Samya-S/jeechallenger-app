# Blog Articles Structure

## Overview
Blog articles are stored as individual MDX files in the `data/blog/articles/` directory. Each article is a self-contained file with YAML frontmatter for metadata and markdown content.

## Structure

```
data/blog/articles/
├── article-slug-1.mdx
├── article-slug-2.mdx
├── article-slug-3.mdx
└── ...
```

## Key Features

### **File-Based Architecture**
- One article per MDX file
- Filename becomes the URL slug (e.g., `my-article.mdx` → `/blog/my-article`)
- Direct file editing with markdown syntax highlighting
- Clean separation between articles

### **Structured Metadata**
- YAML frontmatter for article properties
- Consistent schema across all articles
- Easy to parse and validate
- Supports custom fields

### **Developer Experience**
- Simple file operations (create, edit, delete)
- Version control friendly with isolated changes
- Linting and validation support
- Direct markdown preview in editors

### **Scalability**
- Handles large numbers of articles efficiently
- No single file bottlenecks
- Parallel collaboration support
- Fast build times

## Article Format

Each article file contains:

```markdown
---
title: "Article Title"
excerpt: "Brief description"
date: "YYYY-MM-DD"
author: "Author Name"
category: "Category"
readTime: "X min read"
keywords: "comma, separated, keywords"
hasMath: false
---

# Article content in Markdown

Your content here...
```

## Usage

### Get all articles:
```javascript
import { getAllArticles } from '@/lib/articles';

// Get all articles with content (default)
const articles = getAllArticles();

// Get all articles without content (for listing pages, better performance)
const articles = getAllArticles(false);
```

### Get single article:
```javascript
import { getArticleBySlug } from '@/lib/articles';

const article = getArticleBySlug('article-slug');
```

### Get by category:
```javascript
import { getArticlesByCategory } from '@/lib/articles';

const categoryArticles = getArticlesByCategory('Category');
```

### Get all categories:
```javascript
import { getAllCategories } from '@/lib/articles';

const categories = getAllCategories();
```

## Creating New Articles

To add a new article to the blog:

1. Create an `.mdx` file in `data/blog/articles/` with a kebab-case name
2. Add YAML frontmatter with required metadata fields
3. Write article content in Markdown below the frontmatter
4. The filename automatically becomes the URL slug

**Example:**
```bash
# Create: data/blog/articles/my-new-article.mdx
# URL: /blog/my-new-article
```

**Required frontmatter fields:**
- `title`: Article headline
- `excerpt`: Short description for listings
- `date`: Publication date (YYYY-MM-DD)
- `author`: Author name (empty string "" defaults to "JEE Challenger Team" in metadata)
- `category`: Article category
- `readTime`: Estimated reading time (e.g., "4 min read")
- `keywords`: SEO keywords (comma-separated string)
- `hasMath`: Boolean flag for LaTeX/KaTeX support (optional, default: false)

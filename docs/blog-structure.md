# Blog Articles Structure

## Overview
Blog articles have been restructured from a single monolithic JavaScript file to separate MDX files for better maintainability and scalability.

## Structure

```
data/blog/articles/
├── article-slug-1.mdx
├── article-slug-2.mdx
├── article-slug-3.mdx
└── ...
```

## Benefits

### 1. **Better Organization**
- Each article is in its own file
- Easy to find and edit specific articles
- Clear separation of concerns

### 2. **Cleaner Metadata**
- YAML frontmatter for structured metadata
- No need for JavaScript template literals
- Easy to validate and parse

### 3. **Easier to Maintain**
- Adding new articles: Just create a new `.mdx` file
- Editing articles: Direct markdown editing
- No post-processing needed
- Version control friendly (smaller diffs)

### 4. **Scalability**
- Can handle hundreds of articles without performance issues
- No single file bloat (old file was 1092 lines!)
- Easier collaboration (multiple people can work on different articles)

### 5. **Better Developer Experience**
- Markdown syntax highlighting in editors
- Linting and validation possible
- Preview markdown directly

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
---

# Article content in Markdown

Your content here...
```

## Usage

### Get all articles:
```javascript
import { getAllArticles } from '@/lib/articles';

const articles = getAllArticles();
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

## Adding New Articles

1. Create a new `.mdx` file in `data/blog/articles/`
2. Use kebab-case for filename (becomes the slug)
3. Add frontmatter with all required fields
4. Write content in Markdown
5. Save and rebuild

Example:
```bash
# Create new article
touch data/blog/articles/my-new-article.mdx

# Will be accessible at: /blog/my-new-article
```

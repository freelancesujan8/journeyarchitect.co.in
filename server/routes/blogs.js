import express from 'express';
import { db } from '../db/database.js';

export const blogsRouter = express.Router();

/**
 * GET /api/blogs — Fetch active blogs with optional category, search, and limit
 */
blogsRouter.get('/', (req, res) => {
  try {
    const { category, search, limit } = req.query;
    let query = `
      SELECT id, blog_id, slug, title, excerpt, category, author_name, author_role, author_avatar,
             published_date, read_time, hero_image, tags, content, featured, display_order, is_active, created_at
      FROM blogs
      WHERE is_active = 1
    `;
    const params = [];

    if (category && category !== 'All Guides' && category !== 'all') {
      query += ` AND category = ?`;
      params.push(category);
    }

    if (search && search.trim()) {
      query += ` AND (title LIKE ? OR excerpt LIKE ? OR category LIKE ? OR tags LIKE ?)`;
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    query += ` ORDER BY featured DESC, display_order ASC, id DESC`;

    if (limit && !isNaN(parseInt(limit, 10))) {
      query += ` LIMIT ?`;
      params.push(parseInt(limit, 10));
    }

    const rows = db.prepare(query).all(...params);

    const blogs = rows.map((row) => ({
      id: row.id,
      blog_id: row.blog_id,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      category: row.category,
      author: {
        name: row.author_name,
        role: row.author_role,
        avatar: row.author_avatar || (row.author_name ? row.author_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'JA')
      },
      publishedDate: row.published_date,
      readTime: row.read_time,
      heroImage: row.hero_image,
      tags: typeof row.tags === 'string' ? JSON.parse(row.tags || '[]') : (row.tags || []),
      content: typeof row.content === 'string' ? JSON.parse(row.content || '{}') : (row.content || {}),
      featured: Boolean(row.featured),
      display_order: row.display_order,
      is_active: row.is_active,
      created_at: row.created_at
    }));

    res.json({
      success: true,
      count: blogs.length,
      blogs
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch blogs' });
  }
});

/**
 * GET /api/blogs/:slug — Fetch a single blog by slug
 */
blogsRouter.get('/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const row = db.prepare(`
      SELECT id, blog_id, slug, title, excerpt, category, author_name, author_role, author_avatar,
             published_date, read_time, hero_image, tags, content, featured, display_order, is_active, created_at
      FROM blogs
      WHERE slug = ? AND is_active = 1
    `).get(slug);

    if (!row) {
      return res.status(404).json({ success: false, error: 'Blog post not found' });
    }

    const blog = {
      id: row.id,
      blog_id: row.blog_id,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      category: row.category,
      author: {
        name: row.author_name,
        role: row.author_role,
        avatar: row.author_avatar || (row.author_name ? row.author_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'JA')
      },
      publishedDate: row.published_date,
      readTime: row.read_time,
      heroImage: row.hero_image,
      tags: typeof row.tags === 'string' ? JSON.parse(row.tags || '[]') : (row.tags || []),
      content: typeof row.content === 'string' ? JSON.parse(row.content || '{}') : (row.content || {}),
      featured: Boolean(row.featured),
      display_order: row.display_order,
      is_active: row.is_active,
      created_at: row.created_at
    };

    res.json({ success: true, blog });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch blog post' });
  }
});

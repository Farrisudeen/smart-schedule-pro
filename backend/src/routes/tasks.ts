import { Router, Response } from 'express';
import { pool } from '../db';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// All task routes require authentication
router.use(authenticateToken);

// GET /api/tasks - Get all tasks for authenticated user
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  const { status, priority, category, startDate, endDate } = req.query;

  try {
    let query = `
      SELECT id, title, description, start_time, end_time, priority, status, category, color, created_at
      FROM tasks
      WHERE user_id = $1
    `;
    const params: (string | number | Date)[] = [req.userId!];
    let paramIndex = 2;

    if (status) {
      query += ` AND status = $${paramIndex++}`;
      params.push(status as string);
    }
    if (priority) {
      query += ` AND priority = $${paramIndex++}`;
      params.push(priority as string);
    }
    if (category) {
      query += ` AND category ILIKE $${paramIndex++}`;
      params.push(`%${category}%`);
    }
    if (startDate) {
      query += ` AND start_time >= $${paramIndex++}`;
      params.push(new Date(startDate as string));
    }
    if (endDate) {
      query += ` AND end_time <= $${paramIndex++}`;
      params.push(new Date(endDate as string));
    }

    query += ' ORDER BY start_time ASC';

    const result = await pool.query(query, params);
    res.json({ tasks: result.rows, count: result.rowCount });
  } catch (err) {
    console.error('Get tasks error:', err);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

// GET /api/tasks/:id - Get a single task
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get task error:', err);
    res.status(500).json({ message: 'Failed to fetch task' });
  }
});

// POST /api/tasks - Create a new task
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, description, start_time, end_time, priority, category, color } = req.body;

  if (!title || !start_time || !end_time) {
    res.status(400).json({ message: 'Title, start_time, and end_time are required' });
    return;
  }

  if (new Date(start_time) >= new Date(end_time)) {
    res.status(400).json({ message: 'start_time must be before end_time' });
    return;
  }

  try {
    // Check for time conflicts
    const conflict = await pool.query(
      `SELECT id, title FROM tasks
       WHERE user_id = $1
       AND status NOT IN ('cancelled', 'completed')
       AND tsrange(start_time, end_time) && tsrange($2::timestamp, $3::timestamp)`,
      [req.userId, start_time, end_time]
    );

    if (conflict.rows.length > 0) {
      res.status(409).json({
        message: `Time conflict with existing task: "${conflict.rows[0].title}"`,
        conflictTaskId: conflict.rows[0].id
      });
      return;
    }

    const result = await pool.query(
      `INSERT INTO tasks (user_id, title, description, start_time, end_time, priority, category, color)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [req.userId, title, description, start_time, end_time, priority || 'medium', category, color || '#4F46E5']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ message: 'Failed to create task' });
  }
});

// PUT /api/tasks/:id - Update a task
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, description, start_time, end_time, priority, status, category, color } = req.body;

  try {
    const existing = await pool.query(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );
    if (existing.rows.length === 0) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    const task = existing.rows[0];
    const newStart = start_time ? new Date(start_time) : task.start_time;
    const newEnd = end_time ? new Date(end_time) : task.end_time;

    if (newStart >= newEnd) {
      res.status(400).json({ message: 'start_time must be before end_time' });
      return;
    }

    // Check for time conflicts (exclude current task)
    const conflict = await pool.query(
      `SELECT id, title FROM tasks
       WHERE user_id = $1 AND id != $2
       AND status NOT IN ('cancelled', 'completed')
       AND tsrange(start_time, end_time) && tsrange($3::timestamp, $4::timestamp)`,
      [req.userId, req.params.id, newStart, newEnd]
    );

    if (conflict.rows.length > 0) {
      res.status(409).json({
        message: `Time conflict with existing task: "${conflict.rows[0].title}"`,
        conflictTaskId: conflict.rows[0].id
      });
      return;
    }

    const result = await pool.query(
      `UPDATE tasks
       SET title = $1, description = $2, start_time = $3, end_time = $4,
           priority = $5, status = $6, category = $7, color = $8
       WHERE id = $9 AND user_id = $10
       RETURNING *`,
      [
        title || task.title,
        description ?? task.description,
        newStart, newEnd,
        priority || task.priority,
        status || task.status,
        category ?? task.category,
        color || task.color,
        req.params.id, req.userId
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ message: 'Failed to update task' });
  }
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.userId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ message: 'Failed to delete task' });
  }
});

export default router;

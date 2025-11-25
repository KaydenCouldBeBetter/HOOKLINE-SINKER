import { Router } from 'express';
import { db } from '../database/connection';
import type { Image } from '../../shared/types';

const router = Router();

// Create a new image
function createImage(image: Image): number {
    const stmt = db.prepare(`
        INSERT INTO images (
            filename, original_filename, file_path,
            file_size, mime_type, width, height,
            alt_text, caption
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
        image.filename,
        image.original_filename || null,
        image.file_path,
        image.file_size || null,
        image.mime_type || null,
        image.width || null,
        image.height || null,
        image.alt_text || null,
        image.caption || null
    );

    return result.lastInsertRowid as number;
}

// Read all images
function getAllImages(): Image[] {
    const stmt = db.prepare('SELECT * FROM images ORDER BY uploaded_at DESC');
    return stmt.all() as Image[];
}

// Read a single image by ID
function getImageById(image_id: number): Image | null {
    const stmt = db.prepare('SELECT * FROM images WHERE image_id = ?');
    return stmt.get(image_id) as Image | null;
}

// Read image by filename
function getImageByFilename(filename: string): Image | null {
    const stmt = db.prepare('SELECT * FROM images WHERE filename = ?');
    return stmt.get(filename) as Image | null;
}

// Update an image
function updateImage(image_id: number, updates: Partial<Image>): boolean {
    const fields = Object.keys(updates)
        .filter(key => key !== 'image_id')
        .map(key => `${key} = ?`)
        .join(', ');

    if (!fields) return false;

    const values = Object.keys(updates)
        .filter(key => key !== 'image_id')
        .map(key => updates[key as keyof Image] ?? null);

    const stmt = db.prepare(`
        UPDATE images
        SET ${fields}
        WHERE image_id = ?
    `);

    const result = stmt.run(...values, image_id);
    return result.changes > 0;
}

// Delete an image
function deleteImage(image_id: number): boolean {
    const stmt = db.prepare('DELETE FROM images WHERE image_id = ?');
    const result = stmt.run(image_id);
    return result.changes > 0;
}

// Get image count
function getImageCount(): number {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM images');
    const result = stmt.get() as { count: number };
    return result.count;
}

// GET all images
router.get('/', (req, res) => {
    try {
        const images = getAllImages();
        res.json(images);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch images' });
    }
});

// GET image count
router.get('/count', (req, res) => {
    try {
        const count = getImageCount();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch image count' });
    }
});

// GET single image by ID
router.get('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const image = getImageById(id);
        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }
        res.json(image);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch image' });
    }
});

// POST create new image
router.post('/', (req, res) => {
    try {
        const image: Image = req.body;
        if (!image.filename || !image.file_path) {
            return res.status(400).json({ error: 'filename and file_path are required' });
        }
        const id = createImage(image);
        res.status(201).json({ id, message: 'Image created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create image' });
    }
});

// PUT update image
router.put('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const updates: Partial<Image> = req.body;
        const success = updateImage(id, updates);
        if (!success) {
            return res.status(404).json({ error: 'Image not found or no changes made' });
        }
        res.json({ message: 'Image updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update image' });
    }
});

// DELETE image
router.delete('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const success = deleteImage(id);
        if (!success) {
            return res.status(404).json({ error: 'Image not found' });
        }
        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete image' });
    }
});

export default router;
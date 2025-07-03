/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management & authentication
 */

const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads/id-images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage }).fields([
  { name: 'passport', maxCount: 1 },
  { name: 'front', maxCount: 1 },
  { name: 'back', maxCount: 1 }
]);

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - phoneNumber
 *               - passport
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               email: { type: string, format: email }
 *               phoneNumber: { type: string }
 *               passport: { type: string, format: binary }
 *               front: { type: string, format: binary }
 *               back: { type: string, format: binary }
 *               password: { type: string, format: password }
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post('/register', upload, userCtrl.register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login and get JWT token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login success
 */
router.post('/login', userCtrl.login);

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Update logged-in user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               phoneNumber: { type: string }
 *               passport: { type: string, format: binary }
 *               front: { type: string, format: binary }
 *               back: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Updated user profile
 */
router.put('/me', auth, upload, userCtrl.updateSelf);


/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile returned
 *       401:
 *         description: Unauthorized
 */

router.get('/me', auth, userCtrl.getProfile);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', auth, role(['admin']), userCtrl.getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Admin updates any user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName: { type: string }
 *               role: { type: string }
 *               passport: { type: string, format: binary }
 *               front: { type: string, format: binary }
 *               back: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: User updated
 */
router.put('/:id', auth, role(['admin']), upload, userCtrl.updateUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Admin deletes a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete('/:id', auth, role(['admin']), userCtrl.deleteUserById);


module.exports = router;

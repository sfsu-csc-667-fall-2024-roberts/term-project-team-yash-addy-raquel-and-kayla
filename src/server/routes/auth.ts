import express, { Router, Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import { UserModel } from '../models/user';
import { authenticate } from '../middleware/auth';

const router = Router();

// Validation middleware
const registerValidation = [
  check('username').notEmpty().trim().escape(),
  check('email').isEmail().normalizeEmail(),
  check('password').isLength({ min: 6 })
];

const loginValidation = [
  check('email').isEmail().normalizeEmail(),
  check('password').notEmpty()
];

// GET register page
router.get('/register', (_req: Request, res: Response) => {
  res.render('auth/register', { title: 'Register' });
});

// GET login page
router.get('/login', (_req: Request, res: Response) => {
  res.render('auth/login', { title: 'Login' });
});

// Register route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const gravatarUrl = `https://www.gravatar.com/avatar/${crypto
        .createHash('md5')
        .update(email.trim().toLowerCase())
        .digest('hex')}?d=identicon`;

    const user = await UserModel.create({
      username,
      email,
      password,
      gravatar: gravatarUrl,
    });

    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      gravatar: user.gravatar,
    };

    res.redirect('/');
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).render('auth/register', { error: 'Internal Server Error' });
  }
});


// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).render('auth/login', { error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).render('auth/login', { error: 'Invalid credentials' });
    }

    // Ensure gravatar is included in the session
    const { password_hash, ...userWithoutPassword } = user;
    req.session.user = {
      ...userWithoutPassword,
      gravatar: user.gravatar || 'default_gravatar_url', // Use default if gravatar is missing
    };

    res.redirect('/');
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).render('auth/login', { error: 'Internal Server Error' });
  }
});


// Get current user route
router.get('/me', authenticate, async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.user!.id);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  const { password_hash, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

export default router;

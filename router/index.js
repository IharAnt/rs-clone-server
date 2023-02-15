const Router = require('express').Router;
const userController = require('../controllers/UserController');
const taskController = require('../controllers/TaskController');
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/AuthMiddleware');

const router = new Router();

router.post('/registration',
  body('email').isEmail(),
  body('password').isLength({min: 4, max: 100}),
  userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);

router.post('/task', authMiddleware, taskController.createTask);

module.exports = router;
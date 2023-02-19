const Router = require('express').Router;
const userController = require('../controllers/UserController');
const taskController = require('../controllers/TaskController');
const ratingController = require('../controllers/RatingController');
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
router.get('/profile/:userId', authMiddleware, userController.getProfile);
router.put('/profile/:userId', authMiddleware, userController.updateProfile);

router.post('/task', authMiddleware, taskController.createTask);
router.put('/task/:taskId', authMiddleware, taskController.updateTask);
router.get('/task/executor/:userId', authMiddleware, taskController.getExecutorTasks);
router.get('/task/inspector/:userId', authMiddleware, taskController.getInspectorTasks);

router.get('/rating/getAchivements', authMiddleware, ratingController.getAchievements);
router.get('/rating', ratingController.getRating);
router.post('/rating/addAchivement', authMiddleware, ratingController.addAchievement);

module.exports = router;
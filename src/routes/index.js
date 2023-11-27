const express = require('express');
const {body} = require('express-validator');
const authenticate = require('../middleware/authenticate');
const playerController = require('../controllers/player');
const excelController = require('../controllers/excelController');
const uploadImage = require('../middleware/upload-image');
const router = express.Router();
const login = require('../auth/auth');
const register = require('../auth/register');
const forgotPasswordRouter = require('../auth/forgotPassword');

router.post('/login', login);
router.post('/register', register);
router.use('/forgot-password', forgotPasswordRouter);

//need authenticate
router.use(authenticate);
router.get('/export-to-excel', excelController.exportPlayersToExcel);
router.get('/players', playerController.getAllPlayers);
router.get('/player/:playerId', playerController.getSinglePlayer);
router.delete('/player/:playerId', playerController.deletePlayer);
router.post('/player', uploadImage,
    [
        body('name')
            .notEmpty()
            .withMessage('Please enter player name!'),
        body('age')
            .notEmpty()
            .withMessage("Please enter the player's age")
            .isInt()
            .withMessage("Age must be an integer"),
        body('bio')
            .trim()
            .notEmpty()
            .withMessage("Please enter the player's biography")
            .isLength({min: 15})
            .withMessage('The biography must be at least 15 characters'),
    ],
    playerController.addPlayer
);

router.put('/player/:playerId', uploadImage,
    [
        body('name')
            .notEmpty()
            .withMessage('Please enter player name!'),
        body('age')
            .notEmpty()
            .withMessage("Please enter the player's age")
            .isInt()
            .withMessage("Age must be an integer"),
        body('bio')
            .trim()
            .notEmpty()
            .withMessage("Please enter the player's biography")
            .isLength({min: 15})
            .withMessage('The biography must be at least 15 characters'),
    ],
    playerController.updatePlayer);

module.exports = router;

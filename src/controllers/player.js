const Player = require('../models/player');
const sydFunctions = require('../utils/syd-functions');

exports.getAllPlayers = async (req, res, next) => {
    try {
        const pageIndex = req.query.pageIndex ? parseInt(req.query.pageIndex) : 1;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
        const searchName = req.query.name || ''; // Thêm tham số tìm kiếm theo tên
        const searchAge = req.query.age || ''; // Thêm tham số tìm kiếm theo tuổi

        // Xây dựng điều kiện tìm kiếm
        const searchConditions = {
            $and: [
                { name: { $regex: new RegExp(searchName, 'i') } }, // Tìm theo name (không phân biệt chữ hoa chữ thường)
                {
                    age: {
                        $gte: Number.isInteger(parseInt(searchAge)) ? parseInt(searchAge) : 0,
                        $lte: Number.isInteger(parseInt(searchAge)) ? parseInt(searchAge) : Number.MAX_SAFE_INTEGER,
                    },
                },
            ],
        };

        const totalPlayers = await Player.countDocuments(searchConditions);
        const players = await Player.find(searchConditions)
            .skip((pageIndex - 1) * pageSize)
            .limit(pageSize);

        res.status(200).json({
            message: "List of players",
            pageIndex: pageIndex,
            pageSize: pageSize,
            totalPlayers: totalPlayers,
            list: players,
        });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: 'Recovery failed!', error: error.message });
    }
};


exports.getSinglePlayer = async (req, res, next) => {
    const playerId = req.params.playerId;
    try {
        const player = await Player.findById(playerId)
        if (!player) {
            return res.status(404).json({ message: 'Player not found!' });
        }
        res.status(200).json({ message: "Retrieved player", player: player });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: 'Recovery failed!' });
    }

};

exports.addPlayer = async (req, res, next) => {
    const errorMessage = sydFunctions.validators(req, res);
    console.log('Retrieved errorMessage', errorMessage);
    if (errorMessage) {
        return res.status(422).json({ message: 'Validation error', error: errorMessage });
    }
    // if (!req.file) {
    //     return res.status(422).json({ message: 'Please add an image!' });
    // }

    const player = new Player({
        name: req.body.name,
        age: req.body.age,
        bio: req.body.bio,
        photoUrl: req.file && req.file.path.replace("\\", "/") // If you are on Linux or Mac just use req.file.path
    });

    try {
        const result = await player.save()
        console.log('result', result);
        return res.status(201).json({
            message: "Player is successfully added!",
            player: result
        });
    } catch (error) {
        console.log('error', error);
        if (req.file) {
            sydFunctions.deleteImage(player.photoUrl);
        }
        res.status(500).json({ message: 'Creation failed!' });
    }
};

exports.updatePlayer = async (req, res, next) => {
    const errorMessage = sydFunctions.validators(req, res);
    console.log('Retrieved errorMessage', errorMessage);
    if (errorMessage) {
        return res.status(422).json({ message: 'Validation failed!', error: errorMessage });
    }

    let photoUrl = req.body.image;
    if (req.file) {
        photoUrl = req.file.path.replace("\\", "/");
    }
    if (!photoUrl) {
        return res.status(422).json({ message: 'Please add an image!' });
    }

    const playerId = req.params.playerId;
    try {
        const player = await Player.findById(playerId);
        if (!player) {
            sydFunctions.deleteImage(req.file.path.replace("\\", "/"));
            return res.status(404).json({ message: 'Player not found!' });
        }
        if (photoUrl !== player.photoUrl) {
            sydFunctions.deleteImage(player.photoUrl);
        }
        player.name = req.body.name;
        player.age = req.body.age;
        player.bio = req.body.bio;
        player.photoUrl = photoUrl;
        const result = await player.save();
        res.status(200).json({ 'message': 'Modification successfully completed!', player: result });

    } catch (error) {
        console.log('error', error);
        if (req.file) {
            sydFunctions.deleteImage(player.photoUrl);
        }
        res.status(500).json({ message: 'Update failed!' });
    }

};

exports.deletePlayer = async (req, res, next) => {
    const playerId = req.params.playerId;
    try {
        const player = await Player.findById(playerId);
        if (!player) {
            return res.status(404).json({ message: 'Player not found!' });
        }

        sydFunctions.deleteImage(player.photoUrl);
        await Player.findByIdAndRemove(playerId);
        res.status(200).json({ 'message': 'Deletion completed successfully!' });

    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: 'Delete failed!' });
    }
};


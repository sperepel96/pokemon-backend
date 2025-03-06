const User = require("../models/User");
const Fight = require("../models/Fight");

const getUserFightsHistory = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const{sortOrder}= req.query;
    try {
        const skip = (page - 1) * limit;
        const sortingOrder = sortOrder || "desc";

        const userAddress = req.user.address;
        const user = await User.findOne({address: userAddress})

        const totalFights = await Fight.countDocuments({player: user._id});
        //
        const totalPages = Math.ceil(totalFights / limit);

        const fights = await Fight.find({ player: user._id})
            .populate("attacks")
            .populate("pokemon.player")
            .populate("pokemon.server")
            .sort({createdAt:sortingOrder })
            .skip(skip)
            .limit(limit).exec();
        if (!user) {
            return res.status(404).json({ error: 'USer not found' });
        }
        res.status(200).json({
            data: {fights:fights, user:user, totalPages},
            success: true,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Unable to fetch fight history' });
    }
};

module.exports = { getUserFightsHistory };
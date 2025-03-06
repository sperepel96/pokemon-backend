const mongoose = require("mongoose");

const TypeSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    effective: [{type: String}],
    ineffective: [{type: String}],
    noEffect: [{type: String}]
});

const Type = mongoose.model("Type", TypeSchema);

module.exports = Type;
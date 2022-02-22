const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    email: { type: String, require: true, unique: true },
    name: String,
    age: Number,
    numberPhone: String,
    password: { type: String, require: true },
    avatar: {type: String, default:"https://scontent.fsgn8-2.fna.fbcdn.net/v/t39.30808-6/241214347_2971882606409135_4060833953803005321_n.jpg?_nc_cat=110&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=VyTyEkuLAU0AX-cQWtq&_nc_ht=scontent.fsgn8-2.fna&oh=00_AT-hiluhGv0d2fxAPSVA-QDPn08n0krVJrHH57-_QTz3IQ&oe=62189B38"},
    },{ timestamps: true }
);

module.exports = mongoose.model('Member',memberSchema);

const mongoose = require('mongoose');
const Player = require('./models/Player');
const Group = require('./models/Group');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fantasydb';

const playersData = [ {
    team: "Inter Milan",
    players: [
      { name: "Chibuike Success", marketvalue: 10, position: "Goalkeeper", team: "Inter Milan" },
      { name: "Okoye Nelson", marketvalue: 9.5, position: "Defender", team: "Inter Milan" },
      { name: "Nnadozie Destiny", marketvalue: 10.5, position: "Defender", team: "Inter Milan" },
      { name: "Ukonu Anointing", marketvalue: 15, position: "Defender", team: "Inter Milan" },
      { name: "Ibe Emmanuel", marketvalue: 5, position: "Defender", team: "Inter Milan" },
      { name: "Nwankwo Osita", marketvalue: 10, position: "Defender", team: "Inter Milan" },
      { name: "Chukwunedum Samuel", marketvalue: 7.5, position: "Midfielder", team: "Inter Milan" },
      { name: "James Nkwumah", marketvalue: 5, position: "Defender", team: "Inter Milan" },
      { name: "Okonkwo Gerard", marketvalue: 5, position: "Midfielder", team: "Inter Milan" },
      { name: "Nnaji Michael", marketvalue: 8, position: "Midfielder", team: "Inter Milan" },
      { name: "Iheanacho Praise", marketvalue: 5, position: "Defender", team: "Inter Milan" },
      { name: "Chimaeze Owen", marketvalue: 10, position: "Defender", team: "Inter Milan" },
      { name: "Ezeugo Enu", marketvalue: 10, position: "Forward", team: "Inter Milan" },
      { name: "Muodifo Mac Donald", marketvalue: 10, position: "Forward", team: "Inter Milan" },
      { name: "Okwudiri Solomon", marketvalue: 10, position: "Forward", team: "Inter Milan" },
      { name: "Eke Emmanuel", marketvalue: 7.5, position: "Forward", team: "Inter Milan" },
      { name: "Emole Jules", marketvalue: 7, position: "Forward", team: "Inter Milan" }
    ]
  },
  {
    team: "AC Milan",
    players: [
      { name: "Nnona Kelvin", marketvalue: 15, position: "Goalkeeper", team: "AC Milan" },
      { name: "Egemole Henry", marketvalue: 10, position: "Defender", team: "AC Milan" },
      { name: "Uzoma Perfect", marketvalue: 8, position: "Defender", team: "AC Milan" },
      { name: "Ibezue Chinedu", marketvalue: 8, position: "Defender", team: "AC Milan" },
      { name: "Onuoha Oscar", marketvalue: 8.5, position: "Defender", team: "AC Milan" },
      { name: "Nnadozie Divine", marketvalue: 10, position: "Midfielder", team: "AC Milan" },
      { name: "Okoye Victor", marketvalue: 11, position: "Defender", team: "AC Milan" },
      { name: "Illona Princewill", marketvalue: 11, position: "Midfielder", team: "AC Milan" },
      { name: "Opara Johnson", marketvalue: 12, position: "Midfielder", team: "AC Milan" },
      { name: "Chibuike Faithful", marketvalue: 8, position: "Midfielder", team: "AC Milan" },
      { name: "Ifejiagwa Ikechukwu", marketvalue: 20, position: "Midfielder", team: "AC Milan" },
      { name: "Enuka Ramsey", marketvalue: 4, position: "Midfielder", team: "AC Milan" },
      { name: "Nkumah Udoh Kenneth", marketvalue: 10, position: "Defender", team: "AC Milan" },
      { name: "Dike Kelechi", marketvalue: 20, position: "Midfielder", team: "AC Milan" },
      { name: "Uwandu Delight", marketvalue: 4.5, position: "Forward", team: "AC Milan" },
      { name: "Kingsley Ibezue", marketvalue: 10, position: "Forward", team: "AC Milan" },
      { name: "Ndubisi Success", marketvalue: 10, position: "Forward", team: "AC Milan" }
    ]
  },
  {
    team: "Juventus",
    players: [
      { name: "Egbe Bethel", marketvalue: 12, position: "Goalkeeper", team: "Juventus" },
      { name: "Igbonacho Sixtus", marketvalue: 14, position: "Defender", team: "Juventus" },
      { name: "Joseph Prosper", marketvalue: 10, position: "Defender", team: "Juventus" },
      { name: "Augustine Okechukwu", marketvalue: 10, position: "Defender", team: "Juventus" },
      { name: "Okezie David", marketvalue: 8, position: "Defender", team: "Juventus" },
      { name: "Onyema Victor", marketvalue: 10, position: "Defender", team: "Juventus" },
      { name: "Nwankwo Chukwuemeka", marketvalue: 13, position: "Defender", team: "Juventus" },
      { name: "Michael Anudu", marketvalue: 10, position: "Defender", team: "Juventus" },
      { name: "Goodluck Amaefule", marketvalue: 6, position: "Defender", team: "Juventus" },
      { name: "Chukwuma Justin", marketvalue: 13, position: "Midfielder", team: "Juventus" },
      { name: "Nwankwo Tobenna", marketvalue: 10, position: "Midfielder", team: "Juventus" },
      { name: "Kingsley Ezeagu", marketvalue: 13, position: "Forward", team: "Juventus" },
      { name: "Onuoha Isaac", marketvalue: 7, position: "Midfielder", team: "Juventus" },
      { name: "Nwachukwu Martins", marketvalue: 11, position: "Forward", team: "Juventus" },
      { name: "Ofoma Raphael", marketvalue: 11, position: "Midfielder", team: "Juventus" },
      { name: "Onuoha Samuel", marketvalue: 13, position: "Forward", team: "Juventus" },
      { name: "Ernest Kelvin", marketvalue: 9, position: "Midfielder", team: "Juventus" },
      { name: "Amanze Chimdi", marketvalue: 0, position: "Defender", team: "Juventus" }
    ]
  },
  {
    team: "Napoli",
    players: [
      { name: "Uchechris Prosper", marketvalue: 12, position: "Defender", team: "Napoli" },
      { name: "Iheji Joseph", marketvalue: 9, position: "Defender", team: "Napoli" },
      { name: "Alabogu Ernest", marketvalue: 6, position: "Defender", team: "Napoli" },
      { name: "Moses Patric", marketvalue: 5, position: "Defender", team: "Napoli" },
      { name: "Dike Ogbuogu", marketvalue: 18, position: "Defender", team: "Napoli" },
      { name: "Ejike Noble", marketvalue: 3, position: "Defender", team: "Napoli" },
      { name: "Dim Obinna", marketvalue: 3, position: "Defender", team: "Napoli" },
      { name: "C. Miracle Chidiebere", marketvalue: 3, position: "Midfielder", team: "Napoli" },
      { name: "Okoye Richard", marketvalue: 22, position: "Midfielder", team: "Napoli" },
      { name: "Uchechukwu Uka", marketvalue: 8, position: "Defender", team: "Napoli" },
      { name: "Emmanuel Victor", marketvalue: 6, position: "Forward", team: "Napoli" },
      { name: "Kalu Eke", marketvalue: 21, position: "Midfielder", team: "Napoli" },
      { name: "Nnaji Temple", marketvalue: 18, position: "Forward", team: "Napoli" },
      { name: "Ogueri Henry", marketvalue: 9, position: "Forward", team: "Napoli" },
      { name: "Kalu Jules", marketvalue: 8, position: "Forward", team: "Napoli" },
      { name: "Ayomide Abayomi", marketvalue: 25, position: "Goalkeeper", team: "Napoli" },
      { name: "Okoronkwo Akachukwu", marketvalue: 25, position: "Forward", team: "Napoli" }
    ]
  }

];

const groupsData = [
  { name: "Class A League", code: "CLASSA23" },
  { name: "Science League", code: "SCIENCE22" },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    await Player.deleteMany({});
    console.log("Cleared existing players");

    await Group.deleteMany({});
    console.log("Cleared existing groups");

    const allPlayers = [];
    playersData.forEach(team => team.players.forEach(p => allPlayers.push(p)));

    const insertedPlayers = await Player.insertMany(allPlayers);
    console.log(`Inserted ${insertedPlayers.length} players`);

    const insertedGroups = await Group.insertMany(groupsData);
    console.log(`Inserted ${insertedGroups.length} groups`);

    console.log("Seeding complete");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  }
}

seed();
// Validation script for player data
const players = require('./fantasydb.players.json');

console.log('🔍 Validating Player Data...\n');

// Check total players
console.log(`📊 Total players: ${players.length}`);

// Team distribution
const teamCount = {};
const positionCount = {};
let issues = [];

players.forEach((player, index) => {
  // Count teams and positions
  teamCount[player.team] = (teamCount[player.team] || 0) + 1;
  positionCount[player.position] = (positionCount[player.position] || 0) + 1;
  
  // Check for data issues
  if (!player.name || player.name.trim() === '') {
    issues.push(`Player ${index + 1}: Missing name`);
  }
  
  if (!player.team || player.team.trim() === '') {
    issues.push(`Player ${index + 1}: Missing team`);
  }
  
  if (!player.position || player.position.trim() === '') {
    issues.push(`Player ${index + 1}: Missing position`);
  }
  
  if (player.marketvalue === undefined || player.marketvalue < 0) {
    issues.push(`Player ${index + 1} (${player.name}): Invalid market value`);
  }
  
  if (player.marketvalue === 0) {
    issues.push(`Player ${index + 1} (${player.name}): Market value is 0`);
  }
});

// Display team distribution
console.log('\n🏆 Team Distribution:');
Object.entries(teamCount).forEach(([team, count]) => {
  console.log(`  ${team}: ${count} players`);
});

// Display position distribution
console.log('\n⚽ Position Distribution:');
Object.entries(positionCount).forEach(([position, count]) => {
  console.log(`  ${position}: ${count} players`);
});

// Display issues
if (issues.length > 0) {
  console.log('\n❌ Issues Found:');
  issues.forEach(issue => console.log(`  ${issue}`));
} else {
  console.log('\n✅ No data issues found!');
}

// Check formation requirements
const goalkeepers = positionCount['Goalkeeper'] || 0;
const defenders = positionCount['Defender'] || 0;
const midfielders = positionCount['Midfielder'] || 0;
const forwards = positionCount['Forward'] || 0;

console.log('\n🔧 Fantasy Team Requirements:');
console.log(`  Minimum players needed for a team: 11`);
console.log(`  Available Goalkeepers: ${goalkeepers}`);
console.log(`  Available Defenders: ${defenders}`);
console.log(`  Available Midfielders: ${midfielders}`);
console.log(`  Available Forwards: ${forwards}`);

if (goalkeepers >= 1 && defenders >= 3 && midfielders >= 3 && forwards >= 1) {
  console.log('✅ Sufficient players for fantasy teams');
} else {
  console.log('❌ Insufficient players for fantasy teams');
}

console.log('\n🎯 Validation Complete!');

import React from 'react';

export default function TeamCard({ team }) {
  return (
    <div className="team-card">
      <h2>{team.name}</h2>
      <div className="players">
        {team.players.map(player => (
          <div key={player._id}>
            {player.name} ({player.position}) - ${player.marketvalue}M
          </div>
        ))}
      </div>
    </div>
  );
}

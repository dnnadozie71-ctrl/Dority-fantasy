// frontend/src/components/PlayerCard.js
import React from "react";
import "./PlayerCard.css";

export default function PlayerCard({ player, onBuy, onSell }) {
  return (
    <div className="player-card">
      <h3>{player.name}</h3>
      <p>Team: {player.team}</p>
      <p>Position: {player.position}</p>
      <p>Price: ${player.price}M</p>

      <div className="player-actions">
        {onBuy && (
          <button className="buy-btn" onClick={onBuy}>
            Buy
          </button>
        )}
        {onSell && (
          <button className="sell-btn" onClick={onSell}>
            Sell
          </button>
        )}
      </div>
    </div>
  );
}

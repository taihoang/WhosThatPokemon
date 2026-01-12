'use client';

interface ScoreBoardProps {
  score: number;
  round: number;
}

export default function ScoreBoard({ score, round }: ScoreBoardProps) {
  return (
    <div className="score-board">
      <div className="score-item">
        <span className="score-label">Score</span>
        <span className="score-value">{score}</span>
      </div>
      <div className="score-item">
        <span className="score-label">Round</span>
        <span className="score-value">{round}</span>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';

const VoteBlock = () => {
  const [votes, setVotes] = useState<number>(0);
  const [isVoting, setIsVoting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVotes = async () => {
    try {
      const response = await fetch('/.netlify/functions/vote');
      const data = await response.json();
      setVotes(data.votes);
    } catch (err) {
      setError('Failed to fetch votes');
      console.error('Error fetching votes:', err);
    }
  };

  useEffect(() => {
    fetchVotes();
  }, []);

  const handleVote = async () => {
    try {
      setIsVoting(true);
      const response = await fetch('/.netlify/functions/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setVotes(data.votes);
      setError(null);
    } catch (err) {
      setError('Failed to submit vote');
      console.error('Error voting:', err);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm">
      <button
        onClick={handleVote}
        disabled={isVoting}
        className={`flex items-center gap-2 px-4 py-2 text-white rounded-full transition-colors ${
          isVoting
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        <ThumbsUp className="w-5 h-5" />
        <span>{isVoting ? 'Voting...' : 'Vote'}</span>
      </button>
      <div className="mt-2 text-center">
        <p className="text-lg font-semibold text-gray-700">
          {votes} {votes === 1 ? 'vote' : 'votes'}
        </p>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    </div>
  );
};

export default VoteBlock;

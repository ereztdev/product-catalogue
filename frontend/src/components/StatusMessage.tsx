import React from 'react';

interface StatusMessageProps {
  message: { text: string; type: 'success' | 'error' | 'info' } | null;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className={`status ${message.type}`}>
      {message.text}
    </div>
  );
};

export default StatusMessage;

export const DESKTOP_PLACEHOLDERS = [
  "Ask me anything about JEE preparation...",
  "Ask a question on Physics, Chemistry, or Mathematics...",
  "Need help solving a difficult problem? Ask here...",
  "Ask about study plans, formula derivations, or concepts...",
  "Type your question or attach a problem to solve...",
  "Ask about JEE Main & Advanced strategies..."
];

export const MOBILE_PLACEHOLDERS = [
  "Ask a JEE question...",
  "Ask anything about JEE...",
  "Ask Physics, Chem or Maths...",
  "Type your question here...",
  "Ask for help with a problem...",
  "Ask a concept or formula..."
];

export const parseApiError = async (response, defaultMessage) => {
  try {
    const errorData = await response.text();
    try {
      const jsonError = JSON.parse(errorData);
      const serverMessage = jsonError.detail || jsonError.message || jsonError.error;
      if (serverMessage && typeof serverMessage === 'string') {
        return serverMessage;
      }
    } catch {
      if (errorData && typeof errorData === 'string' && errorData.length < 250 && !errorData.includes('<!DOCTYPE')) {
        return errorData;
      }
    }
  } catch {
    // Response stream could not be read
  }

  // Graceful fallbacks only if server returned no body or unparseable HTML
  if (response.status === 429) {
    return "You've sent too many requests. Please wait a moment before trying again.";
  }
  return defaultMessage;
};

// Group messages by date
export const groupMessagesByDate = (messages) => {
  const groups = {};

  messages.forEach((message) => {
    const date = new Date(message.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateKey;
    if (date.toDateString() === today.toDateString()) {
      dateKey = "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateKey = "Yesterday";
    } else {
      dateKey = date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
  });

  // Sort messages within each group by timestamp
  Object.keys(groups).forEach(dateKey => {
    groups[dateKey].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  });

  return groups;
};

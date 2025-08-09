const getTitleFromText = (text) => {
    const fisrtLine = (text || '').trim().split('\n')[0] || 'Без названия';
    return fisrtLine.slice(0, 80);
}

const getId = () => {
    return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

const formatDateTime = (dateTime) => {
  const newDateTime = new Date(dateTime);
  return newDateTime.toLocaleString();
}

export {
    getTitleFromText,
    getId,
    formatDateTime
}
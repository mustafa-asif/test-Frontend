import React, { useEffect, useState } from 'react';
import { xFetch } from '../../../utils/constants';
import { getHumanDate } from '../../../utils/constants';
import { useStoreState } from 'easy-peasy';
import { globalFilterToQuery } from '../../../utils/misc';
import { StatusCombobox } from '../../shared/StatusCombobox';
import { IconInput } from '../../shared/Input';
import { useTranslation } from '../../../i18n/provider';

// Simple hash function to generate consistent colors for names
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return hash;
}

// Get a color from a predefined palette based on name
function getColorForName(name) {
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  const index = Math.abs(hashString(name)) % colors.length;
  return colors[index];
}

function LetterAvatar({ name }) {
  if (!name) return null;
  const letter = name.charAt(0).toUpperCase();
  const colorClass = getColorForName(name);
  
  return (
    <div className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center flex-shrink-0`}>
      <span className="text-white text-sm font-medium">{letter}</span>
    </div>
  );
}

function TicketHistoryCard({ ticket, onClick, user }) {
  const tl = useTranslation();
  // Get followup user name if available
  const followupName = ticket.followup?.name || null;
  // Get last message and its timestamp
  const lastMsg = ticket.messages && ticket.messages.length > 0 ? ticket.messages[ticket.messages.length - 1] : null;
  const lastMsgText = lastMsg ? lastMsg.text : '';
  const lastMsgTime = lastMsg ? getHumanDate(lastMsg.timestamps?.created) : '';
  const lastMsgSender = lastMsg ? lastMsg.user?.name : '';

  // Unread logic: last message is from followup, not seen by user
  const isUnread = lastMsg && lastMsg.user?.role === 'followup' && !lastMsg.seen?.some(s => s.user._id === user._id);

  // Status badge color mapping
  const statusColors = {
    opened: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
    urgent: 'bg-red-100 text-red-800',
    stalled: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <div
      className="bg-white hover:bg-gray-50 transition cursor-pointer relative py-3 px-4 border-b flex gap-3 items-start"
      onClick={onClick}
    >
      {/* Avatar */}
      <LetterAvatar name={lastMsgSender} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Sender, Status, and Time */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">{lastMsgSender}</span>
            {ticket.status && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[ticket.status]}`}>
                {tl(ticket.status)}
              </span>
            )}
            <span className="text-xs text-gray-500">· {lastMsgTime}</span>
          </div>
          {isUnread && (
            <div className="h-2 w-2 bg-red-500 rounded-full"></div>
          )}
        </div>

        {/* Message Text */}
        <div className="text-sm text-gray-600 line-clamp-1 mb-1">
          {lastMsgText || tl('no_messages')}
        </div>

        {/* Followup Name - if available */}
        {followupName && (
          <div className="flex items-center gap-1 mt-1">
            <i className="fas fa-user text-xs text-blue-500"></i>
            <span className="text-xs text-gray-500">{tl('assigned_to')} {followupName}</span>
          </div>
        )}
      </div>

      {/* Right Arrow */}
      <div className="flex items-center self-center text-gray-400">
        <i className="fas fa-chevron-right"></i>
      </div>
    </div>
  );
}

const HistoryView = ({ onSelect, showUnreadBadge }) => {
  const tl = useTranslation();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filter, setFilter] = useState({
    status: 'all',
    keyword: '',
    show_deliverer_payments: false,
  });
  const user = useStoreState(state => state.auth.user);

  // Poll for updates every 10 seconds
  useEffect(() => {
    let mounted = true;
    let interval;
    async function fetchTickets() {
      setLoading(true);
      const query = globalFilterToQuery(filter);
      const queryString = query.length ? '&' + query.join('&') : '';
      const { data, error } = await xFetch(`/tickets?_skip=0&_limit=24&_sort=-timestamps.created${queryString}`);
      if (!mounted) return;
      if (error) setError(error);
      setTickets(data || []);
      setLoading(false);
    }
    fetchTickets();
    interval = setInterval(fetchTickets, 10000);
    return () => { mounted = false; clearInterval(interval); };
  }, [filter]);

  // Sort tickets by last message time (descending)
  const sortedTickets = [...tickets].sort((a, b) => {
    const aLast = a.messages && a.messages.length > 0 ? new Date(a.messages[a.messages.length - 1].timestamps?.created).getTime() : 0;
    const bLast = b.messages && b.messages.length > 0 ? new Date(b.messages[b.messages.length - 1].timestamps?.created).getTime() : 0;
    return bLast - aLast;
  });

  // Count unread conversations
  const unreadCount = sortedTickets.filter(ticket => {
    const lastMsg = ticket.messages && ticket.messages.length > 0 ? ticket.messages[ticket.messages.length - 1] : null;
    return lastMsg && lastMsg.user?.role === 'followup' && !lastMsg.seen?.some(s => s.user._id === user._id);
  }).length;

  // Pass unreadCount to parent for badge on tab
  useEffect(() => {
    if (showUnreadBadge) showUnreadBadge(unreadCount);
  }, [unreadCount, showUnreadBadge]);

  const handleStatusChange = (status) => {
    setFilter(prev => ({ ...prev, status }));
    setShowFilters(false); // Close dropdown only when selecting status
  };

  return (
    <div className="flex flex-col h-full">
      {/* Filters Header */}
      <div 
        className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors flex-shrink-0"
        onClick={() => setShowFilters(!showFilters)}
      >
        <div className="flex items-center gap-2">
          <i className="fas fa-filter text-gray-400"></i>
          <span className="text-sm font-medium text-gray-600">{tl('filters')}</span>
        </div>
        <i className={`fas fa-chevron-${showFilters ? 'up' : 'down'} text-gray-400`}></i>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="p-4 border-b space-y-4 flex-shrink-0">
          <IconInput
            icon="search"
            placeholder={tl('search_conversations')}
            value={filter.keyword}
            onValueChange={(keyword) => setFilter(prev => ({ ...prev, keyword }))}
          />
          <StatusCombobox
            value={filter.status}
            filter={filter}
            model="tickets"
            onValueChange={handleStatusChange}
          />
        </div>
      )}

      {/* Conversations List */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-400">{tl('loading')}</div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : !tickets.length ? (
          <div className="p-6 text-center text-gray-400">{tl('no_conversations')}</div>
        ) : (
          <div className="flex flex-col gap-3 p-4 overflow-y-auto h-full">
            {sortedTickets.map(ticket => (
              <TicketHistoryCard 
                key={ticket._id} 
                ticket={ticket} 
                user={user} 
                onClick={() => onSelect(ticket)} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView; 
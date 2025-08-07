import React, { useState, useEffect } from 'react';
import { useStoreState } from 'easy-peasy';
import { useTranslation } from '../../i18n/provider';
import { sendSystemEvent } from '../../services/systemEvents';
import { Input } from './Input';

const HiddenPhone = ({ phone, className = '', showIcon = true, isDelivererPhone = false, onReveal, metadata = {}, onEdit = null }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [editedPhone, setEditedPhone] = useState(phone);
  const user = useStoreState((state) => state.auth.user);
  const tl = useTranslation();

  useEffect(() => {
    if (isRevealed && typeof onReveal === 'function') {
      onReveal();
    }
  }, [isRevealed, onReveal]);

  const handleReveal = async () => {
    if (!isRevealed) {
      try {
        await sendSystemEvent(user, {
          type: 'phone_reveal',
          timestamp: new Date().toISOString(),
          phone,
          metadata
        });
        setIsRevealed(true);
      } catch (error) {
        console.error('Failed to log phone reveal event:', error);
        setIsRevealed(true);
      }
    }
  };

  const handlePhoneChange = (e) => {
    if (e.target.value.length > 10) return;
    if (!e.target.validity.valid && !!e.target.value) return;
    setEditedPhone(e.target.value);
    if (onEdit) onEdit(e.target.value);
  };

  const shouldHide = (user.role === 'followup' || user.role === 'warehouse' || user.role === 'deliverer' || user.role === 'client') && !isDelivererPhone;

  if (!shouldHide || isRevealed) {
    return onEdit ? (
      <Input
        type="tel"
        pattern="[0-9]*"
        value={editedPhone}
        onChange={handlePhoneChange}
        className={className}
      />
    ) : (
      <a href={`tel:${phone}`} className={className}>
        {showIcon && <i className="fas fa-phone-alt mr-1" />}
        {phone}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={handleReveal}
      className={`flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400 group transition my-1 w-auto min-w-0 flex-shrink-0 max-w-full ${className}`}
      style={{ fontWeight: 600, fontSize: '0.95em', lineHeight: 1.2 }}
      title={tl('click_to_reveal_phone')}
    >
      <i className="fas fa-eye text-green-500 text-base group-hover:scale-110 transition-transform" />
      <span className="text-xs text-gray-700 font-semibold select-none group-hover:text-green-600 break-words" style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>{tl('click_to_reveal_phone')}</span>
    </button>
  );
};

export default HiddenPhone; 
"use client";

// Context for managing demo user state and Tiwala app data
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { demoUsers } from '@/data/demo-users';
import { useToast } from '@/hooks/use-toast';
import { tagalogStrings } from '@/data/tagalog-strings';


const initialState = {
  currentUser: null,
  users: demoUsers,
  notifications: []
};

function tiwalaReducer(state, action) {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      const user = state.users.find(u => u.id === action.payload);
      return { ...state, currentUser: user || null };
      
    case 'ADD_REFERRAL':
  const newReferral = {
        ...action.payload.referral,
        id: Date.now().toString(),
        tiwalaIndex: 300, // New users start with basic score
        antas: 'Baguhan',
        dateReferred: new Date().toISOString().split('T')[0],
        status: 'active',
        profileImage: '👤'
      };
      
      return {
        ...state,
        users: state.users.map(user => 
          user.id === action.payload.userId
            ? { 
                ...user, 
                referrals: [...user.referrals, newReferral],
                directReferrals: user.directReferrals + 1,
                monthlyReferrals: user.monthlyReferrals + 1,
                tiwalaIndex: user.tiwalaIndex + 30 // Referral bonus
              }
            : user
        ),
        currentUser: state.currentUser?.id === action.payload.userId 
          ? { 
              ...state.currentUser,
              referrals: [...state.currentUser.referrals, newReferral],
              directReferrals: state.currentUser.directReferrals + 1,
              monthlyReferrals: state.currentUser.monthlyReferrals + 1,
              tiwalaIndex: state.currentUser.tiwalaIndex + 30
            }
          : state.currentUser
      };
      
    case 'UPDATE_TIWALA_INDEX':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.userId
            ? { ...user, tiwalaIndex: Math.max(0, user.tiwalaIndex + action.payload.change) }
            : user
        ),
        currentUser: state.currentUser?.id === action.payload.userId
          ? { ...state.currentUser, tiwalaIndex: Math.max(0, state.currentUser.tiwalaIndex + action.payload.change) }
          : state.currentUser
      };
      
    case 'TRIGGER_SUPPORT_REQUEST':
  const notification = {
        id: Date.now().toString(),
        type: 'support_request',
        message: `${state.users.find(u => u.id === action.payload.fromUserId)?.name} ${tagalogStrings.community.supportAlert}`,
        fromUser: action.payload.fromUserId,
        timestamp: new Date(),
        read: false
      };
      
      return {
        ...state,
        notifications: [notification, ...state.notifications]
      };
      
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications]
      };
      
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        )
      };
      
    default:
      return state;
  }
}

const TiwalaContext = createContext(null);

export function TiwalaProvider({ children }) {
  const [state, dispatch] = useReducer(tiwalaReducer, initialState);
  const { toast } = useToast();
  
  const actions = {
  setCurrentUser: (userId) => {
      dispatch({ type: 'SET_CURRENT_USER', payload: userId });
    },
    
  addReferral: (referral) => {
      if (!state.currentUser) return;
      
      dispatch({ 
        type: 'ADD_REFERRAL', 
        payload: { userId: state.currentUser.id, referral } 
      });
      
      toast({
        title: tagalogStrings.referral.success,
        description: `${tagalogStrings.referral.successMessage} ${referral.name}!`,
      });
    },
    
  updateTiwalaIndex: (change, reason) => {
      if (!state.currentUser) return;
      
      dispatch({
        type: 'UPDATE_TIWALA_INDEX',
        payload: { userId: state.currentUser.id, change, reason }
      });
      
      if (change > 0) {
        toast({
          title: tagalogStrings.notifications.levelUp,
          description: `+${change} Tiwala Index - ${reason}`,
        });
      }
    },
    
  triggerSupportRequest: (fromUserId) => {
      if (!state.currentUser) return;
      
      dispatch({
        type: 'TRIGGER_SUPPORT_REQUEST',
        payload: { fromUserId, toUserId: state.currentUser.id }
      });
    },
    
  sendSupport: (toUserId) => {
      if (!state.currentUser) return;
      
      toast({
        title: tagalogStrings.community.supportSent,
        description: tagalogStrings.community.supportReceived,
      });
      
      // Reward the helper with Tiwala points
      actions.updateTiwalaIndex(20, "Tumulong sa pamayanan");
    },
    
  markNotificationAsRead: (notificationId) => {
      dispatch({
        type: 'MARK_NOTIFICATION_READ',
        payload: notificationId
      });
    }
  };
  
  return (
    <TiwalaContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </TiwalaContext.Provider>
  );
}

export function useTiwala() {
  const context = useContext(TiwalaContext);
  if (!context) {
    throw new Error('useTiwala must be used within a TiwalaProvider');
  }
  return context;
}
// Notification Panel Component
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, X, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { useTiwala } from '@/context/TiwalaContext';

// Remove TypeScript interface, use plain JS destructuring
export function NotificationPanel({ onNavigateToSupport }) {
  const { state, actions } = useTiwala();
  const unreadNotifications = state.notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'referral_success':
      case 'community_growth':
        return <Users className="h-4 w-4 text-tiwala-gold" />;
      case 'tiwala_increase':
        return <TrendingUp className="h-4 w-4 text-tiwala-green" />;
      case 'support_request':
        return <AlertCircle className="h-4 w-4 text-tiwala-red" />;
      default:
        return <Bell className="h-4 w-4 text-foreground-muted" />;
    }
  };

  const handleMarkAsRead = (notificationId) => {
    actions.markNotificationAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    state.notifications.forEach(notification => {
      if (!notification.read) {
        actions.markNotificationAsRead(notification.id);
      }
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative text-white hover:bg-white/20 p-2"
        >
          <Bell className="h-5 w-5" />
          {unreadNotifications > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-tiwala-gold text-xs font-medium text-white">
              {unreadNotifications}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-full max-w-sm p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold font-poppins">
              Mga Abiso
            </SheetTitle>
            {unreadNotifications > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-sm text-tiwala-red hover:text-tiwala-red/80"
              >
                Markahan lahat
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {state.notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <Bell className="h-12 w-12 text-foreground-muted mb-4" />
              <p className="text-foreground-muted font-medium mb-2">
                Walang mga abiso
              </p>
              <p className="text-sm text-foreground-muted">
                Makakakuha ka ng mga update dito tungkol sa inyong komunidad.
              </p>
            </div>
          ) : (
            <div className="space-y-1 p-4">
              {state.notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    notification.read
                      ? 'bg-surface hover:bg-surface-hover border-border/50'
                      : 'bg-tiwala-gold/5 hover:bg-tiwala-gold/10 border-tiwala-gold/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${
                        notification.read ? 'text-foreground-muted' : 'text-foreground'
                      }`}>
                        {notification.message}
                      </p>
                      
                      <p className="text-xs text-foreground-muted mt-1">
                        {new Date(notification.timestamp).toLocaleDateString('tl-PH', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      
                      {/* Add Tumulong button for support requests */}
                      {notification.type === 'support_request' && notification.fromUser && onNavigateToSupport && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification.id);
                            onNavigateToSupport(notification.fromUser);
                          }}
                          className="mt-3 w-full bg-tiwala-red hover:bg-tiwala-red/90 text-white text-sm py-2"
                        >
                          Tumulong
                        </Button>
                      )}
                    </div>
                    
                    {!notification.read && (
                      <div className="w-2 h-2 bg-tiwala-gold rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
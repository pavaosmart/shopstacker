import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from '../integrations/supabase/supabase';

const NotificationSettings = () => {
  const { session } = useSupabaseAuth();
  const [settings, setSettings] = useState({
    email_notifications: true,
    push_notifications: true,
    system_updates: true,
    reminders: true,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from('user_notification_settings')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (data) {
          setSettings(data);
        } else if (error) {
          console.error('Error fetching notification settings:', error);
        }
      }
    };

    fetchSettings();
  }, [session]);

  const handleToggle = async (setting) => {
    const newSettings = { ...settings, [setting]: !settings[setting] };
    setSettings(newSettings);

    if (session?.user?.id) {
      const { error } = await supabase
        .from('user_notification_settings')
        .upsert({ user_id: session.user.id, ...newSettings });

      if (error) {
        console.error('Error updating notification settings:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Configurações de Notificações</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="email_notifications">Notificações por E-mail</Label>
          <Switch
            id="email_notifications"
            checked={settings.email_notifications}
            onCheckedChange={() => handleToggle('email_notifications')}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="push_notifications">Notificações Push</Label>
          <Switch
            id="push_notifications"
            checked={settings.push_notifications}
            onCheckedChange={() => handleToggle('push_notifications')}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="system_updates">Atualizações do Sistema</Label>
          <Switch
            id="system_updates"
            checked={settings.system_updates}
            onCheckedChange={() => handleToggle('system_updates')}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="reminders">Lembretes</Label>
          <Switch
            id="reminders"
            checked={settings.reminders}
            onCheckedChange={() => handleToggle('reminders')}
          />
        </div>
      </div>
      <Button className="mt-4">Salvar Configurações</Button>
    </div>
  );
};

export default NotificationSettings;
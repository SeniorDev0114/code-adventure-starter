
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import MainLayout from './MainLayout';
import { Loader } from 'lucide-react';

interface ProfileData {
  email: string;
  registrationDate: string;
  subscriptions: string[];
}

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token, logout } = useAuthStore();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/auth/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        // Artificial delay to simulate network request
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const data = await authApi.getProfile();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
        logout();
        navigate('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, logout, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <Loader className="h-8 w-8 animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{t('profile.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-500 dark:text-gray-400">{t('profile.email')}</h3>
              <p className="mt-1 text-lg">{profile.email}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-500 dark:text-gray-400">{t('profile.registrationDate')}</h3>
              <p className="mt-1 text-lg">
                {new Date(profile.registrationDate).toLocaleDateString()}
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-500 dark:text-gray-400">{t('profile.subscriptions')}</h3>
              {profile.subscriptions.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {profile.subscriptions.map((sub, index) => (
                    <li key={index} className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                      {sub}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-gray-500">No active subscriptions</p>
              )}
            </div>
            
            <div className="pt-4">
              <Button variant="destructive" onClick={handleLogout}>
                {t('common.logout')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Profile;

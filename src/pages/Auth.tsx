import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';
import { supabase } from '../lib/supabaseClient';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get mode from URL params (login or signup)
  const mode = (searchParams.get('mode') as 'login' | 'signup') || 'login';

  const handleAuth = async (data: any) => {
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        // Sign up new user
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              role: data.role || 'user',
              full_name: data.email.split('@')[0] // temporary name from email
            }
          }
        });

        if (signUpError) throw signUpError;

        if (authData.user) {
          // Redirect based on role
          if (data.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/user');
          }
        }
      } else {
        // Log in existing user
        const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (signInError) throw signInError;

        if (authData.user) {
          // Get user's role from the users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role')
            .eq('id', authData.user.id)
            .single();

          if (userError) {
            console.error('Error fetching user role:', userError);
            // Default to user dashboard if we can't get role
            navigate('/user');
            return;
          }

          // Redirect based on role
          if (userData?.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/user');
          }
        }
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <AuthForm
        mode={mode}
        onSubmit={handleAuth}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default Auth;

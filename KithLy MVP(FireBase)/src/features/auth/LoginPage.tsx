import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Import your shadcn/ui components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { MainLayout } from '../../components/layout/MainLayout';

// Mock function for Firebase login (replace with real logic later)
const mockLogin = async (email: string) => {
  console.log(`Attempting login for: ${email}`);
  // In the real app, this will call signInWithEmailAndPassword from Firebase Auth
  return { success: true, userId: 'user_diana_123' };
};

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await mockLogin(email);
      if (result.success) {
        // Successful login, redirect to homepage
        navigate('/');
      }
    } catch (error) {
      console.error('Login failed:', error);
      // Display error toast/alert to user
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-center items-start pt-16">
        <Card className="w-[380px] border-2 border-blue-200 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-[#3498DB]">Welcome Back to Kithly</CardTitle>
            <CardDescription className="text-gray-600">
              Log in to send a gift home.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="diana@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {/* Note: bg-green-500 is used for the Accent color #2ECC71 */}
              <Button type="submit" disabled={loading} className="w-full bg-[#2ECC71] hover:bg-green-600 transition duration-300">
                {loading ? 'Logging In...' : 'Sign In Securely'}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <a href="/register" className="text-[#3498DB] hover:underline">
                Sign Up
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

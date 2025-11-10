import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebaseConfig';
// Import your shadcn/ui components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { MainLayout } from '../../components/layout/MainLayout';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Successful login, onAuthStateChanged in useAuth will handle the state update.
      // The user will be redirected from protected routes or can navigate freely.
      navigate('/');
    } catch (error: any) {
      console.error('Login failed:', error);
      setError('Failed to log in. Please check your credentials.');
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
              {error && <p className="text-sm text-red-500">{error}</p>}
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

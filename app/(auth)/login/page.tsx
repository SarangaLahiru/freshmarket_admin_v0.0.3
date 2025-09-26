'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Store, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@freshmarket.com');
  const [password, setPassword] = useState('admin123');
  const [organizationSlug, setOrganizationSlug] = useState('fresh-market');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password});
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
            <Store className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Admin Login</CardTitle>
          <CardDescription className="text-gray-600">
            Sign in to your admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                type="text"
                value={organizationSlug}
                onChange={(e) => setOrganizationSlug(e.target.value)}
                placeholder="fresh-market"
                className="transition-colors focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="transition-colors focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="transition-colors focus:border-primary"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Demo credentials:<br />
              <span className="font-medium">Email:</span> admin@freshmarket.com<br />
              <span className="font-medium">Password:</span> admin123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function LoginForm() {
    // Hooks
    const router = useRouter();
    const { login } = useAuth();

    // form state
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // form error state
    const [errors, setErrors] = useState<Record<string, string>>({});

    // loading state
    const [isLoading, setIsLoading] = useState(false);

    // error state
    const [generalError, setGeneralError] = useState('');

    // input reactions
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        // Update the form data
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        setGeneralError('');

        try {
        await login(formData.email, formData.password);
        
        // Redirect to home page (change this to '/dashboard' when you build it)
        router.push('/');
        
        } catch (error) {
        if (error instanceof ApiError) {
            if (error.hasValidationErrors()) {
            const fieldErrors: Record<string, string> = {};
            Object.entries(error.errors!).forEach(([field, messages]) => {
                fieldErrors[field] = messages[0];
            });
            setErrors(fieldErrors);
            } else {
            setGeneralError(error.message);
            }
        } else {
            setGeneralError('An unexpected error occurred. Please try again.');
        }
        } finally {
        setIsLoading(false);
        }
    };
    return (
        <div className="w-full max-w-md mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Login</h2>
            
            {generalError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{generalError}</p>
            </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                aria-invalid={!!errors.email}
                required
                disabled={isLoading}
                />
                {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                aria-invalid={!!errors.password}
                required
                disabled={isLoading}
                />
                {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
                )}
            </div>

            <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
            >
                {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            </form>
        </div>
        </div>
    );

}


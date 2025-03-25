'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
// import { toast } from '@/components/ui/use-toast';
import { toast } from 'sonner';

import { Check, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const travelStyles = [
  { label: 'Adventure', value: 'adventure' },
  { label: 'Relaxation', value: 'relaxation' },
  { label: 'Cultural', value: 'cultural' },
  { label: 'Nature', value: 'nature' },
  { label: 'Luxury', value: 'luxury' },
  { label: 'Budget', value: 'budget' },
  { label: 'Family', value: 'family' },
  { label: 'Solo', value: 'solo' },
  { label: 'Food', value: 'food' },
  { label: 'Photography', value: 'photography' },
] as const;

const budgetOptions = [
    { label: 'Budget', value: 'budget' },
    { label: 'Mid-range', value: 'mid-range' },
    { label: 'Luxury', value: 'luxury' }
  ];

const profileSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }).max(20),
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  bio: z.string().max(300, { message: 'Bio must be less than 300 characters' }).optional(),
  location: z.string().optional(),
  travelStyles: z.array(z.string()).min(1, { message: 'Select at least one travel style' }),
  budget: z.string().optional(),
});

type ProfileValues = z.infer<typeof profileSchema>;

export function ProfileSetupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTravelStyles, setSelectedTravelStyles] = useState<string[]>([]);

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: '',
      name: '',
      bio: '',
      location: '',
      travelStyles: [],
      budget: 'mid-range',
    }
  });

  async function onSubmit(data: ProfileValues) {
    setIsLoading(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong');
      }

    //   toast({
    //     title: 'Profile updated!',
    //     description: 'Your profile has been successfully set up.',
    //   });
      
          toast.success('🎉 Your profile has been successfully set up!', { position: 'top-right' });

      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Profile setup error:', error);
   toast.error(`❌ ${error instanceof Error ? error.message : 'Failed to update profile'}`, { position: 'top-right' });

    } finally {
      setIsLoading(false);
    }
  }

  const handleTravelStyleSelect = (value: string) => {
    const currentStyles = form.getValues('travelStyles');
    const updatedStyles = currentStyles.includes(value)
      ? currentStyles.filter(style => style !== value)
      : [...currentStyles, value];
    
    form.setValue('travelStyles', updatedStyles, { shouldValidate: true });
    setSelectedTravelStyles(updatedStyles);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold">Set up your profile</CardTitle>
        <CardDescription>Complete your TravelBuddy profile to get the most out of the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex flex-col items-center gap-2">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="" alt="Profile" />
                  <AvatarFallback className="text-lg">TB</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" type="button" className="mt-2">
                  Upload Photo
                </Button>
              </div>
              
              <div className="flex-1 space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="yourusername" {...field} />
                      </FormControl>
                      <FormDescription>
                        This will be your unique username on TravelBuddy
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About Me</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell other travelers about yourself and your travel experiences..." 
                      className="resize-none h-24"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Share a brief description about your travel interests and experiences
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="City, Country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="travelStyles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Travel Preferences</FormLabel>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {travelStyles.map((style) => (
                      <Badge
                        key={style.value}
                        variant={field.value.includes(style.value) ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer hover:bg-primary/90 transition-colors",
                          field.value.includes(style.value) 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-background text-foreground"
                        )}
                        onClick={() => handleTravelStyleSelect(style.value)}
                      >
                        {style.label}
                      </Badge>
                    ))}
                  </div>
                  <FormDescription>
                    Select all travel styles that match your preferences
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Typical Travel Budget</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                        >
                          {field.value
                            ? budgetOptions?.find(option => option.value === field.value)?.label
                            : "Select budget preference"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search budget..." />
                          <CommandEmpty>No budget option found.</CommandEmpty>
                          <CommandGroup>
                            {budgetOptions?.map((option) => (
                              <CommandItem
                                key={option.value}
                                value={option.value}
                                onSelect={() => {
                                    if (option.value) {
                                        console.log("Selected Budget:", option.value);
                                      form.setValue("budget", option.value, { shouldValidate: true });
                                    }
                                  }}
                                  
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === option.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {option.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Saving Profile...' : 'Save Profile'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
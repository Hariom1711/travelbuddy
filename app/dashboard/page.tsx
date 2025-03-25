

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Plus, Map, Compass, BookOpen, Search } from 'lucide-react';

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session || !session.user) {
    redirect('/auth/signin');
  }
  
  const userId = session.user.id;
  
  // Fetch user data with their trips
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      trips: {
        orderBy: { startDate: 'asc' },
        take: 5,
      },
      preferences: true,
    },
  });
  
  if (!user) {
    redirect('/auth/signin');
  }
  
  // Redirect to profile setup if profile is incomplete
  if (!user.username || !user.preferences) {
    redirect('/profile/setup');
  }
  
  // Get upcoming trips (those that haven't ended yet)
  const upcomingTrips = user.trips.filter(
    trip => new Date(trip.endDate) >= new Date()
  );
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Destinations with more details
  const destinations = [
    { 
      name: 'Japan', 
      description: 'A blend of ancient traditions and cutting-edge technology',
      imageUrl: '/destinations/japan.jpg',
      attractions: ['Tokyo', 'Kyoto', 'Mount Fuji']
    },
    { 
      name: 'Italy', 
      description: 'Rich history, art, and culinary delights',
      imageUrl: '/destinations/italy.jpg',
      attractions: ['Rome', 'Venice', 'Florence']
    },
    { 
      name: 'Bali', 
      description: 'Tropical paradise with unique culture and landscapes',
      imageUrl: '/destinations/bali.jpg',
      attractions: ['Ubud', 'Seminyak', 'Uluwatu']
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {user.name || user.username}!</h1>
          <p className="text-muted-foreground mt-1">Plan your next adventure or explore new destinations</p>
        </div>
        <Button asChild className="mt-4 md:mt-0">
          <Link href="/trips/new">
            <Plus className="mr-2 h-4 w-4" /> Create New Trip
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Trips
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.trips.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Trips
            </CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingTrips.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Travel Style
            </CardTitle>
            <Compass className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {user.preferences?.travelStyle.slice(0, 2).join(', ')}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 order-2 lg:order-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Your Upcoming Trips</CardTitle>
              <CardDescription>Manage and plan your adventures</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingTrips.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You don't have any upcoming trips</p>
                  <Button asChild>
                    <Link href="/trips/new">
                      Plan Your First Trip
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingTrips.map((trip) => (
                    <div key={trip.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{trip.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/trips/${trip.id}`}>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link href="/trips">View All Trips</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="lg:col-span-2 order-1 lg:order-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Popular Destinations</CardTitle>
                <CardDescription>Explore trending places to visit</CardDescription>
              </div>
              <div className="relative flex-grow max-w-md ml-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  type="text" 
                  placeholder="Search destinations..." 
                  className="pl-10 w-full"
                />
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {destinations.map((destination) => (
                <div 
                  key={destination.name} 
                  className="group relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Image 
                    src={destination.imageUrl} 
                    alt={destination.name} 
                    fill
                    className="absolute inset-0 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="relative p-4 h-full flex flex-col justify-end text-white">
                    <h3 className="text-xl font-bold mb-2">{destination.name}</h3>
                    <p className="text-sm mb-2 opacity-80">{destination.description}</p>
                    <div className="flex space-x-2">
                      {destination.attractions.map((attraction) => (
                        <span 
                          key={attraction} 
                          className="bg-white/20 px-2 py-1 rounded-full text-xs"
                        >
                          {attraction}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link href="/destinations">Explore More Destinations</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserProfile } from '@/types/calorie-tracker';
import { User, Save } from 'lucide-react';

interface UserProfileSetupProps {
  onProfileSave: (profile: UserProfile) => void;
  initialProfile?: UserProfile;
}

export default function UserProfileSetup({ onProfileSave, initialProfile }: UserProfileSetupProps) {
  const [profile, setProfile] = useState<Partial<UserProfile>>(
    initialProfile || {
      name: '',
      age: 0,
      weight: 0,
      height: 0,
      gender: 'male',
      activityLevel: 'moderate',
      goalType: 'maintain',
    }
  );

  const handleSave = () => {
    if (profile.name && profile.name.trim() && profile.age && profile.weight && profile.height) {
      onProfileSave(profile as UserProfile);
    }
  };

  const isValid = profile.name && profile.name.trim() && profile.age && profile.weight && profile.height;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          User Profile
        </CardTitle>
        <CardDescription>Set up your profile to get personalized recommendations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={profile.name || ''}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age (years) *</Label>
              <Input
                id="age"
                type="number"
                placeholder="25"
                value={profile.age || ''}
                onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={profile.gender}
                onValueChange={(value) => setProfile({ ...profile, gender: value as UserProfile['gender'] })}
              >
                <SelectTrigger id="gender">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg) *</Label>
              <Input
                id="weight"
                type="number"
                placeholder="70"
                value={profile.weight || ''}
                onChange={(e) => setProfile({ ...profile, weight: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height (cm) *</Label>
              <Input
                id="height"
                type="number"
                placeholder="175"
                value={profile.height || ''}
                onChange={(e) => setProfile({ ...profile, height: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activity">Activity Level *</Label>
              <Select
                value={profile.activityLevel}
                onValueChange={(value) => setProfile({ ...profile, activityLevel: value as UserProfile['activityLevel'] })}
              >
                <SelectTrigger id="activity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (little/no exercise)</SelectItem>
                  <SelectItem value="light">Light (1-3 days/week)</SelectItem>
                  <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                  <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                  <SelectItem value="veryActive">Very Active (2x per day)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal">Goal *</Label>
              <Select
                value={profile.goalType}
                onValueChange={(value) => setProfile({ ...profile, goalType: value as UserProfile['goalType'] })}
              >
                <SelectTrigger id="goal">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose">Lose Weight</SelectItem>
                  <SelectItem value="maintain">Maintain Weight</SelectItem>
                  <SelectItem value="gain">Gain Weight</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full" disabled={!isValid}>
          <Save className="h-4 w-4 mr-2" />
          Save Profile
        </Button>
      </CardContent>
    </Card>
  );
}
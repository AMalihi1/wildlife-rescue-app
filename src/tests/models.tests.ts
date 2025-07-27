import { User } from '../../src/models/user.model';
import { RescueRequest } from '../../src/models/rescue-request.model'; 
import { RescueRequestPhoto } from '../../src/models/rescue-request-photo.model';
import { UserType, RescueRequestStatus, AnimalType } from '../../src/types/enums'

// Test 1: Create a User
console.log('=== Testing User Creation ===');
const testUser: User = {
  id: '1',
  fullName: 'John Doe',
  email: 'john@example.com',
  phoneNumber: '+972501234567',
  city: 'Tel Aviv',
  type: UserType.BOTH,
  createdAt: new Date(),
  updatedAt: new Date()
};

console.log('User created:', testUser);
console.log('User type:', testUser.type); // Should print: 'both'

// Test 2: Create a RescueRequest
console.log('\n=== Testing RescueRequest Creation ===');
const testRequest: RescueRequest = {
  id: '1',
  userId: '1',
  status: RescueRequestStatus.OPENED,
  animalType: AnimalType.HEDGEHOG,
  createdAt: new Date(),
  updatedAt: new Date(),
  pickupAddress: 'Yarkon Park, Tel Aviv',
  description: 'Small hedgehog found injured near playground area'
};

console.log('Rescue request created:', testRequest);
console.log('Status:', testRequest.status); // Should print: 'opened'
console.log('Animal type:', testRequest.animalType); // Should print: 'hedgehog'

// Test 3: Create a Photo
console.log('\n=== Testing RescueRequestPhoto Creation ===');
const testPhoto: RescueRequestPhoto = {
  id: '1',
  rescueRequestId: '1',
  photoUrl: 'https://example.com/hedgehog-photo.jpg',
  createdAt: new Date(),
  updatedAt: new Date()
};

console.log('Photo created:', testPhoto);

// Test 4: Test enum values
console.log('\n=== Testing Enum Values ===');
console.log('All UserTypes:', Object.values(UserType));
console.log('All RescueRequestStatuses:', Object.values(RescueRequestStatus));
console.log('All AnimalTypes:', Object.values(AnimalType));

// Test 5: Test type safety (this should give TypeScript errors)
console.log('\n=== Testing Type Safety ===');
try {
  const badUser: User = {
    id: '2',
    fullName: 'Bad User',
    phoneNumber: '+123',
    city: 'Jerusalem',
    // type: 'invalid_type', // ❌ This would cause TypeScript error
    type: UserType.REPORTER, // ✅ This works
    createdAt: new Date(),
    updatedAt: new Date()
  };
  console.log('Type safety test passed:', badUser.type);
} catch (error) {
  console.log('Error:', error);
}

console.log('\n=== All Tests Complete! ===');
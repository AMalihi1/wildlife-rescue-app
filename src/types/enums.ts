export enum UserType {
  REPORTER = 'reporter',     // Someone who reports injured animals
  RESCUER = 'rescuer',      // Someone who picks up/rescues animals  
  BOTH = 'both'             // Can both report and rescue
}

export enum RescueRequestStatus {
  OPENED = 'opened',                    // Just reported, waiting for pickup
  RESCUER_ASSIGNED = 'rescuer_assigned', // Someone accepted the rescue
  ON_THE_WAY = 'on_the_way',            // Rescuer is traveling to location
  ANIMAL_COLLECTED = 'animal_collected', // Animal picked up, going to the safari             
  ANIMAL_ARRIVED = 'animal_arrived',     // Animal arrived at the safari
  CANCELLED = 'cancelled'                // Request cancelled (false alarm, etc.)
}

export enum AnimalType {
  SONG_BIRD = 'song_bird',         // Sparrows, robins, etc.
  BIRD_OF_PREY = 'bird_of_prey',   // Hawks, owls, eagles
  WATER_BIRD = 'water_bird',       // Ducks, herons, seagulls
  HEDGEHOG = 'hedgehog',
  OTHER = 'other'                   
}

export enum EventType {
  RescueRequestCreated = "rescue-request.created",
  RescueRequestAssigned = "rescue-request.assigned",
}
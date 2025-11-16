import EventEmitter from 'events';

// FIX: Removed unnecessary wrapper class and instantiated EventEmitter directly.
const eventEmitter = new EventEmitter();

// You can define event listeners elsewhere in your application
// For example, for sending emails or creating notifications
eventEmitter.on('OrderCreated', (order) => {
  console.log(`New Order Created: ${(order as any).id}`);
  // Add logic to send email, create notification, etc.
});

eventEmitter.on('UserRegistered', (user) => {
  console.log(`New User Registered: ${(user as any).email}`);
  // Add logic for welcome email
});

export default eventEmitter;

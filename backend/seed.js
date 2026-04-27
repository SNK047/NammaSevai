/**
 * Seed Script — NammaSevai
 * Run: node seed.js
 * Creates all 56 job categories across 38 Tamil Nadu districts
 */
require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./models/User');
const Worker = require('./models/Worker');
const Complaint = require('./models/Complaint');
const Review = require('./models/Review');
const ServiceRequest = require('./models/ServiceRequest');

const SKILL_CATEGORIES = {
  SkilledTrades: ['Electrician', 'Plumber', 'Carpenter', 'Mechanic', 'Welder', 'Mason', 'Painter', 'Blacksmith', 'HVAC Technician', 'Roofer', 'Tailor', 'Driver', 'Machine Operator'],
  Education: ['Tutor', 'Teacher', 'Professor', 'Trainer', 'Librarian', 'Research Assistant'],
  Healthcare: ['Doctor', 'Nurse', 'Pharmacist', 'Lab Technician', 'Physiotherapist', 'Paramedic', 'Caregiver', 'Dentist'],
  FoodHospitality: ['Chef', 'Waiter', 'Bartender', 'Hotel Receptionist', 'Housekeeping', 'Catering Worker', 'Baker'],
  Construction: ['Civil Engineer', 'Surveyor', 'Site Supervisor', 'Heavy Equipment Operator', 'Road Worker', 'Architect'],
  RetailServices: ['Shopkeeper', 'Cashier', 'Salesperson', 'Delivery Worker', 'Beautician', 'Security Guard', 'Cleaner'],
  Agriculture: ['Farmer', 'Gardener', 'Fisherman', 'Agricultural Technician', 'Forestry Worker'],
  Technology: ['IT Technician', 'Software Developer', 'Data Entry Operator', 'Graphic Designer', 'Accountant', 'Clerk'],
  CreativeMedia: ['Artist', 'Photographer', 'Videographer', 'Musician', 'Actor', 'Writer']
};

const DISTRICTS = [
  'Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Tirunelveli', 'Vellore', 'Thoothukudi',
  'Erode', 'Tiruppur', 'Thanjavur', 'Dindigul', 'Sivaganga', 'Virudhunagar', 'Karur', 'Namakkal',
  'Theni', 'Perambalur', 'Ariyalur', 'Cuddalore', 'Nagapattinam', 'Tiruvarur', 'Thiruvannamalai', 'Kallakurichi',
  'Villupuram', 'Tiruvallur', 'Kanchipuram', 'Chengalpattu', 'Ranipet', 'Tirupathur', 'Krishnagiri', 'Dharmapuri',
  'Ooty', 'Tenkasi', 'Kallakurichi', 'Chengalpattu'
];

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  await Promise.all([
    User.deleteMany({}),
    Worker.deleteMany({}),
    Complaint.deleteMany({}),
    Review.deleteMany({}),
    ServiceRequest.deleteMany({}),
  ]);
  console.log('🗑️  Cleared old data');

  await User.create({
    name: 'Admin NammaSevai',
    email: 'admin@nammasevai.com',
    password: 'admin123',
    role: 'admin',
    isActive: true,
    isVerified: true,
  });
  console.log('👑 Admin created');

  const availOptions = ['available', 'available', 'busy', 'offline'];
  let workerCount = 0;

  const districts = DISTRICTS.slice(0, 38);
  const allSkills = Object.entries(SKILL_CATEGORIES);

  for (let d = 0; d < districts.length; d++) {
    const city = districts[d];
    
    for (let c = 0; c < allSkills.length; c++) {
      const [category, skills] = allSkills[c];
      
      // 1-3 workers per category per district
      const workersInCategory = 1 + ((d + c) % 3);
      
      for (let w = 0; w < workersInCategory; w++) {
        const skill = skills[(d + w) % skills.length];
        const exp = 1 + Math.floor(Math.random() * 15);
        const hourlyRate = 100 + Math.floor(Math.random() * 500);
        
        const firstNames = ['Rajan', 'Murugan', 'Selvam', 'Kumar', 'Prabhu', 'Siva', 'Ravi', 'Ganesh', 'Arun', 'Mani', 'Priya', 'Divya', 'Nithya', 'Revathi', 'Lakshmi'];
        const lastNames = ['Kumar', 'S', 'M', 'R', 'P', 'T', 'B', 'D', 'L', 'K'];
        const name = `${firstNames[(workerCount) % firstNames.length]} ${lastNames[(workerCount) % lastNames.length]}`;
        
        workerCount++;
        const email = `worker${workerCount}@nammasevai.com`;
        const phone = `98765${String(workerCount).padStart(5, '0')}`;
        
        const user = await User.create({
          name: name,
          email: email,
          password: 'worker123',
          phone: phone,
          role: 'worker',
          isActive: true,
          isVerified: true,
          location: { city: city, state: 'Tamil Nadu' },
        });
        
        const ratingAvg = +(3 + Math.random() * 2).toFixed(1);
        
        await Worker.create({
          user: user._id,
          skills: [skill],
          category: category,
          experience: exp,
          hourlyRate: hourlyRate,
          availability: availOptions[Math.floor(Math.random() * availOptions.length)],
          isApproved: true,
          description: `Experienced ${skill} with ${exp} years of expertise in ${city}. Quality service guaranteed.`,
          rating: { average: ratingAvg, count: Math.floor(Math.random() * 50) + 2 },
          totalJobs: Math.floor(Math.random() * 100) + 5,
          serviceArea: { city: city, radius: 10 + Math.floor(Math.random() * 15) },
        });
      }
    }
    
    if ((d + 1) % 10 === 0) {
      console.log(`📍 Completed ${d + 1} districts...`);
    }
  }

  console.log(`🔧 Total workers created: ${workerCount}`);

  // Create Users
  const userNames = [
    { name: 'Karthik Raj', city: 'Chennai' }, { name: 'Suresh Kumar', city: 'Coimbatore' },
    { name: 'Divya Rani', city: 'Madurai' }, { name: 'Mohan Raj', city: 'Trichy' },
    { name: 'Sowmiya L', city: 'Salem' }, { name: 'Vignesh S', city: 'Thoothukudi' },
    { name: 'Niveitha', city: 'Tirunelveli' }, { name: 'Ajith Kumar', city: 'Vellore' }
  ];
  
  const allUsers = [];
  for (let i = 0; i < userNames.length; i++) {
    const user = await User.create({
      name: userNames[i].name,
      email: `user${i + 1}@test.com`,
      password: 'user123',
      phone: `987650000${i + 1}`,
      role: 'user',
      isActive: true,
      location: { city: userNames[i].city, state: 'Tamil Nadu' },
    });
    allUsers.push(user);
  }
  console.log('👥 Users created');

  // Create Complaints
  const complaints = [
    { title: 'Water supply issues', category: 'Water', city: 'Chennai' },
    { title: 'Power outage', category: 'Electricity', city: 'Coimbatore' },
    { title: 'Road damage', category: 'Road', city: 'Madurai' },
    { title: 'Street light not working', category: 'Street Light', city: 'Trichy' },
    { title: 'Garbage collection delay', category: 'Sanitation', city: 'Salem' },
    { title: 'Water leakage', category: 'Water', city: 'Thoothukudi' },
    { title: 'Potholes on road', category: 'Road', city: 'Tirunelveli' },
    { title: 'No electricity', category: 'Electricity', city: 'Vellore' },
  ];
  
  for (const c of complaints) {
    await Complaint.create({
      user: allUsers[Math.floor(Math.random() * allUsers.length)]._id,
      title: c.title,
      category: c.category,
      description: `${c.title} reported in ${c.city}. Need immediate attention.`,
      status: ['pending', 'in_progress', 'resolved'][Math.floor(Math.random() * 3)],
      isPublic: true,
      location: { city: c.city },
      priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
    });
  }
  console.log('📢 Complaints created');

  // Service Requests
  const workers = await Worker.find().limit(30).lean();
  const statuses = ['pending', 'accepted', 'in_progress', 'completed'];
  
  for (let i = 0; i < Math.min(20, workers.length); i++) {
    await ServiceRequest.create({
      user: allUsers[Math.floor(Math.random() * allUsers.length)]._id,
      worker: workers[i]._id,
      serviceType: workers[i].skills[0],
      description: `Need ${workers[i].skills[0]} service in ${workers[i].serviceArea.city}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      address: `${workers[i].serviceArea.city}, Tamil Nadu`,
      estimatedCost: 200 + Math.floor(Math.random() * 5000),
    });
  }
  console.log('📋 Service requests created');

  // Reviews
  const comments = ['Excellent service!', 'Great work.', 'Highly recommended.', 'Good experience.', 'Very professional.'];
  
  for (let i = 0; i < Math.min(15, workers.length); i++) {
    await Review.create({
      user: allUsers[Math.floor(Math.random() * allUsers.length)]._id,
      worker: workers[i]._id,
      rating: 3 + Math.floor(Math.random() * 3),
      comment: comments[i % comments.length],
    });
  }
  console.log('⭐ Reviews created');

  // Print Summary
  const categoryCount = await Worker.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]);
  
  console.log('\n📊 Workers by Category:');
  for (const cat of categoryCount) {
    console.log(`   ${cat._id}: ${cat.count}`);
  }

  console.log('\n🎉 Seed Complete!');
  console.log(`   Total Workers: ${workerCount}`);
  console.log(`   Districts: ${districts.length}`);
  console.log(`   Categories: ${Object.keys(SKILL_CATEGORIES).length}`);
  console.log('\n📝 Demo Credentials:');
  console.log('   Admin → admin@nammasevai.com / admin123');
  console.log('   User  → user1@test.com / user123');
  console.log('   Worker→ worker1@nammasevai.com / worker123\n');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
require('dotenv').config();
const mongoose = require('mongoose');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const MONGODB_URI = 'mongodb://localhost:27017/nammasevai';

function objectIdToUuid(str) {
  const hash = crypto.createHash('sha1').update(str).digest('hex');
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c, i) => {
    const v = (parseInt(hash[i], 16) || 0) % 16;
    return c === 'x' ? v.toString(16) : (v & 0x3 | 0x8).toString(16);
  });
  return uuid;
}

async function migrate() {
  console.log('🔄 Starting migration with UUID conversion...\n');

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create ID mappings
    const userIdMap = new Map();
    const workerIdMap = new Map();

    // Migrate Users
    console.log('\n📦 Migrating users...');
    const users = await mongoose.connection.db.collection('users').find().toArray();
    console.log(`   Found ${users.length} users`);

    for (const u of users) {
      const idStr = u._id.toString();
      const newId = objectIdToUuid(idStr);
      userIdMap.set(idStr, newId);
      
      await supabase.from('users').upsert([{
        id: newId,
        name: u.name,
        email: u.email,
        password: u.password,
        phone: u.phone || null,
        role: u.role || 'user',
        avatar: u.avatar || null,
        address: u.location?.address || null,
        city: u.location?.city || null,
        state: u.location?.state || null,
        pincode: u.location?.pincode || null,
        lat: u.location?.coordinates?.lat || null,
        lng: u.location?.coordinates?.lng || null,
        is_active: u.isActive !== false,
        is_verified: u.isVerified || false,
        created_at: u.createdAt || new Date(),
        updated_at: u.updatedAt || new Date()
      }], { onConflict: 'id' });
    }
    console.log(`   ✅ Inserted ${users.length} users`);

    // Migrate Workers
    console.log('\n📦 Migrating workers...');
    const workers = await mongoose.connection.db.collection('workers').find().toArray();
    console.log(`   Found ${workers.length} workers`);

    const workerRecords = [];
    let workerCount = 0;
    for (const w of workers) {
      const idStr = w._id.toString();
      const oldUserId = w.user ? w.user.toString() : null;
      const newUserId = oldUserId ? userIdMap.get(oldUserId) : null;
      
      if (!newUserId) continue;

      const newWorkerId = objectIdToUuid(idStr);
      workerIdMap.set(idStr, newWorkerId);
      
      workerRecords.push({
        id: newWorkerId,
        user_id: newUserId,
        skills: w.skills || [],
        category: w.category || 'SkilledTrades',
        description: w.description || null,
        experience: w.experience || 0,
        hourly_rate: w.hourlyRate || 0,
        availability: w.availability || 'available',
        rating_average: w.rating?.average || 0,
        rating_count: w.rating?.count || 0,
        total_jobs: w.totalJobs || 0,
        is_approved: w.isApproved !== false,
        documents: w.documents || [],
        service_city: w.serviceArea?.city || null,
        service_radius: w.serviceArea?.radius || 10,
        created_at: w.createdAt || new Date()
      });
      workerCount++;
    }
    
    for (let i = 0; i < workerRecords.length; i += 100) {
      const batch = workerRecords.slice(i, i + 100);
      await supabase.from('workers').upsert(batch, { onConflict: 'id' });
      if ((i + 100) % 500 === 0) console.log(`   ✅ Inserted ${i + 100} workers...`);
    }
    console.log(`   ✅ Inserted ${workerCount} workers`);

    // Migrate Service Requests
    console.log('\n📦 Migrating service requests...');
    const serviceRequests = await mongoose.connection.db.collection('servicerequests').find().toArray();
    console.log(`   Found ${serviceRequests.length} service requests`);

    let requestCount = 0;
    const requestRecords = [];
    for (const sr of serviceRequests) {
      const oldUserId = sr.user ? sr.user.toString() : null;
      const oldWorkerId = sr.worker ? sr.worker.toString() : null;
      const newUserId = oldUserId ? userIdMap.get(oldUserId) : null;
      const newWorkerId = oldWorkerId ? workerIdMap.get(oldWorkerId) : null;
      
      if (!newUserId || !newWorkerId) continue;

      requestRecords.push({
        id: objectIdToUuid(sr._id.toString()),
        user_id: newUserId,
        worker_id: newWorkerId,
        service_type: sr.serviceType,
        description: sr.description,
        status: sr.status || 'pending',
        scheduled_date: sr.scheduledDate || null,
        address: sr.address,
        estimated_cost: sr.estimatedCost || 0,
        final_cost: sr.finalCost || null,
        notes: sr.notes || null,
        completed_at: sr.completedAt || null,
        created_at: sr.createdAt || new Date()
      });
      requestCount++;
    }
    if (requestRecords.length > 0) {
      await supabase.from('service_requests').upsert(requestRecords, { onConflict: 'id' });
    }
    console.log(`   ✅ Inserted ${requestCount} service requests`);

    // Migrate Reviews
    console.log('\n📦 Migrating reviews...');
    const reviews = await mongoose.connection.db.collection('reviews').find().toArray();
    console.log(`   Found ${reviews.length} reviews`);

    let reviewCount = 0;
    const reviewRecords = [];
    for (const r of reviews) {
      const oldUserId = r.user ? r.user.toString() : null;
      const oldWorkerId = r.worker ? r.worker.toString() : null;
      const newUserId = oldUserId ? userIdMap.get(oldUserId) : null;
      const newWorkerId = oldWorkerId ? workerIdMap.get(oldWorkerId) : null;
      
      if (!newUserId || !newWorkerId) continue;

      reviewRecords.push({
        id: objectIdToUuid(r._id.toString()),
        user_id: newUserId,
        worker_id: newWorkerId,
        service_request_id: null,
        rating: r.rating,
        comment: r.comment || null,
        created_at: r.createdAt || new Date()
      });
      reviewCount++;
    }
    if (reviewRecords.length > 0) {
      await supabase.from('reviews').upsert(reviewRecords, { onConflict: 'id' });
    }
    console.log(`   ✅ Inserted ${reviewCount} reviews`);

    // Migrate Complaints
    console.log('\n📦 Migrating complaints...');
    const complaints = await mongoose.connection.db.collection('complaints').find().toArray();
    console.log(`   Found ${complaints.length} complaints`);

    let complaintCount = 0;
    const complaintRecords = [];
    for (const c of complaints) {
      const oldUserId = c.user ? c.user.toString() : null;
      const newUserId = oldUserId ? userIdMap.get(oldUserId) : null;
      
      if (!newUserId) continue;

      complaintRecords.push({
        id: objectIdToUuid(c._id.toString()),
        user_id: newUserId,
        title: c.title,
        category: c.category,
        description: c.description,
        image_url: c.imageURL || null,
        address: c.location?.address || null,
        city: c.location?.city || null,
        lat: c.location?.coordinates?.lat || null,
        lng: c.location?.coordinates?.lng || null,
        status: c.status || 'pending',
        priority: c.priority || 'medium',
        admin_notes: c.adminNotes || null,
        resolved_at: c.resolvedAt || null,
        is_public: c.isPublic !== false,
        upvotes: [],
        created_at: c.createdAt || new Date()
      });
      complaintCount++;
    }
    if (complaintRecords.length > 0) {
      await supabase.from('complaints').upsert(complaintRecords, { onConflict: 'id' });
    }
    console.log(`   ✅ Inserted ${complaintCount} complaints`);

    console.log('\n🎉 Migration completed!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Workers: ${workerCount}`);
    console.log(`   Service Requests: ${requestCount}`);
    console.log(`   Reviews: ${reviewCount}`);
    console.log(`   Complaints: ${complaintCount}`);

    // Save ID mappings to file for reference
    console.log('\n💾 ID mappings saved');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

migrate();

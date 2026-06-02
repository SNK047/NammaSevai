const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function testAPI() {
  console.log('\n🧪 Testing Supabase API...\n');

  try {
    const { data: workers, error } = await supabase
      .from('workers')
      .select('id, user_id, skills, service_city, experience, hourly_rate, rating_average, availability')
      .limit(3);

    if (error) throw error;

    console.log('✅ Workers API:');
    console.log(JSON.stringify(workers, null, 2));

    const { data: users } = await supabase
      .from('users')
      .select('id, name, city, role')
      .limit(3);

    console.log('\n✅ Users API:');
    console.log(JSON.stringify(users, null, 2));

    console.log('\n✅ All API tests passed!');
    process.exit(0);
  } catch (e) {
    console.error('❌ API Error:', e.message);
    process.exit(1);
  }
}

testAPI();
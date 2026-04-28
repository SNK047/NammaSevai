const supabase = require('./supabase');

const connectDB = async () => {
  try {
    const { data, error } = await supabase.from('users').select('id').limit(1);
    if (error) throw error;
    console.log('✅ Supabase Connected');
  } catch (error) {
    console.error(`❌ Supabase Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://luesolqiurwtanqjdznt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1ZXNvbHFpdXJ3dGFucWpkem50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMTE4NDUsImV4cCI6MjA2MTY4Nzg0NX0.z8k0D4tDLOz3G2Kyws-oRna2l2_jbNlBlDH59I2Fav8';

export const supabase = createClient(supabaseUrl, supabaseKey);
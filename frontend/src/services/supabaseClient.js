// Connect with Supabase
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL; //see .env file
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true, // Automatically refresh auth tokens
    persistSession: true,   // Keep user logged in across browser sessions
    detectSessionInUrl: true // Handle OAuth redirects
  }
});

/**
 * Sign up (new user)
 * @param {string} email 
 * @param {string} password 
 * @param {object} metadata - Additional user data (first name, last name, etc.)
 * @returns {Promise} - User data or error
 */
export const signUp = async (email, password, metadata = {}) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata // Store additional info like name, employee_id, etc.
      }
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Sign up error:', error.message);
    return { data: null, error: error.message };
  }
};

/**
 * Sign in
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise} - User session or error
 */
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Sign in error:', error.message);
    return { data: null, error: error.message };
  }
};

/**
 * Sign out
 * @returns {Promise} - Success status
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Sign out error:', error.message);
    return { error: error.message };
  }
};

/**
 * Get current user session
 * @returns {Promise} - Current user or null
 */
export const getCurrentUser = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session?.user ?? null;
  } catch (error) {
    console.error('Get user error:', error.message);
    return null;
  }
};

/**
 * Reset password for user
 * @param {string} email 
 * @returns {Promise} - Success status
 */
export const resetPassword = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Reset password error:', error.message);
    return { error: error.message };
  }
};

/**
 * Get user profile from database
 * @param {string} userId 
 * @returns {Promise} - User profile data
 */
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Get profile error:', error.message);
    return { data: null, error: error.message };
  }
};

/**
 * Update user profile
 * @param {string} userId 
 * @param {object} updates - Fields to update
 * @returns {Promise} - Updated profile
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Update profile error:', error.message);
    return { data: null, error: error.message };
  }
};

export default supabase;
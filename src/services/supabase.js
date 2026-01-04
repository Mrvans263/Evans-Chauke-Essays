import { createClient } from '@supabase/supabase-js';

// Vite uses import.meta.env instead of process.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for your blog
export const blogService = {
  // Fetch all essays with comment counts
  async getEssays() {
    const { data: essays, error } = await supabase
      .from('essays')
      .select('*')
      .order('published_date', { ascending: false });
    
    if (error) throw error;
    
    // Get comment counts for each essay
    const essaysWithCounts = await Promise.all(
      essays.map(async (essay) => {
        const { count, error: countError } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .eq('essay_id', essay.id);
        
        if (countError) throw countError;
        
        return {
          ...essay,
          comment_count: count || 0
        };
      })
    );
    
    return essaysWithCounts;
  },
  
  // Fetch a single essay by slug
  async getEssayBySlug(slug) {
    const { data, error } = await supabase
      .from('essays')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Fetch comments for an essay
  async getComments(essayId) {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('essay_id', essayId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },
  
  // Add a new comment
  async addComment(commentData) {
    const { data, error } = await supabase
      .from('comments')
      .insert([commentData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // Get blog statistics
  async getBlogStats() {
    // Get essay count
    const { count: essayCount, error: essayError } = await supabase
      .from('essays')
      .select('*', { count: 'exact', head: true });
    
    if (essayError) throw essayError;
    
    // Get total comment count
    const { count: commentCount, error: commentError } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true });
    
    if (commentError) throw commentError;
    
    return {
      essaysPublished: essayCount || 0,
      totalComments: commentCount || 0,
      weeksRemaining: 52 - (essayCount || 0)
    };
  }
};
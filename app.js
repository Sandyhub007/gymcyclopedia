// Initialize Supabase client using configuration
const supabase = supabase.createClient(config.supabaseUrl, config.supabaseKey)

// DOM Elements
const loginForm = document.getElementById('login')
const signupForm = document.getElementById('signup')
const loginEmail = document.getElementById('login-email')
const loginPassword = document.getElementById('login-password')
const signupEmail = document.getElementById('signup-email')
const signupPassword = document.getElementById('signup-password')

// Handle Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: loginEmail.value,
            password: loginPassword.value,
        })

        if (error) throw error

        alert('Successfully logged in!')
        // Redirect or update UI as needed
    } catch (error) {
        alert(error.message)
    }
})

// Handle Sign Up
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    try {
        const { data, error } = await supabase.auth.signUp({
            email: signupEmail.value,
            password: signupPassword.value,
        })

        if (error) throw error

        alert('Check your email for the confirmation link!')
    } catch (error) {
        alert(error.message)
    }
})

// Workout Functions
async function addWorkout(exercise, reps, sets, notes) {
    try {
        const { data, error } = await supabase
            .from('workouts')
            .insert([
                {
                    exercise,
                    reps,
                    sets,
                    notes
                }
            ])
            .select()

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error adding workout:', error.message)
        throw error
    }
}

async function getWorkouts() {
    try {
        const { data, error } = await supabase
            .from('workouts')
            .select('*')
            .order('date', { ascending: false })

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error fetching workouts:', error.message)
        throw error
    }
}

// Storage Functions
async function uploadProgressImage(file) {
    try {
        // Create a unique file name using timestamp and original file name
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `${fileName}`

        // Upload the file to the progress-images bucket
        const { data, error } = await supabase.storage
            .from('progress-images')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            })

        if (error) throw error

        // Get the public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
            .from('progress-images')
            .getPublicUrl(filePath)

        return publicUrl
    } catch (error) {
        console.error('Error uploading image:', error.message)
        throw error
    }
}

async function deleteProgressImage(imageUrl) {
    try {
        // Extract the file path from the URL
        const filePath = imageUrl.split('/').pop()
        
        const { error } = await supabase.storage
            .from('progress-images')
            .remove([filePath])

        if (error) throw error
    } catch (error) {
        console.error('Error deleting image:', error.message)
        throw error
    }
}

// Updated Progress Functions
async function addProgress(weight, imageFile) {
    try {
        let imageUrl = null
        
        // Upload image if provided
        if (imageFile) {
            imageUrl = await uploadProgressImage(imageFile)
        }

        // Add progress record with image URL
        const { data, error } = await supabase
            .from('progress')
            .insert([
                {
                    weight,
                    image_url: imageUrl
                }
            ])
            .select()

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error adding progress:', error.message)
        throw error
    }
}

async function updateProgress(id, weight, imageFile) {
    try {
        let imageUrl = null
        
        // Get existing record
        const { data: existingRecord } = await supabase
            .from('progress')
            .select('image_url')
            .eq('id', id)
            .single()

        // If new image is provided, upload it and delete old one
        if (imageFile) {
            // Delete old image if exists
            if (existingRecord?.image_url) {
                await deleteProgressImage(existingRecord.image_url)
            }
            // Upload new image
            imageUrl = await uploadProgressImage(imageFile)
        }

        // Update progress record
        const { data, error } = await supabase
            .from('progress')
            .update({
                weight,
                image_url: imageUrl || existingRecord?.image_url
            })
            .eq('id', id)
            .select()

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error updating progress:', error.message)
        throw error
    }
}

async function deleteProgress(id) {
    try {
        // Get the record to delete
        const { data: record } = await supabase
            .from('progress')
            .select('image_url')
            .eq('id', id)
            .single()

        // Delete the image if it exists
        if (record?.image_url) {
            await deleteProgressImage(record.image_url)
        }

        // Delete the record
        const { error } = await supabase
            .from('progress')
            .delete()
            .eq('id', id)

        if (error) throw error
    } catch (error) {
        console.error('Error deleting progress:', error.message)
        throw error
    }
}

// Check authentication state
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
        console.log('User signed in:', session.user)
        // Update UI for logged-in state
    } else if (event === 'SIGNED_OUT') {
        console.log('User signed out')
        // Update UI for logged-out state
    }
})

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Gymcyclopedia app initialized');
    
    // Add a welcome message
    const header = document.querySelector('header h1');
    header.addEventListener('click', () => {
        alert('Welcome to Gymcyclopedia! Your ultimate fitness guide.');
    });
}); 
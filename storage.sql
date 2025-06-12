-- Create a new storage bucket for progress images
INSERT INTO storage.buckets (id, name, public)
VALUES ('progress-images', 'progress-images', true);

-- Set up storage policies for the progress-images bucket
CREATE POLICY "Allow authenticated users to upload progress images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'progress-images' AND
    auth.uid() = owner
);

CREATE POLICY "Allow authenticated users to update their own progress images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'progress-images' AND
    auth.uid() = owner
);

CREATE POLICY "Allow authenticated users to delete their own progress images"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'progress-images' AND
    auth.uid() = owner
);

CREATE POLICY "Allow public access to progress images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'progress-images'); 
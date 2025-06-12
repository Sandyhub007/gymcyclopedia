# Gymcyclopedia

A comprehensive fitness tracking application that helps users manage their workouts, track progress, and achieve their fitness goals.

## Features

- User authentication with email/password
- Workout tracking and management
- Progress tracking with image uploads
- Responsive design with Bootstrap
- Secure data storage with Supabase

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/gymcyclopedia.git
cd gymcyclopedia
```

2. Create a `config.js` file in the root directory with your Supabase credentials:
```javascript
const config = {
    supabaseUrl: 'YOUR_SUPABASE_URL',
    supabaseKey: 'YOUR_SUPABASE_ANON_KEY'
};
```

3. Open `index.html` in your browser or use a local server.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Bootstrap 5.3.3
- Supabase (Authentication, Database, Storage)

## Project Structure

```
gymcyclopedia/
├── index.html          # Main HTML file
├── styles.css          # Custom styles
├── app.js             # Main application logic
├── config.js          # Configuration (not tracked in git)
├── storage.sql        # Supabase storage setup
├── schema.sql         # Database schema
└── README.md          # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 